namespace ivan_api.DTOs.UserManagement
{
    public class UserProfileDTO
    {
        public int ProfileId { get; set; }
        public int UserId { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public DateOnly? DateOfBirth { get; set; }
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
