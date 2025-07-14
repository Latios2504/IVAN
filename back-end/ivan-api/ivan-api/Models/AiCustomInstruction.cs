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

    public virtual ICollection<AiQueryIntent> AiQueryIntents { get; set; } = new List<AiQueryIntent>();

    public virtual User CreatedByUser { get; set; } = null!;
}
