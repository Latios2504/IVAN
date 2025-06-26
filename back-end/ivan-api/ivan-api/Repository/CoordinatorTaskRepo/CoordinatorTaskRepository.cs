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

        public async Task AddAsync(CoordinatorTask task)
        {
            await _context.CoordinatorTasks.AddAsync(task);
        }

        public void Delete(CoordinatorTask task)
        {
            _context.CoordinatorTasks.Remove(task);
        }

        public async Task<IEnumerable<CoordinatorTask>> GetAllAsync()
        {
            return await _context.CoordinatorTasks
            .Include(t => t.Coordinator)
            .Include(t => t.Event)
            .ToListAsync();
        }

        public async Task<CoordinatorTask?> GetByIdAsync(int id)
        {
            return await _context.CoordinatorTasks
            .Include(t => t.Coordinator)
            .Include(t => t.Event)
            .FirstOrDefaultAsync(t => t.TaskId == id);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(CoordinatorTask task)
        {
            _context.CoordinatorTasks.Update(task);
        }
    }
}
