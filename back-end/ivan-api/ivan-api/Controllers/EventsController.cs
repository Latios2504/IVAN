using ivan_api.DTOs.EventManage;
using ivan_api.DTOs.Common;
using ivan_api.Services.EventServ;
using ivan_api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.Authentication;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _service;

        public EventsController(IEventService service) => _service = service;

        // Public endpoints (existing)
        [HttpGet, AllowAnonymous]
        public async Task<IActionResult> GetAll() =>
            Ok(await _service.GetAllAsync());

        [HttpGet("{id}"), AllowAnonymous]
        public async Task<IActionResult> Get(int id)
        {
            var evt = await _service.GetByIdAsync(id);
            if (evt == null) return NotFound();
            return Ok(evt);
        }

        [AllowAnonymous]
        [HttpGet("GetEvent/{eventId}")]
        public async Task<ActionResult<ApiResponseDTO<EventDTO>>> GetEvent(int eventId)
        {
            var result = await _service.GetEventAsync(eventId);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found"))
                    ? NotFound(result) : StatusCode(500, result);
            }
            return Ok(result);
        }

        // Organization-specific endpoints
        [HttpGet("organization")]
        [Authorize(Roles = "Organization")]
        public async Task<ActionResult<PagedResultDto<EventDto>>> GetOrganizationEvents(
            [FromQuery] EventFilterDto filters)
        {
            var organizationId = GetOrganizationIdFromClaims();
            var result = await _service.GetEventsByOrganizationAsync(organizationId, filters);
            return Ok(result);
        }

        [HttpGet("organization/{eventId}")]
        [Authorize(Roles = "Organization")]
        public async Task<ActionResult<EventDto>> GetOrganizationEvent(int eventId)
        {
            var organizationId = GetOrganizationIdFromClaims();
            var evt = await _service.GetEventForOrganizationAsync(eventId, organizationId);
            if (evt == null) return NotFound();
            return Ok(evt);
        }

        [HttpGet("organization/stats")]
        [Authorize(Roles = "Organization")]
        public async Task<ActionResult<EventStatsDto>> GetOrganizationStats()
        {
            var organizationId = GetOrganizationIdFromClaims();
            var stats = await _service.GetEventStatsAsync(organizationId);
            return Ok(stats);
        }

        [HttpPost]
        [Authorize(Roles = "Organization")]
        public async Task<IActionResult> Create([FromBody] CreateEventDto dto)
        {
            var organizationId = GetOrganizationIdFromClaims();
            dto.OrganizationId = organizationId; // Ensure security

            var newId = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = newId }, null);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Organization")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateEventDto dto)
        {
            var organizationId = GetOrganizationIdFromClaims();

            if (!await _service.CanUpdateEventAsync(id, organizationId))
                return Forbid("You don't have permission to update this event");

            if (!await _service.UpdateAsync(id, dto))
                return NotFound();

            return NoContent();
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Organization")]
        public async Task<IActionResult> UpdateStatus(
            int id,
            [FromBody] UpdateEventStatusDto dto)
        {
            var organizationId = GetOrganizationIdFromClaims();

            var success = await _service.UpdateEventStatusAsync(
                id, dto.StatusId, organizationId, dto.Reason);

            if (!success) return BadRequest("Cannot update event status");

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Organization")]
        public async Task<IActionResult> Delete(int id)
        {
            var organizationId = GetOrganizationIdFromClaims();

            if (!await _service.CanDeleteEventAsync(id, organizationId))
                return Forbid("You don't have permission to delete this event");

            if (!await _service.DeleteEventAsync(id, organizationId))
                return NotFound();

            return NoContent();
        }

        [HttpGet("categories")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<EventCategoryDto>>> GetCategories()
        {
            var categories = await _service.GetEventCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("statuses")]
        [Authorize(Roles = "Organization")]
        public async Task<ActionResult<IEnumerable<EventStatusDto>>> GetStatuses()
        {
            var statuses = await _service.GetEventStatusesAsync();
            return Ok(statuses);
        }

        [HttpGet("{id}/status-transitions")]
        [Authorize(Roles = "Organization")]
        public async Task<ActionResult<List<int>>> GetAvailableStatusTransitions(int id)
        {
            var transitions = await _service.GetAvailableStatusTransitionsAsync(id);
            return Ok(transitions);
        }

        [HttpGet("{id}/analytics")]
        [Authorize(Roles = "Organization")]
        public async Task<ActionResult<Dictionary<string, object>>> GetEventAnalytics(
            int id,
            [FromQuery] string timeframe = "month")
        {
            var organizationId = GetOrganizationIdFromClaims();
            var evt = await _service.GetEventForOrganizationAsync(id, organizationId);
            if (evt == null) return NotFound();

            var analytics = await _service.GetEventAnalyticsAsync(id, timeframe);
            return Ok(analytics);
        }

        private int GetOrganizationIdFromClaims()
        {
            // Extract organization ID from JWT claims
            var organizationClaim = User.FindFirst("OrganizationId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (organizationClaim == null || !int.TryParse(organizationClaim.Value, out int orgId))
            {
                // For development, return a default organization ID
                // In production, this should throw an exception
                return 1; // Default organization ID for testing
            }
            return orgId;
        }
    }
}
