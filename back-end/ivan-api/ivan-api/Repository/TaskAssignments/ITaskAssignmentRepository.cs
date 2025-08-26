using DocumentFormat.OpenXml.InkML;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.OnSiteTasks;
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

        Task<PagedResultDto<TaskAssignment>> GetVolunteerAssignmentsPaged(
            int volunteerId,
            int pageNumber,
            int pageSize,
            int? eventId,
            int? statusId,
            DateTime? from,
            DateTime? to);

        Task<PagedResultDto<CoordinatorAssignedTaskListItemDto>> GetAssignmentsByAssignedByPaged(
    int assignedByUserId,
    int pageNumber,
    int pageSize,
    int? eventId,
    int? statusId,
    int? volunteerId,
    DateTime? from,
    DateTime? to);
    }
}
