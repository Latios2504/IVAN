using ivan_api.Constants;
using ivan_api.DTOs;
using ivan_api.DTOs.Authentication;
using ivan_api.DTOs.Common;
using ivan_api.Extensions;
using ivan_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchedulesController : ControllerBase
    {
        private readonly IScheduleService _scheduleService;
        public SchedulesController(IScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
        }

        [HttpGet]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDTO<ScheduleDTO>>>> ListSchedules([FromQuery] int? coordinatorId, [FromQuery] int? eventId, [FromQuery] int page = 1, [FromQuery] int size = 20)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _scheduleService.ListSchedulesAsync(userId, coordinatorId, eventId, page, size);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) :
                       result.Errors.Any(e => e.Contains("Organization")) ? Unauthorized(result) :
                       StatusCode(500, result);
            }
            return Ok(result);
        }

        [HttpGet("{scheduleId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<ScheduleDTO>>> GetSchedule(int scheduleId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _scheduleService.GetScheduleAsync(userId, scheduleId);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) :
                       result.Errors.Any(e => e.Contains("Organization")) ? Unauthorized(result) :
                       StatusCode(500, result);
            }
            return Ok(result);
        }

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

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _scheduleService.AddScheduleAsync(userId, request);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) :
                       result.Errors.Any(e => e.Contains("conflict")) ? Conflict(result) :
                       BadRequest(result);
            }
            return CreatedAtAction(nameof(GetSchedule), new { scheduleId = result.Data.ScheduleId }, result);
        }

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

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
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
