using ivan_api.Configuration;

namespace ivan_api.DTOs.AI;

/// <summary>
/// Result of an AI test operation
/// </summary>
public class AiTestResult
{
    public bool Success { get; set; }
    public string ProviderName { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Prompt { get; set; } = string.Empty;
    public string Response { get; set; } = string.Empty;
    public string? ErrorMessage { get; set; }
    public int ResponseTimeMs { get; set; }
    public int TokensUsed { get; set; }
    public DateTime TestedAt { get; set; } = DateTime.UtcNow;
    public Dictionary<string, object> Metadata { get; set; } = new();
}

/// <summary>
/// Request for testing multiple AI providers
/// </summary>
public class MultiModelTestRequest
{
    public string Prompt { get; set; } = string.Empty;
    public List<string> ProviderNames { get; set; } = new();
    public bool RunSimultaneously { get; set; } = true;
    public int TimeoutSeconds { get; set; } = 30;
    public Dictionary<string, string>? CustomModels { get; set; }
}

/// <summary>
/// Response from multi-model testing
/// </summary>
public class MultiModelTestResponse
{
    public string TestId { get; set; } = Guid.NewGuid().ToString();
    public List<AiTestResult> Results { get; set; } = new();
    public int TotalTestTimeMs { get; set; }
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime CompletedAt { get; set; }
    public string Status { get; set; } = "Completed";
}

/// <summary>
/// Request for database-integrated AI testing
/// </summary>
public class DatabaseIntegratedTestRequest
{
    public string Query { get; set; } = string.Empty;
    public List<string> ProviderNames { get; set; } = new();
    public bool IncludeDatabaseContext { get; set; } = true;
    public int MaxDatabaseRows { get; set; } = 100;
}

/// <summary>
/// AI playground session for tracking multiple tests
/// </summary>
public class AiPlaygroundSession
{
    public string SessionId { get; set; } = Guid.NewGuid().ToString();
    public int UserId { get; set; }
    public List<MultiModelTestResponse> TestHistory { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastActivity { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}

/// <summary>
/// Provider status for monitoring
/// </summary>
public class AiProviderStatus
{
    public string ProviderName { get; set; } = string.Empty;
    public AiProviderType ProviderType { get; set; }
    public bool IsEnabled { get; set; }
    public bool IsHealthy { get; set; }
    public string? LastError { get; set; }
    public DateTime LastChecked { get; set; }
    public AiProviderCapabilities Capabilities { get; set; } = new();
    public AiProviderUsageStats UsageStats { get; set; } = new();
}

/// <summary>
/// Provider capabilities for monitoring
/// </summary>
public class AiProviderCapabilities
{
    public bool SupportsStreaming { get; set; }
    public bool SupportsImageInput { get; set; }
    public bool SupportsFileInput { get; set; }
    public int MaxInputTokens { get; set; } = 1000;
    public int MaxOutputTokens { get; set; } = 1000;
    public List<string> SupportedModels { get; set; } = new();
}

/// <summary>
/// Usage statistics for rate limiting
/// </summary>
public class AiProviderUsageStats
{
    public int RequestsToday { get; set; }
    public int RequestsThisMinute { get; set; }
    public int TokensUsedToday { get; set; }
    public DateTime LastReset { get; set; } = DateTime.UtcNow.Date;
}
