using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.AI;
using ivan_api.DTOs.Authentication;
using ivan_api.Services.AI.Interfaces;
using System.Security.Claims;

namespace ivan_api.Controllers;

/// <summary>
/// Controller for AI Instructions Management
/// Integrates with multi-model AI testing playground
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AIInstructionsController : ControllerBase
{
    private readonly IAiInstructionsService _aiInstructionsService;
    private readonly ILogger<AIInstructionsController> _logger;

    public AIInstructionsController(
        IAiInstructionsService aiInstructionsService,
        ILogger<AIInstructionsController> logger)
    {
        _aiInstructionsService = aiInstructionsService;
        _logger = logger;
    }

    #region CRUD Operations

    /// <summary>
    /// Get all AI instructions (Admin only)
    /// </summary>
    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<IEnumerable<AiCustomInstructionDTO>>>> GetAllInstructions()
    {
        try
        {
            var instructions = await _aiInstructionsService.GetAllInstructionsAsync();
            _logger.LogInformation("Retrieved {Count} AI instructions for admin", instructions.Count());
            
            return Ok(new ApiResponseDTO<IEnumerable<AiCustomInstructionDTO>>
            {
                Success = true,
                Message = "AI instructions retrieved successfully",
                Data = instructions
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all AI instructions");
            return StatusCode(500, new ApiResponseDTO<IEnumerable<AiCustomInstructionDTO>>
            {
                Success = false,
                Message = "An error occurred while fetching AI instructions",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Get current user's AI instructions
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponseDTO<IEnumerable<AiCustomInstructionDTO>>>> GetUserInstructions()
    {
        try
        {
            var userId = GetCurrentUserId();
            var instructions = await _aiInstructionsService.GetUserInstructionsAsync(userId);
            _logger.LogInformation("Retrieved {Count} AI instructions for user {UserId}", instructions.Count(), userId);
            
            return Ok(new ApiResponseDTO<IEnumerable<AiCustomInstructionDTO>>
            {
                Success = true,
                Message = "User AI instructions retrieved successfully",
                Data = instructions
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning("❌ Unauthorized access: {Message}", ex.Message);
            return Unauthorized(new ApiResponseDTO<IEnumerable<AiCustomInstructionDTO>>
            {
                Success = false,
                Message = "Unauthorized access",
                Errors = new List<string> { ex.Message }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user AI instructions");
            return StatusCode(500, new ApiResponseDTO<IEnumerable<AiCustomInstructionDTO>>
            {
                Success = false,
                Message = "An error occurred while fetching your AI instructions",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Get specific AI instruction by ID
    /// </summary>
    [HttpGet("{instructionId}")]
    public async Task<ActionResult<ApiResponseDTO<AiCustomInstructionDTO>>> GetInstruction(int instructionId)
    {
        try
        {
            var instruction = await _aiInstructionsService.GetInstructionByIdAsync(instructionId);
            
            if (instruction == null)
            {
                return NotFound($"AI instruction with ID {instructionId} not found");
            }

            // Check access permissions
            var userId = GetCurrentUserId();
            var isAdmin = User.IsInRole("Admin");
            
            if (!isAdmin && instruction.CreatedByUserId != userId)
            {
                return Forbid("You don't have permission to view this AI instruction");
            }

            return Ok(new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = true,
                Message = "AI instruction retrieved successfully",
                Data = instruction
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting AI instruction {InstructionId}", instructionId);
            return StatusCode(500, "An error occurred while fetching the AI instruction");
        }
    }

    /// <summary>
    /// Create new AI instruction
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponseDTO<AiCustomInstructionDTO>>> CreateInstruction(
        [FromBody] AiCustomInstructionCreateDTO createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var instruction = await _aiInstructionsService.CreateInstructionAsync(createDto, userId);
            
            return CreatedAtAction(
                nameof(GetInstruction), 
                new { instructionId = instruction.InstructionId }, 
                new ApiResponseDTO<AiCustomInstructionDTO>
                {
                    Success = true,
                    Message = "AI instruction created successfully",
                    Data = instruction
                });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating AI instruction");
            return StatusCode(500, "An error occurred while creating the AI instruction");
        }
    }

    /// <summary>
    /// Update AI instruction (Admin can update any, users can update their own)
    /// </summary>
    [HttpPut("admin/{instructionId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<AiCustomInstructionDTO>>> AdminUpdateInstruction(
        int instructionId,
        [FromBody] AiCustomInstructionUpdateDTO updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var instruction = await _aiInstructionsService.UpdateInstructionAsync(instructionId, updateDto);
            
            return Ok(new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = true,
                Message = "AI instruction updated successfully",
                Data = instruction
            });
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating AI instruction {InstructionId}", instructionId);
            return StatusCode(500, "An error occurred while updating the AI instruction");
        }
    }

    /// <summary>
    /// Update user's own AI instruction
    /// </summary>
    [HttpPut("{instructionId}")]
    public async Task<ActionResult<ApiResponseDTO<AiCustomInstructionDTO>>> UpdateInstruction(
        int instructionId,
        [FromBody] AiCustomInstructionUpdateDTO updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check ownership
            var existingInstruction = await _aiInstructionsService.GetInstructionByIdAsync(instructionId);
            if (existingInstruction == null)
            {
                return NotFound($"AI instruction with ID {instructionId} not found");
            }

            var userId = GetCurrentUserId();
            if (existingInstruction.CreatedByUserId != userId)
            {
                return Forbid("You can only update your own AI instructions");
            }

            var instruction = await _aiInstructionsService.UpdateInstructionAsync(instructionId, updateDto);
            
            return Ok(new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = true,
                Message = "AI instruction updated successfully",
                Data = instruction
            });
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating AI instruction {InstructionId}", instructionId);
            return StatusCode(500, "An error occurred while updating the AI instruction");
        }
    }

    /// <summary>
    /// Delete AI instruction (Admin only)
    /// </summary>
    [HttpDelete("admin/{instructionId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> AdminDeleteInstruction(int instructionId)
    {
        try
        {
            var success = await _aiInstructionsService.DeleteInstructionAsync(instructionId);
            
            if (!success)
            {
                return NotFound($"AI instruction with ID {instructionId} not found");
            }

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting AI instruction {InstructionId}", instructionId);
            return StatusCode(500, "An error occurred while deleting the AI instruction");
        }
    }

    #endregion

    #region Status Management

    /// <summary>
    /// Toggle instruction active status
    /// </summary>
    [HttpPatch("{instructionId}/status")]
    public async Task<ActionResult<AiCustomInstructionDTO>> ToggleInstructionStatus(
        int instructionId,
        [FromBody] ToggleInstructionStatusDTO statusDto)
    {
        try
        {
            // Check ownership or admin role
            var existingInstruction = await _aiInstructionsService.GetInstructionByIdAsync(instructionId);
            if (existingInstruction == null)
            {
                return NotFound($"AI instruction with ID {instructionId} not found");
            }

            var userId = GetCurrentUserId();
            var isAdmin = User.IsInRole("Admin");
            
            if (!isAdmin && existingInstruction.CreatedByUserId != userId)
            {
                return Forbid("You can only modify your own AI instructions");
            }

            var instruction = await _aiInstructionsService.ToggleInstructionStatusAsync(instructionId, statusDto.IsActive);
            return Ok(instruction);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling AI instruction status {InstructionId}", instructionId);
            return StatusCode(500, "An error occurred while updating the instruction status");
        }
    }

    #endregion

    #region Template Management

    /// <summary>
    /// Get template AI instructions
    /// </summary>
    [HttpGet("templates")]
    public async Task<ActionResult<IEnumerable<AiCustomInstructionDTO>>> GetTemplateInstructions()
    {
        try
        {
            var templates = await _aiInstructionsService.GetTemplateInstructionsAsync();
            return Ok(templates);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting template AI instructions");
            return StatusCode(500, "An error occurred while fetching template instructions");
        }
    }

    /// <summary>
    /// Get default AI instruction
    /// </summary>
    [HttpGet("default")]
    public async Task<ActionResult<AiCustomInstructionDTO>> GetDefaultInstruction()
    {
        try
        {
            var defaultInstruction = await _aiInstructionsService.GetDefaultInstructionAsync();
            
            if (defaultInstruction == null)
            {
                return NotFound("No default AI instruction found");
            }

            return Ok(defaultInstruction);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting default AI instruction");
            return StatusCode(500, "An error occurred while fetching the default instruction");
        }
    }

    #endregion

    #region Testing Integration

    /// <summary>
    /// Test AI instruction with sample query (uses default model)
    /// </summary>
    [HttpPost("admin/{instructionId}/test")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<TestInstructionResponseDTO>>> TestInstruction(
        int instructionId,
        [FromBody] TestInstructionRequestDTO testRequest)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(testRequest.SampleQuery))
            {
                return BadRequest("Sample query cannot be empty");
            }

            var result = await _aiInstructionsService.TestInstructionAsync(instructionId, testRequest);
            
            return Ok(new ApiResponseDTO<TestInstructionResponseDTO>
            {
                Success = true,
                Message = "AI instruction tested successfully",
                Data = result
            });
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error testing AI instruction {InstructionId}", instructionId);
            return StatusCode(500, "An error occurred while testing the AI instruction");
        }
    }

    /// <summary>
    /// Test AI instruction with specific model
    /// </summary>
    [HttpPost("{instructionId}/test-with-model")]
    public async Task<ActionResult<ApiResponseDTO<TestInstructionResponseDTO>>> TestInstructionWithModel(
        int instructionId,
        [FromBody] TestInstructionWithModelRequestDTO testRequest)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(testRequest.SampleQuery))
            {
                return BadRequest("Sample query cannot be empty");
            }

            if (string.IsNullOrWhiteSpace(testRequest.ModelName))
            {
                return BadRequest("Model name cannot be empty");
            }

            // Check access permissions
            var instruction = await _aiInstructionsService.GetInstructionByIdAsync(instructionId);
            if (instruction == null)
            {
                return NotFound($"AI instruction with ID {instructionId} not found");
            }

            var userId = GetCurrentUserId();
            var isAdmin = User.IsInRole("Admin");
            
            if (!isAdmin && instruction.CreatedByUserId != userId)
            {
                return Forbid("You can only test your own AI instructions");
            }

            var result = await _aiInstructionsService.TestInstructionWithModelAsync(instructionId, testRequest);
            
            return Ok(new ApiResponseDTO<TestInstructionResponseDTO>
            {
                Success = true,
                Message = "AI instruction tested successfully",
                Data = result
            });
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error testing AI instruction {InstructionId} with model {ModelName}", 
                instructionId, testRequest.ModelName);
            return StatusCode(500, "An error occurred while testing the AI instruction");
        }
    }

    #endregion

    #region Analytics

    /// <summary>
    /// Get instruction analytics
    /// </summary>
    [HttpGet("{instructionId}/analytics")]
    public async Task<ActionResult<IEnumerable<AiQueryAnalyticsDTO>>> GetInstructionAnalytics(int instructionId)
    {
        try
        {
            // Check access permissions
            var instruction = await _aiInstructionsService.GetInstructionByIdAsync(instructionId);
            if (instruction == null)
            {
                return NotFound($"AI instruction with ID {instructionId} not found");
            }

            var userId = GetCurrentUserId();
            var isAdmin = User.IsInRole("Admin");
            
            if (!isAdmin && instruction.CreatedByUserId != userId)
            {
                return Forbid("You can only view analytics for your own AI instructions");
            }

            var analytics = await _aiInstructionsService.GetInstructionAnalyticsAsync(instructionId);
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting analytics for AI instruction {InstructionId}", instructionId);
            return StatusCode(500, "An error occurred while fetching instruction analytics");
        }
    }

    /// <summary>
    /// Get instruction performance metrics
    /// </summary>
    [HttpGet("{instructionId}/performance")]
    public async Task<ActionResult<InstructionPerformanceDTO>> GetInstructionPerformance(int instructionId)
    {
        try
        {
            // Check access permissions
            var instruction = await _aiInstructionsService.GetInstructionByIdAsync(instructionId);
            if (instruction == null)
            {
                return NotFound($"AI instruction with ID {instructionId} not found");
            }

            var userId = GetCurrentUserId();
            var isAdmin = User.IsInRole("Admin");
            
            if (!isAdmin && instruction.CreatedByUserId != userId)
            {
                return Forbid("You can only view performance for your own AI instructions");
            }

            var performance = await _aiInstructionsService.GetInstructionPerformanceAsync(instructionId);
            return Ok(performance);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting performance for AI instruction {InstructionId}", instructionId);
            return StatusCode(500, "An error occurred while fetching instruction performance");
        }
    }

    /// <summary>
    /// Get all analytics (Admin only)
    /// </summary>
    [HttpGet("analytics")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<AiQueryAnalyticsDTO>>> GetAllAnalytics()
    {
        try
        {
            var analytics = await _aiInstructionsService.GetAllAnalyticsAsync();
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all AI analytics");
            return StatusCode(500, "An error occurred while fetching analytics");
        }
    }

    #endregion

    #region AI Provider Integration

    /// <summary>
    /// Get available AI models (Admin only) - Compatible with TestingPlayground
    /// </summary>
    [HttpGet("admin/gemini-models")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<IEnumerable<string>>>> GetAvailableModels()
    {
        try
        {
            var models = await _aiInstructionsService.GetAvailableModelsAsync();
            
            return Ok(new ApiResponseDTO<IEnumerable<string>>
            {
                Success = true,
                Message = "Available AI models retrieved successfully",
                Data = models
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available AI models");
            return StatusCode(500, "An error occurred while fetching available models");
        }
    }

    /// <summary>
    /// Get AI configuration (Admin only) - Compatible with TestingPlayground
    /// </summary>
    [HttpGet("admin/gemini-config")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<object>>> GetAiConfiguration()
    {
        try
        {
            var config = await _aiInstructionsService.GetAiConfigurationAsync();
            
            return Ok(new ApiResponseDTO<object>
            {
                Success = true,
                Message = "AI configuration retrieved successfully",
                Data = config
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting AI configuration");
            return StatusCode(500, "An error occurred while fetching AI configuration");
        }
    }

    #endregion

    #region Helper Methods

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
        {
            return userId;
        }
        throw new UnauthorizedAccessException("Invalid user ID");
    }

    #endregion
}
