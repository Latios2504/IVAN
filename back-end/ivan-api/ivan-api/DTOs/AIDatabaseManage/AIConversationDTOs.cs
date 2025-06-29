namespace ivan_api.DTOs.AIDatabaseManage;

// Conversation Management DTOs
public class AIConversationContextDTO
{
    public string ConversationId { get; set; } = string.Empty;
    public int UserId { get; set; }
    public int? InstructionId { get; set; }
    public string? InstructionName { get; set; }
    public Dictionary<string, object> SessionData { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiresAt { get; set; }
    public bool IsActive { get; set; } = true;
    public int MessageCount { get; set; } = 0;
}

public class ConversationHistoryDTO
{
    public int HistoryId { get; set; }
    public string ConversationId { get; set; } = string.Empty;
    public string Query { get; set; } = string.Empty;
    public string Response { get; set; } = string.Empty;
    public string QueryCategory { get; set; } = string.Empty;
    public int ExecutionTimeMs { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Dictionary<string, object> Metadata { get; set; } = new();
}

public class ConversationSummaryDTO
{
    public string ConversationId { get; set; } = string.Empty;
    public int TotalQueries { get; set; }
    public TimeSpan Duration { get; set; }
    public List<string> TopCategories { get; set; } = new();
    public List<string> KeyTopics { get; set; } = new();
    public double AverageResponseTime { get; set; }
    public string MainFocus { get; set; } = string.Empty;
    public List<string> Achievements { get; set; } = new();
}

public class AIConversationSummaryDTO
{
    public string ConversationId { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string LastMessage { get; set; } = string.Empty;
    public DateTime LastActivityDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public int MessageCount { get; set; }
    public string Status { get; set; } = "Active"; // Active, Ended, Archived
    public string? InstructionProfile { get; set; }
    public List<string> Categories { get; set; } = new();
}

public class ConversationAnalyticsDTO
{
    public string ConversationId { get; set; } = string.Empty;
    public int TotalQueries { get; set; }
    public int TotalResponseTime { get; set; }
    public double AverageResponseTime { get; set; }
    public Dictionary<string, int> QueryCategories { get; set; } = new();
    public Dictionary<string, int> ResponseQuality { get; set; } = new();
    public List<string> CommonTopics { get; set; } = new();
    public List<string> UserSatisfactionTrends { get; set; } = new();
    public DateTime AnalysisDate { get; set; } = DateTime.UtcNow;
    
    // Additional properties used in services
    public Dictionary<string, object> CategoryDistribution { get; set; } = new();
    public List<double> ResponseTimes { get; set; } = new();
    public List<string> FrequentTopics { get; set; } = new();
    public double EngagementScore { get; set; }
    public List<ConversationInsightDTO> Insights { get; set; } = new();
}

public class ConversationPatternDTO
{
    public string PatternId { get; set; } = string.Empty;
    public string ConversationId { get; set; } = string.Empty;
    public string PatternType { get; set; } = string.Empty; // "Frequent", "Seasonal", "Behavioral"
    public string Description { get; set; } = string.Empty;
    public double Frequency { get; set; }
    public List<string> KeyWords { get; set; } = new();
    public Dictionary<string, object> PatternData { get; set; } = new();
    public DateTime FirstOccurrence { get; set; }
    public DateTime LastOccurrence { get; set; }
    public double Confidence { get; set; }
    
    // Additional properties used in services
    public List<string> Examples { get; set; } = new();
    public string Recommendation { get; set; } = string.Empty;
}

public class ConversationInsightDTO
{
    public string InsightId { get; set; } = string.Empty;
    public string ConversationId { get; set; } = string.Empty;
    public string InsightType { get; set; } = string.Empty; // "Usage", "Satisfaction", "Efficiency"
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Dictionary<string, object> InsightData { get; set; } = new();
    public List<string> Recommendations { get; set; } = new();
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public double RelevanceScore { get; set; }

    // Additional properties used in services
    public string Type { get; set; } = string.Empty;
    public double Score { get; set; }
    public Dictionary<string, object> Data { get; set; } = new();
}

// Request/Response DTOs for conversation endpoints
public class StartConversationRequestDTO
{
    public int UserId { get; set; }
    public int? InstructionId { get; set; }
}

public class ContinueConversationRequestDTO
{
    public string ConversationId { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class UpdateConversationContextRequestDTO
{
    public Dictionary<string, object> SessionData { get; set; } = new();
}

public class AIConversationResponseDTO
{
    public string ConversationId { get; set; } = string.Empty;
    public string Response { get; set; } = string.Empty;
    public AIConversationContextDTO Context { get; set; } = new();
    public bool Success { get; set; } = true;
    public string? ErrorMessage { get; set; }
}
