using ivan_api.DTOs.AI;
using ivan_api.Models;

namespace ivan_api.Services.AI.Interfaces;

/// <summary>
/// Service interface for managing AI Custom Instructions
/// </summary>
public interface IAiInstructionsService
{
    // CRUD Operations
    Task<IEnumerable<AiCustomInstructionDTO>> GetAllInstructionsAsync();
    Task<IEnumerable<AiCustomInstructionDTO>> GetUserInstructionsAsync(int userId);
    Task<AiCustomInstructionDTO?> GetInstructionByIdAsync(int instructionId);
    Task<AiCustomInstructionDTO> CreateInstructionAsync(AiCustomInstructionCreateDTO createDto, int createdByUserId);
    Task<AiCustomInstructionDTO> UpdateInstructionAsync(int instructionId, AiCustomInstructionUpdateDTO updateDto);
    Task<bool> DeleteInstructionAsync(int instructionId);
    
    // Status Management
    Task<AiCustomInstructionDTO> ToggleInstructionStatusAsync(int instructionId, bool isActive);
    
    // Template Management
    Task<IEnumerable<AiCustomInstructionDTO>> GetTemplateInstructionsAsync();
    Task<AiCustomInstructionDTO?> GetDefaultInstructionAsync();
    
    // Testing & Analytics
    Task<TestInstructionResponseDTO> TestInstructionAsync(int instructionId, TestInstructionRequestDTO testRequest);
    Task<TestInstructionResponseDTO> TestInstructionWithModelAsync(int instructionId, TestInstructionWithModelRequestDTO testRequest);
    Task<IEnumerable<AiQueryAnalyticsDTO>> GetInstructionAnalyticsAsync(int instructionId);
    Task<InstructionPerformanceDTO> GetInstructionPerformanceAsync(int instructionId);
    Task<IEnumerable<AiQueryAnalyticsDTO>> GetAllAnalyticsAsync();
    
    // AI Provider Integration
    Task<IEnumerable<string>> GetAvailableModelsAsync();
    Task<object> GetAiConfigurationAsync();
}
