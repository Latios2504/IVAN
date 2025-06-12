using System;
using System.Collections.Generic;

namespace WebAPI.Data.Entities;

public partial class ChatbotInteraction
{
    public int InteractionId { get; set; }

    public int UserId { get; set; }

    public string Question { get; set; } = null!;

    public string Response { get; set; } = null!;

    public DateTime? InteractionDate { get; set; }

    public virtual User User { get; set; } = null!;
}
