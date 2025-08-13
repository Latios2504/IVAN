using ivan_api.DTOs.VolunteerProfile;
using ivan_api.Services.VolunteerProfileServ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.Common;
using ivan_api.DTOs;
using System.Security.Claims;
using ivan_api.Services.AuthenticationSer;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VolunteerProfileController : ControllerBase
    {
        private readonly IVolunteerProfileService _service;
        private readonly ILogger<VolunteerProfileController> _logger;
        private readonly IAuthenticationService _authenticationService;

        public VolunteerProfileController(
            IVolunteerProfileService service,
            ILogger<VolunteerProfileController> logger,
            IAuthenticationService authenticationService)
        {
            _service = service;
            _logger = logger;
            _authenticationService = authenticationService;
        }

        #region Public Endpoints

        // Get paginated public volunteers with filters
        [HttpGet("public")]
        [AllowAnonymous]
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
                if (size > 50) size = 50;

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

                var result = await _service.GetPublicVolunteersAsync(filters);

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

        // Get detailed public volunteer information
        [HttpGet("public/{id}")]
        [AllowAnonymous]
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

                var volunteer = await _service.GetPublicVolunteerAsync(id);

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

        // Get all available skills
        [HttpGet("public/skills")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<List<SkillDto>>>> GetSkills()
        {
            try
            {
                var skills = await _service.GetAllSkillsAsync();

                return Ok(new ApiResponseDTO<List<SkillDto>>
                {
                    Success = true,
                    Data = skills.ToList(),
                    Message = "Skills retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving skills");
                return StatusCode(500, new ApiResponseDTO<List<SkillDto>>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve skills" }
                });
            }
        }

        #endregion

        #region Volunteer Management Endpoints

        // Get all volunteer profiles (Admin only)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDto<VolunteerProfileViewModel>>>> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _service.GetList(pageNumber, pageSize);
                return Ok(new ApiResponseDTO<PagedResultDto<VolunteerProfileViewModel>>
                {
                    Success = true,
                    Data = result,
                    Message = "Volunteer profiles retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving volunteer profiles");
                return StatusCode(500, new ApiResponseDTO<PagedResultDto<VolunteerProfileViewModel>>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve volunteer profiles" }
                });
            }
        }

        // Get volunteer profile by User ID
        [HttpGet("{userId:int}")]
        [Authorize(Roles = "Volunteer,Admin")]
        public async Task<ActionResult<ApiResponseDTO<VolunteerProfileViewModel>>> GetById(int userId)
        {
            try
            {
                // Check authorization for own profile access
                if (User.IsInRole("Volunteer"))
                {
                    var currentUserId = _authenticationService.GetUserIdFromClaims(User);
                    if (currentUserId != userId)
                    {
                        return Forbid("You can only access your own volunteer profile");
                    }
                }

                var dto = await _service.GetVolunteerProfileById(userId);
                if (dto == null)
                    return NotFound(new ApiResponseDTO<VolunteerProfileViewModel>
                    {
                        Success = false,
                        Message = $"Volunteer profile for UserId={userId} not found.",
                        Errors = new List<string> { $"Volunteer with ID {userId} does not exist" }
                    });

                return Ok(new ApiResponseDTO<VolunteerProfileViewModel>
                {
                    Success = true,
                    Data = dto,
                    Message = "Volunteer profile retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving volunteer profile for UserId: {UserId}", userId);
                return StatusCode(500, new ApiResponseDTO<VolunteerProfileViewModel>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve volunteer profile" }
                });
            }
        }

        // Create new volunteer profile (Open registration)
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<VolunteerProfileViewModel>>> Create([FromBody] VolunteerProfileCreateDto dto)
        {
            try
            {
                var success = await _service.AddVolunteerProfile(dto);
                if (!success)
                {
                    return BadRequest(new ApiResponseDTO<VolunteerProfileViewModel>
                    {
                        Success = false,
                        Message = "Failed to create volunteer profile",
                        Errors = new List<string> { "Unable to create volunteer profile" }
                    });
                }

                // Get the newly created profile
                var lastId = await _service.GetLastId();
                var created = await _service.GetVolunteerProfileById(lastId);
                
                return CreatedAtAction(
                    nameof(GetById),
                    new { userId = created.UserId },
                    new ApiResponseDTO<VolunteerProfileViewModel>
                    {
                        Success = true,
                        Data = created,
                        Message = "Volunteer profile created successfully"
                    }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating volunteer profile");
                return BadRequest(new ApiResponseDTO<VolunteerProfileViewModel>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to create volunteer profile" }
                });
            }
        }

        // Update volunteer profile
        [HttpPut("{userId:int}")]
        [Authorize(Roles = "Volunteer,Admin")]
        public async Task<ActionResult<ApiResponseDTO<VolunteerProfileViewModel>>> Update(int userId, [FromBody] VolunteerProfileUpdateDto dto)
        {
            try
            {
                // Check authorization for own profile updates
                if (User.IsInRole("Volunteer"))
                {
                    var currentUserId = _authenticationService.GetUserIdFromClaims(User);
                    if (currentUserId != userId)
                    {
                        return Forbid("You can only update your own volunteer profile");
                    }
                }

                var result = await _service.UpdateVolunteerProfile(dto, userId);
                if (!result)
                {
                    return NotFound(new ApiResponseDTO<VolunteerProfileViewModel>
                    {
                        Success = false,
                        Message = $"Volunteer profile with UserId={userId} not found.",
                        Errors = new List<string> { $"Volunteer with ID {userId} does not exist" }
                    });
                }

                var updated = await _service.GetVolunteerProfileById(userId);
                return Ok(new ApiResponseDTO<VolunteerProfileViewModel>
                {
                    Success = true,
                    Data = updated,
                    Message = "Volunteer profile updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating volunteer profile for UserId: {UserId}", userId);
                return BadRequest(new ApiResponseDTO<VolunteerProfileViewModel>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to update volunteer profile" }
                });
            }
        }

        // Get profile completion percentage and missing fields
        [HttpGet("{userId:int}/completion")]
        [Authorize(Roles = "Volunteer,Admin")]
        public async Task<ActionResult<ApiResponseDTO<ProfileCompletionDto>>> GetProfileCompletion(int userId)
        {
            try
            {
                // Check authorization for own profile completion access
                if (User.IsInRole("Volunteer"))
                {
                    var currentUserId = _authenticationService.GetUserIdFromClaims(User);
                    if (currentUserId != userId)
                    {
                        return Forbid("You can only access your own volunteer profile completion");
                    }
                }

                var profile = await _service.GetVolunteerProfileById(userId);
                if (profile == null)
                    return NotFound(new ApiResponseDTO<ProfileCompletionDto>
                    {
                        Success = false,
                        Message = $"Volunteer profile for UserId={userId} not found.",
                        Errors = new List<string> { $"Volunteer with ID {userId} does not exist" }
                    });

                var completion = CalculateVolunteerProfileCompletion(profile);
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

        private ProfileCompletionDto CalculateVolunteerProfileCompletion(VolunteerProfileViewModel profile)
        {
            var totalFields = 15;
            var completedFields = 0;
            var missingFields = new List<string>();

            // Check required fields
            if (!string.IsNullOrEmpty(profile.FullName)) completedFields++; else missingFields.Add("Full Name");
            if (!string.IsNullOrEmpty(profile.PhoneNumber)) completedFields++; else missingFields.Add("Phone Number");
            if (profile.DateOfBirth.HasValue) completedFields++; else missingFields.Add("Date of Birth");
            if (!string.IsNullOrEmpty(profile.Gender)) completedFields++; else missingFields.Add("Gender");
            if (!string.IsNullOrEmpty(profile.Address)) completedFields++; else missingFields.Add("Address");
            if (!string.IsNullOrEmpty(profile.University)) completedFields++; else missingFields.Add("University");
            if (!string.IsNullOrEmpty(profile.Major)) completedFields++; else missingFields.Add("Major");
            if (profile.YearOfStudy.HasValue) completedFields++; else missingFields.Add("Year of Study");
            if (!string.IsNullOrEmpty(profile.Motivation)) completedFields++; else missingFields.Add("Motivation");
            if (!string.IsNullOrEmpty(profile.Experience)) completedFields++; else missingFields.Add("Experience");
            if (!string.IsNullOrEmpty(profile.Availability)) completedFields++; else missingFields.Add("Availability");
            if (profile.VolunteerSkills?.Any() == true) completedFields++; else missingFields.Add("Skills");
            if (!string.IsNullOrEmpty(profile.StudentId)) completedFields++; else missingFields.Add("Student ID");
            if (!string.IsNullOrEmpty(profile.Avatar)) completedFields++; else missingFields.Add("Profile Picture");
            if (!string.IsNullOrEmpty(profile.Email)) completedFields++; else missingFields.Add("Email");

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
