using ivan_api.Models;
using ivan_api.DTOs.VolunteerProfile;
using ivan_api.DTOs.Common;

namespace ivan_api.Repository.VolunteerProfileRepo
{
    public interface IVolunteerProfileRepository
    {
        Task<bool> AddVolunteerProfile(VolunteerProfile volunteerProfile);
        Task<bool> UpdateVolunteerProfile(VolunteerProfile volunteerProfile);
        Task<VolunteerProfile?> GetVolunteerProfileById(int userId);
        Task<PagedResultDto<VolunteerProfileViewModel>> GetVolunteerProfilesAsync(int PageNumber, int PageSize);
        Task<PagedResultDto<PublicVolunteerDTO>> GetPublicVolunteersAsync(PublicVolunteerFiltersDTO filters);
        Task<PublicVolunteerDTO?> GetPublicVolunteerAsync(int id);
        Task<int> GetLastId();
        
        // Skills lookup methods
        Task<IEnumerable<Skill>> GetAllSkillsAsync();
    }
}
