using ivan_api.DTOs.ModerationEvent;
using ivan_api.Services.ModerationEventServ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModerationController : ControllerBase
    {
        private readonly IModerationEventService _moderationEventService;

        public ModerationController(IModerationEventService moderationEventService)
        {
            _moderationEventService = moderationEventService;
        }

        [HttpGet]
        //[Authorize(Roles = "Admin, Moderator")]
        public async Task<IActionResult> GetEventsForModeration([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _moderationEventService.GetEventsForModerationAsync(page, pageSize);
            return Ok(result);
        }

        [HttpGet("{eventId}")]
        //[Authorize(Roles = "Admin, Moderator")]
        public async Task<IActionResult> GetEventDetailsForModeration(int eventId)
        {
            var result = await _moderationEventService.GetEventDetailsForModerationAsync(eventId);
            return Ok(result);
        }

        [HttpPost("{eventId}/approve")]
        //[Authorize(Roles = "Admin, Moderator")]
        public async Task<IActionResult> ApproveEvent(int eventId)
        {
            await _moderationEventService.ApproveEventAsync(eventId);
            return Ok(new { message = "Sự kiện đã được duyệt thành công." });
        }

        [HttpPost("{eventId}/reject")]
        //[Authorize(Roles = "Admin, Moderator")]
        public async Task<IActionResult> RejectEvent(int eventId, [FromBody] RejectEventRequestDto request)
        {
            await _moderationEventService.RejectEventAsync(eventId, request.Reason);
            return Ok(new { message = "Sự kiện đã bị từ chối." });
        }

    }
}
