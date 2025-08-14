using AutoMapper;
using ivan_api.DTOs.VolunteerProfile;
using ivan_api.DTOs.Common;
using ivan_api.Models;
using ivan_api.Repository.VolunteerProfileRepo;

namespace ivan_api.Services.VolunteerProfileServ
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

        public async Task<bool> AddVolunteerProfile(VolunteerProfileCreateDto volunteerProfileInputModel)
        {
            var volunteer = _mapper.Map<VolunteerProfile>(volunteerProfileInputModel);
            volunteer.CreatedAt = DateTime.Now;
            volunteer.UpdatedAt = DateTime.Now;

            return await _repository.AddVolunteerProfile(volunteer);
        }

        public async Task<bool> UpdateVolunteerProfile(VolunteerProfileUpdateDto volunteerProfileUpdateModel, int userId)
        {
            var existingVolunteer = await _repository.GetVolunteerProfileById(userId);
            if (existingVolunteer == null)
            {
                throw new Exception("Volunteer not found");
            }

            // Update VolunteerProfile fields
            _mapper.Map(volunteerProfileUpdateModel, existingVolunteer);

            // Update UserProfile fields if UserProfile exists
            var userProfile = existingVolunteer.User?.UserProfiles?.FirstOrDefault();
            if (userProfile != null)
            {
                // Map UserProfile-specific fields from DTO
                if (!string.IsNullOrEmpty(volunteerProfileUpdateModel.FirstName)) userProfile.FirstName = volunteerProfileUpdateModel.FirstName;
                if (!string.IsNullOrEmpty(volunteerProfileUpdateModel.LastName)) userProfile.LastName = volunteerProfileUpdateModel.LastName;
                if (!string.IsNullOrEmpty(volunteerProfileUpdateModel.PhoneNumber)) userProfile.PhoneNumber = volunteerProfileUpdateModel.PhoneNumber;
                if (volunteerProfileUpdateModel.DateOfBirth.HasValue) userProfile.DateOfBirth = DateOnly.FromDateTime(volunteerProfileUpdateModel.DateOfBirth.Value);
                if (!string.IsNullOrEmpty(volunteerProfileUpdateModel.Gender)) userProfile.Gender = volunteerProfileUpdateModel.Gender;
                if (!string.IsNullOrEmpty(volunteerProfileUpdateModel.Address)) userProfile.Address = volunteerProfileUpdateModel.Address;
                if (!string.IsNullOrEmpty(volunteerProfileUpdateModel.WardCommune)) userProfile.WardCommune = volunteerProfileUpdateModel.WardCommune;
                if (!string.IsNullOrEmpty(volunteerProfileUpdateModel.District)) userProfile.District = volunteerProfileUpdateModel.District;
                if (!string.IsNullOrEmpty(volunteerProfileUpdateModel.Province)) userProfile.Province = volunteerProfileUpdateModel.Province;
                if (!string.IsNullOrEmpty(volunteerProfileUpdateModel.PostalCode)) userProfile.PostalCode = volunteerProfileUpdateModel.PostalCode;
                if (!string.IsNullOrEmpty(volunteerProfileUpdateModel.EmergencyContactName)) userProfile.EmergencyContactName = volunteerProfileUpdateModel.EmergencyContactName;
                if (!string.IsNullOrEmpty(volunteerProfileUpdateModel.EmergencyContactPhone)) userProfile.EmergencyContactPhone = volunteerProfileUpdateModel.EmergencyContactPhone;
                if (!string.IsNullOrEmpty(volunteerProfileUpdateModel.Avatar)) userProfile.Avatar = volunteerProfileUpdateModel.Avatar;
                
                userProfile.UpdatedAt = DateTime.UtcNow;
            }

            existingVolunteer.UpdatedAt = DateTime.Now;
            return await _repository.UpdateVolunteerProfile(existingVolunteer);
        }

        public async Task<VolunteerProfileViewModel> GetVolunteerProfileById(int userId)
        {
            var volunteer = await _repository.GetVolunteerProfileById(userId);
            if (volunteer == null)
            {
                throw new Exception("Volunteer not found");
            }

            return _mapper.Map<VolunteerProfileViewModel>(volunteer);
        }

        public async Task<PagedResultDto<VolunteerProfileViewModel>> GetList(int pageNumber, int pageSize)
        {
            return await _repository.GetVolunteerProfilesAsync(pageNumber, pageSize);
        }

        public async Task<int> GetLastId() => await _repository.GetLastId();

        #region Public Content Methods

        public async Task<PagedResultDto<PublicVolunteerDTO>> GetPublicVolunteersAsync(PublicVolunteerFiltersDTO filters)
        {
            return await _repository.GetPublicVolunteersAsync(filters);
        }

        public async Task<PublicVolunteerDTO?> GetPublicVolunteerAsync(int id)
        {
            return await _repository.GetPublicVolunteerAsync(id);
        }

        #endregion

        #region Lookup Methods

        public async Task<IEnumerable<SkillDto>> GetAllSkillsAsync()
        {
            var skills = await _repository.GetAllSkillsAsync();
            return _mapper.Map<IEnumerable<SkillDto>>(skills);
        }

        #endregion
    }
}
