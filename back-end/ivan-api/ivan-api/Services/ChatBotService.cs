using System.Text;
using System.Text.Json;
using ivan_api.Configuration;
using ivan_api.DTOs;
using ivan_api.DTOs.AIDatabaseManage;
using ivan_api.Services.AIDatabaseServ;
using ivan_api.Services.AIInstructionServ;
using ivan_api.Services.AIQueryServ;
using ivan_api.Services.AIConversationServ;

namespace ivan_api.Services;

public class ChatBotService : IChatBotService
{
    private readonly HttpClient _httpClient;
    private readonly GeminiConfiguration _geminiConfig;
    private readonly ILogger<ChatBotService> _logger;
    private readonly IAIDatabaseService _aiDatabaseService;
    private readonly IAIInstructionService _instructionService;
    private readonly IAIQueryEngine _queryEngine;
    private readonly IAIConversationService _conversationService;

    public ChatBotService(
        HttpClient httpClient,
        GeminiConfiguration geminiConfig,
        ILogger<ChatBotService> logger,
        IAIDatabaseService aiDatabaseService,
        IAIInstructionService instructionService,
        IAIQueryEngine queryEngine,
        IAIConversationService conversationService)
    {
        _httpClient = httpClient;
        _geminiConfig = geminiConfig;
        _logger = logger;
        _aiDatabaseService = aiDatabaseService;
        _instructionService = instructionService;
        _queryEngine = queryEngine;
        _conversationService = conversationService;
    }    public async Task<ApiResponseDTO<ChatMessageResponseDTO>> SendMessageAsync(int userId, ChatMessageRequestDTO request)
    {
        try
        {
            _logger.LogInformation("Processing enhanced AI message for user {UserId}", userId);

            // 1. Get/Create conversation context
            var conversationId = request.ConversationId ?? Guid.NewGuid().ToString();
            AIConversationContextDTO conversation;
            
            try
            {
                conversation = await _conversationService.GetConversationContextAsync(conversationId);
            }
            catch
            {
                // If conversation doesn't exist, create a new one
                conversation = await _conversationService.StartConversationAsync(userId);
                conversationId = conversation.ConversationId;
            }

            // 2. Load active custom instructions
            var instructionsResponse = await _instructionService.GetActiveInstructionAsync(userId);
            var instructions = instructionsResponse.Success ? instructionsResponse.Data : null;

            // 3. Analyze query for database needs
            var queryAnalysis = await _queryEngine.AnalyzeQueryAsync(request.Message);

            // 4. Fetch relevant database data (if needed)
            string contextData = "";
            if (queryAnalysis.RequiredTables?.Any() == true)
            {
                var dbResponse = await _aiDatabaseService.GetContextualDataAsync(queryAnalysis);
                contextData = dbResponse.Data ?? "";
            }

            // 5. Build enhanced system prompt
            var systemPrompt = BuildEnhancedPrompt(instructions, contextData, conversation);

            // 6. Process with Gemini
            var response = await ProcessWithGemini(systemPrompt, request.Message);

            if (response.Success && response.Data != null)
            {
                // 7. Update conversation context and add to history
                await _conversationService.AddQueryToHistoryAsync(
                    conversationId, request.Message, response.Data.Response, queryAnalysis.QueryCategory ?? "general");

                response.Data.ConversationId = conversationId;
                _logger.LogInformation("Successfully processed enhanced AI message for user {UserId}", userId);
            }

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing enhanced AI message for user {UserId}", userId);
            return new ApiResponseDTO<ChatMessageResponseDTO>
            {
                Success = false,
                Message = "Đã xảy ra lỗi khi xử lý tin nhắn với AI infrastructure",
                Data = null
            };
        }
    }

