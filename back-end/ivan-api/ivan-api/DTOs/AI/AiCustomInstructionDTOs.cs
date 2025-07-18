using System.ComponentModel.DataAnnotations;

namespace ivan_api.DTOs.AI;

/// <summary>
/// Data Transfer Object for AI Custom Instructions
/// </summary>
public class AiCustomInstructionDTO
{
    public int InstructionId { get; set; }
    public string InstructionName { get; set; } = string.Empty;
    public string SystemPrompt { get; set; } = string.Empty;
    public string? BehaviorInstructions { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// DTO for creating a new AI custom instruction
/// </summary>
public class AiCustomInstructionCreateDTO
{
    [Required(ErrorMessage = "Instruction name is required")]
    [StringLength(200, ErrorMessage = "Instruction name cannot exceed 200 characters")]
    public string InstructionName { get; set; } = string.Empty;

    [Required(ErrorMessage = "System prompt is required")]
    public string SystemPrompt { get; set; } = string.Empty;

    public string? BehaviorInstructions { get; set; }
}

/// <summary>
/// DTO for updating an existing AI custom instruction
/// </summary>
public class AiCustomInstructionUpdateDTO
{
    [Required(ErrorMessage = "Instruction name is required")]
    [StringLength(200, ErrorMessage = "Instruction name cannot exceed 200 characters")]
    public string InstructionName { get; set; } = string.Empty;

    [Required(ErrorMessage = "System prompt is required")]
    public string SystemPrompt { get; set; } = string.Empty;

    public string? BehaviorInstructions { get; set; }
    public bool IsActive { get; set; } = true;
}

/// <summary>
/// DTO for toggling instruction status
/// </summary>
public class ToggleInstructionStatusDTO
{
    public bool IsActive { get; set; }
} 