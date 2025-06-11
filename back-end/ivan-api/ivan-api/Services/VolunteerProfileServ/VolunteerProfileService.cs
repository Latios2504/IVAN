using AutoMapper;
using ivan_api.DTOs.VolunteerProfile;
using ivan_api.Models;
using ivan_api.Repository.VolunteerProfileRepo;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services.VolunteerProfileServ
{
    public class VolunteerProfileService : IVolunteerProfileService
    {
        private readonly IVolunteerProfileRepository _repo;
        private readonly IMapper _mapper;
        public VolunteerProfileService(IVolunteerProfileRepository repository, IMapper mapper)
        {
            _repo = repository;
            _mapper = mapper;
        }
        public async Task<VolunteerProfileDetailDto> CreateAsync(VolunteerProfileCreateDto dto)
        {
            var entity = _mapper.Map<VolunteerProfile>(dto);
            await _repo.AddAsync(entity);
            await _repo.SaveChangesAsync();
            return _mapper.Map<VolunteerProfileDetailDto>(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity == null) return false;
            _repo.Remove(entity);
            return await _repo.SaveChangesAsync();
        }

        public async Task<IEnumerable<VolunteerProfileListDto>> GetAllAsync()
        {
            var entities = await _repo.GetAllAsync();
            return _mapper.Map<IEnumerable<VolunteerProfileListDto>>(entities);
        }

        public async Task<VolunteerProfileDetailDto?> GetByIdAsync(int id)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity == null) return null;
            return _mapper.Map<VolunteerProfileDetailDto>(entity);
        }

        public async Task<bool> UpdateAsync(int id, VolunteerProfileUpdateDto dto)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return false;
            _mapper.Map(dto, existing);
            _repo.Update(existing);
            return await _repo.SaveChangesAsync();
        }
    }
}
