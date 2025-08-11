using ivan_api.DTOs.UserAccount;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Repository.UserAccountRepo
{
    public class UserAccountRepository : IUserAccountRepository
    {
        private readonly VolunteerManagementSystemContext _context;
        public UserAccountRepository(VolunteerManagementSystemContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> getListUser()
        {
            return await _context.Users.Include(x => x.UserProfiles).Include(x => x.Role).ToListAsync();
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await _context.Users.Include(x => x.UserProfiles).Include(x => x.Role).FirstOrDefaultAsync(x => x.Email == email);
        }

        public async Task<User?> GetUserById(int? userId)
        {
            return await _context.Users
                .Include(x => x.UserProfiles)
                .Include(x => x.Role)
                .FirstOrDefaultAsync(x => x.UserId == userId);
        }

            public async Task<User?> UpdateuserAccount_Admin(int id, UserAccountUpdateDTO_Admin dto)
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null) {
                    return null;
                }
                
                // Only update roleId if it's a valid role (1-5)
                if (dto.RoleId > 0 && dto.RoleId <= 5) {
                    user.RoleId = dto.RoleId;
                }
                
                // Only update IsActive if it's provided
                if (dto.IsActive.HasValue) {
                    user.IsActive = dto.IsActive;
                }
                
                // Only update IsEmailVerified if it's provided
                if (dto.IsEmailVerified.HasValue) {
                    user.IsEmailVerified = dto.IsEmailVerified;
                }
                
                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return user;
            }
    }
}
