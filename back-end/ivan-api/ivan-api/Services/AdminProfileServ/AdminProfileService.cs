using ivan_api.DTOs.AdminProfile;
using ivan_api.Repository.AdminProfileRepo;

namespace ivan_api.Services.AdminProfileServ
{
    public class AdminProfileService : IAdminProfileService
    {
        private readonly IAdminProfileRepository _repo;

        public AdminProfileService(IAdminProfileRepository repo)
        {
            _repo = repo;
        }

        public async Task<AdminProfileViewModel?> GetMyProfileAsync(int userId)
        {
            return await _repo.GetByUserIdAsync(userId);
        }

        public async Task<AdminProfileViewModel?> UpdateMyProfileAsync(int userId, AdminProfileUpdateDto dto)
        {
            // Validation cơ bản
            if (dto.DateOfBirth.HasValue && dto.DateOfBirth.Value.Date > DateTime.UtcNow.Date)
                throw new ArgumentException("DateOfBirth cannot be in the future");

            var ok = await _repo.UpsertUserProfileAsync(userId, dto);
            if (!ok) return null;

            return await _repo.GetByUserIdAsync(userId);
        }

        public Task<bool> UpdateMyAvatarAsync(int userId, string avatarUrl)
        {
            if (string.IsNullOrWhiteSpace(avatarUrl))
                throw new ArgumentException("Avatar URL is required");

            return _repo.UpdateAvatarAsync(userId, avatarUrl.Trim());
        }
    }
}
