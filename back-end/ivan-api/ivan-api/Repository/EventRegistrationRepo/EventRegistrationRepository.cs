using ivan_api.DTOs.Common;
using ivan_api.DTOs.EventRegistration;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Repository.EventRegistrationRepo
{
    public class EventRegistrationRepository : IEventRegistrationRepository
    {
        private readonly VolunteerManagementSystemContext _context;

        public EventRegistrationRepository(VolunteerManagementSystemContext context)
        {
            _context = context;
        }

        public async Task<EventRegistration?> GetRegistrationAsync(int eventId, int registrationId)
        {
            return await _context.EventRegistrations
                .Include(r => r.Volunteer)
                    .ThenInclude(v => v.User)
                        .ThenInclude(u => u.UserProfiles)
                .Include(r => r.Status)
                .Include(r => r.Event)
                    .ThenInclude(e => e.Organization)
                .FirstOrDefaultAsync(r => r.EventId == eventId && r.RegistrationId == registrationId);
        }

        public async Task<EventRegistration?> GetRegistrationByVolunteerAsync(int eventId, int volunteerId)
        {
            return await _context.EventRegistrations
                .Include(r => r.Status)
                .FirstOrDefaultAsync(r => r.EventId == eventId && r.VolunteerId == volunteerId);
        }

        public async Task<PagedResultDto<EventRegistration>> GetRegistrationsByEventAsync(int eventId, int organizationId, string? status, int page, int size)
        {
            try
            {
                var query = _context.EventRegistrations
                    .Include(r => r.Volunteer)
                        .ThenInclude(v => v.User)
                            .ThenInclude(u => u.UserProfiles)
                    .Include(r => r.Status)
                    .Include(r => r.Event)
                    .Where(r => r.EventId == eventId && r.Event.OrganizationId == organizationId);

                // Filter by status if provided
                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(r => r.Status.StatusName == status);
                }

                var totalCount = await query.CountAsync();
                var items = await query
                    .OrderByDescending(r => r.ApplicationDate)
                    .Skip((page - 1) * size)
                    .Take(size)
                    .ToListAsync();

                return new PagedResultDto<EventRegistration>
                {
                    Items = items ?? new List<EventRegistration>(),
                    TotalCount = totalCount,
                    PageNumber = page,
                    PageSize = size
                };
            }
            catch (Exception)
            {
                // Log the error but don't rethrow - return empty result instead
                // You can inject ILogger if needed for proper logging
                return new PagedResultDto<EventRegistration>
                {
                    Items = new List<EventRegistration>(),
                    TotalCount = 0,
                    PageNumber = page,
                    PageSize = size
                };
            }
        }

        public async Task<bool> CreateRegistrationAsync(EventRegistration registration)
        {
            _context.EventRegistrations.Add(registration);
            return await SaveChangesAsync();
        }

        public async Task<bool> UpdateRegistrationAsync(EventRegistration registration)
        {
            _context.EventRegistrations.Update(registration);
            return await SaveChangesAsync();
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }

        public async Task<RegistrationStatus?> GetRegistrationStatusAsync(string statusName)
        {
            return await _context.RegistrationStatuses
                .FirstOrDefaultAsync(s => s.StatusName == statusName);
        }

        public async Task<bool> CheckDuplicateRegistrationAsync(int eventId, int volunteerId)
        {
            return await _context.EventRegistrations
                .AnyAsync(r => r.EventId == eventId && r.VolunteerId == volunteerId);
        }

        public async Task<Event?> GetEventWithOrganizationAsync(int eventId)
        {
            return await _context.Events
                .Include(e => e.Organization)
                .FirstOrDefaultAsync(e => e.EventId == eventId && (e.IsActive == null || e.IsActive == true));
        }

        public async Task<VolunteerProfile?> GetVolunteerByUserIdAsync(int userId)
        {
            return await _context.VolunteerProfiles
                .FirstOrDefaultAsync(v => v.UserId == userId);
        }

        public async Task<bool> IsOrganizationEventAsync(int eventId, int organizationId)
        {
            return await _context.Events
                .AnyAsync(e => e.EventId == eventId && e.OrganizationId == organizationId);
        }

        public async Task<bool> IsVolunteerCoordinatorAuthorizedAsync(int userId, int eventId)
        {
            return await _context.VolunteerCoordinators
                .Include(c => c.Organization)
                .Where(c => c.UserId == userId && (c.IsActive == null || c.IsActive == true))
                .AnyAsync(c => c.Organization.Events.Any(e => e.EventId == eventId));
        }

        public async Task<IEnumerable<EventRegistration>> GetRegistrationsByVolunteerIdAsync(int volunteerId, string? status, int page, int size)
        {
            var query = _context.EventRegistrations
                .Include(r => r.Event)
                    .ThenInclude(e => e.Organization)
                .Include(r => r.Status)
                .Include(r => r.Volunteer)
                    .ThenInclude(v => v.User)
                        .ThenInclude(u => u.UserProfiles)
                .Where(r => r.VolunteerId == volunteerId);

            // Filter by status if provided
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(r => r.Status.StatusName == status);
            }

            // Order by registration date (newest first)
            query = query.OrderByDescending(r => r.ApplicationDate);

            // Apply pagination
            return await query
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();
        }

        public async Task<int> CountRegistrationsByVolunteerIdAsync(int volunteerId, string? status)
        {
            var query = _context.EventRegistrations
                .Where(r => r.VolunteerId == volunteerId);

            // Filter by status if provided
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Include(r => r.Status)
                    .Where(r => r.Status.StatusName == status);
            }

            return await query.CountAsync();
        }
    }
}
