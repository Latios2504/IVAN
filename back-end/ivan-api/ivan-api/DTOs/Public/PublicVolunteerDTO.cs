namespace ivan_api.DTOs.Public
{
    /// <summary>
    /// Public view of volunteer data - excludes sensitive personal information
    /// </summary>
    public class PublicVolunteerDTO
    {
        public int VolunteerId { get; set; }
        public int UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Avatar { get; set; }
        public string? Address { get; set; }
        public string? WardCommune { get; set; }
        public string? District { get; set; }
        public string? Province { get; set; }
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
        public DateTime? LastActiveDate { get; set; }
        public int TotalHoursVolunteered { get; set; }
        public string? Skills { get; set; }
        public List<PublicVolunteerSkillDTO> SkillsList { get; set; } = new();
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
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