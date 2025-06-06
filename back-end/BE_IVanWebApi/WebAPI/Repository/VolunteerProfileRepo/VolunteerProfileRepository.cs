using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Data.Entities;
using WebAPI.Models.VolunteerProfile;

namespace WebAPI.Repository.VolunteerProfileRepo
{
    public class VolunteerProfileRepository : IVolunteerProfileRepository
    {
        private readonly IVANContext _context;
        public VolunteerProfileRepository(IVANContext context)
        {
            _context = context;
        }

        public async Task AddAsync(VolunteerProfile profile)
        {
            await _context.VolunteerProfile.AddAsync(profile);
            await _context.SaveChangesAsync();
        }

        public async Task<VolunteerProfile> GetByIdAsync(int id)
        {
            return await _context.VolunteerProfile.Include(v => v.User).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<VolunteerProfile> GetByUserIdAsync(int userId)
        {
            return await _context.VolunteerProfile.Include(vp => vp.User).FirstOrDefaultAsync(vp => vp.UserId == userId);
        }

        public async Task<List<VolunteerProfile>> GetFilteredProfilesAsync(VolunteerProfileFilterViewModel filter)
        {
            var query = _context.VolunteerProfile
                .Include(vp => vp.User)
                .AsQueryable();

            if (!string.IsNullOrEmpty(filter.Skill))
            {
                query = query.Where(vp => vp.Skills.Contains(filter.Skill));
            }

            if (!string.IsNullOrEmpty(filter.Location))
            {
                query = query.Where(vp => vp.City == filter.Location || vp.Province == filter.Location);
            }

            return await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();
        }

        public async Task UpdateAsync(VolunteerProfile profile)
        {
            _context.VolunteerProfile.Update(profile);
            await _context.SaveChangesAsync();
        }
    }
}
