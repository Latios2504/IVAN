using ivan_api.DTOs;
using ivan_api.DTOs.AIDatabaseManage;
using ivan_api.Configuration;
using Microsoft.Extensions.Options;

namespace ivan_api.Services.AIMultiModelServ;

public class MultiModelAIService : IMultiModelAIService
{
    private readonly GeminiConfiguration _geminiConfig;
    private readonly IChatBotService _chatBotService;
    private readonly ILogger<MultiModelAIService> _logger;

    // Model configurations with fallback hierarchy
    private readonly List<AIModelConfigurationDTO> _availableModels;

    public MultiModelAIService(
        IOptions<GeminiConfiguration> geminiConfig, 
        IChatBotService chatBotService,
        ILogger<MultiModelAIService> logger)
    {
        _geminiConfig = geminiConfig.Value;
        _chatBotService = chatBotService;
        _logger = logger;

        _availableModels = InitializeDefaultModels();
    }

    public async Task<List<AIModelConfigurationDTO>> GetAvailableModelsAsync()
    {
        return _availableModels.Where(m => m.IsActive).OrderBy(m => m.Priority).ToList();
    }

    public async Task<AIModelConfigurationDTO> GetOptimalModelForQueryAsync(string query, string category)
    {
        try
        {
            var queryComplexity = AnalyzeQueryComplexity(query);
            var categoryModels = _availableModels
                .Where(m => m.IsActive && (m.SupportedCategories.Contains(category) || m.SupportedCategories.Contains("All")))
                .OrderBy(m => m.Priority)
                .ToList();

            // Choose model based on complexity and category
            var optimalModel = queryComplexity switch
            {
                "High" => categoryModels.FirstOrDefault(m => m.ModelType == "Analysis") ?? categoryModels.First(),
                "Medium" => categoryModels.FirstOrDefault(m => m.ModelType == "Chat") ?? categoryModels.First(),
                _ => categoryModels.First()
            };

            return optimalModel;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting optimal model for query category {Category}", category);
            return _availableModels.First(m => m.IsActive);
        }
    }

    public async Task<bool> ConfigureModelAsync(AIModelConfigurationDTO configuration)
    {
        try
        {
            var existingModel = _availableModels.FirstOrDefault(m => m.ModelId == configuration.ModelId);
            if (existingModel != null)
            {
                // Update existing model configuration
                existingModel.IsActive = configuration.IsActive;
                existingModel.Priority = configuration.Priority;
                existingModel.Configuration = configuration.Configuration;
                existingModel.SupportedCategories = configuration.SupportedCategories;
            }
            else
            {
                _availableModels.Add(configuration);
            }

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error configuring model {ModelId}", configuration.ModelId);
            return false;
        }
    }

