using ivan_api.DTOs.CoordinatorSchedule;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.Authentication;

namespace ivan_api.Services.CoordinatorScheduleServ
{
    public interface ICoordinatorScheduleService
    {
        // CRUD Operations
        Task<ApiResponseDTO<CoordinatorScheduleDto>> GetScheduleByIdAsync(int organizationId, int scheduleId);
        Task<ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>> GetOrganizationSchedulesAsync(
            int organizationId, CoordinatorScheduleFilterDto filter);
        Task<ApiResponseDTO<int>> CreateScheduleAsync(int organizationId, CreateCoordinatorScheduleDto createDto, int createdBy);
        Task<ApiResponseDTO<bool>> UpdateScheduleAsync(int organizationId, int scheduleId, UpdateCoordinatorScheduleDto updateDto, int updatedBy);
        Task<ApiResponseDTO<bool>> DeleteScheduleAsync(int organizationId, int scheduleId);

        // Personal Schedule (for Coordinator to view their own)
        Task<ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>> GetPersonalSchedulesAsync(
            int coordinatorUserId, CoordinatorScheduleFilterDto filter);

        // Stats & Analytics
        Task<ApiResponseDTO<CoordinatorScheduleStatsDto>> GetScheduleStatsAsync(int organizationId);

        // Calendar Views
        Task<ApiResponseDTO<List<CoordinatorScheduleSummaryDto>>> GetCalendarViewAsync(
            int organizationId, DateTime startDate, DateTime endDate, int? coordinatorId = null);

        // Status Management
        Task<ApiResponseDTO<bool>> UpdateScheduleStatusAsync(int organizationId, int scheduleId, string status, int updatedBy);

        // Bulk Operations
        Task<ApiResponseDTO<bool>> BulkUpdateStatusAsync(int organizationId, List<int> scheduleIds, string status, int updatedBy);
        Task<ApiResponseDTO<bool>> BulkDeleteAsync(int organizationId, List<int> scheduleIds);

        // Conflict Detection
        Task<ApiResponseDTO<List<CoordinatorScheduleDto>>> CheckScheduleConflictsAsync(
            int coordinatorId, DateTime startDateTime, DateTime endDateTime, int? excludeScheduleId = null);
    }
}
