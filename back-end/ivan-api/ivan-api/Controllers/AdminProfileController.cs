using ivan_api.Constants;
using ivan_api.DTOs.AdminProfile;
using ivan_api.DTOs.Common;
using ivan_api.Services.AdminProfileServ;
using ivan_api.Services.AuthenticationSer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ivan_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = AuthenticationConstants.Roles.Admin)]
    public class AdminProfileController : ControllerBase
    {
        private readonly IAdminProfileService _service;
        private readonly IAuthenticationService _auth;
        private readonly ILogger<AdminProfileController> _logger;

        public AdminProfileController(
            IAdminProfileService service,
            IAuthenticationService auth,
            ILogger<AdminProfileController> logger)
        {
            _service = service;
            _auth = auth;
            _logger = logger;
        }

        /// GET /api/AdminProfile/me
        [HttpGet("me")]
        public async Task<ActionResult<ApiResponseDTO<AdminProfileViewModel>>> Me()
        {
            try
            {
                var userId = _auth.GetUserIdFromClaims(User);
                var data = await _service.GetMyProfileAsync(userId);

                if (data == null)
                {
                    return NotFound(ApiResponseDTO<AdminProfileViewModel>.NotFound("Profile not found"));
                }

                return Ok(ApiResponseDTO<AdminProfileViewModel>.Ok(data, "Admin profile retrieved"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin profile");
                return StatusCode(500, ApiResponseDTO<AdminProfileViewModel>.Error("Internal server error"));
            }
        }

        /// PUT /api/AdminProfile
        [HttpPut]
        public async Task<ActionResult<ApiResponseDTO<AdminProfileViewModel>>> Update([FromBody] AdminProfileUpdateDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errs = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(new ApiResponseDTO<AdminProfileViewModel> { Success = false, Message = "Invalid input", Errors = errs });
            }

            try
            {
                var userId = _auth.GetUserIdFromClaims(User);
                var data = await _service.UpdateMyProfileAsync(userId, dto);

                if (data == null)
                {
                    return NotFound(ApiResponseDTO<AdminProfileViewModel>.NotFound("User not found"));
                }

                return Ok(ApiResponseDTO<AdminProfileViewModel>.Ok(data, "Profile updated"));
            }
            catch (ArgumentException aex)
            {
                return BadRequest(ApiResponseDTO<AdminProfileViewModel>.BadRequest(aex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating admin profile");
                return StatusCode(500, ApiResponseDTO<AdminProfileViewModel>.Error("Internal server error"));
            }
        }

        /// PATCH /api/AdminProfile/avatar
        [HttpPatch("avatar")]
        public async Task<ActionResult<ApiResponseDTO<object>>> UpdateAvatar([FromBody] AdminAvatarUpdateDto body)
        {
            if (body == null || string.IsNullOrWhiteSpace(body.AvatarUrl))
            {
                return BadRequest(ApiResponseDTO<object>.BadRequest("AvatarUrl is required"));
            }

            try
            {
                var userId = _auth.GetUserIdFromClaims(User);
                var ok = await _service.UpdateMyAvatarAsync(userId, body.AvatarUrl);

                if (!ok) return NotFound(ApiResponseDTO<object>.NotFound("User not found"));

                return Ok(ApiResponseDTO<object>.Ok(new { Avatar = body.AvatarUrl }, "Avatar updated"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating avatar");
                return StatusCode(500, ApiResponseDTO<object>.Error("Internal server error"));
            }
        }
    }
}
