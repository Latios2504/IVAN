using ivan_api.DTOs.Schedule;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.ScheduleServ
{
    public interface IScheduleService
    {
        Task<ApiResponseDTO<PagedResultDto<ScheduleDTO>>> ListSchedulesAsync(int userId, int? coordinatorId, int? eventId, int page, int size);
        Task<ApiResponseDTO<ScheduleDTO>> GetScheduleAsync(int userId, int scheduleId);
        Task<ApiResponseDTO<ScheduleDTO>> AddScheduleAsync(int userId, ScheduleRequestDTO request);
        Task<ApiResponseDTO<ScheduleDTO>> UpdateScheduleAsync(int userId, int scheduleId, ScheduleRequestDTO request);
        Task<ApiResponseDTO<PagedResultDto<ScheduleDTO>>> GetPersonalSchedulesAsync(int userId, int? eventId, DateTime? startDate, DateTime? endDate, int page, int size);
    }
}
