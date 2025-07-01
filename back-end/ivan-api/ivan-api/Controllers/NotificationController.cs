using ivan_api.Constants;
using ivan_api.DTOs.NotificationServ;
using ivan_api.DTOs;
using ivan_api.Services.NotificationServ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // List notifications (all or by userId) with pagination
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<ApiResponseDTO<DTOs.NotificationServ.PagedResultDTO<NotificationDTO>>>> GetNotifications(
            [FromQuery] int? userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10,
            [FromQuery] bool? isRead = null, [FromQuery] string? sortBy = "SendDate", [FromQuery] bool sortDescending = true)
        {
            var result = await _notificationService.GetNotificationsAsync(userId, page, pageSize, isRead, sortBy, sortDescending);
            return Ok(result);
        }

        // View a single notification by NotificationId
        [HttpGet("{notificationId}")]
        [Authorize]
        public async Task<ActionResult<ApiResponseDTO<NotificationDTO>>> GetNotification(int notificationId)
        {
            var result = await _notificationService.GetNotificationAsync(notificationId);
            return Ok(result);
        }

        // Send notification (email and/or web via WebSocket)
        [HttpPost]
        [Authorize(Roles = AuthenticationConstants.Roles.Admin + "," +
                        AuthenticationConstants.Roles.Organization + "," +
                        AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<ActionResult<ApiResponseDTO<object>>> SendNotification([FromBody] SendNotificationDTO notificationDto)
        {
            var result = await _notificationService.SendNotificationAsync(notificationDto);
            return Ok(result);
        }

        // Configure notification preferences
        [HttpPut("configure")]
        [Authorize]
        public async Task<ActionResult<ApiResponseDTO<object>>> ConfigureNotification([FromBody] NotificationPreferenceDTO preferenceDto)
        {
            var userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");
            var result = await _notificationService.ConfigureNotificationAsync(userId, preferenceDto);
            return Ok(result);
        }
    }
}
