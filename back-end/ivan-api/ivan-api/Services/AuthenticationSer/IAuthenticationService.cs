using ivan_api.DTOs.Authentication;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.AI;
using System.Security.Claims;

namespace ivan_api.Services.AuthenticationSer;

public interface IAuthenticationService
{
    Task<LoginResponseDTO?> LoginAsync(LoginRequestDTO loginRequest);
    Task<bool> RegisterAsync(RegisterRequestDTO registerRequest);
    Task<bool> ForgotPasswordAsync(ForgotPasswordRequestDTO forgotPasswordRequest);
    Task<bool> ResetPasswordAsync(ResetPasswordRequestDTO resetPasswordRequest);
    Task<bool> ChangePasswordAsync(int userId, ChangePasswordRequestDTO changePasswordRequest);
    int GetUserIdFromClaims(ClaimsPrincipal user);
    Task<UserInfoDTO> GetUserInfoWithProfileAsync(int userId);
    
    /// <summary>
    /// Get user context information for AI queries with role-specific IDs
    /// </summary>
    Task<UserContextInfo> GetUserContextForAiAsync(int userId);
    
    /// <summary>
    /// Get user context from ClaimsPrincipal for AI queries
    /// </summary>
    Task<UserContextInfo> GetUserContextForAiAsync(ClaimsPrincipal user);
}
