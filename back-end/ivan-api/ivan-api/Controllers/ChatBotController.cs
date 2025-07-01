using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ivan_api.DTOs;
using ivan_api.Services;

namespace ivan_api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChatBotController : ControllerBase
{
    private readonly IChatBotService _chatBotService;
    private readonly ILogger<ChatBotController> _logger;

    public ChatBotController(IChatBotService chatBotService, ILogger<ChatBotController> logger)
    {
        _chatBotService = chatBotService;
        _logger = logger;
    }

    [HttpPost("send-message")]
    [Authorize(Roles = "Admin")] // Chỉ Admin được sử dụng chat bot
    public async Task<ActionResult<ApiResponseDTO<ChatMessageResponseDTO>>> SendMessage([FromBody] ChatMessageRequestDTO request)
    {
        try
        {
            // Lấy userId từ JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized(new ApiResponseDTO<ChatMessageResponseDTO>
                {
                    Success = false,
                    Message = "Token không hợp lệ",
                    Data = null
                });
            }

            // Validate request
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new ApiResponseDTO<ChatMessageResponseDTO>
                {
                    Success = false,
                    Message = "Tin nhắn không được để trống",
                    Data = null
                });
            }

            if (request.Message.Length > 1000)
            {
                return BadRequest(new ApiResponseDTO<ChatMessageResponseDTO>
                {
                    Success = false,
                    Message = "Tin nhắn không được vượt quá 1000 ký tự",
                    Data = null
                });
            }

            _logger.LogInformation("Admin user {UserId} sending message to chatbot", userId);

            var result = await _chatBotService.SendMessageAsync(userId, request);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in ChatBot SendMessage endpoint");
            
            return StatusCode(500, new ApiResponseDTO<ChatMessageResponseDTO>
            {
                Success = false,
                Message = "Đã xảy ra lỗi server",
                Data = null
            });
        }
    }

    [HttpGet("health")]
    [Authorize(Roles = "Admin")]
    public ActionResult<ApiResponseDTO<object>> HealthCheck()
    {
        return Ok(new ApiResponseDTO<object>
        {
            Success = true,
            Message = "Chat bot service đang hoạt động",
            Data = new { Status = "Online", Timestamp = DateTime.UtcNow }
        });
    }
}
