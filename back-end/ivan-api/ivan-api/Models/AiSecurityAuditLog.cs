using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class AiSecurityAuditLog
{
    public int LogId { get; set; }

    public int UserId { get; set; }

    public string EventType { get; set; } = null!;

    public string Details { get; set; } = null!;

    public string Severity { get; set; } = null!;

    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
