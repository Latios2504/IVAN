using ivan_api.Services.AI.Interfaces;
using ivan_api.Services.AI.SQLGenerator.Utils;
using Microsoft.Extensions.Logging;

namespace ivan_api.Services.AI;

/// <summary>
/// Service to orchestrate AI prompt building with custom instructions and SQL context
/// Eliminates duplicate logic and centralizes prompt generation
/// </summary>
public class AiPromptOrchestrator : IAiPromptOrchestrator
{
    private readonly IAiCustomInstructionService _customInstructionService;
    private readonly SqlDetectionService _sqlDetectionService;
    private readonly ILogger<AiPromptOrchestrator> _logger;

    public AiPromptOrchestrator(
        IAiCustomInstructionService customInstructionService,
        SqlDetectionService sqlDetectionService,
        ILogger<AiPromptOrchestrator> logger)
    {
        _customInstructionService = customInstructionService;
        _sqlDetectionService = sqlDetectionService;
        _logger = logger;
    }

    /// <summary>
    /// Build a complete prompt for AI processing
    /// </summary>
    /// <param name="query">User query</param>
    /// <param name="customInstructionId">Optional custom instruction ID</param>
    /// <param name="isSqlQuery">Whether this is detected as SQL query</param>
    /// <returns>Orchestrated prompt result</returns>
    public async Task<PromptResult> BuildPromptAsync(string query, int? customInstructionId, bool isSqlQuery)
    {
        try
        {
            var result = new PromptResult();

            // Get custom instruction if specified
            var customInstruction = await GetCustomInstructionAsync(customInstructionId);
            result.CustomInstructionUsed = customInstruction?.InstructionName ?? "";

            // Build system prompt from custom instruction
            var systemPrompt = BuildSystemPrompt(customInstruction);

            if (isSqlQuery)
            {
                // Get SQL context from database metadata
                var relevantTables = await _sqlDetectionService.GetRelevantTableNamesAsync(query);
                var relevantKeywords = await _sqlDetectionService.GetRelevantKeywordsAsync(query);
                var relevantRelationships = await _sqlDetectionService.GetRelevantRelationshipsAsync(query, relevantTables);

                // Build SQL-specific prompt
                var sqlPrompt = $@"{systemPrompt}

You are an expert SQL developer for a Volunteer Management System. Generate a SQL query to answer this question.

User Query: {query}

Relevant Tables: {string.Join(", ", relevantTables)}
Relevant Keywords: {string.Join(", ", relevantKeywords)}
Relevant Relationships: {string.Join(", ", relevantRelationships)}

Please generate a SQL Server query that answers the user's question.";

                result.FinalPrompt = sqlPrompt;
                result.RelevantTables = relevantTables;
                result.RelevantKeywords = relevantKeywords;
                result.RelevantRelationships = relevantRelationships;
            }
            else
            {
                // Regular AI query
                result.FinalPrompt = string.IsNullOrEmpty(systemPrompt) 
                    ? query 
                    : $"{systemPrompt}\n\nUser Query: {query}";
            }

            result.IsSqlQuery = isSqlQuery;
            result.Success = true;

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error building prompt for query: {Query}", query);
            return new PromptResult 
            { 
                Success = false, 
                ErrorMessage = "Error building prompt",
                FinalPrompt = query // Fallback to original query
            };
        }
    }

    private async Task<dynamic?> GetCustomInstructionAsync(int? customInstructionId)
    {
        if (!customInstructionId.HasValue)
            return null;

        try
        {
            return await _customInstructionService.GetCustomInstructionByIdAsync(customInstructionId.Value);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Error retrieving custom instruction {InstructionId}", customInstructionId.Value);
            return null;
        }
    }

    private string BuildSystemPrompt(dynamic? instruction)
    {
        if (instruction == null)
            return "";

        var systemPrompt = instruction.SystemPrompt ?? "";

        if (!string.IsNullOrEmpty(instruction.BehaviorInstructions))
        {
            systemPrompt += "\n\nIMPORTANT BEHAVIOR RULES:\n" + instruction.BehaviorInstructions;
            systemPrompt += "\n\nYou MUST follow these behavior rules in your response.";
        }

        return systemPrompt;
    }
}

/// <summary>
/// Result from prompt orchestration
/// </summary>
public class PromptResult
{
    public bool Success { get; set; }
    public string FinalPrompt { get; set; } = "";
    public string CustomInstructionUsed { get; set; } = "";
    public bool IsSqlQuery { get; set; }
    public List<string> RelevantTables { get; set; } = new();
    public List<string> RelevantKeywords { get; set; } = new();
    public List<string> RelevantRelationships { get; set; } = new();
    public string? ErrorMessage { get; set; }
}