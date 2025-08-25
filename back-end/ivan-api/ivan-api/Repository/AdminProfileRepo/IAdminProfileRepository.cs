using ivan_api.DTOs.AdminProfile;

namespace ivan_api.Repository.AdminProfileRepo
{
    public interface IAdminProfileRepository
    {
        Task<AdminProfileViewModel?> GetByUserIdAsync(int userId);
        Task<bool> UpsertUserProfileAsync(int userId, AdminProfileUpdateDto dto);
        Task<bool> UpdateAvatarAsync(int userId, string avatarUrl);
    }
}
