using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class SupportRequestComment
{
    public int CommentId { get; set; }

    public int RequestId { get; set; }

    public int UserId { get; set; }

    public string Comment { get; set; } = null!;

    public bool? IsInternal { get; set; }

    public string? AttachmentUrls { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual SupportRequest Request { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
