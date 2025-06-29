using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ivan_api.Services.AIRecommendationServ;
using ivan_api.DTOs;
using ivan_api.DTOs.AIDatabaseManage;

namespace ivan_api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AIRecommendationController : ControllerBase
{
    private readonly IAIRecommendationService _recommendationService;
    private readonly ILogger<AIRecommendationController> _logger;

    public AIRecommendationController(
        IAIRecommendationService recommendationService,
        ILogger<AIRecommendationController> logger)
    {
        _recommendationService = recommendationService;
        _logger = logger;
    }

    #region Proactive Insights

    /// <summary>
    /// Get all proactive insights for a user or organization
    /// </summary>
    [HttpGet("insights")]
    public async Task<ActionResult<List<ProactiveInsightDTO>>> GetProactiveInsightsAsync(
        [FromQuery] int? userId = null,
        [FromQuery] string? organizationId = null)
    {
        try
        {
            var insights = await _recommendationService.GenerateProactiveInsightsAsync(userId, organizationId);
            return Ok(insights);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting proactive insights for user {UserId}", userId);
            return StatusCode(500, "Lỗi lấy thông tin phân tích proactive");
        }
    }

    /// <summary>
    /// Get volunteer engagement insights
    /// </summary>
    [HttpGet("insights/volunteer-engagement")]
    public async Task<ActionResult<List<ProactiveInsightDTO>>> GetVolunteerEngagementInsightsAsync([FromQuery] int? userId = null)
    {
        try
        {
            var insights = await _recommendationService.GetVolunteerEngagementInsightsAsync(userId);
            return Ok(insights);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting volunteer engagement insights");
            return StatusCode(500, "Lỗi lấy phân tích tham gia tình nguyện viên");
        }
    }

    /// <summary>
    /// Get event performance insights
    /// </summary>
    [HttpGet("insights/event-performance")]
    public async Task<ActionResult<List<ProactiveInsightDTO>>> GetEventPerformanceInsightsAsync([FromQuery] string? organizationId = null)
    {
        try
        {
            var insights = await _recommendationService.GetEventPerformanceInsightsAsync(organizationId);
            return Ok(insights);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting event performance insights");
            return StatusCode(500, "Lỗi lấy phân tích hiệu suất sự kiện");
        }
    }

    /// <summary>
    /// Get resource optimization insights
    /// </summary>
    [HttpGet("insights/resource-optimization")]
    public async Task<ActionResult<List<ProactiveInsightDTO>>> GetResourceOptimizationInsightsAsync([FromQuery] string? organizationId = null)
    {
        try
        {
            var insights = await _recommendationService.GetResourceOptimizationInsightsAsync(organizationId);
            return Ok(insights);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting resource optimization insights");
            return StatusCode(500, "Lỗi lấy phân tích tối ưu hóa tài nguyên");
        }
    }

    #endregion

    #region Automated Alerts

