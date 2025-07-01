using ivan_api.DTOs.SupportRequest;
using ivan_api.Services.SupportRequestService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupportRequestController : ControllerBase
    {
        private readonly ISupportRequestService _service;
        public SupportRequestController(ISupportRequestService service)
        {
            _service = service;
        }
        [HttpPost]
        [Authorize] // Yêu cầu đăng nhập
        public async Task<IActionResult> AddSupportRequest([FromBody] AddSupportRequestDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var result = await _service.AddSupportRequestAsync(dto, userId);
            return CreatedAtAction(nameof(GetSupportRequestForOrganization), new { requestId = result.RequestId }, result);
        }
        [HttpGet("admin/{requestId}")]
        [Authorize(Roles = "Admin")] // Chỉ admin
        public async Task<IActionResult> GetSupportRequestForAdmin(int requestId)
        {
            var result = await _service.GetSupportRequestForAdminAsync(requestId);
            return Ok(result);
        }

        [HttpGet("organization/{requestId}")]
        [Authorize(Roles = "Organization")] // Chỉ organization
        public async Task<IActionResult> GetSupportRequestForOrganization(int requestId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var result = await _service.GetSupportRequestForOrganizationAsync(requestId, userId);
            return Ok(result);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")] // Chỉ admin
        public async Task<IActionResult> ListSupportRequests([FromQuery] string status, [FromQuery] string priority, [FromQuery] int? categoryId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _service.ListSupportRequestsAsync(status, priority, categoryId, page, pageSize);
            return Ok(result);
        }

        [HttpPut("{requestId}")]
        [Authorize(Roles = "Admin")] // Chỉ admin
        public async Task<IActionResult> UpdateSupportRequest(int requestId, [FromBody] UpdateSupportRequestDto dto)
        {
            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var result = await _service.UpdateSupportRequestAsync(requestId, dto, adminId);
            return Ok(result);
        }
    }
}
