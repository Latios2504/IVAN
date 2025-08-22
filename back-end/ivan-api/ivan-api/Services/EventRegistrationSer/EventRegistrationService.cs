using AutoMapper;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.EventRegistration;
using ivan_api.Models;
using ivan_api.Repository.EventRegistrationRepo;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ivan_api.Services.EventRegistrationSer
{
    public class EventRegistrationService : IEventRegistrationService
    {
        private readonly IEventRegistrationRepository _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<EventRegistrationService> _logger;
        private readonly VolunteerManagementSystemContext _context;
        
        public EventRegistrationService(
            IEventRegistrationRepository repository, 
            IMapper mapper, 
            ILogger<EventRegistrationService> logger,
            VolunteerManagementSystemContext context)
        {
            _repository = repository;
            _mapper = mapper;
            _logger = logger;
            _context = context;
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

            // Check for duplicate registration - validate unique constraint (EventId, VolunteerProfileId)
            var duplicateExists = await _repository.CheckDuplicateRegistrationAsync(eventId, volunteer.VolunteerId);
            if (duplicateExists)
            {
                throw new InvalidOperationException("Already registered for this event. Duplicate registrations are not allowed.");
            }

            // Additional validation: Check database constraint directly
            var existingRegistration = await _context.EventRegistrations
                .FirstOrDefaultAsync(r => r.EventId == eventId && r.VolunteerId == volunteer.VolunteerId);
            if (existingRegistration != null)
            {
                throw new InvalidOperationException("Registration already exists for this volunteer and event");
            }

            // Get pending status
            var pendingStatus = await _repository.GetRegistrationStatusAsync("Pending");
            if (pendingStatus == null)
            {
                _logger.LogError("Registration status 'Pending' not found");
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

            // Update event statistics to reflect the new registration
            await _repository.UpdateEventStatisticsAsync(eventId);

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
            if (registration.Status?.StatusName != "Pending")
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
            if (registration.Status?.StatusName != "Pending" && registration.Status?.StatusName != "Approved")
            {
                throw new InvalidOperationException("Only pending or approved registrations can be cancelled");
            }

            // Get cancelled status
            var cancelledStatus = await _repository.GetRegistrationStatusAsync("Cancelled");
            if (cancelledStatus == null)
            {
                _logger.LogError("Registration status 'Cancelled' not found");
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

            // Update event statistics to reflect the cancelled registration
            await _repository.UpdateEventStatisticsAsync(registration.EventId);

            return true;
        }

        public async Task<PagedResultDto<RegistrationDTO>> ListRegistrationsAsync(int eventId, int userId, int? organizationId, string? status, int page, int size)
        {
            // Get the event with organization info
            var eventWithOrg = await _repository.GetEventWithOrganizationAsync(eventId);
            if (eventWithOrg?.Organization == null)
            {
                throw new InvalidOperationException("Event not found or has no organization");
            }
            
            bool isAuthorized = false;
            
            // Check if user is organization owner
            if (organizationId.HasValue && eventWithOrg.OrganizationId == organizationId.Value)
            {
                isAuthorized = true;
            }
            else if (eventWithOrg.Organization.UserId == userId)
            {
                // Fallback: Check if user is the organization owner directly
                isAuthorized = true;
            }
            else
            {
                // Check if user is coordinator for this event's organization
                var isCoordinatorAuthorized = await _repository.IsVolunteerCoordinatorAuthorizedAsync(userId, eventId);
                if (isCoordinatorAuthorized)
                {
                    isAuthorized = true;
                }
            }
            
            if (!isAuthorized)
            {
                throw new UnauthorizedAccessException("You don't have permission to view registrations for this event");
            }

            // Get registrations
            var result = await _repository.GetRegistrationsByEventAsync(eventId, eventWithOrg.OrganizationId, status, page, size);
            
            // Handle null result (defensive programming)
            if (result == null)
            {
                _logger.LogWarning("GetRegistrationsByEventAsync returned null for eventId {EventId}", eventId);
                return new PagedResultDto<RegistrationDTO>
                {
                    Items = new List<RegistrationDTO>(),
                    TotalCount = 0,
                    PageNumber = page,
                    PageSize = size
                };
            }
            
            // Map to DTOs - handle empty collections safely
            var registrationDtos = result.Items?.Select(r => _mapper.Map<RegistrationDTO>(r))?.ToList() ?? new List<RegistrationDTO>();
            
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
            if (registration.Status?.StatusName != "Pending")
            {
                throw new InvalidOperationException("Only pending registrations can be approved");
            }

            // Check event capacity before approving
            var eventEntity = await _repository.GetEventAsync(eventId);
            if (eventEntity == null)
            {
                throw new InvalidOperationException("Event not found");
            }

            // Count current approved registrations
            var currentApprovedCount = await _context.EventRegistrations
                .Include(r => r.Status)
                .CountAsync(r => r.EventId == eventId && r.Status.StatusName == "Approved");

            // Check if approving this registration would exceed capacity
            if (eventEntity.MaxVolunteers.HasValue && currentApprovedCount >= eventEntity.MaxVolunteers.Value)
            {
                throw new InvalidOperationException($"Cannot approve registration: Event has reached maximum capacity of {eventEntity.MaxVolunteers.Value} volunteers");
            }

            // Get approved status
            var approvedStatus = await _repository.GetRegistrationStatusAsync("Approved");
            if (approvedStatus == null)
            {
                _logger.LogError("Registration status 'Approved' not found");
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

            // Update event statistics to reflect the new approved registration
            await _repository.UpdateEventStatisticsAsync(eventId);

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
            if (registration.Status?.StatusName != "Pending")
            {
                throw new InvalidOperationException("Only pending registrations can be rejected");
            }

            // Get rejected status
            var rejectedStatus = await _repository.GetRegistrationStatusAsync("Rejected");
            if (rejectedStatus == null)
            {
                _logger.LogError("Registration status 'Rejected' not found");
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

            // Update event statistics to reflect the rejected registration
            await _repository.UpdateEventStatisticsAsync(eventId);

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

        public async Task<AttendanceDTO> CheckInAsync(int eventId, int registrationId, int userId, CheckInRequestDTO request)
        {
            // Get volunteer profile
            var volunteer = await _repository.GetVolunteerByUserIdAsync(userId);
            if (volunteer == null)
            {
                throw new InvalidOperationException("Volunteer profile not found");
            }

            // Get registration
            var registration = await _repository.GetRegistrationAsync(eventId, registrationId);
            if (registration == null)
            {
                throw new InvalidOperationException("Registration not found");
            }

            // Verify ownership
            if (registration.VolunteerId != volunteer.VolunteerId)
            {
                throw new UnauthorizedAccessException("Access denied: You can only check-in for your own registration");
            }

            // Check if registration is approved
            var approvedStatus = await _repository.GetRegistrationStatusByNameAsync("Approved");
            if (approvedStatus == null || registration.StatusId != approvedStatus.StatusId)
            {
                throw new InvalidOperationException("Only approved registrations can be checked in");
            }

            // Check if already checked in
            if (registration.CheckInTime.HasValue)
            {
                throw new InvalidOperationException("Already checked in");
            }

            // Get event to validate timing
            var eventEntity = await _repository.GetEventAsync(eventId);
            if (eventEntity == null)
            {
                throw new InvalidOperationException("Event not found");
            }

            // Check if event is ongoing or about to start (allow check-in 30 minutes before)
            var now = DateTime.UtcNow;
            var allowedCheckInTime = eventEntity.StartDate.AddMinutes(-30);
            if (now < allowedCheckInTime)
            {
                throw new InvalidOperationException("Check-in is not yet available for this event");
            }

            // Update registration with check-in info
            registration.CheckInTime = now;
            registration.AttendanceStatus = "Attended";
            registration.UpdatedAt = now;

            // Get attended status and update
            var attendedStatus = await _repository.GetRegistrationStatusByNameAsync("Attended");
            if (attendedStatus != null)
            {
                registration.StatusId = attendedStatus.StatusId;
            }

            var success = await _repository.UpdateRegistrationAsync(registration);
            if (!success)
            {
                throw new InvalidOperationException("Failed to check in");
            }

            _logger.LogInformation("Volunteer {VolunteerId} checked in for event {EventId} at {CheckInTime}", 
                volunteer.VolunteerId, eventId, now);

            return new AttendanceDTO
            {
                RegistrationId = registration.RegistrationId,
                EventId = registration.EventId,
                VolunteerId = registration.VolunteerId,
                VolunteerName = volunteer.User?.UserProfiles?.FirstOrDefault()?.FirstName + " " + volunteer.User?.UserProfiles?.FirstOrDefault()?.LastName ?? "Unknown",
                AttendanceStatus = registration.AttendanceStatus,
                CheckInTime = registration.CheckInTime,
                CheckOutTime = registration.CheckOutTime,
                ActualHours = registration.ActualHours,
                StatusName = attendedStatus?.StatusName ?? "Attended"
            };
        }

        public async Task<AttendanceDTO> CheckOutAsync(int eventId, int registrationId, int userId, CheckOutRequestDTO request)
        {
            // Get volunteer profile
            var volunteer = await _repository.GetVolunteerByUserIdAsync(userId);
            if (volunteer == null)
            {
                throw new InvalidOperationException("Volunteer profile not found");
            }

            // Get registration
            var registration = await _repository.GetRegistrationAsync(eventId, registrationId);
            if (registration == null)
            {
                throw new InvalidOperationException("Registration not found");
            }

            // Verify ownership
            if (registration.VolunteerId != volunteer.VolunteerId)
            {
                throw new UnauthorizedAccessException("Access denied: You can only check-out for your own registration");
            }

            // Check if checked in
            if (!registration.CheckInTime.HasValue)
            {
                throw new InvalidOperationException("Must check-in before checking out");
            }

            // Check if already checked out
            if (registration.CheckOutTime.HasValue)
            {
                throw new InvalidOperationException("Already checked out");
            }

            // Update registration with check-out info
            var now = DateTime.UtcNow;
            registration.CheckOutTime = now;
            registration.UpdatedAt = now;

            // Calculate actual hours
            var timeSpan = now - registration.CheckInTime.Value;
            registration.ActualHours = (decimal)timeSpan.TotalHours;

            // Update to completed status
            var completedStatus = await _repository.GetRegistrationStatusByNameAsync("Completed");
            if (completedStatus != null)
            {
                registration.StatusId = completedStatus.StatusId;
            }

            // Add feedback if provided
            if (!string.IsNullOrEmpty(request.Feedback))
            {
                registration.Review = request.Feedback;
            }

            var success = await _repository.UpdateRegistrationAsync(registration);
            if (!success)
            {
                throw new InvalidOperationException("Failed to check out");
            }

            // Update event statistics
            await _repository.UpdateEventStatisticsAsync(eventId);

            _logger.LogInformation("Volunteer {VolunteerId} checked out from event {EventId} at {CheckOutTime} with {ActualHours} hours", 
                volunteer.VolunteerId, eventId, now, registration.ActualHours);

            return new AttendanceDTO
            {
                RegistrationId = registration.RegistrationId,
                EventId = registration.EventId,
                VolunteerId = registration.VolunteerId,
                VolunteerName = volunteer.User?.UserProfiles?.FirstOrDefault()?.FirstName + " " + volunteer.User?.UserProfiles?.FirstOrDefault()?.LastName ?? "Unknown",
                AttendanceStatus = registration.AttendanceStatus,
                CheckInTime = registration.CheckInTime,
                CheckOutTime = registration.CheckOutTime,
                ActualHours = registration.ActualHours,
                StatusName = completedStatus?.StatusName ?? "Completed"
            };
        }
    }
}
