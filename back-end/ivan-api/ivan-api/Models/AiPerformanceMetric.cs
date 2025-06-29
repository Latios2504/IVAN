using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class AiPerformanceMetric
{
    public int MetricId { get; set; }

    public int UserId { get; set; }

    public int? InstructionId { get; set; }

    public string Query { get; set; } = null!;

    public int ExecutionTimeMs { get; set; }

    public int DataSize { get; set; }

    public string CacheStatus { get; set; } = null!;

    public string QueryCategory { get; set; } = null!;

    public string? OptimizationApplied { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual AiCustomInstruction? Instruction { get; set; }

    public virtual User User { get; set; } = null!;
}
