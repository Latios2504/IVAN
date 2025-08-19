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

            if (result == null)
            {
                return Unauthorized(new ApiResponseDTO<LoginResponseDTO>
                {
                    Success = false,
                    Message = "Invalid email or password",
                    Errors = new List<string> { "Authentication failed" }
                });
            }

            return Ok(new ApiResponseDTO<LoginResponseDTO>
            {
                Success = true,
                Message = "Login successful",
                Data = result
            });
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

            if (!result)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Registration failed",
                    Errors = new List<string> { "User already exists or invalid role" }
                });
            }

            return Ok(new ApiResponseDTO<object>
            {
                Success = true,
                Message = "Registration successful. Please check your email for verification.",
                Data = null
            });
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
            
            return Ok(new ApiResponseDTO<object>
            {
                Success = true,
                Message = "If the email exists, a password reset code has been sent.",
                Data = null
            });
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

            if (!result)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Password reset failed",
                    Errors = new List<string> { "Invalid or expired reset code" }
                });
            }

            return Ok(new ApiResponseDTO<object>
            {
                Success = true,
                Message = "Password reset successful",
                Data = null
            });
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

            if (!result)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Password change failed",
                    Errors = new List<string> { "Current password is incorrect" }
                });
            }

            return Ok(new ApiResponseDTO<object>
            {
                Success = true,
                Message = "Password changed successfully",
                Data = null
            });
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
    public async Task<ActionResult<ApiResponseDTO<UserInfoDTO>>> GetCurrentUser()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            
            if (userIdClaim == null)
            {
                return Unauthorized(new ApiResponseDTO<UserInfoDTO>
                {
                    Success = false,
                    Message = "Invalid token",
                    Errors = new List<string> { "User ID not found in token" }
                });
            }

            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized(new ApiResponseDTO<UserInfoDTO>
                {
                    Success = false,
                    Message = "Invalid token",
                    Errors = new List<string> { "Invalid user ID format" }
                });
            }

            // Get user info with profile-specific data
            var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);

            return Ok(new ApiResponseDTO<UserInfoDTO>
            {
                Success = true,
                Message = "User information retrieved successfully",
                Data = userInfo
            });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "User not found");
            return NotFound(new ApiResponseDTO<UserInfoDTO>
            {
                Success = false,
                Message = "User not found",
                Errors = new List<string> { ex.Message }
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
