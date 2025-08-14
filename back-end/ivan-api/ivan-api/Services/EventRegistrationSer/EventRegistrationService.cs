using AutoMapper;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.EventRegistration;
using ivan_api.Models;
using ivan_api.Repository.EventRegistrationRepo;

namespace ivan_api.Services.EventRegistrationSer
{
    public class EventRegistrationService : IEventRegistrationService
    {
        private readonly IEventRegistrationRepository _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<EventRegistrationService> _logger;
        
        public EventRegistrationService(
            IEventRegistrationRepository repository, 
            IMapper mapper, 
            ILogger<EventRegistrationService> logger)
        {
            _repository = repository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<RegistrationDTO> AddRegistrationAsync(int eventId, int userId, RegistrationRequestDTO request)
        {
            // Validate volunteer exists
            var volunteer = await _repository.GetVolunteerByUserIdAsync(userId);
            if (volunteer == null)
            {
                throw new InvalidOperationException("Volunteer profile not found");
            }

            // Validate event exists and is active
            var eventEntity = await _repository.GetEventWithOrganizationAsync(eventId);
            if (eventEntity == null)
            {
                throw new InvalidOperationException("Event not found or inactive");
            }

            // Check registration period
            if (DateTime.UtcNow < eventEntity.RegistrationStartDate || DateTime.UtcNow > eventEntity.RegistrationEndDate)
            {
                throw new InvalidOperationException("Registration period has ended");
            }

            // Check for duplicate registration
            var duplicateExists = await _repository.CheckDuplicateRegistrationAsync(eventId, volunteer.VolunteerId);
            if (duplicateExists)
            {
                throw new InvalidOperationException("Already registered for this event");
            }

            // Get pending status
            var pendingStatus = await _repository.GetRegistrationStatusAsync("Chờ duyệt");
            if (pendingStatus == null)
            {
                _logger.LogError("Registration status 'Chờ duyệt' not found");
                throw new InvalidOperationException("System error: Registration status not found");
            }

            // Create registration
            var registration = _mapper.Map<EventRegistration>(request);
            registration.EventId = eventId;
            registration.VolunteerId = volunteer.VolunteerId;
            registration.StatusId = pendingStatus.StatusId;
            registration.ApplicationDate = DateTime.UtcNow;
            registration.CreatedAt = DateTime.UtcNow;
            registration.UpdatedAt = DateTime.UtcNow;

            var success = await _repository.CreateRegistrationAsync(registration);
            if (!success)
            {
                _logger.LogError("Failed to create registration for event {EventId} by user {UserId}", eventId, userId);
                throw new InvalidOperationException("Failed to create registration");
            }

            // Get the created registration for response
            var createdRegistration = await _repository.GetRegistrationByVolunteerAsync(eventId, volunteer.VolunteerId);
            var registrationDto = _mapper.Map<RegistrationDTO>(createdRegistration);

            return registrationDto;
        }

        public async Task<bool> UpdateRegistrationAsync(int eventId, int registrationId, int userId, RegistrationRequestDTO request)
        {
            // Get volunteer
            var volunteer = await _repository.GetVolunteerByUserIdAsync(userId);
            if (volunteer == null)
            {
                throw new InvalidOperationException("Volunteer profile not found");
            }

            // Get registration
            var registration = await _repository.GetRegistrationAsync(eventId, registrationId);
            if (registration == null || registration.VolunteerId != volunteer.VolunteerId)
            {
                throw new InvalidOperationException("Registration not found or access denied");
            }

            // Check if registration is still pending
            if (registration.Status?.StatusName != "Chờ duyệt")
            {
                throw new InvalidOperationException("Only pending registrations can be updated");
            }

            // Update registration
            registration.AdditionalInfo = request.AdditionalInfo;
            registration.MotivationLetter = request.MotivationLetter;
            registration.UpdatedAt = DateTime.UtcNow;

            var success = await _repository.UpdateRegistrationAsync(registration);
            if (!success)
            {
                throw new InvalidOperationException("Failed to update registration");
            }

            return true;
        }

        public async Task<bool> CancelRegistrationAsync(int eventId, int registrationId, int userId)
        {
            // Get volunteer
            var volunteer = await _repository.GetVolunteerByUserIdAsync(userId);
            if (volunteer == null)
            {
                throw new InvalidOperationException("Volunteer profile not found");
            }

            // Get registration
            var registration = await _repository.GetRegistrationAsync(eventId, registrationId);
            if (registration == null || registration.VolunteerId != volunteer.VolunteerId)
            {
                throw new InvalidOperationException("Registration not found or access denied");
            }

            // Check if registration can be cancelled
            if (registration.Status?.StatusName != "Chờ duyệt" && registration.Status?.StatusName != "Đã duyệt")
            {
                throw new InvalidOperationException("Only pending or approved registrations can be cancelled");
            }

            // Get cancelled status
            var cancelledStatus = await _repository.GetRegistrationStatusAsync("Đã hủy");
            if (cancelledStatus == null)
            {
                _logger.LogError("Registration status 'Đã hủy' not found");
                throw new InvalidOperationException("System error: Cancellation status not found");
            }

            // Update registration to cancelled (soft delete)
            registration.StatusId = cancelledStatus.StatusId;
            registration.CancelledDate = DateTime.UtcNow;
            registration.CancellationReason = "Cancelled by volunteer";
            registration.UpdatedAt = DateTime.UtcNow;

            var success = await _repository.UpdateRegistrationAsync(registration);
            if (!success)
            {
                throw new InvalidOperationException("Failed to cancel registration");
            }

            return true;
        }

        public async Task<PagedResultDto<RegistrationDTO>> ListRegistrationsAsync(int eventId, int userId, string? status, int page, int size)
        {
            // Determine organization ID based on user role
            var orgUser = await _repository.GetEventWithOrganizationAsync(eventId);
            if (orgUser?.Organization == null)
            {
                throw new InvalidOperationException("Event not found or has no organization");
            }
            
            int organizationId;
            
            if (orgUser.Organization.UserId == userId)
            {
                // User is the organization owner
                organizationId = orgUser.OrganizationId;
            }
            else
            {
                // Check if user is coordinator
                var isAuthorized = await _repository.IsVolunteerCoordinatorAuthorizedAsync(userId, eventId);
                if (!isAuthorized)
                {
                    throw new UnauthorizedAccessException("You don't have permission to view registrations for this event");
                }
                organizationId = orgUser.OrganizationId;
            }

            // Get registrations
            var result = await _repository.GetRegistrationsByEventAsync(eventId, organizationId, status, page, size);
            
            // Map to DTOs
            var registrationDtos = result.Items.Select(r => _mapper.Map<RegistrationDTO>(r)).ToList();
            
            var pagedResult = new PagedResultDto<RegistrationDTO>
            {
                Items = registrationDtos,
                TotalCount = result.TotalCount,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize
            };

            return pagedResult;
        }

        public async Task<RegistrationDTO?> GetRegistrationAsync(int eventId, int registrationId, int userId)
        {
            // Get registration
            var registration = await _repository.GetRegistrationAsync(eventId, registrationId);
            if (registration == null)
            {
                return null;
            }

            // Check authorization
            var isOrganizationUser = registration.Event?.Organization?.UserId == userId;
            var isAuthorizedCoordinator = await _repository.IsVolunteerCoordinatorAuthorizedAsync(userId, eventId);

            if (!isOrganizationUser && !isAuthorizedCoordinator)
            {
                throw new UnauthorizedAccessException("You don't have permission to view this registration");
            }

            var registrationDto = _mapper.Map<RegistrationDTO>(registration);
            return registrationDto;
        }

        public async Task<bool> ApproveRegistrationAsync(int eventId, int registrationId, int userId, ApproveRegistrationRequestDTO request)
        {
            // Get registration
            var registration = await _repository.GetRegistrationAsync(eventId, registrationId);
            if (registration == null)
            {
                throw new InvalidOperationException("Registration not found");
            }

            // Check authorization
            var isOrganizationUser = registration.Event?.Organization?.UserId == userId;
            var isAuthorizedCoordinator = await _repository.IsVolunteerCoordinatorAuthorizedAsync(userId, eventId);

            if (!isOrganizationUser && !isAuthorizedCoordinator)
            {
                throw new UnauthorizedAccessException("You don't have permission to approve this registration");
            }

            // Check if registration is pending
            if (registration.Status?.StatusName != "Chờ duyệt")
            {
                throw new InvalidOperationException("Only pending registrations can be approved");
            }

            // Get approved status
            var approvedStatus = await _repository.GetRegistrationStatusAsync("Đã duyệt");
            if (approvedStatus == null)
            {
                _logger.LogError("Registration status 'Đã duyệt' not found");
                throw new InvalidOperationException("System error: Approval status not found");
            }

            // Update registration
            registration.StatusId = approvedStatus.StatusId;
            registration.ApprovedDate = DateTime.UtcNow;
            registration.ApprovedBy = userId;
            registration.UpdatedAt = DateTime.UtcNow;

            var success = await _repository.UpdateRegistrationAsync(registration);
            if (!success)
            {
                throw new InvalidOperationException("Failed to approve registration");
            }

            return true;
        }

        public async Task<bool> RejectRegistrationAsync(int eventId, int registrationId, int userId, RejectRegistrationRequestDTO request)
        {
            // Get registration
            var registration = await _repository.GetRegistrationAsync(eventId, registrationId);
            if (registration == null)
            {
                throw new InvalidOperationException("Registration not found");
            }

            // Check authorization
            var isOrganizationUser = registration.Event?.Organization?.UserId == userId;
            var isAuthorizedCoordinator = await _repository.IsVolunteerCoordinatorAuthorizedAsync(userId, eventId);

            if (!isOrganizationUser && !isAuthorizedCoordinator)
            {
                throw new UnauthorizedAccessException("You don't have permission to reject this registration");
            }

            // Check if registration is pending
            if (registration.Status?.StatusName != "Chờ duyệt")
            {
                throw new InvalidOperationException("Only pending registrations can be rejected");
            }

            // Get rejected status
            var rejectedStatus = await _repository.GetRegistrationStatusAsync("Bị từ chối");
            if (rejectedStatus == null)
            {
                _logger.LogError("Registration status 'Bị từ chối' not found");
                throw new InvalidOperationException("System error: Rejection status not found");
            }

            // Update registration
            registration.StatusId = rejectedStatus.StatusId;
            registration.RejectedDate = DateTime.UtcNow;
            registration.RejectedBy = userId;
            registration.RejectionReason = request.Reason;
            registration.UpdatedAt = DateTime.UtcNow;

            var success = await _repository.UpdateRegistrationAsync(registration);
            if (!success)
            {
                throw new InvalidOperationException("Failed to reject registration");
            }

            return true;
        }

        public async Task<RegistrationStatusDTO?> GetRegistrationStatusAsync(int eventId, int registrationId, int userId)
        {
            // Get volunteer
            var volunteer = await _repository.GetVolunteerByUserIdAsync(userId);
            if (volunteer == null)
            {
                throw new InvalidOperationException("Volunteer profile not found");
            }

            // Get registration
            var registration = await _repository.GetRegistrationAsync(eventId, registrationId);
            if (registration == null || registration.VolunteerId != volunteer.VolunteerId)
            {
                return null;
            }

            var statusDto = _mapper.Map<RegistrationStatusDTO>(registration);
            return statusDto;
        }

        public async Task<PagedResultDto<RegistrationDTO>> GetVolunteerRegistrationsAsync(int volunteerId, string? status, int page, int size)
        {
            try
            {
                var registrations = await _repository.GetRegistrationsByVolunteerIdAsync(volunteerId, status, page, size);
                var totalCount = await _repository.CountRegistrationsByVolunteerIdAsync(volunteerId, status);

                var registrationDtos = registrations.Select(r => _mapper.Map<RegistrationDTO>(r)).ToList();

                return new PagedResultDto<RegistrationDTO>
                {
                    Items = registrationDtos,
                    TotalCount = totalCount,
                    PageNumber = page,
                    PageSize = size
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting registrations for volunteer {VolunteerId}", volunteerId);
                throw;
            }
        }
    }
}
