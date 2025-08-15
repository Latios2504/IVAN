namespace ivan_api.DTOs.Analytics
{
    // Enums for Time Periods
    public enum TimePeriod
    {
        Last7Days,
        Last30Days,
        Last3Months,
        Last6Months,
        LastYear,
        Custom
    }

    // Admin Dashboard Analytics
    public class AdminDashboardDto
    {
        public int TotalUsers { get; set; }
        public int TotalVolunteers { get; set; }
        public int TotalOrganizations { get; set; }
        public int TotalPartners { get; set; }
        public int TotalCoordinators { get; set; }
        public int TotalEvents { get; set; }
        public int TotalRegistrations { get; set; }
        public int PendingVerifications { get; set; }
        public List<RoleDistributionDto> RoleDistribution { get; set; } = new();
        public List<MonthlyStatsDto> MonthlyGrowth { get; set; } = new();
    }

    // Organization Dashboard Analytics
    public class OrganizationDashboardDto
    {
        public int MyTotalEvents { get; set; }
        public int MyActiveEvents { get; set; }
        public int MyCompletedEvents { get; set; }
        public int TotalVolunteersReached { get; set; }
        public int PendingRegistrations { get; set; }
        public int ApprovedRegistrations { get; set; }
        public decimal AverageEventRating { get; set; }
        public int TotalVolunteerHours { get; set; }
        public List<EventCategoryStatsDto> EventsByCategory { get; set; } = new();
        public List<RecentEventDto> RecentEvents { get; set; } = new();
    }

    // Partner Dashboard Analytics
    public class PartnerDashboardDto
    {
        public int TotalCollaborations { get; set; }
        public int ActiveCollaborations { get; set; }
        public int SponsoredEvents { get; set; }
        public decimal TotalSponsorshipAmount { get; set; }
        public decimal AveragePartnerRating { get; set; }
        public List<CollaborationTypeDto> CollaborationsByType { get; set; } = new();
        public List<IndustryStatsDto> IndustryComparison { get; set; } = new();
    }

    // Coordinator Dashboard Analytics
    public class CoordinatorDashboardDto
    {
        public int EventsManaged { get; set; }
        public int VolunteersManaged { get; set; }
        public int TasksAssigned { get; set; }
        public int TasksCompleted { get; set; }
        public decimal TaskCompletionRate { get; set; }
        public int UpcomingEvents { get; set; }
        public int PendingApprovals { get; set; }
        public List<TaskStatusDto> TasksByStatus { get; set; } = new();
        public List<VolunteerPerformanceDto> TopVolunteers { get; set; } = new();
    }

    // Volunteer Dashboard Analytics
    public class VolunteerDashboardDto
    {
        public int EventsParticipated { get; set; }
        public int EventsCompleted { get; set; }
        public int TotalVolunteerHours { get; set; }
        public int SkillsAcquired { get; set; }
        public int UpcomingEvents { get; set; }
        public List<EventCategoryStatsDto> EventsByCategory { get; set; } = new();
        public List<SkillProgressDto> SkillProgress { get; set; } = new();
        public List<RecentAchievementDto> RecentAchievements { get; set; } = new();
    }

    // Supporting DTOs
    public class RoleDistributionDto
    {
        public string RoleName { get; set; } = string.Empty;
        public int UserCount { get; set; }
        public decimal Percentage { get; set; }
    }

    public class MonthlyStatsDto
    {
        public string Month { get; set; } = string.Empty;
        public int Users { get; set; }
        public int Events { get; set; }
        public int Registrations { get; set; }
    }

    public class EventCategoryStatsDto
    {
        public string CategoryName { get; set; } = string.Empty;
        public int EventCount { get; set; }
        public int VolunteerCount { get; set; }
    }

    public class RecentEventDto
    {
        public int EventId { get; set; }
        public string EventName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public int RegisteredVolunteers { get; set; }
    }

    public class CollaborationTypeDto
    {
        public string Type { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Amount { get; set; }
    }

    public class IndustryStatsDto
    {
        public string IndustryName { get; set; } = string.Empty;
        public int PartnerCount { get; set; }
        public int CollaborationCount { get; set; }
    }

    public class TaskStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public int Count { get; set; }
        public string Color { get; set; } = string.Empty;
    }

    public class VolunteerPerformanceDto
    {
        public int VolunteerId { get; set; }
        public string VolunteerName { get; set; } = string.Empty;
        public int TasksCompleted { get; set; }
        public decimal Rating { get; set; }
        public int HoursWorked { get; set; }
    }

    public class SkillProgressDto
    {
        public string SkillName { get; set; } = string.Empty;
        public string ProficiencyLevel { get; set; } = string.Empty;
        public int EventsUsed { get; set; }
        public int YearsOfExperience { get; set; }
    }

    public class RecentAchievementDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime AchievedDate { get; set; }
        public string Type { get; set; } = string.Empty;
    }

    // Missing DTOs for Analytics Service
    public class CoordinatorTaskDto
    {
        public string TaskName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public string Priority { get; set; } = string.Empty;
    }

    public class VolunteerEventDto
    {
        public string EventName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public string Location { get; set; } = string.Empty;
        public string OrganizationName { get; set; } = string.Empty;
    }

    public class PartnerActivityDto
    {
        public string ActivityType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
