namespace ivan_api.DTOs.Public
{
    /// <summary>
    /// Public view of partner data - excludes sensitive business information
    /// </summary>
    public class PublicPartnerDTO
    {
        public int PartnerId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string IndustryName { get; set; } = string.Empty; // From PartnerIndustries join
        public string? Website { get; set; }
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? WardCommune { get; set; }
        public string? District { get; set; }
        public string? Province { get; set; }
        public string? LogoUrl { get; set; }
        public bool IsVerified { get; set; }
        public decimal Rating { get; set; }
        public int RatingCount { get; set; }
        public int TotalCollaborations { get; set; }
    }

    /// <summary>
    /// Filters for public partner search
    /// </summary>
    public class PublicPartnerFiltersDTO
    {
        public string? Search { get; set; }
        public int? IndustryId { get; set; }
        public string? Province { get; set; }
        public bool? IsVerified { get; set; }
        public int Page { get; set; } = 1;
        public int Size { get; set; } = 20;
    }
}
