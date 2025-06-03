using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models.OrganizationProfiles
{
    public class OrganizationProfileViewModel
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string OrganizationName { get; set; } = null!;

        public string? OrganizationType { get; set; }

        public string? RegistrationNumber { get; set; }

        public string? TaxId { get; set; }

        public string? Description { get; set; }

        public string? MissionStatement { get; set; }

        public string? WebsiteUrl { get; set; }

        public string? Phone { get; set; }

        public string? Email { get; set; }

        public string? Address { get; set; }

        public string? City { get; set; }

        public string? State { get; set; }

        public string? PostalCode { get; set; }

        public string? Country { get; set; }

        public string? ContactPersonName { get; set; }

        public string? ContactPersonTitle { get; set; }

        public string? ContactPersonEmail { get; set; }

        public string? ContactPersonPhone { get; set; }

        public string? LogoUrl { get; set; }

        public string? BannerUrl { get; set; }

        public string? SocialMediaLinks { get; set; }

        public short? FoundedYear { get; set; }

        public int? EmployeeCount { get; set; }

        public decimal? AnnualBudget { get; set; }

        public string? FocusAreas { get; set; }

        public bool? IsVerified { get; set; } = false;

        public string? VerificationDocuments { get; set; }

        public DateTime? CreatedAt { get; set; } = DateTime.Now;

        public DateTime? UpdatedAt { get; set; } = DateTime.Now;
    }
}
