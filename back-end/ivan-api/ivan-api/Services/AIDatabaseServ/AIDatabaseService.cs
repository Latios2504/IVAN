using System.Text;
using Microsoft.EntityFrameworkCore;
using ivan_api.DTOs.AIDatabaseManage;
using ivan_api.Models;
using ivan_api.Services.AIQueryServ;

namespace ivan_api.Services.AIDatabaseServ;

public class AIDatabaseService : IAIDatabaseService
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly ILogger<AIDatabaseService> _logger;
    private readonly IntelligentSQLGenerator _intelligentSQLGenerator;

    public AIDatabaseService(
        VolunteerManagementSystemContext context, 
        ILogger<AIDatabaseService> logger, 
        IntelligentSQLGenerator intelligentSQLGenerator)
    {
        _context = context;
        _logger = logger;
        _intelligentSQLGenerator = intelligentSQLGenerator;
    }

    public async Task<AIDatabaseResponseDTO> GetContextualDataAsync(QueryAnalysisDTO queryAnalysis)
    {
        var startTime = DateTime.UtcNow;
        
        try
        {
            // **100% PURE AI SYSTEM - NO MORE MANUAL CATEGORIES**
            _logger.LogInformation("Processing query with PURE AI: '{Query}'", queryAnalysis.OriginalQuery);
            
            var aiResponse = await _intelligentSQLGenerator.ProcessIntelligentQueryAsync(queryAnalysis.OriginalQuery);
            
            var executionTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;

            return new AIDatabaseResponseDTO
            {
                Success = true,
                Data = aiResponse,
                QueryCategory = "AI-Generated", // Pure AI response
                TablesAccessed = "AI-Determined", // AI decides which tables to use
                ExecutionTimeMs = executionTime,
                ErrorMessage = null
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in Pure AI Database Service for query: '{Query}'", queryAnalysis.OriginalQuery);
            
            var executionTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;
            
            return new AIDatabaseResponseDTO
            {
                Success = false,
                Data = null,
                QueryCategory = "AI-Error",
                TablesAccessed = "None",
                ExecutionTimeMs = executionTime,
                ErrorMessage = $"Có lỗi xảy ra khi xử lý câu hỏi: {ex.Message}"
            };
        }
    }

    public Task<DatabaseSummaryDTO> GetRelevantDataAsync(string queryCategory)
    {
        // Deprecated - Pure AI handles all data access automatically
        var result = new DatabaseSummaryDTO
        {
            Summary = "Pure AI system handles all data access automatically",
            Data = new Dictionary<string, object> { ["message"] = "AI-Generated responses only" },
            TablesIncluded = new List<string> { "AI-Determined" },
            GeneratedAt = DateTime.UtcNow
        };
        return Task.FromResult(result);
    }

    public Task<string> FormatDataForAIAsync(object data, string format = "natural")
    {
        try
        {
            // This method is deprecated in Pure AI system
            // AI handles all formatting internally
            return Task.FromResult(data?.ToString() ?? "Không có dữ liệu");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error formatting data for AI");
            return Task.FromResult("Lỗi định dạng dữ liệu");
        }
    }

    public Task<string> FormatDataForAIAsync(object? data)
    {
        try
        {
            // This method is deprecated in Pure AI system
            // AI handles all formatting internally
            return Task.FromResult(data?.ToString() ?? "Không có dữ liệu");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error formatting data for AI");
            return Task.FromResult("Lỗi định dạng dữ liệu");
        }
    }

    // **DEPRECATED METHODS - Only kept for interface compatibility**
    // All these will redirect to Pure AI system
    
    public async Task<AIDatabaseResponseDTO> GetVolunteerAnalyticsAsync(string query, Dictionary<string, object>? parameters = null)
    {
        return await GetContextualDataAsync(new QueryAnalysisDTO { OriginalQuery = query });
    }

    public async Task<AIDatabaseResponseDTO> GetEventPerformanceAsync(string query, Dictionary<string, object>? parameters = null)
    {
        return await GetContextualDataAsync(new QueryAnalysisDTO { OriginalQuery = query });
    }

    public async Task<AIDatabaseResponseDTO> GetPartnerInsightsAsync(string query, Dictionary<string, object>? parameters = null)
    {
        return await GetContextualDataAsync(new QueryAnalysisDTO { OriginalQuery = query });
    }

    public async Task<AIDatabaseResponseDTO> GetTrendAnalysisAsync(string query, Dictionary<string, object>? parameters = null)
    {
        return await GetContextualDataAsync(new QueryAnalysisDTO { OriginalQuery = query });
    }

    public async Task<AIDatabaseResponseDTO> GetEventCountAsync(string query, Dictionary<string, object>? parameters = null)
    {
        return await GetContextualDataAsync(new QueryAnalysisDTO { OriginalQuery = query });
    }

    public Task<List<string>> GetRelatedTablesAsync(List<string> baseTables)
    {
        // Deprecated - AI determines table relationships automatically
        return Task.FromResult(baseTables);
    }

    public Task<Dictionary<string, object>> GetDataSummaryAsync(List<string> tableNames)
    {
        // Deprecated - AI handles data summarization
        return Task.FromResult(new Dictionary<string, object> { ["AI"] = "Handles all data access" });
    }

    public Task LogQueryExecutionAsync(int userId, string query, string tablesAccessed, int executionTime, int? instructionId = null)
    {
        try
        {
            var analytics = new AiQueryAnalytic
            {
                UserId = userId,
                InstructionId = instructionId,
                QueryText = query,
                DataTablesAccessed = tablesAccessed,
                ExecutionTime = executionTime,
                CreatedAt = DateTime.UtcNow
            };

            _context.AiQueryAnalytics.Add(analytics);
            return _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging query execution for user {UserId}", userId);
            return Task.CompletedTask;
        }
    }
}
