using ivan_api.Constants;
using ivan_api.Services.OrganizationProfiles;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ivan_api.DTOs.OrganizationProfiles;
using ivan_api.DTOs.Common;
using ivan_api.Services.AuthenticationSer;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizationProfileController : ControllerBase
    {
        private readonly IOrganizationProfileService _service;
        private readonly ILogger<OrganizationProfileController> _logger;
        private readonly IAuthenticationService _authenticationService;

        public OrganizationProfileController(
            IOrganizationProfileService service,
            ILogger<OrganizationProfileController> logger,
            IAuthenticationService authenticationService)
        {
            _service = service;
            _logger = logger;
            _authenticationService = authenticationService;
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
        [Authorize(Roles = AuthenticationConstants.Roles.Admin)]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDto<OrganizationProfileViewModel>>>> GetList(
            [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _service.GetList(pageNumber, pageSize);
                return Ok(new ApiResponseDTO<PagedResultDto<OrganizationProfileViewModel>>
                {
                    Success = true,
                    Data = result,
                    Message = "Organization profiles retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving organization profiles");
                return StatusCode(500, new ApiResponseDTO<PagedResultDto<OrganizationProfileViewModel>>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve organization profiles" }
                });
            }
        }

        // Get organization profile by user ID
        [HttpGet("get/{userId}")]
        [Authorize(Roles = "Organization,Admin")]
        public async Task<ActionResult<ApiResponseDTO<OrganizationProfileViewModel>>> Details(int userId)
        {
            try
            {
                // Check authorization for own profile access
                if (User.IsInRole(AuthenticationConstants.Roles.Organization))
                {
                    var currentUserId = _authenticationService.GetUserIdFromClaims(User);
                    if (currentUserId != userId)
                    {
                        return Forbid("You can only access your own organization profile");
                    }
                }

                var result = await _service.GetOrganizationProfileById(userId);
                if (result == null)
                {
                    return NotFound(new ApiResponseDTO<OrganizationProfileViewModel>
                    {
                        Success = false,
                        Message = $"Organization profile for UserId={userId} not found.",
                        Errors = new List<string> { $"Organization with ID {userId} does not exist" }
                    });
                }

                return Ok(new ApiResponseDTO<OrganizationProfileViewModel>
                {
                    Success = true,
                    Data = result,
                    Message = "Organization profile retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving organization profile for UserId: {UserId}", userId);
                return StatusCode(500, new ApiResponseDTO<OrganizationProfileViewModel>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve organization profile" }
                });
            }
        }

        // Create new organization profile (Admin only)
        [HttpPost("add")]
        [Authorize(Roles = AuthenticationConstants.Roles.Admin)]
        public async Task<ActionResult<ApiResponseDTO<OrganizationProfileViewModel>>> Add(
            [FromBody] OrganizationProfileCreateDto input)
        {
            if (input == null)
            {
                return BadRequest(new ApiResponseDTO<OrganizationProfileViewModel>
                {
                    Success = false,
                    Message = "Invalid input data",
                    Errors = new List<string> { "Request body cannot be null" }
                });
            }

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new ApiResponseDTO<OrganizationProfileViewModel>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                });
            }

            try
            {
                var result = await _service.AddOrganizationProfile(input);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<OrganizationProfileViewModel>
                    {
                        Success = false,
                        Message = "Failed to create organization profile",
                        Errors = new List<string> { "Unable to create organization profile" }
                    });
                }

                // Get the newly created profile
                var lastId = await _service.GetLastId();
                var created = await _service.GetOrganizationProfileById(lastId);

                return CreatedAtAction(
                    nameof(Details),
                    new { userId = created.UserId },
                    new ApiResponseDTO<OrganizationProfileViewModel>
                    {
                        Success = true,
                        Data = created,
                        Message = "Organization profile created successfully"
                    }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating organization profile");
                return StatusCode(500, new ApiResponseDTO<OrganizationProfileViewModel>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to create organization profile" }
                });
            }
        }

        // Update organization profile
        [HttpPut("update/{id}")]
        [Authorize(Roles = "Organization,Admin")]
        public async Task<ActionResult<ApiResponseDTO<OrganizationProfileViewModel>>> Update(
            [FromBody] OrganizationProfileUpdateDto input, int id)
        {
            if (input == null)
            {
                return BadRequest(new ApiResponseDTO<OrganizationProfileViewModel>
                {
                    Success = false,
                    Message = "Invalid input data",
                    Errors = new List<string> { "Request body cannot be null" }
                });
            }

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new ApiResponseDTO<OrganizationProfileViewModel>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                });
            }

            try
            {
                // Check authorization for own profile updates
                if (User.IsInRole(AuthenticationConstants.Roles.Organization))
                {
                    var currentUserId = _authenticationService.GetUserIdFromClaims(User);
                    if (currentUserId != id)
                    {
                        return Forbid("You can only update your own organization profile");
                    }
                }

                var result = await _service.UpdateOrganizationProfile(input, id);
                if (!result)
                {
                    return NotFound(new ApiResponseDTO<OrganizationProfileViewModel>
                    {
                        Success = false,
                        Message = $"Organization profile with UserId={id} not found.",
                        Errors = new List<string> { $"Organization with ID {id} does not exist" }
                    });
                }

                var updated = await _service.GetOrganizationProfileById(id);
                return Ok(new ApiResponseDTO<OrganizationProfileViewModel>
                {
                    Success = true,
                    Data = updated,
                    Message = "Organization profile updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating organization profile for UserId: {UserId}", id);
                return StatusCode(500, new ApiResponseDTO<OrganizationProfileViewModel>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to update organization profile" }
                });
            }
        }

        // Get organization profile completion percentage and missing fields
        [HttpGet("{userId}/completion")]
        [Authorize(Roles = "Organization,Admin")]
        public async Task<ActionResult<ApiResponseDTO<ProfileCompletionDto>>> GetProfileCompletion(int userId)
        {
            try
            {
                // Check authorization for own profile completion access
                if (User.IsInRole(AuthenticationConstants.Roles.Organization))
                {
                    var currentUserId = _authenticationService.GetUserIdFromClaims(User);
                    if (currentUserId != userId)
                    {
                        return Forbid("You can only access your own organization profile completion");
                    }
                }

                var profile = await _service.GetOrganizationProfileById(userId);
                if (profile == null)
                    return NotFound(new ApiResponseDTO<ProfileCompletionDto>
                    {
                        Success = false,
                        Message = $"Organization profile for UserId={userId} not found.",
                        Errors = new List<string> { $"Organization with ID {userId} does not exist" }
                    });

                var completion = CalculateOrganizationProfileCompletion(profile);
                return Ok(new ApiResponseDTO<ProfileCompletionDto>
                {
                    Success = true,
                    Data = completion,
                    Message = "Profile completion calculated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating profile completion for UserId: {UserId}", userId);
                return StatusCode(500, new ApiResponseDTO<ProfileCompletionDto>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to calculate profile completion" }
                });
            }
        }

        #endregion

        #region Private Helper Methods

        private ProfileCompletionDto CalculateOrganizationProfileCompletion(OrganizationProfileViewModel profile)
        {
            var totalFields = 12;
            var completedFields = 0;
            var missingFields = new List<string>();

            // Check required fields
            if (!string.IsNullOrEmpty(profile.OrganizationName)) completedFields++;
            else missingFields.Add("Organization Name");
            if (!string.IsNullOrEmpty(profile.ShortName)) completedFields++;
            else missingFields.Add("Short Name");
            if (profile.TypeId > 0) completedFields++;
            else missingFields.Add("Organization Type");
            if (!string.IsNullOrEmpty(profile.Description)) completedFields++;
            else missingFields.Add("Description");
            if (!string.IsNullOrEmpty(profile.Mission)) completedFields++;
            else missingFields.Add("Mission");
            if (!string.IsNullOrEmpty(profile.Vision)) completedFields++;
            else missingFields.Add("Vision");
            if (!string.IsNullOrEmpty(profile.Address)) completedFields++;
            else missingFields.Add("Address");
            if (!string.IsNullOrEmpty(profile.Province)) completedFields++;
            else missingFields.Add("Province");
            if (!string.IsNullOrEmpty(profile.ContactPersonName)) completedFields++;
            else missingFields.Add("Contact Person Name");
            if (!string.IsNullOrEmpty(profile.ContactEmail)) completedFields++;
            else missingFields.Add("Contact Email");
            if (!string.IsNullOrEmpty(profile.ContactPhone)) completedFields++;
            else missingFields.Add("Contact Phone");
            if (!string.IsNullOrEmpty(profile.Website)) completedFields++;
            else missingFields.Add("Website");

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
