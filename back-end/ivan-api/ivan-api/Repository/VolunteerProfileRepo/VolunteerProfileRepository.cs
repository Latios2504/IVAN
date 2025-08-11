using ivan_api.DTOs.VolunteerProfile;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace ivan_api.Repository.VolunteerProfileRepo
{
    public class VolunteerProfileRepository : IVolunteerProfileRepository
    {
        private readonly VolunteerManagementSystemContext _context;
        public VolunteerProfileRepository(VolunteerManagementSystemContext context) => _context = context;

        public async Task AddAsync(VolunteerProfile entity)
        {
            await _context.VolunteerProfiles.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<VolunteerProfile>> GetAllAsync()
        {
            return await _context.VolunteerProfiles.Include(v => v.User).ThenInclude(u => u.UserProfiles)
                .Include(v => v.VolunteerSkills).ThenInclude(vs => vs.Skill)
                .ToListAsync();
        }

        public async Task<VolunteerProfile?> GetByIdAsync(int userId)
        {
            return await _context.VolunteerProfiles
                .Include(v => v.User)
                    .ThenInclude(u => u.UserProfiles)
                .Include(v => v.VolunteerSkills)
                .FirstOrDefaultAsync(v => v.UserId == userId);
        }

        public void Remove(VolunteerProfile entity)
        {
            _context.VolunteerProfiles.Remove(entity);

        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }

        public void Update(VolunteerProfile entity)
        {
            _context.VolunteerProfiles.Update(entity);
        }
    }
}
