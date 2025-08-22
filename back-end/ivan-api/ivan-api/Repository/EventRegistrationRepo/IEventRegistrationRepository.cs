using ivan_api.DTOs.Common;
using ivan_api.DTOs.EventRegistration;
using ivan_api.Models;

namespace ivan_api.Repository.EventRegistrationRepo
{
    public interface IEventRegistrationRepository
    {
        // Core CRUD operations
        Task<EventRegistration?> GetRegistrationAsync(int eventId, int registrationId);
        Task<EventRegistration?> GetRegistrationByVolunteerAsync(int eventId, int volunteerId);
        Task<PagedResultDto<EventRegistration>> GetRegistrationsByEventAsync(int eventId, int organizationId, string? status, int page, int size);
        Task<bool> CreateRegistrationAsync(EventRegistration registration);
        Task<bool> UpdateRegistrationAsync(EventRegistration registration);
        Task<bool> SaveChangesAsync();

        // Status and validation helpers
        Task<RegistrationStatus?> GetRegistrationStatusAsync(string statusName);
        Task<bool> CheckDuplicateRegistrationAsync(int eventId, int volunteerId);
        Task<Event?> GetEventWithOrganizationAsync(int eventId);
        Task<VolunteerProfile?> GetVolunteerByUserIdAsync(int userId);
        Task<bool> IsOrganizationEventAsync(int eventId, int organizationId);
        Task<bool> IsVolunteerCoordinatorAuthorizedAsync(int userId, int eventId);
        
        // Volunteer-specific methods
        Task<IEnumerable<EventRegistration>> GetRegistrationsByVolunteerIdAsync(int volunteerId, string? status, int page, int size);
        Task<int> CountRegistrationsByVolunteerIdAsync(int volunteerId, string? status);
        
        // Event statistics update methods
        Task<bool> UpdateEventStatisticsAsync(int eventId);
        Task<IEnumerable<EventRegistration>> GetAllEventRegistrationsAsync();
    }
}
