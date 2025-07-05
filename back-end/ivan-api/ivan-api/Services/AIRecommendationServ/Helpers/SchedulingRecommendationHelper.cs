using ivan_api.DTOs.AIDatabaseManage;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services.AIRecommendationServ.Helpers;

public class SchedulingRecommendationHelper
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly ILogger _logger;

    public SchedulingRecommendationHelper(VolunteerManagementSystemContext context, ILogger logger)
    {
        _context = context;
        _logger = logger;
    }

    public double CalculateVolunteerEventMatchScore(VolunteerProfile volunteer, Event eventItem)
    {
        double score = 0.0;
        int factors = 0;

        // Check skill match (40% weight)
        var skillMatchScore = CalculateSkillMatchPercentage(volunteer, eventItem);
        score += skillMatchScore * 0.4;
        factors++;

        // Check availability (30% weight)
        var availabilityScore = CheckAvailabilityScore(volunteer, eventItem);
        score += availabilityScore * 0.3;
        factors++;

        // Check location proximity (20% weight)
        var locationScore = CheckLocationProximity(volunteer, eventItem);
        score += locationScore * 0.2;
        factors++;

        // Check past performance (10% weight)
        var performanceScore = (double)(volunteer.Rating ?? 0) / 5.0;
        score += performanceScore * 0.1;
        factors++;

        return factors > 0 ? score : 0.0;
    }

    public double CalculateSkillMatchPercentage(VolunteerProfile volunteer, Event eventItem)
    {
        if (string.IsNullOrEmpty(eventItem.RequiredSkills) || string.IsNullOrEmpty(volunteer.Skills))
            return 0.0;

        var requiredSkills = eventItem.RequiredSkills.Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(s => s.Trim().ToLower()).ToList();
        var volunteerSkills = volunteer.Skills.Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(s => s.Trim().ToLower()).ToList();

        if (!requiredSkills.Any()) return 1.0; // No specific skills required

        var matchedSkills = requiredSkills.Count(req => volunteerSkills.Any(vol => vol.Contains(req)));
        return (double)matchedSkills / requiredSkills.Count;
    }

    public double CheckAvailabilityScore(VolunteerProfile volunteer, Event eventItem)
    {
        // Check if volunteer has conflicting schedules
        var hasConflict = volunteer.VolunteerSchedules?.Any(s => 
            s.StartDateTime < eventItem.EndDate && s.EndDateTime > eventItem.StartDate) ?? false;

        if (hasConflict) return 0.3; // Some conflict but might still be available

        // Check availability pattern
        if (!string.IsNullOrEmpty(volunteer.Availability))
        {
            var eventDayOfWeek = eventItem.StartDate.DayOfWeek.ToString().ToLower();
            if (volunteer.Availability.ToLower().Contains(eventDayOfWeek))
                return 1.0;
        }

        return 0.7; // Default good availability
    }

    public double CheckLocationProximity(VolunteerProfile volunteer, Event eventItem)
    {
        // Simple location matching based on province
        if (string.IsNullOrEmpty(eventItem.Province))
            return 0.8; // Default score if no location specified

        // Get volunteer's province from UserProfile
        var userProfile = volunteer.User?.UserProfiles?.FirstOrDefault();
        if (userProfile?.Province?.Equals(eventItem.Province, StringComparison.OrdinalIgnoreCase) == true)
            return 1.0;

        return 0.5; // Different province but still possible
    }

    public string CheckAvailabilityStatus(VolunteerProfile volunteer, Event eventItem)
    {
        var hasConflict = volunteer.VolunteerSchedules?.Any(s => 
            s.StartDateTime < eventItem.EndDate && s.EndDateTime > eventItem.StartDate) ?? false;

        if (hasConflict) return "Có xung đột lịch";
        
        if (!string.IsNullOrEmpty(volunteer.Availability))
        {
            var eventDayOfWeek = eventItem.StartDate.DayOfWeek.ToString().ToLower();
            if (volunteer.Availability.ToLower().Contains(eventDayOfWeek))
                return "Rảnh rỗi";
        }

        return "Có thể tham gia";
    }

    public async Task<List<int>> GetConflictingEvents(int volunteerId, DateTime startDate, DateTime endDate)
    {
        var conflictingEvents = await _context.VolunteerSchedules
            .Where(s => s.VolunteerId == volunteerId && 
                       s.StartDateTime < endDate && 
                       s.EndDateTime > startDate &&
                       s.EventId.HasValue)
            .Select(s => s.EventId!.Value)
            .ToListAsync();

        return conflictingEvents;
    }

    public async Task<int> GetPreviousParticipationCount(int volunteerId, string? province)
    {
        var count = await _context.EventRegistrations
            .Include(er => er.Event)
            .Where(er => er.VolunteerId == volunteerId && 
                        (string.IsNullOrEmpty(province) || er.Event.Province == province) &&
                        er.AttendanceStatus == "Attended")
            .CountAsync();

        return count;
    }

    public string GenerateSchedulingReason(VolunteerProfile volunteer, Event eventItem, double matchScore)
    {
        var reasons = new List<string>();

        var skillMatch = CalculateSkillMatchPercentage(volunteer, eventItem);
        if (skillMatch > 0.8)
            reasons.Add("có kỹ năng phù hợp cao");
        else if (skillMatch > 0.5)
            reasons.Add("có kỹ năng phù hợp");

        if (volunteer.Rating > 4.0m)
            reasons.Add("có đánh giá xuất sắc");

        var availabilityStatus = CheckAvailabilityStatus(volunteer, eventItem);
        if (availabilityStatus == "Rảnh rỗi")
            reasons.Add("hoàn toàn rảnh rỗi");

        var userProfile = volunteer.User?.UserProfiles?.FirstOrDefault();
        if (userProfile?.Province?.Equals(eventItem.Province, StringComparison.OrdinalIgnoreCase) == true)
            reasons.Add("ở cùng tỉnh thành");

        return reasons.Any() 
            ? $"Tình nguyện viên {reasons.Aggregate((i, j) => i + ", " + j)}"
            : "Tình nguyện viên phù hợp cho sự kiện này";
    }

    public List<string> GenerateSchedulingConsiderations(VolunteerProfile volunteer, Event eventItem)
    {
        var considerations = new List<string>();

        var conflictingEvents = volunteer.VolunteerSchedules?.Count(s => 
            s.StartDateTime < eventItem.EndDate && s.EndDateTime > eventItem.StartDate) ?? 0;

        if (conflictingEvents > 0)
            considerations.Add($"Có {conflictingEvents} lịch trình có thể xung đột");

        if (volunteer.TotalHoursVolunteered > 200)
            considerations.Add("Tình nguyện viên kinh nghiệm cao");

        if (volunteer.LastActiveDate < DateTime.UtcNow.AddDays(-30))
            considerations.Add("Chưa hoạt động gần đây - cần liên hệ xác nhận");

        var userProfile = volunteer.User?.UserProfiles?.FirstOrDefault();
        if (userProfile?.Province != eventItem.Province)
            considerations.Add("Ở tỉnh thành khác - cần xem xét chi phí di chuyển");

        return considerations;
    }
}
