namespace ivan_api.DTOs.VolunteerProfile
{
    public class VolunteerSkillCreateDto
    {
        public int SkillId { get; set; }
        public string? ProficiencyLevel { get; set; }
        public int? YearsOfExperience { get; set; }
        public string? Description { get; set; }
    }

    public class VolunteerSkillUpdateDto
    {
        public int SkillId { get; set; }
        public string? ProficiencyLevel { get; set; }
        public int? YearsOfExperience { get; set; }
        public string? Description { get; set; }
    }
}