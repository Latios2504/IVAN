namespace ivan_api.DTOs.VolunteerProfile
{
    // DTO chi tiết, khi volunteer click vào xem detail
    public class VolunteerProfileDetailDto
    {
        public int VolunteerId { get; set; }
        public int UserId { get; set; }
        
        // UserProfile fields (Personal Information)
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Avatar { get; set; }
        public string? Address { get; set; }
        public string? WardCommune { get; set; }
        public string? District { get; set; }
        public string? Province { get; set; }
        public string? PostalCode { get; set; }
        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactPhone { get; set; }

        // VolunteerProfile fields (Volunteer-specific Information)
        public string? StudentId { get; set; }
        public string? University { get; set; }
        public string? Major { get; set; }
        public int? YearOfStudy { get; set; }
        public string? Motivation { get; set; }
        public string? Experience { get; set; }
        public string? Availability { get; set; }

        public int VolunteerHours { get; set; }
        public decimal? Rating { get; set; }
        public int RatingCount { get; set; }

        public bool? IsVerified { get; set; }
        public DateTime? VerifiedAt { get; set; }
        public int? VerifiedBy { get; set; }

        public List<VolunteerSkillDto> Skills { get; set; } = new();
    }
}
