using ivan_api.DTOs.VolunteerSchedule;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.VolunteerScheduleServ
{
    public interface IVolunteerScheduleService
    {
        // For Coordinator Role - Managing volunteer schedules (FE-07 requirements)
        Task<PagedResultDto<VolunteerScheduleDTO>> GetOrganizationVolunteerSchedulesAsync(int organizationId, VolunteerScheduleFilterDTO filter);
        Task<VolunteerScheduleDTO?> GetVolunteerScheduleByIdAsync(int organizationId, int scheduleId);
        Task<VolunteerScheduleDTO> CreateVolunteerScheduleAsync(int organizationId, VolunteerScheduleRequestDTO request, int createdByUserId);
        Task<VolunteerScheduleDTO> UpdateVolunteerScheduleAsync(int organizationId, int scheduleId, VolunteerScheduleRequestDTO request, int updatedByUserId);
        Task<bool> DeleteVolunteerScheduleAsync(int organizationId, int scheduleId);

        // For Volunteer Role - Personal schedule management (FE-07 requirements)
        Task<PagedResultDto<VolunteerScheduleDTO>> GetPersonalSchedulesAsync(int userId, VolunteerScheduleFilterDTO filter);
        Task<VolunteerScheduleDTO?> GetPersonalScheduleByIdAsync(int userId, int scheduleId);

        // Conflict Detection
        Task<List<VolunteerScheduleDTO>> CheckScheduleConflictsAsync(
            int volunteerId, DateTime startDateTime, DateTime endDateTime, int? excludeScheduleId = null);
    }
}
