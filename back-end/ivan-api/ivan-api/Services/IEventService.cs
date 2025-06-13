using ivan_api.DTOs;

namespace ivan_api.Services
{
    public interface IEventService
    {
        Task<ApiResponseDTO<EventDTO>> GetEventAsync(int eventId);
    }
}
