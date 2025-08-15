using ivan_api.DTOs.Analytics;

namespace ivan_api.Services.Analytics
{
    public interface IAnalyticsService
    {
        // Role-specific Dashboard Analytics
        Task<AdminDashboardDto> GetAdminDashboardAsync(TimePeriod period = TimePeriod.Last30Days);
        Task<OrganizationDashboardDto> GetOrganizationDashboardAsync(int organizationId, TimePeriod period = TimePeriod.Last30Days);
        Task<PartnerDashboardDto> GetPartnerDashboardAsync(int partnerId, TimePeriod period = TimePeriod.Last30Days);
        Task<CoordinatorDashboardDto> GetCoordinatorDashboardAsync(int coordinatorId, TimePeriod period = TimePeriod.Last30Days);
        Task<VolunteerDashboardDto> GetVolunteerDashboardAsync(int volunteerId, TimePeriod period = TimePeriod.Last30Days);
    }
}
