using ivan_api.DTOs.AI;

namespace ivan_api.Services.AI.Interfaces;

/// <summary>
/// Interface for AI Custom Instructions CRUD operations
/// </summary>
public interface IAiInstructionsCrudService
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
}