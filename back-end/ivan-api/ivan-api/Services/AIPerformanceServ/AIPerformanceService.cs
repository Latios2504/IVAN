using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using ivan_api.DTOs;
using ivan_api.DTOs.AIDatabaseManage;
using ivan_api.Models;
using System.Text.Json;
using System.Text;
using System.IO.Compression;
using System.Diagnostics;

namespace ivan_api.Services.AIPerformanceServ
{
    /// <summary>
    /// AI Performance Service implementation for monitoring, optimization, and scaling
    /// </summary>
    public class AIPerformanceService : IAIPerformanceService
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<AIPerformanceService> _logger;
        private readonly TimeSpan _defaultCacheExpiration = TimeSpan.FromMinutes(30);
        
        // Performance thresholds
        private const int SLOW_QUERY_THRESHOLD_MS = 1000;
        private const int OVERLOAD_THRESHOLD_CONNECTIONS = 100;
        private const int HIGH_MEMORY_THRESHOLD_PERCENT = 80;
        private const double HIGH_CPU_THRESHOLD_PERCENT = 75.0;

        public AIPerformanceService(
            VolunteerManagementSystemContext context,
            IMemoryCache cache,
            ILogger<AIPerformanceService> logger)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
        }

        #region Performance Monitoring

        public async Task<PerformanceMetricsDTO> RecordQueryPerformanceAsync(int userId, string query, int executionTimeMs, int dataSize, string cacheStatus)
        {
            try
            {
                var metric = new AiPerformanceMetric
                {
                    UserId = userId,
                    Query = query.Length > 500 ? query.Substring(0, 500) : query,
                    ExecutionTimeMs = executionTimeMs,
                    DataSize = dataSize,
                    CacheStatus = cacheStatus,
                    QueryCategory = await DetermineQueryCategoryAsync(query),
                    CreatedAt = DateTime.UtcNow
                };

                _context.AiPerformanceMetrics.Add(metric);
                await _context.SaveChangesAsync();

                var dto = new PerformanceMetricsDTO
                {
                    QueryId = metric.MetricId,
                    Query = metric.Query,
                    ExecutionTimeMs = executionTimeMs,
                    DataSize = dataSize,
                    CacheStatus = cacheStatus,
                    Timestamp = metric.CreatedAt,
                    Metrics = new Dictionary<string, object>
                    {
                        { "UserId", userId },
                        { "Category", metric.QueryCategory }
                    }
                };

                // Log slow queries
                if (executionTimeMs > SLOW_QUERY_THRESHOLD_MS)
                {
                    _logger.LogWarning("Slow query detected: {ExecutionTime}ms for user {UserId}", executionTimeMs, userId);
                }

                return dto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error recording query performance for user {UserId}", userId);
                throw;
            }
        }

        public async Task<List<PerformanceMetricsDTO>> GetPerformanceMetricsAsync(int userId, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = _context.AiPerformanceMetrics.AsQueryable();

            if (userId > 0)
                query = query.Where(m => m.UserId == userId);

            if (fromDate.HasValue)
                query = query.Where(m => m.CreatedAt >= fromDate.Value);

            if (toDate.HasValue)
                query = query.Where(m => m.CreatedAt <= toDate.Value);

            var metrics = await query
                .OrderByDescending(m => m.CreatedAt)
                .Take(1000)
                .ToListAsync();

            return metrics.Select(m => new PerformanceMetricsDTO
            {
                QueryId = m.MetricId,
                Query = m.Query,
                ExecutionTimeMs = m.ExecutionTimeMs,
                DataSize = m.DataSize,
                CacheStatus = m.CacheStatus,
                Timestamp = m.CreatedAt,
                Metrics = new Dictionary<string, object>
                {
                    { "UserId", m.UserId },
                    { "Category", m.QueryCategory ?? "Unknown" }
                }
            }).ToList();
        }

        public async Task<Dictionary<string, object>> GetPerformanceStatisticsAsync(TimeSpan period)
        {
            var fromDate = DateTime.UtcNow.Subtract(period);
            
            var metrics = await _context.AiPerformanceMetrics
                .Where(m => m.CreatedAt >= fromDate)
                .ToListAsync();

            if (!metrics.Any())
            {
                return new Dictionary<string, object>
                {
                    { "TotalQueries", 0 },
                    { "AverageExecutionTime", 0 },
                    { "CacheHitRatio", 0 },
                    { "SlowQueries", 0 }
                };
            }

            var cacheHits = metrics.Count(m => m.CacheStatus == "HIT");
            var slowQueries = metrics.Count(m => m.ExecutionTimeMs > SLOW_QUERY_THRESHOLD_MS);

            return new Dictionary<string, object>
            {
                { "TotalQueries", metrics.Count },
                { "AverageExecutionTime", metrics.Average(m => m.ExecutionTimeMs) },
                { "CacheHitRatio", metrics.Count > 0 ? (double)cacheHits / metrics.Count * 100 : 0 },
                { "SlowQueries", slowQueries },
                { "TotalDataSize", metrics.Sum(m => m.DataSize) },
                { "UniqueUsers", metrics.Select(m => m.UserId).Distinct().Count() }
            };
        }

        public async Task<List<PerformanceMetricsDTO>> GetSlowestQueriesAsync(int count = 10, TimeSpan? period = null)
        {
            var query = _context.AiPerformanceMetrics.AsQueryable();

            if (period.HasValue)
            {
                var fromDate = DateTime.UtcNow.Subtract(period.Value);
                query = query.Where(m => m.CreatedAt >= fromDate);
            }

            var slowestQueries = await query
                .OrderByDescending(m => m.ExecutionTimeMs)
                .Take(count)
                .ToListAsync();

            return slowestQueries.Select(m => new PerformanceMetricsDTO
            {
                QueryId = m.MetricId,
                Query = m.Query,
                ExecutionTimeMs = m.ExecutionTimeMs,
                DataSize = m.DataSize,
                CacheStatus = m.CacheStatus,
                Timestamp = m.CreatedAt,
                Metrics = new Dictionary<string, object>
                {
                    { "UserId", m.UserId },
                    { "Category", m.QueryCategory ?? "Unknown" }
                }
            }).ToList();
        }

        #endregion

        #region Cache Management

        public async Task<CacheStatisticsDTO> GetCacheStatisticsAsync()
        {
            var cacheEntries = await _context.AiCacheEntries
                .Where(c => c.ExpiresAt > DateTime.UtcNow)
                .ToListAsync();

            var recentMetrics = await _context.AiPerformanceMetrics
                .Where(m => m.CreatedAt >= DateTime.UtcNow.AddHours(-24))
                .ToListAsync();

            var totalQueries = recentMetrics.Count;
            var cacheHits = recentMetrics.Count(m => m.CacheStatus == "HIT");

            return new CacheStatisticsDTO
            {
                TotalQueries = totalQueries,
                CacheHits = cacheHits,
                CacheMisses = totalQueries - cacheHits,
                HitRatio = totalQueries > 0 ? (double)cacheHits / totalQueries : 0,
                TotalCacheSize = cacheEntries.Sum(c => c.SizeBytes),
                ActiveCacheEntries = cacheEntries.Count,
                LastUpdated = DateTime.UtcNow
            };
        }

        public async Task<bool> ClearCacheAsync(string? pattern = null)
        {
            try
            {
                var query = _context.AiCacheEntries.AsQueryable();

                if (!string.IsNullOrEmpty(pattern))
                {
                    query = query.Where(c => c.CacheKey.Contains(pattern));
                }

                var entriesToDelete = await query.ToListAsync();
                _context.AiCacheEntries.RemoveRange(entriesToDelete);
                await _context.SaveChangesAsync();

                // Also clear memory cache
                if (string.IsNullOrEmpty(pattern))
                {
                    if (_cache is MemoryCache memoryCache)
                    {
                        memoryCache.Clear();
                    }
                }

                _logger.LogInformation("Cache cleared. Pattern: {Pattern}, Entries removed: {Count}", pattern ?? "ALL", entriesToDelete.Count);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing cache with pattern: {Pattern}", pattern);
                return false;
            }
        }

        public async Task<bool> WarmCacheAsync(List<string> commonQueries)
        {
            try
            {
                var warmedCount = 0;
                foreach (var query in commonQueries)
                {
                    // This would typically execute the query and cache the result
                    // For now, we'll just create a placeholder cache entry
                    var cacheKey = $"warm_cache_{query.GetHashCode()}";
                    var cacheEntry = new AiCacheEntry
                    {
                        CacheKey = cacheKey,
                        CacheValue = "Warmed cache placeholder",
                        ExpiresAt = DateTime.UtcNow.AddHours(1),
                        DataType = "query_result",
                        SizeBytes = 100 // Placeholder size
                    };

                    _context.AiCacheEntries.Add(cacheEntry);
                    warmedCount++;
                }

                await _context.SaveChangesAsync();
                _logger.LogInformation("Cache warmed with {Count} entries", warmedCount);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error warming cache");
                return false;
            }
        }

        public async Task<string?> GetCachedResultAsync(string cacheKey)
        {
            try
            {
                // Check memory cache first
                if (_cache.TryGetValue(cacheKey, out string? cachedResult))
                {
                    return cachedResult;
                }

                // Check database cache
                var cacheEntry = await _context.AiCacheEntries
                    .FirstOrDefaultAsync(c => c.CacheKey == cacheKey && c.ExpiresAt > DateTime.UtcNow);

                if (cacheEntry != null)
                {
                    // Update access statistics
                    cacheEntry.LastAccessedAt = DateTime.UtcNow;
                    cacheEntry.AccessCount++;
                    await _context.SaveChangesAsync();

                    // Store in memory cache for faster access
                    _cache.Set(cacheKey, cacheEntry.CacheValue, TimeSpan.FromMinutes(15));
                    
                    return cacheEntry.CacheValue;
                }

                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving cached result for key: {CacheKey}", cacheKey);
                return null;
            }
        }

        public async Task SetCachedResultAsync(string cacheKey, string result, TimeSpan expiration)
        {
            try
            {
                // Store in memory cache
                _cache.Set(cacheKey, result, expiration);

                // Store in database cache for persistence
                var cacheEntry = new AiCacheEntry
                {
                    CacheKey = cacheKey,
                    CacheValue = result,
                    ExpiresAt = DateTime.UtcNow.Add(expiration),
                    DataType = "query_result",
                    SizeBytes = Encoding.UTF8.GetByteCount(result),
                    AccessCount = 0
                };

                _context.AiCacheEntries.Add(cacheEntry);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting cached result for key: {CacheKey}", cacheKey);
            }
        }

        public async Task InvalidateCacheAsync(string pattern)
        {
            await ClearCacheAsync(pattern);
        }

        #endregion

        #region Query Optimization

        public async Task<QueryPerformanceOptimizationDTO> OptimizeQueryAsync(string query)
        {
            try
            {
                // Simulate query optimization analysis
                var originalExecutionTime = await SimulateQueryExecutionTimeAsync(query);
                var optimizedQuery = await ApplyQueryOptimizationsAsync(query);
                var optimizedExecutionTime = await SimulateQueryExecutionTimeAsync(optimizedQuery);

                var optimization = new QueryPerformanceOptimizationDTO
                {
                    OriginalQuery = query,
                    OptimizedQuery = optimizedQuery,
                    OriginalExecutionTime = originalExecutionTime,
                    OptimizedExecutionTime = optimizedExecutionTime,
                    PerformanceGain = originalExecutionTime > 0 ? 
                        ((double)(originalExecutionTime - optimizedExecutionTime) / originalExecutionTime) * 100 : 0,
                    OptimizationTechniques = await GetAppliedOptimizationsAsync(query, optimizedQuery)
                };

                return optimization;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error optimizing query");
                throw;
            }
        }

        public async Task<List<string>> GenerateOptimizationSuggestionsAsync(string query)
        {
            var suggestions = new List<string>();

            // Analyze query patterns and suggest optimizations
            if (query.Contains("SELECT *"))
                suggestions.Add("Specify only needed columns instead of using SELECT *");

            if (query.Contains("ORDER BY") && !query.Contains("LIMIT"))
                suggestions.Add("Consider adding LIMIT clause when using ORDER BY");

            if (query.Contains("LIKE '%"))
                suggestions.Add("Avoid leading wildcards in LIKE patterns for better performance");

            if (!query.Contains("WHERE") && (query.Contains("Users") || query.Contains("Events")))
                suggestions.Add("Add WHERE clause to filter large tables");

            suggestions.Add("Consider adding appropriate indexes for frequently queried columns");
            suggestions.Add("Use parameterized queries to enable query plan caching");

            return await Task.FromResult(suggestions);
        }

        public async Task<bool> ApplyQueryOptimizationAsync(string originalQuery, string optimizedQuery)
        {
            try
            {
                // In a real implementation, this would update query optimization rules
                _logger.LogInformation("Query optimization applied from '{Original}' to '{Optimized}'", 
                    originalQuery.Substring(0, Math.Min(50, originalQuery.Length)), 
                    optimizedQuery.Substring(0, Math.Min(50, optimizedQuery.Length)));
                
                return await Task.FromResult(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error applying query optimization");
                return false;
            }
        }

        public async Task<Dictionary<string, double>> AnalyzeQueryComplexityAsync(string query)
        {
            var complexity = new Dictionary<string, double>();

            // Simple complexity analysis
            complexity["JoinCount"] = query.Split("JOIN", StringSplitOptions.RemoveEmptyEntries).Length - 1;
            complexity["SubqueryCount"] = query.Split("SELECT", StringSplitOptions.RemoveEmptyEntries).Length - 1;
            complexity["WhereConditions"] = query.Split("WHERE", StringSplitOptions.RemoveEmptyEntries).Length - 1;
            complexity["OrderByClause"] = query.Contains("ORDER BY") ? 1 : 0;
            complexity["GroupByClause"] = query.Contains("GROUP BY") ? 1 : 0;
            complexity["OverallComplexity"] = (complexity.Values.Sum() / 5.0) * 100; // Normalize to 0-100

            return await Task.FromResult(complexity);
        }

        #endregion

        #region System Health Monitoring

        public async Task<AISystemHealthDTO> GetSystemHealthAsync()
        {
            try
            {
                var cpuUsage = await GetCpuUsageAsync();
                var memoryUsage = await GetMemoryUsageAsync();
                var dbResponseTime = await MeasureDatabaseResponseTimeAsync();
                var activeConnections = await GetActiveConnectionsCountAsync();
                var queuedRequests = await GetQueuedRequestsCountAsync();

                var status = "Healthy";
                if (cpuUsage > HIGH_CPU_THRESHOLD_PERCENT || memoryUsage > HIGH_MEMORY_THRESHOLD_PERCENT || 
                    activeConnections > OVERLOAD_THRESHOLD_CONNECTIONS)
                {
                    status = dbResponseTime > 2000 ? "Critical" : "Degraded";
                }

                return new AISystemHealthDTO
                {
                    Status = status,
                    CpuUsage = cpuUsage,
                    MemoryUsage = memoryUsage,
                    DatabaseResponseTime = dbResponseTime,
                    ActiveConnections = activeConnections,
                    QueuedRequests = queuedRequests,
                    DetailedMetrics = await GetDetailedMetricsAsync(),
                    Timestamp = DateTime.UtcNow
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system health");
                return new AISystemHealthDTO
                {
                    Status = "Error",
                    Timestamp = DateTime.UtcNow
                };
            }
        }

        public async Task<Dictionary<string, object>> GetDetailedMetricsAsync()
        {
            var metrics = new Dictionary<string, object>();

            try
            {
                var recentMetrics = await _context.AiPerformanceMetrics
                    .Where(m => m.CreatedAt >= DateTime.UtcNow.AddHours(-1))
                    .ToListAsync();

                metrics["QueriesLastHour"] = recentMetrics.Count;
                metrics["AverageResponseTime"] = recentMetrics.Any() ? recentMetrics.Average(m => m.ExecutionTimeMs) : 0;
                metrics["CacheHitRate"] = recentMetrics.Any() ? 
                    (double)recentMetrics.Count(m => m.CacheStatus == "HIT") / recentMetrics.Count * 100 : 0;
                metrics["DatabaseConnections"] = await GetActiveConnectionsCountAsync();
                metrics["CacheEntries"] = await _context.AiCacheEntries.CountAsync(c => c.ExpiresAt > DateTime.UtcNow);
                metrics["ErrorRate"] = 0; // Would be calculated from error logs
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting detailed metrics");
                metrics["Error"] = ex.Message;
            }

            return metrics;
        }

        public async Task<bool> CheckDatabaseConnectionAsync()
        {
            try
            {
                await _context.Database.CanConnectAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Database connection check failed");
                return false;
            }
        }

        public async Task<double> MeasureDatabaseResponseTimeAsync()
        {
            try
            {
                var stopwatch = Stopwatch.StartNew();
                await _context.Database.CanConnectAsync();
                stopwatch.Stop();
                return stopwatch.ElapsedMilliseconds;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error measuring database response time");
                return -1;
            }
        }

        public async Task<List<string>> GetSystemWarningsAsync()
        {
            var warnings = new List<string>();

            var systemHealth = await GetSystemHealthAsync();
            
            if (systemHealth.CpuUsage > HIGH_CPU_THRESHOLD_PERCENT)
                warnings.Add($"High CPU usage: {systemHealth.CpuUsage:F1}%");
            
            if (systemHealth.MemoryUsage > HIGH_MEMORY_THRESHOLD_PERCENT)
                warnings.Add($"High memory usage: {systemHealth.MemoryUsage:F1}%");
            
            if (systemHealth.DatabaseResponseTime > 1000)
                warnings.Add($"Slow database response: {systemHealth.DatabaseResponseTime:F0}ms");
            
            if (systemHealth.ActiveConnections > OVERLOAD_THRESHOLD_CONNECTIONS)
                warnings.Add($"High connection count: {systemHealth.ActiveConnections}");

            return warnings;
        }

        #endregion

        #region Load Balancing & Scaling

        public async Task<bool> IsSystemOverloadedAsync()
        {
            var systemHealth = await GetSystemHealthAsync();
            return systemHealth.Status == "Critical" || 
                   systemHealth.ActiveConnections > OVERLOAD_THRESHOLD_CONNECTIONS ||
                   systemHealth.CpuUsage > HIGH_CPU_THRESHOLD_PERCENT;
        }

        public async Task<int> GetActiveConnectionsCountAsync()
        {
            try
            {
                // In a real implementation, this would query the database for active connections
                // For now, simulate based on recent activity
                var recentUsers = await _context.AiPerformanceMetrics
                    .Where(m => m.CreatedAt >= DateTime.UtcNow.AddMinutes(-5))
                    .Select(m => m.UserId)
                    .Distinct()
                    .CountAsync();
                
                return Math.Max(1, recentUsers); // Ensure at least 1 connection
            }
            catch
            {
                return 1; // Fallback
            }
        }

        public async Task<int> GetQueuedRequestsCountAsync()
        {
            // Simulate queued requests based on system load
            var isOverloaded = await IsSystemOverloadedAsync();
            return isOverloaded ? Random.Shared.Next(5, 20) : 0;
        }

        public async Task<Dictionary<string, int>> GetResourceUsageAsync()
        {
            return new Dictionary<string, int>
            {
                { "ActiveConnections", await GetActiveConnectionsCountAsync() },
                { "QueuedRequests", await GetQueuedRequestsCountAsync() },
                { "CacheEntries", await _context.AiCacheEntries.CountAsync() },
                { "RecentQueries", await _context.AiPerformanceMetrics
                    .CountAsync(m => m.CreatedAt >= DateTime.UtcNow.AddMinutes(-5)) }
            };
        }

        public async Task<bool> ScaleResourcesAsync(string resourceType, int targetLevel)
        {
            try
            {
                _logger.LogInformation("Scaling {ResourceType} to level {TargetLevel}", resourceType, targetLevel);
                // In a real implementation, this would trigger cloud scaling or resource adjustment
                return await Task.FromResult(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error scaling resources");
                return false;
            }
        }

        #endregion

        #region Performance Optimization Recommendations

        public async Task<List<string>> GetOptimizationRecommendationsAsync()
        {
            var recommendations = new List<string>();
            var systemHealth = await GetSystemHealthAsync();
            var cacheStats = await GetCacheStatisticsAsync();

            if (cacheStats.HitRatio < 0.5)
                recommendations.Add("Consider increasing cache expiration times to improve hit ratio");

            if (systemHealth.DatabaseResponseTime > 500)
                recommendations.Add("Database queries are slow - consider adding indexes or optimizing queries");

            if (systemHealth.ActiveConnections > 50)
                recommendations.Add("High connection count - consider implementing connection pooling");

            if (systemHealth.CpuUsage > 60)
                recommendations.Add("High CPU usage detected - consider scaling up or optimizing algorithms");

            recommendations.Add("Enable query result caching for frequently accessed data");
            recommendations.Add("Implement response compression for large payloads");

            return recommendations;
        }

        public async Task<Dictionary<string, object>> AnalyzeBottlenecksAsync()
        {
            var bottlenecks = new Dictionary<string, object>();

            var slowQueries = await GetSlowestQueriesAsync(5, TimeSpan.FromHours(24));
            var systemHealth = await GetSystemHealthAsync();

            bottlenecks["SlowestQueries"] = slowQueries.Select(q => new { q.Query, q.ExecutionTimeMs }).Take(3);
            bottlenecks["DatabaseResponseTime"] = systemHealth.DatabaseResponseTime;
            bottlenecks["CacheEfficiency"] = (await GetCacheStatisticsAsync()).HitRatio;
            bottlenecks["SystemLoad"] = new
            {
                CPU = systemHealth.CpuUsage,
                Memory = systemHealth.MemoryUsage,
                Connections = systemHealth.ActiveConnections
            };

            return bottlenecks;
        }

        public async Task<bool> EnablePerformanceOptimizationAsync(string optimizationType)
        {
            _logger.LogInformation("Enabling performance optimization: {OptimizationType}", optimizationType);
            return await Task.FromResult(true);
        }

        public async Task<bool> DisablePerformanceOptimizationAsync(string optimizationType)
        {
            _logger.LogInformation("Disabling performance optimization: {OptimizationType}", optimizationType);
            return await Task.FromResult(true);
        }

        #endregion

        #region Intelligent Data Prefetching

        public async Task<List<string>> PredictNextQueriesAsync(int userId, string currentQuery)
        {
            try
            {
                var userQueries = await _context.AiPerformanceMetrics
                    .Where(m => m.UserId == userId && m.CreatedAt >= DateTime.UtcNow.AddDays(-7))
                    .OrderByDescending(m => m.CreatedAt)
                    .Select(m => m.Query)
                    .Take(20)
                    .ToListAsync();

                // Simple prediction based on user's query patterns
                var predictions = userQueries
                    .Where(q => !string.Equals(q, currentQuery, StringComparison.OrdinalIgnoreCase))
                    .GroupBy(q => q)
                    .OrderByDescending(g => g.Count())
                    .Take(3)
                    .Select(g => g.Key)
                    .ToList();

                return predictions;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error predicting next queries for user {UserId}", userId);
                return new List<string>();
            }
        }

        public async Task<bool> PrefetchDataAsync(int userId, List<string> predictedQueries)
        {
            try
            {
                foreach (var query in predictedQueries)
                {
                    var cacheKey = $"prefetch_{userId}_{query.GetHashCode()}";
                    if (await GetCachedResultAsync(cacheKey) == null)
                    {
                        // Simulate prefetching data
                        await SetCachedResultAsync(cacheKey, "Prefetched data placeholder", TimeSpan.FromMinutes(30));
                    }
                }

                _logger.LogInformation("Prefetched data for {Count} queries for user {UserId}", predictedQueries.Count, userId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error prefetching data for user {UserId}", userId);
                return false;
            }
        }

        public async Task<Dictionary<string, object>> GetPrefetchStatisticsAsync()
        {
            var prefetchEntries = await _context.AiCacheEntries
                .Where(c => c.CacheKey.StartsWith("prefetch_") && c.ExpiresAt > DateTime.UtcNow)
                .ToListAsync();

            return new Dictionary<string, object>
            {
                { "PrefetchedEntries", prefetchEntries.Count },
                { "PrefetchCacheSize", prefetchEntries.Sum(c => c.SizeBytes) },
                { "PrefetchHitRate", prefetchEntries.Any() ? prefetchEntries.Average(c => c.AccessCount) : 0 }
            };
        }

        public async Task OptimizePrefetchingAsync()
        {
            try
            {
                // Remove unused prefetch entries
                var unusedEntries = await _context.AiCacheEntries
                    .Where(c => c.CacheKey.StartsWith("prefetch_") && c.AccessCount == 0 && 
                               c.CreatedAt < DateTime.UtcNow.AddHours(-2))
                    .ToListAsync();

                _context.AiCacheEntries.RemoveRange(unusedEntries);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Optimized prefetching by removing {Count} unused entries", unusedEntries.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error optimizing prefetching");
            }
        }

        #endregion

        #region Response Compression

        public async Task<byte[]> CompressResponseAsync(string response)
        {
            try
            {
                var bytes = Encoding.UTF8.GetBytes(response);
                using var output = new MemoryStream();
                using (var gzip = new GZipStream(output, CompressionMode.Compress))
                {
                    await gzip.WriteAsync(bytes, 0, bytes.Length);
                }
                return output.ToArray();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error compressing response");
                return Encoding.UTF8.GetBytes(response); // Return original as fallback
            }
        }

        public async Task<string> DecompressResponseAsync(byte[] compressedData)
        {
            try
            {
                using var input = new MemoryStream(compressedData);
                using var gzip = new GZipStream(input, CompressionMode.Decompress);
                using var output = new MemoryStream();
                await gzip.CopyToAsync(output);
                return Encoding.UTF8.GetString(output.ToArray());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error decompressing response");
                return string.Empty;
            }
        }

        public async Task<double> GetCompressionRatioAsync(string response)
        {
            try
            {
                var originalSize = Encoding.UTF8.GetByteCount(response);
                var compressed = await CompressResponseAsync(response);
                return originalSize > 0 ? (double)compressed.Length / originalSize : 1.0;
            }
            catch
            {
                return 1.0; // No compression
            }
        }

        public async Task<bool> ShouldCompressResponseAsync(string response, int threshold = 1024)
        {
            var size = Encoding.UTF8.GetByteCount(response);
            var compressionRatio = await GetCompressionRatioAsync(response);
            return size > threshold && compressionRatio < 0.8; // Compress if >1KB and >20% reduction
        }

        #endregion

        #region Request Throttling & Rate Limiting

        public async Task<bool> ShouldThrottleRequestAsync(int userId)
        {
            try
            {
                var recentRequests = await _context.AiPerformanceMetrics
                    .CountAsync(m => m.UserId == userId && m.CreatedAt >= DateTime.UtcNow.AddMinutes(-1));

                return recentRequests > 10; // Throttle if more than 10 requests per minute
            }
            catch
            {
                return false; // Don't throttle on error
            }
        }

        public async Task<TimeSpan> GetThrottleDelayAsync(int userId)
        {
            var shouldThrottle = await ShouldThrottleRequestAsync(userId);
            return shouldThrottle ? TimeSpan.FromSeconds(1) : TimeSpan.Zero;
        }

        public async Task<bool> IsUserExceedingLimitsAsync(int userId)
        {
            var hourlyRequests = await _context.AiPerformanceMetrics
                .CountAsync(m => m.UserId == userId && m.CreatedAt >= DateTime.UtcNow.AddHours(-1));

            return hourlyRequests > 100; // Limit of 100 requests per hour
        }

        public async Task<Dictionary<string, object>> GetThrottlingStatisticsAsync()
        {
            var recentMetrics = await _context.AiPerformanceMetrics
                .Where(m => m.CreatedAt >= DateTime.UtcNow.AddHours(-1))
                .ToListAsync();

            var throttledUsers = 0;
            var userGroups = recentMetrics.GroupBy(m => m.UserId);
            
            foreach (var group in userGroups)
            {
                if (group.Count() > 50) // Users with >50 requests/hour might be throttled
                    throttledUsers++;
            }

            return new Dictionary<string, object>
            {
                { "ThrottledUsers", throttledUsers },
                { "TotalUsers", userGroups.Count() },
                { "AverageRequestsPerUser", userGroups.Any() ? userGroups.Average(g => g.Count()) : 0 }
            };
        }

        #endregion

        #region Performance Alerts

        public async Task<bool> CreatePerformanceAlertAsync(string alertType, string message, string severity)
        {
            try
            {
                _logger.LogWarning("Performance Alert [{AlertType}] {Severity}: {Message}", alertType, severity, message);
                
                // In a real implementation, this would store alerts in a database table
                // and potentially send notifications to administrators
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating performance alert");
                return false;
            }
        }

        public async Task<List<object>> GetActivePerformanceAlertsAsync()
        {
            // Simulate active alerts based on current system health
            var systemHealth = await GetSystemHealthAsync();
            var alerts = new List<object>();

            if (systemHealth.CpuUsage > HIGH_CPU_THRESHOLD_PERCENT)
            {
                alerts.Add(new { Type = "HighCPU", Message = $"CPU usage is {systemHealth.CpuUsage:F1}%", Severity = "Warning" });
            }

            if (systemHealth.DatabaseResponseTime > 1000)
            {
                alerts.Add(new { Type = "SlowDatabase", Message = $"Database response time is {systemHealth.DatabaseResponseTime:F0}ms", Severity = "Critical" });
            }

            return alerts;
        }

        public async Task<bool> ResolvePerformanceAlertAsync(int alertId)
        {
            _logger.LogInformation("Performance alert {AlertId} resolved", alertId);
            return await Task.FromResult(true);
        }

        public async Task<Dictionary<string, int>> GetAlertSummaryAsync()
        {
            var alerts = await GetActivePerformanceAlertsAsync();
            
            return new Dictionary<string, int>
            {
                { "Total", alerts.Count },
                { "Critical", alerts.Count(a => ((dynamic)a).Severity == "Critical") },
                { "Warning", alerts.Count(a => ((dynamic)a).Severity == "Warning") },
                { "Info", alerts.Count(a => ((dynamic)a).Severity == "Info") }
            };
        }

        #endregion

        #region Helper Methods

        private async Task<string> DetermineQueryCategoryAsync(string query)
        {
            var queryLower = query.ToLower();
            
            if (queryLower.Contains("volunteer"))
                return "Volunteer";
            else if (queryLower.Contains("event"))
                return "Event";
            else if (queryLower.Contains("organization"))
                return "Organization";
            else if (queryLower.Contains("partner"))
                return "Partner";
            else
                return await Task.FromResult("General");
        }

        private async Task<int> SimulateQueryExecutionTimeAsync(string query)
        {
            // Simulate execution time based on query complexity
            var baseTime = 100;
            var complexity = query.Length / 10;
            var joinCount = query.Split("JOIN", StringSplitOptions.RemoveEmptyEntries).Length - 1;
            
            return await Task.FromResult(baseTime + complexity + (joinCount * 50));
        }

        private async Task<string> ApplyQueryOptimizationsAsync(string query)
        {
            // Simple query optimizations
            var optimized = query
                .Replace("SELECT *", "SELECT id, name") // Example optimization
                .Replace("LIKE '%term%'", "LIKE 'term%'"); // Remove leading wildcard

            return await Task.FromResult(optimized);
        }

        private async Task<List<string>> GetAppliedOptimizationsAsync(string original, string optimized)
        {
            var optimizations = new List<string>();

            if (original.Contains("SELECT *") && !optimized.Contains("SELECT *"))
                optimizations.Add("Replaced SELECT * with specific columns");

            if (original.Contains("LIKE '%") && !optimized.Contains("LIKE '%"))
                optimizations.Add("Removed leading wildcards from LIKE patterns");

            return await Task.FromResult(optimizations);
        }

        private async Task<double> GetCpuUsageAsync()
        {
            // Simulate CPU usage - in real implementation, would use performance counters
            return await Task.FromResult(Random.Shared.NextDouble() * 100);
        }

        private async Task<double> GetMemoryUsageAsync()
        {
            // Simulate memory usage - in real implementation, would use GC or performance counters
            return await Task.FromResult(Random.Shared.NextDouble() * 100);
        }

        #endregion
    }
}
