namespace ivan_api.DTOs.VolunteerProfile
{
    public class VolunteerProfileViewModel
    {
        public int VolunteerId { get; set; }
        public int UserId { get; set; }
        public string? StudentId { get; set; }
        public string? University { get; set; }
        public string? Major { get; set; }
        public int? YearOfStudy { get; set; }
        public string? Motivation { get; set; }
        public string? Experience { get; set; }
        public string? Availability { get; set; }
        public int VolunteerHours { get; set; }
        public decimal Rating { get; set; }
        public int RatingCount { get; set; }
        public bool IsVerified { get; set; }
        public DateTime? VerifiedAt { get; set; }
        public int? VerifiedBy { get; set; }
        public DateTime? LastActiveDate { get; set; }
        public int TotalHoursVolunteered { get; set; }
        public string? Skills { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation properties (from User)
        public string? Email { get; set; }
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Avatar { get; set; }
        public string? Address { get; set; }

        // Verification info
        public string? VerifiedByName { get; set; }

        // Related entities
        public List<VolunteerSkillDto>? VolunteerSkills { get; set; }
    }
}
