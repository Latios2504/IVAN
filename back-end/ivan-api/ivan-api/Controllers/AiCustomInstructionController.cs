using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.AI;
using ivan_api.Services.AI.Interfaces;
using System.Security.Claims;
using Microsoft.Extensions.Logging;

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
    public async Task<ActionResult<List<AiCustomInstructionDTO>>> GetAllInstructions()
    {
        try
        {
            var instructions = await _customInstructionService.GetAllCustomInstructionsAsync();
            return Ok(new { success = true, data = instructions });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all custom instructions");
            return StatusCode(500, new { success = false, message = "Error retrieving instructions" });
        }
    }

    /// <summary>
    /// Get AI custom instructions for current user (role-based filtering)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<AiCustomInstructionDTO>>> GetUserInstructions()
    {
        try
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            var instructions = await _customInstructionService.GetUserCustomInstructionsAsync(userId, userRole);
            return Ok(new { success = true, data = instructions });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user custom instructions");
            return StatusCode(500, new { success = false, message = "Error retrieving instructions" });
        }
    }

    /// <summary>
    /// Get a specific AI custom instruction by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<AiCustomInstructionDTO>> GetInstruction(int id)
    {
        try
        {
            var instruction = await _customInstructionService.GetCustomInstructionByIdAsync(id);
            
            if (instruction == null)
                return NotFound(new { success = false, message = "Instruction not found" });

            return Ok(new { success = true, data = instruction });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting custom instruction {InstructionId}", id);
            return StatusCode(500, new { success = false, message = "Error retrieving instruction" });
        }
    }



    /// <summary>
    /// Create a new AI custom instruction
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<AiCustomInstructionDTO>> CreateInstruction([FromBody] AiCustomInstructionCreateDTO createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Invalid input data", errors = ModelState });
            }

            var userId = GetCurrentUserId();
            var instruction = await _customInstructionService.CreateCustomInstructionAsync(createDto, userId);

            return CreatedAtAction(nameof(GetInstruction), new { id = instruction.InstructionId }, 
                new { success = true, data = instruction });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating custom instruction");
            return StatusCode(500, new { success = false, message = "Error creating instruction" });
        }
    }

    /// <summary>
    /// Update an existing AI custom instruction
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<AiCustomInstructionDTO>> UpdateInstruction(int id, [FromBody] AiCustomInstructionUpdateDTO updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Invalid input data", errors = ModelState });
            }

            var instruction = await _customInstructionService.UpdateCustomInstructionAsync(id, updateDto);
            return Ok(new { success = true, data = instruction });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Instruction not found for update: {InstructionId}", id);
            return NotFound(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating custom instruction {InstructionId}", id);
            return StatusCode(500, new { success = false, message = "Error updating instruction" });
        }
    }

    /// <summary>
    /// Delete an AI custom instruction
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteInstruction(int id)
    {
        try
        {
            var result = await _customInstructionService.DeleteCustomInstructionAsync(id);
            
            if (!result)
                return NotFound(new { success = false, message = "Instruction not found" });

            return Ok(new { success = true, message = "Instruction deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting custom instruction {InstructionId}", id);
            return StatusCode(500, new { success = false, message = "Error deleting instruction" });
        }
    }

    /// <summary>
    /// Toggle instruction active status
    /// </summary>
    [HttpPatch("{id}/status")]
    public async Task<ActionResult<AiCustomInstructionDTO>> ToggleInstructionStatus(int id, [FromBody] ToggleInstructionStatusDTO statusDto)
    {
        try
        {
            var instruction = await _customInstructionService.ToggleInstructionStatusAsync(id, statusDto.IsActive);
            return Ok(new { success = true, data = instruction });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Instruction not found for status toggle: {InstructionId}", id);
            return NotFound(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling instruction status {InstructionId}", id);
            return StatusCode(500, new { success = false, message = "Error updating instruction status" });
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