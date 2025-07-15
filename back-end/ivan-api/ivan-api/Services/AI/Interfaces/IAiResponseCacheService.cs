using ivan_api.DTOs.AI;
using ivan_api.Models;

namespace ivan_api.Services.AI.Interfaces;

/// <summary>
/// Interface for AI response caching service
/// </summary>
public interface IAiResponseCacheService
{
    /// <summary>
    /// Get cached response for the given cache key
    /// </summary>
    Task<TestInstructionResponseDTO?> GetCachedResponseAsync(string cacheKey);

    /// <summary>
    /// Cache a test instruction response
    /// </summary>
    Task SetCachedResponseAsync(string cacheKey, TestInstructionResponseDTO response);

    /// <summary>
    /// Generate a cache key from instruction, query, and model
    /// </summary>
    Task<string> GenerateCacheKeyAsync(AiCustomInstruction instruction, string query, string model);

    /// <summary>
    /// Clear all cached responses
    /// </summary>
    Task ClearCacheAsync();

    /// <summary>
    /// Get cache statistics
    /// </summary>
    Task<CacheStatistics> GetCacheStatisticsAsync();
}