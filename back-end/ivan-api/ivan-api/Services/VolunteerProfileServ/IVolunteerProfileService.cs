using ivan_api.DTOs.VolunteerProfile;

namespace ivan_api.Services.VolunteerProfileServ
{
    public interface IVolunteerProfileService
    {
        Task<IEnumerable<VolunteerProfileListDto>> GetAllAsync();
        Task<VolunteerProfileDetailDto?> GetByIdAsync(int id);
        Task<VolunteerProfileDetailDto> CreateAsync(VolunteerProfileCreateDto dto);
        Task<VolunteerProfileDetailDto?> UpdateAsync(int id, VolunteerProfileUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
