using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ivan_api.DTOs;
using ivan_api.DTOs.AIDatabaseManage;
using ivan_api.Services.AIQueryServ;

namespace ivan_api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AIQueryController : ControllerBase
{
    private readonly IAIQueryEngine _queryEngine;
    private readonly ILogger<AIQueryController> _logger;

    public AIQueryController(IAIQueryEngine queryEngine, ILogger<AIQueryController> logger)
    {
        _queryEngine = queryEngine;
        _logger = logger;
    }

    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }

    /// <summary>
    /// Process advanced natural language query with enhanced analytics
    /// </summary>
    [HttpPost("advanced")]
    public async Task<ActionResult<ApiResponseDTO<AIQueryResultDTO>>> ProcessAdvancedQuery([FromBody] AdvancedQueryRequestDTO request)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new ApiResponseDTO<AIQueryResultDTO>
                {
                    Success = false,
                    Message = "User not authenticated"
                });
            }

            var result = await _queryEngine.ProcessAdvancedQueryAsync(request.Query, userId.Value, request.InstructionId);

            return Ok(new ApiResponseDTO<AIQueryResultDTO>
            {
                Success = result.Success,
                Data = result,
                Message = result.Success ? "Query processed successfully" : result.ErrorMessage
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing advanced query: {Query}", request.Query);
            return StatusCode(500, new ApiResponseDTO<AIQueryResultDTO>
            {
                Success = false,
                Message = "Internal server error"
            });
        }
    }

    /// <summary>
    /// Get query suggestions based on partial input
    /// </summary>
    [HttpGet("suggestions")]
    public async Task<ActionResult<ApiResponseDTO<List<SuggestedQueryDTO>>>> GetQuerySuggestions(
        [FromQuery] string partialQuery = "", 
        [FromQuery] string category = "General")
    {
        try
        {
            var suggestions = await _queryEngine.GetQuerySuggestionsAsync(partialQuery, category);

            return Ok(new ApiResponseDTO<List<SuggestedQueryDTO>>
            {
                Success = true,
                Data = suggestions,
                Message = $"Found {suggestions.Count} suggestions"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting query suggestions");
            return StatusCode(500, new ApiResponseDTO<List<SuggestedQueryDTO>>
            {
                Success = false,
                Message = "Internal server error"
            });
        }
    }

    /// <summary>
    /// Analyze query complexity and get optimization recommendations
    /// </summary>
    [HttpPost("analyze")]
    public async Task<ActionResult<ApiResponseDTO<QueryAnalysisDTO>>> AnalyzeQuery([FromBody] QueryAnalysisRequestDTO request)
    {
        try
        {
            var analysis = await _queryEngine.AnalyzeQueryAsync(request.Query);

            return Ok(new ApiResponseDTO<QueryAnalysisDTO>
            {
                Success = true,
                Data = analysis,
                Message = "Query analyzed successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing query: {Query}", request.Query);
            return StatusCode(500, new ApiResponseDTO<QueryAnalysisDTO>
            {
                Success = false,
                Message = "Internal server error"
            });
        }
    }

    /// <summary>
    /// Get intelligent data summary for a specific category
    /// </summary>
    [HttpGet("data-summary/{category}")]
    public async Task<ActionResult<ApiResponseDTO<DataSummaryDTO>>> GetDataSummary(string category, [FromQuery] Dictionary<string, object>? filters = null)
    {
        try
        {
            var summary = await _queryEngine.GetIntelligentDataSummaryAsync(category, filters ?? new Dictionary<string, object>());

            return Ok(new ApiResponseDTO<DataSummaryDTO>
            {
                Success = true,
                Data = summary,
                Message = "Data summary generated successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting data summary for category: {Category}", category);
            return StatusCode(500, new ApiResponseDTO<DataSummaryDTO>
            {
                Success = false,
                Message = "Internal server error"
            });
        }
    }

    /// <summary>
    /// Generate trend analysis for a specific metric
    /// </summary>
    [HttpGet("trends/{metric}")]
    public async Task<ActionResult<ApiResponseDTO<TrendAnalysisDTO>>> GetTrendAnalysis(string metric, [FromQuery] int days = 30)
    {
        try
        {
            var period = TimeSpan.FromDays(days);
            var trends = await _queryEngine.GenerateTrendAnalysisAsync(metric, period);

            return Ok(new ApiResponseDTO<TrendAnalysisDTO>
            {
                Success = true,
                Data = trends,
                Message = "Trend analysis generated successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating trend analysis for metric: {Metric}", metric);
            return StatusCode(500, new ApiResponseDTO<TrendAnalysisDTO>
            {
                Success = false,
                Message = "Internal server error"
            });
        }
    }

    /// <summary>
    /// Get proactive insights and recommendations
    /// </summary>
    [HttpGet("insights")]
    public async Task<ActionResult<ApiResponseDTO<List<InsightDTO>>>> GetProactiveInsights()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new ApiResponseDTO<List<InsightDTO>>
                {
                    Success = false,
                    Message = "User not authenticated"
                });
            }

            var insights = await _queryEngine.GenerateProactiveInsightsAsync(userId.Value);

            return Ok(new ApiResponseDTO<List<InsightDTO>>
            {
                Success = true,
                Data = insights,
                Message = $"Generated {insights.Count} insights"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting proactive insights");
            return StatusCode(500, new ApiResponseDTO<List<InsightDTO>>
            {
                Success = false,
                Message = "Internal server error"
            });
        }
    }

    /// <summary>
    /// Get query performance optimization recommendations
    /// </summary>
    [HttpPost("optimize")]
    public async Task<ActionResult<ApiResponseDTO<QueryOptimizationDTO>>> OptimizeQuery([FromBody] QueryAnalysisRequestDTO request)
    {
        try
        {
            var analysis = await _queryEngine.AnalyzeQueryAsync(request.Query);
            var optimization = await _queryEngine.OptimizeQueryPerformanceAsync(analysis);

            return Ok(new ApiResponseDTO<QueryOptimizationDTO>
            {
                Success = true,
                Data = optimization,
                Message = "Query optimization completed"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error optimizing query: {Query}", request.Query);
            return StatusCode(500, new ApiResponseDTO<QueryOptimizationDTO>
            {
                Success = false,
                Message = "Internal server error"
            });
        }
    }
}

// Additional DTOs for the API endpoints
public class AdvancedQueryRequestDTO
{
    public string Query { get; set; } = string.Empty;
    public int? InstructionId { get; set; }
}

public class QueryAnalysisRequestDTO
{
    public string Query { get; set; } = string.Empty;
}
