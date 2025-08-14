namespace ivan_api.DTOs.VolunteerProfile
{
    /// <summary>
    /// DTO for Skills lookup data
    /// </summary>
    public class SkillDto
    {
        public int SkillId { get; set; }
        public string SkillName { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }
}
