using ivan_api.DTOs.AI;

namespace ivan_api.Services.AI.Interfaces;

/// <summary>
/// Interface for AI Custom Instruction service
/// </summary>
public interface IAiCustomInstructionService
{
    /// <summary>
    /// Get all custom instructions (Admin only)
    /// </summary>
    Task<List<AiCustomInstructionDTO>> GetAllCustomInstructionsAsync();

    /// <summary>
    /// Get custom instructions for current user based on role
    /// </summary>
    Task<List<AiCustomInstructionDTO>> GetUserCustomInstructionsAsync(int userId, string userRole);

    /// <summary>
    /// Get a specific custom instruction by ID
    /// </summary>
    Task<AiCustomInstructionDTO?> GetCustomInstructionByIdAsync(int instructionId);



    /// <summary>
    /// Create a new custom instruction
    /// </summary>
    Task<AiCustomInstructionDTO> CreateCustomInstructionAsync(AiCustomInstructionCreateDTO createDto, int userId);

    /// <summary>
    /// Update an existing custom instruction
    /// </summary>
    Task<AiCustomInstructionDTO> UpdateCustomInstructionAsync(int instructionId, AiCustomInstructionUpdateDTO updateDto);

    /// <summary>
    /// Delete a custom instruction
    /// </summary>
    Task<bool> DeleteCustomInstructionAsync(int instructionId);

    /// <summary>
    /// Toggle instruction active status
    /// </summary>
    Task<AiCustomInstructionDTO> ToggleInstructionStatusAsync(int instructionId, bool isActive);




}