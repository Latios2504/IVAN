using Microsoft.EntityFrameworkCore;
using WebAPI.Data.Entities;

namespace WebAPI.Repository.VolunteerProfileRepo
{
    public class VolunteerProfileRepository : IVolunteerProfileRepository
    {
        private readonly IVANSystemContext _context;

        public VolunteerProfileRepository(IVANSystemContext context)
        {
            _context = context;
        }
        public async Task<VolunteerProfile> AddAsync(VolunteerProfile entity)
        {
            _context.VolunteerProfiles.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<List<VolunteerProfile>> GetAllAsync()
        {
            return await _context.VolunteerProfiles
            .Include(v => v.User).ThenInclude(v => v.UserProfiles) // để lấy được FullName
            .ToListAsync();
        }

        public async Task<VolunteerProfile?> GetByIdAsync(int volunteerId)
        {
            return await _context.VolunteerProfiles
            .Include(v => v.User).ThenInclude(u => u.UserProfiles) // để lấy được FullName
            .FirstOrDefaultAsync(v => v.VolunteerId == volunteerId);
        }

        public async Task<VolunteerProfile?> GetByUserIdAsync(int userId)
        {
            return await _context.VolunteerProfiles
            .Include(v => v.User).ThenInclude(v => v.UserProfiles)
            .FirstOrDefaultAsync(v => v.UserId == userId);
        }

        public async Task<VolunteerProfile> UpdateAsync(VolunteerProfile entity)
        {
            _context.VolunteerProfiles.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
    }
}
