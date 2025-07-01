using System;
using System.Collections.Generic;

namespace WebAPI.Data.Entities;

public partial class Feedback
{
    public int FeedbackId { get; set; }

    public int EventId { get; set; }

    public int UserId { get; set; }

    public int CategoryId { get; set; }

    public string Subject { get; set; } = null!;

    public string Content { get; set; } = null!;

    public int? Rating { get; set; }

    public bool? IsAnonymous { get; set; }

    public string? Status { get; set; }

    public string? ResponseContent { get; set; }

    public int? RespondedBy { get; set; }

    public DateTime? RespondedAt { get; set; }

    public bool? IsPublic { get; set; }

    public bool? IsVerified { get; set; }

    public string? AttachmentUrls { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual FeedbackCategory Category { get; set; } = null!;

    public virtual Event Event { get; set; } = null!;

    public virtual User? RespondedByNavigation { get; set; }

    public virtual User User { get; set; } = null!;
}
