using ivan_api.DTOs.AI;
using ivan_api.Models;
using ivan_api.Services.AI.Interfaces;
using Microsoft.Extensions.Configuration;

namespace ivan_api.Services.AI;

/// <summary>
/// Service for testing AI Instructions with different models
/// </summary>
public class AiInstructionsTestingService : IAiInstructionsTestingService
{
    private readonly IAiInstructionsCrudService _crudService;
    private readonly IAiResponseCacheService _cacheService;
    private readonly IAiInstructionsAnalyticsService _analyticsService;
    private readonly IAiProviderFactory _providerFactory;
    private readonly ILogger<AiInstructionsTestingService> _logger;
    private readonly IConfiguration _configuration;

    public AiInstructionsTestingService(
        IAiInstructionsCrudService crudService,
        IAiResponseCacheService cacheService,
        IAiInstructionsAnalyticsService analyticsService,
        IAiProviderFactory providerFactory,
        ILogger<AiInstructionsTestingService> logger,
        IConfiguration configuration)
    {
        _crudService = crudService;
        _cacheService = cacheService;
        _analyticsService = analyticsService;
        _providerFactory = providerFactory;
        _logger = logger;
        _configuration = configuration;
    }

    public async Task<TestInstructionResponseDTO> TestInstructionWithModelAsync(int instructionId, TestInstructionWithModelRequestDTO testRequest)
    {
        var instruction = await _crudService.GetInstructionByIdAsync(instructionId);
        
        if (instruction == null)
        {
            throw new ArgumentException($"Instruction with ID {instructionId} not found");
        }

        // Convert DTO to entity for cache key generation
        var instructionEntity = new AiCustomInstruction
        {
            InstructionId = instruction.InstructionId,
            SystemPrompt = instruction.SystemPrompt,
            BehaviorInstructions = instruction.BehaviorInstructions,
            DataAccessRules = instruction.DataAccessRules
        };

        // Generate cache key based on instruction content and query
        var cacheKey = await _cacheService.GenerateCacheKeyAsync(instructionEntity, testRequest.SampleQuery, testRequest.ModelName);
        
        // Check cache first
        var cachedResponse = await _cacheService.GetCachedResponseAsync(cacheKey);
        if (cachedResponse != null)
        {
            _logger.LogInformation($"Returning cached response for instruction {instructionId} (cache hit)");
            return cachedResponse;
        }

        var stopwatch = System.Diagnostics.Stopwatch.StartNew();

        try
        {
            // Build full prompt with instruction context
            var fullPrompt = BuildInstructionPrompt(instruction, testRequest.SampleQuery);
            
            // Get provider for model
            var provider = await _providerFactory.GetProviderForModelAsync(testRequest.ModelName);
            
            _logger.LogInformation($"Testing instruction {instructionId} with model {testRequest.ModelName} using provider {provider.ProviderName}");

            // Test with provider
            var testResult = await provider.SendPromptAsync(fullPrompt, testRequest.ModelName);

            stopwatch.Stop();
            
            // Log detailed information for debugging
            if (testResult != null)
            {
                _logger.LogInformation($"Test result details - Provider: {testResult.ProviderName}, Model: {testResult.Model}, Success: {testResult.Success}, Response Length: {testResult.Response?.Length ?? 0}, Error: '{testResult.ErrorMessage}'");
                
                if (!testResult.Success && !string.IsNullOrEmpty(testResult.ErrorMessage))
                {
                    _logger.LogWarning($"Test failed for instruction {instructionId}: {testResult.ErrorMessage}");
                }
            }
            else
            {
                _logger.LogError($"No test result returned for instruction {instructionId}");
            }

            if (testResult?.Success == true)
            {
                // Log analytics
                await _analyticsService.LogQueryAnalyticsAsync(instructionId, testRequest.SampleQuery, stopwatch.Elapsed.Milliseconds);

                var response = new TestInstructionResponseDTO
                {
                    Response = testResult.Response,
                    ModelUsed = testRequest.ModelName,
                    ExecutionTimeMs = stopwatch.Elapsed.Milliseconds,
                    Success = true,
                    TestedAt = DateTime.UtcNow
                };
                
                // Cache successful response
                await _cacheService.SetCachedResponseAsync(cacheKey, response);
                
                return response;
            }
            else
            {
                var errorMessage = testResult?.ErrorMessage ?? "Unknown error occurred";
                
                // Provide more user-friendly error messages for common issues
                errorMessage = GetUserFriendlyErrorMessage(errorMessage);

                return new TestInstructionResponseDTO
                {
                    Response = "",
                    ModelUsed = testRequest.ModelName,
                    ExecutionTimeMs = stopwatch.Elapsed.Milliseconds,
                    Success = false,
                    Error = errorMessage,
                    TestedAt = DateTime.UtcNow
                };
            }
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            _logger.LogError(ex, $"Error testing instruction {instructionId} with model {testRequest.ModelName}");

            return new TestInstructionResponseDTO
            {
                Response = "",
                ModelUsed = testRequest.ModelName,
                ExecutionTimeMs = stopwatch.Elapsed.Milliseconds,
                Success = false,
                Error = ex.Message,
                TestedAt = DateTime.UtcNow
            };
        }
    }

