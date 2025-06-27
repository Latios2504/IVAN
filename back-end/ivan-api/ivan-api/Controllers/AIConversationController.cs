using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ivan_api.Services;
using ivan_api.DTOs;

namespace ivan_api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AIConversationController : ControllerBase
{
    private readonly IAIConversationService _conversationService;
    private readonly ILogger<AIConversationController> _logger;

    public AIConversationController(
        IAIConversationService conversationService,
        ILogger<AIConversationController> logger)
    {
        _conversationService = conversationService;
        _logger = logger;
    }

    /// <summary>
    /// Start a new AI conversation session
    /// </summary>
    [HttpPost("start")]
    public async Task<ActionResult<AIConversationContextDTO>> StartConversationAsync([FromBody] StartConversationRequestDTO request)
    {
        try
        {
            var context = await _conversationService.StartConversationAsync(
                request.UserId, 
                request.InstructionProfile, 
                request.InitialContext);

            return Ok(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting conversation for user {UserId}", request.UserId);
            return StatusCode(500, "Lỗi khởi tạo cuộc trò chuyện");
        }
    }

    /// <summary>
    /// Continue an existing conversation
    /// </summary>
    [HttpPost("{conversationId}/continue")]
    public async Task<ActionResult<AIConversationContextDTO>> ContinueConversationAsync(
        string conversationId, 
        [FromBody] ContinueConversationRequestDTO request)
    {
        try
        {
            var context = await _conversationService.ContinueConversationAsync(
                conversationId, 
                request.Query, 
                request.QueryCategory);

            return Ok(context);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Không tìm thấy cuộc trò chuyện với ID: {conversationId}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error continuing conversation {ConversationId}", conversationId);
            return StatusCode(500, "Lỗi tiếp tục cuộc trò chuyện");
        }
    }

    /// <summary>
    /// Get conversation context and history
    /// </summary>
    [HttpGet("{conversationId}")]
    public async Task<ActionResult<AIConversationContextDTO>> GetConversationAsync(string conversationId)
    {
        try
        {
            var context = await _conversationService.GetConversationContextAsync(conversationId);
            
            if (context == null)
                return NotFound($"Không tìm thấy cuộc trò chuyện với ID: {conversationId}");

            return Ok(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting conversation {ConversationId}", conversationId);
            return StatusCode(500, "Lỗi lấy thông tin cuộc trò chuyện");
        }
    }

    /// <summary>
    /// Get conversation history
    /// </summary>
    [HttpGet("{conversationId}/history")]
    public async Task<ActionResult<List<AIQueryHistoryDTO>>> GetConversationHistoryAsync(
        string conversationId,
        [FromQuery] int skip = 0,
        [FromQuery] int take = 50)
    {
        try
        {
            var history = await _conversationService.GetConversationHistoryAsync(conversationId, skip, take);
            return Ok(history);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting conversation history {ConversationId}", conversationId);
            return StatusCode(500, "Lỗi lấy lịch sử cuộc trò chuyện");
        }
    }

    /// <summary>
    /// Get all conversations for a user
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<List<AIConversationSummaryDTO>>> GetUserConversationsAsync(
        int userId,
        [FromQuery] int skip = 0,
        [FromQuery] int take = 20)
    {
        try
        {
            var conversations = await _conversationService.GetUserConversationsAsync(userId, skip, take);
            return Ok(conversations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting conversations for user {UserId}", userId);
            return StatusCode(500, "Lỗi lấy danh sách cuộc trò chuyện");
        }
    }

    /// <summary>
    /// Update conversation context
    /// </summary>
    [HttpPut("{conversationId}/context")]
    public async Task<ActionResult> UpdateConversationContextAsync(
        string conversationId,
        [FromBody] UpdateConversationContextRequestDTO request)
    {
        try
        {
            await _conversationService.UpdateConversationContextAsync(
                conversationId, 
                request.SessionData, 
                request.InstructionProfile);

            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Không tìm thấy cuộc trò chuyện với ID: {conversationId}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating conversation context {ConversationId}", conversationId);
            return StatusCode(500, "Lỗi cập nhật ngữ cảnh cuộc trò chuyện");
        }
    }

    /// <summary>
    /// Clear conversation history (keep context)
    /// </summary>
    [HttpPost("{conversationId}/clear-history")]
    public async Task<ActionResult> ClearConversationHistoryAsync(string conversationId)
    {
        try
        {
            await _conversationService.ClearConversationHistoryAsync(conversationId);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Không tìm thấy cuộc trò chuyện với ID: {conversationId}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error clearing conversation history {ConversationId}", conversationId);
            return StatusCode(500, "Lỗi xóa lịch sử cuộc trò chuyện");
        }
    }

    /// <summary>
    /// End/archive a conversation
    /// </summary>
    [HttpPost("{conversationId}/end")]
    public async Task<ActionResult> EndConversationAsync(string conversationId)
    {
        try
        {
            await _conversationService.EndConversationAsync(conversationId);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Không tìm thấy cuộc trò chuyện với ID: {conversationId}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error ending conversation {ConversationId}", conversationId);
            return StatusCode(500, "Lỗi kết thúc cuộc trò chuyện");
        }
    }

    /// <summary>
    /// Get conversation analytics and insights
    /// </summary>
    [HttpGet("{conversationId}/analytics")]
    public async Task<ActionResult<ConversationAnalyticsDTO>> GetConversationAnalyticsAsync(string conversationId)
    {
        try
        {
            var analytics = await _conversationService.GetConversationAnalyticsAsync(conversationId);
            
            if (analytics == null)
                return NotFound($"Không tìm thấy phân tích cho cuộc trò chuyện: {conversationId}");

            return Ok(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting conversation analytics {ConversationId}", conversationId);
            return StatusCode(500, "Lỗi lấy phân tích cuộc trò chuyện");
        }
    }
}

// Additional DTOs for the controller endpoints
public class StartConversationRequestDTO
{
    public int UserId { get; set; }
    public string? InstructionProfile { get; set; }
    public Dictionary<string, object>? InitialContext { get; set; }
}

public class ContinueConversationRequestDTO
{
    public string Query { get; set; } = string.Empty;
    public string? QueryCategory { get; set; }
}

public class UpdateConversationContextRequestDTO
{
    public Dictionary<string, object>? SessionData { get; set; }
    public string? InstructionProfile { get; set; }
}
