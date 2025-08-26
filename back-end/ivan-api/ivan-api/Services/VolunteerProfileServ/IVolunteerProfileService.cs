using ivan_api.DTOs.VolunteerProfile;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.VolunteerProfileServ
{
    public interface IVolunteerProfileService
    {
        Task<bool> AddVolunteerProfile(VolunteerProfileCreateDto volunteerProfileInputModel);
        Task<bool> UpdateVolunteerProfile(VolunteerProfileUpdateDto volunteerProfileUpdateModel, int userId);
        Task<VolunteerProfileViewModel> GetVolunteerProfileById(int userId);
        Task<PagedResultDto<VolunteerProfileViewModel>> GetList(int pageNumber, int pageSize);
        Task<int> GetLastId();
        
        // Public content methods
        Task<PagedResultDto<PublicVolunteerDTO>> GetPublicVolunteersAsync(PublicVolunteerFiltersDTO filters);
        Task<PublicVolunteerDTO?> GetPublicVolunteerAsync(int id);
        
        // Lookup methods
        Task<IEnumerable<SkillDto>> GetAllSkillsAsync();
    }
}
