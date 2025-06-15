using System.Text;
using System.Text.Json;
using ivan_api.Configuration;
using ivan_api.DTOs;

namespace ivan_api.Services;

public class ChatBotService : IChatBotService
{
    private readonly HttpClient _httpClient;
    private readonly GeminiConfiguration _geminiConfig;
    private readonly IGoogleSheetsService _googleSheetsService;
    private readonly ILogger<ChatBotService> _logger;

    public ChatBotService(
        HttpClient httpClient,
        GeminiConfiguration geminiConfig,
        IGoogleSheetsService googleSheetsService,
        ILogger<ChatBotService> logger)
    {
        _httpClient = httpClient;
        _geminiConfig = geminiConfig;
        _googleSheetsService = googleSheetsService;
        _logger = logger;
    }    public async Task<ApiResponseDTO<ChatMessageResponseDTO>> SendMessageAsync(int userId, ChatMessageRequestDTO request)
    {
        try
        {
            _logger.LogInformation("Sending message to Gemini API for user {UserId}", userId);            // Kiểm tra xem user có đang hỏi về dữ liệu không
            var needsSheetData = CheckIfNeedsSheetData(request.Message);
            _logger.LogInformation("CheckIfNeedsSheetData result: {NeedsData} for message: {Message}", needsSheetData, request.Message);
            var sheetData = "";

            if (needsSheetData)
            {
                _logger.LogInformation("User query requires Google Sheets data, fetching...");
                var sheetsResponse = await _googleSheetsService.ReadSheetDataForAIAsync(request.Message);
                
                _logger.LogInformation("Google Sheets response: Success={Success}, Message={Message}", 
                    sheetsResponse.Success, sheetsResponse.Message);
                
                if (sheetsResponse.Success && sheetsResponse.Data != null)
                {
                    sheetData = $"\n\nDữ liệu thực tế từ hệ thống Google Sheets:\n{sheetsResponse.Data.Data}\n";
                    _logger.LogInformation("Successfully retrieved Google Sheets data for AI context");
                }
                else
                {
                    sheetData = "\n\nLưu ý: Không thể lấy dữ liệu từ Google Sheets lúc này. Vui lòng kiểm tra lại sau.";
                    _logger.LogWarning("Failed to retrieve Google Sheets data: {Message}", sheetsResponse.Message);
                }
            }

            // Tạo system prompt cho IVAN context với dữ liệu từ Google Sheets
            var systemPrompt = "Bạn là trợ lý AI của hệ thống IVAN (Intelligent Volunteer Assistant Network) - hệ thống quản lý tình nguyện viên thông minh. " +
                              "Bạn đang hỗ trợ một quản trị viên (Admin) của hệ thống. " +
                              "Hãy trả lời bằng tiếng Việt và tập trung vào việc hỗ trợ quản lý tình nguyện viên, tổ chức sự kiện, và các hoạt động phi lợi nhuận. " +
                              "Hãy giữ phong cách chuyên nghiệp nhưng thân thiện." +
                              sheetData;

            var geminiRequest = new GeminiRequestDTO
            {
                Contents = new List<ContentPart>
                {
                    new ContentPart
                    {
                        Parts = new List<TextPart>
                        {
                            new TextPart { Text = $"{systemPrompt}\n\nCâu hỏi: {request.Message}" }
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
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var url = $"{_geminiConfig.BaseUrl}?key={_geminiConfig.ApiKey}";
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
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            if (geminiResponse?.Candidates?.Count > 0 && 
                geminiResponse.Candidates[0].Content?.Parts?.Count > 0)
            {
                var aiResponse = geminiResponse.Candidates[0].Content.Parts[0].Text;
                var conversationId = request.ConversationId ?? Guid.NewGuid().ToString();

                var chatResponse = new ChatMessageResponseDTO
                {
                    Response = aiResponse,
                    ConversationId = conversationId,
                    Timestamp = DateTime.UtcNow
                };

                _logger.LogInformation("Successfully got response from Gemini API for user {UserId}", userId);

                return new ApiResponseDTO<ChatMessageResponseDTO>
                {
                    Success = true,
                    Message = "Tin nhắn đã được xử lý thành công",
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
            _logger.LogError(ex, "Error sending message to Gemini API for user {UserId}", userId);
              return new ApiResponseDTO<ChatMessageResponseDTO>
            {
                Success = false,
                Message = "Đã xảy ra lỗi khi xử lý tin nhắn",
                Data = null
            };
        }
    }

    private bool CheckIfNeedsSheetData(string message)
    {
        var lowerMessage = message.ToLower();
        
        // Các từ khóa cho biết user cần dữ liệu từ Google Sheets
        var dataKeywords = new[]
        {
            "bao nhiêu", "số lượng", "thống kê", "danh sách", "tổng", "có bao nhiêu",
            "dữ liệu", "thông tin", "báo cáo", "tình hình", "hiện tại", "đã có",
            "tình nguyện viên", "sự kiện", "đăng ký", "tham gia", "hoạt động",
            "tổ chức", "partner", "đối tác", "người dùng", "user"
        };
        
        return dataKeywords.Any(keyword => lowerMessage.Contains(keyword));
    }
}
