using ivan_api.DTOs.CoordinatorSchedule;
using ivan_api.DTOs.Common;
using ivan_api.Models;

namespace ivan_api.Repository.CoordinatorScheduleRepo
{
    public interface ICoordinatorScheduleRepository
    {
        // Basic CRUD Operations
        Task<CoordinatorSchedule?> GetByIdAsync(int scheduleId);
        Task<CoordinatorSchedule?> GetByIdAndOrganizationAsync(int scheduleId, int organizationId);
        Task<PagedResultDto<CoordinatorSchedule>> GetOrganizationSchedulesAsync(
            int organizationId, CoordinatorScheduleFilterDto filter);
        Task<PagedResultDto<CoordinatorSchedule>> GetPersonalSchedulesAsync(
            int coordinatorUserId, CoordinatorScheduleFilterDto filter);
        Task<int> CreateAsync(CoordinatorSchedule schedule);
        Task<bool> UpdateAsync(CoordinatorSchedule schedule);
        Task<bool> DeleteAsync(int scheduleId);
        Task<bool> SaveChangesAsync();

        // Conflict Detection
        Task<List<CoordinatorSchedule>> CheckConflictsAsync(
            int coordinatorId, DateTime startDateTime, DateTime endDateTime, int? excludeScheduleId = null);

        // Calendar Views
        Task<List<CoordinatorSchedule>> GetCalendarViewAsync(
            int organizationId, DateTime startDate, DateTime endDate, int? coordinatorId = null);

        // Statistics
        Task<int> GetTotalSchedulesCountAsync(int organizationId);
        Task<Dictionary<string, int>> GetSchedulesByStatusAsync(int organizationId);
        Task<Dictionary<string, int>> GetSchedulesByTypeAsync(int organizationId);
        Task<Dictionary<string, int>> GetSchedulesByPriorityAsync(int organizationId);
        Task<int> GetTodaySchedulesCountAsync(int organizationId);
        Task<int> GetThisWeekSchedulesCountAsync(int organizationId);
        Task<int> GetThisMonthSchedulesCountAsync(int organizationId);
        Task<int> GetUpcomingSchedulesCountAsync(int organizationId);
        Task<int> GetOverdueSchedulesCountAsync(int organizationId);
        Task<List<CoordinatorScheduleStatsItem>> GetTopCoordinatorsAsync(int organizationId, int limit = 10);

        // Bulk Operations
        Task<bool> BulkUpdateStatusAsync(int organizationId, List<int> scheduleIds, string status, int updatedBy);
        Task<bool> BulkDeleteAsync(int organizationId, List<int> scheduleIds);

        // Validation Helpers
        Task<bool> CoordinatorBelongsToOrganizationAsync(int coordinatorId, int organizationId);
        Task<bool> ScheduleExistsAsync(int scheduleId);
        Task<int?> GetCoordinatorIdByUserIdAsync(int userId);
        Task<VolunteerCoordinator?> GetCoordinatorByIdAsync(int coordinatorId);
        Task<CoordinatorScheduleStatsDto> GetScheduleStatsAsync(int organizationId);
    }
}
