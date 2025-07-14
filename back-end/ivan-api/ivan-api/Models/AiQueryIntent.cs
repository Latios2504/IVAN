using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class AiQueryIntent
{
    public int IntentId { get; set; }

    public int UserId { get; set; }

    public string? ConversationId { get; set; }

    public string QueryText { get; set; } = null!;

    public string? DetectedIntent { get; set; }

    public string? EntityMentions { get; set; }

    public bool? IsCorrect { get; set; }

    public string? CorrectedIntent { get; set; }

    public int? ProcessingTimeMs { get; set; }

    public int? ResponseQuality { get; set; }

    public string? DataTablesAccessed { get; set; }

    public int? InstructionId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual AiCustomInstruction? Instruction { get; set; }

    public virtual User User { get; set; } = null!;
}
