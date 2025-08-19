using ivan_api.DTOs.Authentication;
using ivan_api.DTOs.Common;
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
}
