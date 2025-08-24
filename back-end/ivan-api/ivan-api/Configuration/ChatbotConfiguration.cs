namespace ivan_api.Configuration;

/// <summary>
/// Configuration for chatbot default behavior
/// </summary>
public class ChatbotConfiguration
{
    /// <summary>
    /// Default Custom Instruction ID to use for all chatbot conversations
    /// If null, chatbot will work without custom instructions
    /// </summary>
    public int? DefaultCustomInstructionId { get; set; }
    
    /// <summary>
    /// Whether to enable custom instructions for chatbot
    /// </summary>
    public bool EnableCustomInstructions { get; set; } = true;
    
    /// <summary>
    /// Cache duration for default custom instruction in minutes
    /// </summary>
    public int CacheDurationMinutes { get; set; } = 30;
    
    /// <summary>
    /// Fallback behavior when default custom instruction is not found
    /// </summary>
    public ChatbotFallbackBehavior FallbackBehavior { get; set; } = ChatbotFallbackBehavior.UseWithoutInstructions;
}

/// <summary>
/// Defines how chatbot should behave when default custom instruction is not available
/// </summary>
public enum ChatbotFallbackBehavior
{
    /// <summary>
    /// Continue working without custom instructions
    /// </summary>
    UseWithoutInstructions,
    
    /// <summary>
    /// Return error message to user
    /// </summary>
    ReturnError,
    
    /// <summary>
    /// Use a predefined fallback instruction
    /// </summary>
    UseFallbackInstruction
}