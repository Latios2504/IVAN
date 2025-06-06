using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Data_old.Entities
{
    //[Table("partner_collaborations")]
    public class PartnerCollaboration
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int PartnerId { get; set; }

        public int? OrganizationId { get; set; }

        public int? EventId { get; set; }
        [Required]
        public int PartnershipTypeId { get; set; }
        [Required]
        [MaxLength(300)]
        public string Title { get; set; } = null!;
        [MaxLength(1000)]
        public string? Description { get; set; }
        [Required]
        public DateOnly StartDate { get; set; }

        public DateOnly? EndDate { get; set; }
        [MaxLength(50)]
        public string? Status { get; set; }
        [Required]
        [MaxLength(50)]
        public string ContributionType { get; set; } = null!;

        public decimal? FinancialContribution { get; set; }

        public decimal? InKindValue { get; set; }
        [MaxLength(1000)]
        public string? ServicesDescription { get; set; }
        [MaxLength(1000)]
        public string? Deliverables { get; set; }
        [MaxLength(1000)]
        public string? TermsAndConditions { get; set; }
        [MaxLength(200)]
        public string? ContactPersonPartner { get; set; }
        [MaxLength(200)]
        public string? ContactPersonOrganization { get; set; }
        [MaxLength(1000)]
        public string? PerformanceMetrics { get; set; }
        [MaxLength(1000)]
        public string? SuccessCriteria { get; set; }
        [MaxLength(1000)]
        public string? ReportingRequirements { get; set; }
        [MaxLength(200)]
        public string? ContractUrl { get; set; }

        public DateOnly? RenewalDate { get; set; }

        public bool? IsRenewable { get; set; }
        [Required]
        public int CreatedBy { get; set; }

        public int? ApprovedBy { get; set; }

        public DateTime? ApprovedAt { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }


        public virtual User? ApprovedByNavigation { get; set; }

        public virtual User CreatedByNavigation { get; set; } = null!;

        public virtual Event? Event { get; set; }

        public virtual OrganizationProfile? Organization { get; set; }

        public virtual PartnerProfile Partner { get; set; } = null!;

        public virtual PartnershipType PartnershipType { get; set; } = null!;
    }
}
