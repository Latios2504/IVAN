using ivan_api.DTOs;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.VolunteerScheduleServ
{
    public interface IVolunteerScheduleService
    {
        // For Coordinator Role - Managing volunteer schedules (FE-07 requirements)
        Task<ApiResponseDTO<PagedResultDTO<VolunteerScheduleDTO>>> GetOrganizationVolunteerSchedulesAsync(int organizationId, VolunteerScheduleFilterDTO filter);
        Task<ApiResponseDTO<VolunteerScheduleDTO>> GetVolunteerScheduleByIdAsync(int organizationId, int scheduleId);
        Task<ApiResponseDTO<VolunteerScheduleDTO>> CreateVolunteerScheduleAsync(int organizationId, VolunteerScheduleRequestDTO request, int createdByUserId);
        Task<ApiResponseDTO<VolunteerScheduleDTO>> UpdateVolunteerScheduleAsync(int organizationId, int scheduleId, VolunteerScheduleRequestDTO request, int updatedByUserId);
        Task<ApiResponseDTO<bool>> DeleteVolunteerScheduleAsync(int organizationId, int scheduleId);

        // For Volunteer Role - Personal schedule management (FE-07 requirements)
        Task<ApiResponseDTO<PagedResultDTO<VolunteerScheduleDTO>>> GetPersonalSchedulesAsync(int userId, VolunteerScheduleFilterDTO filter);
        Task<ApiResponseDTO<VolunteerScheduleDTO>> GetPersonalScheduleByIdAsync(int userId, int scheduleId);
    }
}
