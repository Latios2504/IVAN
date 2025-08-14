using ivan_api.Constants;
using ivan_api.DTOs.EventManage;
using ivan_api.DTOs.Common;
using ivan_api.Services.EventServ;
using ivan_api.Services.AuthenticationSer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;
        private readonly IAuthenticationService _authenticationService;
        private readonly ILogger<EventsController> _logger;

        public EventsController(
            IEventService eventService,
            IAuthenticationService authenticationService,
            ILogger<EventsController> logger)
        {
            _eventService = eventService;
            _authenticationService = authenticationService;
            _logger = logger;
        }

        // Get events list (public + filtered for organizations)
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDto<EventDto>>>> GetEvents(
            [FromQuery] EventFilterDto filters)
        {
            try
            {
                // If user is authenticated and has organization role, they can see their own events
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userRole == "Organization" && int.TryParse(userIdClaim, out int userId))
                {
                    // Get the user's organization ID from their profile
                    var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);
                    
                    // Organization can optionally filter by their own events
                    if (filters.OrganizationId == null && userInfo.OrganizationId.HasValue)
                    {
                        // If no organization filter specified, show public events + their own
                        // Let them see public events by default, they can filter by OrganizationId if needed
                    }
                }
                else
                {
                    // Public users can only see active, published events
                    filters.IsActive = true;
                    filters.OrganizationId = null; // Prevent filtering by organization for public
                }

                var result = await _eventService.GetEventsAsync(filters);
                
                return Ok(new ApiResponseDTO<PagedResultDto<EventDto>>
                {
                    Success = true,
                    Data = result,
                    Message = "Events retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving events");
                return StatusCode(500, new ApiResponseDTO<PagedResultDto<EventDto>>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve events" }
                });
            }
        }

        // Get specific event details
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<EventDto>>> GetEvent(int id)
        {
            try
            {
                var eventData = await _eventService.GetEventAsync(id);
                
                if (eventData == null)
                {
                    return NotFound(new ApiResponseDTO<EventDto>
                    {
                        Success = false,
                        Message = "Event not found",
                        Errors = new List<string> { $"Event with ID {id} does not exist" }
                    });
                }

                return Ok(new ApiResponseDTO<EventDto>
                {
                    Success = true,
                    Data = eventData,
                    Message = "Event retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving event with ID {EventId}", id);
                return StatusCode(500, new ApiResponseDTO<EventDto>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve event" }
                });
            }
        }

        // Create new event (Organizations only)
        [HttpPost]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<object>>> CreateEvent([FromBody] CreateEventDto dto)
        {
            try
            {
                var organizationId = GetOrganizationIdFromClaims();
                dto.OrganizationId = organizationId; // Ensure security

                var newId = await _eventService.CreateAsync(dto);
                
                return CreatedAtAction(nameof(GetEvent), new { id = newId }, 
                    new ApiResponseDTO<object>
                    {
                        Success = true,
                        Data = new { EventId = newId },
                        Message = "Event created successfully"
                    });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating event");
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to create event",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        // Update event (Organizations only)
        [HttpPut("{id}")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<object>>> UpdateEvent(int id, [FromBody] UpdateEventDto dto)
        {
            try
            {
                var success = await _eventService.UpdateAsync(id, dto);
                
                if (!success)
                {
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Event not found or you don't have permission to update it"
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "Event updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating event {EventId}", id);
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to update event",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        // Delete event (Organizations only)
        [HttpDelete("{id}")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<object>>> DeleteEvent(int id)
        {
            try
            {
                var organizationId = GetOrganizationIdFromClaims();
                var success = await _eventService.DeleteAsync(id, organizationId);

                if (!success)
                {
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Event not found or you don't have permission to delete it"
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "Event deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting event {EventId}", id);
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to delete event",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        // Get event categories (public reference data)
        [HttpGet("categories")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<IEnumerable<EventCategoryDto>>>> GetCategories()
        {
            try
            {
                var categories = await _eventService.GetCategoriesAsync();
                return Ok(new ApiResponseDTO<IEnumerable<EventCategoryDto>>
                {
                    Success = true,
                    Data = categories,
                    Message = "Categories retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving categories");
                return StatusCode(500, new ApiResponseDTO<IEnumerable<EventCategoryDto>>
                {
                    Success = false,
                    Message = "Failed to retrieve categories",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        // Get event statuses (for organizations)
        [HttpGet("statuses")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<IEnumerable<EventStatusDto>>>> GetStatuses()
        {
            try
            {
                var statuses = await _eventService.GetStatusesAsync();
                return Ok(new ApiResponseDTO<IEnumerable<EventStatusDto>>
                {
                    Success = true,
                    Data = statuses,
                    Message = "Statuses retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving statuses");
                return StatusCode(500, new ApiResponseDTO<IEnumerable<EventStatusDto>>
                {
                    Success = false,
                    Message = "Failed to retrieve statuses",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        private int GetOrganizationIdFromClaims()
        {
            var organizationClaim = User.FindFirst("OrganizationId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (organizationClaim == null || !int.TryParse(organizationClaim.Value, out int orgId))
            {
                return 1; // Default organization ID for testing
            }
            return orgId;
        }
    }
}
