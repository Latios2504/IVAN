using ivan_api.DTOs.Analytics;

namespace ivan_api.Services.Analytics
{
    public interface IAnalyticsService
    {
        // Overview Statistics
        Task<AdminOverviewStatsDto> GetAdminOverviewStatsAsync(TimePeriod period = TimePeriod.Last30Days);
        Task<SystemHealthDto> GetSystemHealthAsync();

        // User Analytics
        Task<UserAnalyticsDto> GetUserAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days);
        Task<IEnumerable<UserGrowthDto>> GetUserGrowthTrendsAsync(TimePeriod period = TimePeriod.Last30Days);
        Task<IEnumerable<RoleDistributionDto>> GetUserRoleDistributionAsync();
        Task<IEnumerable<GeographicDistributionDto>> GetUserGeographicDistributionAsync();

        // Event Analytics
        Task<EventAnalyticsDto> GetEventAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days);
        Task<IEnumerable<EventTrendDto>> GetEventTrendsAsync(TimePeriod period = TimePeriod.Last30Days);
        Task<IEnumerable<EventCategoryStatsDto>> GetEventCategoryStatsAsync(TimePeriod period = TimePeriod.Last30Days);
        Task<RegistrationAnalyticsDto> GetRegistrationAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days);

        // Engagement Analytics
        Task<EngagementAnalyticsDto> GetEngagementAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days);
        Task<IEnumerable<FeedbackAnalyticsDto>> GetFeedbackAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days);
        Task<CertificateAnalyticsDto> GetCertificateAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days);

        // System Performance Analytics
        Task<IEnumerable<SupportTicketAnalyticsDto>> GetSupportTicketAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days);
        Task<NotificationAnalyticsDto> GetNotificationAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days);
        Task<ChatbotAnalyticsDto> GetChatbotAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days);

        // Partnership Analytics
        Task<PartnershipAnalyticsDto> GetPartnershipAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days);
        Task<IEnumerable<CollaborationTrendDto>> GetCollaborationTrendsAsync(TimePeriod period = TimePeriod.Last30Days);

        // Time-based Analytics
        Task<IEnumerable<DailyStatsDto>> GetDailyStatsAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<MonthlyStatsDto>> GetMonthlyStatsAsync(int year);
        Task<YearlyStatsDto> GetYearlyStatsAsync(int year);

        // Detailed Analytics
        Task<DetailedAnalyticsDto> GetDetailedAnalyticsAsync(AnalyticsRequestDto request);
    }
}
