using AutoMapper;
using ivan_api.DTOs.CoordinatorSchedule;
using ivan_api.DTOs.Common;
using ivan_api.Models;
using ivan_api.Repository.CoordinatorScheduleRepo;
using ivan_api.Services.AuthenticationSer;

namespace ivan_api.Services.CoordinatorScheduleServ
{
    public class CoordinatorScheduleService : ICoordinatorScheduleService
    {
        private readonly ICoordinatorScheduleRepository _repository;
        private readonly IMapper _mapper;
        private readonly IAuthenticationService _authenticationService;

        public CoordinatorScheduleService(ICoordinatorScheduleRepository repository, IMapper mapper, IAuthenticationService authenticationService)
        {
            _repository = repository;
            _mapper = mapper;
            _authenticationService = authenticationService;
        }

        public async Task<CoordinatorScheduleDto?> GetScheduleByIdAsync(int organizationId, int scheduleId)
        {
            var schedule = await _repository.GetByIdAsync(scheduleId);
            
            if (schedule == null)
            {
                return null;
            }

            // Verify the schedule belongs to the organization
            if (schedule.Coordinator?.OrganizationId != organizationId)
            {
                return null;
            }

            return _mapper.Map<CoordinatorScheduleDto>(schedule);
        }

        public async Task<PagedResultDto<CoordinatorScheduleDto>> GetOrganizationSchedulesAsync(
            int organizationId, CoordinatorScheduleFilterDto filter)
        {
            var schedules = await _repository.GetOrganizationSchedulesAsync(organizationId, filter);
            var scheduleDtos = _mapper.Map<List<CoordinatorScheduleDto>>(schedules.Items);

            return new PagedResultDto<CoordinatorScheduleDto>
            {
                Items = scheduleDtos,
                TotalCount = schedules.TotalCount,
                PageNumber = schedules.PageNumber,
                PageSize = schedules.PageSize
            };
        }

        public async Task<int?> CreateScheduleAsync(int organizationId, CreateCoordinatorScheduleDto createDto, int createdBy)
        {
            // Verify coordinator belongs to organization
            var coordinator = await _repository.GetCoordinatorByIdAsync(createDto.CoordinatorId);
            if (coordinator?.OrganizationId != organizationId)
            {
                return null;
            }

            // Check for conflicts
            var conflicts = await _repository.CheckConflictsAsync(
                createDto.CoordinatorId, 
                createDto.StartDateTime, 
                createDto.EndDateTime);

            if (conflicts.Any())
            {
                return null;
            }

            var schedule = _mapper.Map<CoordinatorSchedule>(createDto);
            schedule.CreatedBy = createdBy;
            schedule.CreatedAt = DateTime.UtcNow;
            schedule.UpdatedAt = DateTime.UtcNow;

            return await _repository.CreateAsync(schedule);
        }

        public async Task<bool> UpdateScheduleAsync(int organizationId, int scheduleId, UpdateCoordinatorScheduleDto updateDto, int updatedBy)
        {
            var existingSchedule = await _repository.GetByIdAsync(scheduleId);
            
            if (existingSchedule == null || existingSchedule.Coordinator?.OrganizationId != organizationId)
            {
                return false;
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
                    return false;
                }
            }

            _mapper.Map(updateDto, existingSchedule);
            existingSchedule.UpdatedAt = DateTime.UtcNow;

            return await _repository.UpdateAsync(existingSchedule);
        }

        public async Task<bool> DeleteScheduleAsync(int organizationId, int scheduleId)
        {
            var schedule = await _repository.GetByIdAsync(scheduleId);
            
            if (schedule == null || schedule.Coordinator?.OrganizationId != organizationId)
            {
                return false;
            }

            return await _repository.DeleteAsync(scheduleId);
        }

        public async Task<PagedResultDto<CoordinatorScheduleDto>?> GetPersonalSchedulesAsync(
            int coordinatorUserId, CoordinatorScheduleFilterDto filter)
        {
            // Get user info with profile to retrieve coordinator ID
            var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(coordinatorUserId);
            if (userInfo?.CoordinatorId == null)
            {
                return null;
            }

            var coordinatorId = userInfo.CoordinatorId.Value;
            var schedules = await _repository.GetPersonalSchedulesAsync(coordinatorUserId, filter);
            var scheduleDtos = _mapper.Map<List<CoordinatorScheduleDto>>(schedules.Items);

            return new PagedResultDto<CoordinatorScheduleDto>
            {
                Items = scheduleDtos,
                TotalCount = schedules.TotalCount,
                PageNumber = schedules.PageNumber,
                PageSize = schedules.PageSize
            };
        }

        public async Task<CoordinatorScheduleStatsDto> GetScheduleStatsAsync(int organizationId)
        {
            return await _repository.GetScheduleStatsAsync(organizationId);
        }

        public async Task<List<CoordinatorScheduleSummaryDto>> GetCalendarViewAsync(
            int organizationId, DateTime startDate, DateTime endDate, int? coordinatorId = null)
        {
            var schedules = await _repository.GetCalendarViewAsync(organizationId, startDate, endDate, coordinatorId);
            return _mapper.Map<List<CoordinatorScheduleSummaryDto>>(schedules);
        }

        public async Task<bool> UpdateScheduleStatusAsync(int organizationId, int scheduleId, string status, int updatedBy)
        {
            var schedule = await _repository.GetByIdAsync(scheduleId);
            
            if (schedule == null || schedule.Coordinator?.OrganizationId != organizationId)
            {
                return false;
            }

            schedule.Status = status;
            schedule.UpdatedAt = DateTime.UtcNow;

            return await _repository.UpdateAsync(schedule);
        }

        public async Task<bool> BulkUpdateStatusAsync(int organizationId, List<int> scheduleIds, string status, int updatedBy)
        {
            return await _repository.BulkUpdateStatusAsync(organizationId, scheduleIds, status, updatedBy);
        }

        public async Task<bool> BulkDeleteAsync(int organizationId, List<int> scheduleIds)
        {
            return await _repository.BulkDeleteAsync(organizationId, scheduleIds);
        }

        public async Task<List<CoordinatorScheduleDto>> CheckScheduleConflictsAsync(
            int coordinatorId, DateTime startDateTime, DateTime endDateTime, int? excludeScheduleId = null)
        {
            var conflicts = await _repository.CheckConflictsAsync(coordinatorId, startDateTime, endDateTime, excludeScheduleId);
            return _mapper.Map<List<CoordinatorScheduleDto>>(conflicts);
        }

        public async Task<VolunteerCoordinator?> GetCoordinatorByIdAsync(int coordinatorId)
        {
            return await _repository.GetCoordinatorByIdAsync(coordinatorId);
        }
    }
}
