using ivan_api.DTOs.TaskAssignments;
using ivan_api.Models;

namespace ivan_api.Services.TaskAssignments
{
    public interface ITaskAssignmentService
    {
        Task<bool> AddTaskAssignment(TaskAssignmentInputModel taskAssignmentInputModel);
        Task<bool> UpdateTaskAssignment(TaskAssignmentUpdateModel TaskAssignmentUpdateModel, int id);
        Task<bool> DeleteTaskAssignment(int id);
        Task<IEnumerable<TaskAssignment>> GetTaskAssignmentsByVolunteerId(int volunteerId, int? eventId = null);
        Task<IEnumerable<MyTaskAssignmentDto>> GetMyTaskAssignmentsByVolunteerId(int volunteerId, int? eventId = null);
    }
}
