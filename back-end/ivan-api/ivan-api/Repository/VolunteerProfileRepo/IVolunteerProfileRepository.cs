using ivan_api.DTOs.VolunteerProfile;
using ivan_api.Models;

namespace ivan_api.Repository.VolunteerProfileRepo
{
    public interface IVolunteerProfileRepository
    {
        Task<IEnumerable<VolunteerProfile>> GetAllAsync();
        Task<VolunteerProfile?> GetByIdAsync(int id);
        Task AddAsync(VolunteerProfile entity);
        void Update(VolunteerProfile entity);
        void Remove(VolunteerProfile entity);
        Task<bool> SaveChangesAsync();
    }
}
