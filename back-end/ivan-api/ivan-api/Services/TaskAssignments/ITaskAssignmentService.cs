using ivan_api.DTOs.TaskAssignments;

namespace ivan_api.Services.TaskAssignments
{
    public interface ITaskAssignmentService
    {
        Task<bool> AddTaskAssignment(TaskAssignmentInputModel taskAssignmentInputModel);
        Task<bool> UpdateTaskAssignment(TaskAssignmentUpdateModel TaskAssignmentUpdateModel, int id);
        Task<bool> DeleteTaskAssignment(int id);
    }
}
