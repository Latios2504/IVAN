using ivan_api.Services.AI.Interfaces;

namespace ivan_api.Services.AI.Interfaces;

/// <summary>
/// Factory interface for creating and managing AI providers
/// </summary>
public interface IAiProviderFactory
{
    /// <summary>
    /// Get a provider by name
    /// </summary>
    Task<IAiProvider> GetProviderAsync(string providerName);

    /// <summary>
    /// Get the appropriate provider for a specific model
    /// </summary>
    Task<IAiProvider> GetProviderForModelAsync(string modelName);

    /// <summary>
    /// Get all registered providers
    /// </summary>
    Task<IEnumerable<IAiProvider>> GetAllProvidersAsync();

    /// <summary>
    /// Get all enabled providers
    /// </summary>
    Task<IEnumerable<IAiProvider>> GetEnabledProvidersAsync();

    /// <summary>
    /// Check if a provider is available
    /// </summary>
    Task<bool> IsProviderAvailableAsync(string providerName);

    /// <summary>
    /// Check if a model is supported by any provider
    /// </summary>
    Task<bool> IsModelSupportedAsync(string modelName);

    /// <summary>
    /// Get all available models grouped by provider
    /// </summary>
    Task<Dictionary<string, List<string>>> GetProviderModelsAsync();

    /// <summary>
    /// Refresh provider configuration
    /// </summary>
    Task RefreshProvidersAsync();
}