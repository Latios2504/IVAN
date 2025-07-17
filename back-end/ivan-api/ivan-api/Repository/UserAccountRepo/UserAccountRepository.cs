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
                user.RoleId = dto.RoleId;
                user.IsActive = dto.IsActive;
                user.IsEmailVerified = dto.IsEmailVerified;
                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return user;
            }
    }
}
