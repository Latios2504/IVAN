using Microsoft.EntityFrameworkCore;
using ivan_api.Models;
using ivan_api.DTOs.Authentication;
using ivan_api.DTOs.Common;
using ivan_api.Services.PasswordHashingSer;
using ivan_api.Services.JwtTokenSer;
using ivan_api.Services.EmailSer;
using System.Security.Claims;

namespace ivan_api.Services.AuthenticationSer;

public class AuthenticationService : IAuthenticationService
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly IPasswordHashingService _passwordHashingService;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IEmailService _emailService;
    private readonly ILogger<AuthenticationService> _logger;

    public AuthenticationService(
        VolunteerManagementSystemContext context,
        IPasswordHashingService passwordHashingService,
        IJwtTokenService jwtTokenService,
        IEmailService emailService,
        ILogger<AuthenticationService> logger)
    {
        _context = context;
        _passwordHashingService = passwordHashingService;
        _jwtTokenService = jwtTokenService;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<ApiResponseDTO<LoginResponseDTO>> LoginAsync(LoginRequestDTO loginRequest)
    {
        try
        {
            // Find user by email
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == loginRequest.Email);           
            if (user == null)
            {
                return new ApiResponseDTO<LoginResponseDTO>
                {
                    Success = false,
                    Message = "Invalid email or password",
                    Errors = new List<string> { "User not found" }
                };
            }

            // Check if user is active
            if (user.IsActive == false)
            {
                return new ApiResponseDTO<LoginResponseDTO>
                {
                    Success = false,
                    Message = "Account is deactivated",
                    Errors = new List<string> { "Account is not active" }
                };
            }

            // Verify password
            if (!_passwordHashingService.VerifyPassword(loginRequest.Password, user.PasswordHash, user.Salt))
            {
                return new ApiResponseDTO<LoginResponseDTO>
                {
                    Success = false,
                    Message = "Invalid email or password",
                    Errors = new List<string> { "Invalid credentials" }
                };
            }

            // Update last login time
            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Get user info with profile data
            var userInfo = await GetUserInfoWithProfileAsync(user.UserId);

            // Generate JWT token
            var loginResponse = _jwtTokenService.CreateLoginResponse(user, user.Role);
            loginResponse.User = userInfo; // Replace with enhanced user info
            
            return new ApiResponseDTO<LoginResponseDTO>
            {
                Success = true,
                Message = "Login successful",
                Data = loginResponse
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for email: {Email}", loginRequest.Email);
            return new ApiResponseDTO<LoginResponseDTO>
            {
                Success = false,
                Message = "An error occurred during login",
                Errors = new List<string> { "Internal server error" }
            };
        }
    }

    public async Task<ApiResponseDTO<object>> RegisterAsync(RegisterRequestDTO registerRequest)
    {
        try
        {
            // Check if user already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == registerRequest.Email);

            if (existingUser != null)
            {
                return new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "User already exists",
                    Errors = new List<string> { "Email is already registered" }
                };
            }

            // Check if role exists and is valid for registration
            var role = await _context.UserRoles
                .FirstOrDefaultAsync(r => r.RoleId == registerRequest.RoleId && r.IsActive == true);

            if (role == null)
            {
                return new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Invalid role selected",
                    Errors = new List<string> { "Role not found or inactive" }
                };
            }            // Note: Volunteer Coordinator cannot be registered directly
            if (role.RoleName == "Volunteer Coordinator")
            {
                return new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Volunteer Coordinator accounts must be created by an Organization",
                    Errors = new List<string> { "Direct registration not allowed for this role" }
                };
            }

            // Generate salt and hash password
            var salt = _passwordHashingService.GenerateSalt();
            var passwordHash = _passwordHashingService.HashPassword(registerRequest.Password, salt);

            // Create new user
            var newUser = new User
            {
                Email = registerRequest.Email,
                PasswordHash = passwordHash,
                Salt = salt,
                RoleId = registerRequest.RoleId,
                IsActive = true,
                IsEmailVerified = false,
                EmailVerificationToken = Guid.NewGuid().ToString(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            // Create UserProfile (common for all roles)
            var userProfile = new UserProfile
            {
                UserId = newUser.UserId,
                FirstName = registerRequest.FirstName,
                LastName = registerRequest.LastName,
                PhoneNumber = registerRequest.PhoneNumber,
                Address = registerRequest.Address,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.UserProfiles.Add(userProfile);

            // Create role-specific profile based on the selected role
            await CreateRoleSpecificProfileAsync(newUser.UserId, registerRequest);

            // Save all profiles
            await _context.SaveChangesAsync();

            // Send email verification (for now, just log)
            await _emailService.SendEmailVerificationAsync(newUser.Email, newUser.EmailVerificationToken);

            return new ApiResponseDTO<object>
            {
                Success = true,
                Message = "Registration successful. Please check your email for verification.",
                Data = null
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for email: {Email}", registerRequest.Email);
            return new ApiResponseDTO<object>
            {
                Success = false,
                Message = "An error occurred during registration",
                Errors = new List<string> { "Internal server error" }
            };
        }
    }

    public async Task<ApiResponseDTO<object>> ForgotPasswordAsync(ForgotPasswordRequestDTO forgotPasswordRequest)
    {
        try
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == forgotPasswordRequest.Email);

            if (user == null)
            {
                // For security, don't reveal if email exists or not
                return new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "If the email exists, a password reset code has been sent.",
                    Data = null
                };
            }

            // Generate reset token
            var resetToken = GenerateResetCode();
            user.PasswordResetToken = resetToken;
            user.PasswordResetExpiry = DateTime.UtcNow.AddHours(1); // 1 hour expiry
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Send reset email
            await _emailService.SendPasswordResetEmailAsync(user.Email, resetToken);

            return new ApiResponseDTO<object>
            {
                Success = true,
                Message = "If the email exists, a password reset code has been sent.",
                Data = null
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during forgot password for email: {Email}", forgotPasswordRequest.Email);
            return new ApiResponseDTO<object>
            {
                Success = false,
                Message = "An error occurred while processing your request",
                Errors = new List<string> { "Internal server error" }
            };
        }
    }

    public async Task<ApiResponseDTO<object>> ResetPasswordAsync(ResetPasswordRequestDTO resetPasswordRequest)
    {
        try
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == resetPasswordRequest.Email 
                                    && u.PasswordResetToken == resetPasswordRequest.ResetCode
                                    && u.PasswordResetExpiry > DateTime.UtcNow);

            if (user == null)
            {
                return new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Invalid or expired reset code",
                    Errors = new List<string> { "Reset code is invalid or has expired" }
                };
            }

            // Generate new salt and hash new password
            var salt = _passwordHashingService.GenerateSalt();
            var passwordHash = _passwordHashingService.HashPassword(resetPasswordRequest.NewPassword, salt);

            // Update user password and clear reset token
            user.PasswordHash = passwordHash;
            user.Salt = salt;
            user.PasswordResetToken = null;
            user.PasswordResetExpiry = null;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new ApiResponseDTO<object>
            {
                Success = true,
                Message = "Password reset successfully",
                Data = null
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password reset for email: {Email}", resetPasswordRequest.Email);
            return new ApiResponseDTO<object>
            {
                Success = false,
                Message = "An error occurred while resetting password",
                Errors = new List<string> { "Internal server error" }
            };
        }
    }

    public async Task<ApiResponseDTO<object>> ChangePasswordAsync(int userId, ChangePasswordRequestDTO changePasswordRequest)
    {
        try
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                return new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "User not found",
                    Errors = new List<string> { "User does not exist" }
                };
            }

            // Verify current password
            if (!_passwordHashingService.VerifyPassword(changePasswordRequest.CurrentPassword, user.PasswordHash, user.Salt))
            {
                return new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Current password is incorrect",
                    Errors = new List<string> { "Invalid current password" }
                };
            }

            // Generate new salt and hash new password
            var salt = _passwordHashingService.GenerateSalt();
            var passwordHash = _passwordHashingService.HashPassword(changePasswordRequest.NewPassword, salt);

            // Update user password
            user.PasswordHash = passwordHash;
            user.Salt = salt;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new ApiResponseDTO<object>
            {
                Success = true,
                Message = "Password changed successfully",
                Data = null
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password change for user: {UserId}", userId);
            return new ApiResponseDTO<object>
            {
                Success = false,
                Message = "An error occurred while changing password",
                Errors = new List<string> { "Internal server error" }
            };
        }
    }

    /// Creates role-specific profile based on user role
    private async Task CreateRoleSpecificProfileAsync(int userId, RegisterRequestDTO registerRequest)
    {
        switch (registerRequest.RoleId)
        {
            case 1: // Volunteer
                var volunteerProfile = new VolunteerProfile
                {
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.VolunteerProfiles.Add(volunteerProfile);
                break;

            case 2: // Organization
                // Use provided organization info or create with placeholders
                var organizationType = registerRequest.OrganizationTypeId.HasValue 
                    ? await _context.OrganizationTypes.FindAsync(registerRequest.OrganizationTypeId.Value)
                    : await _context.OrganizationTypes.FirstOrDefaultAsync(ot => ot.IsActive == true);
                
                if (organizationType != null)
                {
                    var organization = new Organization
                    {
                        UserId = userId,
                        OrganizationName = !string.IsNullOrEmpty(registerRequest.OrganizationName) 
                            ? registerRequest.OrganizationName 
                            : "Organization Name (To be updated)",
                        TypeId = organizationType.TypeId,
                        TaxCode = registerRequest.TaxCode,
                        Website = registerRequest.Website,
                        ContactPhone = registerRequest.PhoneNumber,
                        Address = registerRequest.Address,
                        IsVerified = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.Organizations.Add(organization);
                }
                break;

            case 3: // Partner
                // Use provided partner info or create with placeholders
                var partnerIndustry = registerRequest.IndustryId.HasValue
                    ? await _context.PartnerIndustries.FindAsync(registerRequest.IndustryId.Value)
                    : await _context.PartnerIndustries.FirstOrDefaultAsync(pi => pi.IsActive == true);
                
                if (partnerIndustry != null)
                {
                    var partner = new Partner
                    {
                        UserId = userId,
                        CompanyName = !string.IsNullOrEmpty(registerRequest.CompanyName)
                            ? registerRequest.CompanyName
                            : "Company Name (To be updated)",
                        IndustryId = partnerIndustry.IndustryId,
                        TaxCode = registerRequest.TaxCode,
                        Website = registerRequest.Website,
                        ContactPhone = registerRequest.PhoneNumber,
                        Address = registerRequest.Address,
                        IsVerified = false,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.Partners.Add(partner);
                }
                break;

            case 4: // Volunteer Coordinator
                // Note: Coordinator profiles are typically created by organizations
                // and require OrganizationId, so this is handled differently
                // For direct registration, we'll skip creating the coordinator profile
                // and require it to be created through organization invitation
                _logger.LogInformation("Coordinator role registered. Profile creation deferred to organization invitation.");
                break;

            case 5: // Admin
                // Admin users don't need additional profiles beyond UserProfile
                _logger.LogInformation("Admin role registered. No additional profile needed.");
                break;

            default:
                _logger.LogWarning("Unknown role ID {RoleId} for user {UserId}", registerRequest.RoleId, userId);
                break;
        }
    }

    private static string GenerateResetCode()
    {
        // Generate a 6-digit numeric code
        var random = new Random();
        return random.Next(100000, 999999).ToString();
    }

    public int GetUserIdFromClaims(ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirst("UserId") ?? user.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token claims");
        }
        return userId;
    }

    public async Task<UserInfoDTO> GetUserInfoWithProfileAsync(int userId)
    {
        try
        {
            // Get user with role information
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                throw new InvalidOperationException($"User with ID {userId} not found");
            }

            var userInfo = new UserInfoDTO
            {
                UserId = user.UserId,
                Email = user.Email,
                RoleName = user.Role.RoleName,
                RoleId = user.RoleId,
                IsEmailVerified = user.IsEmailVerified ?? false,
                LastLoginAt = user.LastLoginAt
            };

            // Get profile-specific IDs based on user role
            switch (user.Role.RoleName.ToLower())
            {
                case "organization":
                    var organization = await _context.Organizations
                        .FirstOrDefaultAsync(o => o.UserId == userId);
                    userInfo.OrganizationId = organization?.OrganizationId;
                    break;

                case "partner":
                    var partner = await _context.Partners
                        .FirstOrDefaultAsync(p => p.UserId == userId);
                    userInfo.PartnerId = partner?.PartnerId;
                    break;

                case "volunteer":
                    var volunteer = await _context.VolunteerProfiles
                        .FirstOrDefaultAsync(v => v.UserId == userId);
                    userInfo.VolunteerId = volunteer?.VolunteerId;
                    break;

                case "coordinator":
                case "volunteer coordinator":
                    var coordinator = await _context.VolunteerCoordinators
                        .FirstOrDefaultAsync(c => c.UserId == userId);
                    userInfo.CoordinatorId = coordinator?.CoordinatorId;
                    break;

                case "admin":
                    // Admin users don't have a specific profile, all IDs remain null
                    break;

                default:
                    _logger.LogWarning("Unknown role name: {RoleName} for user ID: {UserId}", user.Role.RoleName, userId);
                    break;
            }

            return userInfo;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user info with profile for user ID: {UserId}", userId);
            throw;
        }
    }
}
