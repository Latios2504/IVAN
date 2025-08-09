using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace ivan_api.DTOs.AI;

/// <summary>
/// DTO for AI query request
/// </summary>
public class AiQueryRequest
{
    [Required(ErrorMessage = "Query is required")]
    public string Query { get; set; } = string.Empty;
    
    public int? CustomInstructionId { get; set; }
    
    public string? PreferredModel { get; set; }
    
    public bool IncludeContext { get; set; } = true;

    // Optional client-provided memory (no database storage)
    public string? ConversationId { get; set; }

    public List<ChatMessageDto>? ClientMessages { get; set; }

    public string? ClientSummary { get; set; }
}

/// <summary>
/// DTO for AI query response
/// </summary>
public class AiQueryResponse 
{
    public bool Success { get; set; }
    public string Response { get; set; } = string.Empty;
    public string ModelUsed { get; set; } = string.Empty;
    public long ExecutionTimeMs { get; set; }
    public string? ErrorMessage { get; set; }
    public string GeneratedAt { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ");
    public string? CustomInstructionUsed { get; set; }
} 

/// <summary>
/// Minimal chat message payload provided by the client to enable stateless memory
/// </summary>
public class ChatMessageDto
{
    public string Role { get; set; } = "user"; // "user" | "assistant"
    public string Content { get; set; } = string.Empty;
    public string? Timestamp { get; set; }
}