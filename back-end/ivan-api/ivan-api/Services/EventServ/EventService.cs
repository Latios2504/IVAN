using AutoMapper;
using ivan_api.DTOs;
using ivan_api.DTOs.EventManage;
using ivan_api.Models;
using ivan_api.Repository.EventRepo;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services.EventServ
{
    public class EventService : IEventService
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly IEventRepository _repo;
        private readonly IMapper _mapper;

        public EventService(VolunteerManagementSystemContext context, IEventRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
            _context = context;
        }

        public async Task<IEnumerable<EventDto>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return _mapper.Map<IEnumerable<EventDto>>(list);
        }

        public async Task<EventDto?> GetByIdAsync(int id)
        {
            var evt = await _repo.GetByIdAsync(id);
            return evt == null ? null : _mapper.Map<EventDto>(evt);
        }

        public async Task<int> CreateAsync(CreateEventDto dto)
        {
            var evt = _mapper.Map<Event>(dto);
            await _repo.AddAsync(evt);
            return evt.EventId;
        }

        public async Task<bool> UpdateAsync(int id, UpdateEventDto dto)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return false;
            _mapper.Map(dto, existing);
            await _repo.UpdateAsync(existing);
            return true;
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
