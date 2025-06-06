using WebAPI.Models.VolunteerProfile;

namespace WebAPI.Service.VolunteerProfileService
{
    public interface IVolunteerProfileService
    {
        Task<VolunteerProfileViewModel> GetByIdAsync(int id);
        Task<VolunteerProfileViewModel> GetByUserIdAsync(int userId);
        Task<List<VolunteerProfileViewModel>> GetFilteredProfilesAsync(VolunteerProfileFilterViewModel filter);
        Task AddAsync(VolunteerProfileViewModel model);
        Task UpdateAsync(VolunteerProfileViewModel model);
    }
}
