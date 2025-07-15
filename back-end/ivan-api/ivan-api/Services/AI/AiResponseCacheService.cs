using ivan_api.DTOs.AI;
using ivan_api.Services.AI.Interfaces;
using ivan_api.Models;
using System.Collections.Concurrent;
using System.Security.Cryptography;
using System.Text;

namespace ivan_api.Services.AI;

/// <summary>
/// Thread-safe cache service for AI instruction test responses
/// </summary>
public class AiResponseCacheService : IAiResponseCacheService
{
    private readonly ConcurrentDictionary<string, (TestInstructionResponseDTO Response, DateTime CachedAt)> _cache;
    private readonly ILogger<AiResponseCacheService> _logger;
    private readonly TimeSpan _cacheExpiry;
    private readonly int _maxCacheSize;

    public AiResponseCacheService(ILogger<AiResponseCacheService> logger)
    {
        _cache = new ConcurrentDictionary<string, (TestInstructionResponseDTO, DateTime)>();
        _logger = logger;
        _cacheExpiry = TimeSpan.FromHours(1); // Configurable
        _maxCacheSize = 100; // Configurable
    }

    public async Task<TestInstructionResponseDTO?> GetCachedResponseAsync(string cacheKey)
    {
        if (_cache.TryGetValue(cacheKey, out var cached))
        {
            // Check if cache is still valid
            if (DateTime.UtcNow - cached.CachedAt < _cacheExpiry)
            {
                _logger.LogDebug($"Cache hit for key: {cacheKey}");
                
                // Return a copy with updated timestamp and cache flag
                return new TestInstructionResponseDTO
                {
                    Response = cached.Response.Response,
                    ModelUsed = cached.Response.ModelUsed,
                    ExecutionTimeMs = cached.Response.ExecutionTimeMs,
                    Success = cached.Response.Success,
                    Error = cached.Response.Error,
                    TestedAt = DateTime.UtcNow,
                    IsCached = true
                };
            }
            else
            {
                // Remove expired cache entry
                _cache.TryRemove(cacheKey, out _);
                _logger.LogDebug($"Cache expired for key: {cacheKey}");
            }
        }

        _logger.LogDebug($"Cache miss for key: {cacheKey}");
        return await Task.FromResult<TestInstructionResponseDTO?>(null);
    }

    public async Task SetCachedResponseAsync(string cacheKey, TestInstructionResponseDTO response)
    {
        // Clean up old cache entries if we're approaching the limit
        if (_cache.Count >= _maxCacheSize)
        {
            await CleanupOldEntriesAsync();
        }

        // Cache the response
        _cache[cacheKey] = (response, DateTime.UtcNow);
        _logger.LogDebug($"Cached response for key: {cacheKey}");
        
        await Task.CompletedTask;
    }

    public async Task<string> GenerateCacheKeyAsync(AiCustomInstruction instruction, string query, string model)
    {
        // Create a hash of instruction content + query + model for cache key
        var content = $"{instruction.SystemPrompt}|{instruction.BehaviorInstructions}|{instruction.DataAccessRules}|{query}|{model}";
        
        using var sha256 = SHA256.Create();
        var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(content));
        var cacheKey = Convert.ToBase64String(hashBytes)[..16]; // Use first 16 chars for shorter key
        
        return await Task.FromResult(cacheKey);
    }

    public async Task ClearCacheAsync()
    {
        _cache.Clear();
        _logger.LogInformation("Cache cleared");
        await Task.CompletedTask;
    }

    public async Task<CacheStatistics> GetCacheStatisticsAsync()
    {
        var now = DateTime.UtcNow;
        var validEntries = _cache.Values.Count(entry => now - entry.CachedAt < _cacheExpiry);
        var expiredEntries = _cache.Count - validEntries;

        return await Task.FromResult(new CacheStatistics
        {
            TotalEntries = _cache.Count,
            ValidEntries = validEntries,
            ExpiredEntries = expiredEntries,
            CacheHitRate = 0.0, // Would need hit/miss tracking for accurate calculation
            MaxCacheSize = _maxCacheSize,
            CacheExpiryHours = _cacheExpiry.TotalHours
        });
    }

    private async Task CleanupOldEntriesAsync()
    {
        var now = DateTime.UtcNow;
        var entriesToRemove = new List<string>();

        // Find expired entries
        foreach (var kvp in _cache)
        {
            if (now - kvp.Value.CachedAt >= _cacheExpiry)
            {
                entriesToRemove.Add(kvp.Key);
            }
        }

        // If we still have too many entries after removing expired ones,
        // remove the oldest ones
        if (_cache.Count - entriesToRemove.Count >= _maxCacheSize)
        {
            var oldestEntries = _cache
                .Where(kvp => !entriesToRemove.Contains(kvp.Key))
                .OrderBy(kvp => kvp.Value.CachedAt)
                .Take(_cache.Count - _maxCacheSize + 1)
                .Select(kvp => kvp.Key)
                .ToList();

            entriesToRemove.AddRange(oldestEntries);
        }

        // Remove entries
        foreach (var key in entriesToRemove)
        {
            _cache.TryRemove(key, out _);
        }

        if (entriesToRemove.Count > 0)
        {
            _logger.LogDebug($"Cleaned up {entriesToRemove.Count} cache entries");
        }

        await Task.CompletedTask;
    }
}

/// <summary>
/// Statistics about the cache performance
/// </summary>
public class CacheStatistics
{
    public int TotalEntries { get; set; }
    public int ValidEntries { get; set; }
    public int ExpiredEntries { get; set; }
    public double CacheHitRate { get; set; }
    public int MaxCacheSize { get; set; }
    public double CacheExpiryHours { get; set; }
}