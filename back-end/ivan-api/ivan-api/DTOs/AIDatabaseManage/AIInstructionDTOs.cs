namespace ivan_api.DTOs.AIDatabaseManage;

// AI Custom Instruction DTOs
public class AiCustomInstructionDTO
{
    public int InstructionId { get; set; }
    public int CreatedByUserId { get; set; }
    public string InstructionName { get; set; } = string.Empty;
    public string SystemPrompt { get; set; } = string.Empty;
    public string? BehaviorInstructions { get; set; }
    public string? DataAccessRules { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsDefault { get; set; } = false;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public UserBasicDTO? CreatedByUser { get; set; }
}

public class UserBasicDTO
{
    public int UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
}

public class AiCustomInstructionCreateDTO
{
    public string InstructionName { get; set; } = string.Empty;
    public string SystemPrompt { get; set; } = string.Empty;
    public string? BehaviorInstructions { get; set; }
    public string? DataAccessRules { get; set; }
}

public class AiCustomInstructionUpdateDTO : AiCustomInstructionCreateDTO
{
    public bool IsActive { get; set; } = true;
}

// AI Query Analytics DTOs
public class AiQueryAnalyticsDTO
{
    public int QueryId { get; set; }
    public int UserId { get; set; }
    public int? InstructionId { get; set; }
    public string QueryText { get; set; } = string.Empty;
    public int? ResponseQuality { get; set; }
    public int ExecutionTime { get; set; }
    public string? DataTablesAccessed { get; set; }
    public DateTime CreatedAt { get; set; }
}
