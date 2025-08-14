using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ivan_api.Services.AuthenticationSer;
using ivan_api.DTOs.Authentication;
using ivan_api.DTOs.Common;

namespace ivan_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthenticationController : ControllerBase
{
    private readonly IAuthenticationService _authenticationService;
    private readonly ILogger<AuthenticationController> _logger;

    public AuthenticationController(
        IAuthenticationService authenticationService,
        ILogger<AuthenticationController> logger)
    {
        _authenticationService = authenticationService;
        _logger = logger;
    }

    #region Authentication Endpoints

    /// <summary>Login user with email and password</summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseDTO<LoginResponseDTO>>> Login([FromBody] LoginRequestDTO loginRequest)
    {
        if (loginRequest == null)
        {
            return BadRequest(new ApiResponseDTO<LoginResponseDTO>
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

            return BadRequest(new ApiResponseDTO<LoginResponseDTO>
            {
                Success = false,
                Message = "Validation failed",
                Errors = errors
            });
        }

        try
        {
            var result = await _authenticationService.LoginAsync(loginRequest);

            if (!result.Success)
            {
                return Unauthorized(result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for email: {Email}", loginRequest.Email);
            return StatusCode(500, new ApiResponseDTO<LoginResponseDTO>
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { "Failed to process login request" }
            });
        }
    }    /// <summary>Register new user account</summary>
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseDTO<object>>> Register([FromBody] RegisterRequestDTO registerRequest)
    {
        if (registerRequest == null)
        {
            return BadRequest(new ApiResponseDTO<object>
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

            return BadRequest(new ApiResponseDTO<object>
            {
                Success = false,
                Message = "Validation failed",
                Errors = errors
            });
        }

        try
        {
            var result = await _authenticationService.RegisterAsync(registerRequest);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for email: {Email}", registerRequest.Email);
            return StatusCode(500, new ApiResponseDTO<object>
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { "Failed to process registration request" }
            });
        }
    }

    /// <summary>Request password reset code via email</summary>
    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseDTO<object>>> ForgotPassword([FromBody] ForgotPasswordRequestDTO forgotPasswordRequest)
    {
        if (forgotPasswordRequest == null)
        {
            return BadRequest(new ApiResponseDTO<object>
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

            return BadRequest(new ApiResponseDTO<object>
            {
                Success = false,
                Message = "Validation failed",
                Errors = errors
            });
        }

        try
        {
            var result = await _authenticationService.ForgotPasswordAsync(forgotPasswordRequest);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during forgot password for email: {Email}", forgotPasswordRequest.Email);
            return StatusCode(500, new ApiResponseDTO<object>
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { "Failed to process forgot password request" }
            });
        }
    }

    /// <summary>Reset password using reset code</summary>
    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseDTO<object>>> ResetPassword([FromBody] ResetPasswordRequestDTO resetPasswordRequest)
    {
        if (resetPasswordRequest == null)
        {
            return BadRequest(new ApiResponseDTO<object>
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

            return BadRequest(new ApiResponseDTO<object>
            {
                Success = false,
                Message = "Validation failed",
                Errors = errors
            });
        }

        try
        {
            var result = await _authenticationService.ResetPasswordAsync(resetPasswordRequest);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password reset");
            return StatusCode(500, new ApiResponseDTO<object>
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { "Failed to process password reset request" }
            });
        }
    }

    /// <summary>Change password for authenticated user</summary>
    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult<ApiResponseDTO<object>>> ChangePassword([FromBody] ChangePasswordRequestDTO changePasswordRequest)
    {
        if (changePasswordRequest == null)
        {
            return BadRequest(new ApiResponseDTO<object>
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

            return BadRequest(new ApiResponseDTO<object>
            {
                Success = false,
                Message = "Validation failed",
                Errors = errors
            });
        }

        try
        {
            var userId = _authenticationService.GetUserIdFromClaims(User);
            var result = await _authenticationService.ChangePasswordAsync(userId, changePasswordRequest);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password change for user");
            return StatusCode(500, new ApiResponseDTO<object>
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { "Failed to process password change request" }
            });
        }
    }

    #endregion

    #region User Information Endpoints

    /// <summary>Logout user (client-side token removal)</summary>
    [HttpPost("logout")]
    [Authorize]
    public ActionResult<ApiResponseDTO<object>> Logout()
    {
        // Since we're using JWT tokens, logout is handled on the client side
        // by removing the token from storage
        return Ok(new ApiResponseDTO<object>
        {
            Success = true,
            Message = "Logout successful. Please remove the token from client storage",
            Data = null
        });
    }

    /// <summary>Get current user information from token</summary>
    [HttpGet("me")]
    [Authorize]
    public ActionResult<ApiResponseDTO<UserInfoDTO>> GetCurrentUser()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var emailClaim = User.FindFirst(ClaimTypes.Email);
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            var roleIdClaim = User.FindFirst("RoleId");

            if (userIdClaim == null || emailClaim == null || roleClaim == null || roleIdClaim == null)
            {
                return Unauthorized(new ApiResponseDTO<UserInfoDTO>
                {
                    Success = false,
                    Message = "Invalid token",
                    Errors = new List<string> { "Token claims are missing" }
                });
            }

            var userInfo = new UserInfoDTO
            {
                UserId = int.Parse(userIdClaim.Value),
                Email = emailClaim.Value,
                RoleName = roleClaim.Value,
                RoleId = int.Parse(roleIdClaim.Value),
                IsEmailVerified = true, // We'll get this from database in a future enhancement
            };

            return Ok(new ApiResponseDTO<UserInfoDTO>
            {
                Success = true,
                Message = "User information retrieved successfully",
                Data = userInfo
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving current user information");
            return StatusCode(500, new ApiResponseDTO<UserInfoDTO>
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { "Failed to retrieve user information" }
            });
        }
    }

    #endregion
}
