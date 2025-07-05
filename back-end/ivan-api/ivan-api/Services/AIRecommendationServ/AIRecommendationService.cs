using ivan_api.DTOs;
using ivan_api.DTOs.AIDatabaseManage;
using ivan_api.Models;
using ivan_api.Services;
using ivan_api.Services.AIDatabaseServ;
using ivan_api.Services.AIQueryServ;
using ivan_api.Services.AIRecommendationServ.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services.AIRecommendationServ;

public class AIRecommendationService : IAIRecommendationService
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly IAIDatabaseService _aiDatabaseService;
    private readonly IAIQueryEngine _queryEngine;
    private readonly ILogger<AIRecommendationService> _logger;
    private readonly SchedulingRecommendationHelper _schedulingHelper;
    private readonly SkillGapAnalysisHelper _skillGapHelper;
    private readonly PredictiveAnalyticsHelper _predictiveHelper;
    private readonly RecommendationUtilityHelper _utilityHelper;

    public AIRecommendationService(
        VolunteerManagementSystemContext context,
        IAIDatabaseService aiDatabaseService,
        IAIQueryEngine queryEngine,
        ILogger<AIRecommendationService> logger)
    {
        _context = context;
        _aiDatabaseService = aiDatabaseService;
        _queryEngine = queryEngine;
        _logger = logger;
        _schedulingHelper = new SchedulingRecommendationHelper(context, logger);
        _skillGapHelper = new SkillGapAnalysisHelper(context, logger);
        _predictiveHelper = new PredictiveAnalyticsHelper(context, logger);
        
        // Create a generic logger for the utility helper
        var loggerFactory = LoggerFactory.Create(builder => builder.AddConsole());
        var utilityLogger = loggerFactory.CreateLogger<RecommendationUtilityHelper>();
        _utilityHelper = new RecommendationUtilityHelper(context, utilityLogger);
    }

    #region Proactive Insights

    public async Task<List<ProactiveInsightDTO>> GenerateProactiveInsightsAsync(int? userId = null, string? organizationId = null)
    {
        try
        {
            var insights = new List<ProactiveInsightDTO>();

            // Generate insights from different categories
            insights.AddRange(await GetVolunteerEngagementInsightsAsync(userId));
            insights.AddRange(await GetEventPerformanceInsightsAsync(organizationId));
            insights.AddRange(await GetResourceOptimizationInsightsAsync(organizationId));

            // Sort by priority and relevance
            return insights.OrderByDescending(i => RecommendationUtilityHelper.GetPriorityScore(i.Priority))
                          .ThenByDescending(i => i.GeneratedAt)
                          .Take(20) // Limit to top 20 insights
                          .ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating proactive insights for user {UserId}", userId);
            return new List<ProactiveInsightDTO>();
        }
    }

    public async Task<List<ProactiveInsightDTO>> GetVolunteerEngagementInsightsAsync(int? userId = null)
    {
        var insights = new List<ProactiveInsightDTO>();

        try
        {
            // Insight 1: Low engagement volunteers
            var lowEngagementCount = await _context.VolunteerProfiles
                .Where(v => v.LastActiveDate < DateTime.UtcNow.AddDays(-30))
                .CountAsync();

            if (lowEngagementCount > 0)
            {
                insights.Add(new ProactiveInsightDTO
                {
                    InsightId = Guid.NewGuid().ToString(),
                    Title = "Tình nguyện viên ít hoạt động",
                    Description = $"Có {lowEngagementCount} tình nguyện viên không hoạt động trong 30 ngày qua. Hãy xem xét liên hệ và tái kích hoạt họ.",
                    Category = "Engagement",
                    Priority = "High",
                    InsightType = "Warning",
                    Data = new Dictionary<string, object> { ["count"] = lowEngagementCount },
                    ActionableSteps = new List<string>
                    {
                        "Gửi email tái kích hoạt cho tình nguyện viên",
                        "Tổ chức sự kiện đặc biệt để tái thu hút",
                        "Khảo sát lý do ngừng hoạt động"
                    }
                });
            }

            // Insight 2: High-performing volunteers
            var highPerformers = await _context.VolunteerProfiles
                .Where(v => v.TotalHoursVolunteered > 100)
                .CountAsync();

            if (highPerformers > 0)
            {
                insights.Add(new ProactiveInsightDTO
                {
                    InsightId = Guid.NewGuid().ToString(),
                    Title = "Tình nguyện viên xuất sắc",
                    Description = $"Có {highPerformers} tình nguyện viên đã đóng góp hơn 100 giờ. Hãy xem xét ghi nhận và trao quyền lãnh đạo.",
                    Category = "Recognition",
                    Priority = "Medium",
                    InsightType = "Opportunity",
                    Data = new Dictionary<string, object> { ["count"] = highPerformers },
                    ActionableSteps = new List<string>
                    {
                        "Trao giải thưởng hoặc chứng nhận",
                        "Mời tham gia vai trò điều phối",
                        "Chia sẻ câu chuyện thành công của họ"
                    }
                });
            }

            // Insight 3: Skill distribution analysis
            var skillGaps = await RecommendationUtilityHelper.AnalyzeSkillDistribution(_context);
            if (skillGaps.Any())
            {
                insights.Add(new ProactiveInsightDTO
                {
                    InsightId = Guid.NewGuid().ToString(),
                    Title = "Thiếu hụt kỹ năng",
                    Description = $"Phát hiện thiếu hụt {skillGaps.Count} kỹ năng chính trong tổ chức.",
                    Category = "Skills",
                    Priority = "Medium",
                    InsightType = "Warning",
                    Data = new Dictionary<string, object> { ["missing_skills"] = skillGaps },
                    ActionableSteps = new List<string>
                    {
                        "Tổ chức chương trình đào tạo kỹ năng",
                        "Tuyển dụng tình nguyện viên có kỹ năng thiếu",
                        "Khuyến khích tình nguyện viên hiện tại học kỹ năng mới"
                    }
                });
            }

            return insights;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating volunteer engagement insights");
            return insights;
        }
    }

    public async Task<List<ProactiveInsightDTO>> GetEventPerformanceInsightsAsync(string? organizationId = null)
    {
        var insights = new List<ProactiveInsightDTO>();

        try
        {
            // Insight 1: Event attendance trends
            var recentEvents = await _context.Events
                .Where(e => e.StartDate >= DateTime.UtcNow.AddDays(-90))
                .Include(e => e.EventRegistrations)
                .ToListAsync();

            if (recentEvents.Any())
            {
                var avgAttendanceRate = recentEvents.Average(e => 
                    e.EventRegistrations.Count > 0 ? 
                    (double)e.EventRegistrations.Count(r => r.AttendanceStatus == "Attended") / e.EventRegistrations.Count 
                    : 0) * 100;

                if (avgAttendanceRate < 70)
                {
                    insights.Add(new ProactiveInsightDTO
                    {
                        InsightId = Guid.NewGuid().ToString(),
                        Title = "Tỷ lệ tham dự thấp",
                        Description = $"Tỷ lệ tham dự sự kiện trung bình chỉ {avgAttendanceRate:F1}%. Cần cải thiện chiến lược tham gia.",
                        Category = "Performance",
                        Priority = "High",
                        InsightType = "Warning",
                        Data = new Dictionary<string, object> 
                        { 
                            ["attendance_rate"] = avgAttendanceRate,
                            ["recent_events"] = recentEvents.Count 
                        },
                        ActionableSteps = new List<string>
                        {
                            "Khảo sát lý do không tham dự",
                            "Cải thiện thời gian và địa điểm tổ chức",
                            "Tăng cường nhắc nhở trước sự kiện"
                        }
                    });
                }

                // Insight 2: Popular event types
                var eventTypePopularity = recentEvents
                    .GroupBy(e => e.EventType)
                    .Select(g => new { Type = g.Key, Count = g.Count(), AvgRegistrations = g.Average(e => e.EventRegistrations.Count) })
                    .OrderByDescending(x => x.AvgRegistrations)
                    .ToList();

                if (eventTypePopularity.Any())
                {
                    var topEventType = eventTypePopularity.First();
                    insights.Add(new ProactiveInsightDTO
                    {
                        InsightId = Guid.NewGuid().ToString(),
                        Title = "Loại sự kiện phổ biến",
                        Description = $"Sự kiện '{topEventType.Type}' có tỷ lệ đăng ký cao nhất ({topEventType.AvgRegistrations:F1} người/sự kiện).",
                        Category = "Performance",
                        Priority = "Medium",
                        InsightType = "Opportunity",
                        Data = new Dictionary<string, object> { ["event_types"] = eventTypePopularity },
                        ActionableSteps = new List<string>
                        {
                            $"Tổ chức thêm sự kiện '{topEventType.Type}'",
                            "Phân tích yếu tố thành công của loại sự kiện này",
                            "Áp dụng các yếu tố tốt cho các loại sự kiện khác"
                        }
                    });
                }
            }

            return insights;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating event performance insights");
            return insights;
        }
    }

    public async Task<List<ProactiveInsightDTO>> GetResourceOptimizationInsightsAsync(string? organizationId = null)
    {
        var insights = new List<ProactiveInsightDTO>();

        try
        {
            // Insight 1: Coordinator workload analysis
            var coordinatorWorkloads = await _context.Events
                .Where(e => e.StartDate >= DateTime.UtcNow.AddDays(-30))
                .GroupBy(e => e.CreatedBy)
                .Select(g => new { CoordinatorId = g.Key, EventCount = g.Count() })
                .ToListAsync();

            if (coordinatorWorkloads.Any())
            {
                var maxWorkload = coordinatorWorkloads.Max(c => c.EventCount);
                var avgWorkload = coordinatorWorkloads.Average(c => c.EventCount);

                if (maxWorkload > avgWorkload * 2)
                {
                    insights.Add(new ProactiveInsightDTO
                    {
                        InsightId = Guid.NewGuid().ToString(),
                        Title = "Phân bổ công việc không đều",
                        Description = $"Một số điều phối viên đang quá tải với {maxWorkload} sự kiện so với trung bình {avgWorkload:F1} sự kiện.",
                        Category = "Resource",
                        Priority = "Medium",
                        InsightType = "Warning",
                        Data = new Dictionary<string, object> 
                        { 
                            ["max_workload"] = maxWorkload,
                            ["avg_workload"] = avgWorkload,
                            ["coordinator_count"] = coordinatorWorkloads.Count
                        },
                        ActionableSteps = new List<string>
                        {
                            "Phân phối lại công việc giữa các điều phối viên",
                            "Đào tạo thêm điều phối viên mới",
                            "Tạo hệ thống hỗ trợ cho điều phối viên quá tải"
                        }
                    });
                }
            }

            return insights;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating resource optimization insights");
            return insights;
        }
    }

    #endregion

    #region Automated Alerts

    public async Task<List<AutomatedAlertDTO>> CheckForAlertsAsync(int? userId = null, string? organizationId = null)
    {
        var alerts = new List<AutomatedAlertDTO>();

        try
        {
            alerts.AddRange(await CheckVolunteerRetentionAlertsAsync());
            alerts.AddRange(await CheckEventCapacityAlertsAsync());
            alerts.AddRange(await CheckPerformanceAnomaliesAsync());

            return alerts.OrderByDescending(a => RecommendationUtilityHelper.GetSeverityScore(a.Severity))
                        .ThenByDescending(a => a.TriggeredAt)
                        .ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking for alerts");
            return alerts;
        }
    }

    public async Task<List<AutomatedAlertDTO>> CheckVolunteerRetentionAlertsAsync()
    {
        var alerts = new List<AutomatedAlertDTO>();

        try
        {
            // Alert for volunteers about to churn
            var inactiveVolunteers = await _context.VolunteerProfiles
                .Where(v => v.LastActiveDate < DateTime.UtcNow.AddDays(-21) && 
                           v.LastActiveDate > DateTime.UtcNow.AddDays(-30))
                .CountAsync();

            if (inactiveVolunteers > 0)
            {
                alerts.Add(new AutomatedAlertDTO
                {
                    AlertId = Guid.NewGuid().ToString(),
                    Title = "Cảnh báo tình nguyện viên không hoạt động",
                    Message = $"{inactiveVolunteers} tình nguyện viên đang có nguy cơ nghỉ hoạt động (không hoạt động 21-30 ngày).",
                    AlertType = "Warning",
                    Severity = "High",
                    Source = "Volunteer",
                    AlertData = new Dictionary<string, object> { ["count"] = inactiveVolunteers },
                    RecommendedActions = new List<string>
                    {
                        "Liên hệ trực tiếp với những tình nguyện viên này",
                        "Gửi email khảo sát lý do giảm hoạt động",
                        "Mời tham gia sự kiện đặc biệt tái kích hoạt"
                    },
                    RequiresImmedateAction = true
                });
            }

            return alerts;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking volunteer retention alerts");
            return alerts;
        }
    }

    public async Task<List<AutomatedAlertDTO>> CheckEventCapacityAlertsAsync()
    {
        var alerts = new List<AutomatedAlertDTO>();

        try
        {
            // Alert for events with low registration
            var upcomingEvents = await _context.Events
                .Where(e => e.StartDate > DateTime.UtcNow && e.StartDate <= DateTime.UtcNow.AddDays(14))
                .Include(e => e.EventRegistrations)
                .ToListAsync();

            foreach (var eventItem in upcomingEvents)
            {
                var registrationRate = eventItem.MaxParticipants > 0 ? 
                    (double)eventItem.EventRegistrations.Count / eventItem.MaxParticipants : 0;

                if (registrationRate < 0.5 && eventItem.StartDate <= DateTime.UtcNow.AddDays(7))
                {
                    alerts.Add(new AutomatedAlertDTO
                    {
                        AlertId = Guid.NewGuid().ToString(),
                        Title = $"Sự kiện '{eventItem.EventName}' ít người đăng ký",
                        Message = $"Chỉ có {eventItem.EventRegistrations.Count}/{eventItem.MaxParticipants} người đăng ký với tỷ lệ {registrationRate:P}.",
                        AlertType = "Warning",
                        Severity = "Medium",
                        Source = "Event",
                        AlertData = new Dictionary<string, object> 
                        { 
                            ["event_id"] = eventItem.EventId,
                            ["registration_rate"] = registrationRate,
                            ["days_until_event"] = (eventItem.StartDate - DateTime.UtcNow).Days
                        },
                        RecommendedActions = new List<string>
                        {
                            "Tăng cường quảng bá sự kiện",
                            "Gửi thông báo nhắc nhở đến tình nguyện viên",
                            "Xem xét điều chỉnh thời gian hoặc địa điểm"
                        }
                    });
                }
            }

            return alerts;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking event capacity alerts");
            return alerts;
        }
    }

    public async Task<List<AutomatedAlertDTO>> CheckPerformanceAnomaliesAsync()
    {
        var alerts = new List<AutomatedAlertDTO>();

        try
        {
            // Check for sudden drop in registrations
            var thisWeekRegistrations = await _context.EventRegistrations
                .Where(r => r.RegistrationDate >= DateTime.UtcNow.AddDays(-7))
                .CountAsync();

            var lastWeekRegistrations = await _context.EventRegistrations
                .Where(r => r.RegistrationDate >= DateTime.UtcNow.AddDays(-14) && 
                           r.RegistrationDate < DateTime.UtcNow.AddDays(-7))
                .CountAsync();

            if (lastWeekRegistrations > 0 && thisWeekRegistrations < lastWeekRegistrations * 0.5)
            {
                alerts.Add(new AutomatedAlertDTO
                {
                    AlertId = Guid.NewGuid().ToString(),
                    Title = "Giảm đột ngột lượng đăng ký",
                    Message = $"Số đăng ký tuần này ({thisWeekRegistrations}) giảm {((lastWeekRegistrations - thisWeekRegistrations) / (double)lastWeekRegistrations):P} so với tuần trước ({lastWeekRegistrations}).",
                    AlertType = "Error",
                    Severity = "High",
                    Source = "Performance",
                    AlertData = new Dictionary<string, object> 
                    { 
                        ["this_week"] = thisWeekRegistrations,
                        ["last_week"] = lastWeekRegistrations,
                        ["change_percent"] = ((thisWeekRegistrations - lastWeekRegistrations) / (double)lastWeekRegistrations) * 100
                    },
                    RecommendedActions = new List<string>
                    {
                        "Kiểm tra hệ thống đăng ký có lỗi không",
                        "Phân tích nguyên nhân giảm đăng ký",
                        "Tăng cường hoạt động marketing"
                    },
                    RequiresImmedateAction = true
                });
            }

            return alerts;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking performance anomalies");
            return alerts;
        }
    }

    #endregion

    #region Predictive Analytics

    public async Task<PredictiveAnalyticsDTO> PredictVolunteerEngagementAsync(int userId, int daysAhead = 30)
    {
        try
        {
            var volunteer = await _context.VolunteerProfiles
                .Include(v => v.EventRegistrations)
                .FirstOrDefaultAsync(v => v.UserId == userId);

            if (volunteer == null)
                throw new ArgumentException("Volunteer not found");

            var recentActivity = volunteer.EventRegistrations
                .Where(r => r.RegistrationDate >= DateTime.UtcNow.AddDays(-90))
                .OrderBy(r => r.RegistrationDate)
                .ToList();

            var engagementTrend = _predictiveHelper.CalculateEngagementTrend(recentActivity);
            var predictedEngagement = _predictiveHelper.PredictEngagement(engagementTrend, daysAhead);

            return new PredictiveAnalyticsDTO
            {
                PredictionId = Guid.NewGuid().ToString(),
                PredictionType = "Engagement",
                DataType = "Volunteer",
                TargetId = userId,
                CurrentMetrics = new Dictionary<string, object>
                {
                    ["recent_events"] = recentActivity.Count,
                    ["last_activity"] = volunteer.LastActiveDate ?? DateTime.MinValue,
                    ["total_hours"] = volunteer.TotalHoursVolunteered ?? 0
                },
                PredictedMetrics = new Dictionary<string, object>
                {
                    ["predicted_events"] = predictedEngagement.PredictedEvents,
                    ["engagement_probability"] = predictedEngagement.EngagementProbability,
                    ["risk_level"] = predictedEngagement.RiskLevel
                },
                ConfidenceScore = predictedEngagement.ConfidenceScore,
                PredictionDaysAhead = daysAhead,
                InfluencingFactors = new List<string>
                {
                    "Lịch sử tham gia gần đây",
                    "Xu hướng hoạt động",
                    "Thời gian không hoạt động"
                },
                Recommendations = _predictiveHelper.GenerateEngagementRecommendations(predictedEngagement),
                ModelUsed = "Linear Trend Analysis"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error predicting volunteer engagement for user {UserId}", userId);
            throw;
        }
    }

    public async Task<PredictiveAnalyticsDTO> PredictEventAttendanceAsync(int eventId)
    {
        try
        {
            var eventItem = await _context.Events
                .Include(e => e.EventRegistrations)
                .FirstOrDefaultAsync(e => e.EventId == eventId);

            if (eventItem == null)
                throw new ArgumentException("Event not found");

            // Analyze similar past events
            var similarEvents = await _context.Events
                .Where(e => e.EventType == eventItem.EventType && 
                           e.StartDate < DateTime.UtcNow &&
                           e.EventId != eventId)
                .Include(e => e.EventRegistrations)
                .ToListAsync();

            var attendancePattern = _predictiveHelper.AnalyzeAttendancePattern(similarEvents);
            var predictedAttendance = _predictiveHelper.PredictAttendance(eventItem, attendancePattern);

            return new PredictiveAnalyticsDTO
            {
                PredictionId = Guid.NewGuid().ToString(),
                PredictionType = "Attendance",
                DataType = "Event",
                TargetId = eventId,
                CurrentMetrics = new Dictionary<string, object>
                {
                    ["current_registrations"] = eventItem.EventRegistrations.Count,
                    ["max_participants"] = eventItem.MaxParticipants ?? 0,
                    ["days_until_event"] = (eventItem.StartDate - DateTime.UtcNow).Days
                },
                PredictedMetrics = new Dictionary<string, object>
                {
                    ["predicted_attendance"] = predictedAttendance.ExpectedAttendees,
                    ["attendance_rate"] = predictedAttendance.AttendanceRate,
                    ["final_registrations"] = predictedAttendance.FinalRegistrations
                },
                ConfidenceScore = predictedAttendance.ConfidenceScore,
                InfluencingFactors = new List<string>
                {
                    "Lịch sử sự kiện tương tự",
                    "Thời gian còn lại đến sự kiện",
                    "Số lượng đăng ký hiện tại"
                },
                Recommendations = _predictiveHelper.GenerateAttendanceRecommendations(predictedAttendance),
                ModelUsed = "Historical Pattern Analysis"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error predicting event attendance for event {EventId}", eventId);
            throw;
        }
    }

    public async Task<PredictiveAnalyticsDTO> PredictResourceNeedsAsync(string organizationId, int daysAhead = 30)
    {
        // Implementation for resource needs prediction
        // This would analyze historical resource usage patterns
        return new PredictiveAnalyticsDTO
        {
            PredictionId = Guid.NewGuid().ToString(),
            PredictionType = "Resource",
            DataType = "Organization",
            ModelUsed = "Resource Trend Analysis"
        };
    }

    public async Task<PredictiveAnalyticsDTO> PredictVolunteerChurnRiskAsync(int? userId = null)
    {
        try
        {
            var volunteers = userId.HasValue 
                ? await _context.VolunteerProfiles.Where(v => v.UserId == userId.Value).ToListAsync()
                : await _context.VolunteerProfiles.ToListAsync();

            var churnAnalysis = _predictiveHelper.AnalyzeChurnRisk(volunteers);

            return new PredictiveAnalyticsDTO
            {
                PredictionId = Guid.NewGuid().ToString(),
                PredictionType = "Churn",
                DataType = "Volunteer",
                TargetId = userId ?? 0,
                CurrentMetrics = new Dictionary<string, object>
                {
                    ["total_volunteers"] = volunteers.Count,
                    ["high_risk_count"] = churnAnalysis.HighRiskCount,
                    ["medium_risk_count"] = churnAnalysis.MediumRiskCount
                },
                PredictedMetrics = new Dictionary<string, object>
                {
                    ["predicted_churn_rate"] = churnAnalysis.PredictedChurnRate,
                    ["volunteers_at_risk"] = churnAnalysis.VolunteersAtRisk
                },
                ConfidenceScore = churnAnalysis.ConfidenceScore,
                Recommendations = _predictiveHelper.GenerateChurnPreventionRecommendations(churnAnalysis),
                ModelUsed = "Churn Risk Assessment"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error predicting volunteer churn risk");
            throw;
        }
    }

    #endregion

    #region Dashboard Recommendations

    public async Task<DashboardRecommendationsDTO> GetDashboardRecommendationsAsync(int userId, string userRole)
    {
        try
        {
            var actionableRecommendations = await GetActionableRecommendationsAsync(userId, userRole);
            var widgetRecommendations = await GetWidgetRecommendationsAsync(userId, userRole);

            var usageAnalytics = await _utilityHelper.GetUserUsageAnalyticsAsync(userId);

            return new DashboardRecommendationsDTO
            {
                UserId = userId,
                UserRole = userRole,
                ActionableRecommendations = actionableRecommendations,
                WidgetRecommendations = widgetRecommendations,
                PersonalizedTips = RecommendationUtilityHelper.GeneratePersonalizedTips(userRole),
                UsageAnalytics = new Dictionary<string, object>
                {
                    ["total_sessions"] = usageAnalytics.TotalSessions,
                    ["total_time_spent"] = usageAnalytics.TotalTimeSpent.TotalHours,
                    ["last_login"] = usageAnalytics.LastLoginDate,
                    ["engagement_score"] = usageAnalytics.EngagementScore
                },
                GeneratedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dashboard recommendations for user {UserId}", userId);
            throw;
        }
    }

    public async Task<List<ActionableRecommendationDTO>> GetActionableRecommendationsAsync(int userId, string userRole)
    {
        var recommendations = new List<ActionableRecommendationDTO>();

        try
        {
            switch (userRole.ToLower())
            {
                case "admin":
                case "coordinator":
                    var coordinatorRecs = await _utilityHelper.GetCoordinatorRecommendationsAsync(userId);
                    recommendations.AddRange(coordinatorRecs.Select(r => new ActionableRecommendationDTO
                    {
                        RecommendationId = r.Id,
                        Title = r.Title,
                        Description = r.Description,
                        Category = r.Type,
                        Priority = r.Priority.ToString(),
                        RecommendationType = "Process",
                        ActionSteps = new List<string> { r.RecommendationReason }
                    }));
                    break;
                case "volunteer":
                    var volunteerRecs = await _utilityHelper.GetVolunteerRecommendationsAsync(userId);
                    recommendations.AddRange(volunteerRecs.Select(r => new ActionableRecommendationDTO
                    {
                        RecommendationId = r.Id,
                        Title = r.Title,
                        Description = r.Description,
                        Category = r.Type,
                        Priority = r.Priority.ToString(),
                        RecommendationType = "Process",
                        ActionSteps = new List<string> { r.RecommendationReason }
                    }));
                    break;
            }

            return recommendations.OrderByDescending(r => RecommendationUtilityHelper.GetPriorityScore(r.Priority)).Take(10).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting actionable recommendations for user {UserId}", userId);
            return recommendations;
        }
    }

    public async Task<List<DashboardWidgetRecommendationDTO>> GetWidgetRecommendationsAsync(int userId, string userRole)
    {
        var widgets = new List<DashboardWidgetRecommendationDTO>();

        try
        {
            switch (userRole.ToLower())
            {
                case "admin":
                case "coordinator":
                    widgets.AddRange(RecommendationUtilityHelper.GetCoordinatorWidgets());
                    break;
                case "volunteer":
                    widgets.AddRange(RecommendationUtilityHelper.GetVolunteerWidgets());
                    break;
            }

            return widgets.OrderByDescending(w => w.Priority).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting widget recommendations for user {UserId}", userId);
            return widgets;
        }
    }

    #endregion

    #region Not Implemented (Skeleton Methods)

    public async Task<List<SchedulingRecommendationDTO>> GetOptimalSchedulingRecommendationsAsync(int eventId)
    {
        try
        {
            var recommendations = new List<SchedulingRecommendationDTO>();

            // Get event details
            var eventItem = await _context.Events
                .Include(e => e.EventRegistrations)
                .FirstOrDefaultAsync(e => e.EventId == eventId);

            if (eventItem == null)
                return recommendations;

            // Get all active volunteers with their availability and skills
            var volunteers = await _context.VolunteerProfiles
                .Include(v => v.User)
                .Include(v => v.VolunteerSkills)
                .Include(v => v.VolunteerSchedules)
                .Where(v => v.IsVerified == true && v.User.IsActive == true)
                .ToListAsync();

            foreach (var volunteer in volunteers)
            {
                var matchScore = _schedulingHelper.CalculateVolunteerEventMatchScore(volunteer, eventItem);
                
                if (matchScore > 0.5) // Only recommend if match score > 50%
                {
                    var recommendation = new SchedulingRecommendationDTO
                    {
                        RecommendationId = Guid.NewGuid().ToString(),
                        EventId = eventId,
                        RecommendedDateTime = eventItem.StartDate,
                        RecommendationReason = _schedulingHelper.GenerateSchedulingReason(volunteer, eventItem, matchScore),
                        ConfidenceScore = matchScore,
                        ConflictingEvents = await _schedulingHelper.GetConflictingEvents(volunteer.VolunteerId, eventItem.StartDate, eventItem.EndDate),
                        OptimizationMetrics = new Dictionary<string, object>
                        {
                            ["match_score"] = matchScore,
                            ["volunteer_id"] = volunteer.VolunteerId,
                            ["volunteer_name"] = $"{volunteer.User.UserProfiles.FirstOrDefault()?.FirstName} {volunteer.User.UserProfiles.FirstOrDefault()?.LastName}",
                            ["availability_status"] = _schedulingHelper.CheckAvailabilityStatus(volunteer, eventItem),
                            ["skill_match_percentage"] = _schedulingHelper.CalculateSkillMatchPercentage(volunteer, eventItem),
                            ["previous_participation"] = await _schedulingHelper.GetPreviousParticipationCount(volunteer.VolunteerId, eventItem.Province)
                        },
                        Considerations = _schedulingHelper.GenerateSchedulingConsiderations(volunteer, eventItem)
                    };

                    recommendations.Add(recommendation);
                }
            }

            return recommendations
                .OrderByDescending(r => r.ConfidenceScore)
                .Take(20) // Top 20 recommendations
                .ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting optimal scheduling recommendations for event {EventId}", eventId);
            return new List<SchedulingRecommendationDTO>();
        }
    }

    public async Task<List<VolunteerMatchingDTO>> GetVolunteerMatchingRecommendationsAsync(int eventId)
    {
        // Implementation needed
        return new List<VolunteerMatchingDTO>();
    }

    public async Task<List<SkillGapAnalysisDTO>> GetSkillGapAnalysisAsync(string? organizationId = null)
    {
        try
        {
            var analyses = new List<SkillGapAnalysisDTO>();

            // Get events for the organization (or all events if no org specified)
            var events = await _context.Events
                .Include(e => e.EventRegistrations)
                .ThenInclude(er => er.Volunteer)
                .Where(e => string.IsNullOrEmpty(organizationId) || e.OrganizationId.ToString() == organizationId)
                .Where(e => e.StartDate >= DateTime.UtcNow.AddDays(-90)) // Last 3 months
                .ToListAsync();

            if (!events.Any())
                return analyses;

            // Group events by type for better analysis
            var eventsByType = events.GroupBy(e => e.EventType ?? "General");

            foreach (var eventGroup in eventsByType)
            {
                var analysis = _skillGapHelper.AnalyzeSkillGapForEventType(eventGroup.Key, eventGroup.ToList(), organizationId);
                if (analysis != null)
                    analyses.Add(analysis);
            }

            // Overall organization analysis
            if (analyses.Any())
            {
                var overallAnalysis = await _skillGapHelper.GenerateOverallSkillGapAnalysis(events, organizationId);
                if (overallAnalysis != null)
                    analyses.Insert(0, overallAnalysis); // Add at the beginning
            }

            return analyses;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error performing skill gap analysis for organization {OrganizationId}", organizationId);
            return new List<SkillGapAnalysisDTO>();
        }
    }

    public async Task<TrendAnalysisDTO> AnalyzeTrendsAsync(string analysisType, DateTime startDate, DateTime endDate)
    {
        // Implementation needed
        return new TrendAnalysisDTO();
    }

    public async Task<List<PatternRecognitionDTO>> DetectPatternsAsync(string dataType, int lookbackDays = 90)
    {
        // Implementation needed
        return new List<PatternRecognitionDTO>();
    }

    public async Task<BenchmarkingDTO> GetBenchmarkingInsightsAsync(string organizationId)
    {
        // Implementation needed
        return new BenchmarkingDTO();
    }

    public async Task<bool> ConfigureRecommendationSettingsAsync(RecommendationSettingsDTO settings)
    {
        // Implementation needed
        return true;
    }

    public async Task<RecommendationSettingsDTO> GetRecommendationSettingsAsync(int? userId = null, string? organizationId = null)
    {
        // Implementation needed
        return new RecommendationSettingsDTO();
    }

    public async Task<bool> RecordUserFeedbackAsync(RecommendationFeedbackDTO feedback)
    {
        // Implementation needed
        return true;
    }

    public async Task<bool> UpdateRecommendationModelAsync(string modelType, Dictionary<string, object> parameters)
    {
        // Implementation needed
        return true;
    }

    #endregion

    #region Pure AI Natural Language Processing

    public async Task<string> ProcessPureAIQueryAsync(string naturalLanguageQuery)
    {
        try
        {
            _logger.LogInformation("Processing Pure AI query: '{Query}'", naturalLanguageQuery);
            
            // Create query analysis for Pure AI system
            var queryAnalysis = new QueryAnalysisDTO
            {
                OriginalQuery = naturalLanguageQuery,
                QueryCategory = "Pure-AI", // Will be determined by AI
                RequiredTables = new List<string>(), // AI will determine
                Parameters = new Dictionary<string, object>()
            };
            
            // Use Pure AI Database Service to process query
            var result = await _aiDatabaseService.GetContextualDataAsync(queryAnalysis);
            
            if (result.Success && result.Data != null)
            {
                return result.Data.ToString() ?? "AI không thể xử lý câu hỏi này.";
            }
            else
            {
                return result.ErrorMessage ?? "Có lỗi xảy ra khi xử lý câu hỏi.";
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in ProcessPureAIQueryAsync for query: '{Query}'", naturalLanguageQuery);
            return $"Có lỗi xảy ra khi xử lý câu hỏi: {ex.Message}";
        }
    }

    #endregion
}

// Helper classes for internal calculations (keeping these for compatibility)
internal class EngagementPrediction
{
    public int PredictedEvents { get; set; }
    public double EngagementProbability { get; set; }
    public string RiskLevel { get; set; } = string.Empty;
    public double ConfidenceScore { get; set; }
}

internal class AttendancePrediction
{
    public int FinalRegistrations { get; set; }
    public int ExpectedAttendees { get; set; }
    public double AttendanceRate { get; set; }
    public double ConfidenceScore { get; set; }
}

internal class ChurnAnalysis
{
    public int HighRiskCount { get; set; }
    public int MediumRiskCount { get; set; }
    public double PredictedChurnRate { get; set; }
    public int VolunteersAtRisk { get; set; }
    public double ConfidenceScore { get; set; }
}
