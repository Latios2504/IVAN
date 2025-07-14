namespace ivan_api.DTOs.AI;

/// <summary>
/// DTO for AI Custom Instruction entity
/// </summary>
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
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation properties
    public UserBasicInfoDTO? CreatedByUser { get; set; }
}

/// <summary>
/// DTO for creating AI Custom Instructions
/// </summary>
public class AiCustomInstructionCreateDTO
{
    public string InstructionName { get; set; } = string.Empty;
    public string SystemPrompt { get; set; } = string.Empty;
    public string? BehaviorInstructions { get; set; }
    public string? DataAccessRules { get; set; }
}

/// <summary>
/// DTO for updating AI Custom Instructions
/// </summary>
public class AiCustomInstructionUpdateDTO
{
    public string InstructionName { get; set; } = string.Empty;
    public string SystemPrompt { get; set; } = string.Empty;
    public string? BehaviorInstructions { get; set; }
    public string? DataAccessRules { get; set; }
    public bool IsActive { get; set; } = true;
}

/// <summary>
/// DTO for testing AI Instructions
/// </summary>
public class TestInstructionRequestDTO
{
    public string SampleQuery { get; set; } = string.Empty;
}

/// <summary>
/// DTO for testing AI Instructions with specific model
/// </summary>
public class TestInstructionWithModelRequestDTO
{
    public string SampleQuery { get; set; } = string.Empty;
    public string ModelName { get; set; } = string.Empty;
}

/// <summary>
/// DTO for test instruction response
/// </summary>
public class TestInstructionResponseDTO
{
    public string Response { get; set; } = string.Empty;
    public string ModelUsed { get; set; } = string.Empty;
    public int ExecutionTimeMs { get; set; }
    public bool Success { get; set; }
    public string? Error { get; set; }
    public DateTime TestedAt { get; set; } = DateTime.UtcNow;
    public bool IsCached { get; set; } = false; // Indicates if response came from cache
}

/// <summary>
/// DTO for AI Query Analytics
/// </summary>
public class AiQueryAnalyticsDTO
{
    public int IntentId { get; set; }
    public int UserId { get; set; }
    public string? ConversationId { get; set; }
    public string QueryText { get; set; } = string.Empty;
    public string? DetectedIntent { get; set; }
    public string? EntityMentions { get; set; }
    public bool? IsCorrect { get; set; }
    public string? CorrectedIntent { get; set; }
    public int? ProcessingTimeMs { get; set; }
    public int? ResponseQuality { get; set; }
    public string? DataTablesAccessed { get; set; }
    public int? InstructionId { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// DTO for Instruction Performance Metrics
/// </summary>
public class InstructionPerformanceDTO
{
    public int TotalQueries { get; set; }
    public double AverageExecutionTime { get; set; }
    public double AverageResponseQuality { get; set; }
    public int QueriesLast7Days { get; set; }
    public Dictionary<string, int> MostAccessedTables { get; set; } = new();
}

/// <summary>
/// Basic user info DTO for relationships
/// </summary>
public class UserBasicInfoDTO
{
    public int UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
}

/// <summary>
/// DTO for instruction status toggle
/// </summary>
public class ToggleInstructionStatusDTO
{
    public bool IsActive { get; set; }
}
