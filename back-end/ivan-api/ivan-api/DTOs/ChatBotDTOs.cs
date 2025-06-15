namespace ivan_api.DTOs;

public class ChatMessageRequestDTO
{
    public string Message { get; set; } = string.Empty;
    public string? ConversationId { get; set; }
}

public class ChatMessageResponseDTO
{
    public string Response { get; set; } = string.Empty;
    public string ConversationId { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

public class GeminiRequestDTO
{
    public List<ContentPart> Contents { get; set; } = new();
    public GenerationConfig? GenerationConfig { get; set; }
}

public class ContentPart
{
    public List<TextPart> Parts { get; set; } = new();
}

public class TextPart
{
    public string Text { get; set; } = string.Empty;
}

public class GenerationConfig
{
    public double Temperature { get; set; }
    public int MaxOutputTokens { get; set; }
}

public class GeminiResponseDTO
{
    public List<CandidateResponse> Candidates { get; set; } = new();
}

public class CandidateResponse
{
    public ContentPart Content { get; set; } = new();
}
