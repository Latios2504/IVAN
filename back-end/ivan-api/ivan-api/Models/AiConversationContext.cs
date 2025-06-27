using System;

namespace ivan_api.Models;

public partial class AiConversationContext
{
    public int ContextId { get; set; }

    public string ConversationId { get; set; } = null!;

    public int UserId { get; set; }

    public int? InstructionId { get; set; }

    public string? SessionData { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual User User { get; set; } = null!;

    public virtual AiCustomInstruction? Instruction { get; set; }
}
