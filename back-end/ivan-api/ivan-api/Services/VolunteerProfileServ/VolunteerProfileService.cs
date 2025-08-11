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

        public async Task<VolunteerProfileDetailDto?> UpdateAsync(int id, VolunteerProfileUpdateDto dto)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return null;

            // Update VolunteerProfile fields
            _mapper.Map(dto, existing);

            // Update UserProfile fields if UserProfile exists
            var userProfile = existing.User?.UserProfiles?.FirstOrDefault();
            if (userProfile != null)
            {
                // Map UserProfile-specific fields from DTO
                if (!string.IsNullOrEmpty(dto.FirstName)) userProfile.FirstName = dto.FirstName;
                if (!string.IsNullOrEmpty(dto.LastName)) userProfile.LastName = dto.LastName;
                if (!string.IsNullOrEmpty(dto.PhoneNumber)) userProfile.PhoneNumber = dto.PhoneNumber;
                if (dto.DateOfBirth.HasValue) userProfile.DateOfBirth = DateOnly.FromDateTime(dto.DateOfBirth.Value);
                if (!string.IsNullOrEmpty(dto.Gender)) userProfile.Gender = dto.Gender;
                if (!string.IsNullOrEmpty(dto.Address)) userProfile.Address = dto.Address;
                if (!string.IsNullOrEmpty(dto.WardCommune)) userProfile.WardCommune = dto.WardCommune;
                if (!string.IsNullOrEmpty(dto.District)) userProfile.District = dto.District;
                if (!string.IsNullOrEmpty(dto.Province)) userProfile.Province = dto.Province;
                if (!string.IsNullOrEmpty(dto.PostalCode)) userProfile.PostalCode = dto.PostalCode;
                if (!string.IsNullOrEmpty(dto.EmergencyContactName)) userProfile.EmergencyContactName = dto.EmergencyContactName;
                if (!string.IsNullOrEmpty(dto.EmergencyContactPhone)) userProfile.EmergencyContactPhone = dto.EmergencyContactPhone;
                if (!string.IsNullOrEmpty(dto.Avatar)) userProfile.Avatar = dto.Avatar;
                
                userProfile.UpdatedAt = DateTime.UtcNow;
            }

            _repo.Update(existing);
            var success = await _repo.SaveChangesAsync();
            
            if (!success) return null;

            // Return updated profile data
            var updatedEntity = await _repo.GetByIdAsync(id);
            return _mapper.Map<VolunteerProfileDetailDto>(updatedEntity);
        }
    }
}
