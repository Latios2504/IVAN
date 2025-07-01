using System;
using System.Collections.Generic;

namespace WebAPI.Data.Entities;

public partial class PartnerIndustry
{
    public int IndustryId { get; set; }

    public string IndustryName { get; set; } = null!;

    public string? Description { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Partner> Partners { get; set; } = new List<Partner>();
}
