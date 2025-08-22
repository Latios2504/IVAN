using ivan_api.DTOs.Common;
using ivan_api.DTOs.EventRegistration;
using ivan_api.Models;

namespace ivan_api.Services.EventRegistrationSer
{
        public interface IEventRegistrationService
        {
                Task<RegistrationDTO> AddRegistrationAsync(int eventId, int userId, RegistrationRequestDTO request);

                Task<bool> UpdateRegistrationAsync(int eventId, int registrationId, int userId,
                        RegistrationRequestDTO request);

                Task<bool> CancelRegistrationAsync(int eventId, int registrationId, int userId);

                Task<PagedResultDto<RegistrationDTO>> ListRegistrationsAsync(int eventId, int userId,
                        int? organizationId, string? status, int page, int size);

                Task<RegistrationDTO?> GetRegistrationAsync(int eventId, int registrationId, int userId);

                Task<bool> ApproveRegistrationAsync(int eventId, int registrationId, int userId,
                        ApproveRegistrationRequestDTO request);

                Task<bool> RejectRegistrationAsync(int eventId, int registrationId, int userId,
                        RejectRegistrationRequestDTO request);

                Task<RegistrationStatusDTO?> GetRegistrationStatusAsync(int eventId, int registrationId, int userId);

                // New method for volunteers to get their own registrations
                Task<PagedResultDto<RegistrationDTO>> GetVolunteerRegistrationsAsync(int volunteerId, string? status,
                        int page, int size);

                // Check-in/Check-out methods
                Task<AttendanceDTO> CheckInAsync(int eventId, int registrationId, int userId,
                        CheckInRequestDTO request);

                Task<AttendanceDTO> CheckOutAsync(int eventId, int registrationId, int userId,
                        CheckOutRequestDTO request);

                Task<IEnumerable<EventRegistration>> GetAllVolunteerRegistration();
        }
}
