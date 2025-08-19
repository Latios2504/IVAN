using ivan_api.DTOs.CoordinatorSchedule;
using ivan_api.DTOs.Common;
using ivan_api.Models;

namespace ivan_api.Services.CoordinatorScheduleServ
{
    public interface ICoordinatorScheduleService
    {
        // CRUD Operations
        Task<CoordinatorScheduleDto?> GetScheduleByIdAsync(int organizationId, int scheduleId);

        Task<PagedResultDto<CoordinatorScheduleDto>> GetOrganizationSchedulesAsync(
            int organizationId, CoordinatorScheduleFilterDto filter);

        Task<int?> CreateScheduleAsync(int organizationId, CreateCoordinatorScheduleDto createDto, int createdBy);

        Task<bool> UpdateScheduleAsync(int organizationId, int scheduleId, UpdateCoordinatorScheduleDto updateDto,
            int updatedBy);

        Task<bool> DeleteScheduleAsync(int organizationId, int scheduleId);

        // Personal Schedule (for Coordinator to view their own)
        Task<PagedResultDto<CoordinatorScheduleDto>> GetPersonalSchedulesAsync(
            int coordinatorUserId, CoordinatorScheduleFilterDto filter);

        // Stats & Analytics
        Task<CoordinatorScheduleStatsDto?> GetScheduleStatsAsync(int organizationId);

        // Calendar Views
        Task<List<CoordinatorScheduleSummaryDto>> GetCalendarViewAsync(
            int organizationId, DateTime startDate, DateTime endDate, int? coordinatorId = null);

        // Status Management
        Task<bool> UpdateScheduleStatusAsync(int organizationId, int scheduleId, string status, int updatedBy);

        // Bulk Operations
        Task<bool> BulkUpdateStatusAsync(int organizationId, List<int> scheduleIds, string status, int updatedBy);
        Task<bool> BulkDeleteAsync(int organizationId, List<int> scheduleIds);

        // Conflict Detection
        Task<List<CoordinatorScheduleDto>> CheckScheduleConflictsAsync(
            int coordinatorId, DateTime startDateTime, DateTime endDateTime, int? excludeScheduleId = null);

        // Helper Methods
        Task<VolunteerCoordinator?> GetCoordinatorByIdAsync(int coordinatorId);
    }
}
