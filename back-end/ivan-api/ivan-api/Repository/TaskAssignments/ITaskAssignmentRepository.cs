using DocumentFormat.OpenXml.InkML;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Repository.TaskAssignments
{
    public interface ITaskAssignmentRepository
    {
        Task<bool> AddTaskAssignment(TaskAssignment taskAssignment);
        Task<bool> UpdateTaskAssignment(TaskAssignment taskAssignment);
        Task<bool> DeleteTaskAssignment(int id);
        Task<TaskAssignment> GetTaskAssignmentById(int id);
        Task<TaskAssignment> SearchTaskAssignment(int? taskId, int? volunteerId);
        Task<IEnumerable<TaskAssignment>> SearchTaskAssignmentsByTaskId(int taskId);
        Task<IEnumerable<TaskAssignment>> SearchTaskAssignmentsByEventId(int eventId);
        Task<IEnumerable<TaskAssignment>> GetAllTaskAssignments();
        Task<int> GetLastId();
    }
}
