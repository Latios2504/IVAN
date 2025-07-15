using ivan_api.DTOs.AI;
using ivan_api.Models;
using ivan_api.Services.AI.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services.AI;

/// <summary>
/// Service for managing AI Custom Instructions CRUD operations
/// </summary>
public class AiInstructionsCrudService : IAiInstructionsCrudService
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly ILogger<AiInstructionsCrudService> _logger;

    public AiInstructionsCrudService(
        VolunteerManagementSystemContext context,
        ILogger<AiInstructionsCrudService> logger)
    {
        _context = context;
        _logger = logger;
    }

    #region CRUD Operations

    public async Task<IEnumerable<AiCustomInstructionDTO>> GetAllInstructionsAsync()
    {
        var instructions = await _context.AiCustomInstructions
            .Include(i => i.CreatedByUser)
                .ThenInclude(u => u.UserProfiles)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();

        return instructions.Select(MapToDTO);
    }

    public async Task<IEnumerable<AiCustomInstructionDTO>> GetUserInstructionsAsync(int userId)
    {
        var instructions = await _context.AiCustomInstructions
            .Include(i => i.CreatedByUser)
                .ThenInclude(u => u.UserProfiles)
            .Where(i => i.CreatedByUserId == userId)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();

        return instructions.Select(MapToDTO);
    }

    public async Task<AiCustomInstructionDTO?> GetInstructionByIdAsync(int instructionId)
    {
        var instruction = await _context.AiCustomInstructions
            .Include(i => i.CreatedByUser)
                .ThenInclude(u => u.UserProfiles)
            .FirstOrDefaultAsync(i => i.InstructionId == instructionId);

        return instruction != null ? MapToDTO(instruction) : null;
    }

    public async Task<AiCustomInstructionDTO> CreateInstructionAsync(AiCustomInstructionCreateDTO createDto, int createdByUserId)
    {
        var instruction = new AiCustomInstruction
        {
            CreatedByUserId = createdByUserId,
            InstructionName = createDto.InstructionName,
            SystemPrompt = createDto.SystemPrompt,
            BehaviorInstructions = createDto.BehaviorInstructions,
            DataAccessRules = createDto.DataAccessRules,
            IsActive = true,
            IsDefault = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.AiCustomInstructions.Add(instruction);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"Created AI instruction {instruction.InstructionId} by user {createdByUserId}");

        // Reload with navigation properties
        return await GetInstructionByIdAsync(instruction.InstructionId) 
               ?? throw new InvalidOperationException("Failed to retrieve created instruction");
    }

    public async Task<AiCustomInstructionDTO> UpdateInstructionAsync(int instructionId, AiCustomInstructionUpdateDTO updateDto)
    {
        var instruction = await _context.AiCustomInstructions
            .FirstOrDefaultAsync(i => i.InstructionId == instructionId);

        if (instruction == null)
        {
            throw new ArgumentException($"Instruction with ID {instructionId} not found");
        }

        instruction.InstructionName = updateDto.InstructionName;
        instruction.SystemPrompt = updateDto.SystemPrompt;
        instruction.BehaviorInstructions = updateDto.BehaviorInstructions;
        instruction.DataAccessRules = updateDto.DataAccessRules;
        instruction.IsActive = updateDto.IsActive;
        instruction.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation($"Updated AI instruction {instructionId}");

        return await GetInstructionByIdAsync(instructionId) 
               ?? throw new InvalidOperationException("Failed to retrieve updated instruction");
    }

    public async Task<bool> DeleteInstructionAsync(int instructionId)
    {
        var instruction = await _context.AiCustomInstructions
            .FirstOrDefaultAsync(i => i.InstructionId == instructionId);

        if (instruction == null)
        {
            return false;
        }

        // Don't allow deletion of default instructions
        if (instruction.IsDefault == true)
        {
            throw new InvalidOperationException("Cannot delete default instructions");
        }

        _context.AiCustomInstructions.Remove(instruction);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"Deleted AI instruction {instructionId}");

        return true;
    }

    #endregion

    #region Status Management

    public async Task<AiCustomInstructionDTO> ToggleInstructionStatusAsync(int instructionId, bool isActive)
    {
        var instruction = await _context.AiCustomInstructions
            .FirstOrDefaultAsync(i => i.InstructionId == instructionId);

        if (instruction == null)
        {
            throw new ArgumentException($"Instruction with ID {instructionId} not found");
        }

        instruction.IsActive = isActive;
        instruction.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation($"Toggled AI instruction {instructionId} status to {isActive}");

        return await GetInstructionByIdAsync(instructionId) 
               ?? throw new InvalidOperationException("Failed to retrieve updated instruction");
    }

    #endregion

    #region Template Management

    public async Task<IEnumerable<AiCustomInstructionDTO>> GetTemplateInstructionsAsync()
    {
        var templates = await _context.AiCustomInstructions
            .Include(i => i.CreatedByUser)
                .ThenInclude(u => u.UserProfiles)
            .Where(i => i.IsDefault == true)
            .OrderBy(i => i.InstructionName)
            .ToListAsync();

        return templates.Select(MapToDTO);
    }

    public async Task<AiCustomInstructionDTO?> GetDefaultInstructionAsync()
    {
        var defaultInstruction = await _context.AiCustomInstructions
            .Include(i => i.CreatedByUser)
                .ThenInclude(u => u.UserProfiles)
            .FirstOrDefaultAsync(i => i.IsDefault == true && i.IsActive == true);

        return defaultInstruction != null ? MapToDTO(defaultInstruction) : null;
    }

    #endregion

    #region Helper Methods

    private static AiCustomInstructionDTO MapToDTO(AiCustomInstruction instruction)
    {
        return new AiCustomInstructionDTO
        {
            InstructionId = instruction.InstructionId,
            CreatedByUserId = instruction.CreatedByUserId,
            InstructionName = instruction.InstructionName,
            SystemPrompt = instruction.SystemPrompt,
            BehaviorInstructions = instruction.BehaviorInstructions,
            DataAccessRules = instruction.DataAccessRules,
            IsActive = instruction.IsActive ?? true,
            IsDefault = instruction.IsDefault ?? false,
            CreatedAt = instruction.CreatedAt ?? DateTime.UtcNow,
            UpdatedAt = instruction.UpdatedAt ?? DateTime.UtcNow,
            CreatedByUser = instruction.CreatedByUser != null ? new UserBasicInfoDTO
            {
                UserId = instruction.CreatedByUser.UserId,
                Email = instruction.CreatedByUser.Email,
                FullName = instruction.CreatedByUser.UserProfiles?.FirstOrDefault()?.FullName ?? instruction.CreatedByUser.Email
            } : null
        };
    }

    #endregion
}