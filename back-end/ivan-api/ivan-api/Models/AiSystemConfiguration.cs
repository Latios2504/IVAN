using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class AiSystemConfiguration
{
    public int ConfigId { get; set; }

    public string ConfigKey { get; set; } = null!;

    public string ConfigValue { get; set; } = null!;

    public string? Description { get; set; }

    public string ConfigType { get; set; } = null!;

    public bool IsSecure { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public int? UpdatedByUserId { get; set; }

    public virtual User? UpdatedByUser { get; set; }
}
