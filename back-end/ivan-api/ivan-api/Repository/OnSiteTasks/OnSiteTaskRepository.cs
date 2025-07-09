using Microsoft.EntityFrameworkCore;
using ivan_api.Models;
using ivan_api.DTOs.OnSiteTasks;

namespace ivan_api.Repository.OnSiteTasks
{
    public class OnSiteTaskRepository : IOnSiteTaskRepository
    {
        private readonly VolunteerManagementSystemContext _context;

        public OnSiteTaskRepository(VolunteerManagementSystemContext context)
        {
            _context = context;
        }

        public async Task<bool> AddOnSiteTask(OnSiteTask onSiteTask)
        {
            await _context.OnSiteTasks.AddAsync(onSiteTask);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateOnSiteTask(OnSiteTask onSiteTask)
        {
            _context.ChangeTracker.Clear();//
            _context.OnSiteTasks.Attach(onSiteTask);
            _context.Entry(onSiteTask).State = EntityState.Modified;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<OnSiteTask>> ListOnSiteTask(OnSiteTaskFilterModel filter)
        {
            var query = _context.OnSiteTasks
                .Include(x => x.Category)
                .Include(x => x.CompletedByNavigation)
                .Include(x => x.CreatedByNavigation)
                .Include(x => x.Event)
                .Include(x => x.Status)
                .Include(x => x.VerifiedByNavigation)
                .AsQueryable();

            //return query.ToList();
            return await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();
        }

        public async Task<OnSiteTask> GetOnSiteTaskById(int id)
        {
            return await _context.OnSiteTasks
                .Include(x => x.Category)
                .Include(x => x.CompletedByNavigation)
                .Include(x => x.CreatedByNavigation)
                .Include(x => x.Event)
                .Include(x => x.Status)
                .Include(x => x.VerifiedByNavigation)
                .SingleOrDefaultAsync(x => x.TaskId == id);
        }
    }
}
