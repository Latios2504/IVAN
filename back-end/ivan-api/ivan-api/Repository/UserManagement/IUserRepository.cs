using ivan_api.Models;
using ivan_api.DTOs.UserManagement;
using ivan_api.DTOs.Common;

namespace ivan_api.Repository.UserManagement
{
    public interface IUserRepository
    {
        // Admin user management
        Task<PagedResultDto<UserListDTO>> GetUsersAsync(UserFiltersDTO filters);
        Task<bool> UpdateUserStatusAsync(int userId, bool isActive);
        Task<User?> GetUserForRoleDetectionAsync(int userId); 
        Task<UserProfileDTO?> GetUserProfileAsync(int userId);
        
        // Lookup methods
        Task<IEnumerable<UserRole>> GetAllUserRolesAsync();
    }
}
