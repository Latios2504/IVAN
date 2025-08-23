using ivan_api.DTOs.EventManage;
using ivan_api.DTOs.Common;
using ivan_api.Models;

namespace ivan_api.Services.EventServ
{
    public interface IEventService
    {
        // Core CRUD methods
        Task<int> CreateAsync(CreateEventDto dto);
        Task<int> CreateEventFromSupportRequestAsync(CreateEventFromSupportRequestDto dto, int organizationId);
        Task<bool> UpdateAsync(int id, UpdateEventDto dto);
        Task<bool> DeleteAsync(int id, int organizationId);

        // Unified list method (for both public and organization)
        Task<PagedResultDto<EventDto>> GetEventsAsync(EventFilterDto filters);
        
        // Unified detail method (for both public and organization)
        Task<EventDto?> GetEventAsync(int id);

        // Lookup data methods
        Task<IEnumerable<EventCategoryDto>> GetCategoriesAsync();
        Task<IEnumerable<EventStatusDto>> GetStatusesAsync();

        // Status management
        Task UpdateEventStatusAsync(int eventId, string status, int organizationId);

        Task<Event> GetEventNotDTO(int eventID);
    }
}
