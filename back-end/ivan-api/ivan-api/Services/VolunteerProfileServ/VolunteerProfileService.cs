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
            // 1) Lấy hồ sơ hiện tại (đã Include User, UserProfiles, VolunteerSkills)
            var existingVolunteer = await _repository.GetVolunteerProfileById(userId);
            if (existingVolunteer == null)
                throw new Exception("Volunteer not found");

            // 2) Map các trường thuộc VolunteerProfile (KHÔNG map Skills list vào string)
            //    Giả định AutoMapper profile đã có .ForMember(dest => dest.Skills, opt => opt.Ignore())
            _mapper.Map(volunteerProfileUpdateModel, existingVolunteer);

            // 3) Cập nhật các trường thuộc UserProfile (cá nhân)
            var userProfile = existingVolunteer.User?.UserProfiles?.FirstOrDefault();
            if (userProfile != null)
            {
                if (!string.IsNullOrWhiteSpace(volunteerProfileUpdateModel.FirstName))
                    userProfile.FirstName = volunteerProfileUpdateModel.FirstName;

                if (!string.IsNullOrWhiteSpace(volunteerProfileUpdateModel.LastName))
                    userProfile.LastName = volunteerProfileUpdateModel.LastName;

                if (!string.IsNullOrWhiteSpace(volunteerProfileUpdateModel.PhoneNumber))
                    userProfile.PhoneNumber = volunteerProfileUpdateModel.PhoneNumber;

                if (volunteerProfileUpdateModel.DateOfBirth.HasValue)
                    userProfile.DateOfBirth = DateOnly.FromDateTime(volunteerProfileUpdateModel.DateOfBirth.Value);

                if (!string.IsNullOrWhiteSpace(volunteerProfileUpdateModel.Gender))
                    userProfile.Gender = volunteerProfileUpdateModel.Gender;

                if (!string.IsNullOrWhiteSpace(volunteerProfileUpdateModel.Address))
                    userProfile.Address = volunteerProfileUpdateModel.Address;

                if (!string.IsNullOrWhiteSpace(volunteerProfileUpdateModel.WardCommune))
                    userProfile.WardCommune = volunteerProfileUpdateModel.WardCommune;

                if (!string.IsNullOrWhiteSpace(volunteerProfileUpdateModel.District))
                    userProfile.District = volunteerProfileUpdateModel.District;

                if (!string.IsNullOrWhiteSpace(volunteerProfileUpdateModel.Province))
                    userProfile.Province = volunteerProfileUpdateModel.Province;

                if (!string.IsNullOrWhiteSpace(volunteerProfileUpdateModel.PostalCode))
                    userProfile.PostalCode = volunteerProfileUpdateModel.PostalCode;

                if (!string.IsNullOrWhiteSpace(volunteerProfileUpdateModel.EmergencyContactName))
                    userProfile.EmergencyContactName = volunteerProfileUpdateModel.EmergencyContactName;

                if (!string.IsNullOrWhiteSpace(volunteerProfileUpdateModel.EmergencyContactPhone))
                    userProfile.EmergencyContactPhone = volunteerProfileUpdateModel.EmergencyContactPhone;

                if (!string.IsNullOrWhiteSpace(volunteerProfileUpdateModel.Avatar))
                    userProfile.Avatar = volunteerProfileUpdateModel.Avatar;

                userProfile.UpdatedAt = DateTime.UtcNow;
            }

            // 4) Đồng bộ bảng nối VolunteerSkills theo danh sách gửi từ FE
            //    (Không đụng tới cột string Skills của VolunteerProfiles)
            var newSkills = volunteerProfileUpdateModel.Skills ?? new List<VolunteerSkillDto>();

            // Đảm bảo collection không null để thao tác
            existingVolunteer.VolunteerSkills ??= new List<VolunteerSkill>();
            var existingSkills = existingVolunteer.VolunteerSkills.ToList(); // snapshot

            // 4a) XÓA những skill không còn trong danh sách mới
            foreach (var es in existingSkills)
            {
                bool stillSelected = newSkills.Any(ns => ns.SkillId == es.SkillId);
                if (!stillSelected)
                {
                    // Remove khỏi collection; Repository (Update graph) sẽ SaveChanges
                    existingVolunteer.VolunteerSkills.Remove(es);
                }
            }

            // 4b) THÊM/CẬP NHẬT những skill mới/đã có
            foreach (var ns in newSkills)
            {
                var es = existingVolunteer.VolunteerSkills.FirstOrDefault(s => s.SkillId == ns.SkillId);
                if (es == null)
                {
                    // Thêm mới vào bảng nối
                    existingVolunteer.VolunteerSkills.Add(new VolunteerSkill
                    {
                        VolunteerId = existingVolunteer.VolunteerId,
                        SkillId = ns.SkillId,
                        ProficiencyLevel = ns.ProficiencyLevel,
                        YearsOfExperience = ns.YearsOfExperience,
                        Description = ns.Description
                    });
                }
                else
                {
                    // Cập nhật thuộc tính bổ sung
                    es.ProficiencyLevel = ns.ProficiencyLevel;
                    es.YearsOfExperience = ns.YearsOfExperience;
                    es.Description = ns.Description;
                }
            }

            // 5) Cập nhật mốc thời gian
            existingVolunteer.UpdatedAt = DateTime.UtcNow;

            // 6) Lưu
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
