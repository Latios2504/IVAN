using ivan_api.DTOs.SupportRequest;
using ivan_api.Services.SupportRequestServ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SupportRequestController : ControllerBase
    {
        private readonly ISupportRequestService _service;

        public SupportRequestController(ISupportRequestService service)
        {
            _service = service;
        }

        // GET: api/supportrequest - Admin sees all, Organization sees only approved
        [HttpGet]
        [Authorize(Roles = "Admin,Organization")]
        public async Task<IActionResult> GetAllRequests([FromQuery] string? status = null, [FromQuery] int? categoryId = null)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            
            // Organizations can only see approved requests
            if (userRole == "Organization")
            {
                status = "Approved";
            }
            
            var result = await _service.GetAllRequestsAsync(status, categoryId);
            
            if (!result.Success)
                return BadRequest(result);
                
            return Ok(result);
        }

        // GET: api/supportrequest/my - Get user's own requests
        [HttpGet("my")]
        public async Task<IActionResult> GetMyRequests()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user token");
            }

            var result = await _service.GetUserRequestsAsync(userId);
            
            if (!result.Success)
                return BadRequest(result);
                
            return Ok(result);
        }

        // GET: api/supportrequest/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRequestById(int id)
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user token");
            }

            var result = await _service.GetRequestByIdAsync(id);
            
            if (!result.Success)
                return NotFound(result);

            // Check authorization - user can only see their own requests unless they're admin or organization
            if (userRole != "Admin" && userRole != "Organization" && result.Data?.UserId != userId)
            {
                return Forbid("You can only view your own support requests");
            }
                
            return Ok(result);
        }

        // POST: api/supportrequest - Allow anonymous and authenticated users
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateRequest([FromBody] SupportRequestCreateDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get user ID if authenticated, otherwise null for anonymous requests
            int? userId = null;
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out int parsedUserId))
            {
                userId = parsedUserId;
            }

            var result = await _service.CreateRequestAsync(userId, dto);
            
            if (!result.Success)
                return BadRequest(result);
                
            return CreatedAtAction(nameof(GetRequestById), new { id = result.Data?.RequestId }, result);
        }

        // PUT: api/supportrequest/{id} - Admin only
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRequest(int id, [FromBody] SupportRequestUpdateDTO dto)
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int adminUserId))
            {
                return Unauthorized("Invalid user token");
            }

            var result = await _service.UpdateRequestAsync(id, dto, adminUserId);
            
            if (!result.Success)
                return BadRequest(result);
                
            return Ok(result);
        }

        // POST: api/supportrequest/{id}/comments
        [HttpPost("{id}/comments")]
        public async Task<IActionResult> AddComment(int id, [FromBody] AddCommentRequest request)
        {
            if (string.IsNullOrEmpty(request.Comment))
            {
                return BadRequest("Comment cannot be empty");
            }

            var userIdClaim = User.FindFirst("UserId")?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user token");
            }

            // Only admins and organizations can add internal comments
            bool isInternal = request.IsInternal && (userRole == "Admin" || userRole == "Organization");

            var result = await _service.AddCommentWithAttachmentAsync(id, request.Comment, userId, isInternal, request.AttachmentUrls);
            
            if (!result.Success)
                return BadRequest(result);
                
            return Ok(result);
        }

        // GET: api/supportrequest/categories
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var result = await _service.GetCategoriesAsync();
            
            if (!result.Success)
                return BadRequest(result);
                
            return Ok(result);
        }
    }

    public class AddCommentRequest
    {
        public string Comment { get; set; } = null!;
        public bool IsInternal { get; set; } = false;
        public List<string>? AttachmentUrls { get; set; }
    }
}
