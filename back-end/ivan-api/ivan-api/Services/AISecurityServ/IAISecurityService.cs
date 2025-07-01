using ivan_api.DTOs;
using ivan_api.DTOs.AIDatabaseManage;
using ivan_api.Models;

namespace ivan_api.Services.AISecurityServ
{
    /// <summary>
    /// Service interface for AI security and authorization
    /// </summary>
    public interface IAISecurityService
    {
        // Role-based access control
        Task<bool> ValidateInstructionAccessAsync(int userId, int instructionId);
        Task<bool> CanUserCreateInstructionsAsync(int userId);
        Task<bool> CanUserModifyInstructionAsync(int userId, int instructionId);
        Task<bool> CanUserDeleteInstructionAsync(int userId, int instructionId);
        Task<List<string>> GetUserDataAccessPermissionsAsync(int userId);

        // Data access validation
        Task<bool> ValidateDataTableAccessAsync(int userId, string tableName);
        Task<bool> ValidateQueryPermissionsAsync(int userId, string query);
        Task<List<string>> GetAllowedDataTablesAsync(int userId);
        Task<DataAccessResultDTO> FilterSensitiveDataAsync(int userId, object data, string dataType);

        // Query sanitization and validation
        Task<QueryValidationResultDTO> ValidateAndSanitizeQueryAsync(string query, int userId);
        Task<string> SanitizeQueryParametersAsync(string query);
        Task<bool> IsQuerySafeAsync(string query);
        Task<List<SecurityRiskDTO>> AnalyzeQuerySecurityRisksAsync(string query);

        // Audit logging
        Task LogDataAccessAsync(int userId, string dataTable, string operation, bool success);
        Task LogInstructionUsageAsync(int userId, int instructionId, string query, bool success);
        Task LogSecurityEventAsync(int userId, string eventType, string details, string severity = "INFO");
        Task<List<SecurityAuditLogDTO>> GetSecurityAuditLogsAsync(int userId, DateTime? fromDate = null, DateTime? toDate = null);

        // Rate limiting and abuse prevention
        Task<bool> CheckRateLimitAsync(int userId, string operation);
        Task<RateLimitStatusDTO> GetRateLimitStatusAsync(int userId);
        Task ResetUserRateLimitAsync(int userId);
        Task<bool> IsUserBlockedAsync(int userId);

        // Content filtering
        Task<ContentFilterResultDTO> FilterAIResponseAsync(string response, int userId);
        Task<bool> ContainsSensitiveInformationAsync(string content);
        Task<string> RedactSensitiveDataAsync(string content);
        Task<List<string>> DetectPIIAsync(string content);

        // Permission management
        Task<UserPermissionsDTO> GetUserPermissionsAsync(int userId);
        Task UpdateUserPermissionsAsync(int userId, UserPermissionsDTO permissions);
        Task<bool> HasPermissionAsync(int userId, string permission);
        Task GrantPermissionAsync(int userId, string permission);
        Task RevokePermissionAsync(int userId, string permission);
    }
}
