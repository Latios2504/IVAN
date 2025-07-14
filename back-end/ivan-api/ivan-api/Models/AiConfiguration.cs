using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class AiConfiguration
{
    public string ConfigKey { get; set; } = null!;

    public string ConfigValue { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
