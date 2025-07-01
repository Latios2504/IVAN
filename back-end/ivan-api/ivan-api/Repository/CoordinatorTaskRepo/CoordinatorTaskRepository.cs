using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Repository.CoordinatorTaskRepo
{
    public class CoordinatorTaskRepository : ICoordinatorTaskRepository
    {
        private readonly VolunteerManagementSystemContext _context;

        public CoordinatorTaskRepository(VolunteerManagementSystemContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CoordinatorTask>> GetAllAsync()
        {
            return await _context.CoordinatorTasks
            .Include(t => t.Event)
            .Include(t => t.Coordinator)
            .ToListAsync();
        }

        public async Task<CoordinatorTask?> GetByIdAsync(int id)
        {
            return await _context.CoordinatorTasks
           .Include(t => t.Event)
           .Include(t => t.Coordinator)
           .FirstOrDefaultAsync(t => t.TaskId == id);
        }

        public async Task AddAsync(CoordinatorTask task)
        {
            await _context.CoordinatorTasks.AddAsync(task);
            await SaveChangesAsync();
        }

        public void Update(CoordinatorTask task)
        {
            _context.CoordinatorTasks.Update(task);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
