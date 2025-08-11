using System.ComponentModel.DataAnnotations;
using ivan_api.DTOs.Common;

namespace ivan_api.DTOs.Authentication;

// Login Request
public class LoginRequestDTO
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
    public string Password { get; set; } = string.Empty;
}

// Register Request
public class RegisterRequestDTO
{
    [Required(ErrorMessage = "First name is required")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last name is required")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password confirmation is required")]
    [Compare("Password", ErrorMessage = "Passwords do not match")]
    public string ConfirmPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "Role is required")]
    [Range(1, 5, ErrorMessage = "Invalid role selected")]
    public int RoleId { get; set; }

    // Optional fields for Organization registration
    public string? OrganizationName { get; set; }
    public int? OrganizationTypeId { get; set; }
    public string? TaxCode { get; set; }
    public string? Website { get; set; }

    // Optional fields for Partner registration
    public string? CompanyName { get; set; }
    public int? IndustryId { get; set; }

    // Optional fields for all roles
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
}

// Forgot Password Request
public class ForgotPasswordRequestDTO
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;
}

// Reset Password Request
public class ResetPasswordRequestDTO
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Reset code is required")]
    public string ResetCode { get; set; } = string.Empty;

    [Required(ErrorMessage = "New password is required")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
    public string NewPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password confirmation is required")]
    [Compare("NewPassword", ErrorMessage = "Passwords do not match")]
    public string ConfirmPassword { get; set; } = string.Empty;
}

// Change Password Request
public class ChangePasswordRequestDTO
{
    [Required(ErrorMessage = "Current password is required")]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "New password is required")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
    public string NewPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password confirmation is required")]
    [Compare("NewPassword", ErrorMessage = "Passwords do not match")]
    public string ConfirmPassword { get; set; } = string.Empty;
}

// Login Response
public class LoginResponseDTO
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserInfoDTO User { get; set; } = new();
}

// User Info DTO
public class UserInfoDTO
{
    public int UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string RoleName { get; set; } = string.Empty;
    public int RoleId { get; set; }
    public bool IsEmailVerified { get; set; }
    public DateTime? LastLoginAt { get; set; }
}
