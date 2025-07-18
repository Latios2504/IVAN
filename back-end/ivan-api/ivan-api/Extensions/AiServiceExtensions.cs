using ivan_api.Configuration;
using ivan_api.Services.AI;
using ivan_api.Services.AI.Interfaces;
using ivan_api.Services.AI.Providers;
using ivan_api.Services.AI.SQLGenerator.Interfaces;
using ivan_api.Services.AI.SQLGenerator.Services;

namespace ivan_api.Extensions;

/// <summary>
/// Extension methods for registering AI services 
/// </summary>
public static class AiServiceExtensions
{
    /// <summary>
    /// Add AI services to the DI container
    /// </summary>
    public static IServiceCollection AddAiServices(this IServiceCollection services, IConfiguration configuration)
    {
        // AI Configuration - Configure each provider separately
        services.Configure<AiModelConfiguration>("Gemini", configuration.GetSection("AiProviders:Gemini"));
        services.Configure<AiModelConfiguration>("OpenRouter", configuration.GetSection("AiProviders:OpenRouter"));
        
        // AI Providers - Register as named services to avoid conflicts
        services.AddHttpClient<GeminiAiProvider>();
        services.AddHttpClient<OpenRouterAiProvider>();
        services.AddScoped<GeminiAiProvider>();
        services.AddScoped<OpenRouterAiProvider>();
        
        // Register providers as IAiProvider for factory injection
        services.AddScoped<IAiProvider>(serviceProvider => serviceProvider.GetRequiredService<GeminiAiProvider>());
        services.AddScoped<IAiProvider>(serviceProvider => serviceProvider.GetRequiredService<OpenRouterAiProvider>());
        
        // Register AI services
        services.AddScoped<IAiProviderFactory, AiProviderFactory>();
        services.AddScoped<ISqlExecutionService, SqlExecutionService>();
        services.AddScoped<IAiCustomInstructionService, AiCustomInstructionService>();
        
        return services;
    }
    
    /// <summary>
    /// Validate AI configuration after DI container is built
    /// </summary>
    public static void ValidateAiConfiguration(this IServiceProvider services)
    {
        try
        {
            var logger = services.GetRequiredService<ILogger<object>>();
            var providerFactory = services.GetRequiredService<IAiProviderFactory>();
            
            // Validate that at least one AI provider is configured
            var providers = providerFactory.GetEnabledProvidersAsync().Result;
            if (providers.Count == 0)
            {
                logger.LogWarning("No AI providers are configured. AI functionality will be limited.");
            }
            else
            {
                logger.LogInformation("AI services initialized with {ProviderCount} providers", providers.Count);
            }
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<object>>();
            logger.LogError(ex, "Error validating AI configuration");
        }
    }
}
