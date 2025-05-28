using WebAPI.Data.Entities;
using WebAPI.Models.VolunteerProfile;

namespace WebAPI.Repository.VolunteerProfileRepo
{
    public interface IVolunteerProfileRepository
    {
        Task<VolunteerProfile> GetByIdAsync(int id);
        Task<VolunteerProfile> GetByUserIdAsync(int userId);
        Task<List<VolunteerProfile>> GetFilteredProfilesAsync(VolunteerProfileFilterViewModel filter);
        Task AddAsync(VolunteerProfile profile);
        Task UpdateAsync(VolunteerProfile profile);
    }
}
