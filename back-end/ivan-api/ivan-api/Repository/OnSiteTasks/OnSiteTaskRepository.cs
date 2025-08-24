using Microsoft.EntityFrameworkCore;
using ivan_api.Models;
using ivan_api.DTOs.OnSiteTasks;
using AutoMapper.QueryableExtensions;
using ivan_api.DTOs.Common;
using AutoMapper;

namespace ivan_api.Repository.OnSiteTasks
{
    public class OnSiteTaskRepository : IOnSiteTaskRepository
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly IMapper _mapper;

        public OnSiteTaskRepository(VolunteerManagementSystemContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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

        public async Task<bool> DeleteOnSiteTask(int id)
        {
            var task = await _context.OnSiteTasks.FindAsync(id);
            if (task == null)
                return false;

            _context.OnSiteTasks.Remove(task);
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

            if(filter.EventId != null)
            {
                query = query.Where(x => x.EventId == filter.EventId);
            }
            if (filter.CategoryId != null)
            {
                query = query.Where(x => x.CategoryId == filter.CategoryId);
            }
            if (filter.StatusId != null)
            {
                query = query.Where(x => x.StatusId == filter.StatusId);
            }
            if (filter.StartTimeFrom != null)
            {
                query = query.Where(x => x.StartTime >= filter.StartTimeFrom);
            }
            if (filter.StartTimeTo != null)
            {
                query = query.Where(x => x.StartTime <= filter.StartTimeTo);
            }
            if (filter.EndTimeFrom != null)
            {
                query = query.Where(x => x.EndTime >= filter.EndTimeFrom);
            }
            if (filter.EndTimeTo != null)
            {
                query = query.Where(x => x.EndTime <= filter.EndTimeTo);
            }
            if (filter.CompletedFrom != null)
            {
                query = query.Where(x => x.CompletedAt >= filter.CompletedFrom);
            }
            if (filter.CompletedTo != null)
            {
                query = query.Where(x => x.CompletedAt <= filter.CompletedTo);
            }
            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                var term = filter.SearchTerm.ToLower();
                query = query.Where(x =>
                    x.TaskName.ToLower().Contains(term) ||
                    (x.Description != null && x.Description.ToLower().Contains(term)) ||
                    (x.Location != null && x.Location.ToLower().Contains(term)) ||
                    (x.RequiredSkills != null && x.RequiredSkills.ToLower().Contains(term)) ||
                    (x.Instructions != null && x.Instructions.ToLower().Contains(term)) ||
                    (x.Materials != null && x.Materials.ToLower().Contains(term)) ||
                    (x.SafetyRequirements != null && x.SafetyRequirements.ToLower().Contains(term)) ||
                    (x.CompletionCriteria != null && x.CompletionCriteria.ToLower().Contains(term)) ||
                    (x.Notes != null && x.Notes.ToLower().Contains(term))
                );
            }

            //return query.ToList();
            return await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();
        }

        public async Task<PagedResultDto<OnSiteTaskViewModel>> GetOnSiteTasksAsync(int PageNumber, int PageSize)
        {
            var query = _context.OnSiteTasks
                .Include(x => x.Category)
                .Include(x => x.CompletedByNavigation)
                .Include(x => x.CreatedByNavigation)
                .Include(x => x.Event)
                .Include(x => x.Status)
                .Include(x => x.VerifiedByNavigation)
                .AsQueryable();

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .ProjectTo<OnSiteTaskViewModel>(_mapper.ConfigurationProvider)//
                .ToListAsync();

            return new PagedResultDto<OnSiteTaskViewModel>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = PageNumber,
                PageSize = PageSize
            };
        }

        public async Task<OnSiteTask> GetOnSiteTaskById(int id)
        {
            var task = await _context.OnSiteTasks
                .Include(x => x.Category)
                .Include(x => x.CompletedByNavigation)
                .Include(x => x.CreatedByNavigation)
                .Include(x => x.Event)
                .Include(x => x.Status)
                .Include(x => x.VerifiedByNavigation)
                .SingleOrDefaultAsync(x => x.TaskId == id);
            return task;
        }

        public async Task<int> GetLastId()
        {
            var query = _context.OnSiteTasks
                .Include(x => x.Category)
                .Include(x => x.CompletedByNavigation)
                .Include(x => x.CreatedByNavigation)
                .Include(x => x.Event)
                .Include(x => x.Status)
                .Include(x => x.VerifiedByNavigation)
                .AsQueryable();

            if (query == null) return -1;

            return query.ToList().Last().TaskId;
        }

        public async Task<IEnumerable<OnSiteTask>> GetAllOnSiteTasks()
        {
            return _context.OnSiteTasks
                .Include(x => x.Category)
                .Include(x => x.CompletedByNavigation)
                .Include(x => x.CreatedByNavigation)
                .Include(x => x.Event)
                .Include(x => x.Status)
                .Include(x => x.VerifiedByNavigation)
                .AsQueryable();
        }
    }
}
