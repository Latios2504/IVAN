using ivan_api.DTOs.AI;

namespace ivan_api.Services.AI.Interfaces;

/// <summary>
/// Interface for AI Instructions analytics and performance metrics
/// </summary>
public interface IAiInstructionsAnalyticsService
{
    /// <summary>
    /// Get analytics for a specific instruction
    /// </summary>
    Task<IEnumerable<AiQueryAnalyticsDTO>> GetInstructionAnalyticsAsync(int instructionId);

    /// <summary>
    /// Get performance metrics for a specific instruction
    /// </summary>
    Task<InstructionPerformanceDTO> GetInstructionPerformanceAsync(int instructionId);

    /// <summary>
    /// Get all analytics (admin only)
    /// </summary>
    Task<IEnumerable<AiQueryAnalyticsDTO>> GetAllAnalyticsAsync();

    /// <summary>
    /// Log query analytics for testing
    /// </summary>
    Task LogQueryAnalyticsAsync(int instructionId, string query, int processingTimeMs);

    /// <summary>
    /// Get analytics summary dashboard
    /// </summary>
    Task<AnalyticsSummaryDTO> GetAnalyticsSummaryAsync();

    /// <summary>
    /// Update query feedback (user correction/quality rating)
    /// </summary>
    Task<bool> UpdateQueryFeedbackAsync(int queryId, bool isCorrect, int responseQuality);
}