using ivan_api.Constants;
using ivan_api.DTOs;
using ivan_api.DTOs.Common;
using ivan_api.Services.VolunteerScheduleServ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VolunteerScheduleController : ControllerBase
    {
        private readonly IVolunteerScheduleService _volunteerScheduleService;

        public VolunteerScheduleController(IVolunteerScheduleService volunteerScheduleService)
        {
            _volunteerScheduleService = volunteerScheduleService;
        }

        #region Coordinator endpoints

        /// <summary>
        /// Get paginated list of volunteer schedules for coordinator
        /// </summary>
        [HttpGet("coordinator")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<IActionResult> GetCoordinatorVolunteerSchedules([FromQuery] VolunteerScheduleFilterDTO filter)
        {
            // Get user ID from token - this should always work for authenticated users
            var userId = GetUserId();
            if (userId == 0)
                return Unauthorized("User not found");

            // For VolunteerCoordinator role, we need to look up which organization they belong to
            var coordinatorId = userId; // Coordinator's user ID
            
            var result = await _volunteerScheduleService.GetOrganizationVolunteerSchedulesAsync(coordinatorId, filter);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Get volunteer schedule by ID (Coordinator role)
        /// </summary>
        [HttpGet("coordinator/{scheduleId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<IActionResult> GetVolunteerScheduleById(int scheduleId)
        {
            var coordinatorId = GetUserId();
            if (coordinatorId == 0)
                return Unauthorized("Coordinator not found");

            var result = await _volunteerScheduleService.GetVolunteerScheduleByIdAsync(coordinatorId, scheduleId);
            
            if (!result.Success)
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) : BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Create new volunteer schedule (Coordinator role)
        /// </summary>
        [HttpPost("coordinator")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<IActionResult> CreateVolunteerSchedule([FromBody] VolunteerScheduleRequestDTO request)
        {
            var coordinatorId = GetUserId();
            if (coordinatorId == 0)
                return Unauthorized("Coordinator not found");

            var userId = GetUserId();
            var result = await _volunteerScheduleService.CreateVolunteerScheduleAsync(coordinatorId, request, userId);
            
            if (!result.Success)
                return BadRequest(result);

            return CreatedAtAction(nameof(GetVolunteerScheduleById), new { scheduleId = result.Data?.ScheduleId }, result);
        }

        /// <summary>
        /// Update volunteer schedule (Coordinator role)
        /// </summary>
        [HttpPut("coordinator/{scheduleId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<IActionResult> UpdateVolunteerSchedule(int scheduleId, [FromBody] VolunteerScheduleRequestDTO request)
        {
            var coordinatorId = GetUserId();
            if (coordinatorId == 0)
                return Unauthorized("Coordinator not found");

            var userId = GetUserId();
            var result = await _volunteerScheduleService.UpdateVolunteerScheduleAsync(coordinatorId, scheduleId, request, userId);
            
            if (!result.Success)
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) : BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Delete volunteer schedule (Coordinator role)
        /// </summary>
        [HttpDelete("coordinator/{scheduleId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<IActionResult> DeleteVolunteerSchedule(int scheduleId)
        {
            var coordinatorId = GetUserId();
            if (coordinatorId == 0)
                return Unauthorized("Coordinator not found");

            var result = await _volunteerScheduleService.DeleteVolunteerScheduleAsync(coordinatorId, scheduleId);
            
            if (!result.Success)
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) : BadRequest(result);

            return Ok(result);
        }

        #endregion

        #region Volunteer personal schedule endpoints

        /// <summary>
        /// Get personal schedules for volunteer
        /// </summary>
        [HttpGet("personal")]
        [Authorize(Roles = AuthenticationConstants.Roles.Volunteer)]
        public async Task<IActionResult> GetPersonalSchedules([FromQuery] VolunteerScheduleFilterDTO filter)
        {
            var userId = GetUserId();
            var result = await _volunteerScheduleService.GetPersonalSchedulesAsync(userId, filter);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Get personal schedule by ID for volunteer
        /// </summary>
        [HttpGet("personal/{scheduleId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.Volunteer)]
        public async Task<IActionResult> GetPersonalScheduleById(int scheduleId)
        {
            var userId = GetUserId();
            var result = await _volunteerScheduleService.GetPersonalScheduleByIdAsync(userId, scheduleId);
            
            if (!result.Success)
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) : BadRequest(result);

            return Ok(result);
        }

        #endregion

        #region Helper Methods
        
        private int GetUserId()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 0;
        }

        private int GetOrganizationId()
        {
            // First try to get OrganizationId claim directly
            var organizationIdClaim = User.FindFirst("OrganizationId")?.Value;
            if (int.TryParse(organizationIdClaim, out var orgId))
                return orgId;

            // If not found, get from NameIdentifier for organization users
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out var userId))
            {
                // For organization role, the user ID should map to organization
                // This is a temporary solution - in production you'd query the database
                return userId; // Assuming organization user ID = organization ID for now
            }

            return 0;
        }

        #endregion
    }
}
