using ivan_api.DTOs;
using ivan_api.DTOs.AIDatabaseManage;

namespace ivan_api.Services.AIRecommendationServ;

/// <summary>
/// Service for generating intelligent recommendations, proactive insights, and predictive analytics
/// </summary>
public interface IAIRecommendationService
{
    // Proactive Insights
    Task<List<ProactiveInsightDTO>> GenerateProactiveInsightsAsync(int? userId = null, string? organizationId = null);
    Task<List<ProactiveInsightDTO>> GetVolunteerEngagementInsightsAsync(int? userId = null);
    Task<List<ProactiveInsightDTO>> GetEventPerformanceInsightsAsync(string? organizationId = null);
    Task<List<ProactiveInsightDTO>> GetResourceOptimizationInsightsAsync(string? organizationId = null);
    
    // Automated Alerts
    Task<List<AutomatedAlertDTO>> CheckForAlertsAsync(int? userId = null, string? organizationId = null);
    Task<List<AutomatedAlertDTO>> CheckVolunteerRetentionAlertsAsync();
    Task<List<AutomatedAlertDTO>> CheckEventCapacityAlertsAsync();
    Task<List<AutomatedAlertDTO>> CheckPerformanceAnomaliesAsync();
    
    // Predictive Analytics
    Task<PredictiveAnalyticsDTO> PredictVolunteerEngagementAsync(int userId, int daysAhead = 30);
    Task<PredictiveAnalyticsDTO> PredictEventAttendanceAsync(int eventId);
    Task<PredictiveAnalyticsDTO> PredictResourceNeedsAsync(string organizationId, int daysAhead = 30);
    Task<PredictiveAnalyticsDTO> PredictVolunteerChurnRiskAsync(int? userId = null);
    
    // Personalized Dashboard Recommendations
    Task<DashboardRecommendationsDTO> GetDashboardRecommendationsAsync(int userId, string userRole);
    Task<List<ActionableRecommendationDTO>> GetActionableRecommendationsAsync(int userId, string userRole);
    Task<List<DashboardWidgetRecommendationDTO>> GetWidgetRecommendationsAsync(int userId, string userRole);
    
    // Smart Scheduling Recommendations
    Task<List<SchedulingRecommendationDTO>> GetOptimalSchedulingRecommendationsAsync(int eventId);
    Task<List<VolunteerMatchingDTO>> GetVolunteerMatchingRecommendationsAsync(int eventId);
    Task<List<SkillGapAnalysisDTO>> GetSkillGapAnalysisAsync(string? organizationId = null);
    
    // Trend Analysis & Pattern Recognition
    Task<TrendAnalysisDTO> AnalyzeTrendsAsync(string analysisType, DateTime startDate, DateTime endDate);
    Task<List<PatternRecognitionDTO>> DetectPatternsAsync(string dataType, int lookbackDays = 90);
    Task<BenchmarkingDTO> GetBenchmarkingInsightsAsync(string organizationId);
    
    // Configuration & Learning
    Task<bool> ConfigureRecommendationSettingsAsync(RecommendationSettingsDTO settings);
    Task<RecommendationSettingsDTO> GetRecommendationSettingsAsync(int? userId = null, string? organizationId = null);
    Task<bool> RecordUserFeedbackAsync(RecommendationFeedbackDTO feedback);
    Task<bool> UpdateRecommendationModelAsync(string modelType, Dictionary<string, object> parameters);
    
    // Pure AI Natural Language Processing
    Task<string> ProcessPureAIQueryAsync(string naturalLanguageQuery);
}
