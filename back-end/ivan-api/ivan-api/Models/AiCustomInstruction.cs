using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class AiCustomInstruction
{
    public int InstructionId { get; set; }

    public int CreatedByUserId { get; set; }

    public string InstructionName { get; set; } = null!;

    public string SystemPrompt { get; set; } = null!;

    public string? BehaviorInstructions { get; set; }

    public string? DataAccessRules { get; set; }

    public bool? IsActive { get; set; }

    public bool? IsDefault { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<AiConversationContext> AiConversationContexts { get; set; } = new List<AiConversationContext>();

    public virtual ICollection<AiPerformanceMetric> AiPerformanceMetrics { get; set; } = new List<AiPerformanceMetric>();

    public virtual ICollection<AiQueryAnalytic> AiQueryAnalytics { get; set; } = new List<AiQueryAnalytic>();

    public virtual User CreatedByUser { get; set; } = null!;
}
