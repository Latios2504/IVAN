namespace ivan_api.DTOs.OrganizationProfiles
{
    /// <summary>
    /// Public view of organization data - excludes sensitive business information
    /// </summary>
    public class PublicOrganizationDTO
    {
        public int OrganizationId { get; set; }
        public string OrganizationName { get; set; } = string.Empty;
        public string? ShortName { get; set; }
        public string TypeName { get; set; } = string.Empty; 
        public int? EstablishedYear { get; set; }
        public string? Website { get; set; }
        public string? FacebookPage { get; set; }
        public string? LinkedInPage { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Description { get; set; }
        public string? Mission { get; set; }
        public string? Vision { get; set; }
        public string? Address { get; set; }
        public string? WardCommune { get; set; }
        public string? District { get; set; }
        public string? Province { get; set; }
        public string? LogoUrl { get; set; }
        public string? BannerUrl { get; set; }
        public bool IsVerified { get; set; }
        public decimal Rating { get; set; }
        public int RatingCount { get; set; }
        public int TotalEvents { get; set; }
        public int TotalVolunteers { get; set; }
    }

    /// <summary>
    /// Filters for public organization search
    /// </summary>
    public class PublicOrganizationFiltersDTO
    {
        public string? Search { get; set; }
        public int? TypeId { get; set; }
        public string? Province { get; set; }
        public bool? IsVerified { get; set; }
        public int Page { get; set; } = 1;
        public int Size { get; set; } = 20;
    }
}
