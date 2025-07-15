namespace ivan_api.DTOs.UserAccount
{
    public class UserAccountDetailDto
    {
        // Account Information
        public int UserId { get; set; }
        public string Email { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public string? RoleDescription { get; set; }
        public bool IsActive { get; set; }
        public bool IsEmailVerified { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Profile Information
        public int? ProfileId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Avatar { get; set; }

        // Address Information
        public string? Address { get; set; }
        public string? WardCommune { get; set; }
        public string? District { get; set; }
        public string? Province { get; set; }
        public string? PostalCode { get; set; }
        public string? FullAddress => string.Join(", ", new[] { Address, WardCommune, District, Province }.Where(x => !string.IsNullOrEmpty(x)));

        // Emergency Contact
        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactPhone { get; set; }

        // Computed Properties
        public int? Age => DateOfBirth.HasValue ? DateTime.Now.Year - DateOfBirth.Value.Year : null;
        public string StatusDisplay => IsActive ? "Hoạt động" : "Vô hiệu hóa";
        public string VerificationDisplay => IsEmailVerified ? "Đã xác thực" : "Chưa xác thực";

        // Statistics
        public UserStatisticsDto Statistics { get; set; } = new();
    }
}
