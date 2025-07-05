namespace ivan_api.DTOs.AIDatabaseManage;

// Query Analysis DTOs
public class QueryAnalysisDTO
{
    public string OriginalQuery { get; set; } = string.Empty; // The original user query
    public string QueryCategory { get; set; } = string.Empty;
    public List<string> RequiredTables { get; set; } = new();
    public string QueryType { get; set; } = string.Empty; // analytics, reporting, lookup, etc.
    public Dictionary<string, object> Parameters { get; set; } = new();
    public string EstimatedComplexity { get; set; } = "Low"; // Low, Medium, High
}

// Enhanced Query Processing DTOs
public class AIQueryResultDTO
{
    public bool Success { get; set; }
    public string Result { get; set; } = string.Empty;
    public string QueryCategory { get; set; } = string.Empty;
    public List<string> TablesAccessed { get; set; } = new();
    public int ExecutionTimeMs { get; set; }
    public string? ErrorMessage { get; set; }
    public QueryOptimizationDTO? Optimization { get; set; }
    public List<InsightDTO> GeneratedInsights { get; set; } = new();
}

public class SuggestedQueryDTO
{
    public string QueryText { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Complexity { get; set; } = "Low";
    public double RelevanceScore { get; set; }
}

public class QueryOptimizationDTO
{
    public string OriginalQuery { get; set; } = string.Empty;
    public string OptimizedQuery { get; set; } = string.Empty;
    public List<string> OptimizationTechniques { get; set; } = new();
    public int EstimatedPerformanceGain { get; set; }
    public List<string> CachingRecommendations { get; set; } = new();
}

public class TrendAnalysisDTO
{
    public string Metric { get; set; } = string.Empty;
    public TimeSpan AnalysisPeriod { get; set; }
    public List<TrendDataPointDTO> DataPoints { get; set; } = new();
    public string TrendDirection { get; set; } = string.Empty; // "Increasing", "Decreasing", "Stable"
    public double TrendStrength { get; set; } // 0-100
    public List<string> KeyInsights { get; set; } = new();
    public Dictionary<string, object> Predictions { get; set; } = new();
}

public class TrendDataPointDTO
{
    public DateTime Date { get; set; }
    public double Value { get; set; }
    public string? Label { get; set; }
    public Dictionary<string, object> Metadata { get; set; } = new();
}

public class InsightDTO
{
    public string InsightId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Priority { get; set; } = "Medium"; // Low, Medium, High, Critical
    public string Type { get; set; } = string.Empty; // Alert, Recommendation, Trend, Anomaly
    public Dictionary<string, object> Data { get; set; } = new();
    public List<string> ActionItems { get; set; } = new();
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public bool IsActionable { get; set; } = true;
}

public class AIQueryHistoryDTO
{
    public string QueryId { get; set; } = string.Empty;
    public string QueryText { get; set; } = string.Empty;
    public string QueryCategory { get; set; } = string.Empty;
    public string ResponseText { get; set; } = string.Empty;
    public int ExecutionTimeMs { get; set; }
    public int? ResponseQuality { get; set; } // 1-5 rating
    public DateTime QueryDate { get; set; } = DateTime.UtcNow;
    public Dictionary<string, object> QueryMetadata { get; set; } = new();
}

// Request DTOs for AI Query API
public class AdvancedQueryRequestDTO
{
    public string Query { get; set; } = string.Empty;
    public int? InstructionId { get; set; } // Optional AI instruction to use
    public string? Category { get; set; } // Optional query category
    public Dictionary<string, object>? Context { get; set; } // Additional context
}

public class QueryAnalysisRequestDTO
{
    public string Query { get; set; } = string.Empty;
    public bool IncludeOptimization { get; set; } = true;
}
