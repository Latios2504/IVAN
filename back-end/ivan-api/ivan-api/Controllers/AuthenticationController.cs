using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ivan_api.Services.AuthenticationSer;
using ivan_api.DTOs.Authentication;

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
    }    /// <summary>
    /// Login user with email and password
    /// </summary>
    /// <param name="loginRequest">Login credentials</param>
    /// <returns>JWT token and user information</returns>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseDTO<LoginResponseDTO>>> Login([FromBody] LoginRequestDTO loginRequest)
    {
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

        var result = await _authenticationService.LoginAsync(loginRequest);

        if (!result.Success)
        {
            return Unauthorized(result);
        }

        return Ok(result);
    }    /// <summary>
    /// Register new user account
    /// </summary>
    /// <param name="registerRequest">Registration information</param>
    /// <returns>Success message</returns>
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseDTO<SuccessResponseDTO>>> Register([FromBody] RegisterRequestDTO registerRequest)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

            return BadRequest(new ApiResponseDTO<SuccessResponseDTO>
            {
                Success = false,
                Message = "Validation failed",
                Errors = errors
            });
        }

        var result = await _authenticationService.RegisterAsync(registerRequest);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Request password reset code via email
    /// </summary>
    /// <param name="forgotPasswordRequest">Email for password reset</param>
    /// <returns>Success message</returns>
    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseDTO<SuccessResponseDTO>>> ForgotPassword([FromBody] ForgotPasswordRequestDTO forgotPasswordRequest)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

            return BadRequest(new ApiResponseDTO<SuccessResponseDTO>
            {
                Success = false,
                Message = "Validation failed",
                Errors = errors
            });
        }

        var result = await _authenticationService.ForgotPasswordAsync(forgotPasswordRequest);
        return Ok(result);
    }

    /// <summary>
    /// Reset password using reset code
    /// </summary>
    /// <param name="resetPasswordRequest">Reset code and new password</param>
    /// <returns>Success message</returns>
    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseDTO<SuccessResponseDTO>>> ResetPassword([FromBody] ResetPasswordRequestDTO resetPasswordRequest)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

            return BadRequest(new ApiResponseDTO<SuccessResponseDTO>
            {
                Success = false,
                Message = "Validation failed",
                Errors = errors
            });
        }

        var result = await _authenticationService.ResetPasswordAsync(resetPasswordRequest);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Change password for authenticated user
    /// </summary>
    /// <param name="changePasswordRequest">Current and new password</param>
    /// <returns>Success message</returns>
    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult<ApiResponseDTO<SuccessResponseDTO>>> ChangePassword([FromBody] ChangePasswordRequestDTO changePasswordRequest)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

            return BadRequest(new ApiResponseDTO<SuccessResponseDTO>
            {
                Success = false,
                Message = "Validation failed",
                Errors = errors
            });
        }

        // Get user ID from JWT token
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized(new ApiResponseDTO<SuccessResponseDTO>
            {
                Success = false,
                Message = "Invalid token",
                Errors = new List<string> { "User ID not found in token" }
            });
        }

        var result = await _authenticationService.ChangePasswordAsync(userId, changePasswordRequest);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Logout user (client-side token removal)
    /// </summary>
    /// <returns>Success message</returns>
    [HttpPost("logout")]
    [Authorize]
    public ActionResult<ApiResponseDTO<SuccessResponseDTO>> Logout()
    {
        // Since we're using JWT tokens, logout is handled on the client side
        // by removing the token from storage
        return Ok(new ApiResponseDTO<SuccessResponseDTO>
        {
            Success = true,
            Message = "Logout successful",
            Data = new SuccessResponseDTO { Message = "Please remove the token from client storage" }
        });
    }

    /// <summary>
    /// Get current user information from token
    /// </summary>
    /// <returns>Current user information</returns>
    [HttpGet("me")]
    [Authorize]
    public ActionResult<ApiResponseDTO<UserInfoDTO>> GetCurrentUser()
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
            Message = "User information retrieved",
            Data = userInfo
        });
    }
}
