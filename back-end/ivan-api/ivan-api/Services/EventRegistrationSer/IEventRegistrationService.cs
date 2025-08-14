using ivan_api.DTOs.Authentication;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.EventRegistration;

namespace ivan_api.Services.EventRegistrationSer
{
    public interface IEventRegistrationService
    {
        Task<ApiResponseDTO<RegistrationDTO>> AddRegistrationAsync(int eventId, int userId, RegistrationRequestDTO request);
        Task<ApiResponseDTO<RegistrationDTO>> UpdateRegistrationAsync(int eventId, int registrationId, int userId, RegistrationRequestDTO request);
        Task<ApiResponseDTO<object>> CancelRegistrationAsync(int eventId, int registrationId, int userId);
        Task<ApiResponseDTO<PagedResultDto<RegistrationDTO>>> ListRegistrationsAsync(int eventId, int userId, string? status, int page, int size);
        Task<ApiResponseDTO<RegistrationDTO>> GetRegistrationAsync(int eventId, int registrationId, int userId);
        Task<ApiResponseDTO<RegistrationDTO>> ApproveRegistrationAsync(int eventId, int registrationId, int userId, ApproveRegistrationRequestDTO request);
        Task<ApiResponseDTO<RegistrationDTO>> RejectRegistrationAsync(int eventId, int registrationId, int userId, RejectRegistrationRequestDTO request);
        Task<ApiResponseDTO<RegistrationStatusDTO>> GetRegistrationStatusAsync(int eventId, int registrationId, int userId);
    }
}
