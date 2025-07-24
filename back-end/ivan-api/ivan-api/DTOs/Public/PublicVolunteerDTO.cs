namespace ivan_api.DTOs.Public
{
    /// <summary>
    /// Public view of volunteer data - excludes sensitive personal information
    /// </summary>
    public class PublicVolunteerDTO
    {
        public int VolunteerId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? ProfilePicture { get; set; }
        public string? Bio { get; set; }
        public string? University { get; set; }
        public string? Major { get; set; }
        public int? YearOfStudy { get; set; }
        public string? Experience { get; set; }
        public string? Availability { get; set; }
        public string? Province { get; set; }
        public int VolunteerHours { get; set; }
        public decimal? Rating { get; set; }
        public int ReviewCount { get; set; }
        public bool IsVerified { get; set; }
        public DateTime? VerifiedAt { get; set; }
        public List<PublicVolunteerSkillDTO> Skills { get; set; } = new();
    }

    /// <summary>
    /// Public view of volunteer skill data
    /// </summary>
    public class PublicVolunteerSkillDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
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