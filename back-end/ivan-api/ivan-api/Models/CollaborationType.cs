using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class CollaborationType
{
    public int TypeId { get; set; }

    public string TypeName { get; set; } = null!;

    public string? Description { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<PartnerCollaboration> PartnerCollaborations { get; set; } = new List<PartnerCollaboration>();
}
