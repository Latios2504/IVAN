using ivan_api.Models;
using ivan_api.DTOs.EventManage;
using ivan_api.DTOs.Common;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace ivan_api.Repository.EventRepo
{
    public class EventRepository : IEventRepository
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly IMapper _mapper;

        public EventRepository(VolunteerManagementSystemContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<bool> AddAsync(Event evt)
        {
            await _context.Events.AddAsync(evt);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateAsync(Event evt)
        {
            // Load the existing entity from database
            var existingEvent = await _context.Events.FindAsync(evt.EventId);
            if (existingEvent == null)
            {
                return false;
            }
            
            // Update only the fields that changed
            existingEvent.StatusId = evt.StatusId;
            existingEvent.UpdatedAt = evt.UpdatedAt;
            
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<bool> DeleteAsync(int eventId, int organizationId)
        {
            var evt = await _context.Events.FirstOrDefaultAsync(e => e.EventId == eventId && e.OrganizationId == organizationId);
            if (evt == null) return false;

            evt.IsActive = false; // Soft delete
            evt.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Event?> GetByIdAsync(int id)
        {
            return await _context.Events
                .Include(e => e.Category)
                .Include(e => e.Status)
                .Include(e => e.Organization)
                .FirstOrDefaultAsync(e => e.EventId == id);
        }

        public async Task<PagedResultDto<EventDto>> GetEventsAsync(EventFilterDto filters)
        {
            var query = _context.Events
                .Include(e => e.Category)
                .Include(e => e.Status)
                .Include(e => e.Organization).Where(e => e.IsActive == true) // Only active events
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(filters.Search))
            {
                var searchTerm = filters.Search.ToLower();
                query = query.Where(e => e.EventName.ToLower().Contains(searchTerm) ||
                                        (e.Description != null && e.Description.ToLower().Contains(searchTerm)));
            }

            if (filters.OrganizationId.HasValue)
                query = query.Where(e => e.OrganizationId == filters.OrganizationId.Value);

            if (filters.CategoryIds?.Any() == true)
                query = query.Where(e => filters.CategoryIds.Contains(e.CategoryId));

            if (filters.StatusIds?.Any() == true)
                query = query.Where(e => filters.StatusIds.Contains(e.StatusId));

            if (filters.StartDateFrom.HasValue)
                query = query.Where(e => e.StartDate >= filters.StartDateFrom.Value);

            if (filters.StartDateTo.HasValue)
                query = query.Where(e => e.StartDate <= filters.StartDateTo.Value);

            if (filters.EndDateFrom.HasValue)
                query = query.Where(e => e.EndDate >= filters.EndDateFrom.Value);

            if (filters.EndDateTo.HasValue)
                query = query.Where(e => e.EndDate <= filters.EndDateTo.Value);

            if (!string.IsNullOrWhiteSpace(filters.Province))
                query = query.Where(e => e.Province == filters.Province);

            if (!string.IsNullOrWhiteSpace(filters.District))
                query = query.Where(e => e.District == filters.District);

            if (filters.IsFeatured.HasValue)
                query = query.Where(e => e.IsFeatured == filters.IsFeatured.Value);

            if (filters.IsUrgent.HasValue)
                query = query.Where(e => e.IsUrgent == filters.IsUrgent.Value);

            if (filters.IsActive.HasValue)
                query = query.Where(e => e.IsActive == filters.IsActive.Value);

            if (filters.MinVolunteers.HasValue)
                query = query.Where(e => e.MinVolunteers >= filters.MinVolunteers.Value);

            if (filters.MaxVolunteers.HasValue)
                query = query.Where(e => e.MaxVolunteers <= filters.MaxVolunteers.Value);

            // Apply sorting
            switch (filters.SortBy.ToLower())
            {
                case "name":
                    query = filters.SortDirection == "asc" ? query.OrderBy(e => e.EventName) : query.OrderByDescending(e => e.EventName);
                    break;
                case "startdate":
                    query = filters.SortDirection == "asc" ? query.OrderBy(e => e.StartDate) : query.OrderByDescending(e => e.StartDate);
                    break;
                case "createdat":
                default:
                    query = filters.SortDirection == "asc" ? query.OrderBy(e => e.CreatedAt) : query.OrderByDescending(e => e.CreatedAt);
                    break;
            }

            // Get total count
            var totalCount = await query.CountAsync();

            // Apply pagination
            var events = await query
                .Skip((filters.Page - 1) * filters.Size)
                .Take(filters.Size)
                .ProjectTo<EventDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return new PagedResultDto<EventDto>
            {
                Items = events,
                TotalCount = totalCount,
                PageNumber = filters.Page,
                PageSize = filters.Size
            };
        }

        public async Task<IEnumerable<EventCategory>> GetCategoriesAsync()
        {
            return await _context.EventCategories
                .Where(c => c.IsActive == true)
                .OrderBy(c => c.CategoryName)
                .ToListAsync();
        }

        public async Task<IEnumerable<EventStatus>> GetStatusesAsync()
        {
            return await _context.EventStatuses
                .Where(s => s.IsActive == true)
                .OrderBy(s => s.StatusName)
                .ToListAsync();
        }
    }
}
