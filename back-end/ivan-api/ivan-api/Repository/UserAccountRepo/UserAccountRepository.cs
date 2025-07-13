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

        public async Task<User?> GetUserById(int userId)
        {
            return await _context.Users
                .Include(x => x.UserProfiles)
                .Include(x => x.Role)
                .FirstOrDefaultAsync(x => x.UserId == userId);
        }
    }
}
