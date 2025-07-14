using ivan_api.Constants;
using ivan_api.DTOs;
using ivan_api.DTOs.Authentication;
using ivan_api.Services;
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

        [HttpGet]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDTO<ScheduleDTO>>>> GetPersonalSchedules([FromQuery] int? eventId, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] int page = 1, [FromQuery] int size = 20)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _scheduleService.GetPersonalSchedulesAsync(userId, eventId, startDate, endDate, page, size);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) :
                       result.Errors.Any(e => e.Contains("Coordinator")) ? Unauthorized(result) :
                       StatusCode(500, result);
            }
            return Ok(result);
        }
    }
}
