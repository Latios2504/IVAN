namespace ivan_api.DTOs.OrganizationProfiles
{
    public class OrganizationProfileInputModel
    {
        public int UserId { get; set; }

        public string OrganizationName { get; set; } = null!;

        public string? ShortName { get; set; }

        public int TypeId { get; set; }

        public string? TaxCode { get; set; }

        public string? BusinessLicense { get; set; }

        public int? EstablishedYear { get; set; }

        public string? Website { get; set; }

        public string? FacebookPage { get; set; }

        public string? LinkedInPage { get; set; }

        public string? Description { get; set; }

        public string? Mission { get; set; }

        public string? Vision { get; set; }

        public string? Address { get; set; }

        public string? WardCommune { get; set; }

        public string? District { get; set; }

        public string? Province { get; set; }

        public string? PostalCode { get; set; }

        public string? ContactPersonName { get; set; }

        public string? ContactPersonTitle { get; set; }

        public string? ContactEmail { get; set; }

        public string? ContactPhone { get; set; }

        public string? LogoUrl { get; set; }

        public string? BannerUrl { get; set; }

        public bool? IsVerified { get; set; }

        public DateTime? VerifiedAt { get; set; }

        public int? VerifiedBy { get; set; }

        public decimal? Rating { get; set; }

        public int? RatingCount { get; set; }

        public int? TotalEvents { get; set; }

        public int? TotalVolunteers { get; set; }

        public bool? IsActive { get; set; }

        public DateTime? CreatedAt { get; set; } = DateTime.Now;

        public DateTime? UpdatedAt { get; set; } = DateTime.Now;

        //public int UserId { get; set; }

        //public string OrganizationName { get; set; } = null!;

        //public string? OrganizationType { get; set; }

        //public string? RegistrationNumber { get; set; }

        //public string? TaxId { get; set; }

        //public string? Description { get; set; }

        //public string? MissionStatement { get; set; }

        //public string? WebsiteUrl { get; set; }

        //public string? Phone { get; set; }

        //public string? Email { get; set; }

        //public string? Address { get; set; }

        //public string? City { get; set; }

        //public string? State { get; set; }

        //public string? PostalCode { get; set; }

        //public string? Country { get; set; }

        //public string? ContactPersonName { get; set; }

        //public string? ContactPersonTitle { get; set; }

        //public string? ContactPersonEmail { get; set; }

        //public string? ContactPersonPhone { get; set; }

        //public string? LogoUrl { get; set; }

        //public string? BannerUrl { get; set; }

        //public string? SocialMediaLinks { get; set; }

        //public short? FoundedYear { get; set; }

        //public int? EmployeeCount { get; set; }

        //public decimal? AnnualBudget { get; set; }

        //public string? FocusAreas { get; set; }

        //public bool? IsVerified { get; set; } = false;

        //public string? VerificationDocuments { get; set; }

        //public DateTime? CreatedAt { get; set; } = DateTime.Now;

        //public DateTime? UpdatedAt { get; set; } = DateTime.Now;
    }
}
