using ivan_api.Configuration;
using ivan_api.Services.AI;
using ivan_api.Services.AI.Interfaces;
using ivan_api.Services.AI.Providers;

namespace ivan_api.Extensions;

/// <summary>
/// Extension methods for configuring AI services
/// </summary>
public static class AiServiceExtensions
{
    /// <summary>
    /// Add simplified AI services with multi-model support
    /// </summary>
    public static IServiceCollection AddSimplifiedAiServices(
        this IServiceCollection services, 
        IConfiguration configuration)
    {
        // Configure AI testing settings
        var aiTestingConfig = new AiTestingConfiguration();
        configuration.GetSection("AiTesting").Bind(aiTestingConfig);
        services.AddSingleton(aiTestingConfig);

        // Configure AI providers from appsettings
        var aiProvidersSection = configuration.GetSection("AiProviders");
        
        // Configure Gemini provider
        var geminiConfig = new AiModelConfiguration
        {
            Name = "Gemini",
            ProviderType = AiProviderType.Gemini,
            DefaultModel = "gemini-2.5-flash",
            MaxTokens = 1000,
            Temperature = 0.7,
            RequestsPerMinute = 15,
            RequestsPerDay = 1000,
            IsEnabled = true
        };
        
        aiProvidersSection.GetSection("Gemini").Bind(geminiConfig);
        aiTestingConfig.Providers["Gemini"] = geminiConfig;
        
        // Configure OpenRouter provider
        var openRouterConfig = new AiModelConfiguration
        {
            Name = "OpenRouter",
            ProviderType = AiProviderType.OpenRouter,
            DefaultModel = "deepseek/deepseek-chat-v3-0324:free",
            MaxTokens = 1000,
            Temperature = 0.7,
            RequestsPerMinute = 10,
            RequestsPerDay = 500,
            IsEnabled = true
        };
        
        aiProvidersSection.GetSection("OpenRouter").Bind(openRouterConfig);
        aiTestingConfig.Providers["OpenRouter"] = openRouterConfig;

        // Register HTTP clients for AI providers
        services.AddHttpClient<GeminiAiProvider>(client =>
        {
            client.Timeout = TimeSpan.FromSeconds(30);
            client.DefaultRequestHeaders.Add("User-Agent", "IVAN-AI-Testing/1.0");
        });

        services.AddHttpClient<OpenRouterAiProvider>(client =>
        {
            client.Timeout = TimeSpan.FromSeconds(30);
            client.DefaultRequestHeaders.Add("User-Agent", "IVAN-AI-Testing/1.0");
        });

        // Register AI providers as specific types AND as IAiProvider interface
        
        services.AddSingleton<GeminiAiProvider>(provider =>
        {
            var httpClientFactory = provider.GetRequiredService<IHttpClientFactory>();
            var logger = provider.GetRequiredService<ILogger<GeminiAiProvider>>();
            var httpClient = httpClientFactory.CreateClient(nameof(GeminiAiProvider));
            
            // Make sure configuration is properly bound
            var configuration = provider.GetRequiredService<IConfiguration>();
            var geminiSection = configuration.GetSection("AiProviders:Gemini");
            var geminiConfigLocal = new AiModelConfiguration
            {
                Name = "Gemini",
                ProviderType = AiProviderType.Gemini,
                DefaultModel = "gemini-2.5-flash",
                MaxTokens = 1000,
                Temperature = 0.7,
                RequestsPerMinute = 15,
                RequestsPerDay = 1000,
                IsEnabled = true
            };
            geminiSection.Bind(geminiConfigLocal);
            
            var geminiProvider = new GeminiAiProvider(httpClient, geminiConfigLocal, logger);
            return geminiProvider;
        });

        services.AddSingleton<OpenRouterAiProvider>(provider =>
        {
            var httpClientFactory = provider.GetRequiredService<IHttpClientFactory>();
            var logger = provider.GetRequiredService<ILogger<OpenRouterAiProvider>>();
            var httpClient = httpClientFactory.CreateClient(nameof(OpenRouterAiProvider));
            
            // Make sure configuration is properly bound
            var configuration = provider.GetRequiredService<IConfiguration>();
            var openRouterSection = configuration.GetSection("AiProviders:OpenRouter");
            var openRouterConfigLocal = new AiModelConfiguration
            {
                Name = "OpenRouter",
                ProviderType = AiProviderType.OpenRouter,
                DefaultModel = "deepseek/deepseek-chat-v3-0324:free",
                MaxTokens = 1000,
                Temperature = 0.7,
                RequestsPerMinute = 10,
                RequestsPerDay = 500,
                IsEnabled = true  // Enable OpenRouter
            };
            openRouterSection.Bind(openRouterConfigLocal);
            
            var openRouterProvider = new OpenRouterAiProvider(httpClient, openRouterConfigLocal, logger);
            return openRouterProvider;
        });

        // Also register them as IAiProvider for services that need the interface
        services.AddSingleton<IAiProvider>(provider => 
        {
            return provider.GetRequiredService<GeminiAiProvider>();
        });
        services.AddSingleton<IAiProvider>(provider => 
        {
            return provider.GetRequiredService<OpenRouterAiProvider>();
        });
        
        // Register main testing service as scoped (database context dependency)
        services.AddScoped<AiTestingPlaygroundService>();

        // Register new modular AI services
        services.AddScoped<IAiInstructionsCrudService, AiInstructionsCrudService>();
        services.AddScoped<IAiInstructionsTestingService, AiInstructionsTestingService>();
        services.AddScoped<IAiInstructionsAnalyticsService, AiInstructionsAnalyticsService>();
        services.AddSingleton<IAiResponseCacheService, AiResponseCacheService>();
        services.AddSingleton<IAiProviderFactory, AiProviderFactory>();

        // Register original AI Instructions service (now orchestrates the new services)
        services.AddScoped<IAiInstructionsService, AiInstructionsService>();

        return services;
    }

    /// <summary>
    /// Add legacy database-driven AI services (for complex configurations)
    /// </summary>
    public static IServiceCollection AddLegacyAiServices(
        this IServiceCollection services, 
        IConfiguration configuration)
    {
        // This method can be implemented later for database-driven configurations
        // For now, use the simplified approach
        return AddSimplifiedAiServices(services, configuration);
    }

    /// <summary>
    /// Initialize AI providers after service container is built
    /// </summary>
    public static void InitializeAiProviders(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        
        try
        {
            var aiTestingService = scope.ServiceProvider.GetRequiredService<AiTestingPlaygroundService>();
            aiTestingService.InitializeProviders();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error initializing AI providers: {ex.Message}");
        }
    }
}
