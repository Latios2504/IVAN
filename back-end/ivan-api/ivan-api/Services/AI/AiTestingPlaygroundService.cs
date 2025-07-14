using ivan_api.DTOs.AI;
using ivan_api.Services.AI.Interfaces;
using ivan_api.Services.AI.Providers;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services.AI;

/// <summary>
/// Service for managing multi-model AI testing playground
/// </summary>
public class AiTestingPlaygroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly VolunteerManagementSystemContext _context;
    private readonly ILogger<AiTestingPlaygroundService> _logger;
    private readonly Dictionary<string, IAiProvider> _providers;
    private volatile bool _providersInitialized = false;
    private readonly object _initializationLock = new object();

    public AiTestingPlaygroundService(
        IServiceProvider serviceProvider, 
        VolunteerManagementSystemContext context,
        ILogger<AiTestingPlaygroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _context = context;
        _logger = logger;
        _providers = new Dictionary<string, IAiProvider>();
    }

    /// <summary>
    /// Initialize providers from DI container
    /// </summary>
    public void InitializeProviders()
    {
        try
        {
            // Clear existing providers to avoid duplicates
            _providers.Clear();
            
            // Get specific provider types from DI
            var geminiProvider = _serviceProvider.GetService<GeminiAiProvider>();
            if (geminiProvider != null)
            {
                _providers[geminiProvider.ProviderName] = geminiProvider;
                _logger.LogDebug($"Registered AI provider: {geminiProvider.ProviderName}");
            }

            var openRouterProvider = _serviceProvider.GetService<OpenRouterAiProvider>();
            if (openRouterProvider != null)
            {
                _providers[openRouterProvider.ProviderName] = openRouterProvider;
                _logger.LogDebug($"Registered AI provider: {openRouterProvider.ProviderName}");
            }

            _logger.LogInformation($"AI providers initialized successfully: {_providers.Count} providers available");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initializing AI providers");
        }
    }

    /// <summary>
    /// Ensure providers are loaded (call this at the start of methods that need providers)
    /// </summary>
    private void EnsureProvidersLoaded()
    {
        if (!_providersInitialized)
        {
            lock (_initializationLock)
            {
                if (!_providersInitialized)
                {
                    _logger.LogDebug("Providers not loaded, initializing...");
                    InitializeProviders();
                    _providersInitialized = true;
                }
            }
        }
    }

    /// <summary>
    /// Test multiple AI providers with the same prompt
    /// </summary>
    public async Task<MultiModelTestResponse> TestMultipleProvidersAsync(
        MultiModelTestRequest request, 
        CancellationToken cancellationToken = default)
    {
        EnsureProvidersLoaded(); // Ensure providers are loaded
        
        var response = new MultiModelTestResponse();
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();

        try
        {
            var tasks = new List<Task<AiTestResult>>();
            var providersToTest = request.ProviderNames.Any() 
                ? _providers.Where(p => request.ProviderNames.Contains(p.Key))
                : _providers;

            foreach (var provider in providersToTest)
            {
                if (provider.Value.IsEnabled)
                {
                    // Check if there's a custom model specified for this provider
                    string? customModel = null;
                    if (request.CustomModels != null && request.CustomModels.ContainsKey(provider.Key))
                    {
                        customModel = request.CustomModels[provider.Key];
                        _logger.LogInformation($"Using custom model '{customModel}' for provider '{provider.Key}'");
                    }

                    if (request.RunSimultaneously)
                    {
                        tasks.Add(provider.Value.SendPromptAsync(request.Prompt, customModel, cancellationToken));
                    }
                    else
                    {
                        var result = await provider.Value.SendPromptAsync(request.Prompt, customModel, cancellationToken);
                        response.Results.Add(result);
                    }
                }
            }

            if (request.RunSimultaneously && tasks.Any())
            {
                using var timeoutCts = new CancellationTokenSource(TimeSpan.FromSeconds(request.TimeoutSeconds));
                using var combinedCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken, timeoutCts.Token);

                try
                {
                    var results = await Task.WhenAll(tasks);
                    response.Results.AddRange(results);
                }
                catch (OperationCanceledException)
                {
                    _logger.LogWarning("Multi-model test timed out after {TimeoutSeconds} seconds", request.TimeoutSeconds);
                    
                    // Collect completed results
                    foreach (var task in tasks.Where(t => t.IsCompletedSuccessfully))
                    {
                        response.Results.Add(task.Result);
                    }
                    
                    // Add timeout results for incomplete tasks
                    foreach (var task in tasks.Where(t => !t.IsCompletedSuccessfully))
                    {
                        response.Results.Add(new AiTestResult
                        {
                            Success = false,
                            ErrorMessage = "Test timed out",
                            Prompt = request.Prompt,
                            ResponseTimeMs = request.TimeoutSeconds * 1000
                        });
                    }
                }
            }

            stopwatch.Stop();
            response.TotalTestTimeMs = (int)stopwatch.ElapsedMilliseconds;
            response.CompletedAt = DateTime.UtcNow;
            response.Status = response.Results.Any(r => r.Success) ? "Completed" : "Failed";

            _logger.LogInformation($"Multi-model test completed: {response.Results.Count} results in {response.TotalTestTimeMs}ms");
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            _logger.LogError(ex, "Error during multi-model testing");
            response.Status = "Error";
            response.TotalTestTimeMs = (int)stopwatch.ElapsedMilliseconds;
        }

        return response;
    }

    /// <summary>
    /// Test providers with database context
    /// </summary>
    public async Task<MultiModelTestResponse> TestWithDatabaseContextAsync(
        DatabaseIntegratedTestRequest request,
        CancellationToken cancellationToken = default)
    {
        var contextPrompt = request.Query;

        if (request.IncludeDatabaseContext)
        {
            contextPrompt = await BuildDatabaseContextPrompt(request.Query, request.MaxDatabaseRows);
        }

        var multiModelRequest = new MultiModelTestRequest
        {
            Prompt = contextPrompt,
            ProviderNames = request.ProviderNames,
            RunSimultaneously = true,
            TimeoutSeconds = 45 // Longer timeout for database queries
        };

        return await TestMultipleProvidersAsync(multiModelRequest, cancellationToken);
    }

    /// <summary>
    /// Get status of all providers (configuration-based, no API calls)
    /// </summary>
    public async Task<List<AiProviderStatus>> GetProviderStatusAsync(CancellationToken cancellationToken = default)
    {
        EnsureProvidersLoaded(); // Ensure providers are loaded
        
        var statuses = new List<AiProviderStatus>();

        _logger.LogDebug($"GetProviderStatusAsync: Found {_providers.Count} providers (reading from configuration, no API calls)");

        foreach (var provider in _providers.Values)
        {
            try
            {
                // Get provider capabilities without making API calls
                var providerCapabilities = provider.GetCapabilities();
                
                // Mock health status based on configuration - providers are considered healthy if enabled
                // This avoids making expensive API calls that cause rate limits and costs
                var status = new AiProviderStatus
                {
                    ProviderName = provider.ProviderName,
                    ProviderType = provider.ProviderType,
                    IsEnabled = provider.IsEnabled,
                    IsHealthy = provider.IsEnabled, // Consider enabled providers as healthy (avoids API calls)
                    LastError = provider.IsEnabled ? null : "Provider is disabled in configuration",
                    LastChecked = DateTime.UtcNow,
                    Capabilities = new DTOs.AI.AiProviderCapabilities
                    {
                        SupportsStreaming = providerCapabilities.SupportsStreaming,
                        SupportsImageInput = false, // Default for now
                        SupportsFileInput = false, // Default for now
                        MaxInputTokens = providerCapabilities.MaxTokens,
                        MaxOutputTokens = providerCapabilities.MaxTokens,
                        SupportedModels = providerCapabilities.SupportedModels
                    },
                    UsageStats = new DTOs.AI.AiProviderUsageStats
                    {
                        RequestsToday = 0,
                        RequestsThisMinute = 0,
                        TokensUsedToday = 0,
                        LastReset = DateTime.UtcNow.Date
                    }
                };
                
                statuses.Add(status);
                _logger.LogDebug($"Provider {provider.ProviderName}: Enabled={provider.IsEnabled}, Mocked Health={provider.IsEnabled}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error reading provider {provider.ProviderName} configuration");
                statuses.Add(new AiProviderStatus
                {
                    ProviderName = provider.ProviderName,
                    ProviderType = provider.ProviderType,
                    IsEnabled = false,
                    IsHealthy = false,
                    LastError = ex.Message,
                    LastChecked = DateTime.UtcNow,
                    Capabilities = new DTOs.AI.AiProviderCapabilities(),
                    UsageStats = new DTOs.AI.AiProviderUsageStats
                    {
                        RequestsToday = 0,
                        RequestsThisMinute = 0,
                        TokensUsedToday = 0,
                        LastReset = DateTime.UtcNow.Date
                    }
                });
            }
        }

        return await Task.FromResult(statuses);
    }

    /// <summary>
    /// Build context prompt with relevant database information
    /// </summary>
    private async Task<string> BuildDatabaseContextPrompt(string userQuery, int maxRows = 100)
    {
        try
        {
            var contextBuilder = new System.Text.StringBuilder();
            contextBuilder.AppendLine("Database Context Information:");
            contextBuilder.AppendLine("==========================");

            // Get summary statistics
            var volunteerCount = await _context.VolunteerProfiles.CountAsync();
            var organizationCount = await _context.Organizations.CountAsync();
            var eventCount = await _context.Events.CountAsync();
            var registrationCount = await _context.EventRegistrations.CountAsync();

            contextBuilder.AppendLine($"Total Volunteers: {volunteerCount}");
            contextBuilder.AppendLine($"Total Organizations: {organizationCount}");
            contextBuilder.AppendLine($"Total Events: {eventCount}");
            contextBuilder.AppendLine($"Total Registrations: {registrationCount}");
            contextBuilder.AppendLine();

            // Add recent events sample
            var recentEvents = await _context.Events
                .Include(e => e.Organization)
                .OrderByDescending(e => e.CreatedAt)
                .Take(Math.Min(maxRows / 2, 10))
                .Select(e => new { e.EventName, e.Organization!.OrganizationName, e.StartDate })
                .ToListAsync();

            contextBuilder.AppendLine("Recent Events:");
            foreach (var evt in recentEvents)
            {
                contextBuilder.AppendLine($"- {evt.EventName} by {evt.OrganizationName} on {evt.StartDate:yyyy-MM-dd}");
            }
            contextBuilder.AppendLine();

            // Add user query
            contextBuilder.AppendLine("User Query:");
            contextBuilder.AppendLine(userQuery);

            return contextBuilder.ToString();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error building database context");
            return $"Database context unavailable. User query: {userQuery}";
        }
    }

    /// <summary>
    /// Get available models from all providers (configuration-based, no API calls)
    /// </summary>
    public async Task<Dictionary<string, List<string>>> GetAllAvailableModelsAsync(CancellationToken cancellationToken = default)
    {
        EnsureProvidersLoaded(); // Ensure providers are loaded
        
        var allModels = new Dictionary<string, List<string>>();

        _logger.LogDebug($"GetAllAvailableModelsAsync: Found {_providers.Count} providers (reading from configuration, no API calls)");

        foreach (var provider in _providers.Values)
        {
            if (provider.IsEnabled)
            {
                try
                {
                    // This reads models from configuration, not from API calls
                    var models = await provider.GetAvailableModelsAsync(cancellationToken);
                    _logger.LogDebug($"Provider {provider.ProviderName} returned {models.Count} models from configuration");
                    allModels[provider.ProviderName] = models;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error getting models from {provider.ProviderName}");
                    allModels[provider.ProviderName] = new List<string>();
                }
            }
            else
            {
                _logger.LogDebug($"Provider {provider.ProviderName} is disabled");
            }
        }

        return allModels;
    }
}
