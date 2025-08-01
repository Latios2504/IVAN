using ivan_api.DTOs;
using ivan_api.DTOs.Authentication;
using ivan_api.DTOs.EventManage;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.EventServ
{
    public interface IEventService
    {
        // Existing methods
        Task<IEnumerable<EventDto>> GetAllAsync();
        Task<EventDto?> GetByIdAsync(int id);
        Task<int> CreateAsync(CreateEventDto dto);
        Task<bool> UpdateAsync(int id, UpdateEventDto dto);
        Task<ApiResponseDTO<EventDTO>> GetEventAsync(int eventId);

        // Enhanced methods for organizations
        Task<PagedResultDto<EventDto>> GetEventsByOrganizationAsync(
            int organizationId,
            EventFilterDto filters);

        Task<EventStatsDto> GetEventStatsAsync(int organizationId);

        Task<bool> UpdateEventStatusAsync(
            int eventId,
            int statusId,
            int organizationId,
            string? reason = null);

        Task<bool> DeleteEventAsync(int eventId, int organizationId);

        Task<EventDto?> GetEventForOrganizationAsync(int eventId, int organizationId);

        // Lookup data methods
        Task<IEnumerable<EventCategoryDto>> GetEventCategoriesAsync();
        Task<IEnumerable<EventStatusDto>> GetEventStatusesAsync();

        // Validation methods
        Task<bool> CanUpdateEventAsync(int eventId, int organizationId);
        Task<bool> CanDeleteEventAsync(int eventId, int organizationId);
        Task<List<int>> GetAvailableStatusTransitionsAsync(int eventId);

        // Analytics methods
        Task<Dictionary<string, object>> GetEventAnalyticsAsync(
            int eventId,
            string timeframe);
    }
}
