namespace ivan_api.DTOs.AIDatabaseManage;

// AI Database Request/Response DTOs
public class AIDatabaseRequestDTO
{
    public string Query { get; set; } = string.Empty;
    public string QueryCategory { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string? InstructionProfile { get; set; }
}

public class AIDatabaseResponseDTO
{
    public bool Success { get; set; }
    public string Data { get; set; } = string.Empty;
    public string QueryCategory { get; set; } = string.Empty;
    public string TablesAccessed { get; set; } = string.Empty;
    public int ExecutionTimeMs { get; set; }
    public string? ErrorMessage { get; set; }
}

// Database Summary DTOs
public class DatabaseSummaryDTO
{
    public string Summary { get; set; } = string.Empty;
    public Dictionary<string, object> Data { get; set; } = new();
    public List<string> TablesIncluded { get; set; } = new();
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
}

public class DataSummaryDTO
{
    public string Summary { get; set; } = string.Empty;
    public Dictionary<string, object> KeyMetrics { get; set; } = new();
    public List<string> DataSources { get; set; } = new();
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public int DataFreshness { get; set; } // Minutes since last update
}

// Enhanced Chat Message DTOs with AI Instructions
public class EnhancedChatMessageRequestDTO : ChatMessageRequestDTO
{
    public string? InstructionProfile { get; set; }
    public bool IncludeDatabaseContext { get; set; } = true;
}

public class EnhancedChatMessageResponseDTO : ChatMessageResponseDTO
{
    public string? InstructionUsed { get; set; }
    public List<string>? TablesAccessed { get; set; }
    public int ExecutionTimeMs { get; set; }
    public string? QueryCategory { get; set; }
}
