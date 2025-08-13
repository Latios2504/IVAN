namespace ivan_api.DTOs.PartnerProfiles
{
    /// <summary>
    /// DTO for Partner Industries lookup data
    /// </summary>
    public class PartnerIndustryDto
    {
        public int IndustryId { get; set; }
        public string IndustryName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }
}
