using ivan_api.DTOs.ModerationEvent;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.ModerationEventServ
{
    public interface IModerationEventService
    {
        Task<PagedResultDto<ModerationEventListDto>> GetEventsForModerationAsync(int pageNumber, int pageSize);
        Task<ModerationEventDetailDto> GetEventDetailsForModerationAsync(int eventId);
        Task ApproveEventAsync(int eventId);
        Task RejectEventAsync(int eventId, string reason);
    }
}
