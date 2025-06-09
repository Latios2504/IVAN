using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class SupportCategory
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public string? Description { get; set; }

    public string? Priority { get; set; }

    public int? ExpectedResponseTime { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<SupportRequest> SupportRequests { get; set; } = new List<SupportRequest>();
}
