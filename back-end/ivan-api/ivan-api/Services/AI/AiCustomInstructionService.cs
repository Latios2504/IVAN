using ivan_api.DTOs.AI;
using ivan_api.Models;
using ivan_api.Services.AI.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services.AI;

/// <summary>
/// Service for managing AI Custom Instructions
/// </summary>
public class AiCustomInstructionService : IAiCustomInstructionService
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly ILogger<AiCustomInstructionService> _logger;

    public AiCustomInstructionService(
        VolunteerManagementSystemContext context,
        ILogger<AiCustomInstructionService> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all custom instructions (Admin only)
    /// </summary>
    public async Task<List<AiCustomInstructionDTO>> GetAllCustomInstructionsAsync()
    {
        try
        {
            var instructions = await _context.AiCustomInstructions
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();

            return instructions.Select(MapToDTO).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all custom instructions");
            throw;
        }
    }

    /// <summary>
    /// Get custom instructions for current user based on role
    /// </summary>
    public async Task<List<AiCustomInstructionDTO>> GetUserCustomInstructionsAsync(int userId, string userRole)
    {
        try
        {
            var query = _context.AiCustomInstructions.AsQueryable();

            // Filter based on user role
            if (userRole.ToLower() != "admin")
            {
                query = query.Where(i => i.IsActive ?? true);
            }

            var instructions = await query
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();

            return instructions.Select(MapToDTO).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user custom instructions for user {UserId}", userId);
            throw;
        }
    }

    /// <summary>
    /// Get a specific custom instruction by ID
    /// </summary>
    public async Task<AiCustomInstructionDTO?> GetCustomInstructionByIdAsync(int instructionId)
    {
        try
        {
            var instruction = await _context.AiCustomInstructions
                .FirstOrDefaultAsync(i => i.InstructionId == instructionId);

            return instruction == null ? null : MapToDTO(instruction);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting custom instruction {InstructionId}", instructionId);
            throw;
        }
    }



    /// <summary>
    /// Create a new custom instruction
    /// </summary>
    public async Task<AiCustomInstructionDTO> CreateCustomInstructionAsync(AiCustomInstructionCreateDTO createDto, int userId)
    {
        try
        {
            var instruction = new AiCustomInstruction
            {
                InstructionName = createDto.InstructionName,
                SystemPrompt = createDto.SystemPrompt,
                BehaviorInstructions = createDto.BehaviorInstructions,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.AiCustomInstructions.Add(instruction);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created custom instruction {InstructionId} for user {UserId}", 
                instruction.InstructionId, userId);

            return MapToDTO(instruction);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating custom instruction for user {UserId}", userId);
            throw;
        }
    }

    /// <summary>
    /// Update an existing custom instruction
    /// </summary>
    public async Task<AiCustomInstructionDTO> UpdateCustomInstructionAsync(int instructionId, AiCustomInstructionUpdateDTO updateDto)
    {
        try
        {
            var instruction = await _context.AiCustomInstructions
                .FirstOrDefaultAsync(i => i.InstructionId == instructionId);

            if (instruction == null)
                throw new ArgumentException($"Instruction with ID {instructionId} not found");

            instruction.InstructionName = updateDto.InstructionName;
            instruction.SystemPrompt = updateDto.SystemPrompt;
            instruction.BehaviorInstructions = updateDto.BehaviorInstructions;
            instruction.IsActive = updateDto.IsActive;
            instruction.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Updated custom instruction {InstructionId}", instructionId);

            return MapToDTO(instruction);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating custom instruction {InstructionId}", instructionId);
            throw;
        }
    }

    /// <summary>
    /// Delete a custom instruction
    /// </summary>
    public async Task<bool> DeleteCustomInstructionAsync(int instructionId)
    {
        try
        {
            var instruction = await _context.AiCustomInstructions
                .FirstOrDefaultAsync(i => i.InstructionId == instructionId);

            if (instruction == null)
                return false;

            _context.AiCustomInstructions.Remove(instruction);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Deleted custom instruction {InstructionId}", instructionId);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting custom instruction {InstructionId}", instructionId);
            throw;
        }
    }

    /// <summary>
    /// Toggle instruction active status
    /// </summary>
    public async Task<AiCustomInstructionDTO> ToggleInstructionStatusAsync(int instructionId, bool isActive)
    {
        try
        {
            var instruction = await _context.AiCustomInstructions
                .FirstOrDefaultAsync(i => i.InstructionId == instructionId);

            if (instruction == null)
                throw new ArgumentException($"Instruction with ID {instructionId} not found");

            instruction.IsActive = isActive;
            instruction.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Toggled custom instruction {InstructionId} status to {IsActive}", 
                instructionId, isActive);

            return MapToDTO(instruction);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling custom instruction {InstructionId} status", instructionId);
            throw;
        }
    }



    #region Private Helper Methods

    /// <summary>
    /// Map AiCustomInstruction entity to DTO
    /// </summary>
    private static AiCustomInstructionDTO MapToDTO(AiCustomInstruction instruction)
    {
        return new AiCustomInstructionDTO
        {
            InstructionId = instruction.InstructionId,
            InstructionName = instruction.InstructionName,
            SystemPrompt = instruction.SystemPrompt,
            BehaviorInstructions = instruction.BehaviorInstructions,
            IsActive = instruction.IsActive ?? true,
            CreatedAt = instruction.CreatedAt ?? DateTime.UtcNow,
            UpdatedAt = instruction.UpdatedAt ?? DateTime.UtcNow
        };
    }

    #endregion
}