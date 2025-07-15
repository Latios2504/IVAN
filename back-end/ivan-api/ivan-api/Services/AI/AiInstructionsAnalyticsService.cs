using ivan_api.DTOs.AI;
using ivan_api.Models;
using ivan_api.Services.AI.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services.AI;

/// <summary>
/// Service for managing AI Instructions analytics and performance metrics
/// </summary>
public class AiInstructionsAnalyticsService : IAiInstructionsAnalyticsService
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly ILogger<AiInstructionsAnalyticsService> _logger;

    public AiInstructionsAnalyticsService(
        VolunteerManagementSystemContext context,
        ILogger<AiInstructionsAnalyticsService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<AiQueryAnalyticsDTO>> GetInstructionAnalyticsAsync(int instructionId)
    {
        var analytics = await _context.AiQueryIntents
            .Where(q => q.InstructionId == instructionId)
            .OrderByDescending(q => q.CreatedAt)
            .Take(100) // Limit to last 100 queries
            .ToListAsync();

        return analytics.Select(MapAnalyticsToDTO);
    }

    public async Task<InstructionPerformanceDTO> GetInstructionPerformanceAsync(int instructionId)
    {
        var analytics = await _context.AiQueryIntents
            .Where(q => q.InstructionId == instructionId)
            .ToListAsync();

        var last7Days = analytics.Where(q => q.CreatedAt >= DateTime.UtcNow.AddDays(-7)).ToList();

        return new InstructionPerformanceDTO
        {
            TotalQueries = analytics.Count,
            AverageExecutionTime = analytics.Where(q => q.ProcessingTimeMs.HasValue)
                                           .Select(q => q.ProcessingTimeMs!.Value)
                                           .DefaultIfEmpty(0)
                                           .Average(),
            AverageResponseQuality = analytics.Where(q => q.ResponseQuality.HasValue)
                                            .Select(q => q.ResponseQuality!.Value)
                                            .DefaultIfEmpty(0)
                                            .Average(),
            QueriesLast7Days = last7Days.Count,
            MostAccessedTables = GetMostAccessedTables(analytics)
        };
    }

    public async Task<IEnumerable<AiQueryAnalyticsDTO>> GetAllAnalyticsAsync()
    {
        var analytics = await _context.AiQueryIntents
            .OrderByDescending(q => q.CreatedAt)
            .Take(500) // Limit to last 500 queries
            .ToListAsync();

        return analytics.Select(MapAnalyticsToDTO);
    }

    public async Task LogQueryAnalyticsAsync(int instructionId, string query, int processingTimeMs)
    {
        try
        {
            // Check if instruction exists
            var instructionExists = await _context.AiCustomInstructions
                .AnyAsync(i => i.InstructionId == instructionId);
            
            if (!instructionExists)
            {
                _logger.LogWarning($"Instruction {instructionId} not found, skipping analytics logging");
                return;
            }

            // Try to get a valid user ID, fallback to first available user
            var firstUserId = await _context.Users.Select(u => u.UserId).FirstOrDefaultAsync();
            
            if (firstUserId == 0)
            {
                _logger.LogWarning("No users found in database, skipping analytics logging");
                return;
            }

            var analytics = new AiQueryIntent
            {
                UserId = firstUserId, // Use first available user instead of hardcoded value
                InstructionId = instructionId,
                QueryText = query,
                DetectedIntent = "instruction_test",
                ProcessingTimeMs = processingTimeMs,
                CreatedAt = DateTime.UtcNow,
                ConversationId = Guid.NewGuid().ToString(), // Generate unique conversation ID
                IsCorrect = null, // Unknown until user feedback
                ResponseQuality = null // Will be set based on user feedback
            };

            _context.AiQueryIntents.Add(analytics);
            await _context.SaveChangesAsync();
            
            _logger.LogDebug($"Successfully logged analytics for instruction {instructionId}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to log query analytics for instruction {InstructionId}", instructionId);
            // Don't throw - analytics logging shouldn't break the main functionality
        }
    }

    public async Task<AnalyticsSummaryDTO> GetAnalyticsSummaryAsync()
    {
        var last30Days = DateTime.UtcNow.AddDays(-30);
        var last7Days = DateTime.UtcNow.AddDays(-7);

        var analytics = await _context.AiQueryIntents
            .Where(q => q.CreatedAt >= last30Days)
            .ToListAsync();

        var last7DaysAnalytics = analytics.Where(q => q.CreatedAt >= last7Days).ToList();

        var summary = new AnalyticsSummaryDTO
        {
            TotalQueries = analytics.Count,
            QueriesLast7Days = last7DaysAnalytics.Count,
            AverageExecutionTime = analytics.Where(q => q.ProcessingTimeMs.HasValue)
                                           .Select(q => q.ProcessingTimeMs!.Value)
                                           .DefaultIfEmpty(0)
                                           .Average(),
            AverageResponseQuality = analytics.Where(q => q.ResponseQuality.HasValue)
                                            .Select(q => q.ResponseQuality!.Value)
                                            .DefaultIfEmpty(0)
                                            .Average(),
            MostActiveInstructions = await GetMostActiveInstructionsAsync(analytics),
            QueryTrendLast7Days = GetQueryTrendLast7Days(last7DaysAnalytics),
            TopIntents = GetTopIntents(analytics)
        };

        return summary;
    }

    public async Task<bool> UpdateQueryFeedbackAsync(int queryId, bool isCorrect, int responseQuality)
    {
        var query = await _context.AiQueryIntents
            .FirstOrDefaultAsync(q => q.IntentId == queryId);

        if (query == null)
        {
            return false;
        }

        query.IsCorrect = isCorrect;
        query.ResponseQuality = responseQuality;

        await _context.SaveChangesAsync();
        
        _logger.LogDebug($"Updated feedback for query {queryId}: Correct={isCorrect}, Quality={responseQuality}");
        
        return true;
    }

    #region Helper Methods

    private static AiQueryAnalyticsDTO MapAnalyticsToDTO(AiQueryIntent analytics)
    {
        return new AiQueryAnalyticsDTO
        {
            IntentId = analytics.IntentId,
            UserId = analytics.UserId,
            ConversationId = analytics.ConversationId,
            QueryText = analytics.QueryText,
            DetectedIntent = analytics.DetectedIntent,
            EntityMentions = analytics.EntityMentions,
            IsCorrect = analytics.IsCorrect,
            CorrectedIntent = analytics.CorrectedIntent,
            ProcessingTimeMs = analytics.ProcessingTimeMs,
            ResponseQuality = analytics.ResponseQuality,
            DataTablesAccessed = analytics.DataTablesAccessed,
            InstructionId = analytics.InstructionId,
            CreatedAt = analytics.CreatedAt ?? DateTime.UtcNow
        };
    }

    private static Dictionary<string, int> GetMostAccessedTables(List<AiQueryIntent> analytics)
    {
        var tableCounts = new Dictionary<string, int>();

        foreach (var analytic in analytics.Where(a => !string.IsNullOrWhiteSpace(a.DataTablesAccessed)))
        {
            var tables = analytic.DataTablesAccessed!.Split(',', StringSplitOptions.RemoveEmptyEntries);
            foreach (var table in tables)
            {
                var tableName = table.Trim();
                tableCounts[tableName] = tableCounts.GetValueOrDefault(tableName, 0) + 1;
            }
        }

        return tableCounts.OrderByDescending(kv => kv.Value)
                         .Take(5)
                         .ToDictionary(kv => kv.Key, kv => kv.Value);
    }

    private async Task<Dictionary<string, int>> GetMostActiveInstructionsAsync(List<AiQueryIntent> analytics)
    {
        var instructionCounts = analytics
            .Where(a => a.InstructionId.HasValue)
            .GroupBy(a => a.InstructionId!.Value)
            .ToDictionary(g => g.Key, g => g.Count());

        var result = new Dictionary<string, int>();
        
        foreach (var kvp in instructionCounts.OrderByDescending(kv => kv.Value).Take(5))
        {
            var instruction = await _context.AiCustomInstructions
                .FirstOrDefaultAsync(i => i.InstructionId == kvp.Key);
            
            if (instruction != null)
            {
                result[instruction.InstructionName] = kvp.Value;
            }
        }

        return result;
    }

    private static Dictionary<string, int> GetQueryTrendLast7Days(List<AiQueryIntent> analytics)
    {
        var trend = new Dictionary<string, int>();
        
        for (int i = 6; i >= 0; i--)
        {
            var date = DateTime.UtcNow.AddDays(-i).Date;
            var count = analytics.Count(a => a.CreatedAt?.Date == date);
            trend[date.ToString("yyyy-MM-dd")] = count;
        }

        return trend;
    }

    private static Dictionary<string, int> GetTopIntents(List<AiQueryIntent> analytics)
    {
        return analytics
            .Where(a => !string.IsNullOrWhiteSpace(a.DetectedIntent))
            .GroupBy(a => a.DetectedIntent!)
            .OrderByDescending(g => g.Count())
            .Take(5)
            .ToDictionary(g => g.Key, g => g.Count());
    }

    #endregion
}

/// <summary>
/// Summary of AI analytics
/// </summary>
public class AnalyticsSummaryDTO
{
    public int TotalQueries { get; set; }
    public int QueriesLast7Days { get; set; }
    public double AverageExecutionTime { get; set; }
    public double AverageResponseQuality { get; set; }
    public Dictionary<string, int> MostActiveInstructions { get; set; } = new();
    public Dictionary<string, int> QueryTrendLast7Days { get; set; } = new();
    public Dictionary<string, int> TopIntents { get; set; } = new();
}