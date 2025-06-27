namespace ivan_api.DTOs;

// AI Database Request/Response DTOs
public class AIDatabaseRequestDTO
{
    public string Query { get; set; } = string.Empty;
    public string QueryCategory { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string? InstructionProfile { get; set; }
}

public class AIDatabaseResponseDTO
{
    public bool Success { get; set; }
    public string Data { get; set; } = string.Empty;
    public string QueryCategory { get; set; } = string.Empty;
    public string TablesAccessed { get; set; } = string.Empty;
    public int ExecutionTimeMs { get; set; }
    public string? ErrorMessage { get; set; }
}

// Query Analysis DTOs
public class QueryAnalysisDTO
{
    public string QueryCategory { get; set; } = string.Empty;
    public List<string> RequiredTables { get; set; } = new();
    public string QueryType { get; set; } = string.Empty; // analytics, reporting, lookup, etc.
    public Dictionary<string, object> Parameters { get; set; } = new();
    public string EstimatedComplexity { get; set; } = "Low"; // Low, Medium, High
}

// Database Summary DTOs
public class DatabaseSummaryDTO
{
    public string Summary { get; set; } = string.Empty;
    public Dictionary<string, object> Data { get; set; } = new();
    public List<string> TablesIncluded { get; set; } = new();
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
}

// AI Custom Instruction DTOs
public class AiCustomInstructionDTO
{
    public int? InstructionId { get; set; }
    public string InstructionName { get; set; } = string.Empty;
    public string SystemPrompt { get; set; } = string.Empty;
    public string? BehaviorInstructions { get; set; }
    public string? DataAccessRules { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsDefault { get; set; } = false;
}

public class AiCustomInstructionCreateDTO
{
    public string InstructionName { get; set; } = string.Empty;
    public string SystemPrompt { get; set; } = string.Empty;
    public string? BehaviorInstructions { get; set; }
    public string? DataAccessRules { get; set; }
}

public class AiCustomInstructionUpdateDTO : AiCustomInstructionCreateDTO
{
    public bool IsActive { get; set; } = true;
}

// AI Query Analytics DTOs
public class AiQueryAnalyticsDTO
{
    public int QueryId { get; set; }
    public int UserId { get; set; }
    public int? InstructionId { get; set; }
    public string QueryText { get; set; } = string.Empty;
    public int? ResponseQuality { get; set; }
    public int ExecutionTime { get; set; }
    public string? DataTablesAccessed { get; set; }
    public DateTime CreatedAt { get; set; }
}

// Enhanced Chat Message DTOs with AI Instructions
public class EnhancedChatMessageRequestDTO : ChatMessageRequestDTO
{
    public string? InstructionProfile { get; set; }
    public bool IncludeDatabaseContext { get; set; } = true;
}

public class EnhancedChatMessageResponseDTO : ChatMessageResponseDTO
{
    public string? InstructionUsed { get; set; }
    public List<string>? TablesAccessed { get; set; }
    public int ExecutionTimeMs { get; set; }
    public string? QueryCategory { get; set; }
}

// Phase 3: Enhanced Query Processing DTOs
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

public class DataSummaryDTO
{
    public string Summary { get; set; } = string.Empty;
    public Dictionary<string, object> KeyMetrics { get; set; } = new();
    public List<string> DataSources { get; set; } = new();
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public int DataFreshness { get; set; } // Minutes since last update
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

// Phase 4: Conversation Management DTOs
public class AIConversationContextDTO
{
    public string ConversationId { get; set; } = string.Empty;
    public int UserId { get; set; }
    public int? InstructionId { get; set; }
    public string? InstructionName { get; set; }
    public Dictionary<string, object> SessionData { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiresAt { get; set; }
    public bool IsActive { get; set; } = true;
    public int MessageCount { get; set; } = 0;
}

public class ConversationHistoryDTO
{
    public int HistoryId { get; set; }
    public string ConversationId { get; set; } = string.Empty;
    public string Query { get; set; } = string.Empty;
    public string Response { get; set; } = string.Empty;
    public string QueryCategory { get; set; } = string.Empty;
    public int ExecutionTimeMs { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Dictionary<string, object> Metadata { get; set; } = new();
}

public class ConversationSummaryDTO
{
    public string ConversationId { get; set; } = string.Empty;
    public int TotalQueries { get; set; }
    public TimeSpan Duration { get; set; }
    public List<string> TopCategories { get; set; } = new();
    public List<string> KeyTopics { get; set; } = new();
    public double AverageResponseTime { get; set; }
    public string MainFocus { get; set; } = string.Empty;
    public List<string> Achievements { get; set; } = new();
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

public class AIConversationSummaryDTO
{
    public string ConversationId { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string LastMessage { get; set; } = string.Empty;
    public DateTime LastActivityDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public int MessageCount { get; set; }
    public string Status { get; set; } = "Active"; // Active, Ended, Archived
    public string? InstructionProfile { get; set; }
    public List<string> Categories { get; set; } = new();
}

public class ConversationAnalyticsDTO
{
    public string ConversationId { get; set; } = string.Empty;
    public int TotalQueries { get; set; }
    public int TotalResponseTime { get; set; }
    public double AverageResponseTime { get; set; }
    public Dictionary<string, int> QueryCategories { get; set; } = new();
    public Dictionary<string, int> ResponseQuality { get; set; } = new();
    public List<string> CommonTopics { get; set; } = new();
    public List<string> UserSatisfactionTrends { get; set; } = new();
    public DateTime AnalysisDate { get; set; } = DateTime.UtcNow;
    
