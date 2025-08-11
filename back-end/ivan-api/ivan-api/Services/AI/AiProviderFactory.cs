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
}