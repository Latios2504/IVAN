using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ivan_api.Configuration;
using ivan_api.DTOs;
using ivan_api.Models;

namespace ivan_api.Services;

public class JwtTokenService : IJwtTokenService
{
    private readonly JwtConfiguration _jwtConfig;

    public JwtTokenService(JwtConfiguration jwtConfig)
    {
        _jwtConfig = jwtConfig;
    }

    public string GenerateToken(User user, UserRole role)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtConfig.SecretKey);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, role.RoleName),
                new Claim("RoleId", role.RoleId.ToString()),
            }),
            Expires = DateTime.UtcNow.AddMinutes(_jwtConfig.ExpiryMinutes),
            Issuer = _jwtConfig.Issuer,
            Audience = _jwtConfig.Audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public LoginResponseDTO CreateLoginResponse(User user, UserRole role)
    {
        var token = GenerateToken(user, role);
        var expiresAt = DateTime.UtcNow.AddMinutes(_jwtConfig.ExpiryMinutes);

        return new LoginResponseDTO
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = new UserInfoDTO
            {
                UserId = user.UserId,
                Email = user.Email,
                RoleName = role.RoleName,
                RoleId = user.RoleId,
                IsEmailVerified = user.IsEmailVerified ?? false,
                LastLoginAt = user.LastLoginAt
            }
        };
    }
}
