using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.AI;
using ivan_api.Services.AI.Interfaces;
using System.Security.Claims;
using Microsoft.Extensions.Logging;
using ivan_api.DTOs.Common;

namespace ivan_api.Controllers;

/// <summary>
/// Controller for AI Custom Instructions management
/// Handles CRUD operations and testing for custom AI instructions
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AiCustomInstructionController : ControllerBase
{
    private readonly IAiCustomInstructionService _customInstructionService;
    private readonly ILogger<AiCustomInstructionController> _logger;

    public AiCustomInstructionController(
        IAiCustomInstructionService customInstructionService,
        ILogger<AiCustomInstructionController> logger)
    {
        _customInstructionService = customInstructionService;
        _logger = logger;
    }

    /// <summary>
    /// Get all AI custom instructions (Admin only)
    /// </summary>
    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponseDTO<List<AiCustomInstructionDTO>>>> GetAllInstructions()
    {
        try
        {
            var instructions = await _customInstructionService.GetAllCustomInstructionsAsync();
            return Ok(new ApiResponseDTO<List<AiCustomInstructionDTO>>
            {
                Success = true,
                Data = instructions.ToList(),
                Message = "All custom instructions retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all custom instructions");
            return StatusCode(500, new ApiResponseDTO<List<AiCustomInstructionDTO>>
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { "Error retrieving instructions" }
            });
        }
    }

    /// <summary>
    /// Get AI custom instructions for current user (role-based filtering)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponseDTO<List<AiCustomInstructionDTO>>>> GetUserInstructions()
    {
        try
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            var instructions = await _customInstructionService.GetUserCustomInstructionsAsync(userId, userRole);
            return Ok(new ApiResponseDTO<List<AiCustomInstructionDTO>>
            {
                Success = true,
                Data = instructions.ToList(),
                Message = "User custom instructions retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user custom instructions");
            return StatusCode(500, new ApiResponseDTO<List<AiCustomInstructionDTO>>
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { "Error retrieving instructions" }
            });
        }
    }

    /// <summary>
    /// Get a specific AI custom instruction by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponseDTO<AiCustomInstructionDTO>>> GetInstruction(int id)
    {
        try
        {
            var instruction = await _customInstructionService.GetCustomInstructionByIdAsync(id);
            
            if (instruction == null)
                return NotFound(new ApiResponseDTO<AiCustomInstructionDTO>
                {
                    Success = false,
                    Message = "Instruction not found",
                    Errors = new List<string> { $"Instruction with ID {id} does not exist" }
                });

            return Ok(new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = true,
                Data = instruction,
                Message = "Custom instruction retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting custom instruction {InstructionId}", id);
            return StatusCode(500, new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { "Error retrieving instruction" }
            });
        }
    }



    /// <summary>
    /// Create a new AI custom instruction
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponseDTO<AiCustomInstructionDTO>>> CreateInstruction([FromBody] AiCustomInstructionCreateDTO createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new ApiResponseDTO<AiCustomInstructionDTO>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                });
            }

            var userId = GetCurrentUserId();
            var instruction = await _customInstructionService.CreateCustomInstructionAsync(createDto, userId);

            return CreatedAtAction(nameof(GetInstruction), new { id = instruction.InstructionId }, 
                new ApiResponseDTO<AiCustomInstructionDTO>
                {
                    Success = true,
                    Data = instruction,
                    Message = "Custom instruction created successfully"
                });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating custom instruction");
            return StatusCode(500, new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { "Error creating instruction" }
            });
        }
    }

    /// <summary>
    /// Update an existing AI custom instruction
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponseDTO<AiCustomInstructionDTO>>> UpdateInstruction(int id, [FromBody] AiCustomInstructionUpdateDTO updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new ApiResponseDTO<AiCustomInstructionDTO>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                });
            }

            var instruction = await _customInstructionService.UpdateCustomInstructionAsync(id, updateDto);
            return Ok(new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = true,
                Data = instruction,
                Message = "Custom instruction updated successfully"
            });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Instruction not found for update: {InstructionId}", id);
            return NotFound(new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = false,
                Message = ex.Message,
                Errors = new List<string> { $"Instruction with ID {id} not found" }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating custom instruction {InstructionId}", id);
            return StatusCode(500, new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { "Error updating instruction" }
            });
        }
    }

    /// <summary>
    /// Delete an AI custom instruction
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponseDTO<object>>> DeleteInstruction(int id)
    {
        try
        {
            var result = await _customInstructionService.DeleteCustomInstructionAsync(id);
            
            if (!result)
                return NotFound(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Instruction not found",
                    Errors = new List<string> { $"Instruction with ID {id} does not exist" }
                });

            return Ok(new ApiResponseDTO<object>
            {
                Success = true,
                Message = "Instruction deleted successfully",
                Data = new { deletedId = id }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting custom instruction {InstructionId}", id);
            return StatusCode(500, new ApiResponseDTO<object>
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { "Error deleting instruction" }
            });
        }
    }

    /// <summary>
    /// Toggle instruction active status
    /// </summary>
    [HttpPatch("{id}/status")]
    public async Task<ActionResult<ApiResponseDTO<AiCustomInstructionDTO>>> ToggleInstructionStatus(int id, [FromBody] ToggleInstructionStatusDTO statusDto)
    {
        try
        {
            var instruction = await _customInstructionService.ToggleInstructionStatusAsync(id, statusDto.IsActive);
            return Ok(new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = true,
                Data = instruction,
                Message = "Instruction status updated successfully"
            });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Instruction not found for status toggle: {InstructionId}", id);
            return NotFound(new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = false,
                Message = ex.Message,
                Errors = new List<string> { $"Instruction with ID {id} not found" }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling instruction status {InstructionId}", id);
            return StatusCode(500, new ApiResponseDTO<AiCustomInstructionDTO>
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { "Error updating instruction status" }
            });
        }
    }



    #region Private Helper Methods

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : 0;
    }

    private string GetCurrentUserRole()
    {
        return User.FindFirst(ClaimTypes.Role)?.Value ?? "Volunteer";
    }

    #endregion
}