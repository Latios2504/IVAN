namespace ivan_api.Services.AI.Interfaces;

/// <summary>
/// Factory interface for creating and managing AI providers
/// </summary>
public interface IAiProviderFactory
{
    /// <summary>
    /// Get all enabled AI providers
    /// </summary>
    Task<List<IAiProvider>> GetEnabledProvidersAsync();

    /// <summary>
    /// Get a specific provider by name
    /// </summary>
    Task<IAiProvider?> GetProviderAsync(string providerName);
}