using AutoMapper;
using ivan_api.DTOs.EventManage;
using ivan_api.DTOs.Common;
using ivan_api.Models;
using ivan_api.Repository.EventRepo;

namespace ivan_api.Services.EventServ
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _eventRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<EventService> _logger;

        public EventService(
            IEventRepository eventRepository,
            IMapper mapper,
            ILogger<EventService> logger)
        {
            _eventRepository = eventRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<int> CreateAsync(CreateEventDto dto)
        {
            try
            {
                var eventEntity = _mapper.Map<Event>(dto);
                eventEntity.CreatedAt = DateTime.UtcNow;
                eventEntity.UpdatedAt = DateTime.UtcNow;
                eventEntity.IsActive = true;

                await _eventRepository.AddAsync(eventEntity);
                return eventEntity.EventId;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating event");
                throw;
            }
        }

        public async Task<bool> UpdateAsync(int id, UpdateEventDto dto)
        {
            try
            {
                var existingEvent = await _eventRepository.GetByIdAsync(id);
                if (existingEvent == null) return false;

                _mapper.Map(dto, existingEvent);
                existingEvent.UpdatedAt = DateTime.UtcNow;

                return await _eventRepository.UpdateAsync(existingEvent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating event {EventId}", id);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id, int organizationId)
        {
            return await _eventRepository.DeleteAsync(id, organizationId);
        }

        public async Task<PagedResultDto<EventDto>> GetEventsAsync(EventFilterDto filters)
        {
            return await _eventRepository.GetEventsAsync(filters);
        }

        public async Task<EventDto?> GetEventAsync(int id)
        {
            var eventEntity = await _eventRepository.GetByIdAsync(id);
            return eventEntity != null ? _mapper.Map<EventDto>(eventEntity) : null;
        }

        public async Task<IEnumerable<EventCategoryDto>> GetCategoriesAsync()
        {
            var categories = await _eventRepository.GetCategoriesAsync();
            return _mapper.Map<IEnumerable<EventCategoryDto>>(categories);
        }

        public async Task<IEnumerable<EventStatusDto>> GetStatusesAsync()
        {
            var statuses = await _eventRepository.GetStatusesAsync();
            return _mapper.Map<IEnumerable<EventStatusDto>>(statuses);
        }
    }
}