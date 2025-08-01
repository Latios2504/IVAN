using ivan_api.Constants;
using ivan_api.DTOs.CoordinatorSchedule;
using ivan_api.Services.CoordinatorScheduleServ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    [Route("api/coordinator-schedules")]
    [ApiController]
    public class CoordinatorScheduleController : ControllerBase
    {
        private readonly ICoordinatorScheduleService _coordinatorScheduleService;

        public CoordinatorScheduleController(ICoordinatorScheduleService coordinatorScheduleService)
        {
            _coordinatorScheduleService = coordinatorScheduleService;
        }

        /// <summary>
        /// Get paginated list of coordinator schedules for organization
        /// </summary>
        [HttpGet]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<IActionResult> GetOrganizationSchedules([FromQuery] CoordinatorScheduleFilterDto filter)
        {
            var organizationId = GetOrganizationId();
            if (organizationId == 0)
                return Unauthorized("Organization not found");

            var result = await _coordinatorScheduleService.GetOrganizationSchedulesAsync(organizationId, filter);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Get coordinator schedule by ID
        /// </summary>
        [HttpGet("{scheduleId}")]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<IActionResult> GetScheduleById(int scheduleId)
        {
            int organizationId;
            
            if (User.IsInRole(AuthenticationConstants.Roles.Organization))
            {
                organizationId = GetOrganizationId();
            }
            else
            {
                // For coordinators, we need to get their organization through their profile
                var userId = GetUserId();
                var personalResult = await _coordinatorScheduleService.GetPersonalSchedulesAsync(userId, new CoordinatorScheduleFilterDto { Size = 1 });
                if (!personalResult.Success || !personalResult.Data!.Items.Any())
                    return NotFound("Coordinator profile not found");
                
                // Get organization through a schedule - this is a bit indirect but works
                // In a real implementation, you might want a separate method to get coordinator's organization
                organizationId = GetOrganizationId(); // This would need to be implemented properly
            }

            if (organizationId == 0)
                return Unauthorized("Organization not found");

            var result = await _coordinatorScheduleService.GetScheduleByIdAsync(organizationId, scheduleId);
            
            if (!result.Success)
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) : BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Create new coordinator schedule
        /// </summary>
        [HttpPost]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<IActionResult> CreateSchedule([FromBody] CreateCoordinatorScheduleDto createDto)
        {
            var organizationId = GetOrganizationId();
            if (organizationId == 0)
                return Unauthorized("Organization not found");

            var userId = GetUserId();
            var result = await _coordinatorScheduleService.CreateScheduleAsync(organizationId, createDto, userId);
            
            if (!result.Success)
                return BadRequest(result);

            return CreatedAtAction(nameof(GetScheduleById), new { scheduleId = result.Data }, result);
        }

        /// <summary>
        /// Update coordinator schedule
        /// </summary>
        [HttpPut("{scheduleId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<IActionResult> UpdateSchedule(int scheduleId, [FromBody] UpdateCoordinatorScheduleDto updateDto)
        {
            var organizationId = GetOrganizationId();
            if (organizationId == 0)
                return Unauthorized("Organization not found");

            var userId = GetUserId();
            var result = await _coordinatorScheduleService.UpdateScheduleAsync(organizationId, scheduleId, updateDto, userId);
            
            if (!result.Success)
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) : BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Delete coordinator schedule
        /// </summary>
        [HttpDelete("{scheduleId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<IActionResult> DeleteSchedule(int scheduleId)
        {
            var organizationId = GetOrganizationId();
            if (organizationId == 0)
                return Unauthorized("Organization not found");

            var result = await _coordinatorScheduleService.DeleteScheduleAsync(organizationId, scheduleId);
            
            if (!result.Success)
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) : BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Get personal schedules for coordinator
        /// </summary>
        [HttpGet("personal")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<IActionResult> GetPersonalSchedules([FromQuery] CoordinatorScheduleFilterDto filter)
        {
            var userId = GetUserId();
            var result = await _coordinatorScheduleService.GetPersonalSchedulesAsync(userId, filter);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Get schedule statistics for organization
        /// </summary>
        [HttpGet("stats")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<IActionResult> GetScheduleStats()
        {
            var organizationId = GetOrganizationId();
            if (organizationId == 0)
                return Unauthorized("Organization not found");

            var result = await _coordinatorScheduleService.GetScheduleStatsAsync(organizationId);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Get calendar view of schedules
        /// </summary>
        [HttpGet("calendar")]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<IActionResult> GetCalendarView(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate,
            [FromQuery] int? coordinatorId = null)
        {
            int organizationId;
            
            if (User.IsInRole(AuthenticationConstants.Roles.Organization))
            {
                organizationId = GetOrganizationId();
            }
            else
            {
                // For coordinators, limit to their own schedules
                var userId = GetUserId();
                // You'd need to implement a method to get organizationId from coordinator userId
                organizationId = GetOrganizationId(); // Placeholder - implement properly
                
                // For coordinators, override coordinatorId to their own
                // You'd need to get their coordinatorId from their profile
                coordinatorId = null; // This should be set to their coordinator ID
            }

            if (organizationId == 0)
                return Unauthorized("Organization not found");

            var result = await _coordinatorScheduleService.GetCalendarViewAsync(organizationId, startDate, endDate, coordinatorId);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Update schedule status
        /// </summary>
        [HttpPatch("{scheduleId}/status")]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<IActionResult> UpdateScheduleStatus(int scheduleId, [FromBody] UpdateScheduleStatusDto statusDto)
        {
            var organizationId = GetOrganizationId();
            if (organizationId == 0)
                return Unauthorized("Organization not found");

            var userId = GetUserId();
            var result = await _coordinatorScheduleService.UpdateScheduleStatusAsync(organizationId, scheduleId, statusDto.Status, userId);
            
            if (!result.Success)
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) : BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Bulk update schedule statuses
        /// </summary>
        [HttpPatch("bulk/status")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<IActionResult> BulkUpdateStatus([FromBody] BulkUpdateStatusDto bulkDto)
        {
            var organizationId = GetOrganizationId();
            if (organizationId == 0)
                return Unauthorized("Organization not found");

            var userId = GetUserId();
            var result = await _coordinatorScheduleService.BulkUpdateStatusAsync(organizationId, bulkDto.ScheduleIds, bulkDto.Status, userId);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Bulk delete schedules
        /// </summary>
        [HttpDelete("bulk")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<IActionResult> BulkDelete([FromBody] BulkDeleteDto bulkDto)
        {
            var organizationId = GetOrganizationId();
            if (organizationId == 0)
                return Unauthorized("Organization not found");

            var result = await _coordinatorScheduleService.BulkDeleteAsync(organizationId, bulkDto.ScheduleIds);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Check for schedule conflicts
        /// </summary>
        [HttpPost("check-conflicts")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<IActionResult> CheckScheduleConflicts([FromBody] CheckConflictsDto conflictsDto)
        {
            var result = await _coordinatorScheduleService.CheckScheduleConflictsAsync(
                conflictsDto.CoordinatorId, 
                conflictsDto.StartDateTime, 
                conflictsDto.EndDateTime, 
                conflictsDto.ExcludeScheduleId);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 0;
        }

        private int GetOrganizationId()
        {
            // This should be implemented based on how you store organization information
            // It might be in claims, or you might need to query the database
            var organizationIdClaim = User.FindFirst("OrganizationId")?.Value;
            return int.TryParse(organizationIdClaim, out var orgId) ? orgId : 0;
        }
    }

    // Additional DTOs for specific actions
    public class UpdateScheduleStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }

    public class BulkUpdateStatusDto
    {
        public List<int> ScheduleIds { get; set; } = new();
        public string Status { get; set; } = string.Empty;
    }

    public class BulkDeleteDto
    {
        public List<int> ScheduleIds { get; set; } = new();
    }

    public class CheckConflictsDto
    {
        public int CoordinatorId { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public int? ExcludeScheduleId { get; set; }
    }
}
