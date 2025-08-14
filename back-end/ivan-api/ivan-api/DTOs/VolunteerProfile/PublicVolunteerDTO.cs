namespace ivan_api.DTOs.VolunteerProfile
{
    /// <summary>
    /// Public view of volunteer data - excludes sensitive personal information
    /// </summary>
    public class PublicVolunteerDTO
    {
        public int VolunteerId { get; set; }
        // UserId removed for security
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        // Email removed - sensitive personal data
        // PhoneNumber removed - sensitive personal data
        // DateOfBirth removed - sensitive personal data
        public string? Gender { get; set; }
        public string? Avatar { get; set; }
        // Address removed - sensitive location data
        // WardCommune removed - sensitive location data
        // District removed - sensitive location data
        public string? Province { get; set; } // Keep province for general location filtering
        // StudentId removed - sensitive identity data
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
        // VerifiedAt removed - internal admin data
        // LastActiveDate removed - internal tracking data
        public int TotalHoursVolunteered { get; set; }
        public string? Skills { get; set; }
        public List<PublicVolunteerSkillDTO> SkillsList { get; set; } = new();
        // IsActive removed - internal status
        // CreatedAt/UpdatedAt removed - internal timestamps
    }

    /// <summary>
    /// Public view of volunteer skill data
    /// </summary>
    public class PublicVolunteerSkillDTO
    {
        public int SkillId { get; set; }
        public string SkillName { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string ProficiencyLevel { get; set; } = string.Empty;
        public int YearsOfExperience { get; set; }
        public string? Description { get; set; }
    }

    /// <summary>
    /// Filters for public volunteer search
    /// </summary>
    public class PublicVolunteerFiltersDTO
    {
        public string? Search { get; set; }
        public int? SkillId { get; set; }
        public string? University { get; set; }
        public string? Province { get; set; }
        public bool? IsVerified { get; set; }
        public int Page { get; set; } = 1;
        public int Size { get; set; } = 20;
    }
}