    public async Task<IEnumerable<string>> GetAvailableModelsAsync()
    {
        _logger.LogDebug("Reading available models from configuration (no API calls)");
        
        var availableModels = new List<string>();
        
        // Get models from Gemini configuration
        var geminiModels = _configuration.GetSection("AiProviders:Gemini:AvailableModels").Get<List<string>>();
        if (geminiModels != null && _configuration.GetValue<bool>("AiProviders:Gemini:IsEnabled", true))
        {
            availableModels.AddRange(geminiModels);
        }
        
        // Get models from OpenRouter configuration
        var openRouterModels = _configuration.GetSection("AiProviders:OpenRouter:AvailableModels").Get<List<string>>();
        if (openRouterModels != null && _configuration.GetValue<bool>("AiProviders:OpenRouter:IsEnabled", true))
        {
            availableModels.AddRange(openRouterModels);
        }
        
        _logger.LogInformation($"Found {availableModels.Count} available models from configuration");
        return await Task.FromResult(availableModels);
    }

    public async Task<object> GetAiConfigurationAsync()
    {
        _logger.LogDebug("Reading AI configuration from appsettings (no API calls)");
        
        var providers = new List<object>();
        
        // Read Gemini configuration
        var geminiSection = _configuration.GetSection("AiProviders:Gemini");
        if (geminiSection.GetValue<bool>("IsEnabled", true))
        {
            providers.Add(new
            {
                Name = geminiSection.GetValue<string>("Name") ?? "Gemini",
                Status = "Available",
                Models = geminiSection.GetSection("AvailableModels").Get<string[]>() ?? new[] { "gemini-2.5-flash" },
                Description = "Google Gemini AI - Free tier with rate limits",
                DefaultModel = geminiSection.GetValue<string>("DefaultModel") ?? "gemini-2.5-flash",
                RequestsPerMinute = geminiSection.GetValue<int>("RequestsPerMinute", 15),
                RequestsPerDay = geminiSection.GetValue<int>("RequestsPerDay", 1000)
            });
        }
        
        // Read OpenRouter configuration
        var openRouterSection = _configuration.GetSection("AiProviders:OpenRouter");
        if (openRouterSection.GetValue<bool>("IsEnabled", true))
        {
            providers.Add(new
            {
                Name = openRouterSection.GetValue<string>("Name") ?? "OpenRouter",
                Status = "Available",
                Models = openRouterSection.GetSection("AvailableModels").Get<string[]>() ?? new[] { "deepseek/deepseek-r1:free" },
                Description = "OpenRouter - Free models with rate limits",
                DefaultModel = openRouterSection.GetValue<string>("DefaultModel") ?? "deepseek/deepseek-r1:free",
                RequestsPerMinute = openRouterSection.GetValue<int>("RequestsPerMinute", 10),
                RequestsPerDay = openRouterSection.GetValue<int>("RequestsPerDay", 500)
            });
        }
        
        return await Task.FromResult(new
        {
            Providers = providers,
            LastUpdated = DateTime.UtcNow,
            Note = "Configuration from appsettings.json - providers are tested only when used"
        });
    }

    public async Task<TestInstructionResponseDTO> TestInstructionAsync(int instructionId, TestInstructionRequestDTO testRequest)
    {
        // Get default model for testing
        var defaultModel = _configuration.GetValue<string>("AiProviders:Gemini:DefaultModel") ?? "gemini-2.5-flash";
        
        var testWithModelRequest = new TestInstructionWithModelRequestDTO
        {
            SampleQuery = testRequest.SampleQuery,
            ModelName = defaultModel
        };

        return await TestInstructionWithModelAsync(instructionId, testWithModelRequest);
    }

    #region Helper Methods

    private static string BuildInstructionPrompt(AiCustomInstructionDTO instruction, string query)
    {
        var promptBuilder = new System.Text.StringBuilder();

        // Add system prompt
        promptBuilder.AppendLine("SYSTEM INSTRUCTION:");
        promptBuilder.AppendLine(instruction.SystemPrompt);
        promptBuilder.AppendLine();

        // Add behavior instructions if available
        if (!string.IsNullOrWhiteSpace(instruction.BehaviorInstructions))
        {
            promptBuilder.AppendLine("BEHAVIOR GUIDELINES:");
            promptBuilder.AppendLine(instruction.BehaviorInstructions);
            promptBuilder.AppendLine();
        }

        // Add data access rules if available
        if (!string.IsNullOrWhiteSpace(instruction.DataAccessRules))
        {
            promptBuilder.AppendLine("DATA ACCESS RULES:");
            promptBuilder.AppendLine(instruction.DataAccessRules);
            promptBuilder.AppendLine();
        }

        // Add user query
        promptBuilder.AppendLine("USER QUERY:");
        promptBuilder.AppendLine(query);

        return promptBuilder.ToString();
    }

    private static string GetUserFriendlyErrorMessage(string errorMessage)
    {
        if (errorMessage.Contains("429") || errorMessage.Contains("Too Many Requests"))
        {
            return "Rate limit exceeded. Please wait a moment before trying again. OpenRouter free tier has limited requests per minute.";
        }
        else if (errorMessage.Contains("401") || errorMessage.Contains("Unauthorized"))
        {
            return "API authentication failed. Please check your API key configuration.";
        }
        else if (errorMessage.Contains("400") || errorMessage.Contains("Bad Request"))
        {
            return "Invalid request format. The model may not support this type of query.";
        }

        return errorMessage;
    }

    #endregion
}