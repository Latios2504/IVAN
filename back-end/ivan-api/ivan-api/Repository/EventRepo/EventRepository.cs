using ivan_api.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace ivan_api.Repository.EventRepo
{
    public class EventRepository : IEventRepository
    {
        private readonly VolunteerManagementSystemContext _ctx;
        public EventRepository(VolunteerManagementSystemContext ctx) => _ctx = ctx;
        public async Task<IEnumerable<Event>> GetAllAsync() =>
        await _ctx.Events.AsNoTracking().ToListAsync();

        public async Task<Event?> GetByIdAsync(int id) =>
            await _ctx.Events.FindAsync(id);

        public async Task AddAsync(Event evt)
        {
            _ctx.Events.Add(evt);
            await _ctx.SaveChangesAsync();
        }

        public async Task UpdateAsync(Event evt)
        {
            _ctx.Events.Update(evt);
            await _ctx.SaveChangesAsync();
        }
    }
}
