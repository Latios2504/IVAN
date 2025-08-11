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

    // Base Analytics DTOs
    public class AnalyticsRequestDto
    {
        public TimePeriod Period { get; set; } = TimePeriod.Last30Days;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string[]? Categories { get; set; }
        public string[]? Metrics { get; set; }
    }

    // Overview Statistics
    public class AdminOverviewStatsDto
    {
        public int TotalUsers { get; set; }
        public int TotalVolunteers { get; set; }
        public int TotalOrganizations { get; set; }
        public int TotalPartners { get; set; }
        public int TotalEvents { get; set; }
        public int ActiveEvents { get; set; }
        public int TotalHours { get; set; }
        public int PendingApprovals { get; set; }
        public decimal MonthlyGrowthRate { get; set; }
        public int NewUsersThisMonth { get; set; }
        public int CompletedEventsThisMonth { get; set; }
    }

    public class SystemHealthDto
    {
        public string OverallStatus { get; set; } = "Healthy";
        public double DatabaseResponseTime { get; set; }
        public double ApiResponseTime { get; set; }
        public int ActiveConnections { get; set; }
        public double CpuUsage { get; set; }
        public double MemoryUsage { get; set; }
        public int ErrorRate { get; set; }
        public DateTime LastUpdated { get; set; }
    }

    // User Analytics
    public class UserAnalyticsDto
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int NewUsers { get; set; }
        public int VerifiedUsers { get; set; }
        public decimal UserRetentionRate { get; set; }
        public decimal AverageSessionDuration { get; set; }
        public int MostActiveRole { get; set; }
        public string MostActiveRoleName { get; set; } = string.Empty;
    }

    public class UserGrowthDto
    {
        public DateTime Date { get; set; }
        public int NewUsers { get; set; }
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
    }

    public class RoleDistributionDto
    {
        public string RoleName { get; set; } = string.Empty;
        public int UserCount { get; set; }
        public decimal Percentage { get; set; }
    }

    public class GeographicDistributionDto
    {
        public string Province { get; set; } = string.Empty;
        public int UserCount { get; set; }
        public decimal Percentage { get; set; }
    }

    // Event Analytics
    public class EventAnalyticsDto
    {
        public int TotalEvents { get; set; }
        public int ActiveEvents { get; set; }
        public int CompletedEvents { get; set; }
        public int CancelledEvents { get; set; }
        public decimal AverageRegistrationsPerEvent { get; set; }
        public decimal EventCompletionRate { get; set; }
        public int TotalRegistrations { get; set; }
        public int ApprovedRegistrations { get; set; }
        public decimal RegistrationApprovalRate { get; set; }
    }

    public class EventTrendDto
    {
        public DateTime Date { get; set; }
        public int EventsCreated { get; set; }
        public int EventsCompleted { get; set; }
        public int Registrations { get; set; }
    }

    public class EventCategoryStatsDto
    {
        public string CategoryName { get; set; } = string.Empty;
        public int EventCount { get; set; }
        public int TotalRegistrations { get; set; }
        public decimal AverageRating { get; set; }
        public decimal Percentage { get; set; }
    }

    public class RegistrationAnalyticsDto
    {
        public int TotalRegistrations { get; set; }
        public int ApprovedRegistrations { get; set; }
        public int PendingRegistrations { get; set; }
        public int RejectedRegistrations { get; set; }
        public decimal ApprovalRate { get; set; }
        public decimal AverageProcessingTime { get; set; }
        public int AttendanceRate { get; set; }
    }

    // Engagement Analytics
    public class EngagementAnalyticsDto
    {
        public decimal UserEngagementScore { get; set; }
        public int AverageSessionsPerUser { get; set; }
        public decimal AverageTimeOnPlatform { get; set; }
        public int FeedbackSubmissions { get; set; }
        public decimal AverageFeedbackRating { get; set; }
        public int FeatureUsageRate { get; set; }
    }

    public class FeedbackAnalyticsDto
    {
        public DateTime Date { get; set; }
        public int FeedbackCount { get; set; }
        public decimal AverageRating { get; set; }
        public string Category { get; set; } = string.Empty;
    }

    public class CertificateAnalyticsDto
    {
        public int TotalCertificatesIssued { get; set; }
        public int CertificatesThisMonth { get; set; }
        public int TotalDownloads { get; set; }
        public decimal AverageTimeToIssuance { get; set; }
        public int MostPopularTemplate { get; set; }
        public string MostPopularTemplateName { get; set; } = string.Empty;
    }

    // System Performance Analytics
    public class SupportTicketAnalyticsDto
    {
        public DateTime Date { get; set; }
        public int TicketsCreated { get; set; }
        public int TicketsResolved { get; set; }
        public decimal AverageResolutionTime { get; set; }
        public int SatisfactionRating { get; set; }
        public string Category { get; set; } = string.Empty;
    }

    public class NotificationAnalyticsDto
    {
        public int TotalNotificationsSent { get; set; }
        public int NotificationsRead { get; set; }
        public decimal ReadRate { get; set; }
        public decimal AverageTimeToRead { get; set; }
        public int MostEngagingNotificationType { get; set; }
    }

    public class ChatbotAnalyticsDto
    {
        public int TotalInteractions { get; set; }
        public int UniqueUsers { get; set; }
        public decimal AverageSessionLength { get; set; }
        public int MostAskedQuestions { get; set; }
        public decimal UserSatisfactionRate { get; set; }
        public int ResolvedQueries { get; set; }
    }

    // Partnership Analytics
    public class PartnershipAnalyticsDto
    {
        public int TotalPartnerships { get; set; }
        public int ActivePartnerships { get; set; }
        public decimal TotalInvestment { get; set; }
        public int SuccessfulCollaborations { get; set; }
        public decimal AveragePartnershipDuration { get; set; }
        public decimal PartnerSatisfactionRate { get; set; }
    }

    public class CollaborationTrendDto
    {
        public DateTime Date { get; set; }
        public int NewPartnerships { get; set; }
        public int CompletedCollaborations { get; set; }
        public decimal InvestmentAmount { get; set; }
    }

    // Time-based Analytics
    public class DailyStatsDto
    {
        public DateTime Date { get; set; }
        public int NewUsers { get; set; }
        public int NewEvents { get; set; }
        public int Registrations { get; set; }
        public int CompletedEvents { get; set; }
        public int FeedbackSubmissions { get; set; }
    }

    public class MonthlyStatsDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public string MonthName { get; set; } = string.Empty;
        public int NewUsers { get; set; }
        public int NewEvents { get; set; }
        public int TotalRegistrations { get; set; }
        public int CompletedEvents { get; set; }
        public decimal Revenue { get; set; }
    }

    public class YearlyStatsDto
    {
        public int Year { get; set; }
        public int TotalUsers { get; set; }
        public int TotalEvents { get; set; }
        public int TotalRegistrations { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal GrowthRate { get; set; }
        public int MostActiveMonth { get; set; }
    }

    // Detailed Analytics
    public class DetailedAnalyticsDto
    {
        public AdminOverviewStatsDto Overview { get; set; } = new();
        public UserAnalyticsDto UserStats { get; set; } = new();
        public EventAnalyticsDto EventStats { get; set; } = new();
        public EngagementAnalyticsDto EngagementStats { get; set; } = new();
        public PartnershipAnalyticsDto PartnershipStats { get; set; } = new();
        public SystemHealthDto SystemHealth { get; set; } = new();
        public IEnumerable<UserGrowthDto> UserGrowthTrends { get; set; } = new List<UserGrowthDto>();
        public IEnumerable<EventTrendDto> EventTrends { get; set; } = new List<EventTrendDto>();
        public IEnumerable<RoleDistributionDto> RoleDistribution { get; set; } = new List<RoleDistributionDto>();
        public IEnumerable<GeographicDistributionDto> GeographicDistribution { get; set; } = new List<GeographicDistributionDto>();
    }
}