    // Additional properties used in services
    public Dictionary<string, object> CategoryDistribution { get; set; } = new();
    public List<double> ResponseTimes { get; set; } = new();
    public List<string> FrequentTopics { get; set; } = new();
    public double EngagementScore { get; set; }
    public List<ConversationInsightDTO> Insights { get; set; } = new();
}

// Phase 4: Multi-Model AI DTOs
public class AIModelConfigurationDTO
{
    public string ModelId { get; set; } = string.Empty;
    public string ModelName { get; set; } = string.Empty;
    public string Provider { get; set; } = string.Empty; // "Gemini", "GPT", "Claude", etc.
    public string ModelType { get; set; } = string.Empty; // "Chat", "Analysis", "Embedding"
    public bool IsActive { get; set; } = true;
    public bool IsFallback { get; set; } = false;
    public int Priority { get; set; } = 1;
    public Dictionary<string, object> Configuration { get; set; } = new();
    public List<string> SupportedCategories { get; set; } = new();
}

public class AIModelResponseDTO
{
    public string ModelUsed { get; set; } = string.Empty;
    public string Response { get; set; } = string.Empty;
    public int ExecutionTimeMs { get; set; }
    public double ConfidenceScore { get; set; }
    public bool IsFallbackUsed { get; set; } = false;
    public Dictionary<string, object> ModelMetadata { get; set; } = new();
}

public class IntelligentRecommendationDTO
{
    public string RecommendationId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Priority { get; set; } = "Medium";
    public string RecommendationType { get; set; } = string.Empty; // "Process", "Training", "Resource", "Alert"
    public List<string> ActionSteps { get; set; } = new();
    public Dictionary<string, object> SupportingData { get; set; } = new();
    public DateTime RelevantUntil { get; set; } = DateTime.UtcNow.AddDays(7);
    public bool IsAutomatable { get; set; } = false;
    public List<string> Tags { get; set; } = new();
}

// AI Recommendation Service DTOs

// Proactive Insights
public class ProactiveInsightDTO
{
    public string InsightId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // "Engagement", "Performance", "Optimization", "Risk"
    public string Priority { get; set; } = "Medium"; // Low, Medium, High, Critical
    public string InsightType { get; set; } = string.Empty; // "Trend", "Anomaly", "Opportunity", "Warning"
    public Dictionary<string, object> Data { get; set; } = new();
    public List<string> ActionableSteps { get; set; } = new();
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public DateTime RelevantUntil { get; set; } = DateTime.UtcNow.AddDays(7);
    public bool IsViewed { get; set; } = false;
}

// Automated Alerts
public class AutomatedAlertDTO
{
    public string AlertId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string AlertType { get; set; } = string.Empty; // "Warning", "Error", "Info", "Success"
    public string Severity { get; set; } = "Medium"; // Low, Medium, High, Critical
    public string Source { get; set; } = string.Empty; // "Volunteer", "Event", "System", "Performance"
    public Dictionary<string, object> AlertData { get; set; } = new();
    public List<string> RecommendedActions { get; set; } = new();
    public DateTime TriggeredAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }
    public bool IsAcknowledged { get; set; } = false;
    public bool RequiresImmedateAction { get; set; } = false;
}

// Predictive Analytics
public class PredictiveAnalyticsDTO
{
    public string PredictionId { get; set; } = string.Empty;
    public string PredictionType { get; set; } = string.Empty; // "Engagement", "Attendance", "Churn", "Resource"
    public string DataType { get; set; } = string.Empty; // "Volunteer", "Event", "Organization"
    public int TargetId { get; set; } // User ID, Event ID, etc.
    public Dictionary<string, object> CurrentMetrics { get; set; } = new();
    public Dictionary<string, object> PredictedMetrics { get; set; } = new();
    public double ConfidenceScore { get; set; } = 0.0;
    public int PredictionDaysAhead { get; set; } = 30;
    public List<string> InfluencingFactors { get; set; } = new();
    public List<string> Recommendations { get; set; } = new();
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public string ModelUsed { get; set; } = string.Empty;
}

// Dashboard Recommendations
public class DashboardRecommendationsDTO
{
    public int UserId { get; set; }
    public string UserRole { get; set; } = string.Empty;
    public List<ActionableRecommendationDTO> ActionableRecommendations { get; set; } = new();
    public List<DashboardWidgetRecommendationDTO> WidgetRecommendations { get; set; } = new();
    public List<string> PersonalizedTips { get; set; } = new();
    public Dictionary<string, object> UsageAnalytics { get; set; } = new();
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
}

public class ActionableRecommendationDTO
{
    public string RecommendationId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Priority { get; set; } = "Medium";
    public string RecommendationType { get; set; } = string.Empty; // "Process", "Training", "Resource", "Alert"
    public List<string> ActionSteps { get; set; } = new();
    public Dictionary<string, object> SupportingData { get; set; } = new();
    public DateTime RelevantUntil { get; set; } = DateTime.UtcNow.AddDays(7);
    public bool IsAutomatable { get; set; } = false;
    public List<string> Tags { get; set; } = new();
}

public class DashboardWidgetRecommendationDTO
{
    public string WidgetId { get; set; } = string.Empty;
    public string WidgetName { get; set; } = string.Empty;
    public string WidgetType { get; set; } = string.Empty; // "Chart", "Metric", "List", "Alert"
    public string Description { get; set; } = string.Empty;
    public string RecommendationReason { get; set; } = string.Empty;
    public int Priority { get; set; } = 5; // 1-10, 10 being highest
    public Dictionary<string, object> Configuration { get; set; } = new();
    public bool IsCurrentlyVisible { get; set; } = false;
}

// Scheduling & Matching
public class SchedulingRecommendationDTO
{
    public string RecommendationId { get; set; } = string.Empty;
    public int EventId { get; set; }
    public DateTime RecommendedDateTime { get; set; }
    public string RecommendationReason { get; set; } = string.Empty;
    public double ConfidenceScore { get; set; } = 0.0;
    public List<int> ConflictingEvents { get; set; } = new();
    public Dictionary<string, object> OptimizationMetrics { get; set; } = new();
    public List<string> Considerations { get; set; } = new();
}

public class VolunteerMatchingDTO
{
    public string MatchingId { get; set; } = string.Empty;
    public int EventId { get; set; }
    public int VolunteerId { get; set; }
    public string VolunteerName { get; set; } = string.Empty;
    public double MatchScore { get; set; } = 0.0;
    public List<string> MatchingReasons { get; set; } = new();
    public List<string> SkillMatches { get; set; } = new();
    public string AvailabilityStatus { get; set; } = string.Empty;
    public Dictionary<string, object> VolunteerMetrics { get; set; } = new();
    public List<string> PotentialConcerns { get; set; } = new();
}

public class SkillGapAnalysisDTO
{
    public string AnalysisId { get; set; } = string.Empty;
    public string OrganizationId { get; set; } = string.Empty;
    public List<string> RequiredSkills { get; set; } = new();
    public List<string> AvailableSkills { get; set; } = new();
    public List<string> MissingSkills { get; set; } = new();
    public List<string> SurplusSkills { get; set; } = new();
    public Dictionary<string, int> SkillDemand { get; set; } = new();
    public Dictionary<string, int> SkillSupply { get; set; } = new();
    public List<string> TrainingRecommendations { get; set; } = new();
    public List<string> RecruitmentRecommendations { get; set; } = new();
    public DateTime AnalysisDate { get; set; } = DateTime.UtcNow;
}

// Trend Analysis & Pattern Recognition (using existing TrendAnalysisDTO and TrendDataPointDTO)

public class PatternRecognitionDTO
{
    public string PatternId { get; set; } = string.Empty;
    public string PatternType { get; set; } = string.Empty; // "Seasonal", "Cyclical", "Recurring", "Anomaly"
    public string DataType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double Confidence { get; set; } = 0.0;
    public Dictionary<string, object> PatternCharacteristics { get; set; } = new();
    public List<DateTime> OccurrenceDates { get; set; } = new();
    public List<string> RelatedFactors { get; set; } = new();
    public List<string> PredictiveInsights { get; set; } = new();
    public DateTime FirstDetected { get; set; } = DateTime.UtcNow;
    public DateTime LastObserved { get; set; } = DateTime.UtcNow;
}

public class BenchmarkingDTO
{
    public string BenchmarkId { get; set; } = string.Empty;
    public string OrganizationId { get; set; } = string.Empty;
    public Dictionary<string, object> OrganizationMetrics { get; set; } = new();
    public Dictionary<string, object> IndustryBenchmarks { get; set; } = new();
    public Dictionary<string, object> PerformanceComparison { get; set; } = new();
    public List<string> StrengthAreas { get; set; } = new();
    public List<string> ImprovementAreas { get; set; } = new();
    public List<string> BenchmarkingRecommendations { get; set; } = new();
    public string OverallRanking { get; set; } = string.Empty; // "Top 10%", "Above Average", etc.
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
}

// Configuration & Feedback
public class RecommendationSettingsDTO
{
    public int? UserId { get; set; }
    public string? OrganizationId { get; set; }
    public bool EnableProactiveInsights { get; set; } = true;
    public bool EnableAutomatedAlerts { get; set; } = true;
    public bool EnablePredictiveAnalytics { get; set; } = true;
    public List<string> PreferredCategories { get; set; } = new();
    public string NotificationFrequency { get; set; } = "Daily"; // "Real-time", "Hourly", "Daily", "Weekly"
    public string AlertSeverityThreshold { get; set; } = "Medium"; // Minimum severity to show alerts
    public Dictionary<string, bool> WidgetPreferences { get; set; } = new();
    public Dictionary<string, object> CustomSettings { get; set; } = new();
}

public class RecommendationFeedbackDTO
{
    public string FeedbackId { get; set; } = string.Empty;
    public string RecommendationId { get; set; } = string.Empty;
    public string RecommendationType { get; set; } = string.Empty;
    public int UserId { get; set; }
    public bool WasHelpful { get; set; }
    public bool WasImplemented { get; set; }
    public string? UserComment { get; set; }
    public int Rating { get; set; } = 5; // 1-10 scale
    public List<string> SelectedTags { get; set; } = new(); // "Relevant", "Actionable", "Timely", etc.
    public DateTime FeedbackDate { get; set; } = DateTime.UtcNow;
}

public class ConversationPatternDTO
{
    public string PatternId { get; set; } = string.Empty;
    public string ConversationId { get; set; } = string.Empty;
    public string PatternType { get; set; } = string.Empty; // "Frequent", "Seasonal", "Behavioral"
    public string Description { get; set; } = string.Empty;
    public double Frequency { get; set; }
    public List<string> KeyWords { get; set; } = new();
    public Dictionary<string, object> PatternData { get; set; } = new();
    public DateTime FirstOccurrence { get; set; }
    public DateTime LastOccurrence { get; set; }
    public double Confidence { get; set; }
    
