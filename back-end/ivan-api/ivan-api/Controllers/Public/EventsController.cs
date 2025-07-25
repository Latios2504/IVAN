using ivan_api.DTOs;
using ivan_api.DTOs.Authentication;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.Public;
using ivan_api.Services.PublicContentServ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ivan_api.Controllers.Public
{
    /// <summary>
    /// Public API for events - accessible without authentication
    /// Returns only non-sensitive event information
    /// </summary>
    [ApiController]
    [Route("api/public/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IPublicContentService _publicContentService;
        private readonly ILogger<EventsController> _logger;

        public EventsController(
            IPublicContentService publicContentService,
            ILogger<EventsController> logger)
        {
            _publicContentService = publicContentService;
            _logger = logger;
        }

        /// <summary>
        /// Get all public events with filtering and pagination
        /// </summary>
        /// <param name="search">Search term for event name or description</param>
        /// <param name="categoryId">Filter by event category</param>
        /// <param name="organizationId">Filter by organization</param>
        /// <param name="province">Filter by province</param>
        /// <param name="startDate">Filter events starting from this date</param>
        /// <param name="endDate">Filter events ending before this date</param>
        /// <param name="isFeatured">Filter by featured events</param>
        /// <param name="isUrgent">Filter by urgent events</param>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="size">Page size (default: 20)</param>
        /// <returns>Paginated list of public event data</returns>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDto<PublicEventDTO>>>> GetPublicEvents(
            [FromQuery] string? search,
            [FromQuery] int? categoryId,
            [FromQuery] int? organizationId,
            [FromQuery] string? province,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate,
            [FromQuery] bool? isFeatured,
            [FromQuery] bool? isUrgent,
            [FromQuery] int page = 1,
            [FromQuery] int size = 20)
        {
            try
            {
                var filters = new PublicEventFiltersDTO
                {
                    Search = search,
                    CategoryId = categoryId,
                    OrganizationId = organizationId,
                    Province = province,
                    StartDate = startDate,
                    EndDate = endDate,
                    IsFeatured = isFeatured,
                    IsUrgent = isUrgent,
                    Page = page,
                    Size = size
                };

                var result = await _publicContentService.GetPublicEventsAsync(filters);
                
                return Ok(new ApiResponseDTO<PagedResultDto<PublicEventDTO>>
                {
                    Success = true,
                    Data = result,
                    Message = "Events retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving public events");
                return StatusCode(500, new ApiResponseDTO<PagedResultDto<PublicEventDTO>>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve events" }
                });
            }
        }

        /// <summary>
        /// Get a specific event's public information
        /// </summary>
        /// <param name="id">Event ID</param>
        /// <returns>Public event data</returns>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<PublicEventDTO>>> GetPublicEvent(int id)
        {
            try
            {
                var eventData = await _publicContentService.GetPublicEventAsync(id);
                
                if (eventData == null)
                {
                    return NotFound(new ApiResponseDTO<PublicEventDTO>
                    {
                        Success = false,
                        Message = "Event not found",
                        Errors = new List<string> { $"Event with ID {id} does not exist or is not active" }
                    });
                }

                return Ok(new ApiResponseDTO<PublicEventDTO>
                {
                    Success = true,
                    Data = eventData,
                    Message = "Event retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving public event with ID {EventId}", id);
                return StatusCode(500, new ApiResponseDTO<PublicEventDTO>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve event" }
                });
            }
        }
    }
}
