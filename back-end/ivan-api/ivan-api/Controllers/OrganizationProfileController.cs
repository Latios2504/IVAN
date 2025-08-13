using ivan_api.Services.OrganizationProfiles;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ivan_api.DTOs.OrganizationProfiles;
using ivan_api.DTOs;
using ivan_api.DTOs.Common;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizationProfileController : ControllerBase
    {
        private readonly IOrganizationProfileService _service;
        private readonly ILogger<OrganizationProfileController> _logger;

        public OrganizationProfileController(
            IOrganizationProfileService service,
            ILogger<OrganizationProfileController> logger)
        {
            _service = service;
            _logger = logger;
        }

        #region Public Endpoints

        // Get all public organizations with filtering and pagination
        [HttpGet("public")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDto<PublicOrganizationDTO>>>> GetPublicOrganizations(
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

                var result = await _service.GetPublicOrganizationsAsync(filters);
                
                return Ok(new ApiResponseDTO<PagedResultDto<PublicOrganizationDTO>>
                {
                    Success = true,
                    Data = result,
                    Message = "Organizations retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving public organizations");
                return StatusCode(500, new ApiResponseDTO<PagedResultDto<PublicOrganizationDTO>>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve organizations" }
                });
            }
        }

        // Get specific organization's public information
        [HttpGet("public/{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<PublicOrganizationDTO>>> GetPublicOrganization(int id)
        {
            try
            {
                var organization = await _service.GetPublicOrganizationAsync(id);
                
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

        // Get all organization types
        [HttpGet("public/organization-types")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<List<OrganizationTypeDto>>>> GetOrganizationTypes()
        {
            try
            {
                var organizationTypes = await _service.GetAllOrganizationTypesAsync();

                return Ok(new ApiResponseDTO<List<OrganizationTypeDto>>
                {
                    Success = true,
                    Data = organizationTypes.ToList(),
                    Message = "Organization types retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving organization types");
                return StatusCode(500, new ApiResponseDTO<List<OrganizationTypeDto>>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve organization types" }
                });
            }
        }

        #endregion

        #region Organization Management Endpoints

        // Get organization profiles list (Admin only)
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

        // Get organization profile by user ID
        [HttpGet("get/{userId}")]
        [Authorize(Roles = "Organization,Admin")]
        public async Task<IActionResult> Details(int userId)
        {
            try
            {
                // Check authorization for own profile access
                if (User.IsInRole("Organization"))
                {
                    var currentUserId = GetUserIdFromClaims();
                    if (currentUserId != userId)
                    {
                        return Forbid("You can only access your own organization profile");
                    }
                }

                var result = await _service.GetOrganizationProfileById(userId);
                return Ok(result);
            }
            catch(Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // Create new organization profile (Admin only)
        [HttpPost("add")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Add([FromBody] OrganizationProfileCreateDto input)
        {
            if (input == null)
            {
                input = new OrganizationProfileCreateDto();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _service.AddOrganizationProfile(input);

                if (!result)
                {
                    return BadRequest("Failed to add organization profile");
                }

                var listDto = await _service.GetList(1, 100);

                var list = listDto.Items.ToList();

                var postAdd = await _service.GetOrganizationProfileById(list.Last().OrganizationId);

                return Ok(postAdd);
            }
            catch(Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Update organization profile
        [HttpPut("update/{id}")]
        [Authorize(Roles = "Organization,Admin")]
        public async Task<IActionResult> Update([FromBody] OrganizationProfileUpdateDto input, int id)
        {
            if (input == null)
            {
                input = new OrganizationProfileUpdateDto();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Check authorization for own profile updates
                if (User.IsInRole("Organization"))
                {
                    var currentUserId = GetUserIdFromClaims();
                    if (currentUserId != id)
                    {
                        return Forbid("You can only update your own organization profile");
                    }
                }

                var result = await _service.UpdateOrganizationProfile(input, id);

                var postUpate = await _service.GetOrganizationProfileById(id);

                if (!result)
                {
                    return BadRequest(postUpate);
                }

                return Ok(postUpate);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Get organization profile completion percentage and missing fields
        [HttpGet("{userId}/completion")]
        [Authorize(Roles = "Organization,Admin")]
        public async Task<ActionResult<ProfileCompletionDto>> GetProfileCompletion(int userId)
        {
            try
            {
                // Check authorization for own profile completion access
                if (User.IsInRole("Organization"))
                {
                    var currentUserId = GetUserIdFromClaims();
                    if (currentUserId != userId)
                    {
                        return Forbid("You can only access your own organization profile completion");
                    }
                }

                var profile = await _service.GetOrganizationProfileById(userId);
                if (profile == null)
                    return NotFound(new { message = $"Organization profile for UserId={userId} not found." });

                var completion = CalculateOrganizationProfileCompletion(profile);
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

        private ProfileCompletionDto CalculateOrganizationProfileCompletion(OrganizationProfileViewModel profile)
        {
            var totalFields = 12;
            var completedFields = 0;
            var missingFields = new List<string>();

            // Check required fields
            if (!string.IsNullOrEmpty(profile.OrganizationName)) completedFields++; else missingFields.Add("Organization Name");
            if (!string.IsNullOrEmpty(profile.ShortName)) completedFields++; else missingFields.Add("Short Name");
            if (profile.TypeId > 0) completedFields++; else missingFields.Add("Organization Type");
            if (!string.IsNullOrEmpty(profile.Description)) completedFields++; else missingFields.Add("Description");
            if (!string.IsNullOrEmpty(profile.Mission)) completedFields++; else missingFields.Add("Mission");
            if (!string.IsNullOrEmpty(profile.Vision)) completedFields++; else missingFields.Add("Vision");
            if (!string.IsNullOrEmpty(profile.Address)) completedFields++; else missingFields.Add("Address");
            if (!string.IsNullOrEmpty(profile.Province)) completedFields++; else missingFields.Add("Province");
            if (!string.IsNullOrEmpty(profile.ContactPersonName)) completedFields++; else missingFields.Add("Contact Person Name");
            if (!string.IsNullOrEmpty(profile.ContactEmail)) completedFields++; else missingFields.Add("Contact Email");
            if (!string.IsNullOrEmpty(profile.ContactPhone)) completedFields++; else missingFields.Add("Contact Phone");
            if (!string.IsNullOrEmpty(profile.Website)) completedFields++; else missingFields.Add("Website");

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
