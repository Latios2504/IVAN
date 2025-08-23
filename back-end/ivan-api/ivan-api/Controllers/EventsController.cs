using ivan_api.Constants;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.EventManage;
using ivan_api.DTOs.ModerationEvent;
using ivan_api.Services.AuthenticationSer;
using ivan_api.Services.EventServ;
using ivan_api.Services.ModerationEventServ;
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
        private readonly IModerationEventService _moderationEventService;
        private readonly IAuthenticationService _authenticationService;
        private readonly ILogger<EventsController> _logger;

        public EventsController(
            IEventService eventService,
            IAuthenticationService authenticationService,
            ILogger<EventsController> logger, IModerationEventService modetationService)
        {
            _eventService = eventService;
            _authenticationService = authenticationService;
            _logger = logger;
            _moderationEventService = modetationService;
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

        // Create event from support request (Organizations only)
        [HttpPost("from-support-request")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<object>>> CreateEventFromSupportRequest([FromBody] CreateEventFromSupportRequestDto dto)
        {
            try
            {
                var organizationId = await GetOrganizationIdFromClaimsAsync();
                
                var newId = await _eventService.CreateEventFromSupportRequestAsync(dto, organizationId);
                
                return CreatedAtAction(nameof(GetEvent), new { id = newId }, 
                    new ApiResponseDTO<object>
                    {
                        Success = true,
                        Data = new { EventId = newId },
                        Message = "Event created from support request successfully"
                    });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized access when creating event from support request");
                return Unauthorized(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message,
                    Errors = new List<string> { "Authorization failed" }
                });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid support request when creating event");
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message,
                    Errors = new List<string> { "Invalid support request" }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating event from support request");
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to create event from support request",
                    Errors = new List<string> { ex.Message }
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
                var organizationId = await GetOrganizationIdFromClaimsAsync();
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
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized access when creating event");
                return Unauthorized(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message,
                    Errors = new List<string> { "Authorization failed" }
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
                var organizationId = await GetOrganizationIdFromClaimsAsync();
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
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized access when deleting event {EventId}", id);
                return Unauthorized(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message,
                    Errors = new List<string> { "Authorization failed" }
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

        private async Task<int> GetOrganizationIdFromClaimsAsync()
        {
            try
            {
                // Get user ID from claims
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    throw new UnauthorizedAccessException("Invalid user ID in token");
                }

                // Get user info with profile data from authentication service
                var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);
                
                if (!userInfo.OrganizationId.HasValue)
                {
                    throw new UnauthorizedAccessException("User is not associated with any organization");
                }

                return userInfo.OrganizationId.Value;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting organization ID from claims for user");
                throw new UnauthorizedAccessException("Failed to retrieve organization information");
            }
        }

        [HttpPost("{eventId}/approve")]
        [Authorize(Roles = AuthenticationConstants.Roles.Admin)]
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
        [Authorize(Roles = AuthenticationConstants.Roles.Admin)]
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

        // Manual status update endpoint for Organizations
        [HttpPut("{eventId}/status")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<object>>> UpdateEventStatus(int eventId, [FromBody] UpdateEventStatusDto request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Status))
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Invalid input data",
                    Errors = new List<string> { "Status is required" }
                });
            }

            try
            {
                // Get organization ID from claims
                var organizationId = await GetOrganizationIdFromClaimsAsync();
                if (organizationId == null)
                {
                    return Unauthorized(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Organization not found"
                    });
                }

                // Validate status transition (Published -> Ongoing/Cancelled, Ongoing -> Completed/Cancelled)
                var validStatuses = new[] { "Published", "Ongoing", "Completed", "Cancelled" };
                if (!validStatuses.Contains(request.Status))
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Invalid status. Valid statuses are: Published, Ongoing, Completed, Cancelled"
                    });
                }

                await _eventService.UpdateEventStatusAsync(eventId, request.Status, organizationId);
                
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = $"Event status updated to {request.Status} successfully.",
                    Data = new { eventId, status = request.Status }
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while updating event status",
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}
