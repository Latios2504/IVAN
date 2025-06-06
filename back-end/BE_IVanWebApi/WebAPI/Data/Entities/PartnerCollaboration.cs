using System;
using System.Collections.Generic;

namespace WebAPI.Data.Entities;

public partial class PartnerCollaboration
{
    public int CollaborationId { get; set; }

    public int OrganizationId { get; set; }

    public int PartnerId { get; set; }

    public int TypeId { get; set; }

    public string CollaborationName { get; set; } = null!;

    public string? Description { get; set; }

    public string? Objectives { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public string? Status { get; set; }

    public decimal? Budget { get; set; }

    public string? Currency { get; set; }

    public string? ContractDocumentUrl { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Organization Organization { get; set; } = null!;

    public virtual Partner Partner { get; set; } = null!;

    public virtual CollaborationType Type { get; set; } = null!;
}
