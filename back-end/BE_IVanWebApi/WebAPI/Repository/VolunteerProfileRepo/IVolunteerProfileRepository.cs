using WebAPI.Data.Entities;

namespace WebAPI.Repository.VolunteerProfileRepo
{
    public interface IVolunteerProfileRepository
    {
        Task<List<VolunteerProfile>> GetAllAsync();
        Task<VolunteerProfile?> GetByUserIdAsync(int userId);
        Task<VolunteerProfile?> GetByIdAsync(int volunteerId);
        Task<VolunteerProfile> AddAsync(VolunteerProfile entity);
        Task<VolunteerProfile> UpdateAsync(VolunteerProfile entity);
    }
}
