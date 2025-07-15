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
