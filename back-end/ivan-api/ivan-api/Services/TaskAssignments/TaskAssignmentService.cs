using AutoMapper;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.OnSiteTasks;
using ivan_api.DTOs.TaskAssignments;
using ivan_api.Models;
using ivan_api.Repository.TaskAssignments;
using System.Linq;

namespace ivan_api.Services.TaskAssignments
{
    public class TaskAssignmentService : ITaskAssignmentService
    {
        private readonly ITaskAssignmentRepository _repository;
        private readonly IMapper _mapper;

        public TaskAssignmentService(ITaskAssignmentRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<bool> AddTaskAssignment(TaskAssignmentInputModel taskAssignmentInputModel)
        {
            var task = _mapper.Map<TaskAssignment>(taskAssignmentInputModel);
            task.CreatedAt = DateTime.Now;
            task.UpdatedAt = DateTime.Now;

            return await _repository.AddTaskAssignment(task);
        }

        public async Task<bool> UpdateTaskAssignment(TaskAssignmentUpdateModel TaskAssignmentUpdateModel, int id)
        {
            var existingAssignment = await _repository.GetTaskAssignmentById(id);
            if (existingAssignment == null)
            {
                throw new Exception("Task Assignment not found");
            }

            _mapper.Map(TaskAssignmentUpdateModel, existingAssignment);
            existingAssignment.UpdatedAt = DateTime.Now;

            return await _repository.UpdateTaskAssignment(existingAssignment);
        }

        public async Task<bool> DeleteTaskAssignment(int id)
        {
            try
            {
                return await _repository.DeleteTaskAssignment(id);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<TaskAssignment>> GetTaskAssignmentsByVolunteerId(int volunteerId, int? eventId = null)
        {
            var allAssignments = await _repository.GetAllTaskAssignments();
            
            var volunteerAssignments = allAssignments.Where(a => a.VolunteerId == volunteerId);
            
            if (eventId.HasValue)
            {
                volunteerAssignments = volunteerAssignments.Where(a => a.Task.EventId == eventId.Value);
            }
            
            return volunteerAssignments.ToList();
        }

        public async Task<IEnumerable<MyTaskAssignmentDto>> GetMyTaskAssignmentsByVolunteerId(int volunteerId, int? eventId = null)
        {
            var allAssignments = await _repository.GetAllTaskAssignments();
            
            var volunteerAssignments = allAssignments.Where(a => a.VolunteerId == volunteerId);
            
            if (eventId.HasValue)
            {
                volunteerAssignments = volunteerAssignments.Where(a => a.Task.EventId == eventId.Value);
            }
            
            var result = volunteerAssignments.Select(assignment => new MyTaskAssignmentDto
            {
                // TaskAssignment properties
                AssignmentId = assignment.AssignmentId,
                TaskId = assignment.TaskId,
                VolunteerId = assignment.VolunteerId,
                AssignedDate = assignment.AssignedDate,
                AssignedBy = assignment.AssignedBy,
                AssignmentStatus = assignment.Status,
                StartedAt = assignment.StartedAt,
                CompletedAt = assignment.CompletedAt,
                HoursWorked = assignment.HoursWorked,
                Performance = assignment.Performance,
                AssignmentNotes = assignment.Notes,
                AssignmentCreatedAt = assignment.CreatedAt,
                AssignmentUpdatedAt = assignment.UpdatedAt,

                // OnSiteTask properties
                TaskName = assignment.Task.TaskName,
                TaskDescription = assignment.Task.Description,
                EventId = assignment.Task.EventId,
                EventName = assignment.Task.Event?.EventName,
                LocationId = null, // OnSiteTask doesn't have LocationId, only Location string
                LocationName = assignment.Task.Location,
                StartTime = assignment.Task.StartTime ?? DateTime.MinValue,
                EndTime = assignment.Task.EndTime ?? DateTime.MinValue,
                EstimatedHours = (int)(assignment.Task.EstimatedHours ?? 0),
                ActualHours = (int?)(assignment.Task.ActualHours),
                StatusId = assignment.Task.StatusId,
                StatusName = assignment.Task.Status?.StatusName,
                PriorityId = null, // OnSiteTask doesn't have PriorityId, only Priority string
                PriorityName = assignment.Task.Priority,
                TaskNotes = assignment.Task.Notes,
                TaskCreatedAt = assignment.Task.CreatedAt ?? DateTime.MinValue,
                TaskUpdatedAt = assignment.Task.UpdatedAt,

                // Additional info - need to access through UserProfile
                AssignedByName = assignment.AssignedByNavigation?.UserProfiles?.FirstOrDefault()?.FullName,
                VolunteerName = assignment.Volunteer?.User?.UserProfiles?.FirstOrDefault()?.FullName
            }).ToList();
            
            return result;
        }

        public async Task<PagedResultDto<TaskAssignment>> GetVolunteerAssignmentsPagedAsync(
            int volunteerId,
            int pageNumber,
            int pageSize,
            int? eventId,
            int? statusId,
            DateTime? from,
            DateTime? to)
        {
            return await _repository.GetVolunteerAssignmentsPaged(
                volunteerId, pageNumber, pageSize, eventId, statusId, from, to);
        }

        public Task<PagedResultDto<CoordinatorAssignedTaskListItemDto>> GetAssignmentsAssignedByCoordinatorAsync(
            int coordinatorUserId, int pageNumber, int pageSize,
            int? eventId, int? statusId, int? volunteerId, DateTime? from, DateTime? to)
        {
            return _repository.GetAssignmentsByAssignedByPaged(
                coordinatorUserId, pageNumber, pageSize, eventId, statusId, volunteerId, from, to);
        }
    }
}
