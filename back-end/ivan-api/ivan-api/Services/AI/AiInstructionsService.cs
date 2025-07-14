using ivan_api.DTOs.AI;
using ivan_api.Models;
using ivan_api.Services.AI.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ivan_api.Services.AI;

/// <summary>
/// Service for managing AI Custom Instructions with multi-model testing integration
/// </summary>
public class AiInstructionsService : IAiInstructionsService
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly AiTestingPlaygroundService _aiTestingService;
    private readonly ILogger<AiInstructionsService> _logger;
    private readonly IConfiguration _configuration;
    
    // Simple in-memory cache for testing responses (expires after 1 hour)
    private static readonly Dictionary<string, (TestInstructionResponseDTO Response, DateTime CachedAt)> _responseCache 
        = new Dictionary<string, (TestInstructionResponseDTO, DateTime)>();
    private static readonly object _cacheLock = new object();

    public AiInstructionsService(
        VolunteerManagementSystemContext context,
        AiTestingPlaygroundService aiTestingService,
        ILogger<AiInstructionsService> logger,
        IConfiguration configuration)
    {
        _context = context;
        _aiTestingService = aiTestingService;
        _logger = logger;
        _configuration = configuration;
    }

    #region CRUD Operations

    public async Task<IEnumerable<AiCustomInstructionDTO>> GetAllInstructionsAsync()
    {
        var instructions = await _context.AiCustomInstructions
            .Include(i => i.CreatedByUser)
                .ThenInclude(u => u.UserProfiles)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();

        return instructions.Select(MapToDTO);
    }

    public async Task<IEnumerable<AiCustomInstructionDTO>> GetUserInstructionsAsync(int userId)
    {
        var instructions = await _context.AiCustomInstructions
            .Include(i => i.CreatedByUser)
                .ThenInclude(u => u.UserProfiles)
            .Where(i => i.CreatedByUserId == userId)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();

        return instructions.Select(MapToDTO);
    }

    public async Task<AiCustomInstructionDTO?> GetInstructionByIdAsync(int instructionId)
    {
        var instruction = await _context.AiCustomInstructions
            .Include(i => i.CreatedByUser)
                .ThenInclude(u => u.UserProfiles)
            .FirstOrDefaultAsync(i => i.InstructionId == instructionId);

        return instruction != null ? MapToDTO(instruction) : null;
    }

    public async Task<AiCustomInstructionDTO> CreateInstructionAsync(AiCustomInstructionCreateDTO createDto, int createdByUserId)
    {
        var instruction = new AiCustomInstruction
        {
            CreatedByUserId = createdByUserId,
            InstructionName = createDto.InstructionName,
            SystemPrompt = createDto.SystemPrompt,
            BehaviorInstructions = createDto.BehaviorInstructions,
            DataAccessRules = createDto.DataAccessRules,
            IsActive = true,
            IsDefault = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.AiCustomInstructions.Add(instruction);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"Created AI instruction {instruction.InstructionId} by user {createdByUserId}");

        // Reload with navigation properties
        return await GetInstructionByIdAsync(instruction.InstructionId) 
               ?? throw new InvalidOperationException("Failed to retrieve created instruction");
    }

    public async Task<AiCustomInstructionDTO> UpdateInstructionAsync(int instructionId, AiCustomInstructionUpdateDTO updateDto)
    {
        var instruction = await _context.AiCustomInstructions
            .FirstOrDefaultAsync(i => i.InstructionId == instructionId);

        if (instruction == null)
        {
            throw new ArgumentException($"Instruction with ID {instructionId} not found");
        }

        instruction.InstructionName = updateDto.InstructionName;
        instruction.SystemPrompt = updateDto.SystemPrompt;
        instruction.BehaviorInstructions = updateDto.BehaviorInstructions;
        instruction.DataAccessRules = updateDto.DataAccessRules;
        instruction.IsActive = updateDto.IsActive;
        instruction.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation($"Updated AI instruction {instructionId}");

        return await GetInstructionByIdAsync(instructionId) 
               ?? throw new InvalidOperationException("Failed to retrieve updated instruction");
    }

    public async Task<bool> DeleteInstructionAsync(int instructionId)
    {
        var instruction = await _context.AiCustomInstructions
            .FirstOrDefaultAsync(i => i.InstructionId == instructionId);

        if (instruction == null)
        {
            return false;
        }

        // Don't allow deletion of default instructions
        if (instruction.IsDefault == true)
        {
            throw new InvalidOperationException("Cannot delete default instructions");
        }

        _context.AiCustomInstructions.Remove(instruction);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"Deleted AI instruction {instructionId}");

        return true;
    }

    #endregion

    #region Status Management

    public async Task<AiCustomInstructionDTO> ToggleInstructionStatusAsync(int instructionId, bool isActive)
    {
        var instruction = await _context.AiCustomInstructions
            .FirstOrDefaultAsync(i => i.InstructionId == instructionId);

        if (instruction == null)
        {
            throw new ArgumentException($"Instruction with ID {instructionId} not found");
        }

        instruction.IsActive = isActive;
        instruction.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation($"Toggled AI instruction {instructionId} status to {isActive}");

        return await GetInstructionByIdAsync(instructionId) 
               ?? throw new InvalidOperationException("Failed to retrieve updated instruction");
    }

    #endregion

    #region Template Management

    public async Task<IEnumerable<AiCustomInstructionDTO>> GetTemplateInstructionsAsync()
    {
        var templates = await _context.AiCustomInstructions
            .Include(i => i.CreatedByUser)
                .ThenInclude(u => u.UserProfiles)
            .Where(i => i.IsDefault == true)
            .OrderBy(i => i.InstructionName)
            .ToListAsync();

        return templates.Select(MapToDTO);
    }

    public async Task<AiCustomInstructionDTO?> GetDefaultInstructionAsync()
    {
        var defaultInstruction = await _context.AiCustomInstructions
            .Include(i => i.CreatedByUser)
                .ThenInclude(u => u.UserProfiles)
            .FirstOrDefaultAsync(i => i.IsDefault == true && i.IsActive == true);

        return defaultInstruction != null ? MapToDTO(defaultInstruction) : null;
    }

    #endregion

    #region Testing & Analytics

    public async Task<TestInstructionResponseDTO> TestInstructionAsync(int instructionId, TestInstructionRequestDTO testRequest)
    {
        var instruction = await _context.AiCustomInstructions
            .FirstOrDefaultAsync(i => i.InstructionId == instructionId);

        if (instruction == null)
        {
            throw new ArgumentException($"Instruction with ID {instructionId} not found");
        }

        // Get available models and use the first available one
        var availableModels = await GetAvailableModelsAsync();
        var firstModel = availableModels.FirstOrDefault();

        if (string.IsNullOrEmpty(firstModel))
        {
            throw new InvalidOperationException("No AI models available for testing");
        }

        return await TestInstructionWithModelAsync(instructionId, new TestInstructionWithModelRequestDTO
        {
            SampleQuery = testRequest.SampleQuery,
            ModelName = firstModel
        });
    }

    public async Task<TestInstructionResponseDTO> TestInstructionWithModelAsync(int instructionId, TestInstructionWithModelRequestDTO testRequest)
    {
        var instruction = await _context.AiCustomInstructions
            .FirstOrDefaultAsync(i => i.InstructionId == instructionId);

        if (instruction == null)
        {
            throw new ArgumentException($"Instruction with ID {instructionId} not found");
        }

        // Generate cache key based on instruction content and query
        var cacheKey = GenerateCacheKey(instruction, testRequest.SampleQuery, testRequest.ModelName);
        
        // Check cache first
        var cachedResponse = GetCachedResponse(cacheKey);
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
            
            // Log the provider mapping for debugging
            var providerName = GetProviderFromModel(testRequest.ModelName);
            _logger.LogInformation($"Testing instruction {instructionId} with model {testRequest.ModelName} using provider {providerName}");

            // Create multi-model test request for single model
            var multiModelRequest = new MultiModelTestRequest
            {
                Prompt = fullPrompt,
                ProviderNames = new List<string> { providerName },
                RunSimultaneously = false,
                TimeoutSeconds = 30,
                CustomModels = new Dictionary<string, string> { { providerName, testRequest.ModelName } }
            };

            var result = await _aiTestingService.TestMultipleProvidersAsync(multiModelRequest);
            var testResult = result.Results.FirstOrDefault();

            stopwatch.Stop();
            
            // More detailed logging for debugging
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
                await LogQueryAnalyticsAsync(instructionId, testRequest.SampleQuery, stopwatch.Elapsed.Milliseconds);

                var response = new TestInstructionResponseDTO
                {
                    Response = testResult.Response,
                    ModelUsed = testRequest.ModelName,
                    ExecutionTimeMs = stopwatch.Elapsed.Milliseconds,
                    Success = true,
                    TestedAt = DateTime.UtcNow
                };
                
                // Cache successful response
                CacheResponse(cacheKey, response);
                
                return response;
            }
            else
            {
                var errorMessage = testResult?.ErrorMessage ?? "Unknown error occurred";
                
                // Provide more user-friendly error messages for common issues
                if (errorMessage.Contains("429") || errorMessage.Contains("Too Many Requests"))
                {
                    errorMessage = "Rate limit exceeded. Please wait a moment before trying again. OpenRouter free tier has limited requests per minute.";
                }
                else if (errorMessage.Contains("401") || errorMessage.Contains("Unauthorized"))
                {
                    errorMessage = "API authentication failed. Please check your API key configuration.";
                }
                else if (errorMessage.Contains("400") || errorMessage.Contains("Bad Request"))
                {
                    errorMessage = "Invalid request format. The model may not support this type of query.";
                }

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

    public async Task<IEnumerable<AiQueryAnalyticsDTO>> GetInstructionAnalyticsAsync(int instructionId)
    {
        var analytics = await _context.AiQueryIntents
            .Where(q => q.InstructionId == instructionId)
            .OrderByDescending(q => q.CreatedAt)
            .Take(100) // Limit to last 100 queries
            .ToListAsync();

        return analytics.Select(MapAnalyticsToDTO);
    }

    public async Task<InstructionPerformanceDTO> GetInstructionPerformanceAsync(int instructionId)
    {
        var analytics = await _context.AiQueryIntents
            .Where(q => q.InstructionId == instructionId)
            .ToListAsync();

        var last7Days = analytics.Where(q => q.CreatedAt >= DateTime.UtcNow.AddDays(-7)).ToList();

        return new InstructionPerformanceDTO
        {
            TotalQueries = analytics.Count,
            AverageExecutionTime = analytics.Where(q => q.ProcessingTimeMs.HasValue)
                                           .Select(q => q.ProcessingTimeMs!.Value)
                                           .DefaultIfEmpty(0)
                                           .Average(),
            AverageResponseQuality = analytics.Where(q => q.ResponseQuality.HasValue)
                                            .Select(q => q.ResponseQuality!.Value)
                                            .DefaultIfEmpty(0)
                                            .Average(),
            QueriesLast7Days = last7Days.Count,
            MostAccessedTables = GetMostAccessedTables(analytics)
        };
    }

    public async Task<IEnumerable<AiQueryAnalyticsDTO>> GetAllAnalyticsAsync()
    {
        var analytics = await _context.AiQueryIntents
            .OrderByDescending(q => q.CreatedAt)
            .Take(500) // Limit to last 500 queries
            .ToListAsync();

        return analytics.Select(MapAnalyticsToDTO);
    }

    #endregion

    #region AI Provider Integration

    public async Task<IEnumerable<string>> GetAvailableModelsAsync()
    {
        // Read available models from appsettings.json
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
        // Read configuration from appsettings.json - No API calls, no initialization
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

    #endregion

    #region Helper Methods

    private static AiCustomInstructionDTO MapToDTO(AiCustomInstruction instruction)
    {
        return new AiCustomInstructionDTO
        {
            InstructionId = instruction.InstructionId,
            CreatedByUserId = instruction.CreatedByUserId,
            InstructionName = instruction.InstructionName,
            SystemPrompt = instruction.SystemPrompt,
            BehaviorInstructions = instruction.BehaviorInstructions,
            DataAccessRules = instruction.DataAccessRules,
            IsActive = instruction.IsActive ?? true,
            IsDefault = instruction.IsDefault ?? false,
            CreatedAt = instruction.CreatedAt ?? DateTime.UtcNow,
            UpdatedAt = instruction.UpdatedAt ?? DateTime.UtcNow,
            CreatedByUser = instruction.CreatedByUser != null ? new UserBasicInfoDTO
            {
                UserId = instruction.CreatedByUser.UserId,
                Email = instruction.CreatedByUser.Email,
                FullName = instruction.CreatedByUser.UserProfiles?.FirstOrDefault()?.FullName ?? instruction.CreatedByUser.Email
            } : null
        };
    }

    private static AiQueryAnalyticsDTO MapAnalyticsToDTO(AiQueryIntent analytics)
    {
        return new AiQueryAnalyticsDTO
        {
            IntentId = analytics.IntentId,
            UserId = analytics.UserId,
            ConversationId = analytics.ConversationId,
            QueryText = analytics.QueryText,
            DetectedIntent = analytics.DetectedIntent,
            EntityMentions = analytics.EntityMentions,
            IsCorrect = analytics.IsCorrect,
            CorrectedIntent = analytics.CorrectedIntent,
            ProcessingTimeMs = analytics.ProcessingTimeMs,
            ResponseQuality = analytics.ResponseQuality,
            DataTablesAccessed = analytics.DataTablesAccessed,
            InstructionId = analytics.InstructionId,
            CreatedAt = analytics.CreatedAt ?? DateTime.UtcNow
        };
    }

    private string BuildInstructionPrompt(AiCustomInstruction instruction, string query)
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

    private static string GetProviderFromModel(string modelName)
    {
        // Simple mapping - could be made more sophisticated
        if (modelName.StartsWith("gemini", StringComparison.OrdinalIgnoreCase))
        {
            return "Gemini";
        }
        if (modelName.Contains("deepseek") || modelName.Contains("/"))
        {
            return "OpenRouter";
        }
        return "Gemini"; // Default fallback
    }

    private async Task LogQueryAnalyticsAsync(int instructionId, string query, int processingTimeMs)
    {
        try
        {
            // Check if instruction exists
            var instructionExists = await _context.AiCustomInstructions
                .AnyAsync(i => i.InstructionId == instructionId);
            
            if (!instructionExists)
            {
                _logger.LogWarning($"Instruction {instructionId} not found, skipping analytics logging");
                return;
            }

            // Try to get a valid user ID, fallback to first available user
            var firstUserId = await _context.Users.Select(u => u.UserId).FirstOrDefaultAsync();
            
            if (firstUserId == 0)
            {
                _logger.LogWarning("No users found in database, skipping analytics logging");
                return;
            }

            var analytics = new AiQueryIntent
            {
                UserId = firstUserId, // Use first available user instead of hardcoded value
                InstructionId = instructionId,
                QueryText = query,
                DetectedIntent = "instruction_test",
                ProcessingTimeMs = processingTimeMs,
                CreatedAt = DateTime.UtcNow,
                ConversationId = Guid.NewGuid().ToString(), // Generate unique conversation ID
                IsCorrect = null, // Unknown until user feedback
                ResponseQuality = null // Will be set based on user feedback
            };

            _context.AiQueryIntents.Add(analytics);
            await _context.SaveChangesAsync();
            
            _logger.LogDebug($"Successfully logged analytics for instruction {instructionId}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to log query analytics for instruction {InstructionId}", instructionId);
            // Don't throw - analytics logging shouldn't break the main functionality
        }
    }

    private static Dictionary<string, int> GetMostAccessedTables(List<AiQueryIntent> analytics)
    {
        var tableCounts = new Dictionary<string, int>();

        foreach (var analytic in analytics.Where(a => !string.IsNullOrWhiteSpace(a.DataTablesAccessed)))
        {
            var tables = analytic.DataTablesAccessed!.Split(',', StringSplitOptions.RemoveEmptyEntries);
            foreach (var table in tables)
            {
                var tableName = table.Trim();
                tableCounts[tableName] = tableCounts.GetValueOrDefault(tableName, 0) + 1;
            }
        }

        return tableCounts.OrderByDescending(kv => kv.Value)
                         .Take(5)
                         .ToDictionary(kv => kv.Key, kv => kv.Value);
    }

    #region Cache Management

    private static string GenerateCacheKey(AiCustomInstruction instruction, string query, string model)
    {
        // Create a hash of instruction content + query + model for cache key
        var content = $"{instruction.SystemPrompt}|{instruction.BehaviorInstructions}|{instruction.DataAccessRules}|{query}|{model}";
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var hashBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(content));
        return Convert.ToBase64String(hashBytes)[..16]; // Use first 16 chars for shorter key
    }

    private static TestInstructionResponseDTO? GetCachedResponse(string cacheKey)
    {
        lock (_cacheLock)
        {
            if (_responseCache.TryGetValue(cacheKey, out var cached))
            {
                // Check if cache is still valid (1 hour expiry)
                if (DateTime.UtcNow - cached.CachedAt < TimeSpan.FromHours(1))
                {
                    // Return a copy with updated timestamp
                    return new TestInstructionResponseDTO
                    {
                        Response = cached.Response.Response,
                        ModelUsed = cached.Response.ModelUsed,
                        ExecutionTimeMs = cached.Response.ExecutionTimeMs,
                        Success = cached.Response.Success,
                        Error = cached.Response.Error,
                        TestedAt = DateTime.UtcNow,
                        IsCached = true // Add flag to indicate cached response
                    };
                }
                else
                {
                    // Remove expired cache entry
                    _responseCache.Remove(cacheKey);
                }
            }
            return null;
        }
    }

    private static void CacheResponse(string cacheKey, TestInstructionResponseDTO response)
    {
        lock (_cacheLock)
        {
            // Clean up old cache entries periodically (keep only last 100)
            if (_responseCache.Count > 100)
            {
                var oldestEntries = _responseCache
                    .OrderBy(kv => kv.Value.CachedAt)
                    .Take(_responseCache.Count - 100)
                    .Select(kv => kv.Key)
                    .ToList();
                
                foreach (var key in oldestEntries)
                {
                    _responseCache.Remove(key);
                }
            }

            _responseCache[cacheKey] = (response, DateTime.UtcNow);
        }
    }

    #endregion

    #endregion
}