    /// <summary>
    /// Check for all automated alerts
    /// </summary>
    [HttpGet("alerts")]
    public async Task<ActionResult<List<AutomatedAlertDTO>>> GetAlertsAsync(
        [FromQuery] int? userId = null,
        [FromQuery] string? organizationId = null)
    {
        try
        {
            var alerts = await _recommendationService.CheckForAlertsAsync(userId, organizationId);
            return Ok(alerts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting alerts");
            return StatusCode(500, "Lỗi lấy thông báo cảnh báo");
        }
    }

    /// <summary>
    /// Check volunteer retention alerts
    /// </summary>
    [HttpGet("alerts/volunteer-retention")]
    public async Task<ActionResult<List<AutomatedAlertDTO>>> GetVolunteerRetentionAlertsAsync()
    {
        try
        {
            var alerts = await _recommendationService.CheckVolunteerRetentionAlertsAsync();
            return Ok(alerts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting volunteer retention alerts");
            return StatusCode(500, "Lỗi lấy cảnh báo duy trì tình nguyện viên");
        }
    }

    /// <summary>
    /// Check event capacity alerts
    /// </summary>
    [HttpGet("alerts/event-capacity")]
    public async Task<ActionResult<List<AutomatedAlertDTO>>> GetEventCapacityAlertsAsync()
    {
        try
        {
            var alerts = await _recommendationService.CheckEventCapacityAlertsAsync();
            return Ok(alerts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting event capacity alerts");
            return StatusCode(500, "Lỗi lấy cảnh báo sức chứa sự kiện");
        }
    }

    /// <summary>
    /// Check performance anomaly alerts
    /// </summary>
    [HttpGet("alerts/performance")]
    public async Task<ActionResult<List<AutomatedAlertDTO>>> GetPerformanceAlertsAsync()
    {
        try
        {
            var alerts = await _recommendationService.CheckPerformanceAnomaliesAsync();
            return Ok(alerts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting performance alerts");
            return StatusCode(500, "Lỗi lấy cảnh báo hiệu suất");
        }
    }

    #endregion

    #region Predictive Analytics

    /// <summary>
    /// Predict volunteer engagement for a specific volunteer
    /// </summary>
    [HttpGet("predictions/volunteer-engagement/{userId}")]
    public async Task<ActionResult<PredictiveAnalyticsDTO>> PredictVolunteerEngagementAsync(
        int userId,
        [FromQuery] int daysAhead = 30)
    {
        try
        {
            var prediction = await _recommendationService.PredictVolunteerEngagementAsync(userId, daysAhead);
            return Ok(prediction);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error predicting volunteer engagement for user {UserId}", userId);
            return StatusCode(500, "Lỗi dự đoán mức độ tham gia tình nguyện viên");
        }
    }

    /// <summary>
    /// Predict event attendance
    /// </summary>
    [HttpGet("predictions/event-attendance/{eventId}")]
    public async Task<ActionResult<PredictiveAnalyticsDTO>> PredictEventAttendanceAsync(int eventId)
    {
        try
        {
            var prediction = await _recommendationService.PredictEventAttendanceAsync(eventId);
            return Ok(prediction);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error predicting event attendance for event {EventId}", eventId);
            return StatusCode(500, "Lỗi dự đoán lượng tham dự sự kiện");
        }
    }

    /// <summary>
    /// Predict resource needs for an organization
    /// </summary>
    [HttpGet("predictions/resource-needs/{organizationId}")]
    public async Task<ActionResult<PredictiveAnalyticsDTO>> PredictResourceNeedsAsync(
        string organizationId,
        [FromQuery] int daysAhead = 30)
    {
        try
        {
            var prediction = await _recommendationService.PredictResourceNeedsAsync(organizationId, daysAhead);
            return Ok(prediction);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error predicting resource needs for organization {OrganizationId}", organizationId);
            return StatusCode(500, "Lỗi dự đoán nhu cầu tài nguyên");
        }
    }

    /// <summary>
    /// Predict volunteer churn risk
    /// </summary>
    [HttpGet("predictions/churn-risk")]
    public async Task<ActionResult<PredictiveAnalyticsDTO>> PredictVolunteerChurnRiskAsync([FromQuery] int? userId = null)
    {
        try
        {
            var prediction = await _recommendationService.PredictVolunteerChurnRiskAsync(userId);
            return Ok(prediction);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error predicting volunteer churn risk");
            return StatusCode(500, "Lỗi dự đoán nguy cơ mất tình nguyện viên");
        }
    }

    #endregion

    #region Dashboard Recommendations

    /// <summary>
    /// Get personalized dashboard recommendations for a user
    /// </summary>
    [HttpGet("dashboard/{userId}")]
    public async Task<ActionResult<DashboardRecommendationsDTO>> GetDashboardRecommendationsAsync(
        int userId,
        [FromQuery] string userRole = "Volunteer")
    {
        try
        {
            var recommendations = await _recommendationService.GetDashboardRecommendationsAsync(userId, userRole);
            return Ok(recommendations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dashboard recommendations for user {UserId}", userId);
            return StatusCode(500, "Lỗi lấy gợi ý dashboard");
        }
    }

    /// <summary>
    /// Get actionable recommendations for a user
    /// </summary>
    [HttpGet("actionable/{userId}")]
    public async Task<ActionResult<List<ActionableRecommendationDTO>>> GetActionableRecommendationsAsync(
        int userId,
        [FromQuery] string userRole = "Volunteer")
    {
        try
        {
            var recommendations = await _recommendationService.GetActionableRecommendationsAsync(userId, userRole);
            return Ok(recommendations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting actionable recommendations for user {UserId}", userId);
            return StatusCode(500, "Lỗi lấy gợi ý hành động");
        }
    }

    /// <summary>
    /// Get widget recommendations for a user's dashboard
    /// </summary>
    [HttpGet("widgets/{userId}")]
    public async Task<ActionResult<List<DashboardWidgetRecommendationDTO>>> GetWidgetRecommendationsAsync(
        int userId,
        [FromQuery] string userRole = "Volunteer")
    {
        try
        {
            var widgets = await _recommendationService.GetWidgetRecommendationsAsync(userId, userRole);
            return Ok(widgets);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting widget recommendations for user {UserId}", userId);
            return StatusCode(500, "Lỗi lấy gợi ý widget");
        }
    }

    #endregion

    #region Scheduling & Matching

    /// <summary>
    /// Get optimal scheduling recommendations for an event
    /// </summary>
    [HttpGet("scheduling/optimal/{eventId}")]
    public async Task<ActionResult<List<SchedulingRecommendationDTO>>> GetOptimalSchedulingAsync(int eventId)
    {
        try
        {
            var recommendations = await _recommendationService.GetOptimalSchedulingRecommendationsAsync(eventId);
            return Ok(recommendations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting scheduling recommendations for event {EventId}", eventId);
            return StatusCode(500, "Lỗi lấy gợi ý lập lịch");
        }
    }

    /// <summary>
    /// Get volunteer matching recommendations for an event
    /// </summary>
    [HttpGet("matching/volunteers/{eventId}")]
    public async Task<ActionResult<List<VolunteerMatchingDTO>>> GetVolunteerMatchingAsync(int eventId)
    {
        try
        {
            var matches = await _recommendationService.GetVolunteerMatchingRecommendationsAsync(eventId);
            return Ok(matches);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting volunteer matching for event {EventId}", eventId);
            return StatusCode(500, "Lỗi lấy gợi ý ghép nối tình nguyện viên");
        }
    }

    /// <summary>
    /// Get skill gap analysis
    /// </summary>
    [HttpGet("analysis/skill-gaps")]
    public async Task<ActionResult<List<SkillGapAnalysisDTO>>> GetSkillGapAnalysisAsync([FromQuery] string? organizationId = null)
    {
        try
        {
            var analysis = await _recommendationService.GetSkillGapAnalysisAsync(organizationId);
            return Ok(analysis);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting skill gap analysis");
            return StatusCode(500, "Lỗi phân tích khoảng cách kỹ năng");
        }
    }

    #endregion

    #region Trend Analysis & Patterns

    /// <summary>
    /// Analyze trends for a specific type and time period
    /// </summary>
    [HttpPost("analysis/trends")]
    public async Task<ActionResult<TrendAnalysisDTO>> AnalyzeTrendsAsync([FromBody] TrendAnalysisRequestDTO request)
    {
        try
        {
            var analysis = await _recommendationService.AnalyzeTrendsAsync(
                request.AnalysisType, 
                request.StartDate, 
                request.EndDate);
            return Ok(analysis);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing trends");
            return StatusCode(500, "Lỗi phân tích xu hướng");
        }
    }

    /// <summary>
    /// Detect patterns in data
    /// </summary>
    [HttpGet("analysis/patterns")]
    public async Task<ActionResult<List<PatternRecognitionDTO>>> DetectPatternsAsync(
        [FromQuery] string dataType,
        [FromQuery] int lookbackDays = 90)
    {
        try
        {
            var patterns = await _recommendationService.DetectPatternsAsync(dataType, lookbackDays);
            return Ok(patterns);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error detecting patterns");
            return StatusCode(500, "Lỗi phát hiện mẫu dữ liệu");
        }
    }

    /// <summary>
    /// Get benchmarking insights for an organization
    /// </summary>
    [HttpGet("analysis/benchmarking/{organizationId}")]
    public async Task<ActionResult<BenchmarkingDTO>> GetBenchmarkingInsightsAsync(string organizationId)
    {
        try
        {
            var insights = await _recommendationService.GetBenchmarkingInsightsAsync(organizationId);
            return Ok(insights);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting benchmarking insights for organization {OrganizationId}", organizationId);
            return StatusCode(500, "Lỗi lấy phân tích benchmark");
        }
    }

    #endregion

    #region Configuration & Feedback

    /// <summary>
    /// Configure recommendation settings
    /// </summary>
    [HttpPost("settings")]
    public async Task<ActionResult> ConfigureRecommendationSettingsAsync([FromBody] RecommendationSettingsDTO settings)
    {
        try
        {
            var success = await _recommendationService.ConfigureRecommendationSettingsAsync(settings);
            
            if (!success)
                return BadRequest("Không thể cấu hình cài đặt gợi ý");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error configuring recommendation settings");
            return StatusCode(500, "Lỗi cấu hình cài đặt gợi ý");
        }
    }

    /// <summary>
    /// Get recommendation settings
    /// </summary>
    [HttpGet("settings")]
    public async Task<ActionResult<RecommendationSettingsDTO>> GetRecommendationSettingsAsync(
        [FromQuery] int? userId = null,
        [FromQuery] string? organizationId = null)
    {
        try
        {
            var settings = await _recommendationService.GetRecommendationSettingsAsync(userId, organizationId);
            return Ok(settings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting recommendation settings");
            return StatusCode(500, "Lỗi lấy cài đặt gợi ý");
        }
    }

    /// <summary>
    /// Record user feedback on recommendations
    /// </summary>
    [HttpPost("feedback")]
    public async Task<ActionResult> RecordFeedbackAsync([FromBody] RecommendationFeedbackDTO feedback)
    {
        try
        {
            var success = await _recommendationService.RecordUserFeedbackAsync(feedback);
            
            if (!success)
                return BadRequest("Không thể ghi nhận phản hồi");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error recording feedback");
            return StatusCode(500, "Lỗi ghi nhận phản hồi");
        }
    }

    /// <summary>
    /// Update recommendation model parameters (Admin only)
    /// </summary>
    [HttpPut("model/{modelType}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> UpdateRecommendationModelAsync(
        string modelType,
        [FromBody] Dictionary<string, object> parameters)
    {
        try
        {
            var success = await _recommendationService.UpdateRecommendationModelAsync(modelType, parameters);
            
            if (!success)
                return BadRequest("Không thể cập nhật mô hình gợi ý");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating recommendation model {ModelType}", modelType);
            return StatusCode(500, "Lỗi cập nhật mô hình gợi ý");
        }
    }

    #endregion
}

// Additional DTOs for the controller
public class TrendAnalysisRequestDTO
{
    public string AnalysisType { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
