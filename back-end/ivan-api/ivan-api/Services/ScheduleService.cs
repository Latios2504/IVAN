using ivan_api.Constants;
using ivan_api.DTOs;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services
{
    public class ScheduleService : IScheduleService
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly IEmailService _emailService;
        public ScheduleService(VolunteerManagementSystemContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }
        public async Task<ApiResponseDTO<PagedResultDTO<ScheduleDTO>>> ListSchedulesAsync(int userId, int? coordinatorId, int? eventId, int page, int size)
        {
            try
            {
                var organization = await _context.Organizations.FirstOrDefaultAsync(o => o.UserId == userId);
                if (organization == null)
                {
                    return new ApiResponseDTO<PagedResultDTO<ScheduleDTO>>
                    {
                        Success = false,
                        Message = "Tổ chức không tồn tại",
                        Errors = new List<string> { "Organization not found" }
                    };
                }

                var query = _context.CoordinatorSchedules
                    .Include(s => s.Coordinator)
                    .ThenInclude(c => c.UserProfiles)
                    .Include(s => s.Event)
                    .Where(s => s.Coordinator.VolunteerCoordinatorUsers.Any(vc => vc.OrganizationId == organization.OrganizationId));

                if (coordinatorId.HasValue)
                {
                    query = query.Where(s => s.CoordinatorId == coordinatorId.Value);
                }

                if (eventId.HasValue)
                {
                    query = query.Where(s => s.EventId == eventId.Value);
                }

                var totalItems = await query.CountAsync();
                var schedules = await query
                    .Skip((page - 1) * size)
                    .Take(size)
                    .Select(s => new ScheduleDTO
                    {
                        ScheduleId = s.ScheduleId,
                        CoordinatorId = s.CoordinatorId,
                        CoordinatorName = s.Coordinator.UserProfiles.FirstOrDefault().FullName, // assuming UserProfiles has FullName, needs to be adjusted based on actual UserProfile properties
                        EventId = s.EventId,
                        EventName = s.Event != null ? s.Event.EventName : null,
                        Title = s.Title,
                        Description = s.Description,
                        StartDateTime = s.StartDateTime,
                        EndDateTime = s.EndDateTime,
                        Location = s.Location,
                        ScheduleType = s.ScheduleType,
                        Priority = s.Priority,
                        Status = s.Status,
                        IsAllDay = s.IsAllDay,
                        ReminderMinutes = s.ReminderMinutes,
                        Notes = s.Notes,
                        CreatedAt = s.CreatedAt,
                        UpdatedAt = s.UpdatedAt
                    })
                    .ToListAsync();

                var result = new PagedResultDTO<ScheduleDTO>
                {
                    Items = schedules,
                    Page = page,
                    Size = size,
                    TotalItems = totalItems,
                    TotalPages = (int)Math.Ceiling((double)totalItems / size)
                };

                return new ApiResponseDTO<PagedResultDTO<ScheduleDTO>>
                {
                    Success = true,
                    Message = "Lấy danh sách lịch trình thành công",
                    Data = result
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<PagedResultDTO<ScheduleDTO>>
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi lấy danh sách lịch trình",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<ScheduleDTO>> GetScheduleAsync(int userId, int scheduleId)
        {
            try
            {
                var organization = await _context.Organizations.FirstOrDefaultAsync(o => o.UserId == userId);
                if (organization == null)
                {
                    return new ApiResponseDTO<ScheduleDTO>
                    {
                        Success = false,
                        Message = "Tổ chức không tồn tại",
                        Errors = new List<string> { "Organization not found" }
                    };
                }

                var schedule = await _context.CoordinatorSchedules
                    .Include(s => s.Coordinator)
                    .ThenInclude(c => c.UserProfiles)
                    .Include(s => s.Event)
                    .FirstOrDefaultAsync(s => s.ScheduleId == scheduleId);
                if (schedule == null || !schedule.Coordinator.VolunteerCoordinatorUsers.Any(vc => vc.OrganizationId == organization.OrganizationId))
                {
                    return new ApiResponseDTO<ScheduleDTO>
                    {
                        Success = false,
                        Message = "Lịch trình không tồn tại hoặc không thuộc tổ chức của bạn",
                        Errors = new List<string> { "Schedule not found" }
                    };
                }

                var scheduleDto = new ScheduleDTO
                {
                    ScheduleId = schedule.ScheduleId,
                    CoordinatorId = schedule.CoordinatorId,
                    CoordinatorName = schedule.Coordinator.UserProfiles.FirstOrDefault().FullName,
                    EventId = schedule.EventId,
                    EventName = schedule.Event != null ? schedule.Event.EventName : null,
                    Title = schedule.Title,
                    Description = schedule.Description,
                    StartDateTime = schedule.StartDateTime,
                    EndDateTime = schedule.EndDateTime,
                    Location = schedule.Location,
                    ScheduleType = schedule.ScheduleType,
                    Priority = schedule.Priority,
                    Status = schedule.Status,
                    IsAllDay = schedule.IsAllDay,
                    ReminderMinutes = schedule.ReminderMinutes,
                    Notes = schedule.Notes,
                    CreatedAt = schedule.CreatedAt,
                    UpdatedAt = schedule.UpdatedAt
                };

                return new ApiResponseDTO<ScheduleDTO>
                {
                    Success = true,
                    Message = "Lấy chi tiết lịch trình thành công",
                    Data = scheduleDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<ScheduleDTO>
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi lấy chi tiết lịch trình",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<ScheduleDTO>> AddScheduleAsync(int userId, ScheduleRequestDTO request)
        {
            try
            {
                var organization = await _context.Organizations.FirstOrDefaultAsync(o => o.UserId == userId);
                if (organization == null)
                {
                    return new ApiResponseDTO<ScheduleDTO>
                    {
                        Success = false,
                        Message = "Tổ chức không tồn tại",
                        Errors = new List<string> { "Organization not found" }
                    };
                }

                var coordinator = await _context.Users
                    .Include(u => u.VolunteerCoordinatorUsers)
                    .FirstOrDefaultAsync(u => u.UserId == request.CoordinatorId && u.RoleId == AuthenticationConstants.RoleIds.VolunteerCoordinator);
                if (coordinator == null || !coordinator.VolunteerCoordinatorUsers.Any(vc => vc.OrganizationId == organization.OrganizationId))
                {
                    return new ApiResponseDTO<ScheduleDTO>
                    {
                        Success = false,
                        Message = "Điều phối viên không tồn tại hoặc không thuộc tổ chức của bạn",
                        Errors = new List<string> { "Coordinator not found" }
                    };
                }

                if (request.EventId.HasValue)
                {
                    var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.EventId == request.EventId.Value && e.IsActive == true); // assuming IsActive is a property to check if the event is active, need to adjust based on actual model
                    if (eventEntity == null || eventEntity.OrganizationId != organization.OrganizationId)
                    {
                        return new ApiResponseDTO<ScheduleDTO>
                        {
                            Success = false,
                            Message = "Sự kiện không tồn tại hoặc không thuộc tổ chức của bạn",
                            Errors = new List<string> { "Event not found" }
                        };
                    }

                    if (request.StartDateTime < eventEntity.StartDate || request.EndDateTime > eventEntity.EndDate)
                    {
                        return new ApiResponseDTO<ScheduleDTO>
                        {
                            Success = false,
                            Message = "Thời gian lịch trình phải nằm trong khoảng thời gian của sự kiện",
                            Errors = new List<string> { "Schedule outside event duration" }
                        };
                    }
                }

                if (string.IsNullOrEmpty(request.Title))
                {
                    return new ApiResponseDTO<ScheduleDTO>
                    {
                        Success = false,
                        Message = "Tiêu đề lịch trình là bắt buộc",
                        Errors = new List<string> { "Title is required" }
                    };
                }

                if (request.StartDateTime >= request.EndDateTime)
                {
                    return new ApiResponseDTO<ScheduleDTO>
                    {
                        Success = false,
                        Message = "Thời gian bắt đầu phải trước thời gian kết thúc",
                        Errors = new List<string> { "Invalid time range" }
                    };
                }

                var conflict = await _context.CoordinatorSchedules
                    .AnyAsync(s => s.CoordinatorId == request.CoordinatorId &&
                                   ((request.StartDateTime >= s.StartDateTime && request.StartDateTime <= s.EndDateTime) ||
                                    (request.EndDateTime >= s.StartDateTime && request.EndDateTime <= s.EndDateTime) ||
                                    (request.StartDateTime <= s.StartDateTime && request.EndDateTime >= s.EndDateTime)));
                if (conflict)
                {
                    return new ApiResponseDTO<ScheduleDTO>
                    {
                        Success = false,
                        Message = "Lịch trình bị trùng lặp với lịch hiện có",
                        Errors = new List<string> { "Schedule conflict" }
                    };
                }

                var schedule = new CoordinatorSchedule
                {
                    CoordinatorId = request.CoordinatorId,
                    EventId = request.EventId,
                    Title = request.Title,
                    Description = request.Description,
                    StartDateTime = request.StartDateTime,
                    EndDateTime = request.EndDateTime,
                    Location = request.Location,
                    ScheduleType = request.ScheduleType ?? "Event",
                    Priority = request.Priority,
                    Status = request.Status ?? "Scheduled",
                    IsAllDay = request.IsAllDay,
                    ReminderMinutes = request.ReminderMinutes,
                    Notes = request.Notes,
                    CreatedBy = userId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.CoordinatorSchedules.Add(schedule);
                await _context.SaveChangesAsync();

                var eventName = request.EventId.HasValue ? (await _context.Events.FindAsync(request.EventId.Value))?.EventName : null;
                await _emailService.SendEventNotificationAsync(
                    coordinator.Email,
                    eventName ?? request.Title,
                    $"Bạn đã được phân công lịch trình: {request.Title} từ {request.StartDateTime} đến {request.EndDateTime}. Vui lòng kiểm tra chi tiết.");

                var scheduleDto = new ScheduleDTO
                {
                    ScheduleId = schedule.ScheduleId,
                    CoordinatorId = schedule.CoordinatorId,
                    CoordinatorName = coordinator.UserProfiles.FirstOrDefault().FullName,
                    EventId = schedule.EventId,
                    EventName = eventName,
                    Title = schedule.Title,
                    Description = schedule.Description,
                    StartDateTime = schedule.StartDateTime,
                    EndDateTime = schedule.EndDateTime,
                    Location = schedule.Location,
                    ScheduleType = schedule.ScheduleType,
                    Priority = schedule.Priority,
                    Status = schedule.Status,
                    IsAllDay = schedule.IsAllDay,
                    ReminderMinutes = schedule.ReminderMinutes,
                    Notes = schedule.Notes,
                    CreatedAt = schedule.CreatedAt,
                    UpdatedAt = schedule.UpdatedAt
                };

                return new ApiResponseDTO<ScheduleDTO>
                {
                    Success = true,
                    Message = "Thêm lịch trình thành công",
                    Data = scheduleDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<ScheduleDTO>
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi thêm lịch trình",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<ScheduleDTO>> UpdateScheduleAsync(int userId, int scheduleId, ScheduleRequestDTO request)
        {
            try
            {
                var organization = await _context.Organizations.FirstOrDefaultAsync(o => o.UserId == userId);
                if (organization == null)
                {
                    return new ApiResponseDTO<ScheduleDTO>
                    {
                        Success = false,
                        Message = "Tổ chức không tồn tại",
                        Errors = new List<string> { "Organization not found" }
                    };
                }

                var schedule = await _context.CoordinatorSchedules
                    .Include(s => s.Coordinator)
                    .ThenInclude(c => c.UserProfiles)
                    .Include(s => s.Event)
                    .FirstOrDefaultAsync(s => s.ScheduleId == scheduleId);
                if (schedule == null || !schedule.Coordinator.VolunteerCoordinatorUsers.Any(vc => vc.OrganizationId == organization.OrganizationId))
                {
                    return new ApiResponseDTO<ScheduleDTO>
                    {
                        Success = false,
                        Message = "Lịch trình không tồn tại hoặc không thuộc tổ chức của bạn",
                        Errors = new List<string> { "Schedule not found" }
                    };
                }

                var coordinator = await _context.Users
                    .Include(u => u.VolunteerCoordinatorUsers)
                    .FirstOrDefaultAsync(u => u.UserId == request.CoordinatorId && u.RoleId == AuthenticationConstants.RoleIds.VolunteerCoordinator);
                if (coordinator == null || !coordinator.VolunteerCoordinatorUsers.Any(vc => vc.OrganizationId == organization.OrganizationId))
                {
                    return new ApiResponseDTO<ScheduleDTO>
                    {
                        Success = false,
                        Message = "Điều phối viên không tồn tại hoặc không thuộc tổ chức của bạn",
                        Errors = new List<string> { "Coordinator not found" }
                    };
                }

                if (request.EventId.HasValue)
                {
                    var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.EventId == request.EventId.Value && e.IsActive == true);
                    if (eventEntity == null || eventEntity.OrganizationId != organization.OrganizationId)
                    {
                        return new ApiResponseDTO<ScheduleDTO>
                        {
                            Success = false,
                            Message = "Sự kiện không tồn tại hoặc không thuộc tổ chức của bạn",
                            Errors = new List<string> { "Event not found" }
                        };
                    }

                    if (request.StartDateTime < eventEntity.StartDate || request.EndDateTime > eventEntity.EndDate)
                    {
                        return new ApiResponseDTO<ScheduleDTO>
                        {
                            Success = false,
                            Message = "Thời gian lịch trình phải nằm trong khoảng thời gian của sự kiện",
                            Errors = new List<string> { "Schedule outside event duration" }
                        };
                    }
                }

                if (string.IsNullOrEmpty(request.Title))
                {
                    return new ApiResponseDTO<ScheduleDTO>
                    {
                        Success = false,
                        Message = "Tiêu đề lịch trình là bắt buộc",
                        Errors = new List<string> { "Title is required" }
                    };
                }

                if (request.StartDateTime >= request.EndDateTime)
                {
                    return new ApiResponseDTO<ScheduleDTO>
                    {
                        Success = false,
                        Message = "Thời gian bắt đầu phải trước thời gian kết thúc",
                        Errors = new List<string> { "Invalid time range" }
                    };
                }

                var conflict = await _context.CoordinatorSchedules
                    .AnyAsync(s => s.CoordinatorId == request.CoordinatorId && s.ScheduleId != scheduleId &&
                                   ((request.StartDateTime >= s.StartDateTime && request.StartDateTime <= s.EndDateTime) ||
                                    (request.EndDateTime >= s.StartDateTime && request.EndDateTime <= s.EndDateTime) ||
                                    (request.StartDateTime <= s.StartDateTime && request.EndDateTime >= s.EndDateTime)));
                if (conflict)
                {
                    return new ApiResponseDTO<ScheduleDTO>
                    {
                        Success = false,
                        Message = "Lịch trình bị trùng lặp với lịch hiện có",
                        Errors = new List<string> { "Schedule conflict" }
                    };
                }

                schedule.CoordinatorId = request.CoordinatorId;
                schedule.EventId = request.EventId;
                schedule.Title = request.Title;
                schedule.Description = request.Description;
                schedule.StartDateTime = request.StartDateTime;
                schedule.EndDateTime = request.EndDateTime;
                schedule.Location = request.Location;
                schedule.ScheduleType = request.ScheduleType ?? "Event";
                schedule.Priority = request.Priority;
                schedule.Status = request.Status ?? "Scheduled";
                schedule.IsAllDay = request.IsAllDay;
                schedule.ReminderMinutes = request.ReminderMinutes;
                schedule.Notes = request.Notes;
                schedule.UpdatedAt = DateTime.UtcNow;
                schedule.CreatedBy = userId;

                await _context.SaveChangesAsync();

                var eventName = request.EventId.HasValue ? (await _context.Events.FindAsync(request.EventId.Value))?.EventName : null;
                await _emailService.SendEventNotificationAsync(
                    coordinator.Email,
                    eventName ?? request.Title,
                    $"Lịch trình của bạn: {request.Title} đã được cập nhật. Thời gian mới: {request.StartDateTime} đến {request.EndDateTime}. Vui lòng kiểm tra chi tiết.");

                var scheduleDto = new ScheduleDTO
                {
                    ScheduleId = schedule.ScheduleId,
                    CoordinatorId = schedule.CoordinatorId,
                    CoordinatorName = coordinator.UserProfiles.FirstOrDefault().FullName,
                    EventId = schedule.EventId,
                    EventName = eventName,
                    Title = schedule.Title,
                    Description = schedule.Description,
                    StartDateTime = schedule.StartDateTime,
                    EndDateTime = schedule.EndDateTime,
                    Location = schedule.Location,
                    ScheduleType = schedule.ScheduleType,
                    Priority = schedule.Priority,
                    Status = schedule.Status,
                    IsAllDay = schedule.IsAllDay,
                    ReminderMinutes = schedule.ReminderMinutes,
                    Notes = schedule.Notes,
                    CreatedAt = schedule.CreatedAt,
                    UpdatedAt = schedule.UpdatedAt
                };

                return new ApiResponseDTO<ScheduleDTO>
                {
                    Success = true,
                    Message = "Cập nhật lịch trình thành công",
                    Data = scheduleDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<ScheduleDTO>
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi cập nhật lịch trình",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<PagedResultDTO<ScheduleDTO>>> GetPersonalSchedulesAsync(int userId, int? eventId, DateTime? startDate, DateTime? endDate, int page, int size)
        {
            try
            {
                var coordinator = await _context.Users
                    .Include(u => u.VolunteerCoordinatorUsers)
                    .FirstOrDefaultAsync(u => u.UserId == userId && u.RoleId == AuthenticationConstants.RoleIds.VolunteerCoordinator);
                if (coordinator == null)
                {
                    return new ApiResponseDTO<PagedResultDTO<ScheduleDTO>>
                    {
                        Success = false,
                        Message = "Điều phối viên không tồn tại",
                        Errors = new List<string> { "Coordinator not found" }
                    };
                }

                var query = _context.CoordinatorSchedules
                    .Include(s => s.Event)
                    .Include(s => s.Coordinator)
                    .ThenInclude(c => c.UserProfiles)
                    .Where(s => s.CoordinatorId == userId);

                if (eventId.HasValue)
                {
                    query = query.Where(s => s.EventId == eventId.Value);
                }

                if (startDate.HasValue)
                {
                    query = query.Where(s => s.StartDateTime >= startDate.Value);
                }

                if (endDate.HasValue)
                {
                    query = query.Where(s => s.EndDateTime <= endDate.Value);
                }

                var totalItems = await query.CountAsync();
                var schedules = await query
                    .Skip((page - 1) * size)
                    .Take(size)
                    .Select(s => new ScheduleDTO
                    {
                        ScheduleId = s.ScheduleId,
                        CoordinatorId = s.CoordinatorId,
                        CoordinatorName = s.Coordinator.UserProfiles.FirstOrDefault().FullName,
                        EventId = s.EventId,
                        EventName = s.Event != null ? s.Event.EventName : null,
                        Title = s.Title,
                        Description = s.Description,
                        StartDateTime = s.StartDateTime,
                        EndDateTime = s.EndDateTime,
                        Location = s.Location,
                        ScheduleType = s.ScheduleType,
                        Priority = s.Priority,
                        Status = s.Status,
                        IsAllDay = s.IsAllDay,
                        ReminderMinutes = s.ReminderMinutes,
                        Notes = s.Notes,
                        CreatedAt = s.CreatedAt,
                        UpdatedAt = s.UpdatedAt
                    })
                    .ToListAsync();

                var result = new PagedResultDTO<ScheduleDTO>
                {
                    Items = schedules,
                    Page = page,
                    Size = size,
                    TotalItems = totalItems,
                    TotalPages = (int)Math.Ceiling((double)totalItems / size)
                };

                return new ApiResponseDTO<PagedResultDTO<ScheduleDTO>>
                {
                    Success = true,
                    Message = "Lấy danh sách lịch trình cá nhân thành công",
                    Data = result
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<PagedResultDTO<ScheduleDTO>>
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi lấy danh sách lịch trình cá nhân",
                    Errors = new List<string> { ex.Message }
                };
            }
        }
    }
}
