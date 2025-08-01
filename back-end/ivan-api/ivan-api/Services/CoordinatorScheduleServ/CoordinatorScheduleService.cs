using ivan_api.DTOs.CoordinatorSchedule;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.Authentication;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Services.CoordinatorScheduleServ
{
    public class CoordinatorScheduleService : ICoordinatorScheduleService
    {
        private readonly VolunteerManagementSystemContext _context;

        public CoordinatorScheduleService(VolunteerManagementSystemContext context)
        {
            _context = context;
        }

        public async Task<ApiResponseDTO<CoordinatorScheduleDto>> GetScheduleByIdAsync(int organizationId, int scheduleId)
        {
            try
            {
                var schedule = await _context.CoordinatorSchedules
                    .Include(s => s.Coordinator)
                        .ThenInclude(c => c.User)
                            .ThenInclude(u => u.UserProfiles)
                    .Include(s => s.Event)
                    .Include(s => s.CreatedByNavigation)
                        .ThenInclude(cb => cb.UserProfiles)
                    .Where(s => s.ScheduleId == scheduleId && s.Coordinator.OrganizationId == organizationId)
                    .FirstOrDefaultAsync();

                if (schedule == null)
                {
                    return new ApiResponseDTO<CoordinatorScheduleDto>
                    {
                        Success = false,
                        Message = "Schedule not found",
                        Errors = new List<string> { "The specified schedule does not exist or does not belong to your organization." }
                    };
                }

                var scheduleDto = MapToDto(schedule);

                return new ApiResponseDTO<CoordinatorScheduleDto>
                {
                    Success = true,
                    Message = "Schedule retrieved successfully",
                    Data = scheduleDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<CoordinatorScheduleDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving the schedule",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>> GetOrganizationSchedulesAsync(
            int organizationId, CoordinatorScheduleFilterDto filter)
        {
            try
            {
                var query = _context.CoordinatorSchedules
                    .Include(s => s.Coordinator)
                        .ThenInclude(c => c.User)
                            .ThenInclude(u => u.UserProfiles)
                    .Include(s => s.Event)
                    .Include(s => s.CreatedByNavigation)
                        .ThenInclude(cb => cb.UserProfiles)
                    .Where(s => s.Coordinator.OrganizationId == organizationId);

                // Apply filters
                if (filter.CoordinatorId.HasValue)
                {
                    query = query.Where(s => s.CoordinatorId == filter.CoordinatorId.Value);
                }

                if (filter.EventId.HasValue)
                {
                    query = query.Where(s => s.EventId == filter.EventId.Value);
                }

                if (filter.StartDateFrom.HasValue)
                {
                    query = query.Where(s => s.StartDateTime >= filter.StartDateFrom.Value);
                }

                if (filter.StartDateTo.HasValue)
                {
                    query = query.Where(s => s.StartDateTime <= filter.StartDateTo.Value);
                }

                if (filter.EndDateFrom.HasValue)
                {
                    query = query.Where(s => s.EndDateTime >= filter.EndDateFrom.Value);
                }

                if (filter.EndDateTo.HasValue)
                {
                    query = query.Where(s => s.EndDateTime <= filter.EndDateTo.Value);
                }

                if (!string.IsNullOrEmpty(filter.ScheduleType))
                {
                    query = query.Where(s => s.ScheduleType == filter.ScheduleType);
                }

                if (!string.IsNullOrEmpty(filter.Priority))
                {
                    query = query.Where(s => s.Priority == filter.Priority);
                }

                if (!string.IsNullOrEmpty(filter.Status))
                {
                    query = query.Where(s => s.Status == filter.Status);
                }

                if (!string.IsNullOrEmpty(filter.Search))
                {
                    query = query.Where(s => 
                        s.Title.Contains(filter.Search) ||
                        s.Description!.Contains(filter.Search) ||
                        s.Coordinator.User.UserProfiles.Any(up => up.FullName.Contains(filter.Search))
                    );
                }

                // Apply sorting
                query = filter.SortBy?.ToLower() switch
                {
                    "title" => filter.SortDirection?.ToLower() == "desc" 
                        ? query.OrderByDescending(s => s.Title)
                        : query.OrderBy(s => s.Title),
                    "coordinatorname" => filter.SortDirection?.ToLower() == "desc"
                        ? query.OrderByDescending(s => s.Coordinator.User.UserProfiles.FirstOrDefault()!.FullName)
                        : query.OrderBy(s => s.Coordinator.User.UserProfiles.FirstOrDefault()!.FullName),
                    "eventname" => filter.SortDirection?.ToLower() == "desc"
                        ? query.OrderByDescending(s => s.Event!.EventName)
                        : query.OrderBy(s => s.Event!.EventName),
                    "status" => filter.SortDirection?.ToLower() == "desc"
                        ? query.OrderByDescending(s => s.Status)
                        : query.OrderBy(s => s.Status),
                    "priority" => filter.SortDirection?.ToLower() == "desc"
                        ? query.OrderByDescending(s => s.Priority)
                        : query.OrderBy(s => s.Priority),
                    "enddatetime" => filter.SortDirection?.ToLower() == "desc"
                        ? query.OrderByDescending(s => s.EndDateTime)
                        : query.OrderBy(s => s.EndDateTime),
                    _ => filter.SortDirection?.ToLower() == "desc"
                        ? query.OrderByDescending(s => s.StartDateTime)
                        : query.OrderBy(s => s.StartDateTime)
                };

                var totalCount = await query.CountAsync();

                var schedules = await query
                    .Skip((filter.Page - 1) * filter.Size)
                    .Take(filter.Size)
                    .ToListAsync();

                var scheduleDtos = schedules.Select(MapToDto).ToList();

                var result = new PagedResultDto<CoordinatorScheduleDto>
                {
                    Items = scheduleDtos,
                    PageNumber = filter.Page,
                    PageSize = filter.Size,
                    TotalCount = totalCount
                };

                return new ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>
                {
                    Success = true,
                    Message = "Schedules retrieved successfully",
                    Data = result
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving schedules",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<int>> CreateScheduleAsync(int organizationId, CreateCoordinatorScheduleDto createDto, int createdBy)
        {
            try
            {
                // Verify coordinator belongs to organization
                var coordinator = await _context.VolunteerCoordinators
                    .FirstOrDefaultAsync(c => c.CoordinatorId == createDto.CoordinatorId && c.OrganizationId == organizationId);

                if (coordinator == null)
                {
                    return new ApiResponseDTO<int>
                    {
                        Success = false,
                        Message = "Coordinator not found",
                        Errors = new List<string> { "The specified coordinator does not belong to your organization." }
                    };
                }

                // Verify event belongs to organization if specified
                if (createDto.EventId.HasValue)
                {
                    var eventExists = await _context.Events
                        .AnyAsync(e => e.EventId == createDto.EventId.Value && e.OrganizationId == organizationId);

                    if (!eventExists)
                    {
                        return new ApiResponseDTO<int>
                        {
                            Success = false,
                            Message = "Event not found",
                            Errors = new List<string> { "The specified event does not belong to your organization." }
                        };
                    }
                }

                // Check for schedule conflicts
                var conflictCheck = await CheckScheduleConflictsAsync(createDto.CoordinatorId, createDto.StartDateTime, createDto.EndDateTime);
                if (conflictCheck.Success && conflictCheck.Data!.Any())
                {
                    return new ApiResponseDTO<int>
                    {
                        Success = false,
                        Message = "Schedule conflict detected",
                        Errors = new List<string> { $"The coordinator already has {conflictCheck.Data.Count} conflicting schedule(s) during this time." }
                    };
                }

                var schedule = new CoordinatorSchedule
                {
                    CoordinatorId = createDto.CoordinatorId,
                    EventId = createDto.EventId,
                    Title = createDto.Title,
                    Description = createDto.Description,
                    StartDateTime = createDto.StartDateTime,
                    EndDateTime = createDto.EndDateTime,
                    Location = createDto.Location,
                    ScheduleType = createDto.ScheduleType,
                    Priority = createDto.Priority,
                    Status = createDto.Status,
                    IsAllDay = createDto.IsAllDay,
                    ReminderMinutes = createDto.ReminderMinutes,
                    Notes = createDto.Notes,
                    CreatedBy = createdBy,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.CoordinatorSchedules.Add(schedule);
                await _context.SaveChangesAsync();

                return new ApiResponseDTO<int>
                {
                    Success = true,
                    Message = "Schedule created successfully",
                    Data = schedule.ScheduleId
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<int>
                {
                    Success = false,
                    Message = "An error occurred while creating the schedule",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<bool>> UpdateScheduleAsync(int organizationId, int scheduleId, UpdateCoordinatorScheduleDto updateDto, int updatedBy)
        {
            try
            {
                var schedule = await _context.CoordinatorSchedules
                    .Include(s => s.Coordinator)
                    .FirstOrDefaultAsync(s => s.ScheduleId == scheduleId && s.Coordinator.OrganizationId == organizationId);

                if (schedule == null)
                {
                    return new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Schedule not found",
                        Errors = new List<string> { "The specified schedule does not exist or does not belong to your organization." }
                    };
                }

                // Check for conflicts if time is being changed
                if (updateDto.StartDateTime.HasValue || updateDto.EndDateTime.HasValue)
                {
                    var newStartTime = updateDto.StartDateTime ?? schedule.StartDateTime;
                    var newEndTime = updateDto.EndDateTime ?? schedule.EndDateTime;

                    var conflictCheck = await CheckScheduleConflictsAsync(schedule.CoordinatorId, newStartTime, newEndTime, scheduleId);
                    if (conflictCheck.Success && conflictCheck.Data!.Any())
                    {
                        return new ApiResponseDTO<bool>
                        {
                            Success = false,
                            Message = "Schedule conflict detected",
                            Errors = new List<string> { $"The coordinator already has {conflictCheck.Data.Count} conflicting schedule(s) during this time." }
                        };
                    }
                }

                // Update fields
                if (!string.IsNullOrEmpty(updateDto.Title))
                    schedule.Title = updateDto.Title;
                if (updateDto.Description != null)
                    schedule.Description = updateDto.Description;
                if (updateDto.StartDateTime.HasValue)
                    schedule.StartDateTime = updateDto.StartDateTime.Value;
                if (updateDto.EndDateTime.HasValue)
                    schedule.EndDateTime = updateDto.EndDateTime.Value;
                if (updateDto.Location != null)
                    schedule.Location = updateDto.Location;
                if (!string.IsNullOrEmpty(updateDto.ScheduleType))
                    schedule.ScheduleType = updateDto.ScheduleType;
                if (!string.IsNullOrEmpty(updateDto.Priority))
                    schedule.Priority = updateDto.Priority;
                if (!string.IsNullOrEmpty(updateDto.Status))
                    schedule.Status = updateDto.Status;
                if (updateDto.IsAllDay.HasValue)
                    schedule.IsAllDay = updateDto.IsAllDay.Value;
                if (updateDto.ReminderMinutes.HasValue)
                    schedule.ReminderMinutes = updateDto.ReminderMinutes.Value;
                if (updateDto.Notes != null)
                    schedule.Notes = updateDto.Notes;

                schedule.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return new ApiResponseDTO<bool>
                {
                    Success = true,
                    Message = "Schedule updated successfully",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<bool>
                {
                    Success = false,
                    Message = "An error occurred while updating the schedule",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<bool>> DeleteScheduleAsync(int organizationId, int scheduleId)
        {
            try
            {
                var schedule = await _context.CoordinatorSchedules
                    .Include(s => s.Coordinator)
                    .FirstOrDefaultAsync(s => s.ScheduleId == scheduleId && s.Coordinator.OrganizationId == organizationId);

                if (schedule == null)
                {
                    return new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Schedule not found",
                        Errors = new List<string> { "The specified schedule does not exist or does not belong to your organization." }
                    };
                }

                _context.CoordinatorSchedules.Remove(schedule);
                await _context.SaveChangesAsync();

                return new ApiResponseDTO<bool>
                {
                    Success = true,
                    Message = "Schedule deleted successfully",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<bool>
                {
                    Success = false,
                    Message = "An error occurred while deleting the schedule",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>> GetPersonalSchedulesAsync(
            int coordinatorUserId, CoordinatorScheduleFilterDto filter)
        {
            try
            {
                // Find the coordinator record
                var coordinator = await _context.VolunteerCoordinators
                    .FirstOrDefaultAsync(c => c.UserId == coordinatorUserId);

                if (coordinator == null)
                {
                    return new ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>
                    {
                        Success = false,
                        Message = "Coordinator profile not found",
                        Errors = new List<string> { "No coordinator profile found for this user." }
                    };
                }

                // Set filter to current coordinator
                filter.CoordinatorId = coordinator.CoordinatorId;

                // Use the organization schedules method but filtered to this coordinator
                return await GetOrganizationSchedulesAsync(coordinator.OrganizationId, filter);
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving personal schedules",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<CoordinatorScheduleStatsDto>> GetScheduleStatsAsync(int organizationId)
        {
            try
            {
                var schedules = await _context.CoordinatorSchedules
                    .Include(s => s.Coordinator)
                        .ThenInclude(c => c.User)
                            .ThenInclude(u => u.UserProfiles)
                    .Where(s => s.Coordinator.OrganizationId == organizationId)
                    .ToListAsync();

                var today = DateTime.Today;
                var weekStart = today.AddDays(-(int)today.DayOfWeek);
                var monthStart = new DateTime(today.Year, today.Month, 1);

                var stats = new CoordinatorScheduleStatsDto
                {
                    TotalSchedules = schedules.Count,
                    ScheduledCount = schedules.Count(s => s.Status == "Scheduled"),
                    InProgressCount = schedules.Count(s => s.Status == "In Progress"),
                    CompletedCount = schedules.Count(s => s.Status == "Completed"),
                    CancelledCount = schedules.Count(s => s.Status == "Cancelled"),
                    TodaySchedules = schedules.Count(s => s.StartDateTime.Date == today),
                    ThisWeekSchedules = schedules.Count(s => s.StartDateTime.Date >= weekStart && s.StartDateTime.Date < weekStart.AddDays(7)),
                    ThisMonthSchedules = schedules.Count(s => s.StartDateTime.Year == today.Year && s.StartDateTime.Month == today.Month),
                    UpcomingSchedules = schedules.Count(s => s.StartDateTime > DateTime.Now && s.Status == "Scheduled"),
                    OverdueSchedules = schedules.Count(s => s.EndDateTime < DateTime.Now && s.Status != "Completed" && s.Status != "Cancelled")
                };

                // Group by type
                stats.SchedulesByType = schedules
                    .Where(s => !string.IsNullOrEmpty(s.ScheduleType))
                    .GroupBy(s => s.ScheduleType!)
                    .ToDictionary(g => g.Key, g => g.Count());

                // Group by priority
                stats.SchedulesByPriority = schedules
                    .Where(s => !string.IsNullOrEmpty(s.Priority))
                    .GroupBy(s => s.Priority!)
                    .ToDictionary(g => g.Key, g => g.Count());

                // Top coordinators
                stats.TopCoordinators = schedules
                    .GroupBy(s => new { s.CoordinatorId, CoordinatorName = s.Coordinator.User.UserProfiles.FirstOrDefault()!.FullName })
                    .Select(g => new CoordinatorScheduleStatsItem
                    {
                        CoordinatorId = g.Key.CoordinatorId,
                        CoordinatorName = g.Key.CoordinatorName,
                        ScheduleCount = g.Count(),
                        CompletedCount = g.Count(s => s.Status == "Completed"),
                        CompletionRate = g.Count() > 0 ? (double)g.Count(s => s.Status == "Completed") / g.Count() * 100 : 0
                    })
                    .OrderByDescending(x => x.ScheduleCount)
                    .Take(10)
                    .ToList();

                return new ApiResponseDTO<CoordinatorScheduleStatsDto>
                {
                    Success = true,
                    Message = "Schedule statistics retrieved successfully",
                    Data = stats
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<CoordinatorScheduleStatsDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving schedule statistics",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<List<CoordinatorScheduleSummaryDto>>> GetCalendarViewAsync(
            int organizationId, DateTime startDate, DateTime endDate, int? coordinatorId = null)
        {
            try
            {
                var query = _context.CoordinatorSchedules
                    .Include(s => s.Coordinator)
                        .ThenInclude(c => c.User)
                            .ThenInclude(u => u.UserProfiles)
                    .Include(s => s.Event)
                    .Where(s => s.Coordinator.OrganizationId == organizationId &&
                               s.StartDateTime >= startDate &&
                               s.StartDateTime <= endDate);

                if (coordinatorId.HasValue)
                {
                    query = query.Where(s => s.CoordinatorId == coordinatorId.Value);
                }

                var schedules = await query
                    .OrderBy(s => s.StartDateTime)
                    .ToListAsync();

                var summaries = schedules.Select(s => new CoordinatorScheduleSummaryDto
                {
                    ScheduleId = s.ScheduleId,
                    Title = s.Title,
                    StartDateTime = s.StartDateTime,
                    EndDateTime = s.EndDateTime,
                    ScheduleType = s.ScheduleType,
                    Priority = s.Priority,
                    Status = s.Status,
                    IsAllDay = s.IsAllDay,
                    CoordinatorName = s.Coordinator.User.UserProfiles.FirstOrDefault()?.FullName,
                    EventName = s.Event?.EventName
                }).ToList();

                return new ApiResponseDTO<List<CoordinatorScheduleSummaryDto>>
                {
                    Success = true,
                    Message = "Calendar view retrieved successfully",
                    Data = summaries
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<List<CoordinatorScheduleSummaryDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving calendar view",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<bool>> UpdateScheduleStatusAsync(int organizationId, int scheduleId, string status, int updatedBy)
        {
            try
            {
                var schedule = await _context.CoordinatorSchedules
                    .Include(s => s.Coordinator)
                    .FirstOrDefaultAsync(s => s.ScheduleId == scheduleId && s.Coordinator.OrganizationId == organizationId);

                if (schedule == null)
                {
                    return new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Schedule not found",
                        Errors = new List<string> { "The specified schedule does not exist or does not belong to your organization." }
                    };
                }

                schedule.Status = status;
                schedule.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return new ApiResponseDTO<bool>
                {
                    Success = true,
                    Message = "Schedule status updated successfully",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<bool>
                {
                    Success = false,
                    Message = "An error occurred while updating schedule status",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<bool>> BulkUpdateStatusAsync(int organizationId, List<int> scheduleIds, string status, int updatedBy)
        {
            try
            {
                var schedules = await _context.CoordinatorSchedules
                    .Include(s => s.Coordinator)
                    .Where(s => scheduleIds.Contains(s.ScheduleId) && s.Coordinator.OrganizationId == organizationId)
                    .ToListAsync();

                if (!schedules.Any())
                {
                    return new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "No schedules found",
                        Errors = new List<string> { "None of the specified schedules exist or belong to your organization." }
                    };
                }

                foreach (var schedule in schedules)
                {
                    schedule.Status = status;
                    schedule.UpdatedAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                return new ApiResponseDTO<bool>
                {
                    Success = true,
                    Message = $"Successfully updated {schedules.Count} schedule(s)",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<bool>
                {
                    Success = false,
                    Message = "An error occurred while updating schedule statuses",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<bool>> BulkDeleteAsync(int organizationId, List<int> scheduleIds)
        {
            try
            {
                var schedules = await _context.CoordinatorSchedules
                    .Include(s => s.Coordinator)
                    .Where(s => scheduleIds.Contains(s.ScheduleId) && s.Coordinator.OrganizationId == organizationId)
                    .ToListAsync();

                if (!schedules.Any())
                {
                    return new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "No schedules found",
                        Errors = new List<string> { "None of the specified schedules exist or belong to your organization." }
                    };
                }

                _context.CoordinatorSchedules.RemoveRange(schedules);
                await _context.SaveChangesAsync();

                return new ApiResponseDTO<bool>
                {
                    Success = true,
                    Message = $"Successfully deleted {schedules.Count} schedule(s)",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<bool>
                {
                    Success = false,
                    Message = "An error occurred while deleting schedules",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<List<CoordinatorScheduleDto>>> CheckScheduleConflictsAsync(
            int coordinatorId, DateTime startDateTime, DateTime endDateTime, int? excludeScheduleId = null)
        {
            try
            {
                var query = _context.CoordinatorSchedules
                    .Include(s => s.Coordinator)
                        .ThenInclude(c => c.User)
                            .ThenInclude(u => u.UserProfiles)
                    .Include(s => s.Event)
                    .Where(s => s.CoordinatorId == coordinatorId &&
                               ((s.StartDateTime < endDateTime && s.EndDateTime > startDateTime) ||
                                (startDateTime < s.EndDateTime && endDateTime > s.StartDateTime)) &&
                               s.Status != "Cancelled");

                if (excludeScheduleId.HasValue)
                {
                    query = query.Where(s => s.ScheduleId != excludeScheduleId.Value);
                }

                var conflicts = await query.ToListAsync();
                var conflictDtos = conflicts.Select(MapToDto).ToList();

                return new ApiResponseDTO<List<CoordinatorScheduleDto>>
                {
                    Success = true,
                    Message = "Conflict check completed",
                    Data = conflictDtos
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<List<CoordinatorScheduleDto>>
                {
                    Success = false,
                    Message = "An error occurred while checking for conflicts",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        private CoordinatorScheduleDto MapToDto(CoordinatorSchedule schedule)
        {
            var userProfile = schedule.Coordinator.User.UserProfiles.FirstOrDefault();
            var createdByProfile = schedule.CreatedByNavigation?.UserProfiles.FirstOrDefault();

            return new CoordinatorScheduleDto
            {
                ScheduleId = schedule.ScheduleId,
                CoordinatorId = schedule.CoordinatorId,
                CoordinatorName = userProfile?.FullName ?? "Unknown",
                CoordinatorEmail = schedule.Coordinator.User.Email,
                CoordinatorPosition = schedule.Coordinator.Position,
                EventId = schedule.EventId,
                EventName = schedule.Event?.EventName,
                EventLocation = schedule.Event?.Location,
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
                CreatedByName = createdByProfile?.FullName,
                CreatedAt = schedule.CreatedAt,
                UpdatedAt = schedule.UpdatedAt
            };
        }
    }
}
