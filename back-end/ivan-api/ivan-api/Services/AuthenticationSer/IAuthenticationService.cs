using ivan_api.DTOs.Authentication;

namespace ivan_api.Services.AuthenticationSer;

public interface IAuthenticationService
{
    Task<ApiResponseDTO<LoginResponseDTO>> LoginAsync(LoginRequestDTO loginRequest);
    Task<ApiResponseDTO<SuccessResponseDTO>> RegisterAsync(RegisterRequestDTO registerRequest);
    Task<ApiResponseDTO<SuccessResponseDTO>> ForgotPasswordAsync(ForgotPasswordRequestDTO forgotPasswordRequest);
    Task<ApiResponseDTO<SuccessResponseDTO>> ResetPasswordAsync(ResetPasswordRequestDTO resetPasswordRequest);
    Task<ApiResponseDTO<SuccessResponseDTO>> ChangePasswordAsync(int userId, ChangePasswordRequestDTO changePasswordRequest);
}
