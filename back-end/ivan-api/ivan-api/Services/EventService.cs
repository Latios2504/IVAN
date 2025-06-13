using ivan_api.DTOs;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services
{
    public class EventService : IEventService
    {
        private readonly VolunteerManagementSystemContext _context;
        public EventService(VolunteerManagementSystemContext context)
        {
            _context = context;
        }
        public async Task<ApiResponseDTO<EventDTO>> GetEventAsync(int eventId)
        {
            try
            {
                var eventEntity = await _context.Events
                    .Include(e => e.Category)
                    .Include(e => e.Status)
                    .FirstOrDefaultAsync(e => e.EventId == eventId && (e.IsActive == null || e.IsActive == true));

                if (eventEntity == null)
                {
                    return new ApiResponseDTO<EventDTO>
                    {
                        Success = false,
                        Message = "Sự kiện không tồn tại hoặc không hoạt động",
                        Errors = new List<string> { "Event not found" }
                    };
                }

                var eventDto = new EventDTO
                {
                    EventId = eventEntity.EventId,
                    EventName = eventEntity.EventName,
                    Description = eventEntity.Description,
                    ShortDescription = eventEntity.ShortDescription,
                    StartDate = eventEntity.StartDate,
                    EndDate = eventEntity.EndDate,
                    RegistrationStartDate = eventEntity.RegistrationStartDate,
                    RegistrationEndDate = eventEntity.RegistrationEndDate,
                    Location = eventEntity.Location,
                    CategoryName = eventEntity.Category?.CategoryName ?? string.Empty,
                    StatusName = eventEntity.Status?.StatusName ?? string.Empty
                };

                return new ApiResponseDTO<EventDTO>
                {
                    Success = true,
                    Message = "Lấy thông tin sự kiện thành công",
                    Data = eventDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<EventDTO>
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi lấy thông tin sự kiện",
                    Errors = new List<string> { ex.Message }
                };
            }
        }
    }
}
