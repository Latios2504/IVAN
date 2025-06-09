using ivan_api.DTOs;
using ivan_api.Models;

namespace ivan_api.Services;

public interface IJwtTokenService
{
    string GenerateToken(User user, UserRole role);
    LoginResponseDTO CreateLoginResponse(User user, UserRole role);
}
