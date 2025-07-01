using ivan_api.DTOs.NotificationServ;
using ivan_api.DTOs;
using ivan_api.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;
using ivan_api.Configuration;

namespace ivan_api.Services.NotificationServ
{
    public class NotificationService : INotificationService
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly IEmailService _emailService;
        private readonly IHubContext<NotificationHub> _hubContext;
        private static readonly ConcurrentDictionary<int, NotificationPreferenceDTO> _notificationPreferences = new();

        public NotificationService(VolunteerManagementSystemContext context, IEmailService emailService, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _emailService = emailService;
            _hubContext = hubContext;
        }

        public async Task<ApiResponseDTO<DTOs.NotificationServ.PagedResultDTO<NotificationDTO>>> GetNotificationsAsync(int? userId, int page, int pageSize, bool? isRead, string? sortBy, bool sortDescending)
        {
            // Unchanged from original implementation
            try
            {
                var query = _context.Notifications.AsNoTracking();

                if (userId.HasValue)
                {
                    query = query.Where(n => n.UserId == userId.Value);
                }

                if (isRead.HasValue)
                {
                    query = query.Where(n => n.IsRead == isRead.Value);
                }

                query = sortBy?.ToLower() switch
                {
                    "title" => sortDescending ? query.OrderByDescending(n => n.Title) : query.OrderBy(n => n.Title),
                    _ => sortDescending ? query.OrderByDescending(n => n.SendDate) : query.OrderBy(n => n.SendDate)
                };

                var totalCount = await query.CountAsync();
                var notifications = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(n => new NotificationDTO
                    {
                        NotificationId = n.NotificationId,
                        UserId = n.UserId,
                        Title = n.Title,
                        Content = n.Content,
                        SendDate = n.SendDate,
                        IsRead = n.IsRead
                    })
                    .ToListAsync();

                var result = new DTOs.NotificationServ.PagedResultDTO<NotificationDTO>
                {
                    Items = notifications,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize
                };

                return new ApiResponseDTO<DTOs.NotificationServ.PagedResultDTO<NotificationDTO>>
                {
                    Success = true,
                    Message = "Notifications retrieved successfully",
                    Data = result
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<DTOs.NotificationServ.PagedResultDTO<NotificationDTO>>
                {
                    Success = false,
                    Message = "Error retrieving notifications",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<NotificationDTO>> GetNotificationAsync(int notificationId)
        {
            // Unchanged from original implementation
            try
            {
                var notification = await _context.Notifications
                    .AsNoTracking()
                    .FirstOrDefaultAsync(n => n.NotificationId == notificationId);

                if (notification == null)
                {
                    return new ApiResponseDTO<NotificationDTO>
                    {
                        Success = false,
                        Message = "Notification not found",
                        Errors = new List<string> { "Notification not found" }
                    };
                }

                notification.IsRead = true;
                await _context.SaveChangesAsync();

                var notificationDto = new NotificationDTO
                {
                    NotificationId = notification.NotificationId,
                    UserId = notification.UserId,
                    Title = notification.Title,
                    Content = notification.Content,
                    SendDate = notification.SendDate,
                    IsRead = notification.IsRead
                };

                return new ApiResponseDTO<NotificationDTO>
                {
                    Success = true,
                    Message = "Notification retrieved successfully",
                    Data = notificationDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<NotificationDTO>
                {
                    Success = false,
                    Message = "Error retrieving notification",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<object>> SendNotificationAsync(SendNotificationDTO notificationDto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(notificationDto.Title) || string.IsNullOrWhiteSpace(notificationDto.Content))
                {
                    return new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Title and Content are required",
                        Errors = new List<string> { "Invalid input" }
                    };
                }

                var notification = new Notification
                {
                    UserId = notificationDto.UserId,
                    Title = notificationDto.Title,
                    Content = notificationDto.Content,
                    SendDate = DateTime.UtcNow,
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();

                // Get user preferences (default to true if not set)
                var preference = _notificationPreferences.GetOrAdd(notificationDto.UserId, new NotificationPreferenceDTO
                {
                    ReceiveEmail = true,
                    ReceiveWeb = true
                });

                // Send via WebSocket if enabled
                if (preference.ReceiveWeb)
                {
                    await _hubContext.Clients.User(notificationDto.UserId.ToString())
                        .SendAsync("ReceiveNotification", new NotificationDTO
                        {
                            NotificationId = notification.NotificationId,
                            UserId = notification.UserId,
                            Title = notification.Title,
                            Content = notification.Content,
                            SendDate = notification.SendDate,
                            IsRead = notification.IsRead
                        });
                }

                // Send via Email if enabled
                if (preference.ReceiveEmail)
                {
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == notificationDto.UserId);
                    if (user != null)
                    {
                        await _emailService.SendEmailAsync(user.Email, notificationDto.Title, notificationDto.Content);
                    }
                }

                return new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "Notification sent successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Error sending notification",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<object>> ConfigureNotificationAsync(int userId, NotificationPreferenceDTO preferenceDto)
        {
            try
            {
                // Update or add preferences to in-memory store
                _notificationPreferences.AddOrUpdate(
                    userId,
                    preferenceDto,
                    (key, oldValue) => preferenceDto
                );

                return new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "Notification preferences updated successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Error updating notification preferences",
                    Errors = new List<string> { ex.Message }
                };
            }
        }
    }
}

