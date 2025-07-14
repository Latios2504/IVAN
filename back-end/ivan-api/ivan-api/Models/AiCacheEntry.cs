using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class AiCacheEntry
{
    public int CacheId { get; set; }

    public string CacheKey { get; set; } = null!;

    public string CacheValue { get; set; } = null!;

    public DateTime ExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? UserId { get; set; }

    public virtual User? User { get; set; }
}
