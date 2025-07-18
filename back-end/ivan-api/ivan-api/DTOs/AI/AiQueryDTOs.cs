using System.ComponentModel.DataAnnotations;

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