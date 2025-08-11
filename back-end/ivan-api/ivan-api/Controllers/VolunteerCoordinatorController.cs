using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ivan_api.DTOs.VolunteerCoordinator;
using ivan_api.Services.VolunteerCoordinatorServ;
using ivan_api.Constants;
using System.Security.Claims;

namespace ivan_api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class VolunteerCoordinatorController : ControllerBase
{
    private readonly IVolunteerCoordinatorService _coordinatorService;

    public VolunteerCoordinatorController(IVolunteerCoordinatorService coordinatorService)
    {
        _coordinatorService = coordinatorService;
    }

    /// <summary>
    /// Get paginated list of coordinators for an organization
    /// </summary>
    [HttpPost("getCoordinatorsByOrganization/{organizationId}")]
    [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.Admin}")]
    public async Task<IActionResult> GetCoordinatorsByOrganization(int organizationId, [FromBody] VolunteerCoordinatorFilterDto filter)
    {
        try
        {
            // For organization role, ensure they can only access their own coordinators
            if (User.IsInRole(AuthenticationConstants.Roles.Organization))
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int currentUserId))
                    return Unauthorized();

                // TODO: Add validation to ensure user belongs to the organization
            }

            var result = await _coordinatorService.GetCoordinatorsByOrganizationAsync(organizationId, filter);
            return Ok(new 
            { 
                success = true, 
                message = "Coordinators retrieved successfully", 
                data = result 
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new 
            { 
                success = false, 
                message = "Error retrieving coordinators", 
                errors = new[] { ex.Message } 
            });
        }
    }

    /// <summary>
    /// Get coordinator by ID
    /// </summary>
    [HttpGet("{coordinatorId}")]
    [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator},{AuthenticationConstants.Roles.Admin}")]
    public async Task<IActionResult> GetCoordinatorById(int coordinatorId)
    {
        try
        {
            var coordinator = await _coordinatorService.GetCoordinatorByIdAsync(coordinatorId);
            if (coordinator == null)
                return NotFound(new { success = false, message = "Coordinator not found" });

            return Ok(new 
            { 
                success = true, 
                message = "Coordinator retrieved successfully", 
                data = coordinator 
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new 
            { 
                success = false, 
                message = "Error retrieving coordinator", 
                errors = new[] { ex.Message } 
            });
        }
    }

    /// <summary>
    /// Get coordinator by user ID
    /// </summary>
    [HttpGet("byUser/{userId}")]
    [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator},{AuthenticationConstants.Roles.Admin}")]
    public async Task<IActionResult> GetCoordinatorByUserId(int userId)
    {
        try
        {
            var coordinator = await _coordinatorService.GetCoordinatorByUserIdAsync(userId);
            if (coordinator == null)
                return NotFound(new { success = false, message = "Coordinator not found" });

            return Ok(new 
            { 
                success = true, 
                message = "Coordinator retrieved successfully", 
                data = coordinator 
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new 
            { 
                success = false, 
                message = "Error retrieving coordinator", 
                errors = new[] { ex.Message } 
            });
        }
    }

    /// <summary>
    /// Create a new coordinator for an organization
    /// </summary>
    [HttpPost("{organizationId}")]
    [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.Admin}")]
    public async Task<IActionResult> CreateCoordinator(int organizationId, [FromBody] CreateVolunteerCoordinatorDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int currentUserId))
                return Unauthorized();

            var coordinator = await _coordinatorService.CreateCoordinatorAsync(organizationId, createDto, currentUserId);
            return CreatedAtAction(
                nameof(GetCoordinatorById), 
                new { coordinatorId = coordinator.CoordinatorId }, 
                new 
                { 
                    success = true, 
                    message = "Coordinator created successfully", 
                    data = coordinator 
                });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new 
            { 
                success = false, 
                message = "Error creating coordinator", 
                errors = new[] { ex.Message } 
            });
        }
    }

    /// <summary>
    /// Update coordinator information
    /// </summary>
    [HttpPut("{coordinatorId}")]
    [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.Admin}")]
    public async Task<IActionResult> UpdateCoordinator(int coordinatorId, [FromBody] UpdateVolunteerCoordinatorDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int currentUserId))
                return Unauthorized();

            var coordinator = await _coordinatorService.UpdateCoordinatorAsync(coordinatorId, updateDto, currentUserId);
            return Ok(new 
            { 
                success = true, 
                message = "Coordinator updated successfully", 
                data = coordinator 
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new 
            { 
                success = false, 
                message = "Error updating coordinator", 
                errors = new[] { ex.Message } 
            });
        }
    }

    /// <summary>
    /// Delete/deactivate coordinator
    /// </summary>
    [HttpDelete("{coordinatorId}")]
    [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.Admin}")]
    public async Task<IActionResult> DeleteCoordinator(int coordinatorId)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int currentUserId))
                return Unauthorized();

            var result = await _coordinatorService.DeleteCoordinatorAsync(coordinatorId, currentUserId);
            if (!result)
                return NotFound(new { success = false, message = "Coordinator not found" });

            return Ok(new { success = true, message = "Coordinator removed successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new 
            { 
                success = false, 
                message = "Error removing coordinator", 
                errors = new[] { ex.Message } 
            });
        }
    }

    /// <summary>
    /// Get coordinator statistics for an organization
    /// </summary>
    [HttpGet("stats/{organizationId}")]
    [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.Admin}")]
    public async Task<IActionResult> GetCoordinatorStats(int organizationId)
    {
        try
        {
            var stats = await _coordinatorService.GetCoordinatorStatsAsync(organizationId);
            return Ok(new 
            { 
                success = true, 
                message = "Statistics retrieved successfully", 
                data = stats 
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new 
            { 
                success = false, 
                message = "Error retrieving statistics", 
                errors = new[] { ex.Message } 
            });
        }
    }

    /// <summary>
    /// Get available managers for an organization
    /// </summary>
    [HttpGet("managers/{organizationId}")]
    [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.Admin}")]
    public async Task<IActionResult> GetAvailableManagers(int organizationId)
    {
        try
        {
            var managers = await _coordinatorService.GetAvailableManagersAsync(organizationId);
            return Ok(new 
            { 
                success = true, 
                message = "Managers retrieved successfully", 
                data = managers 
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new 
            { 
                success = false, 
                message = "Error retrieving managers", 
                errors = new[] { ex.Message } 
            });
        }
    }

    /// <summary>
    /// Check if user is coordinator for organization
    /// </summary>
    [HttpGet("check/{userId}/{organizationId}")]
    [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator},{AuthenticationConstants.Roles.Admin}")]
    public async Task<IActionResult> IsUserCoordinatorForOrganization(int userId, int organizationId)
    {
        try
        {
            var isCoordinator = await _coordinatorService.IsUserCoordinatorForOrganizationAsync(userId, organizationId);
            return Ok(new 
            { 
                success = true, 
                message = "Check completed successfully", 
                data = new { isCoordinator } 
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new 
            { 
                success = false, 
                message = "Error checking coordinator status", 
                errors = new[] { ex.Message } 
            });
        }
    }
}
