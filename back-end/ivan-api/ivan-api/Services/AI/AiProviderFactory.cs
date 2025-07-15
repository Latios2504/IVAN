using ivan_api.Services.AI.Interfaces;
using ivan_api.Services.AI.Providers;

namespace ivan_api.Services.AI;

/// <summary>
/// Factory for creating and managing AI providers
/// </summary>
public class AiProviderFactory : IAiProviderFactory
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<AiProviderFactory> _logger;
    private readonly Dictionary<string, IAiProvider> _providers;
    private readonly Dictionary<string, string> _modelToProviderMapping;

    public AiProviderFactory(IServiceProvider serviceProvider, ILogger<AiProviderFactory> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _providers = new Dictionary<string, IAiProvider>();
        _modelToProviderMapping = new Dictionary<string, string>();
        
        InitializeProviders();
        InitializeModelMappings();
    }

    public async Task<IAiProvider> GetProviderAsync(string providerName)
    {
        if (_providers.TryGetValue(providerName, out var provider))
        {
            return await Task.FromResult(provider);
        }

        throw new ArgumentException($"Provider '{providerName}' not found or not enabled");
    }

    public async Task<IAiProvider> GetProviderForModelAsync(string modelName)
    {
        var providerName = GetProviderNameForModel(modelName);
        return await GetProviderAsync(providerName);
    }

    public async Task<IEnumerable<IAiProvider>> GetAllProvidersAsync()
    {
        return await Task.FromResult(_providers.Values);
    }

    public async Task<IEnumerable<IAiProvider>> GetEnabledProvidersAsync()
    {
        var enabledProviders = _providers.Values.Where(p => p.IsEnabled);
        return await Task.FromResult(enabledProviders);
    }

    public async Task<bool> IsProviderAvailableAsync(string providerName)
    {
        if (_providers.TryGetValue(providerName, out var provider))
        {
            return await Task.FromResult(provider.IsEnabled);
        }
        return await Task.FromResult(false);
    }

    public async Task<bool> IsModelSupportedAsync(string modelName)
    {
        var providerName = GetProviderNameForModel(modelName);
        return await IsProviderAvailableAsync(providerName);
    }

    public async Task<Dictionary<string, List<string>>> GetProviderModelsAsync()
    {
        var providerModels = new Dictionary<string, List<string>>();
        
        foreach (var provider in _providers.Values.Where(p => p.IsEnabled))
        {
            try
            {
                var models = await provider.GetAvailableModelsAsync();
                providerModels[provider.ProviderName] = models;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, $"Failed to get models from provider {provider.ProviderName}");
                providerModels[provider.ProviderName] = new List<string>();
            }
        }

        return providerModels;
    }

    public async Task RefreshProvidersAsync()
    {
        _providers.Clear();
        _modelToProviderMapping.Clear();
        
        InitializeProviders();
        InitializeModelMappings();
        
        _logger.LogInformation("AI providers refreshed successfully");
        await Task.CompletedTask;
    }

    private void InitializeProviders()
    {
        try
        {
            // Get Gemini provider
            var geminiProvider = _serviceProvider.GetService<GeminiAiProvider>();
            if (geminiProvider != null && geminiProvider.IsEnabled)
            {
                _providers[geminiProvider.ProviderName] = geminiProvider;
                _logger.LogDebug($"Registered AI provider: {geminiProvider.ProviderName}");
            }

            // Get OpenRouter provider
            var openRouterProvider = _serviceProvider.GetService<OpenRouterAiProvider>();
            if (openRouterProvider != null && openRouterProvider.IsEnabled)
            {
                _providers[openRouterProvider.ProviderName] = openRouterProvider;
                _logger.LogDebug($"Registered AI provider: {openRouterProvider.ProviderName}");
            }

            _logger.LogInformation($"AI providers initialized: {_providers.Count} providers available");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initializing AI providers");
        }
    }

    private void InitializeModelMappings()
    {
        // Define model to provider mappings
        // This could be made configurable via appsettings.json
        var mappings = new Dictionary<string, string>
        {
            // Gemini models
            { "gemini-2.5-flash", "Gemini" },
            { "gemini-1.5-pro", "Gemini" },
            { "gemini-1.5-flash", "Gemini" },
            { "gemini-pro", "Gemini" },
            { "gemini-pro-vision", "Gemini" },
            
            // OpenRouter models
            { "deepseek/deepseek-r1:free", "OpenRouter" },
            { "deepseek/deepseek-chat-v3-0324:free", "OpenRouter" },
            { "microsoft/phi-3-mini-4k-instruct:free", "OpenRouter" },
            { "google/gemma-2b-it:free", "OpenRouter" },
            { "meta-llama/llama-3-8b-instruct:free", "OpenRouter" },
            { "mistralai/mistral-7b-instruct:free", "OpenRouter" },
            { "huggingface/zephyr-7b-beta:free", "OpenRouter" },
            { "openchat/openchat-7b:free", "OpenRouter" },
            { "gryphe/mythomist-7b:free", "OpenRouter" },
            { "undi95/toppy-m-7b:free", "OpenRouter" }
        };

        foreach (var mapping in mappings)
        {
            _modelToProviderMapping[mapping.Key] = mapping.Value;
        }

        _logger.LogDebug($"Initialized {_modelToProviderMapping.Count} model-to-provider mappings");
    }

    private string GetProviderNameForModel(string modelName)
    {
        if (_modelToProviderMapping.TryGetValue(modelName, out var providerName))
        {
            return providerName;
        }

        // Fallback logic for pattern matching
        if (modelName.StartsWith("gemini", StringComparison.OrdinalIgnoreCase))
        {
            return "Gemini";
        }
        
        if (modelName.Contains("/") || modelName.Contains("deepseek"))
        {
            return "OpenRouter";
        }

        // Default fallback
        return "Gemini";
    }
}