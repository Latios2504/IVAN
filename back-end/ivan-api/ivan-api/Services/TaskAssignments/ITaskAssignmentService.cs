using ivan_api.DTOs.Common;
using ivan_api.DTOs.OnSiteTasks;
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

        Task<PagedResultDto<TaskAssignment>> GetVolunteerAssignmentsPagedAsync(
            int volunteerId,
            int pageNumber,
            int pageSize,
            int? eventId,
            int? statusId,
            DateTime? from,
            DateTime? to);

        Task<PagedResultDto<CoordinatorAssignedTaskListItemDto>> GetAssignmentsAssignedByCoordinatorAsync(
    int coordinatorUserId,
    int pageNumber,
    int pageSize,
    int? eventId,
    int? statusId,
    int? volunteerId,
    DateTime? from,
    DateTime? to);
    }
}
