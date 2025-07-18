using ivan_api.Services.AI.Interfaces;
using Microsoft.Extensions.Logging;

namespace ivan_api.Services.AI;

/// <summary>
/// Factory for creating and managing AI providers
/// </summary>
public class AiProviderFactory : IAiProviderFactory
{
    private readonly IEnumerable<IAiProvider> _providers;
    private readonly ILogger<AiProviderFactory> _logger;

    public AiProviderFactory(
        IEnumerable<IAiProvider> providers,
        ILogger<AiProviderFactory> logger)
    {
        _providers = providers;
        _logger = logger;
    }

    /// <summary>
    /// Get all enabled AI providers
    /// </summary>
    public async Task<List<IAiProvider>> GetEnabledProvidersAsync()
    {
        try
        {
            var enabledProviders = new List<IAiProvider>();
            
            foreach (var provider in _providers)
            {
                if (provider.IsEnabled)
                {
                    enabledProviders.Add(provider);
                }
            }

            if (!enabledProviders.Any())
            {
                _logger.LogWarning("No enabled AI providers found");
            }

            return enabledProviders;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting enabled AI providers");
            return new List<IAiProvider>();
        }
    }

    /// <summary>
    /// Get a specific provider by name
    /// </summary>
    public async Task<IAiProvider?> GetProviderAsync(string providerName)
    {
        try
        {
            return _providers.FirstOrDefault(p => 
                p.ProviderName.Equals(providerName, StringComparison.OrdinalIgnoreCase) && 
                p.IsEnabled);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting provider {ProviderName}", providerName);
            return null;
        }
    }

    /// <summary>
    /// Get provider that supports a specific model
    /// </summary>
    public async Task<IAiProvider?> GetProviderForModelAsync(string modelName)
    {
        try
        {
            foreach (var provider in _providers.Where(p => p.IsEnabled))
            {
                var models = await provider.GetAvailableModelsAsync();
                if (models.Contains(modelName))
                {
                    return provider;
                }
            }

            _logger.LogWarning("No provider found for model {ModelName}", modelName);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error finding provider for model {ModelName}", modelName);
            return null;
        }
    }

    /// <summary>
    /// Get all available models from all enabled providers
    /// </summary>
    public async Task<Dictionary<string, List<string>>> GetProviderModelsAsync()
    {
        var providerModels = new Dictionary<string, List<string>>();

        try
        {
            foreach (var provider in _providers.Where(p => p.IsEnabled))
            {
                var models = await provider.GetAvailableModelsAsync();
                providerModels[provider.ProviderName] = models;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting provider models");
        }

        return providerModels;
    }

    /// <summary>
    /// Get all providers (enabled and disabled)
    /// </summary>
    public async Task<List<IAiProvider>> GetAllProvidersAsync()
    {
        return _providers.ToList();
    }

    /// <summary>
    /// Test a specific provider
    /// </summary>
    public async Task<bool> TestProviderAsync(string providerName)
    {
        try
        {
            var provider = await GetProviderAsync(providerName);
            if (provider == null)
            {
                return false;
            }

            var testResult = await provider.SendPromptAsync("Test message", cancellationToken: CancellationToken.None);
            return testResult.Success;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error testing provider {ProviderName}", providerName);
            return false;
        }
    }
}