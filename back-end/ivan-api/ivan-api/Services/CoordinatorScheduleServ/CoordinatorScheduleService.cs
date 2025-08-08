using AutoMapper;
using ivan_api.DTOs.CoordinatorSchedule;
using ivan_api.DTOs.Common;
using ivan_api.Models;
using ivan_api.Repository.CoordinatorScheduleRepo;

namespace ivan_api.Services.CoordinatorScheduleServ
{
    public class CoordinatorScheduleService : ICoordinatorScheduleService
    {
        private readonly ICoordinatorScheduleRepository _repository;
        private readonly IMapper _mapper;

        public CoordinatorScheduleService(ICoordinatorScheduleRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<ApiResponseDTO<CoordinatorScheduleDto>> GetScheduleByIdAsync(int organizationId, int scheduleId)
        {
            try
            {
                var schedule = await _repository.GetByIdAsync(scheduleId);
                
                if (schedule == null)
                {
                    return new ApiResponseDTO<CoordinatorScheduleDto>
                    {
                        Success = false,
                        Message = "Schedule not found",
                        Errors = new List<string> { "Schedule not found" }
                    };
                }

                // Verify the schedule belongs to the organization
                if (schedule.Coordinator?.OrganizationId != organizationId)
                {
                    return new ApiResponseDTO<CoordinatorScheduleDto>
                    {
                        Success = false,
                        Message = "Unauthorized access to schedule",
                        Errors = new List<string> { "Schedule not found" }
                    };
                }

                var scheduleDto = _mapper.Map<CoordinatorScheduleDto>(schedule);
                
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
                var schedules = await _repository.GetOrganizationSchedulesAsync(organizationId, filter);
                var scheduleDtos = _mapper.Map<List<CoordinatorScheduleDto>>(schedules.Items);

                var pagedResult = new PagedResultDto<CoordinatorScheduleDto>
                {
                    Items = scheduleDtos,
                    TotalCount = schedules.TotalCount,
                    PageNumber = schedules.PageNumber,
                    PageSize = schedules.PageSize
                };

                return new ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>
                {
                    Success = true,
                    Message = "Schedules retrieved successfully",
                    Data = pagedResult
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
                var coordinator = await _repository.GetCoordinatorByIdAsync(createDto.CoordinatorId);
                if (coordinator?.OrganizationId != organizationId)
                {
                    return new ApiResponseDTO<int>
                    {
                        Success = false,
                        Message = "Coordinator not found or doesn't belong to organization",
                        Errors = new List<string> { "Invalid coordinator" }
                    };
                }

                // Check for conflicts
                var conflicts = await _repository.CheckConflictsAsync(
                    createDto.CoordinatorId, 
                    createDto.StartDateTime, 
                    createDto.EndDateTime);

                if (conflicts.Any())
                {
                    return new ApiResponseDTO<int>
                    {
                        Success = false,
                        Message = "Schedule conflicts detected",
                        Errors = new List<string> { "The coordinator has conflicting schedules during this time" }
                    };
                }

                var schedule = _mapper.Map<CoordinatorSchedule>(createDto);
                schedule.CreatedBy = createdBy;
                schedule.CreatedAt = DateTime.UtcNow;
                schedule.UpdatedAt = DateTime.UtcNow;

                var scheduleId = await _repository.CreateAsync(schedule);

                return new ApiResponseDTO<int>
                {
                    Success = true,
                    Message = "Schedule created successfully",
                    Data = scheduleId
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
                var existingSchedule = await _repository.GetByIdAsync(scheduleId);
                
                if (existingSchedule == null || existingSchedule.Coordinator?.OrganizationId != organizationId)
                {
                    return new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Schedule not found",
                        Errors = new List<string> { "Schedule not found" }
                    };
                }

                // Check for conflicts if time is being changed
                if (updateDto.StartDateTime.HasValue || updateDto.EndDateTime.HasValue)
                {
                    var startTime = updateDto.StartDateTime ?? existingSchedule.StartDateTime;
                    var endTime = updateDto.EndDateTime ?? existingSchedule.EndDateTime;

                    var conflicts = await _repository.CheckConflictsAsync(
                        existingSchedule.CoordinatorId, 
                        startTime, 
                        endTime, 
                        scheduleId);

                    if (conflicts.Any())
                    {
                        return new ApiResponseDTO<bool>
                        {
                            Success = false,
                            Message = "Schedule conflicts detected",
                            Errors = new List<string> { "The coordinator has conflicting schedules during this time" }
                        };
                    }
                }

                _mapper.Map(updateDto, existingSchedule);
                existingSchedule.UpdatedAt = DateTime.UtcNow;

                var success = await _repository.UpdateAsync(existingSchedule);

                return new ApiResponseDTO<bool>
                {
                    Success = success,
                    Message = success ? "Schedule updated successfully" : "Failed to update schedule",
                    Data = success
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
                var schedule = await _repository.GetByIdAsync(scheduleId);
                
                if (schedule == null || schedule.Coordinator?.OrganizationId != organizationId)
                {
                    return new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Schedule not found",
                        Errors = new List<string> { "Schedule not found" }
                    };
                }

                var success = await _repository.DeleteAsync(scheduleId);

                return new ApiResponseDTO<bool>
                {
                    Success = success,
                    Message = success ? "Schedule deleted successfully" : "Failed to delete schedule",
                    Data = success
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
                var schedules = await _repository.GetPersonalSchedulesAsync(coordinatorUserId, filter);
                var scheduleDtos = _mapper.Map<List<CoordinatorScheduleDto>>(schedules.Items);

                var pagedResult = new PagedResultDto<CoordinatorScheduleDto>
                {
                    Items = scheduleDtos,
                    TotalCount = schedules.TotalCount,
                    PageNumber = schedules.PageNumber,
                    PageSize = schedules.PageSize
                };

                return new ApiResponseDTO<PagedResultDto<CoordinatorScheduleDto>>
                {
                    Success = true,
                    Message = "Personal schedules retrieved successfully",
                    Data = pagedResult
                };
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
                var stats = await _repository.GetScheduleStatsAsync(organizationId);

                return new ApiResponseDTO<CoordinatorScheduleStatsDto>
                {
                    Success = true,
                    Message = "Statistics retrieved successfully",
                    Data = stats
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<CoordinatorScheduleStatsDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving statistics",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<List<CoordinatorScheduleSummaryDto>>> GetCalendarViewAsync(
            int organizationId, DateTime startDate, DateTime endDate, int? coordinatorId = null)
        {
            try
            {
                var schedules = await _repository.GetCalendarViewAsync(organizationId, startDate, endDate, coordinatorId);
                var summaryDtos = _mapper.Map<List<CoordinatorScheduleSummaryDto>>(schedules);

                return new ApiResponseDTO<List<CoordinatorScheduleSummaryDto>>
                {
                    Success = true,
                    Message = "Calendar view retrieved successfully",
                    Data = summaryDtos
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
                var schedule = await _repository.GetByIdAsync(scheduleId);
                
                if (schedule == null || schedule.Coordinator?.OrganizationId != organizationId)
                {
                    return new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Schedule not found",
                        Errors = new List<string> { "Schedule not found" }
                    };
                }

                schedule.Status = status;
                schedule.UpdatedAt = DateTime.UtcNow;

                var success = await _repository.UpdateAsync(schedule);

                return new ApiResponseDTO<bool>
                {
                    Success = success,
                    Message = success ? "Schedule status updated successfully" : "Failed to update schedule status",
                    Data = success
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
                var success = await _repository.BulkUpdateStatusAsync(organizationId, scheduleIds, status, updatedBy);

                return new ApiResponseDTO<bool>
                {
                    Success = success,
                    Message = success ? "Schedules updated successfully" : "Failed to update schedules",
                    Data = success
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<bool>
                {
                    Success = false,
                    Message = "An error occurred while updating schedules",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<bool>> BulkDeleteAsync(int organizationId, List<int> scheduleIds)
        {
            try
            {
                var success = await _repository.BulkDeleteAsync(organizationId, scheduleIds);

                return new ApiResponseDTO<bool>
                {
                    Success = success,
                    Message = success ? "Schedules deleted successfully" : "Failed to delete schedules",
                    Data = success
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
                var conflicts = await _repository.CheckConflictsAsync(coordinatorId, startDateTime, endDateTime, excludeScheduleId);
                var conflictDtos = _mapper.Map<List<CoordinatorScheduleDto>>(conflicts);

                return new ApiResponseDTO<List<CoordinatorScheduleDto>>
                {
                    Success = true,
                    Message = conflicts.Any() ? "Conflicts found" : "No conflicts found",
                    Data = conflictDtos
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<List<CoordinatorScheduleDto>>
                {
                    Success = false,
                    Message = "An error occurred while checking conflicts",
                    Errors = new List<string> { ex.Message }
                };
            }
        }
    }
}
