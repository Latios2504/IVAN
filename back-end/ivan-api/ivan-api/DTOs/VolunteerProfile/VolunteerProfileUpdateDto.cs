namespace ivan_api.DTOs.VolunteerProfile
{
    public class VolunteerProfileUpdateDto
    {
        // DTO cho cập nhật hồ sơ tình nguyện viên (FE-02 Update)
            public string? StudentId { get; set; }
            public string? University { get; set; }
            public string? Major { get; set; }
            public int? YearOfStudy { get; set; }
            public string? Motivation { get; set; }
            public string? Experience { get; set; }
            public string? Availability { get; set; }
            public List<VolunteerSkillUpdateDto> Skills { get; set; } = new();
    }
}
