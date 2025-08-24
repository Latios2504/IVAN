using ivan_api.Configuration;
using ivan_api.DTOs;
using ivan_api.DTOs.AI;
using ivan_api.Services.AI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.Common;

namespace ivan_api.Controllers;

/// <summary>
/// Controller for managing chatbot configuration
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")] // Only admins can manage chatbot configuration
public class ChatbotConfigurationController : ControllerBase
{
    private readonly IChatbotConfigurationService _chatbotConfigService;
    private readonly IAiCustomInstructionService _customInstructionService;
    private readonly ILogger<ChatbotConfigurationController> _logger;

    public ChatbotConfigurationController(
        IChatbotConfigurationService chatbotConfigService,
        IAiCustomInstructionService customInstructionService,
        ILogger<ChatbotConfigurationController> logger)
    {
        _chatbotConfigService = chatbotConfigService;
        _customInstructionService = customInstructionService;
        _logger = logger;
    }

    /// <summary>
    /// Get current chatbot configuration including default custom instruction
    /// </summary>
    [HttpGet("configuration")]
    public async Task<ActionResult<ApiResponseDTO<ChatbotConfigurationResponseDTO>>> GetConfiguration()
    {
        try
        {
            var config = _chatbotConfigService.GetCurrentConfiguration();
            var defaultInstruction = await _chatbotConfigService.GetDefaultCustomInstructionAsync();

            var response = new ChatbotConfigurationResponseDTO
            {
                EnableCustomInstructions = config.EnableCustomInstructions,
                DefaultCustomInstructionId = config.DefaultCustomInstructionId,
                DefaultCustomInstruction = defaultInstruction,
                CacheDurationMinutes = config.CacheDurationMinutes,
                FallbackBehavior = config.FallbackBehavior.ToString()
            };

            return Ok(new ApiResponseDTO<ChatbotConfigurationResponseDTO>
            {
                Success = true,
                Data = response,
                Message = "Chatbot configuration retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting chatbot configuration");
            return StatusCode(500, new ApiResponseDTO<ChatbotConfigurationResponseDTO>
            {
                Success = false,
                Message = "Error retrieving chatbot configuration",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Set default custom instruction for chatbot
    /// </summary>
    [HttpPost("default-instruction")]
    public async Task<ActionResult<ApiResponseDTO<object>>> SetDefaultInstruction([FromBody] SetDefaultInstructionRequestDTO request)
    {
        try
        {
            var success = await _chatbotConfigService.SetDefaultCustomInstructionAsync(request.InstructionId);
            
            if (!success)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to set default custom instruction. Instruction may not exist or be inactive."
                });
            }

            var message = request.InstructionId.HasValue 
                ? $"Default custom instruction set to ID: {request.InstructionId.Value}"
                : "Default custom instruction disabled";

            return Ok(new ApiResponseDTO<object>
            {
                Success = true,
                Message = message
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting default custom instruction: {InstructionId}", request.InstructionId);
            return StatusCode(500, new ApiResponseDTO<object>
            {
                Success = false,
                Message = "Error setting default custom instruction",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Get all available custom instructions for admin to choose from
    /// </summary>
    [HttpGet("available-instructions")]
    public async Task<ActionResult<ApiResponseDTO<List<AiCustomInstructionDTO>>>> GetAvailableInstructions()
    {
        try
        {
            var instructions = await _customInstructionService.GetAllCustomInstructionsAsync();
            
            // Filter only active instructions
            var activeInstructions = instructions.Where(i => i.IsActive).ToList();

            return Ok(new ApiResponseDTO<List<AiCustomInstructionDTO>>
            {
                Success = true,
                Data = activeInstructions,
                Message = "Available custom instructions retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available custom instructions");
            return StatusCode(500, new ApiResponseDTO<List<AiCustomInstructionDTO>>
            {
                Success = false,
                Message = "Error retrieving available custom instructions",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Clear cached default custom instruction
    /// </summary>
    [HttpPost("clear-cache")]
    public ActionResult<ApiResponseDTO<object>> ClearCache()
    {
        try
        {
            _chatbotConfigService.ClearCache();
            
            return Ok(new ApiResponseDTO<object>
            {
                Success = true,
                Message = "Cache cleared successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error clearing cache");
            return StatusCode(500, new ApiResponseDTO<object>
            {
                Success = false,
                Message = "Error clearing cache",
                Errors = new List<string> { ex.Message }
            });
        }
    }
}

/// <summary>
/// Response DTO for chatbot configuration
/// </summary>
public class ChatbotConfigurationResponseDTO
{
    public bool EnableCustomInstructions { get; set; }
    public int? DefaultCustomInstructionId { get; set; }
    public AiCustomInstructionDTO? DefaultCustomInstruction { get; set; }
    public int CacheDurationMinutes { get; set; }
    public string FallbackBehavior { get; set; } = string.Empty;
}

/// <summary>
/// Request DTO for setting default instruction
/// </summary>
public class SetDefaultInstructionRequestDTO
{
    public int? InstructionId { get; set; }
}