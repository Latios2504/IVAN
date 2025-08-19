using ivan_api.DTOs.NotificationServ;
using ivan_api.DTOs;
using ivan_api.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;
using ivan_api.Configuration;
using ivan_api.Services.EmailSer;
using ivan_api.DTOs.Common;


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

        public async Task<PagedResultDto<NotificationDTO>> GetNotificationsAsync(int? userId, int page, int pageSize, bool? isRead, string? sortBy, bool sortDescending)
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

            return new PagedResultDto<NotificationDTO>
            {
                Items = notifications,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            };
        }

        public async Task<NotificationDTO?> GetNotificationAsync(int notificationId)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.NotificationId == notificationId);

            if (notification == null)
            {
                return null;
            }

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return new NotificationDTO
            {
                NotificationId = notification.NotificationId,
                UserId = notification.UserId,
                Title = notification.Title,
                Content = notification.Content,
                SendDate = notification.SendDate,
                IsRead = notification.IsRead
            };
        }

        public async Task<bool> SendNotificationAsync(SendNotificationDTO notificationDto)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(notificationDto.Title) || string.IsNullOrWhiteSpace(notificationDto.Content))
            {
                return false;
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

            return true;
        }

        public async Task<bool> ConfigureNotificationAsync(int userId, NotificationPreferenceDTO preferenceDto)
        {
            // Update or add preferences to in-memory store
            _notificationPreferences.AddOrUpdate(
                userId,
                preferenceDto,
                (key, oldValue) => preferenceDto
            );

            return true;
        }
    }
}

