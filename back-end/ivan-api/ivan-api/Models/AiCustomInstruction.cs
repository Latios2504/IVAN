using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class AiCustomInstruction
{
    public int InstructionId { get; set; }

    public string InstructionName { get; set; } = null!;

    public string SystemPrompt { get; set; } = null!;

    public string? BehaviorInstructions { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
