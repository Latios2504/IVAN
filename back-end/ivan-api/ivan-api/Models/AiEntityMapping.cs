using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class AiEntityMapping
{
    public int MappingId { get; set; }

    public string InputText { get; set; } = null!;

    public string EntityType { get; set; } = null!;

    public int EntityId { get; set; }

    public string EntityTable { get; set; } = null!;

    public decimal ConfidenceScore { get; set; }

    public string? MatchingAlgorithm { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
