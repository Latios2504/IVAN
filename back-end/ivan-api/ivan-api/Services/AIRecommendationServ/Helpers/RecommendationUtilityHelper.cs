using ivan_api.DTOs.AIDatabaseManage;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ivan_api.Services.AIRecommendationServ.Helpers;

public class RecommendationUtilityHelper
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly ILogger _logger;

    public RecommendationUtilityHelper(VolunteerManagementSystemContext context, ILogger<RecommendationUtilityHelper> logger)
    {
        _context = context;
        _logger = logger;
    }

    public static int GetPriorityScore(string priority)
    {
        return priority.ToLower() switch
        {
            "critical" => 4,
            "high" => 3,
            "medium" => 2,
            "low" => 1,
            _ => 0
        };
    }

    public static int GetSeverityScore(string severity)
    {
        return severity.ToLower() switch
        {
            "critical" => 4,
            "high" => 3,
            "medium" => 2,
            "low" => 1,
            _ => 0
        };
    }

    public static List<string> GeneratePersonalizedTips(string userRole)
    {
        return userRole.ToLower() switch
        {
            "admin" or "coordinator" => new List<string>
            {
                "Thường xuyên ghi nhận đóng góp của tình nguyện viên",
                "Sử dụng dữ liệu để cải thiện hiệu quả chương trình",
                "Tạo môi trường hỗ trợ cho tình nguyện viên"
            },
            "volunteer" => new List<string>
            {
                "Tham gia đều đặn để xây dựng kinh nghiệm",
                "Chia sẻ phản hồi để cải thiện chương trình",
                "Kết nối với các tình nguyện viên khác"
            },
            _ => new List<string>()
        };
    }

    public static List<DashboardWidgetRecommendationDTO> GetCoordinatorWidgets()
    {
        return new List<DashboardWidgetRecommendationDTO>
        {
            new()
            {
                WidgetId = "volunteer-engagement",
                WidgetName = "Tình nguyện viên tích cực",
                WidgetType = "Metric",
                Description = "Theo dõi mức độ tham gia của tình nguyện viên",
                RecommendationReason = "Giúp theo dõi sức khỏe cộng đồng tình nguyện",
                Priority = 9
            },
            new()
            {
                WidgetId = "event-performance",
                WidgetName = "Hiệu suất sự kiện",
                WidgetType = "Chart",
                Description = "Phân tích hiệu suất các sự kiện gần đây",
                RecommendationReason = "Giúp tối ưu hóa chiến lược tổ chức sự kiện",
                Priority = 8
            },
            new()
            {
                WidgetId = "skill-gaps",
                WidgetName = "Kỹ năng thiếu hụt",
                WidgetType = "List",
                Description = "Danh sách kỹ năng đang thiếu hụt",
                RecommendationReason = "Hỗ trợ quyết định tuyển dụng và đào tạo",
                Priority = 7
            }
        };
    }

    public static List<DashboardWidgetRecommendationDTO> GetVolunteerWidgets()
    {
        return new List<DashboardWidgetRecommendationDTO>
        {
            new()
            {
                WidgetId = "my-impact",
                WidgetName = "Tác động của tôi",
                WidgetType = "Chart",
                Description = "Hiển thị tổng quan về đóng góp cá nhân",
                RecommendationReason = "Tăng động lực thông qua thấy được tác động",
                Priority = 8
            },
            new()
            {
                WidgetId = "upcoming-events",
                WidgetName = "Sự kiện sắp tới",
                WidgetType = "List",
                Description = "Danh sách sự kiện phù hợp sắp diễn ra",
                RecommendationReason = "Giúp tình nguyện viên dễ dàng tìm cơ hội tham gia",
                Priority = 9
            },
            new()
            {
                WidgetId = "skill-development",
                WidgetName = "Phát triển kỹ năng",
                WidgetType = "Metric",
                Description = "Theo dõi tiến bộ kỹ năng cá nhân",
                RecommendationReason = "Khuyến khích phát triển bản thân",
                Priority = 6
            }
        };
    }

    public static async Task<List<string>> AnalyzeSkillDistribution(VolunteerManagementSystemContext context)
    {
        // Simplified skill gap analysis
        var requiredSkills = new List<string> { "Leadership", "Communication", "Technical", "Event Planning" };
        var availableSkills = await context.VolunteerProfiles
            .Where(v => !string.IsNullOrEmpty(v.Skills))
            .Select(v => v.Skills)
            .ToListAsync();

        return requiredSkills.Where(skill => 
            !availableSkills.Any(available => available != null && available.Contains(skill))).ToList();
    }

    public async Task<UserUsageAnalyticsDTO> GetUserUsageAnalyticsAsync(int userId)
    {
        try
        {
            var volunteer = await _context.VolunteerProfiles
                .Where(v => v.UserId == userId)
                .FirstOrDefaultAsync();

            if (volunteer == null)
            {
                return new UserUsageAnalyticsDTO
                {
                    UserId = userId,
                    TotalSessions = 0,
                    TotalTimeSpent = TimeSpan.Zero,
                    LastLoginDate = DateTime.MinValue,
                    EngagementScore = 0
                };
            }

            // Calculate analytics based on available data
            var registrations = await _context.EventRegistrations
                .Where(er => er.VolunteerId == volunteer.VolunteerId)
                .CountAsync();

            return new UserUsageAnalyticsDTO
            {
                UserId = userId,
                TotalSessions = registrations,
                TotalTimeSpent = TimeSpan.FromHours(volunteer.TotalHoursVolunteered ?? 0),
                LastLoginDate = volunteer.LastActiveDate ?? DateTime.MinValue,
                EngagementScore = CalculateEngagementScore(volunteer)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user usage analytics for user {UserId}", userId);
            throw;
        }
    }

    public async Task<List<RecommendationItemDTO>> GetCoordinatorRecommendationsAsync(int userId)
    {
        try
        {
            var recommendations = new List<RecommendationItemDTO>();

            // Get events that need coordinators
            var eventsNeedingCoordinators = await _context.Events
                .Where(e => e.StatusId == 1 && e.StartDate > DateTime.Now) // Assuming StatusId 1 is Active
                .OrderBy(e => e.StartDate)
                .Take(5)
                .ToListAsync();

            foreach (var eventItem in eventsNeedingCoordinators)
            {
                recommendations.Add(new RecommendationItemDTO
                {
                    Id = eventItem.EventId.ToString(),
                    Title = $"Quản lý sự kiện: {eventItem.EventName}",
                    Description = $"Sự kiện cần điều phối viên - {eventItem.StartDate:dd/MM/yyyy}",
                    Type = "Event Coordination",
                    Priority = GetPriorityScore("high"),
                    RecommendationReason = "Sự kiện cần người điều phối"
                });
            }

            return recommendations;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting coordinator recommendations for user {UserId}", userId);
            throw;
        }
    }

    public async Task<List<RecommendationItemDTO>> GetVolunteerRecommendationsAsync(int userId)
    {
        try
        {
            var recommendations = new List<RecommendationItemDTO>();

            var volunteer = await _context.VolunteerProfiles
                .Where(v => v.UserId == userId)
                .FirstOrDefaultAsync();

            if (volunteer == null) return recommendations;

            // Get suitable events based on volunteer skills and interests
            var suitableEvents = await _context.Events
                .Where(e => e.StatusId == 1 && e.StartDate > DateTime.Now) // Assuming StatusId 1 is Active
                .OrderBy(e => e.StartDate)
                .Take(5)
                .ToListAsync();

            foreach (var eventItem in suitableEvents)
            {
                var matchScore = CalculateEventMatchScore(volunteer, eventItem);
                if (matchScore > 0.6) // Only recommend if match score is high
                {
                    recommendations.Add(new RecommendationItemDTO
                    {
                        Id = eventItem.EventId.ToString(),
                        Title = $"Tham gia: {eventItem.EventName}",
                        Description = eventItem.Description ?? "Sự kiện tình nguyện",
                        Type = "Event Participation",
                        Priority = GetPriorityScore("medium"),
                        RecommendationReason = $"Phù hợp với kỹ năng của bạn ({matchScore:P0})"
                    });
                }
            }

            return recommendations;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting volunteer recommendations for user {UserId}", userId);
            throw;
        }
    }

    private int CalculateEngagementScore(VolunteerProfile volunteer)
    {
        var score = 0;
        
        if (volunteer.TotalHoursVolunteered > 0)
            score += Math.Min((int)(volunteer.TotalHoursVolunteered / 10), 50); // Max 50 points for hours
        
        if (volunteer.LastActiveDate.HasValue && volunteer.LastActiveDate > DateTime.Now.AddDays(-30))
            score += 30; // 30 points for recent activity
        
        if (!string.IsNullOrEmpty(volunteer.Skills))
            score += 20; // 20 points for having skills listed
        
        return Math.Min(score, 100); // Max score is 100
    }

    private double CalculateEventMatchScore(VolunteerProfile volunteer, Event eventItem)
    {
        var score = 0.5; // Base score
        
        // Add score based on skills match
        if (!string.IsNullOrEmpty(volunteer.Skills) && !string.IsNullOrEmpty(eventItem.RequiredSkills))
        {
            var volunteerSkills = volunteer.Skills.Split(',').Select(s => s.Trim().ToLower());
            var requiredSkills = eventItem.RequiredSkills.Split(',').Select(s => s.Trim().ToLower());
            var matchingSkills = volunteerSkills.Intersect(requiredSkills).Count();
            if (matchingSkills > 0)
                score += 0.3 * (matchingSkills / (double)requiredSkills.Count());
        }
        
        // Add score based on location preference (using available location fields)
        if (!string.IsNullOrEmpty(eventItem.Location))
        {
            score += 0.2; // Simple location boost for now
        }
        
        return Math.Min(score, 1.0);
    }
}
