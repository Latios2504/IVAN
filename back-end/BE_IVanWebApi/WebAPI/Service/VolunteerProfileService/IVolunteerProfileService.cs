using WebAPI.Data.Entities;
using WebAPI.Models.VolunteerProfile;

namespace WebAPI.Service.VolunteerProfileService
{
    public interface IVolunteerProfileService
    {
        Task<List<VolunteerProfileViewDto>> ListAsync();
        Task<VolunteerProfileViewDto?> GetByUserIdAsync(int userId);
        Task<VolunteerProfile> AddAsync(VolunteerProfileDto dto);
        Task<VolunteerProfile?> UpdateAsync(int userId, VolunteerProfileDto dto);
    }
}
