using AutoMapper;
using ivan_api.DTOs;
using ivan_api.DTOs.Authentication;
using ivan_api.DTOs.EventManage;
using ivan_api.DTOs.Common;
using ivan_api.Models;
using ivan_api.Repository.EventRepo;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services.EventServ
{
    public class EventService : IEventService
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly IEventRepository _repo;
        private readonly IMapper _mapper;
        private readonly ILogger<EventService> _logger;

        public EventService(
            VolunteerManagementSystemContext context, 
            IEventRepository repo, 
            IMapper mapper,
            ILogger<EventService> logger)
        {
            _repo = repo;
            _mapper = mapper;
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<EventDto>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return _mapper.Map<IEnumerable<EventDto>>(list);
        }

        public async Task<EventDto?> GetByIdAsync(int id)
        {
            var evt = await _repo.GetByIdAsync(id);
            return evt == null ? null : _mapper.Map<EventDto>(evt);
        }

        public async Task<int> CreateAsync(CreateEventDto dto)
        {
            var evt = _mapper.Map<Event>(dto);
            evt.CreatedAt = DateTime.UtcNow;
            evt.UpdatedAt = DateTime.UtcNow;
            evt.IsActive = true;
            await _repo.AddAsync(evt);
            return evt.EventId;
        }

        public async Task<bool> UpdateAsync(int id, UpdateEventDto dto)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return false;
            _mapper.Map(dto, existing);
            existing.UpdatedAt = DateTime.UtcNow;
            await _repo.UpdateAsync(existing);
            return true;
        }

        public async Task<ApiResponseDTO<EventDTO>> GetEventAsync(int eventId)
        {
            try
            {
                var eventEntity = await _context.Events
                    .Include(e => e.Category)
                    .Include(e => e.Status)
                    .FirstOrDefaultAsync(e => e.EventId == eventId && (e.IsActive == null || e.IsActive == true));

                if (eventEntity == null)
                {
                    return new ApiResponseDTO<EventDTO>
                    {
                        Success = false,
                        Message = "Sự kiện không tồn tại hoặc không hoạt động",
                        Errors = new List<string> { "Event not found" }
                    };
                }

                var eventDto = new EventDTO
                {
                    EventId = eventEntity.EventId,
                    EventName = eventEntity.EventName,
                    Description = eventEntity.Description ?? string.Empty,
                    ShortDescription = eventEntity.ShortDescription ?? string.Empty,
                    StartDate = eventEntity.StartDate,
                    EndDate = eventEntity.EndDate,
                    RegistrationStartDate = eventEntity.RegistrationStartDate,
                    RegistrationEndDate = eventEntity.RegistrationEndDate,
                    Location = eventEntity.Location ?? string.Empty,
                    CategoryName = eventEntity.Category?.CategoryName ?? string.Empty,
                    StatusName = eventEntity.Status?.StatusName ?? string.Empty
                };

                return new ApiResponseDTO<EventDTO>
                {
                    Success = true,
                    Message = "Lấy thông tin sự kiện thành công",
                    Data = eventDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<EventDTO>
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi lấy thông tin sự kiện",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        // Enhanced organization-specific methods
        public async Task<PagedResultDto<EventDto>> GetEventsByOrganizationAsync(
            int organizationId,
            EventFilterDto filters)
        {
            var query = _context.Events
                .Include(e => e.Category)
                .Include(e => e.Status)
                .Include(e => e.Organization)
                .Where(e => e.OrganizationId == organizationId && (e.IsActive == null || e.IsActive == true));

            // Apply filters
            if (!string.IsNullOrEmpty(filters.Search))
            {
                query = query.Where(e =>
                    e.EventName.Contains(filters.Search) ||
                    (e.Description != null && e.Description.Contains(filters.Search)));
            }

            if (filters.CategoryIds?.Any() == true)
            {
                query = query.Where(e => filters.CategoryIds.Contains(e.CategoryId));
            }

            if (filters.StatusIds?.Any() == true)
            {
                query = query.Where(e => filters.StatusIds.Contains(e.StatusId));
            }

            if (filters.StartDateFrom.HasValue)
            {
                query = query.Where(e => e.StartDate >= filters.StartDateFrom);
            }

            if (filters.StartDateTo.HasValue)
            {
                query = query.Where(e => e.StartDate <= filters.StartDateTo);
            }

            if (filters.EndDateFrom.HasValue)
            {
                query = query.Where(e => e.EndDate >= filters.EndDateFrom);
            }

            if (filters.EndDateTo.HasValue)
            {
                query = query.Where(e => e.EndDate <= filters.EndDateTo);
            }

            if (!string.IsNullOrEmpty(filters.Province))
            {
                query = query.Where(e => e.Province == filters.Province);
            }

            if (!string.IsNullOrEmpty(filters.District))
            {
                query = query.Where(e => e.District == filters.District);
            }

            if (filters.IsFeatured.HasValue)
            {
                query = query.Where(e => e.IsFeatured == filters.IsFeatured);
            }

            if (filters.IsUrgent.HasValue)
            {
                query = query.Where(e => e.IsUrgent == filters.IsUrgent);
            }

            if (filters.MinVolunteers.HasValue)
            {
                query = query.Where(e => e.MinVolunteers >= filters.MinVolunteers);
            }

            if (filters.MaxVolunteers.HasValue)
            {
                query = query.Where(e => e.MaxVolunteers <= filters.MaxVolunteers);
            }

            // Apply sorting
            query = filters.SortBy.ToLower() switch
            {
                "name" => filters.SortDirection.ToLower() == "desc"
                    ? query.OrderByDescending(e => e.EventName)
                    : query.OrderBy(e => e.EventName),
                "startdate" => filters.SortDirection.ToLower() == "desc"
                    ? query.OrderByDescending(e => e.StartDate)
                    : query.OrderBy(e => e.StartDate),
                "enddate" => filters.SortDirection.ToLower() == "desc"
                    ? query.OrderByDescending(e => e.EndDate)
                    : query.OrderBy(e => e.EndDate),
                "status" => filters.SortDirection.ToLower() == "desc"
                    ? query.OrderByDescending(e => e.Status.StatusName)
                    : query.OrderBy(e => e.Status.StatusName),
                "category" => filters.SortDirection.ToLower() == "desc"
                    ? query.OrderByDescending(e => e.Category.CategoryName)
                    : query.OrderBy(e => e.Category.CategoryName),
                _ => filters.SortDirection.ToLower() == "desc"
                    ? query.OrderByDescending(e => e.CreatedAt)
                    : query.OrderBy(e => e.CreatedAt)
            };

            var totalCount = await query.CountAsync();
            var events = await query
                .Skip((filters.Page - 1) * filters.Size)
                .Take(filters.Size)
                .ToListAsync();

            var eventDtos = _mapper.Map<List<EventDto>>(events);

            return new PagedResultDto<EventDto>
            {
                Items = eventDtos,
                TotalCount = totalCount,
                PageNumber = filters.Page,
                PageSize = filters.Size
            };
        }

        public async Task<EventStatsDto> GetEventStatsAsync(int organizationId)
        {
            var events = await _context.Events
                .Where(e => e.OrganizationId == organizationId && (e.IsActive == null || e.IsActive == true))
                .Include(e => e.Category)
                .Include(e => e.Status)
                .Include(e => e.EventRegistrations)
                .ToListAsync();

            var stats = new EventStatsDto
            {
                TotalEvents = events.Count,
                PlanningEvents = events.Count(e => e.Status.StatusName.ToLower() == "planning"),
                ActiveEvents = events.Count(e => e.Status.StatusName.ToLower() == "active"),
                InProgressEvents = events.Count(e => e.Status.StatusName.ToLower() == "in_progress"),
                CompletedEvents = events.Count(e => e.Status.StatusName.ToLower() == "completed"),
                CancelledEvents = events.Count(e => e.Status.StatusName.ToLower() == "cancelled"),
                TotalVolunteers = events.Sum(e => e.CurrentVolunteers ?? 0),
                TotalRegistrations = events.Sum(e => e.EventRegistrations.Count),
                AverageRating = events.Where(e => e.Rating.HasValue).Any() 
                    ? (decimal)events.Where(e => e.Rating.HasValue).Average(e => e.Rating!.Value) 
                    : 0,
                UpcomingEventsThisMonth = events.Count(e =>
                    e.StartDate.Month == DateTime.Now.Month &&
                    e.StartDate.Year == DateTime.Now.Year &&
                    e.StartDate > DateTime.Now),
            };

            stats.RegistrationRate = stats.TotalEvents > 0
                ? (decimal)stats.TotalRegistrations / stats.TotalEvents
                : 0;

            // Category breakdown
            stats.EventsByCategory = events
                .GroupBy(e => e.Category.CategoryName)
                .ToDictionary(g => g.Key, g => g.Count());

            // Monthly breakdown for current year
            stats.EventsByMonth = events
                .Where(e => e.CreatedAt?.Year == DateTime.Now.Year)
                .GroupBy(e => e.CreatedAt?.ToString("MMM"))
                .ToDictionary(g => g.Key ?? "Unknown", g => g.Count());

            return stats;
        }

        public async Task<bool> UpdateEventStatusAsync(
            int eventId,
            int statusId,
            int organizationId,
            string? reason = null)
        {
            var eventEntity = await _context.Events
                .FirstOrDefaultAsync(e => e.EventId == eventId && 
                                        e.OrganizationId == organizationId &&
                                        (e.IsActive == null || e.IsActive == true));

            if (eventEntity == null) return false;

            // Validate status transition
            var validTransitions = await GetAvailableStatusTransitionsAsync(eventId);
            if (!validTransitions.Contains(statusId))
            {
                _logger.LogWarning("Invalid status transition from {FromStatus} to {ToStatus} for event {EventId}",
                    eventEntity.StatusId, statusId, eventId);
                return false;
            }

            eventEntity.StatusId = statusId;
            eventEntity.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteEventAsync(int eventId, int organizationId)
        {
            var eventEntity = await _context.Events
                .FirstOrDefaultAsync(e => e.EventId == eventId && e.OrganizationId == organizationId);

            if (eventEntity == null) return false;

            // Soft delete by setting IsActive to false
            eventEntity.IsActive = false;
            eventEntity.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<EventDto?> GetEventForOrganizationAsync(int eventId, int organizationId)
        {
            var eventEntity = await _context.Events
                .Include(e => e.Category)
                .Include(e => e.Status)
                .Include(e => e.Organization)
                .FirstOrDefaultAsync(e => e.EventId == eventId && 
                                        e.OrganizationId == organizationId &&
                                        (e.IsActive == null || e.IsActive == true));

            return eventEntity == null ? null : _mapper.Map<EventDto>(eventEntity);
        }

        public async Task<IEnumerable<EventCategoryDto>> GetEventCategoriesAsync()
        {
            var categories = await _context.EventCategories
                .Where(c => c.IsActive == true)
                .ToListAsync();

            return _mapper.Map<IEnumerable<EventCategoryDto>>(categories);
        }

        public async Task<IEnumerable<EventStatusDto>> GetEventStatusesAsync()
        {
            var statuses = await _context.EventStatuses
                .Where(s => s.IsActive == true)
                .ToListAsync();

            return _mapper.Map<IEnumerable<EventStatusDto>>(statuses);
        }

        public async Task<bool> CanUpdateEventAsync(int eventId, int organizationId)
        {
            var eventEntity = await _context.Events
                .FirstOrDefaultAsync(e => e.EventId == eventId && 
                                        e.OrganizationId == organizationId &&
                                        (e.IsActive == null || e.IsActive == true));

            if (eventEntity == null) return false;

            // Can't update completed or cancelled events
            var status = await _context.EventStatuses
                .FirstOrDefaultAsync(s => s.StatusId == eventEntity.StatusId);

            return status?.StatusName.ToLower() != "completed" && 
                   status?.StatusName.ToLower() != "cancelled";
        }

        public async Task<bool> CanDeleteEventAsync(int eventId, int organizationId)
        {
            var eventEntity = await _context.Events
                .Include(e => e.Status)
                .FirstOrDefaultAsync(e => e.EventId == eventId && 
                                        e.OrganizationId == organizationId &&
                                        (e.IsActive == null || e.IsActive == true));

            if (eventEntity == null) return false;

            // Can only delete events in planning status or if they haven't started
            return eventEntity.Status.StatusName.ToLower() == "planning" || 
                   eventEntity.StartDate > DateTime.Now;
        }

        public async Task<List<int>> GetAvailableStatusTransitionsAsync(int eventId)
        {
            var eventEntity = await _context.Events
                .Include(e => e.Status)
                .FirstOrDefaultAsync(e => e.EventId == eventId);

            if (eventEntity == null) return new List<int>();

            // Define valid status transitions based on business rules
            var currentStatus = eventEntity.Status.StatusName.ToLower();
            var allStatuses = await _context.EventStatuses
                .Where(s => s.IsActive == true)
                .ToListAsync();

            return currentStatus switch
            {
                "planning" => allStatuses.Where(s =>
                    s.StatusName.ToLower() == "active" ||
                    s.StatusName.ToLower() == "cancelled")
                    .Select(s => s.StatusId).ToList(),

                "active" => allStatuses.Where(s =>
                    s.StatusName.ToLower() == "in_progress" ||
                    s.StatusName.ToLower() == "cancelled")
                    .Select(s => s.StatusId).ToList(),

                "in_progress" => allStatuses.Where(s =>
                    s.StatusName.ToLower() == "completed" ||
                    s.StatusName.ToLower() == "cancelled")
                    .Select(s => s.StatusId).ToList(),

                "completed" => new List<int>(), // No transitions from completed
                "cancelled" => new List<int>(), // No transitions from cancelled

                _ => new List<int>()
            };
        }

        public async Task<Dictionary<string, object>> GetEventAnalyticsAsync(
            int eventId,
            string timeframe)
        {
            var eventEntity = await _context.Events
                .Include(e => e.EventRegistrations)
                .Include(e => e.Feedbacks)
                .FirstOrDefaultAsync(e => e.EventId == eventId);

            if (eventEntity == null) return new Dictionary<string, object>();

            var analytics = new Dictionary<string, object>
            {
                ["totalRegistrations"] = eventEntity.EventRegistrations.Count,
                ["totalViews"] = eventEntity.ViewCount ?? 0,
                ["averageRating"] = eventEntity.Rating ?? 0,
                ["totalRatings"] = eventEntity.RatingCount ?? 0,
                ["feedbackCount"] = eventEntity.Feedbacks.Count
            };

            // Add timeframe-specific analytics
            var endDate = DateTime.Now;
            var startDate = timeframe.ToLower() switch
            {
                "day" => endDate.AddDays(-1),
                "week" => endDate.AddDays(-7),
                "month" => endDate.AddMonths(-1),
                _ => endDate.AddMonths(-1)
            };

            var recentRegistrations = eventEntity.EventRegistrations
                .Where(r => r.RegistrationDate >= startDate && r.RegistrationDate <= endDate)
                .ToList();

            analytics["recentRegistrations"] = recentRegistrations.Count;
            analytics["registrationTrend"] = recentRegistrations
                .GroupBy(r => r.RegistrationDate?.Date)
                .ToDictionary(g => g.Key?.ToString("yyyy-MM-dd") ?? "", g => g.Count());

            return analytics;
        }
    }
}
