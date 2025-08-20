using Azure;
using ivan_api.DTOs.ModerationEvent;
using ivan_api.DTOs.NotificationServ;
using ivan_api.DTOs.Common;
using ivan_api.Models;
using ivan_api.Services.NotificationServ;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services.ModerationEventServ
{
    public class ModerationEventService : IModerationEventService
    {
        private readonly VolunteerManagementSystemContext _dbContext;
        private readonly INotificationService _notificationService;

        public ModerationEventService(VolunteerManagementSystemContext context, INotificationService notificationService)
        {
            _dbContext = context;
            _notificationService = notificationService;
        }

        public async Task<PagedResultDto<ModerationEventListDto>> GetEventsForModerationAsync(int pageNumber, int pageSize)
        {
            var query = _dbContext.Events
                .Where(e => e.StatusId == 1) // Đang lên kế hoạch
                .OrderBy(e => e.CreatedAt)
                .Select(e => new ModerationEventListDto
                {
                    EventId = e.EventId,
                    EventName = e.EventName,
                    OrganizationName = e.Organization.OrganizationName,
                    SubmissionDate = e.CreatedAt.HasValue ? e.CreatedAt.Value : DateTime.MinValue // Explicit conversion and null handling
                });

            var totalCount = await query.CountAsync();
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PagedResultDto<ModerationEventListDto>
            {
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Items = items
            };
        }

        public async Task<ModerationEventDetailDto> GetEventDetailsForModerationAsync(int eventId)
        {
            var eventDetail = await _dbContext.Events
                .Where(e => e.EventId == eventId )
                .Select(e => new ModerationEventDetailDto
                {
                    EventId = e.EventId,
                    EventName = e.EventName,
                    OrganizationName = e.Organization.OrganizationName,
                    Description = e.Description,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate
                })
                .FirstOrDefaultAsync();

            if (eventDetail == null)
            {
                throw new Exception("Event not found or not pending moderation.");
            }

            return eventDetail;
        }

        public async Task ApproveEventAsync(int eventId)
        {
            var eventEntity = await _dbContext.Events.FindAsync(eventId);
            if (eventEntity == null ||  eventEntity.StatusId != 1)
            {
                throw new Exception("Event is not eligible for approval.");
            }

            eventEntity.StatusId = 2; // Đang mở đăng ký
            //eventEntity.IsPendingModeration = false;
            await _dbContext.SaveChangesAsync();

            var notificationDto = new SendNotificationDTO
            {
                UserId = eventEntity.CreatedBy.Value, // Đảm bảo CreatedBy không null
                Title = "Sự kiện được duyệt",
                Content = "Sự kiện của bạn đã được duyệt."
            };

            var response = await _notificationService.SendNotificationAsync(notificationDto);
            if (!response)
            {
                Console.WriteLine("Failed to send notification");
            }
        }

        public async Task RejectEventAsync(int eventId, string reason)
        {
            var eventEntity = await _dbContext.Events.FindAsync(eventId);
            if (eventEntity == null || eventEntity.StatusId != 1)
            {
                throw new Exception("Event is not eligible for rejection.");
            }
            eventEntity.StatusId = 5; // Cancelled (used for rejected events)
            await _dbContext.SaveChangesAsync();
            var notificationDto = new SendNotificationDTO
            {
                UserId = eventEntity.CreatedBy.Value, // Đảm bảo CreatedBy không null
                Title = "Sự kiện bị từ chối",
                Content = $"Sự kiện của bạn đã bị từ chối. Lý do: {reason}"
            };
            var response = await _notificationService.SendNotificationAsync(notificationDto);
            if (!response)
            {
                Console.WriteLine("Failed to send notification");
            }
        }
    }
}
