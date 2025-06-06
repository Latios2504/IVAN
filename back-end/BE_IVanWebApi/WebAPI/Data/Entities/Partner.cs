using System;
using System.Collections.Generic;

namespace WebAPI.Data.Entities;

public partial class Partner
{
    public int PartnerId { get; set; }

    public int UserId { get; set; }

    public string CompanyName { get; set; } = null!;

    public int IndustryId { get; set; }

    public string? TaxCode { get; set; }

    public string? BusinessLicense { get; set; }

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

    public string? LogoUrl { get; set; }

    public bool? IsVerified { get; set; }

    public DateTime? VerifiedAt { get; set; }

    public int? VerifiedBy { get; set; }

    public decimal? Rating { get; set; }

    public int? RatingCount { get; set; }

    public int? TotalCollaborations { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual PartnerIndustry Industry { get; set; } = null!;

    public virtual ICollection<PartnerCollaboration> PartnerCollaborations { get; set; } = new List<PartnerCollaboration>();

    public virtual User User { get; set; } = null!;

    public virtual User? VerifiedByNavigation { get; set; }
}
