namespace ivan_api.DTOs.OrganizationProfiles
{
    /// <summary>
    /// DTO for Organization Types lookup data
    /// </summary>
    public class OrganizationTypeDto
    {
        public int TypeId { get; set; }
        public string TypeName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }
}
