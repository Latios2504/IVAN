using ivan_api.Constants;
using ivan_api.DTOs.Schedule;
using ivan_api.DTOs.Authentication;
using ivan_api.DTOs.Common;
using ivan_api.Extensions;
using ivan_api.Services;
using ivan_api.Services.ScheduleServ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoordinatorSchedulesController : ControllerBase
    {
        private readonly IScheduleService _scheduleService;
        public CoordinatorSchedulesController(IScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
        }

        // For Volunteer Coordinator: View personal schedules
        [HttpGet("personal")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDto<ScheduleDTO>>>> GetPersonalSchedules([FromQuery] int? eventId, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] int page = 1, [FromQuery] int size = 20)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<PagedResultDto<ScheduleDTO>>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }
            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<PagedResultDto<ScheduleDTO>>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var result = await _scheduleService.GetPersonalSchedulesAsync(userId, eventId, startDate, endDate, page, size);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) :
                       result.Errors.Any(e => e.Contains("Coordinator")) ? Unauthorized(result) :
                       StatusCode(500, result);
            }
            return Ok(result);
        }

        // For Organization: List all schedules, optionally filtered by coordinator or event
        [HttpGet]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDto<ScheduleDTO>>>> ListSchedules([FromQuery] int? coordinatorId, [FromQuery] int? eventId, [FromQuery] int page = 1, [FromQuery] int size = 20)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<PagedResultDto<ScheduleDTO>>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }
            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<PagedResultDto<ScheduleDTO>>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var result = await _scheduleService.ListSchedulesAsync(userId, coordinatorId, eventId, page, size);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) :
                       result.Errors.Any(e => e.Contains("Coordinator")) ? Unauthorized(result) :
                       StatusCode(500, result);
            }
            return Ok(result);
        }

        // For Organization: View a specific schedule
        [HttpGet("{scheduleId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<ScheduleDTO>>> GetSchedule(int scheduleId)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<ScheduleDTO>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }
            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<ScheduleDTO>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var result = await _scheduleService.GetScheduleAsync(userId, scheduleId);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) :
                       result.Errors.Any(e => e.Contains("Coordinator")) ? Unauthorized(result) :
                       StatusCode(500, result);
            }
            return Ok(result);
        }

        // For Organization: Add a new schedule for a volunteer coordinator
        [HttpPost]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<ScheduleDTO>>> AddSchedule([FromBody] ScheduleRequestDTO request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.GetErrorMessages();
                return BadRequest(new ApiResponseDTO<ScheduleDTO>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                });
            }

            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<ScheduleDTO>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }
            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<ScheduleDTO>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var result = await _scheduleService.AddScheduleAsync(userId, request);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) :
                       result.Errors.Any(e => e.Contains("conflict")) ? Conflict(result) :
                       BadRequest(result);
            }
            return CreatedAtAction(nameof(GetSchedule), new { scheduleId = result.Data.ScheduleId }, result);
        }

        // For Organization: Update a schedule
        [HttpPut("{scheduleId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<ScheduleDTO>>> UpdateSchedule(int scheduleId, [FromBody] ScheduleRequestDTO request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.GetErrorMessages();
                return BadRequest(new ApiResponseDTO<ScheduleDTO>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                });
            }

            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<ScheduleDTO>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }
            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<ScheduleDTO>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var result = await _scheduleService.UpdateScheduleAsync(userId, scheduleId, request);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) :
                       result.Errors.Any(e => e.Contains("conflict")) ? Conflict(result) :
                       BadRequest(result);
            }
            return Ok(result);
        }
    }
}
