using ivan_api.DTOs.VolunteerSchedule;
using ivan_api.DTOs.Common;
using ivan_api.Models;

namespace ivan_api.Repository.VolunteerScheduleRepo
{
    public interface IVolunteerScheduleRepository
    {
        // Basic CRUD operations
        Task<VolunteerSchedule?> GetByIdAsync(int scheduleId);
        Task<PagedResultDto<VolunteerSchedule>> GetPagedAsync(VolunteerScheduleFilterDTO filter, int? organizationId = null);
        Task<List<VolunteerSchedule>> GetByVolunteerIdAsync(int volunteerId, DateTime? startDate = null, DateTime? endDate = null);
        Task<List<VolunteerSchedule>> GetByEventIdAsync(int eventId);
        Task<VolunteerSchedule> CreateAsync(VolunteerSchedule schedule);
        Task<VolunteerSchedule> UpdateAsync(VolunteerSchedule schedule);
        Task<bool> DeleteAsync(int scheduleId);

        // Conflict checking
        Task<List<VolunteerSchedule>> CheckConflictsAsync(int volunteerId, DateTime startDateTime, DateTime endDateTime, int? excludeScheduleId = null);
        Task<bool> HasConflictAsync(int volunteerId, DateTime startDateTime, DateTime endDateTime, int? excludeScheduleId = null);

        // Availability checking
        Task<List<VolunteerSchedule>> GetVolunteerSchedulesForDateAsync(int volunteerId, DateTime date);
        Task<List<VolunteerSchedule>> GetVolunteerSchedulesInRangeAsync(int volunteerId, DateTime startDate, DateTime endDate);

        // Statistics and reporting
        Task<VolunteerScheduleStatsDTO> GetScheduleStatsAsync(int? organizationId = null, int? eventId = null, DateTime? startDate = null, DateTime? endDate = null);
        Task<List<VolunteerScheduleSummaryDTO>> GetTopVolunteersAsync(int? organizationId = null, int limit = 10);

        // Organization specific methods
        Task<PagedResultDto<VolunteerSchedule>> GetOrganizationVolunteerSchedulesAsync(int organizationId, VolunteerScheduleFilterDTO filter);
        Task<List<VolunteerSchedule>> GetOrganizationEventSchedulesAsync(int organizationId, int eventId);

        // Bulk operations
        Task<List<VolunteerSchedule>> CreateBulkAsync(List<VolunteerSchedule> schedules);
        Task<BulkScheduleResultDTO> CreateBulkWithConflictCheckAsync(List<VolunteerSchedule> schedules);

        // Utility methods
        Task<bool> ExistsAsync(int scheduleId);
        Task<bool> IsVolunteerAvailableAsync(int volunteerId, DateTime startDateTime, DateTime endDateTime, int? excludeScheduleId = null);
        Task<List<int>> GetAvailableVolunteersAsync(List<int> volunteerIds, DateTime startDateTime, DateTime endDateTime);
    }
}
