namespace ivan_api.Configuration;

/// <summary>
/// Multi-model AI configuration supporting multiple providers (Gemini, OpenRouter, etc.)
/// </summary>
public class AiModelConfiguration
{
    public string Name { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = string.Empty;
    public string DefaultModel { get; set; } = string.Empty;
    public List<string> AvailableModels { get; set; } = new();
    public int MaxTokens { get; set; } = 1000;
    public double Temperature { get; set; } = 0.7;
    public bool IsEnabled { get; set; } = true;
    public AiProviderType ProviderType { get; set; }
    
    // Rate limiting for free tiers
    public int RequestsPerMinute { get; set; } = 15;
    public int RequestsPerDay { get; set; } = 1000;
}

/// <summary>
/// AI Provider types supported
/// </summary>
public enum AiProviderType
{
    Gemini,
    OpenRouter,
    Custom
}
