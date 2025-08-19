using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ivan_api.DTOs.VolunteerCoordinator;
using ivan_api.Services.VolunteerCoordinatorServ;
using ivan_api.Constants;
using System.Security.Claims;
using ivan_api.DTOs.Common;
using ivan_api.Services.AuthenticationSer;

namespace ivan_api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class VolunteerCoordinatorController : ControllerBase
{
    private readonly IVolunteerCoordinatorService _coordinatorService;
    private readonly IAuthenticationService _authenticationService;

    public VolunteerCoordinatorController(
        IVolunteerCoordinatorService coordinatorService,
        IAuthenticationService authenticationService)
    {
        _coordinatorService = coordinatorService;
        _authenticationService = authenticationService;
    }

    /// <summary>
    /// Get paginated list of coordinators for an organization
    /// </summary>
    [HttpPost("getCoordinatorsByOrganization/{organizationId}")]
    [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.Admin}")]
    public async Task<IActionResult> GetCoordinatorsByOrganization(int organizationId,
        [FromBody] VolunteerCoordinatorFilterDto filter)
    {
        try
        {
            // For organization role, ensure they can only access their own coordinators
            if (User.IsInRole(AuthenticationConstants.Roles.Organization))
            {
                var userId = _authenticationService.GetUserIdFromClaims(User);
                var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);

                if (!userInfo.OrganizationId.HasValue || userInfo.OrganizationId.Value != organizationId)
                {
                    return Forbid("You can only access coordinators from your own organization");
                }
            }

            var result = await _coordinatorService.GetCoordinatorsByOrganizationAsync(organizationId, filter);
            return Ok(new ApiResponseDTO<object>
            {
                Success = true,
                Data = result,
                Message = "Coordinators retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponseDTO<object>
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Get coordinator by ID
    /// </summary>
    [HttpGet("{coordinatorId}")]
    [Authorize(Roles =
        $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator},{AuthenticationConstants.Roles.Admin}")]
    public async Task<ActionResult<ApiResponseDTO<VolunteerCoordinatorDto>>> GetCoordinatorById(int coordinatorId)
    {
        try
        {
            // For organization role, ensure they can only access coordinators from their organization
            if (User.IsInRole(AuthenticationConstants.Roles.Organization))
            {
                var userId = _authenticationService.GetUserIdFromClaims(User);
                var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);

                // Get coordinator and verify it belongs to the organization
                var coordinator = await _coordinatorService.GetCoordinatorByIdAsync(coordinatorId);
                if (coordinator == null)
                    return NotFound(new ApiResponseDTO<VolunteerCoordinatorDto>
                    {
                        Success = false,
                        Message = "Coordinator not found",
                        Errors = new List<string> { $"Coordinator with ID {coordinatorId} does not exist" }
                    });

                // Check if coordinator belongs to the organization
                var coordinatorOrganizationId = GetCoordinatorOrganizationId(coordinator);
                if (!userInfo.OrganizationId.HasValue || userInfo.OrganizationId.Value != coordinatorOrganizationId)
                {
                    return Forbid("You can only access coordinators from your own organization");
                }

                return Ok(new ApiResponseDTO<VolunteerCoordinatorDto>
                {
                    Success = true,
                    Data = coordinator,
                    Message = "Coordinator retrieved successfully"
                });
            }

            // For VolunteerCoordinator role, ensure they can only access their own profile
            if (User.IsInRole(AuthenticationConstants.Roles.VolunteerCoordinator))
            {
                var currentUserId = _authenticationService.GetUserIdFromClaims(User);
                var coordinator = await _coordinatorService.GetCoordinatorByUserIdAsync(currentUserId);

                if (coordinator == null || GetCoordinatorId(coordinator) != coordinatorId)
                {
                    return Forbid("You can only access your own coordinator profile");
                }

                return Ok(new ApiResponseDTO<VolunteerCoordinatorDto>
                {
                    Success = true,
                    Data = coordinator,
                    Message = "Coordinator retrieved successfully"
                });
            }

            // For Admin role, allow access to any coordinator
            var coordinatorData = await _coordinatorService.GetCoordinatorByIdAsync(coordinatorId);
            if (coordinatorData == null)
                return NotFound(new ApiResponseDTO<VolunteerCoordinatorDto>
                {
                    Success = false,
                    Message = "Coordinator not found",
                    Errors = new List<string> { $"Coordinator with ID {coordinatorId} does not exist" }
                });

            return Ok(new ApiResponseDTO<VolunteerCoordinatorDto>
            {
                Success = true,
                Data = coordinatorData,
                Message = "Coordinator retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponseDTO<VolunteerCoordinatorDto>
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Get coordinator by user ID
    /// </summary>
    [HttpGet("byUser/{userId}")]
    [Authorize(Roles =
        $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator},{AuthenticationConstants.Roles.Admin}")]
    public async Task<ActionResult<ApiResponseDTO<VolunteerCoordinatorDto>>> GetCoordinatorByUserId(int userId)
    {
        try
        {
            var coordinator = await _coordinatorService.GetCoordinatorByUserIdAsync(userId);
            if (coordinator == null)
                return NotFound(new ApiResponseDTO<VolunteerCoordinatorDto>
                {
                    Success = false,
                    Message = "Coordinator not found",
                    Errors = new List<string> { $"Coordinator with user ID {userId} does not exist" }
                });

            return Ok(new ApiResponseDTO<VolunteerCoordinatorDto>
            {
                Success = true,
                Data = coordinator,
                Message = "Coordinator retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponseDTO<object>
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Create a new coordinator for an organization
    /// </summary>
    [HttpPost("{organizationId}")]
    [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.Admin}")]
    public async Task<ActionResult<ApiResponseDTO<object>>> CreateCoordinator(int organizationId,
        [FromBody] CreateVolunteerCoordinatorDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                });
            }

            var currentUserId = _authenticationService.GetUserIdFromClaims(User);

            var coordinator =
                await _coordinatorService.CreateCoordinatorAsync(organizationId, createDto, currentUserId);
            return CreatedAtAction(
                nameof(GetCoordinatorById),
                new { coordinatorId = coordinator.CoordinatorId },
                new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = coordinator,
                    Message = "Coordinator created successfully"
                });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponseDTO<object>
            {
                Success = false,
                Message = ex.Message,
                Errors = new List<string> { ex.Message }
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ApiResponseDTO<object>
            {
                Success = false,
                Message = ex.Message,
                Errors = new List<string> { ex.Message }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponseDTO<object>
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Update coordinator information
    /// </summary>
    [HttpPut("{coordinatorId}")]
    [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.Admin}")]
    public async Task<ActionResult<ApiResponseDTO<VolunteerCoordinatorDto>>> UpdateCoordinator(int coordinatorId,
        [FromBody] UpdateVolunteerCoordinatorDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new ApiResponseDTO<VolunteerCoordinatorDto>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                });
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int currentUserId))
            {
                return Unauthorized(new ApiResponseDTO<VolunteerCoordinatorDto>
                {
                    Success = false,
                    Message = "Unauthorized access",
                    Errors = new List<string> { "Invalid user credentials" }
                });
            }

            var coordinator = await _coordinatorService.UpdateCoordinatorAsync(coordinatorId, updateDto, currentUserId);
            return Ok(new ApiResponseDTO<VolunteerCoordinatorDto>
            {
                Success = true,
                Message = "Coordinator updated successfully",
                Data = coordinator
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponseDTO<VolunteerCoordinatorDto>
            {
                Success = false,
                Message = ex.Message,
                Errors = new List<string> { ex.Message }
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ApiResponseDTO<VolunteerCoordinatorDto>
            {
                Success = false,
                Message = ex.Message,
                Errors = new List<string> { ex.Message }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponseDTO<VolunteerCoordinatorDto>
            {
                Success = false,
                Message = "Error updating coordinator",
                Errors = new List<string> { ex.Message }
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

            return Ok(new ApiResponseDTO<object>
            {
                Success = true,
                Message = "Coordinator removed successfully",
                Data = new { coordinatorId }
            });
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
    public async Task<ActionResult<ApiResponseDTO<VolunteerCoordinatorStatsDto>>> GetCoordinatorStats(
        int organizationId)
    {
        try
        {
            var stats = await _coordinatorService.GetCoordinatorStatsAsync(organizationId);
            return Ok(new ApiResponseDTO<VolunteerCoordinatorStatsDto>
            {
                Success = true,
                Message = "Statistics retrieved successfully",
                Data = stats
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponseDTO<VolunteerCoordinatorStatsDto>
            {
                Success = false,
                Message = "Error retrieving statistics",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Get available managers for an organization
    /// </summary>
    [HttpGet("managers/{organizationId}")]
    [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.Admin}")]
    public async Task<ActionResult<ApiResponseDTO<List<VolunteerCoordinatorDto>>>> GetAvailableManagers(
        int organizationId)
    {
        try
        {
            var managers = await _coordinatorService.GetAvailableManagersAsync(organizationId);
            return Ok(new ApiResponseDTO<List<VolunteerCoordinatorDto>>
            {
                Success = true,
                Message = "Managers retrieved successfully",
                Data = managers
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponseDTO<List<VolunteerCoordinatorDto>>
            {
                Success = false,
                Message = "Error retrieving managers",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Check if user is coordinator for organization
    /// </summary>
    [HttpGet("check/{userId}/{organizationId}")]
    [Authorize(Roles =
        $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator},{AuthenticationConstants.Roles.Admin}")]
    public async Task<ActionResult<ApiResponseDTO<bool>>> IsUserCoordinatorForOrganization(int userId,
        int organizationId)
    {
        try
        {
            var isCoordinator = await _coordinatorService.IsUserCoordinatorForOrganizationAsync(userId, organizationId);
            return Ok(new ApiResponseDTO<bool>
            {
                Success = true,
                Message = "Check completed successfully",
                Data = isCoordinator
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponseDTO<bool>
            {
                Success = false,
                Message = "Error checking coordinator status",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    #region Helper Methods

    /// <summary>
    /// Extract organization ID from coordinator object
    /// </summary>
    private int GetCoordinatorOrganizationId(object coordinator)
    {
        if (coordinator is VolunteerCoordinatorDto coordinatorDto)
        {
            return coordinatorDto.OrganizationId;
        }

        throw new InvalidOperationException("Coordinator object is not of expected type VolunteerCoordinatorDto");
    }

    /// <summary>
    /// Extract coordinator ID from coordinator object
    /// </summary>
    private int GetCoordinatorId(object coordinator)
    {
        if (coordinator is VolunteerCoordinatorDto coordinatorDto)
        {
            return coordinatorDto.CoordinatorId;
        }

        throw new InvalidOperationException("Coordinator object is not of expected type VolunteerCoordinatorDto");
    }

    #endregion
}
