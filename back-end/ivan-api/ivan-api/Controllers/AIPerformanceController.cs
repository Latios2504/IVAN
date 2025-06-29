using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs;
using ivan_api.DTOs.AIDatabaseManage;
using ivan_api.Services.AIPerformanceServ;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    /// <summary>
    /// Controller for AI performance monitoring, optimization, and system health
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AIPerformanceController : ControllerBase
    {
        private readonly IAIPerformanceService _performanceService;
        private readonly ILogger<AIPerformanceController> _logger;

        public AIPerformanceController(
            IAIPerformanceService performanceService,
            ILogger<AIPerformanceController> logger)
        {
            _performanceService = performanceService;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId) ? userId : 0;
        }

        #region Performance Monitoring

        /// <summary>
        /// Record query performance metrics
        /// </summary>
        [HttpPost("metrics/record")]
        public async Task<ActionResult<PerformanceMetricsDTO>> RecordQueryPerformance([FromBody] RecordPerformanceRequestDTO request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var metrics = await _performanceService.RecordQueryPerformanceAsync(
                    userId, request.Query, request.ExecutionTimeMs, request.DataSize, request.CacheStatus);
                return Ok(metrics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error recording query performance");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get performance metrics for user
        /// </summary>
        [HttpGet("metrics")]
        public async Task<ActionResult<List<PerformanceMetricsDTO>>> GetPerformanceMetrics(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var userId = GetCurrentUserId();
                var metrics = await _performanceService.GetPerformanceMetricsAsync(userId, fromDate, toDate);
                return Ok(metrics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting performance metrics");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get performance statistics for a time period
        /// </summary>
        [HttpGet("statistics")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<Dictionary<string, object>>> GetPerformanceStatistics([FromQuery] int hours = 24)
        {
            try
            {
                var period = TimeSpan.FromHours(hours);
                var statistics = await _performanceService.GetPerformanceStatisticsAsync(period);
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting performance statistics");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get slowest queries
        /// </summary>
        [HttpGet("slowest-queries")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<List<PerformanceMetricsDTO>>> GetSlowestQueries(
            [FromQuery] int count = 10,
            [FromQuery] int hours = 24)
        {
            try
            {
                var period = TimeSpan.FromHours(hours);
                var slowQueries = await _performanceService.GetSlowestQueriesAsync(count, period);
                return Ok(slowQueries);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting slowest queries");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region Cache Management

        /// <summary>
        /// Get cache statistics
        /// </summary>
        [HttpGet("cache/statistics")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<CacheStatisticsDTO>> GetCacheStatistics()
        {
            try
            {
                var statistics = await _performanceService.GetCacheStatisticsAsync();
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting cache statistics");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Clear cache entries
        /// </summary>
        [HttpDelete("cache/clear")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> ClearCache([FromQuery] string? pattern = null)
        {
            try
            {
                var success = await _performanceService.ClearCacheAsync(pattern);
                return Ok(new { success, message = success ? "Cache cleared successfully" : "Failed to clear cache" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing cache");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Warm cache with common queries
        /// </summary>
        [HttpPost("cache/warm")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> WarmCache([FromBody] List<string> commonQueries)
        {
            try
            {
                var success = await _performanceService.WarmCacheAsync(commonQueries);
                return Ok(new { success, message = success ? "Cache warmed successfully" : "Failed to warm cache" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error warming cache");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get cached result
        /// </summary>
        [HttpGet("cache/get/{cacheKey}")]
        public async Task<ActionResult<string?>> GetCachedResult(string cacheKey)
        {
            try
            {
                var result = await _performanceService.GetCachedResultAsync(cacheKey);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting cached result");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Set cached result
        /// </summary>
        [HttpPost("cache/set")]
        public async Task<ActionResult> SetCachedResult([FromBody] SetCacheRequestDTO request)
        {
            try
            {
                var expiration = TimeSpan.FromMinutes(request.ExpirationMinutes);
                await _performanceService.SetCachedResultAsync(request.CacheKey, request.Result, expiration);
                return Ok(new { message = "Cache set successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting cached result");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Invalidate cache pattern
        /// </summary>
        [HttpDelete("cache/invalidate/{pattern}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> InvalidateCache(string pattern)
        {
            try
            {
                await _performanceService.InvalidateCacheAsync(pattern);
                return Ok(new { message = "Cache invalidated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error invalidating cache");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region Query Optimization

        /// <summary>
        /// Optimize a query
        /// </summary>
        [HttpPost("optimization/optimize-query")]
        public async Task<ActionResult<QueryPerformanceOptimizationDTO>> OptimizeQuery([FromBody] string query)
        {
            try
            {
                var optimization = await _performanceService.OptimizeQueryAsync(query);
                return Ok(optimization);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error optimizing query");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Generate optimization suggestions for a query
        /// </summary>
        [HttpPost("optimization/suggestions")]
        public async Task<ActionResult<List<string>>> GenerateOptimizationSuggestions([FromBody] string query)
        {
            try
            {
                var suggestions = await _performanceService.GenerateOptimizationSuggestionsAsync(query);
                return Ok(suggestions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating optimization suggestions");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Apply query optimization
        /// </summary>
        [HttpPost("optimization/apply")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> ApplyQueryOptimization([FromBody] ApplyOptimizationRequestDTO request)
        {
            try
            {
                var success = await _performanceService.ApplyQueryOptimizationAsync(request.OriginalQuery, request.OptimizedQuery);
                return Ok(new { success, message = success ? "Optimization applied successfully" : "Failed to apply optimization" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error applying query optimization");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Analyze query complexity
        /// </summary>
        [HttpPost("optimization/analyze-complexity")]
        public async Task<ActionResult<Dictionary<string, double>>> AnalyzeQueryComplexity([FromBody] string query)
        {
            try
            {
                var complexity = await _performanceService.AnalyzeQueryComplexityAsync(query);
                return Ok(complexity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error analyzing query complexity");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region System Health Monitoring

        /// <summary>
        /// Get system health status
        /// </summary>
        [HttpGet("health")]
        public async Task<ActionResult<AISystemHealthDTO>> GetSystemHealth()
        {
            try
            {
                var health = await _performanceService.GetSystemHealthAsync();
                return Ok(health);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system health");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get detailed system metrics
        /// </summary>
        [HttpGet("health/detailed")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<Dictionary<string, object>>> GetDetailedMetrics()
        {
            try
            {
                var metrics = await _performanceService.GetDetailedMetricsAsync();
                return Ok(metrics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting detailed metrics");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Check database connection
        /// </summary>
        [HttpGet("health/database")]
        public async Task<ActionResult<bool>> CheckDatabaseConnection()
        {
            try
            {
                var isConnected = await _performanceService.CheckDatabaseConnectionAsync();
                return Ok(isConnected);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking database connection");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Measure database response time
        /// </summary>
        [HttpGet("health/database-response-time")]
        public async Task<ActionResult<double>> MeasureDatabaseResponseTime()
        {
            try
            {
                var responseTime = await _performanceService.MeasureDatabaseResponseTimeAsync();
                return Ok(responseTime);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error measuring database response time");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get system warnings
        /// </summary>
        [HttpGet("health/warnings")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<List<string>>> GetSystemWarnings()
        {
            try
            {
                var warnings = await _performanceService.GetSystemWarningsAsync();
                return Ok(warnings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system warnings");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region Load Balancing & Scaling

        /// <summary>
        /// Check if system is overloaded
        /// </summary>
        [HttpGet("scaling/overloaded")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<bool>> IsSystemOverloaded()
        {
            try
            {
                var isOverloaded = await _performanceService.IsSystemOverloadedAsync();
                return Ok(isOverloaded);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking system overload");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get resource usage statistics
        /// </summary>
        [HttpGet("scaling/resource-usage")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<Dictionary<string, int>>> GetResourceUsage()
        {
            try
            {
                var usage = await _performanceService.GetResourceUsageAsync();
                return Ok(usage);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting resource usage");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Scale resources
        /// </summary>
        [HttpPost("scaling/scale/{resourceType}/{targetLevel}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> ScaleResources(string resourceType, int targetLevel)
        {
            try
            {
                var success = await _performanceService.ScaleResourcesAsync(resourceType, targetLevel);
                return Ok(new { success, message = success ? "Resources scaled successfully" : "Failed to scale resources" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error scaling resources");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region Performance Optimization Recommendations

        /// <summary>
        /// Get optimization recommendations
        /// </summary>
        [HttpGet("recommendations")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<List<string>>> GetOptimizationRecommendations()
        {
            try
            {
                var recommendations = await _performanceService.GetOptimizationRecommendationsAsync();
                return Ok(recommendations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting optimization recommendations");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Analyze system bottlenecks
        /// </summary>
        [HttpGet("recommendations/bottlenecks")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<Dictionary<string, object>>> AnalyzeBottlenecks()
        {
            try
            {
                var bottlenecks = await _performanceService.AnalyzeBottlenecksAsync();
                return Ok(bottlenecks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error analyzing bottlenecks");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Enable performance optimization
        /// </summary>
        [HttpPost("recommendations/enable/{optimizationType}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> EnablePerformanceOptimization(string optimizationType)
        {
            try
            {
                var success = await _performanceService.EnablePerformanceOptimizationAsync(optimizationType);
                return Ok(new { success, message = success ? "Optimization enabled successfully" : "Failed to enable optimization" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error enabling performance optimization");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Disable performance optimization
        /// </summary>
        [HttpPost("recommendations/disable/{optimizationType}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> DisablePerformanceOptimization(string optimizationType)
        {
            try
            {
                var success = await _performanceService.DisablePerformanceOptimizationAsync(optimizationType);
                return Ok(new { success, message = success ? "Optimization disabled successfully" : "Failed to disable optimization" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error disabling performance optimization");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region Intelligent Data Prefetching

        /// <summary>
        /// Predict next queries for user
        /// </summary>
        [HttpPost("prefetch/predict")]
        public async Task<ActionResult<List<string>>> PredictNextQueries([FromBody] string currentQuery)
        {
            try
            {
                var userId = GetCurrentUserId();
                var predictions = await _performanceService.PredictNextQueriesAsync(userId, currentQuery);
                return Ok(predictions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error predicting next queries");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Prefetch data for predicted queries
        /// </summary>
        [HttpPost("prefetch/data")]
        public async Task<ActionResult> PrefetchData([FromBody] List<string> predictedQueries)
        {
            try
            {
                var userId = GetCurrentUserId();
                var success = await _performanceService.PrefetchDataAsync(userId, predictedQueries);
                return Ok(new { success, message = success ? "Data prefetched successfully" : "Failed to prefetch data" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error prefetching data");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get prefetch statistics
        /// </summary>
        [HttpGet("prefetch/statistics")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<Dictionary<string, object>>> GetPrefetchStatistics()
        {
            try
            {
                var statistics = await _performanceService.GetPrefetchStatisticsAsync();
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting prefetch statistics");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Optimize prefetching algorithms
        /// </summary>
        [HttpPost("prefetch/optimize")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> OptimizePrefetching()
        {
            try
            {
                await _performanceService.OptimizePrefetchingAsync();
                return Ok(new { message = "Prefetching optimized successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error optimizing prefetching");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region Response Compression

        /// <summary>
        /// Compress response data
        /// </summary>
        [HttpPost("compression/compress")]
        public async Task<ActionResult<byte[]>> CompressResponse([FromBody] string response)
        {
            try
            {
                var compressed = await _performanceService.CompressResponseAsync(response);
                return Ok(compressed);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error compressing response");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Decompress response data
        /// </summary>
        [HttpPost("compression/decompress")]
        public async Task<ActionResult<string>> DecompressResponse([FromBody] byte[] compressedData)
        {
            try
            {
                var decompressed = await _performanceService.DecompressResponseAsync(compressedData);
                return Ok(decompressed);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error decompressing response");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get compression ratio for response
        /// </summary>
        [HttpPost("compression/ratio")]
        public async Task<ActionResult<double>> GetCompressionRatio([FromBody] string response)
        {
            try
            {
                var ratio = await _performanceService.GetCompressionRatioAsync(response);
                return Ok(ratio);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting compression ratio");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Check if response should be compressed
        /// </summary>
        [HttpPost("compression/should-compress")]
        public async Task<ActionResult<bool>> ShouldCompressResponse([FromBody] string response, [FromQuery] int threshold = 1024)
        {
            try
            {
                var shouldCompress = await _performanceService.ShouldCompressResponseAsync(response, threshold);
                return Ok(shouldCompress);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking compression eligibility");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region Request Throttling & Rate Limiting

        /// <summary>
        /// Check if request should be throttled
        /// </summary>
        [HttpGet("throttling/should-throttle")]
        public async Task<ActionResult<bool>> ShouldThrottleRequest()
        {
            try
            {
                var userId = GetCurrentUserId();
                var shouldThrottle = await _performanceService.ShouldThrottleRequestAsync(userId);
                return Ok(shouldThrottle);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking throttling status");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get throttle delay for user
        /// </summary>
        [HttpGet("throttling/delay")]
        public async Task<ActionResult<TimeSpan>> GetThrottleDelay()
        {
            try
            {
                var userId = GetCurrentUserId();
                var delay = await _performanceService.GetThrottleDelayAsync(userId);
                return Ok(delay);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting throttle delay");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Check if user is exceeding limits
        /// </summary>
        [HttpGet("throttling/exceeding-limits")]
        public async Task<ActionResult<bool>> IsUserExceedingLimits()
        {
            try
            {
                var userId = GetCurrentUserId();
                var exceeding = await _performanceService.IsUserExceedingLimitsAsync(userId);
                return Ok(exceeding);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking user limits");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get throttling statistics
        /// </summary>
        [HttpGet("throttling/statistics")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<Dictionary<string, object>>> GetThrottlingStatistics()
        {
            try
            {
                var statistics = await _performanceService.GetThrottlingStatisticsAsync();
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting throttling statistics");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region Performance Alerts

        /// <summary>
        /// Create performance alert
        /// </summary>
        [HttpPost("alerts/create")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> CreatePerformanceAlert([FromBody] CreateAlertRequestDTO request)
        {
            try
            {
                var success = await _performanceService.CreatePerformanceAlertAsync(request.AlertType, request.Message, request.Severity);
                return Ok(new { success, message = success ? "Alert created successfully" : "Failed to create alert" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating performance alert");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get active performance alerts
        /// </summary>
        [HttpGet("alerts/active")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<List<object>>> GetActivePerformanceAlerts()
        {
            try
            {
                var alerts = await _performanceService.GetActivePerformanceAlertsAsync();
                return Ok(alerts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting active performance alerts");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Resolve performance alert
        /// </summary>
        [HttpPost("alerts/resolve/{alertId}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> ResolvePerformanceAlert(int alertId)
        {
            try
            {
                var success = await _performanceService.ResolvePerformanceAlertAsync(alertId);
                return Ok(new { success, message = success ? "Alert resolved successfully" : "Failed to resolve alert" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resolving performance alert");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get alert summary
        /// </summary>
        [HttpGet("alerts/summary")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<Dictionary<string, int>>> GetAlertSummary()
        {
            try
            {
                var summary = await _performanceService.GetAlertSummaryAsync();
                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting alert summary");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion
    }

    // Request DTOs for performance controller
    public class RecordPerformanceRequestDTO
    {
        public string Query { get; set; } = string.Empty;
        public int ExecutionTimeMs { get; set; }
        public int DataSize { get; set; }
        public string CacheStatus { get; set; } = "MISS";
    }

    public class SetCacheRequestDTO
    {
        public string CacheKey { get; set; } = string.Empty;
        public string Result { get; set; } = string.Empty;
        public int ExpirationMinutes { get; set; } = 30;
    }

    public class ApplyOptimizationRequestDTO
    {
        public string OriginalQuery { get; set; } = string.Empty;
        public string OptimizedQuery { get; set; } = string.Empty;
    }

    public class CreateAlertRequestDTO
    {
        public string AlertType { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Severity { get; set; } = "INFO";
    }
}
