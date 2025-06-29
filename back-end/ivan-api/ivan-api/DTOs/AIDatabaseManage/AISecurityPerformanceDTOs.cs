namespace ivan_api.DTOs.AIDatabaseManage;

// PHASE 6: SECURITY & PERFORMANCE DTOs

// Security DTOs
public class DataAccessResultDTO
{
    public object OriginalData { get; set; } = new();
    public object FilteredData { get; set; } = new();
    public bool SensitiveDataDetected { get; set; }
    public List<string> RedactedFields { get; set; } = new();
}

public class QueryValidationResultDTO
{
    public string OriginalQuery { get; set; } = string.Empty;
    public string SanitizedQuery { get; set; } = string.Empty;
    public bool IsValid { get; set; }
    public bool HasSecurityRisks { get; set; }
    public List<SecurityRiskDTO> SecurityRisks { get; set; } = new();
    public List<string> Warnings { get; set; } = new();
}

public class SecurityRiskDTO
{
    public string Type { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty; // LOW, MEDIUM, HIGH, CRITICAL
    public string Description { get; set; } = string.Empty;
    public string Pattern { get; set; } = string.Empty;
}

public class SecurityAuditLogDTO
{
    public int LogId { get; set; }
    public int UserId { get; set; }
    public string EventType { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class RateLimitStatusDTO
{
    public int UserId { get; set; }
    public Dictionary<string, RateLimitDetailDTO> Limits { get; set; } = new();
    public bool IsBlocked { get; set; }
    public DateTime? BlockedUntil { get; set; }
}

public class RateLimitDetailDTO
{
    public string Operation { get; set; } = string.Empty;
    public int Current { get; set; }
    public int Limit { get; set; }
    public int WindowMinutes { get; set; }
    public int RemainingRequests { get; set; }
}

public class ContentFilterResultDTO
{
    public string OriginalResponse { get; set; } = string.Empty;
    public string FilteredResponse { get; set; } = string.Empty;
    public bool ContainsSensitiveData { get; set; }
    public List<string> RedactedElements { get; set; } = new();
}

public class UserPermissionsDTO
{
    public int UserId { get; set; }
    public bool CanCreateInstructions { get; set; }
    public bool CanModifyInstructions { get; set; }
    public bool CanDeleteInstructions { get; set; }
    public bool CanAccessAllData { get; set; }
    public bool CanViewAuditLogs { get; set; }
    public List<string> AllowedDataTables { get; set; } = new();
    public int MaxQueriesPerHour { get; set; }
}

// Performance DTOs
public class PerformanceMetricsDTO
{
    public int QueryId { get; set; }
    public string Query { get; set; } = string.Empty;
    public int ExecutionTimeMs { get; set; }
    public int DataSize { get; set; }
    public string CacheStatus { get; set; } = string.Empty; // HIT, MISS, BYPASS
    public DateTime Timestamp { get; set; }
    public Dictionary<string, object> Metrics { get; set; } = new();
}

public class CacheStatisticsDTO
{
    public int TotalQueries { get; set; }
    public int CacheHits { get; set; }
    public int CacheMisses { get; set; }
    public double HitRatio { get; set; }
    public long TotalCacheSize { get; set; }
    public int ActiveCacheEntries { get; set; }
    public DateTime LastUpdated { get; set; }
}

public class QueryPerformanceOptimizationDTO
{
    public string OriginalQuery { get; set; } = string.Empty;
    public string OptimizedQuery { get; set; } = string.Empty;
    public int OriginalExecutionTime { get; set; }
    public int OptimizedExecutionTime { get; set; }
    public double PerformanceGain { get; set; }
    public List<string> OptimizationTechniques { get; set; } = new();
}

public class AISystemHealthDTO
{
    public string Status { get; set; } = "Healthy"; // Healthy, Degraded, Critical
    public double CpuUsage { get; set; }
    public double MemoryUsage { get; set; }
    public double DatabaseResponseTime { get; set; }
    public int ActiveConnections { get; set; }
    public int QueuedRequests { get; set; }
    public Dictionary<string, object> DetailedMetrics { get; set; } = new();
    public DateTime Timestamp { get; set; }
}
