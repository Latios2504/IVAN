using System;

namespace ivan_api.Models;

public partial class AiQueryAnalytic
{
    public int QueryId { get; set; }

    public int UserId { get; set; }

    public int? InstructionId { get; set; }

    public string QueryText { get; set; } = null!;

    public int? ResponseQuality { get; set; }

    public int ExecutionTime { get; set; }

    public string? DataTablesAccessed { get; set; }

    public string? ConversationId { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;

    public virtual AiCustomInstruction? Instruction { get; set; }
}
