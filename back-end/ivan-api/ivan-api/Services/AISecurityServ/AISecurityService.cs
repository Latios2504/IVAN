using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using ivan_api.DTOs;
using ivan_api.DTOs.AIDatabaseManage;
using ivan_api.Models;
using System.Text.RegularExpressions;
using System.Text.Json;

namespace ivan_api.Services.AISecurityServ
{
    /// <summary>
    /// AI Security Service implementation for authorization, validation, and audit logging
    /// </summary>
    public class AISecurityService : IAISecurityService
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<AISecurityService> _logger;
        private readonly TimeSpan _cacheExpiration = TimeSpan.FromMinutes(15);
        
        // Helper method to get user with role
        private async Task<User?> GetUserWithRoleAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }
        
        // Helper method to check if user has admin role
        private bool IsAdmin(User user)
        {
            return user.Role.RoleName == "Admin" || user.Role.RoleName == "SuperAdmin";
        }
        
        // Helper method to check if user is super admin
        private bool IsSuperAdmin(User user)
        {
            return user.Role.RoleName == "SuperAdmin";
        }
        
        // Rate limiting configuration
        private readonly Dictionary<string, (int limit, TimeSpan window)> _rateLimits = new()
        {
            { "query", (100, TimeSpan.FromHours(1)) },
            { "instruction_create", (10, TimeSpan.FromHours(1)) },
            { "instruction_modify", (50, TimeSpan.FromHours(1)) },
            { "data_access", (500, TimeSpan.FromHours(1)) }
        };

        // Sensitive data patterns
        private readonly List<Regex> _piiPatterns = new()
        {
            new Regex(@"\b\d{3}-\d{2}-\d{4}\b", RegexOptions.Compiled), // SSN
            new Regex(@"\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b", RegexOptions.Compiled), // Credit Card
            new Regex(@"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", RegexOptions.Compiled), // Email
            new Regex(@"\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b", RegexOptions.Compiled), // Phone
            new Regex(@"\b\d{1,2}\/\d{1,2}\/\d{4}\b", RegexOptions.Compiled) // Date of birth
        };

        public AISecurityService(
            VolunteerManagementSystemContext context,
            IMemoryCache cache,
            ILogger<AISecurityService> logger)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
        }

        #region Role-based Access Control

        public async Task<bool> ValidateInstructionAccessAsync(int userId, int instructionId)
        {
            try
            {
                var instruction = await _context.AiCustomInstructions
                    .FirstOrDefaultAsync(i => i.InstructionId == instructionId);
                
                if (instruction == null) return false;

                var user = await _context.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.UserId == userId);
                if (user == null) return false;

                // Admin can access all instructions
                if (user.Role.RoleName == "Admin" || user.Role.RoleName == "SuperAdmin") return true;

                // Users can only access their own instructions or public ones
                return instruction.CreatedByUserId == userId || instruction.IsDefault == true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating instruction access for user {UserId}, instruction {InstructionId}", userId, instructionId);
                await LogSecurityEventAsync(userId, "ACCESS_VALIDATION_ERROR", ex.Message, "ERROR");
                return false;
            }
        }

        public async Task<bool> CanUserCreateInstructionsAsync(int userId)
        {
            var permissions = await GetUserPermissionsAsync(userId);
            return permissions.CanCreateInstructions && await CheckRateLimitAsync(userId, "instruction_create");
        }

        public async Task<bool> CanUserModifyInstructionAsync(int userId, int instructionId)
        {
            if (!await ValidateInstructionAccessAsync(userId, instructionId)) return false;
            
            var instruction = await _context.AiCustomInstructions.FindAsync(instructionId);
            var user = await GetUserWithRoleAsync(userId);
            
            if (user == null) return false;
            
            // Admin can modify all, users can only modify their own
            return IsAdmin(user) || instruction?.CreatedByUserId == userId;
        }

        public async Task<bool> CanUserDeleteInstructionAsync(int userId, int instructionId)
        {
            var instruction = await _context.AiCustomInstructions.FindAsync(instructionId);
            if (instruction == null || instruction.IsDefault == true) return false; // Cannot delete default instructions
            
            return await CanUserModifyInstructionAsync(userId, instructionId);
        }

        public async Task<List<string>> GetUserDataAccessPermissionsAsync(int userId)
        {
            var cacheKey = $"user_data_permissions_{userId}";
            if (_cache.TryGetValue(cacheKey, out List<string>? cachedPermissions))
                return cachedPermissions ?? new List<string>();

            var user = await GetUserWithRoleAsync(userId);
            var permissions = new List<string>();

            if (user != null)
            {
                switch (user.Role.RoleName)
                {
                    case "SuperAdmin":
                    case "Admin":
                        permissions.AddRange(new[] {
                            "Users", "VolunteerProfiles", "Events", "EventRegistrations",
                            "Organizations", "Partners", "AiCustomInstructions", "AiQueryAnalytics"
                        });
                        break;
                    case "Volunteer":
                        permissions.AddRange(new[] { "Events", "EventRegistrations" });
                        break;
                    case "Organization":
                        permissions.AddRange(new[] { "Events", "EventRegistrations", "VolunteerProfiles" });
                        break;
                }
            }

            _cache.Set(cacheKey, permissions, _cacheExpiration);
            return permissions;
        }

        #endregion

        #region Data Access Validation

        public async Task<bool> ValidateDataTableAccessAsync(int userId, string tableName)
        {
            var allowedTables = await GetAllowedDataTablesAsync(userId);
            return allowedTables.Contains(tableName, StringComparer.OrdinalIgnoreCase);
        }

        public async Task<bool> ValidateQueryPermissionsAsync(int userId, string query)
        {
            var validation = await ValidateAndSanitizeQueryAsync(query, userId);
            return validation.IsValid && !validation.HasSecurityRisks;
        }

        public async Task<List<string>> GetAllowedDataTablesAsync(int userId)
        {
            return await GetUserDataAccessPermissionsAsync(userId);
        }

        public async Task<DataAccessResultDTO> FilterSensitiveDataAsync(int userId, object data, string dataType)
        {
            try
            {
                var result = new DataAccessResultDTO
                {
                    OriginalData = data,
                    FilteredData = data,
                    SensitiveDataDetected = false,
                    RedactedFields = new List<string>()
                };

                var user = await GetUserWithRoleAsync(userId);
                if (user != null && IsSuperAdmin(user)) return result; // SuperAdmin sees all data

                var jsonData = JsonSerializer.Serialize(data);
                var hasPII = await ContainsSensitiveInformationAsync(jsonData);

                if (hasPII)
                {
                    result.SensitiveDataDetected = true;
                    var redactedJson = await RedactSensitiveDataAsync(jsonData);
                    result.FilteredData = JsonSerializer.Deserialize<object>(redactedJson) ?? new object();
                    result.RedactedFields = await DetectPIIAsync(jsonData);
                }

                await LogDataAccessAsync(userId, dataType, "FILTER_SENSITIVE_DATA", true);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error filtering sensitive data for user {UserId}", userId);
                await LogSecurityEventAsync(userId, "DATA_FILTER_ERROR", ex.Message, "ERROR");
                throw;
            }
        }

        #endregion

        #region Query Sanitization and Validation

        public async Task<QueryValidationResultDTO> ValidateAndSanitizeQueryAsync(string query, int userId)
        {
            var result = new QueryValidationResultDTO
            {
                OriginalQuery = query,
                SanitizedQuery = await SanitizeQueryParametersAsync(query),
                IsValid = true,
                HasSecurityRisks = false,
                SecurityRisks = new List<SecurityRiskDTO>(),
                Warnings = new List<string>()
            };

            // Check for SQL injection patterns
            var sqlInjectionPatterns = new[]
            {
                @"('|(\\')|(;|%3b)|(--|\*|\*)|(\|)|(\%27)|(\%7C)", // SQL injection
                @"((\%3D)|(=))[^\n]*((\%27)|(')|((\%3C)|<))", // XSS
                @"((union(.*?)select)|(union(.*?)all(.*?)select))", // Union attacks
                @"(select|insert|update|delete|drop|create|alter|exec|execute)", // SQL commands
            };

            foreach (var pattern in sqlInjectionPatterns)
            {
                if (Regex.IsMatch(query, pattern, RegexOptions.IgnoreCase))
                {
                    result.HasSecurityRisks = true;
                    result.SecurityRisks.Add(new SecurityRiskDTO
                    {
                        Type = "SQL_INJECTION_RISK",
                        Severity = "HIGH",
                        Description = "Query contains potential SQL injection patterns",
                        Pattern = pattern
                    });
                }
            }

            // Validate user permissions for detected table access
            var tableMatches = Regex.Matches(query, @"\b(Users|VolunteerProfiles|Events|Organizations|Partners)\b", RegexOptions.IgnoreCase);
            foreach (Match match in tableMatches)
            {
                if (!await ValidateDataTableAccessAsync(userId, match.Value))
                {
                    result.IsValid = false;
                    result.Warnings.Add($"Insufficient permissions to access table: {match.Value}");
                }
            }

            await LogSecurityEventAsync(userId, "QUERY_VALIDATION", $"Query validated. Valid: {result.IsValid}, Risks: {result.HasSecurityRisks}");
            return result;
        }

        public async Task<string> SanitizeQueryParametersAsync(string query)
        {
            // Remove potentially dangerous characters and patterns
            var sanitized = query
                .Replace("'", "''") // Escape single quotes
                .Replace("--", "") // Remove SQL comments
                .Replace("/*", "").Replace("*/", "") // Remove block comments
                .Replace(";", "") // Remove statement terminators
                .Replace("xp_", "").Replace("sp_", ""); // Remove stored procedure calls

            return await Task.FromResult(sanitized);
        }

        public async Task<bool> IsQuerySafeAsync(string query)
        {
            var validation = await ValidateAndSanitizeQueryAsync(query, 0); // System validation
            return validation.IsValid && !validation.HasSecurityRisks;
        }

        public async Task<List<SecurityRiskDTO>> AnalyzeQuerySecurityRisksAsync(string query)
        {
            var validation = await ValidateAndSanitizeQueryAsync(query, 0);
            return validation.SecurityRisks;
        }

        #endregion

        #region Audit Logging

        public async Task LogDataAccessAsync(int userId, string dataTable, string operation, bool success)
        {
            try
            {
                var auditLog = new AiSecurityAuditLog
                {
                    UserId = userId,
                    EventType = "DATA_ACCESS",
                    Details = JsonSerializer.Serialize(new { DataTable = dataTable, Operation = operation, Success = success }),
                    Severity = success ? "INFO" : "WARNING",
                    IpAddress = "System", // Could be enhanced with actual IP
                    UserAgent = "AI_System",
                    CreatedAt = DateTime.UtcNow
                };

                _context.AiSecurityAuditLogs.Add(auditLog);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging data access for user {UserId}", userId);
            }
        }

        public async Task LogInstructionUsageAsync(int userId, int instructionId, string query, bool success)
        {
            try
            {
                var auditLog = new AiSecurityAuditLog
                {
                    UserId = userId,
                    EventType = "INSTRUCTION_USAGE",
                    Details = JsonSerializer.Serialize(new { InstructionId = instructionId, Query = query.Substring(0, Math.Min(query.Length, 500)), Success = success }),
                    Severity = success ? "INFO" : "WARNING",
                    CreatedAt = DateTime.UtcNow
                };

                _context.AiSecurityAuditLogs.Add(auditLog);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging instruction usage for user {UserId}", userId);
            }
        }

        public async Task LogSecurityEventAsync(int userId, string eventType, string details, string severity = "INFO")
        {
            try
            {
                var auditLog = new AiSecurityAuditLog
                {
                    UserId = userId,
                    EventType = eventType,
                    Details = details,
                    Severity = severity,
                    CreatedAt = DateTime.UtcNow
                };

                _context.AiSecurityAuditLogs.Add(auditLog);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Security event logged: {EventType} for user {UserId}", eventType, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging security event for user {UserId}", userId);
            }
        }

        public async Task<List<SecurityAuditLogDTO>> GetSecurityAuditLogsAsync(int userId, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = _context.AiSecurityAuditLogs.AsQueryable();

            if (userId > 0)
                query = query.Where(log => log.UserId == userId);

            if (fromDate.HasValue)
                query = query.Where(log => log.CreatedAt >= fromDate.Value);

            if (toDate.HasValue)
                query = query.Where(log => log.CreatedAt <= toDate.Value);

            var logs = await query
                .OrderByDescending(log => log.CreatedAt)
                .Take(1000) // Limit results
                .ToListAsync();

            return logs.Select(log => new SecurityAuditLogDTO
            {
                LogId = log.LogId,
                UserId = log.UserId,
                EventType = log.EventType,
                Details = log.Details,
                Severity = log.Severity,
                IpAddress = log.IpAddress,
                UserAgent = log.UserAgent,
                CreatedAt = log.CreatedAt
            }).ToList();
        }

        #endregion

        #region Rate Limiting and Abuse Prevention

        public async Task<bool> CheckRateLimitAsync(int userId, string operation)
        {
            if (!_rateLimits.TryGetValue(operation, out var limit)) return true;

            var cacheKey = $"rate_limit_{userId}_{operation}";
            var currentCount = await GetCurrentRateLimitCountAsync(cacheKey);

            if (currentCount >= limit.limit)
            {
                await LogSecurityEventAsync(userId, "RATE_LIMIT_EXCEEDED", $"Operation: {operation}, Limit: {limit.limit}", "WARNING");
                return false;
            }

            await IncrementRateLimitCountAsync(cacheKey, limit.window);
            return true;
        }

        public async Task<RateLimitStatusDTO> GetRateLimitStatusAsync(int userId)
        {
            var status = new RateLimitStatusDTO
            {
                UserId = userId,
                Limits = new Dictionary<string, RateLimitDetailDTO>()
            };

            foreach (var (operation, (limitCount, window)) in _rateLimits)
            {
                var cacheKey = $"rate_limit_{userId}_{operation}";
                var currentCount = await GetCurrentRateLimitCountAsync(cacheKey);

                status.Limits[operation] = new RateLimitDetailDTO
                {
                    Operation = operation,
                    Current = currentCount,
                    Limit = limitCount,
                    WindowMinutes = (int)window.TotalMinutes,
                    RemainingRequests = Math.Max(0, limitCount - currentCount)
                };
            }

            return status;
        }

        public async Task ResetUserRateLimitAsync(int userId)
        {
            foreach (var operation in _rateLimits.Keys)
            {
                var cacheKey = $"rate_limit_{userId}_{operation}";
                _cache.Remove(cacheKey);
            }

            await LogSecurityEventAsync(userId, "RATE_LIMIT_RESET", "Rate limits reset by admin", "INFO");
        }

        public async Task<bool> IsUserBlockedAsync(int userId)
        {
            var recentSecurityEvents = await _context.AiSecurityAuditLogs
                .Where(log => log.UserId == userId && 
                             log.CreatedAt >= DateTime.UtcNow.AddHours(-24) &&
                             log.Severity == "HIGH")
                .CountAsync();

            return recentSecurityEvents >= 10; // Block after 10 high-severity events in 24h
        }

        private async Task<int> GetCurrentRateLimitCountAsync(string cacheKey)
        {
            return await Task.FromResult(_cache.TryGetValue(cacheKey, out int count) ? count : 0);
        }

        private async Task IncrementRateLimitCountAsync(string cacheKey, TimeSpan window)
        {
            var currentCount = await GetCurrentRateLimitCountAsync(cacheKey);
            _cache.Set(cacheKey, currentCount + 1, window);
        }

        #endregion

        #region Content Filtering

        public async Task<ContentFilterResultDTO> FilterAIResponseAsync(string response, int userId)
        {
            var result = new ContentFilterResultDTO
            {
                OriginalResponse = response,
                FilteredResponse = response,
                ContainsSensitiveData = false,
                RedactedElements = new List<string>()
            };

            if (await ContainsSensitiveInformationAsync(response))
            {
                result.ContainsSensitiveData = true;
                result.FilteredResponse = await RedactSensitiveDataAsync(response);
                result.RedactedElements = await DetectPIIAsync(response);
            }

            await LogSecurityEventAsync(userId, "CONTENT_FILTER", $"Response filtered. Sensitive data: {result.ContainsSensitiveData}");
            return result;
        }

        public async Task<bool> ContainsSensitiveInformationAsync(string content)
        {
            return await Task.FromResult(_piiPatterns.Any(pattern => pattern.IsMatch(content)));
        }

        public async Task<string> RedactSensitiveDataAsync(string content)
        {
            var redacted = content;
            
            foreach (var pattern in _piiPatterns)
            {
                redacted = pattern.Replace(redacted, "[REDACTED]");
            }

            return await Task.FromResult(redacted);
        }

        public async Task<List<string>> DetectPIIAsync(string content)
        {
            var detectedTypes = new List<string>();

            if (_piiPatterns[0].IsMatch(content)) detectedTypes.Add("SSN");
            if (_piiPatterns[1].IsMatch(content)) detectedTypes.Add("Credit Card");
            if (_piiPatterns[2].IsMatch(content)) detectedTypes.Add("Email");
            if (_piiPatterns[3].IsMatch(content)) detectedTypes.Add("Phone Number");
            if (_piiPatterns[4].IsMatch(content)) detectedTypes.Add("Date of Birth");

            return await Task.FromResult(detectedTypes);
        }

        #endregion

        #region Permission Management

        public async Task<UserPermissionsDTO> GetUserPermissionsAsync(int userId)
        {
            var cacheKey = $"user_permissions_{userId}";
            if (_cache.TryGetValue(cacheKey, out UserPermissionsDTO? cachedPermissions))
                return cachedPermissions ?? new UserPermissionsDTO();

            var user = await GetUserWithRoleAsync(userId);
            var permissions = new UserPermissionsDTO
            {
                UserId = userId,
                CanCreateInstructions = false,
                CanModifyInstructions = false,
                CanDeleteInstructions = false,
                CanAccessAllData = false,
                CanViewAuditLogs = false,
                AllowedDataTables = new List<string>(),
                MaxQueriesPerHour = 50
            };

            if (user != null)
            {
                switch (user.Role.RoleName)
                {
                    case "SuperAdmin":
                        permissions.CanCreateInstructions = true;
                        permissions.CanModifyInstructions = true;
                        permissions.CanDeleteInstructions = true;
                        permissions.CanAccessAllData = true;
                        permissions.CanViewAuditLogs = true;
                        permissions.MaxQueriesPerHour = 1000;
                        break;
                    case "Admin":
                        permissions.CanCreateInstructions = true;
                        permissions.CanModifyInstructions = true;
                        permissions.CanDeleteInstructions = true;
                        permissions.CanViewAuditLogs = true;
                        permissions.MaxQueriesPerHour = 500;
                        break;
                    case "Organization":
                        permissions.CanCreateInstructions = true;
                        permissions.MaxQueriesPerHour = 200;
                        break;
                    case "Volunteer":
                        permissions.MaxQueriesPerHour = 100;
                        break;
                }

                permissions.AllowedDataTables = await GetUserDataAccessPermissionsAsync(userId);
            }

            _cache.Set(cacheKey, permissions, _cacheExpiration);
            return permissions;
        }

        public async Task UpdateUserPermissionsAsync(int userId, UserPermissionsDTO permissions)
        {
            // This would typically update a UserPermissions table
            // For now, we'll just clear the cache to force reload
            var cacheKey = $"user_permissions_{userId}";
            _cache.Remove(cacheKey);

            await LogSecurityEventAsync(userId, "PERMISSIONS_UPDATED", "User permissions updated by admin", "INFO");
        }

        public async Task<bool> HasPermissionAsync(int userId, string permission)
        {
            var permissions = await GetUserPermissionsAsync(userId);
            
            return permission.ToLower() switch
            {
                "create_instructions" => permissions.CanCreateInstructions,
                "modify_instructions" => permissions.CanModifyInstructions,
                "delete_instructions" => permissions.CanDeleteInstructions,
                "access_all_data" => permissions.CanAccessAllData,
                "view_audit_logs" => permissions.CanViewAuditLogs,
                _ => false
            };
        }

        public async Task GrantPermissionAsync(int userId, string permission)
        {
            await LogSecurityEventAsync(userId, "PERMISSION_GRANTED", $"Permission granted: {permission}", "INFO");
            // Implementation would update permissions in database
        }

        public async Task RevokePermissionAsync(int userId, string permission)
        {
            await LogSecurityEventAsync(userId, "PERMISSION_REVOKED", $"Permission revoked: {permission}", "WARNING");
            // Implementation would update permissions in database
        }

        #endregion
    }
}
