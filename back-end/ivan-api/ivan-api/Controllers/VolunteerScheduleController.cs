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

        #region Organization/Coordinator endpoints

        /// <summary>
        /// Get paginated list of volunteer schedules for organization (Coordinator role)
        /// </summary>
        [HttpGet("organization")]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<IActionResult> GetOrganizationVolunteerSchedules([FromQuery] VolunteerScheduleFilterDTO filter)
        {
            var organizationId = GetOrganizationId();
            if (organizationId == 0)
                return Unauthorized("Organization not found");

            var result = await _volunteerScheduleService.GetOrganizationVolunteerSchedulesAsync(organizationId, filter);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Get volunteer schedule by ID (Organization/Coordinator role)
        /// </summary>
        [HttpGet("organization/{scheduleId}")]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<IActionResult> GetVolunteerScheduleById(int scheduleId)
        {
            var organizationId = GetOrganizationId();
            if (organizationId == 0)
                return Unauthorized("Organization not found");

            var result = await _volunteerScheduleService.GetVolunteerScheduleByIdAsync(organizationId, scheduleId);
            
            if (!result.Success)
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) : BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Create new volunteer schedule (Organization/Coordinator role)
        /// </summary>
        [HttpPost("organization")]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<IActionResult> CreateVolunteerSchedule([FromBody] VolunteerScheduleRequestDTO request)
        {
            var organizationId = GetOrganizationId();
            if (organizationId == 0)
                return Unauthorized("Organization not found");

            var userId = GetUserId();
            var result = await _volunteerScheduleService.CreateVolunteerScheduleAsync(organizationId, request, userId);
            
            if (!result.Success)
                return BadRequest(result);

            return CreatedAtAction(nameof(GetVolunteerScheduleById), new { scheduleId = result.Data?.ScheduleId }, result);
        }

        /// <summary>
        /// Update volunteer schedule (Organization/Coordinator role)
        /// </summary>
        [HttpPut("organization/{scheduleId}")]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<IActionResult> UpdateVolunteerSchedule(int scheduleId, [FromBody] VolunteerScheduleRequestDTO request)
        {
            var organizationId = GetOrganizationId();
            if (organizationId == 0)
                return Unauthorized("Organization not found");

            var userId = GetUserId();
            var result = await _volunteerScheduleService.UpdateVolunteerScheduleAsync(organizationId, scheduleId, request, userId);
            
            if (!result.Success)
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) : BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Delete volunteer schedule (Organization/Coordinator role)
        /// </summary>
        [HttpDelete("organization/{scheduleId}")]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<IActionResult> DeleteVolunteerSchedule(int scheduleId)
        {
            var organizationId = GetOrganizationId();
            if (organizationId == 0)
                return Unauthorized("Organization not found");

            var result = await _volunteerScheduleService.DeleteVolunteerScheduleAsync(organizationId, scheduleId);
            
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
            var userIdClaim = User.FindFirst("UserId")?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 0;
        }

        private int GetOrganizationId()
        {
            var organizationIdClaim = User.FindFirst("OrganizationId")?.Value;
            return int.TryParse(organizationIdClaim, out var orgId) ? orgId : 0;
        }

        #endregion
    }
}
