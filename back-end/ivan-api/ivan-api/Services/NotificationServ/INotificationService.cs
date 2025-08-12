using ivan_api.DTOs;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.NotificationServ;

namespace ivan_api.Services.NotificationServ
{
    public interface INotificationService
    {
        Task<ApiResponseDTO<DTOs.NotificationServ.PagedResultDTO<NotificationDTO>>> GetNotificationsAsync(int? userId, int page, int pageSize, bool? isRead, string? sortBy, bool sortDescending);
        Task<ApiResponseDTO<NotificationDTO>> GetNotificationAsync(int notificationId);
        Task<ApiResponseDTO<object>> SendNotificationAsync(SendNotificationDTO notificationDto);
        Task<ApiResponseDTO<object>> ConfigureNotificationAsync(int userId, NotificationPreferenceDTO preferenceDto);
    }
}
