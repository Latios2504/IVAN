using ivan_api.DTOs.Common;
using ivan_api.DTOs.CoordinatorRequests;
using ivan_api.Services.CoordinatorRequestServ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    [ApiController]
    [Route("")]
    public class CoordinatorRequestsController : ControllerBase
    {
        private readonly ICoordinatorRequestService _service;
        private readonly ILogger<CoordinatorRequestsController> _logger;

        public CoordinatorRequestsController(
            ICoordinatorRequestService service,
            ILogger<CoordinatorRequestsController> logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// Organization gửi yêu cầu tạo Coordinator
        /// </summary>
        [HttpPost("orgs/{organizationId:int}/coordinator-requests")]
        [Authorize(Roles = "Organization")]
        public async Task<ActionResult<ApiResponseDTO<object>>> Create(
            [FromRoute] int organizationId,
            [FromBody] CreateCoordinatorRequestDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponseDTO<object>.Fail("VALIDATION_FAILED",
                    errors: ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));
            }

            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var requesterUserId))
                return Unauthorized(ApiResponseDTO<object>.Fail("INVALID_TOKEN"));

            var result = await _service.CreateAsync(organizationId, requesterUserId, dto);

            if (!result.Success)
            {
                return result.Message switch
                {
                    "NOT_OWNER_OF_ORGANIZATION" => Forbid(),
                    "ORGANIZATION_NOT_FOUND" => NotFound(result),
                    "SUPPORT_CATEGORY_NOT_FOUND" => StatusCode(500, result),
                    "DUPLICATE_OPEN_REQUEST_FOR_EMAIL" => Conflict(result),
                    _ => BadRequest(result)
                };
            }

            return Created(string.Empty, result);
        }

        /// <summary>
        /// Admin xem danh sách yêu cầu tạo Coordinator
        /// </summary>
        [HttpGet("admin/coordinator-requests")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponseDTO<List<CoordinatorRequestListItemDto>>>> GetList([FromQuery] string? status = null)
        {
            var result = await _service.ListAsync(status);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Admin duyệt hoặc từ chối yêu cầu tạo Coordinator
        /// </summary>
        [HttpPatch("admin/coordinator-requests/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponseDTO<object>>> Update(
            [FromRoute] int id,
            [FromBody] UpdateCoordinatorRequestDto dto)
        {
            var adminIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(adminIdStr) || !int.TryParse(adminIdStr, out var adminUserId))
                return Unauthorized(ApiResponseDTO<object>.Fail("INVALID_TOKEN"));

            var result = await _service.UpdateAsync(id, adminUserId, dto);

            if (!result.Success)
            {
                return result.Message switch
                {
                    "REQUEST_NOT_FOUND" => NotFound(result),
                    "REQUEST_ALREADY_RESOLVED" => Conflict(result),
                    "INVALID_METADATA" => StatusCode(500, result),
                    _ => BadRequest(result)
                };
            }

            return Ok(result);
        }
    } 
}
