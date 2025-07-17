namespace ivan_api.DTOs.PartnerProfiles
{
    public class PartnerProfileUpdateModel
    {
        public int UserId { get; set; }

        public string CompanyName { get; set; } = null!;

        public int IndustryId { get; set; }

        public string? Website { get; set; }

        public string? Description { get; set; }

        public string? Address { get; set; }

        public string? WardCommune { get; set; }

        public string? District { get; set; }

        public string? Province { get; set; }

        public string? PostalCode { get; set; }

        public string? ContactPersonName { get; set; }

        public string? ContactPersonTitle { get; set; }

        public string? ContactEmail { get; set; }

        public string? ContactPhone { get; set; }

        public decimal? Rating { get; set; }

        public int? RatingCount { get; set; }

        public int? TotalCollaborations { get; set; }

        public bool? IsActive { get; set; }

        //public int UserId { get; set; }
        //public string PartnerName { get; set; } = null!;
        //public string? PartnerType { get; set; }
        //public string? Industry { get; set; }
        //public string? CompanySize { get; set; }
        //public string? Description { get; set; }
        //public string? ServicesOffered { get; set; }
        //public string? WebsiteUrl { get; set; }
        //public string? Phone { get; set; }
        //public string? Email { get; set; }
        //public string? Address { get; set; }
        //public string? City { get; set; }
        //public string? State { get; set; }
        //public string? PostalCode { get; set; }
        //public string? Country { get; set; }
        //public string? PrimaryContactName { get; set; }
        //public string? PrimaryContactTitle { get; set; }
        //public string? PrimaryContactEmail { get; set; }
        //public string? PrimaryContactPhone { get; set; }
        //public string? LogoUrl { get; set; }
        //public string? PartnershipInterests { get; set; }
        //public string? ResourcesAvailable { get; set; }
        //public string? CsrFocusAreas { get; set; }
        //public decimal? AnnualContributionBudget { get; set; }
        //public string? PreferredPartnershipTypes { get; set; }
        //public DateTime? CreatedAt { get; set; }
        //public DateTime? UpdatedAt { get; set; }
    }
}
