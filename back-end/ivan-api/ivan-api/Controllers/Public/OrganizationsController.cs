using ivan_api.DTOs;
using ivan_api.DTOs.Authentication;
using ivan_api.DTOs.Public;
using ivan_api.Services.PublicContentServ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ivan_api.Controllers.Public
{
    /// <summary>
    /// Public API for organizations - accessible without authentication
    /// Returns only non-sensitive organization information
    /// </summary>
    [ApiController]
    [Route("api/public/[controller]")]
    public class OrganizationsController : ControllerBase
    {
        private readonly IPublicContentService _publicContentService;
        private readonly ILogger<OrganizationsController> _logger;

        public OrganizationsController(
            IPublicContentService publicContentService,
            ILogger<OrganizationsController> logger)
        {
            _publicContentService = publicContentService;
            _logger = logger;
        }

        /// <summary>
        /// Get all public organizations with filtering and pagination
        /// </summary>
        /// <param name="search">Search term for organization name</param>
        /// <param name="typeId">Filter by organization type</param>
        /// <param name="province">Filter by province</param>
        /// <param name="isVerified">Filter by verification status</param>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="size">Page size (default: 20)</param>
        /// <returns>Paginated list of public organization data</returns>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDTO<PublicOrganizationDTO>>>> GetPublicOrganizations(
            [FromQuery] string? search,
            [FromQuery] int? typeId,
            [FromQuery] string? province,
            [FromQuery] bool? isVerified,
            [FromQuery] int page = 1,
            [FromQuery] int size = 20)
        {
            try
            {
                var filters = new PublicOrganizationFiltersDTO
                {
                    Search = search,
                    TypeId = typeId,
                    Province = province,
                    IsVerified = isVerified,
                    Page = page,
                    Size = size
                };

                var result = await _publicContentService.GetPublicOrganizationsAsync(filters);
                
                return Ok(new ApiResponseDTO<PagedResultDTO<PublicOrganizationDTO>>
                {
                    Success = true,
                    Data = result,
                    Message = "Organizations retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving public organizations");
                return StatusCode(500, new ApiResponseDTO<PagedResultDTO<PublicOrganizationDTO>>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve organizations" }
                });
            }
        }

        /// <summary>
        /// Get a specific organization's public information
        /// </summary>
        /// <param name="id">Organization ID</param>
        /// <returns>Public organization data</returns>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<PublicOrganizationDTO>>> GetPublicOrganization(int id)
        {
            try
            {
                var organization = await _publicContentService.GetPublicOrganizationAsync(id);
                
                if (organization == null)
                {
                    return NotFound(new ApiResponseDTO<PublicOrganizationDTO>
                    {
                        Success = false,
                        Message = "Organization not found",
                        Errors = new List<string> { $"Organization with ID {id} does not exist or is not active" }
                    });
                }

                return Ok(new ApiResponseDTO<PublicOrganizationDTO>
                {
                    Success = true,
                    Data = organization,
                    Message = "Organization retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving public organization with ID {OrganizationId}", id);
                return StatusCode(500, new ApiResponseDTO<PublicOrganizationDTO>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve organization" }
                });
            }
        }
    }
}
