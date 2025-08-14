namespace ivan_api.DTOs.UserManagement
{
    public class UserListDTO
    {
        public int UserId { get; set; }
        public string Email { get; set; } = null!;
        public int RoleId { get; set; }
        public string RoleName { get; set; } = null!;
        public bool IsActive { get; set; }
        public bool IsEmailVerified { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public DateTime CreatedAt { get; set; }
        
        // Basic display name only - no detailed profile info for user list
        public string? DisplayName { get; set; } // Simple display name for the list
        
        // Role-specific identifier for quick reference only
        public string? RoleSpecificInfo { get; set; } // e.g., "Student ID: 123", "Organization: ABC", "Company: XYZ"
    }
}
