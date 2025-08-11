using ivan_api.Configuration;

namespace ivan_api.Services.AI.Interfaces;

/// <summary>
/// Result of an AI test/prompt request - Used internally by providers
/// </summary>
public class AiTestResult
{
    public string ProviderName { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Prompt { get; set; } = string.Empty;
    public string Response { get; set; } = string.Empty;
    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }
    public int ResponseTimeMs { get; set; }
    public int TokensUsed { get; set; }
}

/// <summary>
/// Interface for AI providers supporting different models (Gemini, OpenRouter, etc.)
/// </summary>
public interface IAiProvider
{
    string ProviderName { get; }
    AiProviderType ProviderType { get; }
    bool IsEnabled { get; }
    
    /// <summary>
    /// Send a simple prompt to the AI provider
    /// </summary>
    Task<AiTestResult> SendPromptAsync(string prompt, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Send a prompt to the AI provider with a specific model
    /// </summary>
    Task<AiTestResult> SendPromptAsync(string prompt, string? modelName = null, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Test connectivity and basic functionality
    /// </summary>
    
    /// <summary>
    /// Get available models for this provider
    /// </summary>
    Task<List<string>> GetAvailableModelsAsync(CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Get provider capabilities and limitations
    /// </summary>
    AiProviderCapabilities GetCapabilities();
}

/// <summary>
/// Provider health check result
/// </summary>
public class AiProviderHealthCheck
{
    public bool IsHealthy { get; set; }
    public string? ErrorMessage { get; set; }
    public int ResponseTimeMs { get; set; }
    public DateTime CheckedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Provider capabilities and limitations
/// </summary>
public class AiProviderCapabilities
{
    public int MaxTokens { get; set; }
    public int RequestsPerMinute { get; set; }
    public int RequestsPerDay { get; set; }
    public List<string> SupportedModels { get; set; } = new();
    public bool SupportsStreaming { get; set; }
    public bool SupportsFunctionCalling { get; set; }
}
