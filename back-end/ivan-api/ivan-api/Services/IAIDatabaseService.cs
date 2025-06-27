using ivan_api.DTOs;

namespace ivan_api.Services;

public interface IAIDatabaseService
{
    // Core database access methods
    Task<AIDatabaseResponseDTO> GetContextualDataAsync(QueryAnalysisDTO queryAnalysis);
    Task<DatabaseSummaryDTO> GetRelevantDataAsync(string queryCategory);
    Task<string> FormatDataForAIAsync(object data, string format = "natural");

    // Volunteer analytics
    Task<AIDatabaseResponseDTO> GetVolunteerAnalyticsAsync(string query, Dictionary<string, object>? parameters = null);
    Task<AIDatabaseResponseDTO> GetEventPerformanceAsync(string query, Dictionary<string, object>? parameters = null);
    Task<AIDatabaseResponseDTO> GetPartnerInsightsAsync(string query, Dictionary<string, object>? parameters = null);
    Task<AIDatabaseResponseDTO> GetTrendAnalysisAsync(string query, Dictionary<string, object>? parameters = null);

    // Data relationship helpers
    Task<List<string>> GetRelatedTablesAsync(List<string> baseTables);
    Task<Dictionary<string, object>> GetDataSummaryAsync(List<string> tableNames);

    // Query execution tracking
    Task LogQueryExecutionAsync(int userId, string query, string tablesAccessed, int executionTime, int? instructionId = null);
}
