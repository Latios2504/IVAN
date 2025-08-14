using ivan_api.DTOs.Authentication;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.EventRegistration;
using ivan_api.Models;
using ivan_api.Services.EmailSer;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services.EventRegistrationSer
{
    public class EventRegistrationService : IEventRegistrationService
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly IEmailService _emailService;
        
        public EventRegistrationService(VolunteerManagementSystemContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<ApiResponseDTO<RegistrationDTO>> AddRegistrationAsync(int eventId, int userId, RegistrationRequestDTO request)
        {
            try
            {
                var volunteer = await _context.VolunteerProfiles.FirstOrDefaultAsync(v => v.UserId == userId);
                if (volunteer == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "T�nh nguy?n vi�n kh�ng t?n t?i",
                        Errors = new List<string> { "Volunteer profile not found" }
                    };
                }

                var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.EventId == eventId && e.IsActive.GetValueOrDefault());
                if (eventEntity == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "S? ki?n kh�ng t?n t?i ho?c kh�ng ho?t d?ng",
                        Errors = new List<string> { "Event not found" }
                    };
                }

                if (DateTime.UtcNow < eventEntity.RegistrationStartDate || DateTime.UtcNow > eventEntity.RegistrationEndDate)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Th?i gian dang k� d� d�ng",
                        Errors = new List<string> { "Registration period closed" }
                    };
                }

                var existingRegistration = await _context.EventRegistrations
                    .FirstOrDefaultAsync(r => r.EventId == eventId && r.VolunteerId == volunteer.VolunteerId);
                if (existingRegistration != null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "B?n d� dang k� s? ki?n n�y",
                        Errors = new List<string> { "Duplicate registration" }
                    };
                }

                var status = await _context.RegistrationStatuses.FirstOrDefaultAsync(s => s.StatusName == "�ang ch? duy?t");
                if (status == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Kh�ng t�m th?y tr?ng th�i dang k�",
                        Errors = new List<string> { "Registration status not found" }
                    };
                }

                var registration = new EventRegistration
                {
                    EventId = eventId,
                    VolunteerId = volunteer.VolunteerId,
                    StatusId = status.StatusId,
                    ApplicationDate = DateTime.UtcNow,
                    AdditionalInfo = request.AdditionalInfo,
                    MotivationLetter = request.MotivationLetter
                };

                _context.EventRegistrations.Add(registration);
                await _context.SaveChangesAsync();

                var coordinator = await _context.VolunteerCoordinators
                    .Include(c => c.User)
                    .FirstOrDefaultAsync(c => c.OrganizationId == eventEntity.OrganizationId);
                if (coordinator?.User?.Email != null)
                {
                    await _emailService.SendEventNotificationAsync(
                        coordinator.User.Email,
                        eventEntity.EventName,
                        $"M?t t�nh nguy?n vi�n m?i d� dang k� tham gia s? ki?n: {eventEntity.EventName}. Vui l�ng ki?m tra v� duy?t.");
                }

                var registrationDto = new RegistrationDTO
                {
                    RegistrationId = registration.RegistrationId,
                    EventId = registration.EventId,
                    VolunteerId = registration.VolunteerId,
                    StatusName = status.StatusName,
                    ApplicationDate = registration.ApplicationDate
                };

                return new ApiResponseDTO<RegistrationDTO>
                {
                    Success = true,
                    Message = "�ang k� th�nh c�ng",
                    Data = registrationDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "�� x?y ra l?i khi dang k�",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<RegistrationDTO>> UpdateRegistrationAsync(int eventId, int registrationId, int userId, RegistrationRequestDTO request)
        {
            try
            {
                var volunteer = await _context.VolunteerProfiles.FirstOrDefaultAsync(v => v.UserId == userId);
                if (volunteer == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "T�nh nguy?n vi�n kh�ng t?n t?i",
                        Errors = new List<string> { "Volunteer profile not found" }
                    };
                }

                var registration = await _context.EventRegistrations
                    .Include(r => r.Status)
                    .FirstOrDefaultAsync(r => r.RegistrationId == registrationId && r.EventId == eventId && r.VolunteerId == volunteer.VolunteerId);
                if (registration == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "�ang k� kh�ng t?n t?i ho?c kh�ng thu?c v? b?n",
                        Errors = new List<string> { "Registration not found" }
                    };
                }

                var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.EventId == eventId && e.IsActive.GetValueOrDefault());
                if (eventEntity == null || DateTime.UtcNow > eventEntity.RegistrationEndDate)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Th?i gian dang k� d� d�ng",
                        Errors = new List<string> { "Registration period closed" }
                    };
                }

                if (registration.Status.StatusName != "�ang ch? duy?t")
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Kh�ng th? c?p nh?t dang k� d� du?c duy?t ho?c t? ch?i",
                        Errors = new List<string> { "Invalid registration status" }
                    };
                }

                registration.AdditionalInfo = request.AdditionalInfo;
                registration.MotivationLetter = request.MotivationLetter;
                registration.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var registrationDto = new RegistrationDTO
                {
                    RegistrationId = registration.RegistrationId,
                    EventId = registration.EventId,
                    VolunteerId = registration.VolunteerId,
                    StatusName = registration.Status.StatusName,
                    ApplicationDate = registration.ApplicationDate
                };

                return new ApiResponseDTO<RegistrationDTO>
                {
                    Success = true,
                    Message = "C?p nh?t dang k� th�nh c�ng",
                    Data = registrationDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "�� x?y ra l?i khi c?p nh?t dang k�",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<object>> CancelRegistrationAsync(int eventId, int registrationId, int userId)
        {
            try
            {
                var volunteer = await _context.VolunteerProfiles.FirstOrDefaultAsync(v => v.UserId == userId);
                if (volunteer == null)
                {
                    return new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "T�nh nguy?n vi�n kh�ng t?n t?i",
                        Errors = new List<string> { "Volunteer profile not found" }
                    };
                }

                var registration = await _context.EventRegistrations
                    .Include(r => r.Status)
                    .FirstOrDefaultAsync(r => r.RegistrationId == registrationId && r.EventId == eventId && r.VolunteerId == volunteer.VolunteerId);
                if (registration == null)
                {
                    return new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "�ang k� kh�ng t?n t?i ho?c kh�ng thu?c v? b?n",
                        Errors = new List<string> { "Registration not found" }
                    };
                }

                var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.EventId == eventId && e.IsActive.GetValueOrDefault());
                if (eventEntity == null || DateTime.UtcNow > eventEntity.RegistrationEndDate)
                {
                    return new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Th?i gian dang k� d� d�ng",
                        Errors = new List<string> { "Registration period closed" }
                    };
                }

                if (registration.Status.StatusName != "�ang ch? duy?t")
                {
                    return new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Kh�ng th? h?y dang k� d� du?c duy?t ho?c t? ch?i",
                        Errors = new List<string> { "Invalid registration status" }
                    };
                }

                var cancelledStatus = await _context.RegistrationStatuses.FirstOrDefaultAsync(s => s.StatusName == "�� h?y");
                if (cancelledStatus == null)
                {
                    return new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Kh�ng t�m th?y tr?ng th�i h?y",
                        Errors = new List<string> { "Cancelled status not found" }
                    };
                }

                registration.StatusId = cancelledStatus.StatusId;
                registration.CancelledDate = DateTime.UtcNow;
                registration.CancellationReason = "H?y b?i t�nh nguy?n vi�n";
                registration.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "H?y dang k� th�nh c�ng",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "�� x?y ra l?i khi h?y dang k�",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<PagedResultDto<RegistrationDTO>>> ListRegistrationsAsync(int eventId, int userId, string? status, int page, int size)
        {
            try
            {
                // Check if user is a coordinator
                var coordinator = await _context.VolunteerCoordinators.FirstOrDefaultAsync(c => c.UserId == userId);
                
                // Check if user is an organization
                var organization = await _context.Organizations.FirstOrDefaultAsync(o => o.UserId == userId);
                
                int? organizationId = null;
                if (coordinator != null)
                {
                    organizationId = coordinator.OrganizationId;
                }
                else if (organization != null)
                {
                    organizationId = organization.OrganizationId;
                }
                else
                {
                    return new ApiResponseDTO<PagedResultDto<RegistrationDTO>>
                    {
                        Success = false,
                        Message = "Kh�ng c� quy?n truy c?p",
                        Errors = new List<string> { "User is not a coordinator or organization owner" }
                    };
                }

                var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.EventId == eventId && e.IsActive.GetValueOrDefault() && e.OrganizationId == organizationId);
                if (eventEntity == null)
                {
                    return new ApiResponseDTO<PagedResultDto<RegistrationDTO>>
                    {
                        Success = false,
                        Message = "S? ki?n kh�ng t?n t?i ho?c kh�ng thu?c t? ch?c c?a b?n",
                        Errors = new List<string> { "Event not found" }
                    };
                }

                var query = _context.EventRegistrations
                    .Include(r => r.Status)
                    .Include(r => r.Volunteer)
                        .ThenInclude(v => v.User)
                        .ThenInclude(u => u.UserProfiles)
                    .Where(r => r.EventId == eventId);

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(r => r.Status.StatusName == status);
                }

                var totalItems = await query.CountAsync();
                var registrations = await query
                    .Skip((page - 1) * size)
                    .Take(size)
                    .ToListAsync();

                var registrationDTOs = registrations.Select(r => new RegistrationDTO
                {
                    RegistrationId = r.RegistrationId,
                    EventId = r.EventId,
                    VolunteerId = r.VolunteerId,
                    StatusName = r.Status?.StatusName ?? "Unknown",
                    ApplicationDate = r.ApplicationDate,
                    FullName = r.Volunteer?.User?.UserProfiles != null && r.Volunteer.User.UserProfiles.Any() 
                        ? r.Volunteer.User.UserProfiles.FirstOrDefault()?.FullName ?? "Unknown User"
                        : "Unknown User",
                    AdditionalInfo = r.AdditionalInfo,
                    MotivationLetter = r.MotivationLetter
                }).ToList();

                var result = new PagedResultDto<RegistrationDTO>
                {
                    Items = registrationDTOs,
                    TotalCount = totalItems,
                    PageNumber = page,
                    PageSize = size
                };

                return new ApiResponseDTO<PagedResultDto<RegistrationDTO>>
            {
                Success = true,
                Message = "L?y danh s�ch dang k� th�nh c�ng",
                Data = result
            };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<PagedResultDto<RegistrationDTO>>
                {
                    Success = false,
                    Message = "�� x?y ra l?i khi l?y danh s�ch dang k�",
                    Errors = new List<string> { 
                        ex.Message, 
                        ex.InnerException?.Message ?? "",
                        ex.StackTrace ?? ""
                    }.Where(e => !string.IsNullOrEmpty(e)).ToList()
                };
            }
        }

        public async Task<ApiResponseDTO<RegistrationDTO>> GetRegistrationAsync(int eventId, int registrationId, int userId)
        {
            try
            {
                // Check if user is a coordinator
                var coordinator = await _context.VolunteerCoordinators.FirstOrDefaultAsync(c => c.UserId == userId);
                
                // Check if user is an organization
                var organization = await _context.Organizations.FirstOrDefaultAsync(o => o.UserId == userId);
                
                int? organizationId = null;
                if (coordinator != null)
                {
                    organizationId = coordinator.OrganizationId;
                }
                else if (organization != null)
                {
                    organizationId = organization.OrganizationId;
                }
                else
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Kh�ng c� quy?n truy c?p",
                        Errors = new List<string> { "User is not a coordinator or organization owner" }
                    };
                }

                var registration = await _context.EventRegistrations
                    .Include(r => r.Status)
                    .Include(r => r.Volunteer)
                    .ThenInclude(v => v.User)
                    .ThenInclude(u => u.UserProfiles)
                    .FirstOrDefaultAsync(r => r.RegistrationId == registrationId && r.EventId == eventId);
                if (registration == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "�ang k� kh�ng t?n t?i",
                        Errors = new List<string> { "Registration not found" }
                    };
                }

                var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.EventId == eventId && e.IsActive.GetValueOrDefault() && e.OrganizationId == organizationId);
                if (eventEntity == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "S? ki?n kh�ng t?n t?i ho?c kh�ng thu?c t? ch?c c?a b?n",
                        Errors = new List<string> { "Event not found" }
                    };
                }

                var registrationDto = new RegistrationDTO
                {
                    RegistrationId = registration.RegistrationId,
                    EventId = registration.EventId,
                    VolunteerId = registration.VolunteerId,
                    StatusName = registration.Status?.StatusName ?? "Unknown",
                    ApplicationDate = registration.ApplicationDate,
                    FullName = registration.Volunteer?.User?.UserProfiles != null && registration.Volunteer.User.UserProfiles.Any()
                        ? registration.Volunteer.User.UserProfiles.FirstOrDefault()?.FullName ?? "Unknown User"
                        : "Unknown User",
                    AdditionalInfo = registration.AdditionalInfo,
                    MotivationLetter = registration.MotivationLetter
                };

                return new ApiResponseDTO<RegistrationDTO>
                {
                    Success = true,
                    Message = "L?y chi ti?t dang k� th�nh c�ng",
                    Data = registrationDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "�� x?y ra l?i khi l?y chi ti?t dang k�",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<RegistrationDTO>> ApproveRegistrationAsync(int eventId, int registrationId, int userId, ApproveRegistrationRequestDTO request)
        {
            try
            {
                // Check if user is a coordinator
                var coordinator = await _context.VolunteerCoordinators.FirstOrDefaultAsync(c => c.UserId == userId);
                
                // Check if user is an organization
                var organization = await _context.Organizations.FirstOrDefaultAsync(o => o.UserId == userId);
                
                int? organizationId = null;
                if (coordinator != null)
                {
                    organizationId = coordinator.OrganizationId;
                }
                else if (organization != null)
                {
                    organizationId = organization.OrganizationId;
                }
                else
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Kh�ng c� quy?n truy c?p",
                        Errors = new List<string> { "User is not a coordinator or organization owner" }
                    };
                }

                var registration = await _context.EventRegistrations
                    .Include(r => r.Status)
                    .Include(r => r.Volunteer)
                    .ThenInclude(v => v.User)
                    .FirstOrDefaultAsync(r => r.RegistrationId == registrationId && r.EventId == eventId);
                if (registration == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "�ang k� kh�ng t?n t?i",
                        Errors = new List<string> { "Registration not found" }
                    };
                }

                var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.EventId == eventId && e.IsActive.GetValueOrDefault() && e.OrganizationId == organizationId);//true ,(false or null)
                if (eventEntity == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "S? ki?n kh�ng t?n t?i ho?c kh�ng thu?c t? ch?c c?a b?n",
                        Errors = new List<string> { "Event not found" }
                    };
                }

                if (registration.Status.StatusName != "�ang ch? duy?t")
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "�ang k� kh�ng ? tr?ng th�i ch? duy?t",
                        Errors = new List<string> { "Invalid registration status" }
                    };
                }

                var approvedStatus = await _context.RegistrationStatuses.FirstOrDefaultAsync(s => s.StatusName == "�� duy?t");
                if (approvedStatus == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Kh�ng t�m th?y tr?ng th�i duy?t",
                        Errors = new List<string> { "Approved status not found" }
                    };
                }

                registration.StatusId = approvedStatus.StatusId;
                registration.ApprovedDate = DateTime.UtcNow;
                registration.ApprovedBy = userId;
                registration.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                await _emailService.SendEventNotificationAsync(
                    registration.Volunteer.User.Email,
                    eventEntity.EventName,
                    $"�ang k� c?a b?n cho s? ki?n {eventEntity.EventName} d� du?c duy?t. Vui l�ng chu?n b? tham gia!");

                var registrationDto = new RegistrationDTO
                {
                    RegistrationId = registration.RegistrationId,
                    EventId = registration.EventId,
                    VolunteerId = registration.VolunteerId,
                    StatusName = approvedStatus.StatusName,
                    ApplicationDate = registration.ApplicationDate
                };

                return new ApiResponseDTO<RegistrationDTO>
                {
                    Success = true,
                    Message = "Duy?t dang k� th�nh c�ng",
                    Data = registrationDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "�� x?y ra l?i khi duy?t dang k�",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<RegistrationDTO>> RejectRegistrationAsync(int eventId, int registrationId, int userId, RejectRegistrationRequestDTO request)
        {
            try
            {
                // Check if user is a coordinator
                var coordinator = await _context.VolunteerCoordinators.FirstOrDefaultAsync(c => c.UserId == userId);
                
                // Check if user is an organization
                var organization = await _context.Organizations.FirstOrDefaultAsync(o => o.UserId == userId);
                
                int? organizationId = null;
                if (coordinator != null)
                {
                    organizationId = coordinator.OrganizationId;
                }
                else if (organization != null)
                {
                    organizationId = organization.OrganizationId;
                }
                else
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Kh�ng c� quy?n truy c?p",
                        Errors = new List<string> { "User is not a coordinator or organization owner" }
                    };
                }

                var registration = await _context.EventRegistrations
                    .Include(r => r.Status)
                    .Include(r => r.Volunteer)
                    .ThenInclude(v => v.User)
                    .FirstOrDefaultAsync(r => r.RegistrationId == registrationId && r.EventId == eventId);
                if (registration == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "�ang k� kh�ng t?n t?i",
                        Errors = new List<string> { "Registration not found" }
                    };
                }

                var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.EventId == eventId && e.IsActive.GetValueOrDefault() && e.OrganizationId == organizationId);
                if (eventEntity == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "S? ki?n kh�ng t?n t?i ho?c kh�ng thu?c t? ch?c c?a b?n",
                        Errors = new List<string> { "Event not found" }
                    };
                }

                if (registration.Status.StatusName != "�ang ch? duy?t")
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "�ang k� kh�ng ? tr?ng th�i ch? duy?t",
                        Errors = new List<string> { "Invalid registration status" }
                    };
                }

                var rejectedStatus = await _context.RegistrationStatuses.FirstOrDefaultAsync(s => s.StatusName == "�� t? ch?i");
                if (rejectedStatus == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Kh�ng t�m th?y tr?ng th�i t? ch?i",
                        Errors = new List<string> { "Rejected status not found" }
                    };
                }

                registration.StatusId = rejectedStatus.StatusId;
                registration.RejectedDate = DateTime.UtcNow;
                registration.RejectedBy = userId;
                registration.RejectionReason = request.Reason;
                registration.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                await _emailService.SendEventNotificationAsync(
                    registration.Volunteer.User.Email,
                    eventEntity.EventName,
                    $"�ang k� c?a b?n cho s? ki?n {eventEntity.EventName} d� b? t? ch?i. L� do: {request.Reason}");

                var registrationDto = new RegistrationDTO
                {
                    RegistrationId = registration.RegistrationId,
                    EventId = registration.EventId,
                    VolunteerId = registration.VolunteerId,
                    StatusName = rejectedStatus.StatusName,
                    ApplicationDate = registration.ApplicationDate
                };

                return new ApiResponseDTO<RegistrationDTO>
                {
                    Success = true,
                    Message = "T? ch?i dang k� th�nh c�ng",
                    Data = registrationDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "�� x?y ra l?i khi t? ch?i dang k�",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<RegistrationStatusDTO>> GetRegistrationStatusAsync(int eventId, int registrationId, int userId)
        {
            try
            {
                var volunteer = await _context.VolunteerProfiles.FirstOrDefaultAsync(v => v.UserId == userId);
                if (volunteer == null)
                {
                    return new ApiResponseDTO<RegistrationStatusDTO>
                    {
                        Success = false,
                        Message = "T�nh nguy?n vi�n kh�ng t?n t?i",
                        Errors = new List<string> { "Volunteer profile not found" }
                    };
                }

                var registration = await _context.EventRegistrations
                    .Include(r => r.Status)
                    .FirstOrDefaultAsync(r => r.RegistrationId == registrationId && r.EventId == eventId && r.VolunteerId == volunteer.VolunteerId);
                if (registration == null)
                {
                    return new ApiResponseDTO<RegistrationStatusDTO>
                    {
                        Success = false,
                        Message = "�ang k� kh�ng t?n t?i ho?c kh�ng thu?c v? b?n",
                        Errors = new List<string> { "Registration not found" }
                    };
                }

                var statusDto = new RegistrationStatusDTO
                {
                    RegistrationId = registration.RegistrationId,
                    EventId = registration.EventId,
                    VolunteerId = registration.VolunteerId,
                    StatusName = registration.Status.StatusName,
                    StatusColor = registration.Status.Color
                };

                return new ApiResponseDTO<RegistrationStatusDTO>
                {
                    Success = true,
                    Message = "L?y tr?ng th�i dang k� th�nh c�ng",
                    Data = statusDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<RegistrationStatusDTO>
                {
                    Success = false,
                    Message = "�� x?y ra l?i khi l?y tr?ng th�i dang k�",
                    Errors = new List<string> { ex.Message }
                };
            }
        }
    }
}
