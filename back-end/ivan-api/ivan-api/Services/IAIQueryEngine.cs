using ivan_api.DTOs;

namespace ivan_api.Services;

public interface IAIQueryEngine
{
    // Query analysis and categorization
    Task<QueryAnalysisDTO> AnalyzeQueryAsync(string naturalLanguageQuery);
    Task<AIDatabaseResponseDTO> ProcessNaturalQueryAsync(string query, int userId, string? instructionProfile = null);
    
    // Query categorization
    Task<string> CategorizeQueryAsync(string query);
    Task<List<string>> GetRequiredTablesAsync(string queryCategory, string specificQuery);
    
    // Query complexity analysis
    Task<string> EstimateQueryComplexityAsync(string query);
    Task<Dictionary<string, object>> ExtractQueryParametersAsync(string query);
    
    // Query optimization
    Task<string> OptimizeQueryForDatabaseAsync(string naturalQuery, string category);
    Task<bool> ValidateQuerySafetyAsync(string query);
    
    // Context building
    Task<string> BuildQueryContextAsync(QueryAnalysisDTO analysis, DatabaseSummaryDTO? existingData = null);
    
    // Phase 3: Enhanced Natural Language Processing
    Task<AIQueryResultDTO> ProcessAdvancedQueryAsync(string query, int userId, int? instructionId = null);
    Task<List<SuggestedQueryDTO>> GetQuerySuggestionsAsync(string partialQuery, string category);
    Task<QueryOptimizationDTO> OptimizeQueryPerformanceAsync(QueryAnalysisDTO analysis);
    
    // Phase 3: Smart Data Relationships
    Task<List<string>> ResolveDataRelationshipsAsync(List<string> baseTables);
    Task<DataSummaryDTO> GetIntelligentDataSummaryAsync(string queryCategory, Dictionary<string, object> filters);
    
    // Phase 3: Real-time Analytics
    Task<TrendAnalysisDTO> GenerateTrendAnalysisAsync(string metric, TimeSpan period);
    Task<List<InsightDTO>> GenerateProactiveInsightsAsync(int userId);
    
    // Phase 3: Privacy & Security
    Task<bool> ValidateDataAccessPermissionsAsync(int userId, List<string> requestedTables);
    Task<string> ApplyPrivacyFiltersAsync(string dataResult, int userId);
}
