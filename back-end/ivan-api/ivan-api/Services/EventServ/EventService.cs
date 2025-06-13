using AutoMapper;
using ivan_api.DTOs.EventManage;
using ivan_api.Models;
using ivan_api.Repository.EventRepo;

namespace ivan_api.Services.EventServ
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _repo;
        private readonly IMapper _mapper;

        public EventService(IEventRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
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
    }
}
