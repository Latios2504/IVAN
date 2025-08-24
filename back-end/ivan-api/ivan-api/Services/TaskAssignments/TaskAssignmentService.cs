using AutoMapper;
using ivan_api.Repository.TaskAssignments;
using ivan_api.Models;
using ivan_api.DTOs.TaskAssignments;

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
    }
}
