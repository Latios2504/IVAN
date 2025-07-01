namespace ivan_api.DTOs.VolunteerProfile
{
    // DTO riêng cho Skill
    public class VolunteerSkillDto
    {
        public int SkillId { get; set; }
        public string SkillName { get; set; } = null!;
        public string? ProficiencyLevel { get; set; }
        public int? YearsOfExperience { get; set; }
        public string? Description { get; set; }
    }
}
