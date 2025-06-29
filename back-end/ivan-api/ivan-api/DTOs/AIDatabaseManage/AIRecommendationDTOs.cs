namespace ivan_api.DTOs.AIDatabaseManage;

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

// Trend Analysis & Pattern Recognition
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
