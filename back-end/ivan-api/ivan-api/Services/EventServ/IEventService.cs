using ivan_api.DTOs;
using ivan_api.DTOs.Authentication;
using ivan_api.DTOs.EventManage;

namespace ivan_api.Services.EventServ
{
    public interface IEventService
    {
        Task<IEnumerable<EventDto>> GetAllAsync();
        Task<EventDto?> GetByIdAsync(int id);
        Task<int> CreateAsync(CreateEventDto dto);
        Task<bool> UpdateAsync(int id, UpdateEventDto dto);
        Task<ApiResponseDTO<EventDTO>> GetEventAsync(int eventId);
    }
}
