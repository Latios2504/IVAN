using ivan_api.DTOs.Authentication;
using ivan_api.Models;

namespace ivan_api.Services.JwtTokenSer;

public interface IJwtTokenService
{
    string GenerateToken(User user, UserRole role);
    LoginResponseDTO CreateLoginResponse(User user, UserRole role);
}
