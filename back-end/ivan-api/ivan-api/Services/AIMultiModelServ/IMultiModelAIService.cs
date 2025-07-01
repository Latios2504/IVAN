using ivan_api.DTOs;
using ivan_api.DTOs.AIDatabaseManage;

namespace ivan_api.Services.AIMultiModelServ;

public interface IMultiModelAIService
{
    // Model Management
    Task<List<AIModelConfigurationDTO>> GetAvailableModelsAsync();
    Task<AIModelConfigurationDTO> GetOptimalModelForQueryAsync(string query, string category);
    Task<bool> ConfigureModelAsync(AIModelConfigurationDTO configuration);
    
    // Multi-Model Processing
    Task<AIModelResponseDTO> ProcessWithBestModelAsync(string query, string category, string? instructionProfile = null);
    Task<AIModelResponseDTO> ProcessWithFallbackAsync(string query, string category, string? instructionProfile = null);
    Task<List<AIModelResponseDTO>> ProcessWithMultipleModelsAsync(string query, string category, int maxModels = 3);
    
    // Model Health & Performance
    Task<Dictionary<string, bool>> CheckModelHealthAsync();
    Task<Dictionary<string, double>> GetModelPerformanceMetricsAsync();
    Task<AIModelResponseDTO> TestModelAsync(string modelId, string testQuery);
    
    // Specialized Processing
    Task<AIModelResponseDTO> ProcessDataAnalysisQueryAsync(string query, Dictionary<string, object> data);
    Task<AIModelResponseDTO> ProcessConversationQueryAsync(string query, string conversationContext);
    Task<AIModelResponseDTO> ProcessEmergencyQueryAsync(string query); // High priority with fastest model
}
