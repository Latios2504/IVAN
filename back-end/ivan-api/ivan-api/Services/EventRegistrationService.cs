using ivan_api.DTOs;
using ivan_api.DTOs.Authentication;
using ivan_api.DTOs.Common;
using ivan_api.Models;
using ivan_api.Services.EmailSer;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services
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
                        Message = "Tình nguyện viên không tồn tại",
                        Errors = new List<string> { "Volunteer profile not found" }
                    };
                }

                var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.EventId == eventId && e.IsActive.GetValueOrDefault());
                if (eventEntity == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Sự kiện không tồn tại hoặc không hoạt động",
                        Errors = new List<string> { "Event not found" }
                    };
                }

                if (DateTime.UtcNow < eventEntity.RegistrationStartDate || DateTime.UtcNow > eventEntity.RegistrationEndDate)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Thời gian đăng ký đã đóng",
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
                        Message = "Bạn đã đăng ký sự kiện này",
                        Errors = new List<string> { "Duplicate registration" }
                    };
                }

                var status = await _context.RegistrationStatuses.FirstOrDefaultAsync(s => s.StatusName == "Đang chờ duyệt");
                if (status == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Không tìm thấy trạng thái đăng ký",
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
                        $"Một tình nguyện viên mới đã đăng ký tham gia sự kiện: {eventEntity.EventName}. Vui lòng kiểm tra và duyệt.");
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
                    Message = "Đăng ký thành công",
                    Data = registrationDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi đăng ký",
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
                        Message = "Tình nguyện viên không tồn tại",
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
                        Message = "Đăng ký không tồn tại hoặc không thuộc về bạn",
                        Errors = new List<string> { "Registration not found" }
                    };
                }

                var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.EventId == eventId && e.IsActive.GetValueOrDefault());
                if (eventEntity == null || DateTime.UtcNow > eventEntity.RegistrationEndDate)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Thời gian đăng ký đã đóng",
                        Errors = new List<string> { "Registration period closed" }
                    };
                }

                if (registration.Status.StatusName != "Đang chờ duyệt")
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Không thể cập nhật đăng ký đã được duyệt hoặc từ chối",
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
                    Message = "Cập nhật đăng ký thành công",
                    Data = registrationDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi cập nhật đăng ký",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<SuccessResponseDTO>> CancelRegistrationAsync(int eventId, int registrationId, int userId)
        {
            try
            {
                var volunteer = await _context.VolunteerProfiles.FirstOrDefaultAsync(v => v.UserId == userId);
                if (volunteer == null)
                {
                    return new ApiResponseDTO<SuccessResponseDTO>
                    {
                        Success = false,
                        Message = "Tình nguyện viên không tồn tại",
                        Errors = new List<string> { "Volunteer profile not found" }
                    };
                }

                var registration = await _context.EventRegistrations
                    .Include(r => r.Status)
                    .FirstOrDefaultAsync(r => r.RegistrationId == registrationId && r.EventId == eventId && r.VolunteerId == volunteer.VolunteerId);
                if (registration == null)
                {
                    return new ApiResponseDTO<SuccessResponseDTO>
                    {
                        Success = false,
                        Message = "Đăng ký không tồn tại hoặc không thuộc về bạn",
                        Errors = new List<string> { "Registration not found" }
                    };
                }

                var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.EventId == eventId && e.IsActive.GetValueOrDefault());
                if (eventEntity == null || DateTime.UtcNow > eventEntity.RegistrationEndDate)
                {
                    return new ApiResponseDTO<SuccessResponseDTO>
                    {
                        Success = false,
                        Message = "Thời gian đăng ký đã đóng",
                        Errors = new List<string> { "Registration period closed" }
                    };
                }

                if (registration.Status.StatusName != "Đang chờ duyệt")
                {
                    return new ApiResponseDTO<SuccessResponseDTO>
                    {
                        Success = false,
                        Message = "Không thể hủy đăng ký đã được duyệt hoặc từ chối",
                        Errors = new List<string> { "Invalid registration status" }
                    };
                }

                var cancelledStatus = await _context.RegistrationStatuses.FirstOrDefaultAsync(s => s.StatusName == "Đã hủy");
                if (cancelledStatus == null)
                {
                    return new ApiResponseDTO<SuccessResponseDTO>
                    {
                        Success = false,
                        Message = "Không tìm thấy trạng thái hủy",
                        Errors = new List<string> { "Cancelled status not found" }
                    };
                }

                registration.StatusId = cancelledStatus.StatusId;
                registration.CancelledDate = DateTime.UtcNow;
                registration.CancellationReason = "Hủy bởi tình nguyện viên";
                registration.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return new ApiResponseDTO<SuccessResponseDTO>
                {
                    Success = true,
                    Message = "Hủy đăng ký thành công",
                    Data = new SuccessResponseDTO { Message = "Registration cancelled" }
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<SuccessResponseDTO>
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi hủy đăng ký",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<PagedResultDTO<RegistrationDTO>>> ListRegistrationsAsync(int eventId, int userId, string? status, int page, int size)
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
                    return new ApiResponseDTO<PagedResultDTO<RegistrationDTO>>
                    {
                        Success = false,
                        Message = "Không có quyền truy cập",
                        Errors = new List<string> { "User is not a coordinator or organization owner" }
                    };
                }

                var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.EventId == eventId && e.IsActive.GetValueOrDefault() && e.OrganizationId == organizationId);
                if (eventEntity == null)
                {
                    return new ApiResponseDTO<PagedResultDTO<RegistrationDTO>>
                    {
                        Success = false,
                        Message = "Sự kiện không tồn tại hoặc không thuộc tổ chức của bạn",
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

                var result = new PagedResultDTO<RegistrationDTO>
                {
                    Items = registrationDTOs,
                    Page = page,
                    Size = size,
                    TotalItems = totalItems,
                    TotalPages = (int)Math.Ceiling((double)totalItems / size)
                };

                return new ApiResponseDTO<PagedResultDTO<RegistrationDTO>>
            {
                Success = true,
                Message = "Lấy danh sách đăng ký thành công",
                Data = result
            };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<PagedResultDTO<RegistrationDTO>>
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi lấy danh sách đăng ký",
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
                        Message = "Không có quyền truy cập",
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
                        Message = "Đăng ký không tồn tại",
                        Errors = new List<string> { "Registration not found" }
                    };
                }

                var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.EventId == eventId && e.IsActive.GetValueOrDefault() && e.OrganizationId == organizationId);
                if (eventEntity == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Sự kiện không tồn tại hoặc không thuộc tổ chức của bạn",
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
                    Message = "Lấy chi tiết đăng ký thành công",
                    Data = registrationDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi lấy chi tiết đăng ký",
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
                        Message = "Không có quyền truy cập",
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
                        Message = "Đăng ký không tồn tại",
                        Errors = new List<string> { "Registration not found" }
                    };
                }

                var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.EventId == eventId && e.IsActive.GetValueOrDefault() && e.OrganizationId == organizationId);//true ,(false or null)
                if (eventEntity == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Sự kiện không tồn tại hoặc không thuộc tổ chức của bạn",
                        Errors = new List<string> { "Event not found" }
                    };
                }

                if (registration.Status.StatusName != "Đang chờ duyệt")
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Đăng ký không ở trạng thái chờ duyệt",
                        Errors = new List<string> { "Invalid registration status" }
                    };
                }

                var approvedStatus = await _context.RegistrationStatuses.FirstOrDefaultAsync(s => s.StatusName == "Đã duyệt");
                if (approvedStatus == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Không tìm thấy trạng thái duyệt",
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
                    $"Đăng ký của bạn cho sự kiện {eventEntity.EventName} đã được duyệt. Vui lòng chuẩn bị tham gia!");

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
                    Message = "Duyệt đăng ký thành công",
                    Data = registrationDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi duyệt đăng ký",
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
                        Message = "Không có quyền truy cập",
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
                        Message = "Đăng ký không tồn tại",
                        Errors = new List<string> { "Registration not found" }
                    };
                }

                var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.EventId == eventId && e.IsActive.GetValueOrDefault() && e.OrganizationId == organizationId);
                if (eventEntity == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Sự kiện không tồn tại hoặc không thuộc tổ chức của bạn",
                        Errors = new List<string> { "Event not found" }
                    };
                }

                if (registration.Status.StatusName != "Đang chờ duyệt")
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Đăng ký không ở trạng thái chờ duyệt",
                        Errors = new List<string> { "Invalid registration status" }
                    };
                }

                var rejectedStatus = await _context.RegistrationStatuses.FirstOrDefaultAsync(s => s.StatusName == "Đã từ chối");
                if (rejectedStatus == null)
                {
                    return new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Không tìm thấy trạng thái từ chối",
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
                    $"Đăng ký của bạn cho sự kiện {eventEntity.EventName} đã bị từ chối. Lý do: {request.Reason}");

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
                    Message = "Từ chối đăng ký thành công",
                    Data = registrationDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi từ chối đăng ký",
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
                        Message = "Tình nguyện viên không tồn tại",
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
                        Message = "Đăng ký không tồn tại hoặc không thuộc về bạn",
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
                    Message = "Lấy trạng thái đăng ký thành công",
                    Data = statusDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<RegistrationStatusDTO>
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi lấy trạng thái đăng ký",
                    Errors = new List<string> { ex.Message }
                };
            }
        }
    }
}
