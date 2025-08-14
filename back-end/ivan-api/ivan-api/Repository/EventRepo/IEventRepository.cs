using ivan_api.Models;
using ivan_api.DTOs.EventManage;
using ivan_api.DTOs.Common;

namespace ivan_api.Repository.EventRepo
{
    public interface IEventRepository
    {
        Task<bool> AddAsync(Event evt);
        Task<bool> UpdateAsync(Event evt);
        Task<bool> DeleteAsync(int eventId, int organizationId);
        Task<Event?> GetByIdAsync(int id);
        
        // Unified list method with optional organization filter
        Task<PagedResultDto<EventDto>> GetEventsAsync(EventFilterDto filters);
        
        // Lookup methods
        Task<IEnumerable<EventCategory>> GetCategoriesAsync();
        Task<IEnumerable<EventStatus>> GetStatusesAsync();
    }
}
