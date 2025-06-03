using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Data.Entities
{
    //[Table("partner_profiles")]
    public class PartnerProfile
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        [MaxLength(200)]
        public string PartnerName { get; set; } = null!;
        [MaxLength(50)]
        public string? PartnerType { get; set; }
        [MaxLength(100)]
        public string? Industry { get; set; }
        [MaxLength(50)]
        public string? CompanySize { get; set; }
        [MaxLength(1000)]
        public string? Description { get; set; }
        [MaxLength(1000)]
        public string? ServicesOffered { get; set; }
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
        public string? PrimaryContactName { get; set; }
        [MaxLength(100)]
        public string? PrimaryContactTitle { get; set; }
        [MaxLength(255)]
        public string? PrimaryContactEmail { get; set; }
        [MaxLength(20)]
        public string? PrimaryContactPhone { get; set; }
        [MaxLength(500)]
        public string? LogoUrl { get; set; }
        [MaxLength(1000)]
        public string? PartnershipInterests { get; set; }
        [MaxLength(1000)]
        public string? ResourcesAvailable { get; set; }
        [MaxLength(1000)]
        public string? CsrFocusAreas { get; set; }

        public decimal? AnnualContributionBudget { get; set; }
        [MaxLength(1000)]
        public string? PreferredPartnershipTypes { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<PartnerCollaboration> PartnerCollaborations { get; set; } = new List<PartnerCollaboration>();

        public virtual User User { get; set; } = null!;
    }
}
