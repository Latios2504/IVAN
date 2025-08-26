using AutoMapper;
using ivan_api.DTOs.VolunteerSchedule;
using ivan_api.DTOs.Common;
using ivan_api.Models;
using ivan_api.Repository.VolunteerScheduleRepo;
using ivan_api.Repository.VolunteerProfileRepo;
using ivan_api.Repository.EventRepo;
using ivan_api.Constants;

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
        public async Task<PagedResultDto<VolunteerScheduleDTO>> GetOrganizationVolunteerSchedulesAsync(int organizationId, VolunteerScheduleFilterDTO filter)
        {
            var result = await _scheduleRepository.GetOrganizationVolunteerSchedulesAsync(organizationId, filter);
            var scheduleDTOs = _mapper.Map<List<VolunteerScheduleDTO>>(result.Items);

            return new PagedResultDto<VolunteerScheduleDTO>
            {
                Items = scheduleDTOs,
                TotalCount = result.TotalCount,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize
            };
        }

        public async Task<VolunteerScheduleDTO?> GetVolunteerScheduleByIdAsync(int organizationId, int scheduleId)
        {
            var schedule = await _scheduleRepository.GetByIdAsync(scheduleId);
            if (schedule == null)
                return null;

            // Verify the schedule belongs to the organization through event
            if (schedule.Event?.OrganizationId != organizationId)
                throw new UnauthorizedAccessException("Schedule does not belong to your organization");

            return _mapper.Map<VolunteerScheduleDTO>(schedule);
        }

        public async Task<VolunteerScheduleDTO> CreateVolunteerScheduleAsync(int organizationId, VolunteerScheduleRequestDTO request, int createdByUserId)
        {
            // Verify volunteer exists
            var volunteer = await _volunteerRepository.GetVolunteerProfileByVolunteerId(request.VolunteerId);
            if (volunteer == null)
                throw new ArgumentException("Volunteer not found");

            // Verify event belongs to organization (if event is specified)
            if (request.EventId.HasValue)
            {
                var eventDetails = await _eventRepository.GetByIdAsync(request.EventId.Value);
                if (eventDetails == null || eventDetails.OrganizationId != organizationId)
                    throw new ArgumentException("Event not found or does not belong to your organization");
            }



            var schedule = new VolunteerSchedule
            {
                VolunteerId = request.VolunteerId,
                EventId = request.EventId,
                Title = request.Title,
                Description = request.Description,
                StartDateTime = request.StartDateTime,
                EndDateTime = request.EndDateTime,
                Status = request.Status ?? ScheduleConstants.Status.Scheduled,
                Notes = request.Notes,
                CreatedBy = createdByUserId,
                CreatedAt = DateTime.UtcNow
            };

            var createdSchedule = await _scheduleRepository.CreateAsync(schedule);
            return _mapper.Map<VolunteerScheduleDTO>(createdSchedule);
        }

        public async Task<VolunteerScheduleDTO> UpdateVolunteerScheduleAsync(int organizationId, int scheduleId, VolunteerScheduleRequestDTO request, int updatedByUserId)
        {
            var existingSchedule = await _scheduleRepository.GetByIdAsync(scheduleId);
            if (existingSchedule == null)
                throw new ArgumentException("Schedule not found");

            // Verify the schedule belongs to the organization through event
            if (existingSchedule.Event?.OrganizationId != organizationId)
                throw new UnauthorizedAccessException("Schedule does not belong to your organization");

            // Validate status transition if status is being updated
            if (!string.IsNullOrEmpty(request.Status) && request.Status != existingSchedule.Status)
            {
                if (!string.IsNullOrEmpty(existingSchedule.Status) && 
                    !ScheduleConstants.IsValidStatusTransition(existingSchedule.Status, request.Status))
                {
                    throw new InvalidOperationException(
                        $"Invalid status transition from '{existingSchedule.Status}' to '{request.Status}'. " +
                        $"Valid transitions from '{existingSchedule.Status}' are: {string.Join(", ", ScheduleConstants.ValidStatusTransitions.GetValueOrDefault(existingSchedule.Status, new List<string>()))}");
                }
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
            return _mapper.Map<VolunteerScheduleDTO>(updatedSchedule);
        }

        public async Task<bool> UpdateScheduleStatusAsync(int organizationId, int scheduleId, string status, int updatedBy)
        {
            var schedule = await _scheduleRepository.GetByIdAsync(scheduleId);
            
            if (schedule == null)
                throw new ArgumentException("Schedule not found");

            // Verify the schedule belongs to the organization through event
            if (schedule.Event?.OrganizationId != organizationId)
                throw new UnauthorizedAccessException("Schedule does not belong to your organization");

            // Validate status transition if current status exists
            if (!string.IsNullOrEmpty(schedule.Status) && 
                !ScheduleConstants.IsValidStatusTransition(schedule.Status, status))
            {
                throw new InvalidOperationException(
                    $"Invalid status transition from '{schedule.Status}' to '{status}'. " +
                    $"Valid transitions from '{schedule.Status}' are: {string.Join(", ", ScheduleConstants.ValidStatusTransitions.GetValueOrDefault(schedule.Status, new List<string>()))}");
            }

            schedule.Status = status;
            schedule.UpdatedAt = DateTime.UtcNow;

            var updatedSchedule = await _scheduleRepository.UpdateAsync(schedule);
            return updatedSchedule != null;
        }

        public async Task<bool> DeleteVolunteerScheduleAsync(int organizationId, int scheduleId)
        {
            var existingSchedule = await _scheduleRepository.GetByIdAsync(scheduleId);
            if (existingSchedule == null)
                throw new ArgumentException("Schedule not found");

            // Verify the schedule belongs to the organization through event
            if (existingSchedule.Event?.OrganizationId != organizationId)
                throw new UnauthorizedAccessException("Schedule does not belong to your organization");

            return await _scheduleRepository.DeleteAsync(scheduleId);
        }

        // Volunteer personal schedule methods - for volunteers to view their own schedules
        public async Task<PagedResultDto<VolunteerScheduleDTO>> GetPersonalSchedulesAsync(int userId, VolunteerScheduleFilterDTO filter)
        {
            // Find volunteer by user ID
            var volunteer = await _volunteerRepository.GetVolunteerProfileById(userId);
            
            if (volunteer == null)
                throw new ArgumentException("Volunteer profile not found");

            var schedules = await _scheduleRepository.GetByVolunteerIdAsync(volunteer.VolunteerId, filter.StartDateFrom, filter.StartDateTo);
            var scheduleDTOs = _mapper.Map<List<VolunteerScheduleDTO>>(schedules);

            return new PagedResultDto<VolunteerScheduleDTO>
            {
                Items = scheduleDTOs.Skip((filter.Page - 1) * filter.Size).Take(filter.Size).ToList(),
                TotalCount = scheduleDTOs.Count,
                PageNumber = filter.Page,
                PageSize = filter.Size
            };
        }

        public async Task<VolunteerScheduleDTO?> GetPersonalScheduleByIdAsync(int userId, int scheduleId)
        {
            // Find volunteer by user ID
            var volunteer = await _volunteerRepository.GetVolunteerProfileById(userId);
            
            if (volunteer == null)
                throw new ArgumentException("Volunteer profile not found");

            var schedule = await _scheduleRepository.GetByIdAsync(scheduleId);
            if (schedule == null)
                return null;

            // Verify the schedule belongs to this volunteer
            if (schedule.VolunteerId != volunteer.VolunteerId)
                throw new UnauthorizedAccessException("Schedule does not belong to you");

            return _mapper.Map<VolunteerScheduleDTO>(schedule);
        }


    }
}
