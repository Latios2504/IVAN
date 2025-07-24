using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs;
using ivan_api.DTOs.Public;
using ivan_api.DTOs.Authentication;
using ivan_api.DTOs.Common;
using ivan_api.Services.PublicContentServ;

namespace ivan_api.Controllers.Public
{
    /// <summary>
    /// Public API controller for volunteer-related operations
    /// Provides endpoints for browsing volunteers without authentication
    /// </summary>
    [ApiController]
    [Route("api/public/[controller]")]
    public class VolunteersController : ControllerBase
    {
        private readonly IPublicContentService _publicContentService;
        private readonly ILogger<VolunteersController> _logger;

        public VolunteersController(
            IPublicContentService publicContentService,
            ILogger<VolunteersController> logger)
        {
            _publicContentService = publicContentService;
            _logger = logger;
        }

        /// <summary>
        /// Get paginated list of public volunteers with optional filtering
        /// </summary>
        /// <param name="search">Search term for volunteer name, bio, university, or major</param>
        /// <param name="skillId">Filter by specific skill ID</param>
        /// <param name="university">Filter by university name</param>
        /// <param name="province">Filter by province</param>
        /// <param name="isVerified">Filter by verification status</param>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="size">Page size (default: 12, max: 50)</param>
        /// <returns>Paginated list of public volunteers</returns>
        [HttpGet]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDto<PublicVolunteerDTO>>>> GetPublicVolunteers(
            [FromQuery] string? search = null,
            [FromQuery] int? skillId = null,
            [FromQuery] string? university = null,
            [FromQuery] string? province = null,
            [FromQuery] bool? isVerified = null,
            [FromQuery] int page = 1,
            [FromQuery] int size = 12)
        {
            try
            {
                // Validate pagination parameters
                if (page < 1) page = 1;
                if (size < 1) size = 12;
                if (size > 50) size = 50; // Limit maximum page size

                var filters = new PublicVolunteerFiltersDTO
                {
                    Search = search,
                    SkillId = skillId,
                    University = university,
                    Province = province,
                    IsVerified = isVerified,
                    Page = page,
                    Size = size
                };

                var result = await _publicContentService.GetPublicVolunteersAsync(filters);

                _logger.LogInformation("Retrieved volunteers for page {Page}", page);

                return Ok(new ApiResponseDTO<PagedResultDto<PublicVolunteerDTO>>
                {
                    Success = true,
                    Message = "Volunteers retrieved successfully",
                    Data = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving public volunteers");

                return StatusCode(500, new ApiResponseDTO<PagedResultDto<PublicVolunteerDTO>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving volunteers",
                    Data = null
                });
            }
        }

        /// <summary>
        /// Get detailed information about a specific volunteer
        /// </summary>
        /// <param name="id">Volunteer ID</param>
        /// <returns>Detailed volunteer information</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponseDTO<PublicVolunteerDTO>>> GetPublicVolunteer(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new ApiResponseDTO<PublicVolunteerDTO>
                    {
                        Success = false,
                        Message = "Invalid volunteer ID",
                        Data = null
                    });
                }

                var volunteer = await _publicContentService.GetPublicVolunteerAsync(id);

                if (volunteer == null)
                {
                    return NotFound(new ApiResponseDTO<PublicVolunteerDTO>
                    {
                        Success = false,
                        Message = "Volunteer not found",
                        Data = null
                    });
                }

                _logger.LogInformation("Retrieved volunteer details for ID: {VolunteerId}", id);

                return Ok(new ApiResponseDTO<PublicVolunteerDTO>
                {
                    Success = true,
                    Message = "Volunteer retrieved successfully",
                    Data = volunteer
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving volunteer with ID: {VolunteerId}", id);

                return StatusCode(500, new ApiResponseDTO<PublicVolunteerDTO>
                {
                    Success = false,
                    Message = "An error occurred while retrieving the volunteer",
                    Data = null
                });
            }
        }
    }
}