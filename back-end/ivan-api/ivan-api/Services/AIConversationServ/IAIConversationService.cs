using ivan_api.DTOs;
using ivan_api.DTOs.AIDatabaseManage;

namespace ivan_api.Services.AIConversationServ;

public interface IAIConversationService
{
    // Conversation Management - matching controller usage exactly
    Task<AIConversationContextDTO> StartConversationAsync(int userId, string? instructionProfile = null, Dictionary<string, object>? initialContext = null);
    Task<AIConversationContextDTO> ContinueConversationAsync(string conversationId, string query, string? queryCategory = null);
    Task<AIConversationContextDTO> GetConversationContextAsync(string conversationId);
    Task<List<ConversationHistoryDTO>> GetConversationHistoryAsync(string conversationId, int limit = 10, int offset = 0);
    Task<List<ConversationSummaryDTO>> GetUserConversationsAsync(int userId, int limit = 10, int offset = 0);
    Task<bool> UpdateConversationContextAsync(string conversationId, Dictionary<string, object>? sessionData = null, string? instructionProfile = null);
    Task<bool> ClearConversationHistoryAsync(string conversationId);
    
    // Original methods for internal use
    Task<AIConversationContextDTO> CreateConversationAsync(int userId, int? instructionId = null);
    Task<AIConversationContextDTO> GetConversationAsync(string conversationId);
    Task<AIConversationContextDTO> UpdateConversationAsync(string conversationId, Dictionary<string, object> sessionData);
    Task<bool> EndConversationAsync(string conversationId);
    
    // Conversation History
    Task AddQueryToHistoryAsync(string conversationId, string query, string response, string category);
    Task<ConversationSummaryDTO> GetConversationSummaryAsync(string conversationId);
    
    // Context-Aware Processing
    Task<string> BuildContextAwarePromptAsync(string conversationId, string newQuery, string? instructionProfile = null);
    Task<List<string>> GetRelevantPastQueriesAsync(string conversationId, string currentQuery, int limit = 5);
    
    // Session Management
    Task<bool> IsConversationActiveAsync(string conversationId);
    Task ExtendConversationAsync(string conversationId, TimeSpan extension);
    Task<List<string>> GetActiveConversationsForUserAsync(int userId);
    
    // Analytics
    Task<ConversationAnalyticsDTO> GetConversationAnalyticsAsync(string conversationId);
    Task<List<ConversationPatternDTO>> AnalyzeConversationPatternsAsync(int userId, TimeSpan period);
}
