using ivan_api.Services.PartnerProfiles;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ivan_api.DTOs.PartnerProfiles;
using ivan_api.DTOs.Common;
using ivan_api.DTOs;
using System.Security.Claims;
using ivan_api.Services.AuthenticationSer;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartnerProfileController : ControllerBase
    {
        private readonly IPartnerProfileService _service;
        private readonly ILogger<PartnerProfileController> _logger;
        private readonly IAuthenticationService _authenticationService;

        public PartnerProfileController(
            IPartnerProfileService service,
            ILogger<PartnerProfileController> logger,
            IAuthenticationService authenticationService)
        {
            _service = service;
            _logger = logger;
            _authenticationService = authenticationService;
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
        public async Task<ActionResult<ApiResponseDTO<PagedResultDto<PartnerProfileViewModel>>>> GetList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _service.GetList(pageNumber, pageSize);
                return Ok(new ApiResponseDTO<PagedResultDto<PartnerProfileViewModel>>
                {
                    Success = true,
                    Data = result,
                    Message = "Partner profiles retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving partner profiles");
                return StatusCode(500, new ApiResponseDTO<PagedResultDto<PartnerProfileViewModel>>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve partner profiles" }
                });
            }
        }

        // Get partner profile by user ID
        [HttpGet("get/{userId}")]
        [Authorize(Roles = "Partner,Admin")]
        public async Task<ActionResult<ApiResponseDTO<PartnerProfileViewModel>>> Details(int userId)
        {
            try
            {
                // Check authorization for own profile access
                if (User.IsInRole("Partner"))
                {
                    var currentUserId = _authenticationService.GetUserIdFromClaims(User);
                    if (currentUserId != userId)
                    {
                        return Forbid("You can only access your own partner profile");
                    }
                }

                var result = await _service.GetPartnerProfileById(userId);
                if (result == null)
                {
                    return NotFound(new ApiResponseDTO<PartnerProfileViewModel>
                    {
                        Success = false,
                        Message = $"Partner profile for UserId={userId} not found.",
                        Errors = new List<string> { $"Partner with ID {userId} does not exist" }
                    });
                }

                return Ok(new ApiResponseDTO<PartnerProfileViewModel>
                {
                    Success = true,
                    Data = result,
                    Message = "Partner profile retrieved successfully"
                });
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error retrieving partner profile for UserId: {UserId}", userId);
                return StatusCode(500, new ApiResponseDTO<PartnerProfileViewModel>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve partner profile" }
                });
            }
        }

        // Create new partner profile (Admin only)
        [HttpPost("add")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponseDTO<PartnerProfileViewModel>>> Add([FromBody] PartnerProfileCreateDto input)
        {
            if (input == null)
            {
                return BadRequest(new ApiResponseDTO<PartnerProfileViewModel>
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

                return BadRequest(new ApiResponseDTO<PartnerProfileViewModel>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                });
            }

            try
            {
                var result = await _service.AddPartnerProfile(input);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<PartnerProfileViewModel>
                    {
                        Success = false,
                        Message = "Failed to create partner profile",
                        Errors = new List<string> { "Unable to create partner profile" }
                    });
                }

                // Get the newly created profile
                var lastId = await _service.GetLastId();
                var created = await _service.GetPartnerProfileById(lastId);

                return CreatedAtAction(
                    nameof(Details),
                    new { userId = created.UserId },
                    new ApiResponseDTO<PartnerProfileViewModel>
                    {
                        Success = true,
                        Data = created,
                        Message = "Partner profile created successfully"
                    }
                );
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error creating partner profile");
                return StatusCode(500, new ApiResponseDTO<PartnerProfileViewModel>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to create partner profile" }
                });
            }
        }

        // Update partner profile
        [HttpPut("update/{id}")]
        [Authorize(Roles = "Partner,Admin")]
        public async Task<ActionResult<ApiResponseDTO<PartnerProfileViewModel>>> Update([FromBody] PartnerProfileUpdateDto input, int id)
        {
            if (input == null)
            {
                return BadRequest(new ApiResponseDTO<PartnerProfileViewModel>
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

                return BadRequest(new ApiResponseDTO<PartnerProfileViewModel>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                });
            }

            try
            {
                // Check authorization for own profile updates
                if (User.IsInRole("Partner"))
                {
                    var currentUserId = _authenticationService.GetUserIdFromClaims(User);
                    if (currentUserId != id)
                    {
                        return Forbid("You can only update your own partner profile");
                    }
                }

                var result = await _service.UpdatePartnerProfile(input, id);
                if (!result)
                {
                    return NotFound(new ApiResponseDTO<PartnerProfileViewModel>
                    {
                        Success = false,
                        Message = $"Partner profile with UserId={id} not found.",
                        Errors = new List<string> { $"Partner with ID {id} does not exist" }
                    });
                }

                var updated = await _service.GetPartnerProfileById(id);
                return Ok(new ApiResponseDTO<PartnerProfileViewModel>
                {
                    Success = true,
                    Data = updated,
                    Message = "Partner profile updated successfully"
                });
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error updating partner profile for UserId: {UserId}", id);
                return StatusCode(500, new ApiResponseDTO<PartnerProfileViewModel>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to update partner profile" }
                });
            }
        }

        // Get partner profile completion percentage and missing fields
        [HttpGet("{userId}/completion")]
        [Authorize(Roles = "Partner,Admin")]
        public async Task<ActionResult<ApiResponseDTO<ProfileCompletionDto>>> GetProfileCompletion(int userId)
        {
            try
            {
                // Check authorization for own profile completion access
                if (User.IsInRole("Partner"))
                {
                    var currentUserId = _authenticationService.GetUserIdFromClaims(User);
                    if (currentUserId != userId)
                    {
                        return Forbid("You can only access your own partner profile completion");
                    }
                }

                var profile = await _service.GetPartnerProfileById(userId);
                if (profile == null)
                    return NotFound(new ApiResponseDTO<ProfileCompletionDto>
                    {
                        Success = false,
                        Message = $"Partner profile for UserId={userId} not found.",
                        Errors = new List<string> { $"Partner with ID {userId} does not exist" }
                    });

                var completion = CalculatePartnerProfileCompletion(profile);
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
