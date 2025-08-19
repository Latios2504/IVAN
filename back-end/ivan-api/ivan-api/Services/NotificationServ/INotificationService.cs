using ivan_api.DTOs;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.NotificationServ;

namespace ivan_api.Services.NotificationServ
{
    public interface INotificationService
    {
        Task<PagedResultDto<NotificationDTO>> GetNotificationsAsync(int? userId, int page, int pageSize, bool? isRead, string? sortBy, bool sortDescending);
        Task<NotificationDTO?> GetNotificationAsync(int notificationId);
        Task<bool> SendNotificationAsync(SendNotificationDTO notificationDto);
        Task<bool> ConfigureNotificationAsync(int userId, NotificationPreferenceDTO preferenceDto);
    }
}
