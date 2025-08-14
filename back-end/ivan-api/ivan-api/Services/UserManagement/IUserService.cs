using ivan_api.DTOs.UserManagement;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.UserManagement
{
    public interface IUserService
    {
        // Admin user management
        Task<PagedResultDto<UserListDTO>> GetUsersAsync(UserFiltersDTO filters);
        Task<object> GetUserDetailsAsync(int userId); // Returns role-specific profile data
        Task<bool> UpdateUserStatusAsync(int userId, bool isActive);
        
        // Lookup methods
        Task<IEnumerable<UserRoleDto>> GetAllUserRolesAsync();
    }
}
