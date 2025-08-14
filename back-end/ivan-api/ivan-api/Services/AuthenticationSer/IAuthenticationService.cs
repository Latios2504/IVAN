using ivan_api.DTOs.Authentication;
using ivan_api.DTOs.Common;
using System.Security.Claims;

namespace ivan_api.Services.AuthenticationSer;

public interface IAuthenticationService
{
    Task<ApiResponseDTO<LoginResponseDTO>> LoginAsync(LoginRequestDTO loginRequest);
    Task<ApiResponseDTO<object>> RegisterAsync(RegisterRequestDTO registerRequest);
    Task<ApiResponseDTO<object>> ForgotPasswordAsync(ForgotPasswordRequestDTO forgotPasswordRequest);
    Task<ApiResponseDTO<object>> ResetPasswordAsync(ResetPasswordRequestDTO resetPasswordRequest);
    Task<ApiResponseDTO<object>> ChangePasswordAsync(int userId, ChangePasswordRequestDTO changePasswordRequest);
    int GetUserIdFromClaims(ClaimsPrincipal user);
}
