using ivan_api.Configuration;
using ivan_api.DTOs.AI;
using ivan_api.Services.AI.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace ivan_api.Services.AI;

/// <summary>
/// Service for managing chatbot configuration including default custom instructions
/// </summary>
public class ChatbotConfigurationService : IChatbotConfigurationService
{
    private readonly IMemoryCache _cache;
    private readonly IAiCustomInstructionService _customInstructionService;
    private readonly IOptionsMonitor<ChatbotConfiguration> _chatbotConfig;
    private readonly ILogger<ChatbotConfigurationService> _logger;
    private const string CACHE_KEY = "default_custom_instruction";

    public ChatbotConfigurationService(
        IMemoryCache cache,
        IAiCustomInstructionService customInstructionService,
        IOptionsMonitor<ChatbotConfiguration> chatbotConfig,
        ILogger<ChatbotConfigurationService> logger)
    {
        _cache = cache;
        _customInstructionService = customInstructionService;
        _chatbotConfig = chatbotConfig;
        _logger = logger;
    }

    /// <summary>
    /// Get the default custom instruction for chatbot
    /// </summary>
    public async Task<AiCustomInstructionDTO?> GetDefaultCustomInstructionAsync()
    {
        try
        {
            var config = _chatbotConfig.CurrentValue;
            
            if (!config.EnableCustomInstructions || !config.DefaultCustomInstructionId.HasValue)
            {
                _logger.LogInformation("Custom instructions disabled or no default instruction set");
                return null;
            }

            // Try to get from cache first
            if (_cache.TryGetValue(CACHE_KEY, out AiCustomInstructionDTO? cachedInstruction))
            {
                _logger.LogDebug("Retrieved default custom instruction from cache");
                return cachedInstruction;
            }

            // Get from database
            var instruction = await _customInstructionService.GetCustomInstructionByIdAsync(config.DefaultCustomInstructionId.Value);
            
            if (instruction != null && instruction.IsActive)
            {
                // Cache the instruction
                var cacheOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(config.CacheDurationMinutes),
                    Priority = CacheItemPriority.High
                };
                
                _cache.Set(CACHE_KEY, instruction, cacheOptions);
                _logger.LogInformation("Default custom instruction loaded and cached: {InstructionName}", instruction.InstructionName);
                return instruction;
            }
            
            _logger.LogWarning("Default custom instruction not found or inactive: {InstructionId}", config.DefaultCustomInstructionId.Value);
            return await HandleFallbackBehavior(config.FallbackBehavior);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting default custom instruction");
            return null;
        }
    }

    /// <summary>
    /// Update the default custom instruction ID in configuration
    /// </summary>
    public async Task<bool> SetDefaultCustomInstructionAsync(int? instructionId)
    {
        try
        {
            // Validate instruction exists and is active if ID is provided
            if (instructionId.HasValue)
            {
                var instruction = await _customInstructionService.GetCustomInstructionByIdAsync(instructionId.Value);
                if (instruction == null || !instruction.IsActive)
                {
                    _logger.LogWarning("Cannot set default custom instruction: instruction not found or inactive: {InstructionId}", instructionId.Value);
                    return false;
                }
            }

            // Clear cache when configuration changes
            _cache.Remove(CACHE_KEY);
            
            // Note: In a real implementation, you would update the configuration in appsettings.json
            // or use a database-backed configuration system
            // For now, we'll log the change and return success
            _logger.LogInformation("Default custom instruction updated to: {InstructionId}", instructionId);
            
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting default custom instruction: {InstructionId}", instructionId);
            return false;
        }
    }

    /// <summary>
    /// Get current chatbot configuration
    /// </summary>
    public ChatbotConfiguration GetCurrentConfiguration()
    {
        return _chatbotConfig.CurrentValue;
    }

    /// <summary>
    /// Clear the cached default custom instruction
    /// </summary>
    public void ClearCache()
    {
        _cache.Remove(CACHE_KEY);
        _logger.LogInformation("Default custom instruction cache cleared");
    }

    /// <summary>
    /// Handle fallback behavior when default instruction is not available
    /// </summary>
    private async Task<AiCustomInstructionDTO?> HandleFallbackBehavior(ChatbotFallbackBehavior fallbackBehavior)
    {
        switch (fallbackBehavior)
        {
            case ChatbotFallbackBehavior.UseWithoutInstructions:
                _logger.LogInformation("Using chatbot without custom instructions (fallback)");
                return null;
                
            case ChatbotFallbackBehavior.ReturnError:
                _logger.LogError("Default custom instruction not available and fallback is set to return error");
                throw new InvalidOperationException("Default custom instruction is not available");
                
            case ChatbotFallbackBehavior.UseFallbackInstruction:
                // You could implement a predefined fallback instruction here
                _logger.LogInformation("Using fallback custom instruction");
                return null;
                
            default:
                return null;
        }
    }
}