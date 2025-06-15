using Microsoft.EntityFrameworkCore;
using ivan_api.DTOs;
using ivan_api.Models;

namespace ivan_api.Services;

public class AuthenticationService : IAuthenticationService
{
    private readonly VolunteerManagementSystemContext _context;
    private readonly IPasswordHashingService _passwordHashingService;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IEmailService _emailService;
    private readonly IN8nWebhookService _n8nWebhookService;
    private readonly ILogger<AuthenticationService> _logger;

    public AuthenticationService(
        VolunteerManagementSystemContext context,
        IPasswordHashingService passwordHashingService,
        IJwtTokenService jwtTokenService,
        IEmailService emailService,
        IN8nWebhookService n8nWebhookService,
        ILogger<AuthenticationService> logger)
    {
        _context = context;
        _passwordHashingService = passwordHashingService;
        _jwtTokenService = jwtTokenService;
        _emailService = emailService;
        _n8nWebhookService = n8nWebhookService;
        _logger = logger;
    }

    public async Task<ApiResponseDTO<LoginResponseDTO>> LoginAsync(LoginRequestDTO loginRequest)
    {
        try
        {
            // Find user by email
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == loginRequest.Email);            if (user == null)
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

            // Generate JWT token
            var loginResponse = _jwtTokenService.CreateLoginResponse(user, user.Role);            return new ApiResponseDTO<LoginResponseDTO>
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

    public async Task<ApiResponseDTO<SuccessResponseDTO>> RegisterAsync(RegisterRequestDTO registerRequest)
    {
        try
        {
            // Check if user already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == registerRequest.Email);

            if (existingUser != null)
            {
                return new ApiResponseDTO<SuccessResponseDTO>
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
                return new ApiResponseDTO<SuccessResponseDTO>
                {
                    Success = false,
                    Message = "Invalid role selected",
                    Errors = new List<string> { "Role not found or inactive" }
                };
            }            // Note: Volunteer Coordinator cannot be registered directly
            if (role.RoleName == "Volunteer Coordinator")
            {
                return new ApiResponseDTO<SuccessResponseDTO>
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

            // Send email verification (for now, just log)
            await _emailService.SendEmailVerificationAsync(newUser.Email, newUser.EmailVerificationToken);

            // Send webhook to N8N for Google Sheets integration
            await _n8nWebhookService.SendUserRegistrationAsync(newUser.UserId, newUser.Email, role.RoleName);

            return new ApiResponseDTO<SuccessResponseDTO>
            {
                Success = true,
                Message = "Registration successful. Please check your email for verification.",
                Data = new SuccessResponseDTO { Message = "User registered successfully" }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for email: {Email}", registerRequest.Email);
            return new ApiResponseDTO<SuccessResponseDTO>
            {
                Success = false,
                Message = "An error occurred during registration",
                Errors = new List<string> { "Internal server error" }
            };
        }
    }

    public async Task<ApiResponseDTO<SuccessResponseDTO>> ForgotPasswordAsync(ForgotPasswordRequestDTO forgotPasswordRequest)
    {
        try
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == forgotPasswordRequest.Email);

            if (user == null)
            {
                // For security, don't reveal if email exists or not
                return new ApiResponseDTO<SuccessResponseDTO>
                {
                    Success = true,
                    Message = "If the email exists, a password reset code has been sent.",
                    Data = new SuccessResponseDTO { Message = "Password reset email sent" }
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

            return new ApiResponseDTO<SuccessResponseDTO>
            {
                Success = true,
                Message = "If the email exists, a password reset code has been sent.",
                Data = new SuccessResponseDTO { Message = "Password reset email sent" }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during forgot password for email: {Email}", forgotPasswordRequest.Email);
            return new ApiResponseDTO<SuccessResponseDTO>
            {
                Success = false,
                Message = "An error occurred while processing your request",
                Errors = new List<string> { "Internal server error" }
            };
        }
    }

    public async Task<ApiResponseDTO<SuccessResponseDTO>> ResetPasswordAsync(ResetPasswordRequestDTO resetPasswordRequest)
    {
        try
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == resetPasswordRequest.Email 
                                    && u.PasswordResetToken == resetPasswordRequest.ResetCode
                                    && u.PasswordResetExpiry > DateTime.UtcNow);

            if (user == null)
            {
                return new ApiResponseDTO<SuccessResponseDTO>
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

            return new ApiResponseDTO<SuccessResponseDTO>
            {
                Success = true,
                Message = "Password reset successfully",
                Data = new SuccessResponseDTO { Message = "Password has been reset" }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password reset for email: {Email}", resetPasswordRequest.Email);
            return new ApiResponseDTO<SuccessResponseDTO>
            {
                Success = false,
                Message = "An error occurred while resetting password",
                Errors = new List<string> { "Internal server error" }
            };
        }
    }

    public async Task<ApiResponseDTO<SuccessResponseDTO>> ChangePasswordAsync(int userId, ChangePasswordRequestDTO changePasswordRequest)
    {
        try
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                return new ApiResponseDTO<SuccessResponseDTO>
                {
                    Success = false,
                    Message = "User not found",
                    Errors = new List<string> { "User does not exist" }
                };
            }

            // Verify current password
            if (!_passwordHashingService.VerifyPassword(changePasswordRequest.CurrentPassword, user.PasswordHash, user.Salt))
            {
                return new ApiResponseDTO<SuccessResponseDTO>
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

            return new ApiResponseDTO<SuccessResponseDTO>
            {
                Success = true,
                Message = "Password changed successfully",
                Data = new SuccessResponseDTO { Message = "Password has been updated" }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password change for user: {UserId}", userId);
            return new ApiResponseDTO<SuccessResponseDTO>
            {
                Success = false,
                Message = "An error occurred while changing password",
                Errors = new List<string> { "Internal server error" }
            };
        }
    }

    private static string GenerateResetCode()
    {
        // Generate a 6-digit numeric code
        var random = new Random();
        return random.Next(100000, 999999).ToString();
    }
}
