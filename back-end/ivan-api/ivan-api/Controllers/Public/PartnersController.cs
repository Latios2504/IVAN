using ivan_api.DTOs;
using ivan_api.DTOs.Authentication;
using ivan_api.DTOs.Public;
using ivan_api.Services.PublicContentServ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ivan_api.Controllers.Public
{
    /// <summary>
    /// Public API for partners - accessible without authentication
    /// Returns only non-sensitive partner information
    /// </summary>
    [ApiController]
    [Route("api/public/[controller]")]
    public class PartnersController : ControllerBase
    {
        private readonly IPublicContentService _publicContentService;
        private readonly ILogger<PartnersController> _logger;

        public PartnersController(
            IPublicContentService publicContentService,
            ILogger<PartnersController> logger)
        {
            _publicContentService = publicContentService;
            _logger = logger;
        }

        /// <summary>
        /// Get all public partners with filtering and pagination
        /// </summary>
        /// <param name="search">Search term for company name or description</param>
        /// <param name="industryId">Filter by industry</param>
        /// <param name="province">Filter by province</param>
        /// <param name="isVerified">Filter by verification status</param>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="size">Page size (default: 20)</param>
        /// <returns>Paginated list of public partner data</returns>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDTO<PublicPartnerDTO>>>> GetPublicPartners(
            [FromQuery] string? search,
            [FromQuery] int? industryId,
            [FromQuery] string? province,
            [FromQuery] bool? isVerified,
            [FromQuery] int page = 1,
            [FromQuery] int size = 20)
        {
            try
            {
                var filters = new PublicPartnerFiltersDTO
                {
                    Search = search,
                    IndustryId = industryId,
                    Province = province,
                    IsVerified = isVerified,
                    Page = page,
                    Size = size
                };

                var result = await _publicContentService.GetPublicPartnersAsync(filters);
                
                return Ok(new ApiResponseDTO<PagedResultDTO<PublicPartnerDTO>>
                {
                    Success = true,
                    Data = result,
                    Message = "Partners retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving public partners");
                return StatusCode(500, new ApiResponseDTO<PagedResultDTO<PublicPartnerDTO>>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve partners" }
                });
            }
        }

        /// <summary>
        /// Get a specific partner's public information
        /// </summary>
        /// <param name="id">Partner ID</param>
        /// <returns>Public partner data</returns>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<PublicPartnerDTO>>> GetPublicPartner(int id)
        {
            try
            {
                var partner = await _publicContentService.GetPublicPartnerAsync(id);
                
                if (partner == null)
                {
                    return NotFound(new ApiResponseDTO<PublicPartnerDTO>
                    {
                        Success = false,
                        Message = "Partner not found",
                        Errors = new List<string> { $"Partner with ID {id} does not exist or is not active" }
                    });
                }

                return Ok(new ApiResponseDTO<PublicPartnerDTO>
                {
                    Success = true,
                    Data = partner,
                    Message = "Partner retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving public partner with ID {PartnerId}", id);
                return StatusCode(500, new ApiResponseDTO<PublicPartnerDTO>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve partner" }
                });
            }
        }
    }
}
