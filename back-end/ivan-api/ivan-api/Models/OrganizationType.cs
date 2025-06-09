using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class OrganizationType
{
    public int TypeId { get; set; }

    public string TypeName { get; set; } = null!;

    public string? Description { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Organization> Organizations { get; set; } = new List<Organization>();
}
