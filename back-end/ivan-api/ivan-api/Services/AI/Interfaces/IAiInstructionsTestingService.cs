using ivan_api.DTOs.AI;

namespace ivan_api.Services.AI.Interfaces;

/// <summary>
/// Interface for AI Instructions testing operations
/// </summary>
public interface IAiInstructionsTestingService
{
    /// <summary>
    /// Test instruction with specific model
    /// </summary>
    Task<TestInstructionResponseDTO> TestInstructionWithModelAsync(int instructionId, TestInstructionWithModelRequestDTO testRequest);

    /// <summary>
    /// Test instruction with default model
    /// </summary>
    Task<TestInstructionResponseDTO> TestInstructionAsync(int instructionId, TestInstructionRequestDTO testRequest);

    /// <summary>
    /// Get available AI models
    /// </summary>
    Task<IEnumerable<string>> GetAvailableModelsAsync();

    /// <summary>
    /// Get AI configuration
    /// </summary>
    Task<object> GetAiConfigurationAsync();
}