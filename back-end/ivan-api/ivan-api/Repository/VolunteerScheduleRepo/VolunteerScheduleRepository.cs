using ivan_api.DTOs.VolunteerSchedule;
using ivan_api.DTOs.Common;
using ivan_api.Models;
using ivan_api.Constants;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Repository.VolunteerScheduleRepo
{
    public class VolunteerScheduleRepository : IVolunteerScheduleRepository
    {
        private readonly VolunteerManagementSystemContext _context;

        public VolunteerScheduleRepository(VolunteerManagementSystemContext context)
        {
            _context = context;
        }

        public async Task<VolunteerSchedule?> GetByIdAsync(int scheduleId)
        {
            return await _context.VolunteerSchedules
                .Include(vs => vs.Volunteer)
                    .ThenInclude(v => v.User)
                        .ThenInclude(u => u.UserProfiles)
                .Include(vs => vs.Event)
                .Include(vs => vs.CreatedByNavigation)
                    .ThenInclude(u => u.UserProfiles)
                .FirstOrDefaultAsync(vs => vs.ScheduleId == scheduleId);
        }

        public async Task<PagedResultDto<VolunteerSchedule>> GetPagedAsync(VolunteerScheduleFilterDTO filter, int? organizationId = null)
        {
            var query = _context.VolunteerSchedules
                .Include(vs => vs.Volunteer)
                    .ThenInclude(v => v.User)
                        .ThenInclude(u => u.UserProfiles)
                .Include(vs => vs.Event)
                .Include(vs => vs.CreatedByNavigation)
                    .ThenInclude(u => u.UserProfiles)
                .AsQueryable();

            // Apply organization filter if provided
            if (organizationId.HasValue)
            {
                query = query.Where(vs => vs.Event != null && vs.Event.OrganizationId == organizationId.Value);
            }

            // Apply filters
            if (filter.VolunteerId.HasValue)
                query = query.Where(vs => vs.VolunteerId == filter.VolunteerId.Value);

            if (filter.EventId.HasValue)
                query = query.Where(vs => vs.EventId == filter.EventId.Value);

            if (filter.StartDateFrom.HasValue)
                query = query.Where(vs => vs.StartDateTime >= filter.StartDateFrom.Value);

            if (filter.StartDateTo.HasValue)
                query = query.Where(vs => vs.StartDateTime <= filter.StartDateTo.Value);

            if (filter.EndDateFrom.HasValue)
                query = query.Where(vs => vs.EndDateTime >= filter.EndDateFrom.Value);

            if (filter.EndDateTo.HasValue)
                query = query.Where(vs => vs.EndDateTime <= filter.EndDateTo.Value);

            if (!string.IsNullOrEmpty(filter.ScheduleType))
                query = query.Where(vs => vs.ScheduleType == filter.ScheduleType);

            if (!string.IsNullOrEmpty(filter.Priority))
                query = query.Where(vs => vs.Priority == filter.Priority);

            if (!string.IsNullOrEmpty(filter.Status))
                query = query.Where(vs => vs.Status == filter.Status);

            if (!string.IsNullOrEmpty(filter.Search))
            {
                var searchLower = filter.Search.ToLower();
                query = query.Where(vs => 
                    vs.Title.ToLower().Contains(searchLower) ||
                    (vs.Description != null && vs.Description.ToLower().Contains(searchLower)) ||
                    (vs.Volunteer.User.UserProfiles.Any(up =>
                        up.FirstName.ToLower().Contains(searchLower) ||
                        up.LastName.ToLower().Contains(searchLower))) ||
                    (vs.Event != null && vs.Event.EventName.ToLower().Contains(searchLower)));
            }

            // Apply sorting
            switch (filter.SortBy?.ToLower())
            {
                case "title":
                    query = filter.SortDirection?.ToLower() == "desc" 
                        ? query.OrderByDescending(vs => vs.Title)
                        : query.OrderBy(vs => vs.Title);
                    break;
                case "volunteer":
                    query = filter.SortDirection?.ToLower() == "desc" 
                        ? query.OrderByDescending(vs => vs.Volunteer.User.UserProfiles.FirstOrDefault()!.FirstName)
                        : query.OrderBy(vs => vs.Volunteer.User.UserProfiles.FirstOrDefault()!.FirstName);
                    break;
                case "status":
                    query = filter.SortDirection?.ToLower() == "desc" 
                        ? query.OrderByDescending(vs => vs.Status)
                        : query.OrderBy(vs => vs.Status);
                    break;
                case "enddate":
                case "enddatetime":
                    query = filter.SortDirection?.ToLower() == "desc" 
                        ? query.OrderByDescending(vs => vs.EndDateTime)
                        : query.OrderBy(vs => vs.EndDateTime);
                    break;
                default: // startdatetime
                    query = filter.SortDirection?.ToLower() == "desc" 
                        ? query.OrderByDescending(vs => vs.StartDateTime)
                        : query.OrderBy(vs => vs.StartDateTime);
                    break;
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((filter.Page - 1) * filter.Size)
                .Take(filter.Size)
                .ToListAsync();

            return new PagedResultDto<VolunteerSchedule>
            {
                Items = items,
                PageNumber = filter.Page,
                PageSize = filter.Size,
                TotalCount = totalCount
            };
        }

        public async Task<List<VolunteerSchedule>> GetByVolunteerIdAsync(int volunteerId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.VolunteerSchedules
                .Include(vs => vs.Event)
                .Where(vs => vs.VolunteerId == volunteerId);

            if (startDate.HasValue)
                query = query.Where(vs => vs.StartDateTime >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(vs => vs.EndDateTime <= endDate.Value);

            return await query
                .OrderBy(vs => vs.StartDateTime)
                .ToListAsync();
        }

        public async Task<List<VolunteerSchedule>> GetByEventIdAsync(int eventId)
        {
            return await _context.VolunteerSchedules
                .Include(vs => vs.Volunteer)
                    .ThenInclude(v => v.User)
                        .ThenInclude(u => u.UserProfiles)
                .Where(vs => vs.EventId == eventId)
                .OrderBy(vs => vs.StartDateTime)
                .ToListAsync();
        }

        public async Task<VolunteerSchedule> CreateAsync(VolunteerSchedule schedule)
        {
            schedule.CreatedAt = DateTime.UtcNow;
            schedule.UpdatedAt = DateTime.UtcNow;

            _context.VolunteerSchedules.Add(schedule);
            await _context.SaveChangesAsync();
            return schedule;
        }

        public async Task<VolunteerSchedule> UpdateAsync(VolunteerSchedule schedule)
        {
            schedule.UpdatedAt = DateTime.UtcNow;
            _context.VolunteerSchedules.Update(schedule);
            await _context.SaveChangesAsync();
            return schedule;
        }

        public async Task<bool> DeleteAsync(int scheduleId)
        {
            var schedule = await _context.VolunteerSchedules.FindAsync(scheduleId);
            if (schedule == null)
                return false;

            _context.VolunteerSchedules.Remove(schedule);
            return await _context.SaveChangesAsync() > 0;
        }



        public async Task<List<VolunteerSchedule>> GetVolunteerSchedulesForDateAsync(int volunteerId, DateTime date)
        {
            var startOfDay = date.Date;
            var endOfDay = startOfDay.AddDays(1);

            return await _context.VolunteerSchedules
                .Include(vs => vs.Event)
                .Where(vs => vs.VolunteerId == volunteerId &&
                           vs.StartDateTime < endOfDay &&
                           vs.EndDateTime >= startOfDay)
                .OrderBy(vs => vs.StartDateTime)
                .ToListAsync();
        }

        public async Task<List<VolunteerSchedule>> GetVolunteerSchedulesInRangeAsync(int volunteerId, DateTime startDate, DateTime endDate)
        {
            return await _context.VolunteerSchedules
                .Include(vs => vs.Event)
                .Where(vs => vs.VolunteerId == volunteerId &&
                           vs.StartDateTime < endDate &&
                           vs.EndDateTime >= startDate)
                .OrderBy(vs => vs.StartDateTime)
                .ToListAsync();
        }

        public async Task<VolunteerScheduleStatsDTO> GetScheduleStatsAsync(int? organizationId = null, int? eventId = null, DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.VolunteerSchedules.AsQueryable();

            if (organizationId.HasValue)
                query = query.Where(vs => vs.Event != null && vs.Event.OrganizationId == organizationId.Value);

            if (eventId.HasValue)
                query = query.Where(vs => vs.EventId == eventId.Value);

            if (startDate.HasValue)
                query = query.Where(vs => vs.StartDateTime >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(vs => vs.EndDateTime <= endDate.Value);

            var schedules = await query.ToListAsync();
            var now = DateTime.UtcNow;
            var today = now.Date;
            var weekStart = today.AddDays(-(int)today.DayOfWeek);
            var monthStart = new DateTime(today.Year, today.Month, 1);

            return new VolunteerScheduleStatsDTO
            {
                TotalSchedules = schedules.Count,
                ScheduledCount = schedules.Count(s => s.Status == ScheduleConstants.Status.Scheduled),
                InProgressCount = schedules.Count(s => s.Status == ScheduleConstants.Status.InProgress),
                CompletedCount = schedules.Count(s => s.Status == ScheduleConstants.Status.Completed),
                CancelledCount = schedules.Count(s => s.Status == ScheduleConstants.Status.Cancelled),
                TodaySchedules = schedules.Count(s => s.StartDateTime.Date == today),
                ThisWeekSchedules = schedules.Count(s => s.StartDateTime.Date >= weekStart && s.StartDateTime.Date < weekStart.AddDays(7)),
                ThisMonthSchedules = schedules.Count(s => s.StartDateTime.Date >= monthStart && s.StartDateTime.Date < monthStart.AddMonths(1)),
                UpcomingSchedules = schedules.Count(s => s.StartDateTime > now && s.Status != ScheduleConstants.Status.Cancelled),
                OverdueSchedules = schedules.Count(s => s.EndDateTime < now && s.Status == ScheduleConstants.Status.Scheduled),
                SchedulesByType = schedules
                    .Where(s => !string.IsNullOrEmpty(s.ScheduleType))
                    .GroupBy(s => s.ScheduleType!)
                    .ToDictionary(g => g.Key, g => g.Count()),
                SchedulesByPriority = schedules
                    .Where(s => !string.IsNullOrEmpty(s.Priority))
                    .GroupBy(s => s.Priority!)
                    .ToDictionary(g => g.Key, g => g.Count())
            };
        }

        public async Task<List<VolunteerScheduleSummaryDTO>> GetTopVolunteersAsync(int? organizationId = null, int limit = 10)
        {
            var query = _context.VolunteerSchedules
                .Include(vs => vs.Volunteer)
                    .ThenInclude(v => v.User)
                        .ThenInclude(u => u.UserProfiles)
                .AsQueryable();

            if (organizationId.HasValue)
                query = query.Where(vs => vs.Event != null && vs.Event.OrganizationId == organizationId.Value);

            return await query
                .GroupBy(vs => new { vs.VolunteerId, FirstName = vs.Volunteer.User.UserProfiles.FirstOrDefault()!.FirstName, LastName = vs.Volunteer.User.UserProfiles.FirstOrDefault()!.LastName })
                .Select(g => new VolunteerScheduleSummaryDTO
                {
                    VolunteerId = g.Key.VolunteerId,
                    VolunteerName = $"{g.Key.FirstName} {g.Key.LastName}",
                    ScheduleCount = g.Count(),
                    CompletedCount = g.Count(s => s.Status == ScheduleConstants.Status.Completed),
                    CompletionRate = g.Count() > 0 ? (decimal)g.Count(s => s.Status == ScheduleConstants.Status.Completed) / g.Count() * 100 : 0
                })
                .OrderByDescending(s => s.ScheduleCount)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<PagedResultDto<VolunteerSchedule>> GetOrganizationVolunteerSchedulesAsync(int organizationId, VolunteerScheduleFilterDTO filter)
        {
            return await GetPagedAsync(filter, organizationId);
        }

        public async Task<List<VolunteerSchedule>> GetOrganizationEventSchedulesAsync(int organizationId, int eventId)
        {
            return await _context.VolunteerSchedules
                .Include(vs => vs.Volunteer)
                    .ThenInclude(v => v.User)
                        .ThenInclude(u => u.UserProfiles)
                .Include(vs => vs.Event)
                .Where(vs => vs.EventId == eventId && vs.Event != null && vs.Event.OrganizationId == organizationId)
                .OrderBy(vs => vs.StartDateTime)
                .ToListAsync();
        }

        public async Task<List<VolunteerSchedule>> CreateBulkAsync(List<VolunteerSchedule> schedules)
        {
            var now = DateTime.UtcNow;
            foreach (var schedule in schedules)
            {
                schedule.CreatedAt = now;
                schedule.UpdatedAt = now;
            }

            _context.VolunteerSchedules.AddRange(schedules);
            await _context.SaveChangesAsync();
            return schedules;
        }



        public async Task<bool> ExistsAsync(int scheduleId)
        {
            return await _context.VolunteerSchedules.AnyAsync(vs => vs.ScheduleId == scheduleId);
        }




    }
}
