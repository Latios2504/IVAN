using ivan_api.Services.PartnerProfiles;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ivan_api.DTOs.PartnerProfiles;
using ivan_api.DTOs.Common;
using ivan_api.DTOs;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartnerProfileController : ControllerBase
    {
        private readonly IPartnerProfileService _service;
        private readonly ILogger<PartnerProfileController> _logger;

        public PartnerProfileController(
            IPartnerProfileService service,
            ILogger<PartnerProfileController> logger)
        {
            _service = service;
            _logger = logger;
        }

        #region Public Endpoints

        // Get all public partners with filtering and pagination
        [HttpGet("public")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDto<PublicPartnerDTO>>>> GetPublicPartners(
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

                var result = await _service.GetPublicPartnersAsync(filters);
                
                return Ok(new ApiResponseDTO<PagedResultDto<PublicPartnerDTO>>
                {
                    Success = true,
                    Data = result,
                    Message = "Partners retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving public partners");
                return StatusCode(500, new ApiResponseDTO<PagedResultDto<PublicPartnerDTO>>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve partners" }
                });
            }
        }

        // Get specific partner's public information
        [HttpGet("public/{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<PublicPartnerDTO>>> GetPublicPartner(int id)
        {
            try
            {
                var partner = await _service.GetPublicPartnerAsync(id);
                
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

        // Get all partner industries
        [HttpGet("public/partner-industries")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<List<PartnerIndustryDto>>>> GetPartnerIndustries()
        {
            try
            {
                var industries = await _service.GetAllPartnerIndustriesAsync();

                return Ok(new ApiResponseDTO<List<PartnerIndustryDto>>
                {
                    Success = true,
                    Data = industries.ToList(),
                    Message = "Partner industries retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving partner industries");
                return StatusCode(500, new ApiResponseDTO<List<PartnerIndustryDto>>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve partner industries" }
                });
            }
        }

        #endregion

        #region Partner Management Endpoints

        // Get partner profiles list (Admin only)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _service.GetList(pageNumber, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Get partner profile by user ID
        [HttpGet("get/{userId}")]
        [Authorize(Roles = "Partner,Admin")]
        public async Task<IActionResult> Details(int userId)
        {
            try
            {
                // Check authorization for own profile access
                if (User.IsInRole("Partner"))
                {
                    var currentUserId = GetUserIdFromClaims();
                    if (currentUserId != userId)
                    {
                        return Forbid("You can only access your own partner profile");
                    }
                }

                var result = await _service.GetPartnerProfileById(userId);
                return Ok(result);
            }
            catch(Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // Create new partner profile (Admin only)
        [HttpPost("add")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Add([FromBody] PartnerProfileCreateDto input)
        {
            if (input == null)
            {
                input = new PartnerProfileCreateDto();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _service.AddPartnerProfile(input);

                if (!result)
                {
                    return BadRequest("Failed to add partner profile");
                }

                var listDto = await _service.GetList(1, 100);

                var list = listDto.Items.ToList();

                var postAdd = await _service.GetPartnerProfileById(list.Last().PartnerId);

                return Ok(postAdd);
            }
            catch(Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Update partner profile
        [HttpPut("update/{id}")]
        [Authorize(Roles = "Partner,Admin")]
        public async Task<IActionResult> Update([FromBody] PartnerProfileUpdateDto input, int id)
        {
            if (input == null)
            {
                input = new PartnerProfileUpdateDto();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Check authorization for own profile updates
                if (User.IsInRole("Partner"))
                {
                    var currentUserId = GetUserIdFromClaims();
                    if (currentUserId != id)
                    {
                        return Forbid("You can only update your own partner profile");
                    }
                }

                var result = await _service.UpdatePartnerProfile(input, id);

                var postUpate = await _service.GetPartnerProfileById(id);

                if (!result)
                {
                    return BadRequest(postUpate);
                }

                return Ok(postUpate);
            }
            catch(Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // Get partner profile completion percentage and missing fields
        [HttpGet("{userId}/completion")]
        [Authorize(Roles = "Partner,Admin")]
        public async Task<ActionResult<ProfileCompletionDto>> GetProfileCompletion(int userId)
        {
            try
            {
                // Check authorization for own profile completion access
                if (User.IsInRole("Partner"))
                {
                    var currentUserId = GetUserIdFromClaims();
                    if (currentUserId != userId)
                    {
                        return Forbid("You can only access your own partner profile completion");
                    }
                }

                var profile = await _service.GetPartnerProfileById(userId);
                if (profile == null)
                    return NotFound(new { message = $"Partner profile for UserId={userId} not found." });

                var completion = CalculatePartnerProfileCompletion(profile);
                return Ok(completion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error calculating profile completion", error = ex.Message });
            }
        }

        #endregion

        #region Private Helper Methods

        private int GetUserIdFromClaims()
        {
            var userIdClaim = User.FindFirst("UserId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                throw new UnauthorizedAccessException("User ID not found in token claims");
            }
            return userId;
        }

        private ProfileCompletionDto CalculatePartnerProfileCompletion(PartnerProfileViewModel profile)
        {
            var totalFields = 10;
            var completedFields = 0;
            var missingFields = new List<string>();

            // Check required fields
            if (!string.IsNullOrEmpty(profile.CompanyName)) completedFields++; else missingFields.Add("Company Name");
            if (profile.IndustryId > 0) completedFields++; else missingFields.Add("Industry");
            if (!string.IsNullOrEmpty(profile.Description)) completedFields++; else missingFields.Add("Description");
            if (!string.IsNullOrEmpty(profile.Address)) completedFields++; else missingFields.Add("Address");
            if (!string.IsNullOrEmpty(profile.Province)) completedFields++; else missingFields.Add("Province");
            if (!string.IsNullOrEmpty(profile.ContactPersonName)) completedFields++; else missingFields.Add("Contact Person Name");
            if (!string.IsNullOrEmpty(profile.ContactEmail)) completedFields++; else missingFields.Add("Contact Email");
            if (!string.IsNullOrEmpty(profile.ContactPhone)) completedFields++; else missingFields.Add("Contact Phone");
            if (!string.IsNullOrEmpty(profile.Website)) completedFields++; else missingFields.Add("Website");
            if (!string.IsNullOrEmpty(profile.TaxCode)) completedFields++; else missingFields.Add("Tax Code");

            var completionPercentage = (int)Math.Round((double)completedFields / totalFields * 100);

            return new ProfileCompletionDto
            {
                CompletionPercentage = completionPercentage,
                MissingFields = missingFields
            };
        }

        #endregion

    }
}
