using ivan_api.DTOs.ModerationEvent;
using ivan_api.DTOs.Common;
using ivan_api.Services.ModerationEventServ;
using ivan_api.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = AuthenticationConstants.Roles.Admin)]
    public class ModerationController : ControllerBase
    {
        private readonly IModerationEventService _moderationEventService;

        public ModerationController(IModerationEventService moderationEventService)
        {
            _moderationEventService = moderationEventService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetEventsForModeration([FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _moderationEventService.GetEventsForModerationAsync(page, pageSize);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "Events for moderation retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving events for moderation",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("{eventId}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetEventDetailsForModeration(int eventId)
        {
            try
            {
                var result = await _moderationEventService.GetEventDetailsForModerationAsync(eventId);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "Event details for moderation retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving event details for moderation",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost("{eventId}/approve")]
        public async Task<ActionResult<ApiResponseDTO<object>>> ApproveEvent(int eventId)
        {
            try
            {
                await _moderationEventService.ApproveEventAsync(eventId);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "Sự kiện đã được duyệt thành công.",
                    Data = new { eventId }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while approving the event",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost("{eventId}/reject")]
        public async Task<ActionResult<ApiResponseDTO<object>>> RejectEvent(int eventId,
            [FromBody] RejectEventRequestDto request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Reason))
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Invalid input data",
                    Errors = new List<string> { "Rejection reason is required" }
                });
            }

            try
            {
                await _moderationEventService.RejectEventAsync(eventId, request.Reason);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "Sự kiện đã bị từ chối.",
                    Data = new { eventId, reason = request.Reason }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while rejecting the event",
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}
