using ivan_api.Configuration;
using ivan_api.DTOs.AI;

namespace ivan_api.Services.AI.Interfaces;

/// <summary>
/// Interface for managing chatbot configuration including default custom instructions
/// </summary>
public interface IChatbotConfigurationService
{
    /// <summary>
    /// Get the default custom instruction for chatbot
    /// </summary>
    /// <returns>Default custom instruction or null if not configured/available</returns>
    Task<AiCustomInstructionDTO?> GetDefaultCustomInstructionAsync();

    /// <summary>
    /// Update the default custom instruction ID in configuration
    /// </summary>
    /// <param name="instructionId">ID of the custom instruction to set as default, or null to disable</param>
    /// <returns>True if successful, false otherwise</returns>
    Task<bool> SetDefaultCustomInstructionAsync(int? instructionId);

    /// <summary>
    /// Get current chatbot configuration
    /// </summary>
    /// <returns>Current chatbot configuration</returns>
    ChatbotConfiguration GetCurrentConfiguration();

    /// <summary>
    /// Clear the cached default custom instruction
    /// </summary>
    void ClearCache();
}