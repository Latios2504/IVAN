namespace ivan_api.DTOs.VolunteerProfile
{
    public class VolunteerProfileCreateDto
    {
        public int UserId { get; set; }
        public string? StudentId { get; set; }
        public string? University { get; set; }
        public string? Major { get; set; }
        public int? YearOfStudy { get; set; }
        public string? Motivation { get; set; }
        public string? Experience { get; set; }
        public string? Availability { get; set; }
        public List<VolunteerSkillCreateDto> Skills { get; set; } = new();
    }
}
