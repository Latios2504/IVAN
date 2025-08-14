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
                Items = items,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = size
            };
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
                .FirstOrDefaultAsync(e => e.EventId == eventId && e.IsActive.GetValueOrDefault());
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
                .Where(c => c.UserId == userId && c.IsActive.GetValueOrDefault())
                .AnyAsync(c => c.Organization.Events.Any(e => e.EventId == eventId));
        }
    }
}
