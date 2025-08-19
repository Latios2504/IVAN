using ivan_api.Constants;
using ivan_api.DTOs.NotificationServ;
using ivan_api.Services.NotificationServ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.Common;

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
        public async Task<ActionResult<ApiResponseDTO<PagedResultDto<NotificationDTO>>>>
            GetNotifications(
                [FromQuery] int? userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10,
                [FromQuery] bool? isRead = null, [FromQuery] string? sortBy = "SendDate",
                [FromQuery] bool sortDescending = true)
        {
            try
            {
                var result = await _notificationService.GetNotificationsAsync(userId, page, pageSize, isRead, sortBy, sortDescending);
                return Ok(new ApiResponseDTO<PagedResultDto<NotificationDTO>>
                {
                    Success = true,
                    Message = "Notifications retrieved successfully",
                    Data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponseDTO<PagedResultDto<NotificationDTO>>
                {
                    Success = false,
                    Message = "Error retrieving notifications",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        // View a single notification by NotificationId
        [HttpGet("{notificationId}")]
        [Authorize]
        public async Task<ActionResult<ApiResponseDTO<NotificationDTO>>> GetNotification(int notificationId)
        {
            try
            {
                var result = await _notificationService.GetNotificationAsync(notificationId);
                if (result == null)
                {
                    return NotFound(new ApiResponseDTO<NotificationDTO>
                    {
                        Success = false,
                        Message = "Notification not found",
                        Errors = new List<string> { "Notification not found" }
                    });
                }

                return Ok(new ApiResponseDTO<NotificationDTO>
                {
                    Success = true,
                    Message = "Notification retrieved successfully",
                    Data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponseDTO<NotificationDTO>
                {
                    Success = false,
                    Message = "Error retrieving notification",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        // Send notification (email and/or web via WebSocket)
        [HttpPost]
        [Authorize(Roles = AuthenticationConstants.Roles.Admin + "," +
                           AuthenticationConstants.Roles.Organization + "," +
                           AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<ActionResult<ApiResponseDTO<object>>> SendNotification(
            [FromBody] SendNotificationDTO notificationDto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(notificationDto.Title) || string.IsNullOrWhiteSpace(notificationDto.Content))
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Title and Content are required",
                        Errors = new List<string> { "Invalid input" }
                    });
                }

                var result = await _notificationService.SendNotificationAsync(notificationDto);
                if (result)
                {
                    return Ok(new ApiResponseDTO<object>
                    {
                        Success = true,
                        Message = "Notification sent successfully"
                    });
                }
                else
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to send notification",
                        Errors = new List<string> { "Invalid input or processing error" }
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Error sending notification",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        // Configure notification preferences
        [HttpPut("configure")]
        [Authorize]
        public async Task<ActionResult<ApiResponseDTO<object>>> ConfigureNotification(
            [FromBody] NotificationPreferenceDTO preferenceDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");
                var result = await _notificationService.ConfigureNotificationAsync(userId, preferenceDto);
                if (result)
                {
                    return Ok(new ApiResponseDTO<object>
                    {
                        Success = true,
                        Message = "Notification preferences updated successfully"
                    });
                }
                else
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to update notification preferences"
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Error updating notification preferences",
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}
