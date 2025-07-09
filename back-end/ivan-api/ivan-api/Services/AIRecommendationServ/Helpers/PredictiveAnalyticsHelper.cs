using ivan_api.DTOs.AIDatabaseManage;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services.AIRecommendationServ.Helpers;

public class PredictiveAnalyticsHelper
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly ILogger _logger;

    public PredictiveAnalyticsHelper(VolunteerManagementSystemContext context, ILogger logger)
    {
        _context = context;
        _logger = logger;
    }

    public EngagementPrediction CalculateEngagementTrend(List<EventRegistration> recentActivity)
    {
        // Simplified engagement prediction logic
        var activityByWeek = recentActivity
            .Where(r => r.RegistrationDate.HasValue)
            .GroupBy(r => r.RegistrationDate!.Value.Date.AddDays(-(int)r.RegistrationDate!.Value.DayOfWeek))
            .OrderBy(g => g.Key)
            .Select(g => g.Count())
            .ToList();

        var trend = activityByWeek.Count > 1 ? 
            (activityByWeek.Last() - activityByWeek.First()) / (double)activityByWeek.Count : 0;

        return new EngagementPrediction
        {
            PredictedEvents = Math.Max(0, (int)(activityByWeek.LastOrDefault() + trend)),
            EngagementProbability = Math.Min(1.0, Math.Max(0.1, 0.7 + (trend * 0.1))),
            RiskLevel = trend < -0.5 ? "High" : trend < 0 ? "Medium" : "Low",
            ConfidenceScore = activityByWeek.Count > 4 ? 0.8 : 0.6
        };
    }

    public EngagementPrediction PredictEngagement(EngagementPrediction current, int daysAhead)
    {
        // Apply time decay to prediction
        var timeDecay = Math.Max(0.5, 1.0 - (daysAhead / 365.0));
        current.ConfidenceScore *= timeDecay;
        return current;
    }

    public AttendancePrediction AnalyzeAttendancePattern(List<Event> similarEvents)
    {
        if (!similarEvents.Any())
        {
            return new AttendancePrediction
            {
                AttendanceRate = 0.75, // Default assumption
                ConfidenceScore = 0.3
            };
        }

        var attendanceRates = similarEvents
            .Where(e => e.EventRegistrations.Any())
            .Select(e => 
            {
                var registered = e.EventRegistrations.Count;
                var attended = e.EventRegistrations.Count(r => r.AttendanceStatus == "Attended");
                return attended / (double)registered;
            })
            .ToList();

        return new AttendancePrediction
        {
            AttendanceRate = attendanceRates.Average(),
            ConfidenceScore = Math.Min(0.9, 0.5 + (attendanceRates.Count * 0.1))
        };
    }

    public AttendancePrediction PredictAttendance(Event eventItem, AttendancePrediction pattern)
    {
        var currentRegistrations = eventItem.EventRegistrations.Count;
        var daysUntilEvent = (eventItem.StartDate - DateTime.UtcNow).Days;
        
        // Estimate final registrations based on time remaining
        var registrationGrowthFactor = daysUntilEvent > 7 ? 1.2 : daysUntilEvent > 3 ? 1.1 : 1.05;
        var finalRegistrations = (int)(currentRegistrations * registrationGrowthFactor);
        
        return new AttendancePrediction
        {
            FinalRegistrations = finalRegistrations,
            ExpectedAttendees = (int)(finalRegistrations * pattern.AttendanceRate),
            AttendanceRate = pattern.AttendanceRate,
            ConfidenceScore = pattern.ConfidenceScore
        };
    }

    public ChurnAnalysis AnalyzeChurnRisk(List<VolunteerProfile> volunteers)
    {
        var highRisk = volunteers.Count(v => v.LastActiveDate < DateTime.UtcNow.AddDays(-30));
        var mediumRisk = volunteers.Count(v => v.LastActiveDate < DateTime.UtcNow.AddDays(-14) && 
                                               v.LastActiveDate >= DateTime.UtcNow.AddDays(-30));

        return new ChurnAnalysis
        {
            HighRiskCount = highRisk,
            MediumRiskCount = mediumRisk,
            PredictedChurnRate = (highRisk / (double)volunteers.Count) * 100,
            VolunteersAtRisk = highRisk + mediumRisk,
            ConfidenceScore = volunteers.Count > 20 ? 0.8 : 0.6
        };
    }

    public List<string> GenerateEngagementRecommendations(EngagementPrediction prediction)
    {
        var recommendations = new List<string>();

        if (prediction.RiskLevel == "High")
        {
            recommendations.Add("Liên hệ trực tiếp để hiểu lý do giảm hoạt động");
            recommendations.Add("Mời tham gia sự kiện phù hợp với sở thích");
        }
        else if (prediction.RiskLevel == "Medium")
        {
            recommendations.Add("Gửi thông báo về các cơ hội tình nguyện mới");
            recommendations.Add("Mời tham gia hoạt động nhóm");
        }
        else
        {
            recommendations.Add("Duy trì mức độ tham gia hiện tại");
            recommendations.Add("Xem xét giao thêm trách nhiệm");
        }

        return recommendations;
    }

    public List<string> GenerateAttendanceRecommendations(AttendancePrediction prediction)
    {
        var recommendations = new List<string>();

        if (prediction.AttendanceRate < 0.6)
        {
            recommendations.Add("Cải thiện thông tin và mô tả sự kiện");
            recommendations.Add("Nhắc nhở tham dự trước 24-48 giờ");
        }
        else if (prediction.AttendanceRate < 0.8)
        {
            recommendations.Add("Gửi email xác nhận tham dự");
            recommendations.Add("Chuẩn bị cho số lượng tham dự dự kiến");
        }

        return recommendations;
    }

    public List<string> GenerateChurnPreventionRecommendations(ChurnAnalysis analysis)
    {
        return new List<string>
        {
            "Triển khai chương trình mentor cho tình nguyện viên mới",
            "Tạo cơ hội phát triển kỹ năng và nghề nghiệp",
            "Tăng cường ghi nhận và đánh giá đóng góp",
            "Tổ chức sự kiện giao lưu và xây dựng cộng đồng"
        };
    }
}

// Helper classes for internal calculations
public class EngagementPrediction
{
    public int PredictedEvents { get; set; }
    public double EngagementProbability { get; set; }
    public string RiskLevel { get; set; } = string.Empty;
    public double ConfidenceScore { get; set; }
}

public class AttendancePrediction
{
    public int FinalRegistrations { get; set; }
    public int ExpectedAttendees { get; set; }
    public double AttendanceRate { get; set; }
    public double ConfidenceScore { get; set; }
}

public class ChurnAnalysis
{
    public int HighRiskCount { get; set; }
    public int MediumRiskCount { get; set; }
    public double PredictedChurnRate { get; set; }
    public int VolunteersAtRisk { get; set; }
    public double ConfidenceScore { get; set; }
}
