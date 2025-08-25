using ivan_api.DTOs.Common;
using ivan_api.DTOs.CoordinatorTask;
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

        public async Task<PagedResultDto<CoordinatorTask>> GetOrgTasksAsync(int organizationId, CoordinatorTaskFilterDto filter)
        {
            var query = _context.CoordinatorTasks
                .Include(t => t.Event)
                .Include(t => t.Coordinator)
                .Where(t => t.Event.OrganizationId == organizationId
                         || t.Coordinator.OrganizationId == organizationId);

            // Filters
            if (filter.CoordinatorId.HasValue) query = query.Where(t => t.CoordinatorId == filter.CoordinatorId.Value);
            if (filter.EventId.HasValue) query = query.Where(t => t.EventId == filter.EventId.Value);
            if (!string.IsNullOrWhiteSpace(filter.Status)) query = query.Where(t => t.Status == filter.Status);
            if (!string.IsNullOrWhiteSpace(filter.Priority)) query = query.Where(t => t.Priority == filter.Priority);
            if (filter.DueFrom.HasValue) query = query.Where(t => t.DueDate >= filter.DueFrom.Value);
            if (filter.DueTo.HasValue) query = query.Where(t => t.DueDate <= filter.DueTo.Value);
            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var s = filter.Search.Trim().ToLower();
                query = query.Where(t =>
                    t.TaskName.ToLower().Contains(s) ||
                    (t.Description != null && t.Description.ToLower().Contains(s)));
            }

            // Sort
            var desc = string.Equals(filter.SortDirection, "desc", StringComparison.OrdinalIgnoreCase);
            query = (filter.SortBy ?? "").ToLower() switch
            {
                "createdat" => desc ? query.OrderByDescending(t => t.CreatedAt) : query.OrderBy(t => t.CreatedAt),
                "taskname" => desc ? query.OrderByDescending(t => t.TaskName) : query.OrderBy(t => t.TaskName),
                "priority" => desc ? query.OrderByDescending(t => t.Priority) : query.OrderBy(t => t.Priority),
                "status" => desc ? query.OrderByDescending(t => t.Status) : query.OrderBy(t => t.Status),
                _ => desc ? query.OrderByDescending(t => t.DueDate) : query.OrderBy(t => t.DueDate)
            };

            var total = await query.CountAsync();
            var items = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PagedResultDto<CoordinatorTask>
            {
                Items = items,
                TotalCount = total,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<PagedResultDto<CoordinatorTask>> GetPersonalTasksAsync(int coordinatorId, CoordinatorTaskFilterDto filter)
        {
            var query = _context.CoordinatorTasks
                .Include(t => t.Event)
                .Include(t => t.Coordinator)
                .Where(t => t.CoordinatorId == coordinatorId);

            // Reuse same filters (trừ CoordinatorId)
            if (filter.EventId.HasValue) query = query.Where(t => t.EventId == filter.EventId.Value);
            if (!string.IsNullOrWhiteSpace(filter.Status)) query = query.Where(t => t.Status == filter.Status);
            if (!string.IsNullOrWhiteSpace(filter.Priority)) query = query.Where(t => t.Priority == filter.Priority);
            if (filter.DueFrom.HasValue) query = query.Where(t => t.DueDate >= filter.DueFrom.Value);
            if (filter.DueTo.HasValue) query = query.Where(t => t.DueDate <= filter.DueTo.Value);
            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var s = filter.Search.Trim().ToLower();
                query = query.Where(t =>
                    t.TaskName.ToLower().Contains(s) ||
                    (t.Description != null && t.Description.ToLower().Contains(s)));
            }

            var desc = string.Equals(filter.SortDirection, "desc", StringComparison.OrdinalIgnoreCase);
            query = (filter.SortBy ?? "").ToLower() switch
            {
                "createdat" => desc ? query.OrderByDescending(t => t.CreatedAt) : query.OrderBy(t => t.CreatedAt),
                "taskname" => desc ? query.OrderByDescending(t => t.TaskName) : query.OrderBy(t => t.TaskName),
                "priority" => desc ? query.OrderByDescending(t => t.Priority) : query.OrderBy(t => t.Priority),
                "status" => desc ? query.OrderByDescending(t => t.Status) : query.OrderBy(t => t.Status),
                _ => desc ? query.OrderByDescending(t => t.DueDate) : query.OrderBy(t => t.DueDate)
            };

            var total = await query.CountAsync();
            var items = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PagedResultDto<CoordinatorTask>
            {
                Items = items,
                TotalCount = total,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<CoordinatorTask?> GetByIdAndOrganizationAsync(int taskId, int organizationId)
        {
            return await _context.CoordinatorTasks
                .Include(t => t.Event)
                .Include(t => t.Coordinator)
                .FirstOrDefaultAsync(t => t.TaskId == taskId &&
                                          (t.Event.OrganizationId == organizationId ||
                                           t.Coordinator.OrganizationId == organizationId));
        }
    }
}
