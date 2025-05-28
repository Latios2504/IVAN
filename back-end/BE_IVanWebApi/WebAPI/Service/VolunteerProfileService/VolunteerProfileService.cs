using AutoMapper;
using WebAPI.Data.Entities;
using WebAPI.Models.VolunteerProfile;
using WebAPI.Repository.VolunteerProfileRepo;

namespace WebAPI.Service.VolunteerProfileService
{
    public class VolunteerProfileService : IVolunteerProfileService
    {
        private readonly IVolunteerProfileRepository _repository;
        private readonly IMapper _mapper;

        public VolunteerProfileService(IVolunteerProfileRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task AddAsync(VolunteerProfileViewModel model)
        {
            var profile = _mapper.Map<VolunteerProfile>(model);
            profile.CreatedAt = DateTime.UtcNow;
            profile.UpdatedAt = DateTime.UtcNow;
            await _repository.AddAsync(profile);
        }

        public async Task<VolunteerProfileViewModel> GetByIdAsync(int id)
        {
            var profile = await _repository.GetByIdAsync(id);
            if (profile == null) throw new Exception("Volunteer not founded!");
            return _mapper.Map<VolunteerProfileViewModel>(profile);
        }

        public async Task<VolunteerProfileViewModel> GetByUserIdAsync(int userId)
        {
            var profile = await _repository.GetByUserIdAsync(userId);
            if (profile == null) throw new Exception("Volunteer profile not found for this user.");
            return _mapper.Map<VolunteerProfileViewModel>(profile);
        }

        public async Task<List<VolunteerProfileViewModel>> GetFilteredProfilesAsync(VolunteerProfileFilterViewModel filter)
        {
            var profiles = await _repository.GetFilteredProfilesAsync(filter);
            return _mapper.Map<List<VolunteerProfileViewModel>>(profiles);
        }

        public async Task UpdateAsync(VolunteerProfileViewModel model)
        {
            var existingProfile = await _repository.GetByIdAsync(model.Id);
            if (existingProfile == null) throw new Exception("Volunteer profile not found.");

            _mapper.Map(model, existingProfile);
            existingProfile.UpdatedAt = DateTime.UtcNow;
            await _repository.UpdateAsync(existingProfile);
        }
    }
}