    // Additional properties used in services
    public List<string> Examples { get; set; } = new();
    public string Recommendation { get; set; } = string.Empty;
}

public class ConversationInsightDTO
{
    public string InsightId { get; set; } = string.Empty;
    public string ConversationId { get; set; } = string.Empty;
    public string InsightType { get; set; } = string.Empty; // "Usage", "Satisfaction", "Efficiency"
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Dictionary<string, object> InsightData { get; set; } = new();
    public List<string> Recommendations { get; set; } = new();
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public double RelevanceScore { get; set; }

    // Additional properties used in services
    public string Type { get; set; } = string.Empty;
    public double Score { get; set; }
    public Dictionary<string, object> Data { get; set; } = new();
}

// Missing request/response DTOs for conversation endpoints
public class StartConversationRequestDTO
{
    public int UserId { get; set; }
    public int? InstructionId { get; set; }
}

public class ContinueConversationRequestDTO
{
    public string ConversationId { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class UpdateConversationContextRequestDTO
{
    public Dictionary<string, object> SessionData { get; set; } = new();
}

public class AIConversationResponseDTO
{
    public string ConversationId { get; set; } = string.Empty;
    public string Response { get; set; } = string.Empty;
    public AIConversationContextDTO Context { get; set; } = new();
    public bool Success { get; set; } = true;
    public string? ErrorMessage { get; set; }
}
