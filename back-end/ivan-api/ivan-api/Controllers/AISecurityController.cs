using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs;
using ivan_api.DTOs.AIDatabaseManage;
using ivan_api.Services.AISecurityServ;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    /// <summary>
    /// Controller for AI security, audit logging, and access control
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AISecurityController : ControllerBase
    {
        private readonly IAISecurityService _securityService;
        private readonly ILogger<AISecurityController> _logger;

        public AISecurityController(
            IAISecurityService securityService,
            ILogger<AISecurityController> logger)
        {
            _securityService = securityService;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId) ? userId : 0;
        }

        #region Access Control & Permissions

        /// <summary>
        /// Check if user can access a specific instruction
        /// </summary>
        [HttpGet("instructions/{instructionId}/access")]
        public async Task<ActionResult<bool>> ValidateInstructionAccess(int instructionId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var hasAccess = await _securityService.ValidateInstructionAccessAsync(userId, instructionId);
                return Ok(hasAccess);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating instruction access");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get user's data access permissions
        /// </summary>
        [HttpGet("permissions/data-access")]
        public async Task<ActionResult<List<string>>> GetDataAccessPermissions()
        {
            try
            {
                var userId = GetCurrentUserId();
                var permissions = await _securityService.GetUserDataAccessPermissionsAsync(userId);
                return Ok(permissions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting data access permissions");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get comprehensive user permissions
        /// </summary>
        [HttpGet("permissions/user")]
        public async Task<ActionResult<UserPermissionsDTO>> GetUserPermissions()
        {
            try
            {
                var userId = GetCurrentUserId();
                var permissions = await _securityService.GetUserPermissionsAsync(userId);
                return Ok(permissions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user permissions");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Check if user has specific permission
        /// </summary>
        [HttpGet("permissions/check/{permission}")]
        public async Task<ActionResult<bool>> HasPermission(string permission)
        {
            try
            {
                var userId = GetCurrentUserId();
                var hasPermission = await _securityService.HasPermissionAsync(userId, permission);
                return Ok(hasPermission);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking permission");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region Query Validation & Security

        /// <summary>
        /// Validate and sanitize a query
        /// </summary>
        [HttpPost("validate-query")]
        public async Task<ActionResult<QueryValidationResultDTO>> ValidateQuery([FromBody] string query)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _securityService.ValidateAndSanitizeQueryAsync(query, userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating query");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Analyze query for security risks
        /// </summary>
        [HttpPost("analyze-query-risks")]
        public async Task<ActionResult<List<SecurityRiskDTO>>> AnalyzeQuerySecurityRisks([FromBody] string query)
        {
            try
            {
                var risks = await _securityService.AnalyzeQuerySecurityRisksAsync(query);
                return Ok(risks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error analyzing query security risks");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Check if query is safe to execute
        /// </summary>
        [HttpPost("query-safety-check")]
        public async Task<ActionResult<bool>> IsQuerySafe([FromBody] string query)
        {
            try
            {
                var isSafe = await _securityService.IsQuerySafeAsync(query);
                return Ok(isSafe);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking query safety");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region Data Filtering & Privacy

        /// <summary>
        /// Filter sensitive data for user access
        /// </summary>
        [HttpPost("filter-sensitive-data")]
        public async Task<ActionResult<DataAccessResultDTO>> FilterSensitiveData([FromBody] object data, [FromQuery] string dataType)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _securityService.FilterSensitiveDataAsync(userId, data, dataType);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error filtering sensitive data");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Check if content contains sensitive information
        /// </summary>
        [HttpPost("check-sensitive-content")]
        public async Task<ActionResult<bool>> ContainsSensitiveInformation([FromBody] string content)
        {
            try
            {
                var hasSensitiveData = await _securityService.ContainsSensitiveInformationAsync(content);
                return Ok(hasSensitiveData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking sensitive content");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Redact sensitive data from content
        /// </summary>
        [HttpPost("redact-sensitive-data")]
        public async Task<ActionResult<string>> RedactSensitiveData([FromBody] string content)
        {
            try
            {
                var redactedContent = await _securityService.RedactSensitiveDataAsync(content);
                return Ok(redactedContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error redacting sensitive data");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Detect types of PII in content
        /// </summary>
        [HttpPost("detect-pii")]
        public async Task<ActionResult<List<string>>> DetectPII([FromBody] string content)
        {
            try
            {
                var piiTypes = await _securityService.DetectPIIAsync(content);
                return Ok(piiTypes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error detecting PII");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region Rate Limiting & Abuse Prevention

        /// <summary>
        /// Check rate limit status for user
        /// </summary>
        [HttpGet("rate-limit/status")]
        public async Task<ActionResult<RateLimitStatusDTO>> GetRateLimitStatus()
        {
            try
            {
                var userId = GetCurrentUserId();
                var status = await _securityService.GetRateLimitStatusAsync(userId);
                return Ok(status);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting rate limit status");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Check if operation is rate limited
        /// </summary>
        [HttpGet("rate-limit/check/{operation}")]
        public async Task<ActionResult<bool>> CheckRateLimit(string operation)
        {
            try
            {
                var userId = GetCurrentUserId();
                var allowed = await _securityService.CheckRateLimitAsync(userId, operation);
                return Ok(allowed);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking rate limit");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Reset rate limits for user (Admin only)
        /// </summary>
        [HttpPost("rate-limit/reset/{targetUserId}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> ResetUserRateLimit(int targetUserId)
        {
            try
            {
                await _securityService.ResetUserRateLimitAsync(targetUserId);
                return Ok(new { message = "Rate limit reset successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resetting rate limit");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Check if user is blocked
        /// </summary>
        [HttpGet("user-blocked")]
        public async Task<ActionResult<bool>> IsUserBlocked()
        {
            try
            {
                var userId = GetCurrentUserId();
                var isBlocked = await _securityService.IsUserBlockedAsync(userId);
                return Ok(isBlocked);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking if user is blocked");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region Audit Logging

        /// <summary>
        /// Get security audit logs
        /// </summary>
        [HttpGet("audit-logs")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<List<SecurityAuditLogDTO>>> GetSecurityAuditLogs(
            [FromQuery] int? userId = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var logs = await _securityService.GetSecurityAuditLogsAsync(userId ?? 0, fromDate, toDate);
                return Ok(logs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting security audit logs");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Log a security event (Admin only)
        /// </summary>
        [HttpPost("audit-logs/log-event")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> LogSecurityEvent([FromBody] SecurityEventRequestDTO request)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _securityService.LogSecurityEventAsync(userId, request.EventType, request.Details, request.Severity);
                return Ok(new { message = "Security event logged successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging security event");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Log data access event
        /// </summary>
        [HttpPost("audit-logs/data-access")]
        public async Task<ActionResult> LogDataAccess([FromBody] DataAccessLogRequestDTO request)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _securityService.LogDataAccessAsync(userId, request.DataTable, request.Operation, request.Success);
                return Ok(new { message = "Data access logged successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging data access");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region Content Filtering

        /// <summary>
        /// Filter AI response for sensitive content
        /// </summary>
        [HttpPost("filter-ai-response")]
        public async Task<ActionResult<ContentFilterResultDTO>> FilterAIResponse([FromBody] string response)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _securityService.FilterAIResponseAsync(response, userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error filtering AI response");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region Permission Management (Admin Only)

        /// <summary>
        /// Update user permissions (Admin only)
        /// </summary>
        [HttpPut("permissions/user/{targetUserId}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> UpdateUserPermissions(int targetUserId, [FromBody] UserPermissionsDTO permissions)
        {
            try
            {
                await _securityService.UpdateUserPermissionsAsync(targetUserId, permissions);
                return Ok(new { message = "User permissions updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user permissions");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Grant permission to user (Admin only)
        /// </summary>
        [HttpPost("permissions/grant/{targetUserId}/{permission}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> GrantPermission(int targetUserId, string permission)
        {
            try
            {
                await _securityService.GrantPermissionAsync(targetUserId, permission);
                return Ok(new { message = "Permission granted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error granting permission");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Revoke permission from user (Admin only)
        /// </summary>
        [HttpDelete("permissions/revoke/{targetUserId}/{permission}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> RevokePermission(int targetUserId, string permission)
        {
            try
            {
                await _securityService.RevokePermissionAsync(targetUserId, permission);
                return Ok(new { message = "Permission revoked successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error revoking permission");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion
    }

    // Request DTOs for security controller
    public class SecurityEventRequestDTO
    {
        public string EventType { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
        public string Severity { get; set; } = "INFO";
    }

    public class DataAccessLogRequestDTO
    {
        public string DataTable { get; set; } = string.Empty;
        public string Operation { get; set; } = string.Empty;
        public bool Success { get; set; } = true;
    }
}
