using ivan_api.DTOs;
using ivan_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;
        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }
        [HttpGet("{eventId}")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<EventDTO>>> GetEvent(int eventId)
        {
            var result = await _eventService.GetEventAsync(eventId);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) : StatusCode(500, result);
            }
            return Ok(result);
        }
    }
}
