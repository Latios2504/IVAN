namespace ivan_api.DTOs.AI;

/// <summary>
/// Result of an AI test/prompt request
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