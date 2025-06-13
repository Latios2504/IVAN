using ivan_api.DTOs;

namespace ivan_api.Services
{
    public interface IScheduleService
    {
        Task<ApiResponseDTO<PagedResultDTO<ScheduleDTO>>> ListSchedulesAsync(int userId, int? coordinatorId, int? eventId, int page, int size);
        Task<ApiResponseDTO<ScheduleDTO>> GetScheduleAsync(int userId, int scheduleId);
        Task<ApiResponseDTO<ScheduleDTO>> AddScheduleAsync(int userId, ScheduleRequestDTO request);
        Task<ApiResponseDTO<ScheduleDTO>> UpdateScheduleAsync(int userId, int scheduleId, ScheduleRequestDTO request);
        Task<ApiResponseDTO<PagedResultDTO<ScheduleDTO>>> GetPersonalSchedulesAsync(int userId, int? eventId, DateTime? startDate, DateTime? endDate, int page, int size);
    }
}
