namespace ivan_api.DTOs.AdminProfile
{
    public class AdminProfileViewModel
    {
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty;

        // Thông tin từ UserProfiles
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? FullName { get; set; } // DB computed (FirstName + ' ' + LastName)
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; } // map từ DateOnly?
        public string? Gender { get; set; }
        public string? Avatar { get; set; }
        public string? Address { get; set; }
        public string? WardCommune { get; set; }
        public string? District { get; set; }
        public string? Province { get; set; }
        public string? PostalCode { get; set; }
        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactPhone { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
