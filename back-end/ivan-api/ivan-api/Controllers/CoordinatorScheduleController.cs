using ivan_api.Constants;
using ivan_api.DTOs.CoordinatorSchedule;
using ivan_api.DTOs.Common;
using ivan_api.Extensions;
using ivan_api.Services.CoordinatorScheduleServ;
using ivan_api.Services.AuthenticationSer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoordinatorScheduleController : ControllerBase
    {
        private readonly ICoordinatorScheduleService _coordinatorScheduleService;
        private readonly IAuthenticationService _authenticationService;

        public CoordinatorScheduleController(ICoordinatorScheduleService coordinatorScheduleService,
            IAuthenticationService authenticationService)
        {
            _coordinatorScheduleService = coordinatorScheduleService;
            _authenticationService = authenticationService;
        }

        // For Volunteer Coordinator: View personal schedules
        [HttpGet("personal")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>>> GetPersonalSchedules(
            [FromQuery] int? eventId, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate,
            [FromQuery] int page = 1, [FromQuery] int size = 20)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }

            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var filter = new CoordinatorScheduleFilterDto
            {
                EventId = eventId,
                StartDate = startDate,
                EndDate = endDate,
                PageNumber = page,
                PageSize = size
            };

            var result = await _coordinatorScheduleService.GetPersonalSchedulesAsync(userId, filter);
            if (result == null)
            {
                return Unauthorized(new ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>
                {
                    Success = false,
                    Message = "Coordinator not found for this user",
                    Errors = new List<string> { "User is not associated with a coordinator profile" }
                });
            }

            return Ok(new ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>
            {
                Success = true,
                Message = "Personal schedules retrieved successfully",
                Data = result
            });
        }

        // For Organization: List all schedules, optionally filtered by coordinator or event
        [HttpGet]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>>> ListSchedules(
            [FromQuery] int? coordinatorId, [FromQuery] int? eventId, [FromQuery] int page = 1,
            [FromQuery] int size = 20)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }

            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);

            if (userInfo?.OrganizationId == null)
            {
                return BadRequest(new ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>
                {
                    Success = false,
                    Message = "Organization not found for this user"
                });
            }

            var filter = new CoordinatorScheduleFilterDto
            {
                CoordinatorId = coordinatorId,
                EventId = eventId,
                PageNumber = page,
                PageSize = size
            };

            var result =
                await _coordinatorScheduleService.GetOrganizationSchedulesAsync(userInfo.OrganizationId.Value, filter);

            return Ok(new ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>
            {
                Success = true,
                Message = "Organization schedules retrieved successfully",
                Data = result
            });
        }

        // For Organization: View a specific schedule
        [HttpGet("{scheduleId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<CoordinatorScheduleDto>>> GetSchedule(int scheduleId)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<CoordinatorScheduleDto>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }

            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<CoordinatorScheduleDto>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);

            if (userInfo?.OrganizationId == null)
            {
                return BadRequest(new ApiResponseDTO<CoordinatorScheduleDto>
                {
                    Success = false,
                    Message = "Organization not found for this user"
                });
            }

            var result =
                await _coordinatorScheduleService.GetScheduleByIdAsync(userInfo.OrganizationId.Value, scheduleId);
            if (result == null)
            {
                return NotFound(new ApiResponseDTO<CoordinatorScheduleDto>
                {
                    Success = false,
                    Message = "Schedule not found",
                    Errors = new List<string> { "The requested schedule does not exist or you don't have access to it" }
                });
            }

            return Ok(new ApiResponseDTO<CoordinatorScheduleDto>
            {
                Success = true,
                Message = "Schedule retrieved successfully",
                Data = result
            });
        }

        // For Organization: Add a new schedule for a volunteer coordinator
        [HttpPost]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<int>>> AddSchedule(
            [FromBody] CreateCoordinatorScheduleDto request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.GetErrorMessages();
                return BadRequest(new ApiResponseDTO<int>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                });
            }

            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<int>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }

            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<int>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);

            if (userInfo?.OrganizationId == null)
            {
                return BadRequest(new ApiResponseDTO<int>
                {
                    Success = false,
                    Message = "Organization not found for this user"
                });
            }

            var result =
                await _coordinatorScheduleService.CreateScheduleAsync(userInfo.OrganizationId.Value, request, userId);
            if (result == null)
            {
                return BadRequest(new ApiResponseDTO<int>
                {
                    Success = false,
                    Message = "Failed to create schedule",
                    Errors = new List<string> { "Invalid coordinator or schedule conflict detected" }
                });
            }

            var response = new ApiResponseDTO<int>
            {
                Success = true,
                Message = "Schedule created successfully",
                Data = result.Value
            };

            return CreatedAtAction(nameof(GetSchedule), new { scheduleId = result.Value }, response);
        }

        // For Organization: Update a schedule
        [HttpPut("{scheduleId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<CoordinatorScheduleDto>>> UpdateSchedule(int scheduleId,
            [FromBody] UpdateCoordinatorScheduleDto request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.GetErrorMessages();
                return BadRequest(new ApiResponseDTO<CoordinatorScheduleDto>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                });
            }

            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<CoordinatorScheduleDto>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }

            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<CoordinatorScheduleDto>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);

            if (userInfo?.OrganizationId == null)
            {
                return BadRequest(new ApiResponseDTO<CoordinatorScheduleDto>
                {
                    Success = false,
                    Message = "Organization not found for this user"
                });
            }

            var result =
                await _coordinatorScheduleService.UpdateScheduleAsync(userInfo.OrganizationId.Value, scheduleId,
                    request, userId);
            if (!result)
            {
                return NotFound(new ApiResponseDTO<CoordinatorScheduleDto>
                {
                    Success = false,
                    Message = "Failed to update schedule",
                    Errors = new List<string> { "Schedule not found or update conflict detected" }
                });
            }

            // Get the updated schedule to return
            var updatedSchedule =
                await _coordinatorScheduleService.GetScheduleByIdAsync(userInfo.OrganizationId.Value, scheduleId);
            return Ok(new ApiResponseDTO<CoordinatorScheduleDto>
            {
                Success = true,
                Message = "Schedule updated successfully",
                Data = updatedSchedule
            });
        }

        // GET: api/CoordinatorSchedule/stats - Get schedule statistics
        [HttpGet("stats")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<CoordinatorScheduleStatsDto>>> GetScheduleStats()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<CoordinatorScheduleStatsDto>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }

            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<CoordinatorScheduleStatsDto>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);
            if (userInfo?.OrganizationId == null)
            {
                return BadRequest(new ApiResponseDTO<CoordinatorScheduleStatsDto>
                {
                    Success = false,
                    Message = "Organization not found for this user"
                });
            }

            var stats = await _coordinatorScheduleService.GetScheduleStatsAsync(userInfo.OrganizationId.Value);
            return Ok(new ApiResponseDTO<CoordinatorScheduleStatsDto>
            {
                Success = true,
                Message = "Schedule statistics retrieved successfully",
                Data = stats
            });
        }

        // GET: api/CoordinatorSchedule/calendar - Get calendar view
        [HttpGet("calendar")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<List<CoordinatorScheduleSummaryDto>>>> GetCalendarView(
            [FromQuery] DateTime startDate, [FromQuery] DateTime endDate, [FromQuery] int? coordinatorId = null)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<List<CoordinatorScheduleSummaryDto>>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }

            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<List<CoordinatorScheduleSummaryDto>>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);
            if (userInfo?.OrganizationId == null)
            {
                return BadRequest(new ApiResponseDTO<List<CoordinatorScheduleSummaryDto>>
                {
                    Success = false,
                    Message = "Organization not found for this user"
                });
            }

            var calendarData = await _coordinatorScheduleService.GetCalendarViewAsync(
                userInfo.OrganizationId.Value, startDate, endDate, coordinatorId);

            return Ok(new ApiResponseDTO<List<CoordinatorScheduleSummaryDto>>
            {
                Success = true,
                Message = "Calendar view retrieved successfully",
                Data = calendarData
            });
        }

        // PATCH: api/CoordinatorSchedule/{id}/status - Update schedule status
        [HttpPatch("{scheduleId}/status")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<object>>> UpdateScheduleStatus(
            int scheduleId, [FromBody] UpdateScheduleStatusDto request)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }

            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);
            if (userInfo?.OrganizationId == null)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Organization not found for this user"
                });
            }

            // Validate status value
            if (!ScheduleConstants.GetAllStatuses().Contains(request.Status))
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Invalid status value",
                    Errors = new List<string>
                        { $"Status must be one of: {string.Join(", ", ScheduleConstants.GetAllStatuses())}" }
                });
            }

            var result = await _coordinatorScheduleService.UpdateScheduleStatusAsync(
                userInfo.OrganizationId.Value, scheduleId, request.Status, userId);

            if (!result)
            {
                return NotFound(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to update schedule status",
                    Errors = new List<string> { "Schedule not found" }
                });
            }

            return Ok(new ApiResponseDTO<object>
            {
                Success = true,
                Message = "Schedule status updated successfully"
            });
        }

        // PATCH: api/CoordinatorSchedule/bulk/status - Bulk update status
        [HttpPatch("bulk/status")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<object>>> BulkUpdateStatus([FromBody] BulkUpdateStatusDto request)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }

            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);
            if (userInfo?.OrganizationId == null)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Organization not found for this user"
                });
            }

            // Validate status value
            if (!ScheduleConstants.GetAllStatuses().Contains(request.Status))
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Invalid status value",
                    Errors = new List<string>
                        { $"Status must be one of: {string.Join(", ", ScheduleConstants.GetAllStatuses())}" }
                });
            }

            // Validate schedule IDs list
            if (request.ScheduleIds == null || !request.ScheduleIds.Any())
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Schedule IDs list cannot be empty"
                });
            }

            var result = await _coordinatorScheduleService.BulkUpdateStatusAsync(
                userInfo.OrganizationId.Value, request.ScheduleIds, request.Status, userId);

            if (!result)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to bulk update schedule status"
                });
            }

            return Ok(new ApiResponseDTO<object>
            {
                Success = true,
                Message = $"Successfully updated status for {request.ScheduleIds.Count} schedules"
            });
        }

        // DELETE: api/CoordinatorSchedule/bulk - Bulk delete schedules
        [HttpDelete("bulk")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<object>>> BulkDelete([FromBody] BulkDeleteDto request)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }

            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);
            if (userInfo?.OrganizationId == null)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Organization not found for this user"
                });
            }

            var result = await _coordinatorScheduleService.BulkDeleteAsync(
                userInfo.OrganizationId.Value, request.ScheduleIds);

            if (!result)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to bulk delete schedules"
                });
            }

            return Ok(new ApiResponseDTO<object>
            {
                Success = true,
                Message = $"Successfully deleted {request.ScheduleIds.Count} schedules"
            });
        }

        // POST: api/CoordinatorSchedule/conflicts - Check for schedule conflicts
        [HttpPost("conflicts")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<List<CoordinatorScheduleSummaryDto>>>> CheckConflicts(
            [FromBody] CheckConflictsDto request)
        {
            var conflicts = await _coordinatorScheduleService.CheckScheduleConflictsAsync(
                request.CoordinatorId, request.StartDateTime, request.EndDateTime, request.ExcludeScheduleId);

            return Ok(new ApiResponseDTO<List<CoordinatorScheduleSummaryDto>>
            {
                Success = true,
                Message = conflicts.Any() ? "Schedule conflicts found" : "No conflicts found",
                Data = conflicts
            });
        }
    }
}