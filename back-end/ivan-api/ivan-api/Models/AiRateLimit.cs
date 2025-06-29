using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class AiRateLimit
{
    public int RateLimitId { get; set; }

    public int UserId { get; set; }

    public string Operation { get; set; } = null!;

    public int RequestCount { get; set; }

    public DateTime WindowStart { get; set; }

    public DateTime WindowEnd { get; set; }

    public DateTime LastRequestAt { get; set; }

    public bool IsBlocked { get; set; }

    public DateTime? BlockedUntil { get; set; }

    public virtual User User { get; set; } = null!;
}
