using ivan_api.Services.AI.SQLGenerator.Utils;
using Microsoft.Extensions.Logging;

namespace ivan_api.Services.AI;

/// <summary>
/// Service for analyzing user queries to determine intent and requirements
/// Provides better detection and context for AI processing
/// </summary>
public class QueryAnalyzer
{
    private readonly SqlDetectionService _sqlDetectionService;
    private readonly ILogger<QueryAnalyzer> _logger;

    public QueryAnalyzer(
        SqlDetectionService sqlDetectionService,
        ILogger<QueryAnalyzer> logger)
    {
        _sqlDetectionService = sqlDetectionService;
        _logger = logger;
    }

    /// <summary>
    /// Simple query analysis focused on SQL detection for core AI mission
    /// </summary>
    /// <param name="query">User query to analyze</param>
    /// <returns>Query analysis result</returns>
    public async Task<QueryIntent> AnalyzeQueryAsync(string query)
    {
        try
        {
            // Core mission: Determine if this is a SQL query that needs database context
            var isSqlQuery = await _sqlDetectionService.IsSqlQueryAsync(query);
            
            var intent = new QueryIntent
            {
                OriginalQuery = query,
                QueryType = isSqlQuery ? QueryType.DataRetrieval : QueryType.General,
                IsSqlQuery = isSqlQuery,
                Confidence = isSqlQuery ? 0.8 : 0.6, // Higher confidence for SQL queries
                RequiredTables = new List<string>(),
                RequiredKeywords = new List<string>(),
                RequiredRelationships = new List<string>(),
                SuggestedActions = new List<string>()
            };

            // Only do detailed analysis for SQL queries (core mission)
            if (isSqlQuery)
            {
                intent.RequiredTables = await _sqlDetectionService.GetRelevantTableNamesAsync(query);
                intent.RequiredKeywords = await _sqlDetectionService.GetRelevantKeywordsAsync(query);
                intent.RequiredRelationships = await _sqlDetectionService.GetRelevantRelationshipsAsync(query, intent.RequiredTables);
                
                // Update confidence based on found context
                if (intent.RequiredTables.Any()) intent.Confidence += 0.1;
                if (intent.RequiredKeywords.Any()) intent.Confidence += 0.1;
                intent.Confidence = Math.Min(intent.Confidence, 1.0);
            }

            return intent;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing query: {Query}", query);
            return new QueryIntent
            {
                OriginalQuery = query,
                QueryType = QueryType.Unknown,
                IsSqlQuery = false,
                Confidence = 0.0,
                ErrorMessage = "Error analyzing query"
            };
        }
    }

}

/// <summary>
/// Result of query analysis
/// </summary>
public class QueryIntent
{
    public string OriginalQuery { get; set; } = "";
    public QueryType QueryType { get; set; }
    public bool IsSqlQuery { get; set; }
    public double Confidence { get; set; }
    public List<string> RequiredTables { get; set; } = new();
    public List<string> RequiredKeywords { get; set; } = new();
    public List<string> RequiredRelationships { get; set; } = new();
    public List<string> SuggestedActions { get; set; } = new();
    public string? ErrorMessage { get; set; }
}

/// <summary>
/// Simplified query types focused on core AI mission
/// </summary>
public enum QueryType
{
    Unknown,
    DataRetrieval, // SQL queries that need database data
    General        // Regular AI conversation
}