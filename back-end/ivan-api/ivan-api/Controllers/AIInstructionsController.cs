using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ivan_api.DTOs;
using ivan_api.DTOs.AIDatabaseManage;
using ivan_api.Services.AIInstructionServ;

namespace ivan_api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AIInstructionsController : ControllerBase
{
    private readonly IAIInstructionService _instructionService;
    private readonly ILogger<AIInstructionsController> _logger;

    public AIInstructionsController(IAIInstructionService instructionService, ILogger<AIInstructionsController> logger)
    {
        _instructionService = instructionService;
        _logger = logger;
    }

    /// <summary>
    /// Create a new AI instruction (Admin only)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<AiCustomInstructionDTO>>> CreateInstruction([FromBody] AiCustomInstructionCreateDTO request)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new ApiResponseDTO<AiCustomInstructionDTO>
                {
                    Success = false,
                    Message = "User not authenticated"
                });
            }

            var result = await _instructionService.CreateInstructionAsync(userId.Value, request);

            if (result.Success)
            {
                _logger.LogInformation("AI instruction created successfully by user {UserId}", userId.Value);
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in CreateInstruction endpoint");
            return StatusCode(500, new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = false,
                Message = "An internal error occurred"
            });
        }
    }

    /// <summary>
    /// Update an existing AI instruction (Admin only)
    /// </summary>
    [HttpPut("{instructionId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<AiCustomInstructionDTO>>> UpdateInstruction(int instructionId, [FromBody] AiCustomInstructionUpdateDTO request)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new ApiResponseDTO<AiCustomInstructionDTO>
                {
                    Success = false,
                    Message = "User not authenticated"
                });
            }

            var result = await _instructionService.UpdateInstructionAsync(instructionId, userId.Value, request);

            if (result.Success)
            {
                _logger.LogInformation("AI instruction {InstructionId} updated successfully by user {UserId}", instructionId, userId.Value);
                return Ok(result);
            }

            if (result.Message?.Contains("not found") == true)
                return NotFound(result);

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in UpdateInstruction endpoint for instruction {InstructionId}", instructionId);
            return StatusCode(500, new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = false,
                Message = "An internal error occurred"
            });
        }
    }

    /// <summary>
    /// Delete an AI instruction (Admin only)
    /// </summary>
    [HttpDelete("{instructionId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<bool>>> DeleteInstruction(int instructionId)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new ApiResponseDTO<bool>
                {
                    Success = false,
                    Message = "User not authenticated"
                });
            }

            var result = await _instructionService.DeleteInstructionAsync(instructionId, userId.Value);

            if (result.Success)
            {
                _logger.LogInformation("AI instruction {InstructionId} deleted successfully by user {UserId}", instructionId, userId.Value);
                return Ok(result);
            }

            if (result.Message?.Contains("not found") == true)
                return NotFound(result);

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in DeleteInstruction endpoint for instruction {InstructionId}", instructionId);
            return StatusCode(500, new ApiResponseDTO<bool>
            {
                Success = false,
                Message = "An internal error occurred"
            });
        }
    }

    /// <summary>
    /// Delete any AI instruction (Admin only - bypasses ownership check)
    /// </summary>
    [HttpDelete("admin/{instructionId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<bool>>> DeleteAnyInstruction(int instructionId)
    {
        try
        {
            var result = await _instructionService.DeleteAnyInstructionAsync(instructionId);

            if (result.Success)
            {
                return Ok(result);
            }

            if (result.Message?.Contains("not found") == true)
                return NotFound(result);

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in DeleteAnyInstruction endpoint for instruction {InstructionId}", instructionId);
            return StatusCode(500, new ApiResponseDTO<bool>
            {
                Success = false,
                Message = "An internal error occurred"
            });
        }
    }

    /// <summary>
    /// Update any AI instruction (Admin only - bypasses ownership check)
    /// </summary>
    [HttpPut("admin/{instructionId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<AiCustomInstructionDTO>>> UpdateAnyInstruction(int instructionId, [FromBody] AiCustomInstructionUpdateDTO request)
    {
        try
        {
            var result = await _instructionService.UpdateAnyInstructionAsync(instructionId, request);

            if (result.Success)
            {
                return Ok(result);
            }

            if (result.Message?.Contains("not found") == true)
                return NotFound(result);

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in UpdateAnyInstruction endpoint for instruction {InstructionId}", instructionId);
            return StatusCode(500, new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = false,
                Message = "An internal error occurred"
            });
        }
    }

    /// <summary>
    /// Get a specific AI instruction
    /// </summary>
    [HttpGet("{instructionId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<AiCustomInstructionDTO>>> GetInstruction(int instructionId)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new ApiResponseDTO<AiCustomInstructionDTO>
                {
                    Success = false,
                    Message = "User not authenticated"
                });
            }

            var result = await _instructionService.GetInstructionAsync(instructionId, userId.Value);

            if (result.Success)
            {
                return Ok(result);
            }

            if (result.Message?.Contains("not found") == true)
                return NotFound(result);

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetInstruction endpoint for instruction {InstructionId}", instructionId);
            return StatusCode(500, new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = false,
                Message = "An internal error occurred"
            });
        }
    }

    /// <summary>
    /// Get all AI instructions in the system (Admin only)
    /// </summary>
    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<List<AiCustomInstructionDTO>>>> GetAllInstructions()
    {
        try
        {
            var result = await _instructionService.GetAllInstructionsAsync();

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetAllInstructions endpoint");
            return StatusCode(500, new ApiResponseDTO<List<AiCustomInstructionDTO>>
            {
                Success = false,
                Message = "An internal error occurred"
            });
        }
    }

    /// <summary>
    /// Get all AI instructions for the current user (Admin only)
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<List<AiCustomInstructionDTO>>>> GetUserInstructions()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new ApiResponseDTO<List<AiCustomInstructionDTO>>
                {
                    Success = false,
                    Message = "User not authenticated"
                });
            }

            var result = await _instructionService.GetUserInstructionsAsync(userId.Value);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetUserInstructions endpoint");
            return StatusCode(500, new ApiResponseDTO<List<AiCustomInstructionDTO>>
            {
                Success = false,
                Message = "An internal error occurred"
            });
        }
    }

    /// <summary>
    /// Get template AI instructions (available to all users)
    /// </summary>
    [HttpGet("templates")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<List<AiCustomInstructionDTO>>>> GetTemplateInstructions()
    {
        try
        {
            var result = await _instructionService.GetTemplateInstructionsAsync();

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetTemplateInstructions endpoint");
            return StatusCode(500, new ApiResponseDTO<List<AiCustomInstructionDTO>>
            {
                Success = false,
                Message = "An internal error occurred"
            });
        }
    }

    /// <summary>
    /// Get the default AI instruction
    /// </summary>
    [HttpGet("default")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<AiCustomInstructionDTO>>> GetDefaultInstruction()
    {
        try
        {
            var result = await _instructionService.GetDefaultInstructionAsync();

            if (result.Success)
            {
                return Ok(result);
            }

            return NotFound(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetDefaultInstruction endpoint");
            return StatusCode(500, new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = false,
                Message = "An internal error occurred"
            });
        }
    }

    /// <summary>
    /// Test an AI instruction with a sample query (Admin only)
    /// </summary>
    [HttpPost("{instructionId}/test")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<string>>> TestInstruction(int instructionId, [FromBody] TestInstructionRequestDTO request)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new ApiResponseDTO<string>
                {
                    Success = false,
                    Message = "User not authenticated"
                });
            }

            if (string.IsNullOrWhiteSpace(request.SampleQuery))
            {
                return BadRequest(new ApiResponseDTO<string>
                {
                    Success = false,
                    Message = "Sample query is required"
                });
            }

            var result = await _instructionService.TestInstructionAsync(instructionId, request.SampleQuery, userId.Value);

            if (result.Success)
            {
                _logger.LogInformation("AI instruction {InstructionId} tested successfully by user {UserId}", instructionId, userId.Value);
                return Ok(result);
            }

            if (result.Message?.Contains("not found") == true)
                return NotFound(result);

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TestInstruction endpoint for instruction {InstructionId}", instructionId);
            return StatusCode(500, new ApiResponseDTO<string>
            {
                Success = false,
                Message = "An internal error occurred"
            });
        }
    }

    /// <summary>
    /// Test any AI instruction with a sample query (Admin only - bypasses ownership check)
    /// </summary>
    [HttpPost("admin/{instructionId}/test")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<string>>> TestAnyInstruction(int instructionId, [FromBody] TestInstructionRequestDTO request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.SampleQuery))
            {
                return BadRequest(new ApiResponseDTO<string>
                {
                    Success = false,
                    Message = "Sample query is required"
                });
            }

            var result = await _instructionService.TestAnyInstructionAsync(instructionId, request.SampleQuery);

            if (result.Success)
            {
                _logger.LogInformation("AI instruction {InstructionId} tested successfully by admin", instructionId);
                return Ok(result);
            }

            if (result.Message?.Contains("not found") == true)
                return NotFound(result);

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TestAnyInstruction endpoint for instruction {InstructionId}", instructionId);
            return StatusCode(500, new ApiResponseDTO<string>
            {
                Success = false,
                Message = "An internal error occurred"
            });
        }
    }

    /// <summary>
    /// Validate an AI instruction without saving it (Admin only)
    /// </summary>
    [HttpPost("validate")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<bool>>> ValidateInstruction([FromBody] AiCustomInstructionCreateDTO request)
    {
        try
        {
            var result = await _instructionService.ValidateInstructionAsync(request);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in ValidateInstruction endpoint");
            return StatusCode(500, new ApiResponseDTO<bool>
            {
                Success = false,
                Message = "An internal error occurred"
            });
        }
    }

    /// <summary>
    /// Get analytics for a specific AI instruction (Admin only)
    /// </summary>
    [HttpGet("{instructionId}/analytics")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<List<AiQueryAnalyticsDTO>>>> GetInstructionAnalytics(int instructionId)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new ApiResponseDTO<List<AiQueryAnalyticsDTO>>
                {
                    Success = false,
                    Message = "User not authenticated"
                });
            }

            var result = await _instructionService.GetInstructionAnalyticsAsync(instructionId, userId.Value);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetInstructionAnalytics endpoint for instruction {InstructionId}", instructionId);
            return StatusCode(500, new ApiResponseDTO<List<AiQueryAnalyticsDTO>>
            {
                Success = false,
                Message = "An internal error occurred"
            });
        }
    }

    /// <summary>
    /// Get performance metrics for a specific AI instruction (Admin only)
    /// </summary>
    [HttpGet("{instructionId}/performance")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<Dictionary<string, object>>>> GetInstructionPerformance(int instructionId)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new ApiResponseDTO<Dictionary<string, object>>
                {
                    Success = false,
                    Message = "User not authenticated"
                });
            }

            var result = await _instructionService.GetInstructionPerformanceAsync(instructionId, userId.Value);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetInstructionPerformance endpoint for instruction {InstructionId}", instructionId);
            return StatusCode(500, new ApiResponseDTO<Dictionary<string, object>>
            {
                Success = false,
                Message = "An internal error occurred"
            });
        }
    }

    // Helper methods
    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
        {
            return userId;
        }
        return null;
    }

    /// <summary>
    /// Get current Gemini model configuration (Admin only)
    /// </summary>
    [HttpGet("admin/gemini-config")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<object>>> GetGeminiConfig()
    {
        try
        {
            var config = await _instructionService.GetGeminiConfigAsync();
            return Ok(config);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting Gemini configuration");
            return StatusCode(500, new ApiResponseDTO<object>
            {
                Success = false,
                Message = "Lỗi khi lấy cấu hình Gemini"
            });
        }
    }

    /// <summary>
    /// Get available Gemini models (Admin only)
    /// </summary>
    [HttpGet("admin/gemini-models")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<List<string>>>> GetAvailableModels()
    {
        try
        {
            var models = await _instructionService.GetAvailableGeminiModelsAsync();
            return Ok(models);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available Gemini models");
            return StatusCode(500, new ApiResponseDTO<List<string>>
            {
                Success = false,
                Message = "Lỗi khi lấy danh sách mô hình Gemini"
            });
        }
    }

    /// <summary>
    /// Test any AI instruction with specific model (Admin only)
    /// </summary>
    [HttpPost("admin/{instructionId}/test-with-model")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<string>>> TestAnyInstructionWithModel(int instructionId, [FromBody] TestInstructionWithModelRequestDTO request)
    {
        try
        {
            var result = await _instructionService.TestAnyInstructionWithModelAsync(instructionId, request.SampleQuery, request.Model);

            if (result.Success)
            {
                _logger.LogInformation("AI instruction {InstructionId} tested successfully with model {Model} (admin)", instructionId, request.Model);
                return Ok(result);
            }

            _logger.LogWarning("Failed to test AI instruction {InstructionId} with model {Model} (admin): {Message}", instructionId, request.Model, result.Message);
            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error testing AI instruction {InstructionId} with model {Model} (admin)", instructionId, request.Model);
            return StatusCode(500, new ApiResponseDTO<string>
            {
                Success = false,
                Message = "Lỗi khi thử nghiệm instruction với model được chỉ định"
            });
        }
    }
}

// Request DTOs
public class TestInstructionRequestDTO
{
    public string SampleQuery { get; set; } = string.Empty;
}

public class TestInstructionWithModelRequestDTO
{
    public string SampleQuery { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
}
