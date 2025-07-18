using ivan_api.Services.AI;

namespace ivan_api.Services.AI.Interfaces;

/// <summary>
/// Interface for AI Prompt Orchestrator service
/// </summary>
public interface IAiPromptOrchestrator
{
    /// <summary>
    /// Build a complete prompt for AI processing
    /// </summary>
    /// <param name="query">User query</param>
    /// <param name="customInstructionId">Optional custom instruction ID</param>
    /// <param name="isSqlQuery">Whether this is detected as SQL query</param>
    /// <returns>Orchestrated prompt result</returns>
    Task<PromptResult> BuildPromptAsync(string query, int? customInstructionId, bool isSqlQuery);
} 