using AutoMapper;
using ivan_api.DTOs.VolunteerSchedule;
using ivan_api.DTOs.Common;
using ivan_api.Models;
using ivan_api.Repository.VolunteerScheduleRepo;
using ivan_api.Repository.VolunteerProfileRepo;
using ivan_api.Repository.EventRepo;

namespace ivan_api.Services.VolunteerScheduleServ
{
    public class VolunteerScheduleService : IVolunteerScheduleService
    {
        private readonly IVolunteerScheduleRepository _scheduleRepository;
        private readonly IVolunteerProfileRepository _volunteerRepository;
        private readonly IEventRepository _eventRepository;
        private readonly IMapper _mapper;

        public VolunteerScheduleService(
            IVolunteerScheduleRepository scheduleRepository,
            IVolunteerProfileRepository volunteerRepository,
            IEventRepository eventRepository,
            IMapper mapper)
        {
            _scheduleRepository = scheduleRepository;
            _volunteerRepository = volunteerRepository;
            _eventRepository = eventRepository;
            _mapper = mapper;
        }

        // Organization/Coordinator methods - for managing volunteer schedules
        public async Task<ApiResponseDTO<PagedResultDto<VolunteerScheduleDTO>>> GetOrganizationVolunteerSchedulesAsync(int organizationId, VolunteerScheduleFilterDTO filter)
        {
            try
            {
                var result = await _scheduleRepository.GetOrganizationVolunteerSchedulesAsync(organizationId, filter);
                var scheduleDTOs = _mapper.Map<List<VolunteerScheduleDTO>>(result.Items);

                return new ApiResponseDTO<PagedResultDto<VolunteerScheduleDTO>>
                {
                    Success = true,
                    Message = "Volunteer schedules retrieved successfully",
                    Data = new PagedResultDto<VolunteerScheduleDTO>
                    {
                        Items = scheduleDTOs,
                        TotalCount = result.TotalCount,
                        PageNumber = result.PageNumber,
                        PageSize = result.PageSize
                    }
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<PagedResultDto<VolunteerScheduleDTO>>
                {
                    Success = false,
                    Message = "Failed to retrieve volunteer schedules",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<VolunteerScheduleDTO>> GetVolunteerScheduleByIdAsync(int organizationId, int scheduleId)
        {
            try
            {
                var schedule = await _scheduleRepository.GetByIdAsync(scheduleId);
                if (schedule == null)
                {
                    return new ApiResponseDTO<VolunteerScheduleDTO>
                    {
                        Success = false,
                        Message = "Schedule not found"
                    };
                }

                // Verify the schedule belongs to the organization through event
                if (schedule.Event?.OrganizationId != organizationId)
                {
                    return new ApiResponseDTO<VolunteerScheduleDTO>
                    {
                        Success = false,
                        Message = "Schedule does not belong to your organization"
                    };
                }

                var scheduleDTO = _mapper.Map<VolunteerScheduleDTO>(schedule);

                return new ApiResponseDTO<VolunteerScheduleDTO>
                {
                    Success = true,
                    Message = "Schedule retrieved successfully",
                    Data = scheduleDTO
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<VolunteerScheduleDTO>
                {
                    Success = false,
                    Message = "Failed to retrieve schedule",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<VolunteerScheduleDTO>> CreateVolunteerScheduleAsync(int organizationId, VolunteerScheduleRequestDTO request, int createdByUserId)
        {
            try
            {
                // Verify volunteer exists
                var volunteer = await _volunteerRepository.GetVolunteerProfileById(request.VolunteerId);
                if (volunteer == null)
                {
                    return new ApiResponseDTO<VolunteerScheduleDTO>
                    {
                        Success = false,
                        Message = "Volunteer not found"
                    };
                }

                // Verify event belongs to organization (if event is specified)
                if (request.EventId.HasValue)
                {
                    var eventDetails = await _eventRepository.GetByIdAsync(request.EventId.Value);
                    if (eventDetails == null || eventDetails.OrganizationId != organizationId)
                    {
                        return new ApiResponseDTO<VolunteerScheduleDTO>
                        {
                            Success = false,
                            Message = "Event not found or does not belong to your organization"
                        };
                    }
                }

                // Check for scheduling conflicts
                var hasConflicts = await _scheduleRepository.HasConflictAsync(
                    request.VolunteerId, 
                    request.StartDateTime, 
                    request.EndDateTime);

                if (hasConflicts)
                {
                    return new ApiResponseDTO<VolunteerScheduleDTO>
                    {
                        Success = false,
                        Message = "Volunteer has scheduling conflicts during the specified time"
                    };
                }

                var schedule = new VolunteerSchedule
                {
                    VolunteerId = request.VolunteerId,
                    EventId = request.EventId,
                    Title = request.Title,
                    Description = request.Description,
                    StartDateTime = request.StartDateTime,
                    EndDateTime = request.EndDateTime,
                    Status = request.Status ?? "Scheduled",
                    Notes = request.Notes,
                    CreatedBy = createdByUserId,
                    CreatedAt = DateTime.UtcNow
                };

                var createdSchedule = await _scheduleRepository.CreateAsync(schedule);
                var scheduleDTO = _mapper.Map<VolunteerScheduleDTO>(createdSchedule);

                return new ApiResponseDTO<VolunteerScheduleDTO>
                {
                    Success = true,
                    Message = "Volunteer schedule created successfully",
                    Data = scheduleDTO
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<VolunteerScheduleDTO>
                {
                    Success = false,
                    Message = "Failed to create volunteer schedule",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<VolunteerScheduleDTO>> UpdateVolunteerScheduleAsync(int organizationId, int scheduleId, VolunteerScheduleRequestDTO request, int updatedByUserId)
        {
            try
            {
                var existingSchedule = await _scheduleRepository.GetByIdAsync(scheduleId);
                if (existingSchedule == null)
                {
                    return new ApiResponseDTO<VolunteerScheduleDTO>
                    {
                        Success = false,
                        Message = "Schedule not found"
                    };
                }

                // Verify the schedule belongs to the organization through event
                if (existingSchedule.Event?.OrganizationId != organizationId)
                {
                    return new ApiResponseDTO<VolunteerScheduleDTO>
                    {
                        Success = false,
                        Message = "Schedule does not belong to your organization"
                    };
                }

                // Update properties
                existingSchedule.Title = request.Title;
                existingSchedule.Description = request.Description;
                existingSchedule.StartDateTime = request.StartDateTime;
                existingSchedule.EndDateTime = request.EndDateTime;
                existingSchedule.Status = request.Status ?? existingSchedule.Status;
                existingSchedule.Notes = request.Notes;
                existingSchedule.UpdatedAt = DateTime.UtcNow;

                var updatedSchedule = await _scheduleRepository.UpdateAsync(existingSchedule);
                var scheduleDTO = _mapper.Map<VolunteerScheduleDTO>(updatedSchedule);

                return new ApiResponseDTO<VolunteerScheduleDTO>
                {
                    Success = true,
                    Message = "Volunteer schedule updated successfully",
                    Data = scheduleDTO
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<VolunteerScheduleDTO>
                {
                    Success = false,
                    Message = "Failed to update volunteer schedule",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<bool>> DeleteVolunteerScheduleAsync(int organizationId, int scheduleId)
        {
            try
            {
                var existingSchedule = await _scheduleRepository.GetByIdAsync(scheduleId);
                if (existingSchedule == null)
                {
                    return new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Schedule not found"
                    };
                }

                // Verify the schedule belongs to the organization through event
                if (existingSchedule.Event?.OrganizationId != organizationId)
                {
                    return new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Schedule does not belong to your organization"
                    };
                }

                var success = await _scheduleRepository.DeleteAsync(scheduleId);

                return new ApiResponseDTO<bool>
                {
                    Success = success,
                    Message = success ? "Volunteer schedule deleted successfully" : "Failed to delete volunteer schedule",
                    Data = success
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<bool>
                {
                    Success = false,
                    Message = "Failed to delete volunteer schedule",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        // Volunteer personal schedule methods - for volunteers to view their own schedules
        public async Task<ApiResponseDTO<PagedResultDto<VolunteerScheduleDTO>>> GetPersonalSchedulesAsync(int userId, VolunteerScheduleFilterDTO filter)
        {
            try
            {
                // Find volunteer by user ID
                var volunteer = await _volunteerRepository.GetVolunteerProfileById(userId);
                
                if (volunteer == null)
                {
                    return new ApiResponseDTO<PagedResultDto<VolunteerScheduleDTO>>
                    {
                        Success = false,
                        Message = "Volunteer profile not found"
                    };
                }

                var schedules = await _scheduleRepository.GetByVolunteerIdAsync(volunteer.VolunteerId, filter.StartDateFrom, filter.StartDateTo);
                var scheduleDTOs = _mapper.Map<List<VolunteerScheduleDTO>>(schedules);

                return new ApiResponseDTO<PagedResultDto<VolunteerScheduleDTO>>
                {
                    Success = true,
                    Message = "Personal schedules retrieved successfully",
                    Data = new PagedResultDto<VolunteerScheduleDTO>
                    {
                        Items = scheduleDTOs.Skip((filter.Page - 1) * filter.Size).Take(filter.Size).ToList(),
                        TotalCount = scheduleDTOs.Count,
                        PageNumber = filter.Page,
                        PageSize = filter.Size
                    }
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<PagedResultDto<VolunteerScheduleDTO>>
                {
                    Success = false,
                    Message = "Failed to retrieve personal schedules",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDTO<VolunteerScheduleDTO>> GetPersonalScheduleByIdAsync(int userId, int scheduleId)
        {
            try
            {
                // Find volunteer by user ID
                var volunteer = await _volunteerRepository.GetVolunteerProfileById(userId);
                
                if (volunteer == null)
                {
                    return new ApiResponseDTO<VolunteerScheduleDTO>
                    {
                        Success = false,
                        Message = "Volunteer profile not found"
                    };
                }

                var schedule = await _scheduleRepository.GetByIdAsync(scheduleId);
                if (schedule == null)
                {
                    return new ApiResponseDTO<VolunteerScheduleDTO>
                    {
                        Success = false,
                        Message = "Schedule not found"
                    };
                }

                // Verify the schedule belongs to this volunteer
                if (schedule.VolunteerId != volunteer.VolunteerId)
                {
                    return new ApiResponseDTO<VolunteerScheduleDTO>
                    {
                        Success = false,
                        Message = "Schedule does not belong to you"
                    };
                }

                var scheduleDTO = _mapper.Map<VolunteerScheduleDTO>(schedule);

                return new ApiResponseDTO<VolunteerScheduleDTO>
                {
                    Success = true,
                    Message = "Schedule retrieved successfully",
                    Data = scheduleDTO
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDTO<VolunteerScheduleDTO>
                {
                    Success = false,
                    Message = "Failed to retrieve schedule",
                    Errors = new List<string> { ex.Message }
                };
            }
        }
    }
}
