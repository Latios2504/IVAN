using ivan_api.Services.AI.Interfaces;

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

    /// <summary>
    /// Get provider that supports a specific model
    /// </summary>
    Task<IAiProvider?> GetProviderForModelAsync(string modelName);

    /// <summary>
    /// Get all available models from all enabled providers
    /// </summary>
    Task<Dictionary<string, List<string>>> GetProviderModelsAsync();

    /// <summary>
    /// Get all providers (enabled and disabled)
    /// </summary>
    Task<List<IAiProvider>> GetAllProvidersAsync();

    /// <summary>
    /// Test a specific provider
    /// </summary>
    Task<bool> TestProviderAsync(string providerName);
}