using ivan_api.DTOs.AdminProfile;

namespace ivan_api.Services.AdminProfileServ
{
    public interface IAdminProfileService
    {
        Task<AdminProfileViewModel?> GetMyProfileAsync(int userId);
        Task<AdminProfileViewModel?> UpdateMyProfileAsync(int userId, AdminProfileUpdateDto dto);
        Task<bool> UpdateMyAvatarAsync(int userId, string avatarUrl);
    }
}
