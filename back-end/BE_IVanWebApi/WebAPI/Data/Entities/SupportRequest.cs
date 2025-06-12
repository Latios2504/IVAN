using System;
using System.Collections.Generic;

namespace WebAPI.Data.Entities;

public partial class SupportRequest
{
    public int RequestId { get; set; }

    public int UserId { get; set; }

    public int CategoryId { get; set; }

    public string Subject { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string? Priority { get; set; }

    public string? Status { get; set; }

    public int? AssignedTo { get; set; }

    public DateTime? AssignedDate { get; set; }

    public string? Resolution { get; set; }

    public int? ResolvedBy { get; set; }

    public DateTime? ResolvedDate { get; set; }

    public int? SatisfactionRating { get; set; }

    public string? SatisfactionFeedback { get; set; }

    public string? AttachmentUrls { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User? AssignedToNavigation { get; set; }

    public virtual SupportCategory Category { get; set; } = null!;

    public virtual User? ResolvedByNavigation { get; set; }

    public virtual ICollection<SupportRequestComment> SupportRequestComments { get; set; } = new List<SupportRequestComment>();

    public virtual User User { get; set; } = null!;
}