    public async Task<AIModelResponseDTO> ProcessWithBestModelAsync(string query, string category, string? instructionProfile = null)
    {
        var startTime = DateTime.UtcNow;

        try
        {
            var optimalModel = await GetOptimalModelForQueryAsync(query, category);
            
            // For now, we'll use the existing Gemini service as our primary model
            // In a full implementation, this would route to different AI services
            var response = await ProcessWithModel(optimalModel, query, instructionProfile);

            var executionTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;

            return new AIModelResponseDTO
            {
                ModelUsed = optimalModel.ModelName,
                Response = response,
                ExecutionTimeMs = executionTime,
                ConfidenceScore = CalculateConfidenceScore(response, category),
                IsFallbackUsed = false,
                ModelMetadata = new Dictionary<string, object>
                {
                    ["model_id"] = optimalModel.ModelId,
                    ["provider"] = optimalModel.Provider,
                    ["model_type"] = optimalModel.ModelType,
                    ["query_complexity"] = AnalyzeQueryComplexity(query)
                }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing with best model for category {Category}", category);
            return await ProcessWithFallbackAsync(query, category, instructionProfile);
        }
    }

    public async Task<AIModelResponseDTO> ProcessWithFallbackAsync(string query, string category, string? instructionProfile = null)
    {
        var startTime = DateTime.UtcNow;

        try
        {
            var fallbackModels = _availableModels
                .Where(m => m.IsActive && m.IsFallback)
                .OrderBy(m => m.Priority)
                .ToList();

            foreach (var model in fallbackModels)
            {
                try
                {
                    var response = await ProcessWithModel(model, query, instructionProfile);
                    var executionTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;

                    return new AIModelResponseDTO
                    {
                        ModelUsed = model.ModelName,
                        Response = response,
                        ExecutionTimeMs = executionTime,
                        ConfidenceScore = CalculateConfidenceScore(response, category) * 0.8, // Lower confidence for fallback
                        IsFallbackUsed = true,
                        ModelMetadata = new Dictionary<string, object>
                        {
                            ["model_id"] = model.ModelId,
                            ["provider"] = model.Provider,
                            ["fallback_reason"] = "Primary model failed"
                        }
                    };
                }
                catch (Exception modelEx)
                {
                    _logger.LogWarning(modelEx, "Fallback model {ModelId} failed, trying next", model.ModelId);
                    continue;
                }
            }

            // Ultimate fallback - return a static response
            return new AIModelResponseDTO
            {
                ModelUsed = "Emergency Fallback",
                Response = "Xin lỗi, hệ thống AI đang gặp sự cố tạm thời. Vui lòng thử lại sau ít phút.",
                ExecutionTimeMs = (int)(DateTime.UtcNow - startTime).TotalMilliseconds,
                ConfidenceScore = 0.1,
                IsFallbackUsed = true,
                ModelMetadata = new Dictionary<string, object>
                {
                    ["fallback_reason"] = "All models failed"
                }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in fallback processing for category {Category}", category);
            throw;
        }
    }

    public async Task<List<AIModelResponseDTO>> ProcessWithMultipleModelsAsync(string query, string category, int maxModels = 3)
    {
        var responses = new List<AIModelResponseDTO>();
        var availableModels = await GetAvailableModelsAsync();
        var selectedModels = availableModels.Take(maxModels).ToList();

        var tasks = selectedModels.Select(async model =>
        {
            try
            {
                var startTime = DateTime.UtcNow;
                var response = await ProcessWithModel(model, query, null);
                var executionTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;

                return new AIModelResponseDTO
                {
                    ModelUsed = model.ModelName,
                    Response = response,
                    ExecutionTimeMs = executionTime,
                    ConfidenceScore = CalculateConfidenceScore(response, category),
                    IsFallbackUsed = false,
                    ModelMetadata = new Dictionary<string, object>
                    {
                        ["model_id"] = model.ModelId,
                        ["provider"] = model.Provider
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Model {ModelId} failed in multi-model processing", model.ModelId);
                return null;
            }
        });

        var results = await Task.WhenAll(tasks);
        return results.Where(r => r != null).Cast<AIModelResponseDTO>().ToList();
    }

    public async Task<Dictionary<string, bool>> CheckModelHealthAsync()
    {
        var healthStatus = new Dictionary<string, bool>();
        var testQuery = "Hello, are you working?";

        foreach (var model in _availableModels.Where(m => m.IsActive))
        {
            try
            {
                var response = await TestModelAsync(model.ModelId, testQuery);
                healthStatus[model.ModelId] = !string.IsNullOrEmpty(response.Response);
            }
            catch
            {
                healthStatus[model.ModelId] = false;
            }
        }

        return healthStatus;
    }

    public async Task<Dictionary<string, double>> GetModelPerformanceMetricsAsync()
    {
        var metrics = new Dictionary<string, double>();
        var testQueries = new[]
        {
            "What is the current time?",
            "Explain volunteer management",
            "Analyze data trends"
        };

        foreach (var model in _availableModels.Where(m => m.IsActive))
        {
            try
            {
                var times = new List<int>();
                
                foreach (var query in testQueries)
                {
                    var response = await TestModelAsync(model.ModelId, query);
                    times.Add(response.ExecutionTimeMs);
                }

                metrics[model.ModelId] = times.Average();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get performance metrics for model {ModelId}", model.ModelId);
                metrics[model.ModelId] = double.MaxValue;
            }
        }

        return metrics;
    }

    public async Task<AIModelResponseDTO> TestModelAsync(string modelId, string testQuery)
    {
        var model = _availableModels.FirstOrDefault(m => m.ModelId == modelId);
        if (model == null)
            throw new ArgumentException($"Model {modelId} not found");

        var startTime = DateTime.UtcNow;

        try
        {
            var response = await ProcessWithModel(model, testQuery, null);
            var executionTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;

            return new AIModelResponseDTO
            {
                ModelUsed = model.ModelName,
                Response = response,
                ExecutionTimeMs = executionTime,
                ConfidenceScore = CalculateConfidenceScore(response, "Test"),
                IsFallbackUsed = false,
                ModelMetadata = new Dictionary<string, object>
                {
                    ["test_query"] = testQuery,
                    ["test_time"] = DateTime.UtcNow
                }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error testing model {ModelId}", modelId);
            throw;
        }
    }

    public async Task<AIModelResponseDTO> ProcessDataAnalysisQueryAsync(string query, Dictionary<string, object> data)
    {
        var analysisModel = _availableModels
            .FirstOrDefault(m => m.IsActive && m.ModelType == "Analysis")
            ?? _availableModels.First(m => m.IsActive);

        var enhancedQuery = $"{query}\n\nDữ liệu để phân tích:\n{FormatDataForAnalysis(data)}";
        
        return await ProcessWithBestModelAsync(enhancedQuery, "Data Analysis");
    }

    public async Task<AIModelResponseDTO> ProcessConversationQueryAsync(string query, string conversationContext)
    {
        var chatModel = _availableModels
            .FirstOrDefault(m => m.IsActive && m.ModelType == "Chat")
            ?? _availableModels.First(m => m.IsActive);

        var contextualQuery = $"Ngữ cảnh cuộc hội thoại:\n{conversationContext}\n\nCâu hỏi hiện tại: {query}";
        
        return await ProcessWithBestModelAsync(contextualQuery, "Conversation");
    }

    public async Task<AIModelResponseDTO> ProcessEmergencyQueryAsync(string query)
    {
        var fastestModel = _availableModels
            .Where(m => m.IsActive)
            .OrderBy(m => m.Priority)
            .First();

        try
        {
            return await ProcessWithBestModelAsync(query, "Emergency");
        }
        catch
        {
            // Emergency fallback - immediate response
            return new AIModelResponseDTO
            {
                ModelUsed = "Emergency System",
                Response = "Đã nhận được yêu cầu khẩn cấp. Đang xử lý và sẽ phản hồi sớm nhất có thể.",
                ExecutionTimeMs = 100,
                ConfidenceScore = 0.5,
                IsFallbackUsed = true,
                ModelMetadata = new Dictionary<string, object>
                {
                    ["emergency"] = true,
                    ["timestamp"] = DateTime.UtcNow
                }
            };
        }
    }

    // Private helper methods
    private List<AIModelConfigurationDTO> InitializeDefaultModels()
    {
        return new List<AIModelConfigurationDTO>
        {
            new()
            {
                ModelId = "gemini-pro",
                ModelName = "Gemini Pro",
                Provider = "Google",
                ModelType = "Chat",
                IsActive = true,
                IsFallback = false,
                Priority = 1,
                SupportedCategories = new List<string> { "All" },
                Configuration = new Dictionary<string, object>
                {
                    ["api_key"] = _geminiConfig.ApiKey,
                    ["max_tokens"] = 2048,
                    ["temperature"] = 0.7
                }
            },
            new()
            {
                ModelId = "gemini-pro-analysis",
                ModelName = "Gemini Pro Analysis",
                Provider = "Google",
                ModelType = "Analysis",
                IsActive = true,
                IsFallback = false,
                Priority = 1,
                SupportedCategories = new List<string> { "Data Analysis", "Trend Analysis", "Analytics" },
                Configuration = new Dictionary<string, object>
                {
                    ["api_key"] = _geminiConfig.ApiKey,
                    ["max_tokens"] = 4096,
                    ["temperature"] = 0.3
                }
            },
            new()
            {
                ModelId = "fallback-basic",
                ModelName = "Basic Fallback",
                Provider = "Internal",
                ModelType = "Chat",
                IsActive = true,
                IsFallback = true,
                Priority = 999,
                SupportedCategories = new List<string> { "All" },
                Configuration = new Dictionary<string, object>()
            }
        };
    }

    private async Task<string> ProcessWithModel(AIModelConfigurationDTO model, string query, string? instructionProfile)
    {
        // For now, route everything through the existing ChatBot service
        // In a full implementation, this would have different handlers for different providers
        
        switch (model.Provider.ToLower())
        {
            case "google":
                return await ProcessWithGemini(query, model, instructionProfile);
            
            case "internal":
                return ProcessWithInternalFallback(query);
            
            default:
                throw new NotSupportedException($"Provider {model.Provider} is not supported");
        }
    }

    private async Task<string> ProcessWithGemini(string query, AIModelConfigurationDTO model, string? instructionProfile)
    {
        try
        {
            // Use the existing ChatBot service
            var request = new ChatMessageRequestDTO
            {
                Message = query,
                ConversationId = Guid.NewGuid().ToString()
            };

            var response = await _chatBotService.SendMessageAsync(1, request);
            return response.Data?.Response ?? "Unable to process request";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing with Gemini model {ModelId}", model.ModelId);
            throw;
        }
    }

    private string ProcessWithInternalFallback(string query)
    {
        // Simple keyword-based responses for emergency fallback
        var queryLower = query.ToLower();

        if (queryLower.Contains("volunteer") || queryLower.Contains("tình nguyện"))
            return "Tôi hiểu bạn đang hỏi về tình nguyện viên. Hệ thống đang được khôi phục, vui lòng thử lại sau ít phút.";

        if (queryLower.Contains("event") || queryLower.Contains("sự kiện"))
            return "Tôi hiểu bạn đang hỏi về sự kiện. Hệ thống đang được khôi phục, vui lòng thử lại sau ít phút.";

        return "Tôi đã nhận được câu hỏi của bạn. Hệ thống AI đang được khôi phục, vui lòng thử lại sau ít phút.";
    }

    private string AnalyzeQueryComplexity(string query)
    {
        var complexityIndicators = new[]
        {
            "analyze", "compare", "trend", "prediction", "correlation",
            "phân tích", "so sánh", "xu hướng", "dự đoán", "tương quan"
        };

        var queryLower = query.ToLower();
        var complexityScore = complexityIndicators.Count(indicator => queryLower.Contains(indicator));

        return complexityScore switch
        {
            >= 2 => "High",
            1 => "Medium",
            _ => "Low"
        };
    }

    private double CalculateConfidenceScore(string response, string category)
    {
        if (string.IsNullOrEmpty(response))
            return 0.0;

        var score = 0.5; // Base score

        // Longer responses typically indicate more comprehensive answers
        if (response.Length > 100) score += 0.2;
        if (response.Length > 300) score += 0.1;

        // Responses with specific data or numbers are more confident
        if (System.Text.RegularExpressions.Regex.IsMatch(response, @"\d+"))
            score += 0.1;

        // Category-specific keywords increase confidence
        var categoryKeywords = GetCategoryKeywords(category);
        var matchingKeywords = categoryKeywords.Count(keyword => 
            response.ToLower().Contains(keyword.ToLower()));
        
        score += Math.Min(matchingKeywords * 0.05, 0.15);

        return Math.Min(score, 1.0);
    }

    private List<string> GetCategoryKeywords(string category)
    {
        return category.ToLower() switch
        {
            "volunteer analytics" => new List<string> { "volunteer", "tình nguyện", "skill", "kỹ năng" },
            "event performance" => new List<string> { "event", "sự kiện", "registration", "đăng ký" },
            "data analysis" => new List<string> { "data", "dữ liệu", "analysis", "phân tích" },
            _ => new List<string>()
        };
    }

    private string FormatDataForAnalysis(Dictionary<string, object> data)
    {
        var formattedData = new List<string>();
        
        foreach (var item in data.Take(10)) // Limit to prevent overwhelming the model
        {
            formattedData.Add($"- {item.Key}: {item.Value}");
        }

        return string.Join("\n", formattedData);
    }
}