    private string BuildEnhancedPrompt(
        AiCustomInstructionDTO? instructions,
        string contextData,
        AIConversationContextDTO conversation)
    {
        var prompt = new StringBuilder();

        // Base IVAN identity
        prompt.AppendLine("Bạn là trợ lý AI của hệ thống IVAN (Intelligent Volunteer Assistant Network) - hệ thống quản lý tình nguyện viên thông minh.");
        prompt.AppendLine("Bạn đang hỗ trợ một quản trị viên (Admin) của hệ thống.");
        prompt.AppendLine("Hãy trả lời bằng tiếng Việt và tập trung vào việc hỗ trợ quản lý tình nguyện viên, tổ chức sự kiện, và các hoạt động phi lợi nhuận.");
        prompt.AppendLine("Hãy giữ phong cách chuyên nghiệp nhưng thân thiện.");

        // Add custom instructions if available
        if (instructions != null)
        {
            prompt.AppendLine($"\nHướng dẫn tùy chỉnh: {instructions.SystemPrompt}");
            if (!string.IsNullOrEmpty(instructions.BehaviorInstructions))
                prompt.AppendLine($"Hành vi: {instructions.BehaviorInstructions}");
        }

        // Add database context if available
        if (!string.IsNullOrEmpty(contextData))
        {
            prompt.AppendLine($"\nDữ liệu thực tế từ hệ thống:\n{contextData}");
            prompt.AppendLine("Hãy sử dụng dữ liệu này để đưa ra câu trả lời chính xác và cụ thể.");
        }

        // Add conversation context
        if (conversation?.MessageCount > 0)
        {
            prompt.AppendLine("\nBối cảnh cuộc trò chuyện: Bạn đã có cuộc trò chuyện trước đó với người dùng này.");
            prompt.AppendLine($"Số tin nhắn đã trao đổi: {conversation.MessageCount}");
        }

        return prompt.ToString();
    }

    private async Task<ApiResponseDTO<ChatMessageResponseDTO>> ProcessWithGemini(string systemPrompt, string userMessage)
    {
        try
        {
            var geminiRequest = new GeminiRequestDTO
            {
                Contents = new List<ContentPart>
                {
                    new ContentPart
                    {
                        Parts = new List<TextPart>
                        {
                            new TextPart { Text = $"{systemPrompt}\n\nCâu hỏi: {userMessage}" }
                        }
                    }
                },
                GenerationConfig = new GenerationConfig
                {
                    Temperature = _geminiConfig.Temperature,
                    MaxOutputTokens = _geminiConfig.MaxTokens
                }
            };

            var json = JsonSerializer.Serialize(geminiRequest, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            });

            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var url = $"{_geminiConfig.GetFullUrl()}?key={_geminiConfig.ApiKey}";
            var response = await _httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Gemini API error: {StatusCode} - {Content}", response.StatusCode, errorContent);
                
                return new ApiResponseDTO<ChatMessageResponseDTO>
                {
                    Success = false,
                    Message = "Không thể kết nối với AI service. Vui lòng thử lại sau.",
                    Data = null
                };
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var geminiResponse = JsonSerializer.Deserialize<GeminiResponseDTO>(responseContent, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            });

            if (geminiResponse?.Candidates?.Count > 0 && 
                geminiResponse.Candidates[0].Content?.Parts?.Count > 0)
            {
                var aiResponse = geminiResponse.Candidates[0].Content.Parts[0].Text;

                var chatResponse = new ChatMessageResponseDTO
                {
                    Response = aiResponse,
                    ConversationId = "",
                    Timestamp = DateTime.UtcNow
                };

                return new ApiResponseDTO<ChatMessageResponseDTO>
                {
                    Success = true,
                    Message = "Tin nhắn đã được xử lý thành công với AI infrastructure",
                    Data = chatResponse
                };
            }

            return new ApiResponseDTO<ChatMessageResponseDTO>
            {
                Success = false,
                Message = "Không nhận được phản hồi từ AI service",
                Data = null
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling Gemini API");
            return new ApiResponseDTO<ChatMessageResponseDTO>
            {
                Success = false,
                Message = "Lỗi khi gọi Gemini API",
                Data = null
            };
        }
    }
}
