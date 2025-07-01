using ivan_api.DTOs;
using ivan_api.DTOs.AIDatabaseManage;

namespace ivan_api.Services.AIPerformanceServ
{
    /// <summary>
    /// Service interface for AI performance monitoring and optimization
    /// </summary>
    public interface IAIPerformanceService
    {
        // Performance Monitoring
        Task<PerformanceMetricsDTO> RecordQueryPerformanceAsync(int userId, string query, int executionTimeMs, int dataSize, string cacheStatus);
        Task<List<PerformanceMetricsDTO>> GetPerformanceMetricsAsync(int userId, DateTime? fromDate = null, DateTime? toDate = null);
        Task<Dictionary<string, object>> GetPerformanceStatisticsAsync(TimeSpan period);
        Task<List<PerformanceMetricsDTO>> GetSlowestQueriesAsync(int count = 10, TimeSpan? period = null);

        // Cache Management
        Task<CacheStatisticsDTO> GetCacheStatisticsAsync();
        Task<bool> ClearCacheAsync(string? pattern = null);
        Task<bool> WarmCacheAsync(List<string> commonQueries);
        Task<string?> GetCachedResultAsync(string cacheKey);
        Task SetCachedResultAsync(string cacheKey, string result, TimeSpan expiration);
        Task InvalidateCacheAsync(string pattern);

        // Query Optimization
        Task<QueryPerformanceOptimizationDTO> OptimizeQueryAsync(string query);
        Task<List<string>> GenerateOptimizationSuggestionsAsync(string query);
        Task<bool> ApplyQueryOptimizationAsync(string originalQuery, string optimizedQuery);
        Task<Dictionary<string, double>> AnalyzeQueryComplexityAsync(string query);

        // System Health Monitoring
        Task<AISystemHealthDTO> GetSystemHealthAsync();
        Task<Dictionary<string, object>> GetDetailedMetricsAsync();
        Task<bool> CheckDatabaseConnectionAsync();
        Task<double> MeasureDatabaseResponseTimeAsync();
        Task<List<string>> GetSystemWarningsAsync();

        // Load Balancing & Scaling
        Task<bool> IsSystemOverloadedAsync();
        Task<int> GetActiveConnectionsCountAsync();
        Task<int> GetQueuedRequestsCountAsync();
        Task<Dictionary<string, int>> GetResourceUsageAsync();
        Task<bool> ScaleResourcesAsync(string resourceType, int targetLevel);

        // Performance Optimization Recommendations
        Task<List<string>> GetOptimizationRecommendationsAsync();
        Task<Dictionary<string, object>> AnalyzeBottlenecksAsync();
        Task<bool> EnablePerformanceOptimizationAsync(string optimizationType);
        Task<bool> DisablePerformanceOptimizationAsync(string optimizationType);

        // Intelligent Data Prefetching
        Task<List<string>> PredictNextQueriesAsync(int userId, string currentQuery);
        Task<bool> PrefetchDataAsync(int userId, List<string> predictedQueries);
        Task<Dictionary<string, object>> GetPrefetchStatisticsAsync();
        Task OptimizePrefetchingAsync();

        // Response Compression
        Task<byte[]> CompressResponseAsync(string response);
        Task<string> DecompressResponseAsync(byte[] compressedData);
        Task<double> GetCompressionRatioAsync(string response);
        Task<bool> ShouldCompressResponseAsync(string response, int threshold = 1024);

        // Request Throttling & Rate Limiting
        Task<bool> ShouldThrottleRequestAsync(int userId);
        Task<TimeSpan> GetThrottleDelayAsync(int userId);
        Task<bool> IsUserExceedingLimitsAsync(int userId);
        Task<Dictionary<string, object>> GetThrottlingStatisticsAsync();

        // Performance Alerts
        Task<bool> CreatePerformanceAlertAsync(string alertType, string message, string severity);
        Task<List<object>> GetActivePerformanceAlertsAsync();
        Task<bool> ResolvePerformanceAlertAsync(int alertId);
        Task<Dictionary<string, int>> GetAlertSummaryAsync();
    }
}
