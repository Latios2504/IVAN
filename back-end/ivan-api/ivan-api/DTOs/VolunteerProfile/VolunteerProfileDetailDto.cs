namespace ivan_api.DTOs.VolunteerProfile
{
    // DTO chi tiết, khi volunteer click vào xem detail
    public class VolunteerProfileDetailDto
    {
        public int VolunteerId { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? PhoneNumber { get; set; }

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
