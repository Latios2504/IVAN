namespace ivan_api.DTOs.VolunteerProfile
{
    public class VolunteerProfileUpdateDto
    {
        // DTO cho cập nhật hồ sơ tình nguyện viên (FE-02 Update)
        
        // UserProfile fields (Personal Information)
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
        public string? WardCommune { get; set; }
        public string? District { get; set; }
        public string? Province { get; set; }
        public string? PostalCode { get; set; }
        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactPhone { get; set; }
        public string? Avatar { get; set; }
        
        // VolunteerProfile fields (Volunteer-specific Information)
        public string? StudentId { get; set; }
        public string? University { get; set; }
        public string? Major { get; set; }
        public int? YearOfStudy { get; set; }
        public string? Motivation { get; set; }
        public string? Experience { get; set; }
        public string? Availability { get; set; }
        public List<VolunteerSkillDto> Skills { get; set; } = new();
    }
}
