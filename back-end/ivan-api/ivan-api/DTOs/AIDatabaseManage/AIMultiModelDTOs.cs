namespace ivan_api.DTOs.AIDatabaseManage;

// Multi-Model AI DTOs
public class AIModelConfigurationDTO
{
    public string ModelId { get; set; } = string.Empty;
    public string ModelName { get; set; } = string.Empty;
    public string Provider { get; set; } = string.Empty; // "Gemini", "GPT", "Claude", etc.
    public string ModelType { get; set; } = string.Empty; // "Chat", "Analysis", "Embedding"
    public bool IsActive { get; set; } = true;
    public bool IsFallback { get; set; } = false;
    public int Priority { get; set; } = 1;
    public Dictionary<string, object> Configuration { get; set; } = new();
    public List<string> SupportedCategories { get; set; } = new();
}

public class AIModelResponseDTO
{
    public string ModelUsed { get; set; } = string.Empty;
    public string Response { get; set; } = string.Empty;
    public int ExecutionTimeMs { get; set; }
    public double ConfidenceScore { get; set; }
    public bool IsFallbackUsed { get; set; } = false;
    public Dictionary<string, object> ModelMetadata { get; set; } = new();
}

public class IntelligentRecommendationDTO
{
    public string RecommendationId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Priority { get; set; } = "Medium";
    public string RecommendationType { get; set; } = string.Empty; // "Process", "Training", "Resource", "Alert"
    public List<string> ActionSteps { get; set; } = new();
    public Dictionary<string, object> SupportingData { get; set; } = new();
    public DateTime RelevantUntil { get; set; } = DateTime.UtcNow.AddDays(7);
    public bool IsAutomatable { get; set; } = false;
    public List<string> Tags { get; set; } = new();
}
