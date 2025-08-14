using ivan_api.Models;
using Microsoft.EntityFrameworkCore;
using ivan_api.DTOs.UserManagement;
using AutoMapper.QueryableExtensions;
using ivan_api.DTOs.Common;
using AutoMapper;

namespace ivan_api.Repository.UserManagement
{
    public class UserRepository : IUserRepository
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly IMapper _mapper;

        public UserRepository(VolunteerManagementSystemContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PagedResultDto<UserListDTO>> GetUsersAsync(UserFiltersDTO filters)
        {
            var query = _context.Users
                .Include(u => u.Role)
                .Include(u => u.UserProfiles) // Only include for display name
                .Include(u => u.VolunteerProfileUsers) // For role-specific info
                .Include(u => u.OrganizationUsers) // For role-specific info
                .Include(u => u.PartnerUsers) // For role-specific info
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(filters.Search))
            {
                var searchTerm = filters.Search.ToLower();
                query = query.Where(u => 
                    u.Email.ToLower().Contains(searchTerm) ||
                    (u.UserProfiles.Any() && u.UserProfiles.Any(up => 
                        up.FullName.ToLower().Contains(searchTerm) ||
                        up.FirstName.ToLower().Contains(searchTerm) ||
                        up.LastName.ToLower().Contains(searchTerm))));
            }

            if (filters.RoleId.HasValue)
            {
                query = query.Where(u => u.RoleId == filters.RoleId.Value);
            }

            if (filters.IsActive.HasValue)
            {
                query = query.Where(u => u.IsActive == filters.IsActive.Value);
            }

            if (filters.IsEmailVerified.HasValue)
            {
                query = query.Where(u => u.IsEmailVerified == filters.IsEmailVerified.Value);
            }

            // Order by creation date (newest first)
            query = query.OrderByDescending(u => u.CreatedAt);

            // Get total count
            var totalItems = await query.CountAsync();

            // Apply pagination and load entities first
            var userEntities = await query
                .Skip((filters.Page - 1) * filters.Size)
                .Take(filters.Size)
                .ToListAsync();

            // Map to DTOs using AutoMapper - only basic info
            var users = _mapper.Map<List<UserListDTO>>(userEntities);

            return new PagedResultDto<UserListDTO>
            {
                Items = users,
                PageNumber = filters.Page,
                PageSize = filters.Size,
                TotalCount = totalItems
            };
        }

        public async Task<User?> GetUserForRoleDetectionAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task<UserProfileDTO?> GetUserProfileAsync(int userId)
        {
            var userProfile = await _context.UserProfiles
                .FirstOrDefaultAsync(up => up.UserId == userId);
            
            return userProfile != null ? _mapper.Map<UserProfileDTO>(userProfile) : null;
        }

        public async Task<bool> UpdateUserStatusAsync(int userId, bool isActive)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.IsActive = isActive;
            user.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<UserRole>> GetAllUserRolesAsync()
        {
            return await _context.UserRoles
                .Where(r => r.IsActive == true)
                .OrderBy(r => r.RoleName)
                .ToListAsync();
        }
    }
}
