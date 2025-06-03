using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Data.Entities
{
    //[Table("organization_profiles")]
    public class OrganizationProfile
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        [MaxLength(200)]
        public string OrganizationName { get; set; } = null!;
        [MaxLength(50)]
        public string? OrganizationType { get; set; }
        [MaxLength(100)]
        public string? RegistrationNumber { get; set; }
        [MaxLength(100)]
        public string? TaxId { get; set; }
        [MaxLength(1000)]
        public string? Description { get; set; }
        [MaxLength(1000)]
        public string? MissionStatement { get; set; }
        [MaxLength(300)]
        public string? WebsiteUrl { get; set; }
        [MaxLength(20)]
        public string? Phone { get; set; }
        [MaxLength(255)]
        public string? Email { get; set; }
        [MaxLength(1000)]
        public string? Address { get; set; }
        [MaxLength(100)]
        public string? City { get; set; }
        [MaxLength(100)]
        public string? State { get; set; }
        [MaxLength(20)]
        public string? PostalCode { get; set; }
        [MaxLength(100)]
        public string? Country { get; set; }
        [MaxLength(200)]
        public string? ContactPersonName { get; set; }
        [MaxLength(100)]
        public string? ContactPersonTitle { get; set; }
        [MaxLength(255)]
        public string? ContactPersonEmail { get; set; }
        [MaxLength(20)]
        public string? ContactPersonPhone { get; set; }
        [MaxLength(500)]
        public string? LogoUrl { get; set; }
        [MaxLength(500)]
        public string? BannerUrl { get; set; }
        [MaxLength(1000)]
        public string? SocialMediaLinks { get; set; }

        public short? FoundedYear { get; set; }

        public int? EmployeeCount { get; set; }

        public decimal? AnnualBudget { get; set; }
        [MaxLength(1000)]
        public string? FocusAreas { get; set; }

        public bool? IsVerified { get; set; } = false;
        [MaxLength(1000)]
        public string? VerificationDocuments { get; set; }

        public DateTime? CreatedAt { get; set; } = DateTime.Now;

        public DateTime? UpdatedAt { get; set; } = DateTime.Now;

        public virtual ICollection<Event> Events { get; set; }
        public virtual ICollection<PartnerCollaboration> PartnerCollaborations { get; set; }
        public virtual ICollection<SupportRequest> SupportRequests { get; set; }
        public virtual User User { get; set; }
    }
}
