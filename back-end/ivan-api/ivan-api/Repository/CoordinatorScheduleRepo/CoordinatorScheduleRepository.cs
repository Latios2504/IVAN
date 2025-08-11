using ivan_api.DTOs.CoordinatorSchedule;
using ivan_api.DTOs.Common;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Repository.CoordinatorScheduleRepo
{
    public class CoordinatorScheduleRepository : ICoordinatorScheduleRepository
    {
        private readonly VolunteerManagementSystemContext _context;

        public CoordinatorScheduleRepository(VolunteerManagementSystemContext context)
        {
            _context = context;
        }

        public async Task<CoordinatorSchedule?> GetByIdAsync(int scheduleId)
        {
            return await _context.CoordinatorSchedules
                .Include(cs => cs.Coordinator)
                    .ThenInclude(c => c.User)
                        .ThenInclude(u => u.UserProfiles.FirstOrDefault())
                .Include(cs => cs.Event)
                .Include(cs => cs.CreatedByNavigation)
                    .ThenInclude(u => u.UserProfiles.FirstOrDefault())
                .FirstOrDefaultAsync(cs => cs.ScheduleId == scheduleId);
        }

        public async Task<CoordinatorSchedule?> GetByIdAndOrganizationAsync(int scheduleId, int organizationId)
        {
            return await _context.CoordinatorSchedules
                .Include(cs => cs.Coordinator)
                    .ThenInclude(c => c.User)
                        .ThenInclude(u => u.UserProfiles.FirstOrDefault())
                .Include(cs => cs.Event)
                .Include(cs => cs.CreatedByNavigation)
                    .ThenInclude(u => u.UserProfiles.FirstOrDefault())
                .FirstOrDefaultAsync(cs => cs.ScheduleId == scheduleId && 
                                         cs.Coordinator.OrganizationId == organizationId);
        }

        public async Task<PagedResultDto<CoordinatorSchedule>> GetOrganizationSchedulesAsync(
            int organizationId, CoordinatorScheduleFilterDto filter)
        {
            var query = _context.CoordinatorSchedules
                .Include(cs => cs.Coordinator)
                    .ThenInclude(c => c.User)
                        .ThenInclude(u => u.UserProfiles.FirstOrDefault())
                .Include(cs => cs.Event)
                .Include(cs => cs.CreatedByNavigation)
                    .ThenInclude(u => u.UserProfiles.FirstOrDefault())
                .Where(cs => cs.Coordinator.OrganizationId == organizationId);

            // Apply filters
            if (filter.CoordinatorId.HasValue)
                query = query.Where(cs => cs.CoordinatorId == filter.CoordinatorId.Value);

            if (filter.EventId.HasValue)
                query = query.Where(cs => cs.EventId == filter.EventId.Value);

            if (filter.StartDateFrom.HasValue)
                query = query.Where(cs => cs.StartDateTime >= filter.StartDateFrom.Value);

            if (filter.StartDateTo.HasValue)
                query = query.Where(cs => cs.StartDateTime <= filter.StartDateTo.Value);

            if (filter.EndDateFrom.HasValue)
                query = query.Where(cs => cs.EndDateTime >= filter.EndDateFrom.Value);

            if (filter.EndDateTo.HasValue)
                query = query.Where(cs => cs.EndDateTime <= filter.EndDateTo.Value);

            if (!string.IsNullOrEmpty(filter.ScheduleType))
                query = query.Where(cs => cs.ScheduleType == filter.ScheduleType);

            if (!string.IsNullOrEmpty(filter.Priority))
                query = query.Where(cs => cs.Priority == filter.Priority);

            if (!string.IsNullOrEmpty(filter.Status))
                query = query.Where(cs => cs.Status == filter.Status);

            if (!string.IsNullOrEmpty(filter.Search))
            {
                var searchLower = filter.Search.ToLower();
                query = query.Where(cs => 
                    cs.Title.ToLower().Contains(searchLower) ||
                    (cs.Description != null && cs.Description.ToLower().Contains(searchLower)) ||
                    (cs.Location != null && cs.Location.ToLower().Contains(searchLower)) ||
                    cs.Coordinator.User.UserProfiles.Any(up => 
                        (up.FirstName + " " + up.LastName).ToLower().Contains(searchLower)));
            }

            // Apply sorting
            if (!string.IsNullOrEmpty(filter.SortBy))
            {
                var isDescending = filter.SortDirection?.ToLower() == "desc";
                
                query = filter.SortBy.ToLower() switch
                {
                    "startdatetime" => isDescending ? 
                        query.OrderByDescending(cs => cs.StartDateTime) : 
                        query.OrderBy(cs => cs.StartDateTime),
                    "enddatetime" => isDescending ? 
                        query.OrderByDescending(cs => cs.EndDateTime) : 
                        query.OrderBy(cs => cs.EndDateTime),
                    "title" => isDescending ? 
                        query.OrderByDescending(cs => cs.Title) : 
                        query.OrderBy(cs => cs.Title),
                    "coordinatorname" => isDescending ? 
                        query.OrderByDescending(cs => cs.Coordinator.User.UserProfiles.FirstOrDefault().FirstName) : 
                        query.OrderBy(cs => cs.Coordinator.User.UserProfiles.FirstOrDefault().FirstName),
                    "status" => isDescending ? 
                        query.OrderByDescending(cs => cs.Status) : 
                        query.OrderBy(cs => cs.Status),
                    "priority" => isDescending ? 
                        query.OrderByDescending(cs => cs.Priority) : 
                        query.OrderBy(cs => cs.Priority),
                    _ => query.OrderBy(cs => cs.StartDateTime)
                };
            }
            else
            {
                query = query.OrderBy(cs => cs.StartDateTime);
            }

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / filter.Size);

            var items = await query
                .Skip((filter.Page - 1) * filter.Size)
                .Take(filter.Size)
                .ToListAsync();

            return new PagedResultDto<CoordinatorSchedule>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.Page,
                PageSize = filter.Size
            };
        }

        public async Task<PagedResultDto<CoordinatorSchedule>> GetPersonalSchedulesAsync(
            int coordinatorUserId, CoordinatorScheduleFilterDto filter)
        {
            var coordinatorId = await GetCoordinatorIdByUserIdAsync(coordinatorUserId);
            if (!coordinatorId.HasValue)
            {
                return new PagedResultDto<CoordinatorSchedule>
                {
                    Items = new List<CoordinatorSchedule>(),
                    TotalCount = 0,
                    PageNumber = filter.Page,
                    PageSize = filter.Size
                };
            }

            filter.CoordinatorId = coordinatorId.Value;
            
            var query = _context.CoordinatorSchedules
                .Include(cs => cs.Coordinator)
                    .ThenInclude(c => c.User)
                        .ThenInclude(u => u.UserProfiles.FirstOrDefault())
                .Include(cs => cs.Event)
                .Include(cs => cs.CreatedByNavigation)
                    .ThenInclude(u => u.UserProfiles.FirstOrDefault())
                .Where(cs => cs.CoordinatorId == coordinatorId.Value);

            // Apply same filtering logic as organization schedules
            return await ApplyFiltersAndPagination(query, filter);
        }

        public async Task<int> CreateAsync(CoordinatorSchedule schedule)
        {
            schedule.CreatedAt = DateTime.UtcNow;
            schedule.UpdatedAt = DateTime.UtcNow;
            
            _context.CoordinatorSchedules.Add(schedule);
            await _context.SaveChangesAsync();
            return schedule.ScheduleId;
        }

        public async Task<bool> UpdateAsync(CoordinatorSchedule schedule)
        {
            schedule.UpdatedAt = DateTime.UtcNow;
            _context.CoordinatorSchedules.Update(schedule);
            return await SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(int scheduleId)
        {
            var schedule = await _context.CoordinatorSchedules.FindAsync(scheduleId);
            if (schedule == null) return false;

            _context.CoordinatorSchedules.Remove(schedule);
            return await SaveChangesAsync();
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<CoordinatorSchedule>> CheckConflictsAsync(
            int coordinatorId, DateTime startDateTime, DateTime endDateTime, int? excludeScheduleId = null)
        {
            var query = _context.CoordinatorSchedules
                .Include(cs => cs.Event)
                .Where(cs => cs.CoordinatorId == coordinatorId &&
                           cs.Status != "Cancelled" &&
                           ((cs.StartDateTime < endDateTime && cs.EndDateTime > startDateTime)));

            if (excludeScheduleId.HasValue)
                query = query.Where(cs => cs.ScheduleId != excludeScheduleId.Value);

            return await query.ToListAsync();
        }

        public async Task<List<CoordinatorSchedule>> GetCalendarViewAsync(
            int organizationId, DateTime startDate, DateTime endDate, int? coordinatorId = null)
        {
            var query = _context.CoordinatorSchedules
                .Include(cs => cs.Coordinator)
                    .ThenInclude(c => c.User)
                        .ThenInclude(u => u.UserProfiles.FirstOrDefault())
                .Include(cs => cs.Event)
                .Where(cs => cs.Coordinator.OrganizationId == organizationId &&
                           cs.StartDateTime <= endDate &&
                           cs.EndDateTime >= startDate);

            if (coordinatorId.HasValue)
                query = query.Where(cs => cs.CoordinatorId == coordinatorId.Value);

            return await query.OrderBy(cs => cs.StartDateTime).ToListAsync();
        }

        // Statistics Methods
        public async Task<int> GetTotalSchedulesCountAsync(int organizationId)
        {
            return await _context.CoordinatorSchedules
                .CountAsync(cs => cs.Coordinator.OrganizationId == organizationId);
        }

        public async Task<Dictionary<string, int>> GetSchedulesByStatusAsync(int organizationId)
        {
            return await _context.CoordinatorSchedules
                .Where(cs => cs.Coordinator.OrganizationId == organizationId)
                .GroupBy(cs => cs.Status ?? "Unknown")
                .ToDictionaryAsync(g => g.Key, g => g.Count());
        }

        public async Task<Dictionary<string, int>> GetSchedulesByTypeAsync(int organizationId)
        {
            return await _context.CoordinatorSchedules
                .Where(cs => cs.Coordinator.OrganizationId == organizationId)
                .GroupBy(cs => cs.ScheduleType ?? "Unknown")
                .ToDictionaryAsync(g => g.Key, g => g.Count());
        }

        public async Task<Dictionary<string, int>> GetSchedulesByPriorityAsync(int organizationId)
        {
            return await _context.CoordinatorSchedules
                .Where(cs => cs.Coordinator.OrganizationId == organizationId)
                .GroupBy(cs => cs.Priority ?? "Unknown")
                .ToDictionaryAsync(g => g.Key, g => g.Count());
        }

        public async Task<int> GetTodaySchedulesCountAsync(int organizationId)
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            return await _context.CoordinatorSchedules
                .CountAsync(cs => cs.Coordinator.OrganizationId == organizationId &&
                                cs.StartDateTime >= today &&
                                cs.StartDateTime < tomorrow);
        }

        public async Task<int> GetThisWeekSchedulesCountAsync(int organizationId)
        {
            var startOfWeek = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek);
            var endOfWeek = startOfWeek.AddDays(7);

            return await _context.CoordinatorSchedules
                .CountAsync(cs => cs.Coordinator.OrganizationId == organizationId &&
                                cs.StartDateTime >= startOfWeek &&
                                cs.StartDateTime < endOfWeek);
        }

        public async Task<int> GetThisMonthSchedulesCountAsync(int organizationId)
        {
            var startOfMonth = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1);

            return await _context.CoordinatorSchedules
                .CountAsync(cs => cs.Coordinator.OrganizationId == organizationId &&
                                cs.StartDateTime >= startOfMonth &&
                                cs.StartDateTime < endOfMonth);
        }

        public async Task<int> GetUpcomingSchedulesCountAsync(int organizationId)
        {
            var now = DateTime.UtcNow;

            return await _context.CoordinatorSchedules
                .CountAsync(cs => cs.Coordinator.OrganizationId == organizationId &&
                                cs.StartDateTime > now &&
                                cs.Status != "Cancelled");
        }

        public async Task<int> GetOverdueSchedulesCountAsync(int organizationId)
        {
            var now = DateTime.UtcNow;

            return await _context.CoordinatorSchedules
                .CountAsync(cs => cs.Coordinator.OrganizationId == organizationId &&
                                cs.EndDateTime < now &&
                                cs.Status == "Scheduled");
        }

        public async Task<List<CoordinatorScheduleStatsItem>> GetTopCoordinatorsAsync(int organizationId, int limit = 10)
        {
            return await _context.CoordinatorSchedules
                .Where(cs => cs.Coordinator.OrganizationId == organizationId)
                .GroupBy(cs => new
                {
                    cs.CoordinatorId,
                    CoordinatorName = cs.Coordinator.User.UserProfiles.FirstOrDefault().FirstName + " " +
                                    cs.Coordinator.User.UserProfiles.FirstOrDefault().LastName
                })
                .Select(g => new CoordinatorScheduleStatsItem
                {
                    CoordinatorId = g.Key.CoordinatorId,
                    CoordinatorName = g.Key.CoordinatorName,
                    ScheduleCount = g.Count(),
                    CompletedCount = g.Count(cs => cs.Status == "Completed"),
                    CompletionRate = g.Count() > 0 ? (double)g.Count(cs => cs.Status == "Completed") / g.Count() * 100 : 0
                })
                .OrderByDescending(item => item.ScheduleCount)
                .Take(limit)
                .ToListAsync();
        }

        // Bulk Operations
        public async Task<bool> BulkUpdateStatusAsync(int organizationId, List<int> scheduleIds, string status, int updatedBy)
        {
            var schedules = await _context.CoordinatorSchedules
                .Where(cs => scheduleIds.Contains(cs.ScheduleId) &&
                           cs.Coordinator.OrganizationId == organizationId)
                .ToListAsync();

            foreach (var schedule in schedules)
            {
                schedule.Status = status;
                schedule.UpdatedAt = DateTime.UtcNow;
            }

            return await SaveChangesAsync();
        }

        public async Task<bool> BulkDeleteAsync(int organizationId, List<int> scheduleIds)
        {
            var schedules = await _context.CoordinatorSchedules
                .Where(cs => scheduleIds.Contains(cs.ScheduleId) &&
                           cs.Coordinator.OrganizationId == organizationId)
                .ToListAsync();

            _context.CoordinatorSchedules.RemoveRange(schedules);
            return await SaveChangesAsync();
        }

        // Validation Helpers
        public async Task<bool> CoordinatorBelongsToOrganizationAsync(int coordinatorId, int organizationId)
        {
            return await _context.VolunteerCoordinators
                .AnyAsync(vc => vc.CoordinatorId == coordinatorId && vc.OrganizationId == organizationId);
        }

        public async Task<bool> ScheduleExistsAsync(int scheduleId)
        {
            return await _context.CoordinatorSchedules
                .AnyAsync(cs => cs.ScheduleId == scheduleId);
        }

        public async Task<int?> GetCoordinatorIdByUserIdAsync(int userId)
        {
            var coordinator = await _context.VolunteerCoordinators
                .FirstOrDefaultAsync(vc => vc.UserId == userId);
            return coordinator?.CoordinatorId;
        }

        private async Task<PagedResultDto<CoordinatorSchedule>> ApplyFiltersAndPagination(
            IQueryable<CoordinatorSchedule> query, CoordinatorScheduleFilterDto filter)
        {
            // Apply the same filtering logic as GetOrganizationSchedulesAsync
            // This is a helper method to avoid code duplication
            
            if (filter.EventId.HasValue)
                query = query.Where(cs => cs.EventId == filter.EventId.Value);

            if (filter.StartDateFrom.HasValue)
                query = query.Where(cs => cs.StartDateTime >= filter.StartDateFrom.Value);

            if (filter.StartDateTo.HasValue)
                query = query.Where(cs => cs.StartDateTime <= filter.StartDateTo.Value);

            if (filter.EndDateFrom.HasValue)
                query = query.Where(cs => cs.EndDateTime >= filter.EndDateFrom.Value);

            if (filter.EndDateTo.HasValue)
                query = query.Where(cs => cs.EndDateTime <= filter.EndDateTo.Value);

            if (!string.IsNullOrEmpty(filter.ScheduleType))
                query = query.Where(cs => cs.ScheduleType == filter.ScheduleType);

            if (!string.IsNullOrEmpty(filter.Priority))
                query = query.Where(cs => cs.Priority == filter.Priority);

            if (!string.IsNullOrEmpty(filter.Status))
                query = query.Where(cs => cs.Status == filter.Status);

            if (!string.IsNullOrEmpty(filter.Search))
            {
                var searchLower = filter.Search.ToLower();
                query = query.Where(cs => 
                    cs.Title.ToLower().Contains(searchLower) ||
                    (cs.Description != null && cs.Description.ToLower().Contains(searchLower)) ||
                    (cs.Location != null && cs.Location.ToLower().Contains(searchLower)));
            }

            // Apply sorting
            if (!string.IsNullOrEmpty(filter.SortBy))
            {
                var isDescending = filter.SortDirection?.ToLower() == "desc";
                
                query = filter.SortBy.ToLower() switch
                {
                    "startdatetime" => isDescending ? 
                        query.OrderByDescending(cs => cs.StartDateTime) : 
                        query.OrderBy(cs => cs.StartDateTime),
                    "enddatetime" => isDescending ? 
                        query.OrderByDescending(cs => cs.EndDateTime) : 
                        query.OrderBy(cs => cs.EndDateTime),
                    "title" => isDescending ? 
                        query.OrderByDescending(cs => cs.Title) : 
                        query.OrderBy(cs => cs.Title),
                    "status" => isDescending ? 
                        query.OrderByDescending(cs => cs.Status) : 
                        query.OrderBy(cs => cs.Status),
                    "priority" => isDescending ? 
                        query.OrderByDescending(cs => cs.Priority) : 
                        query.OrderBy(cs => cs.Priority),
                    _ => query.OrderBy(cs => cs.StartDateTime)
                };
            }
            else
            {
                query = query.OrderBy(cs => cs.StartDateTime);
            }

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / filter.Size);

            var items = await query
                .Skip((filter.Page - 1) * filter.Size)
                .Take(filter.Size)
                .ToListAsync();

            return new PagedResultDto<CoordinatorSchedule>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.Page,
                PageSize = filter.Size
            };
        }

        public async Task<VolunteerCoordinator?> GetCoordinatorByIdAsync(int coordinatorId)
        {
            return await _context.VolunteerCoordinators
                .Include(c => c.User)
                .Include(c => c.Organization)
                .FirstOrDefaultAsync(c => c.CoordinatorId == coordinatorId);
        }

        public async Task<CoordinatorScheduleStatsDto> GetScheduleStatsAsync(int organizationId)
        {
            var schedules = await _context.CoordinatorSchedules
                .Where(cs => cs.Coordinator!.OrganizationId == organizationId)
                .ToListAsync();

            var now = DateTime.UtcNow;
            var startOfWeek = now.AddDays(-(int)now.DayOfWeek);
            var startOfMonth = new DateTime(now.Year, now.Month, 1);

            var stats = new CoordinatorScheduleStatsDto
            {
                TotalSchedules = schedules.Count,
                ScheduledCount = schedules.Count(s => s.Status == "Scheduled"),
                InProgressCount = schedules.Count(s => s.Status == "In Progress"),
                CompletedCount = schedules.Count(s => s.Status == "Completed"),
                CancelledCount = schedules.Count(s => s.Status == "Cancelled"),
                TodaySchedules = schedules.Count(s => s.StartDateTime.Date == now.Date),
                ThisWeekSchedules = schedules.Count(s => s.StartDateTime >= startOfWeek && s.StartDateTime < startOfWeek.AddDays(7)),
                ThisMonthSchedules = schedules.Count(s => s.StartDateTime >= startOfMonth && s.StartDateTime < startOfMonth.AddMonths(1)),
                UpcomingSchedules = schedules.Count(s => s.StartDateTime > now && s.Status == "Scheduled"),
                OverdueSchedules = schedules.Count(s => s.EndDateTime < now && s.Status != "Completed" && s.Status != "Cancelled"),

                SchedulesByType = schedules
                    .GroupBy(s => s.ScheduleType ?? "Unknown")
                    .ToDictionary(g => g.Key, g => g.Count()),

                SchedulesByPriority = schedules
                    .GroupBy(s => s.Priority ?? "Medium")
                    .ToDictionary(g => g.Key, g => g.Count()),

                TopCoordinators = await GetTopCoordinatorsAsync(organizationId, 5)
            };

            return stats;
        }
    }
}
