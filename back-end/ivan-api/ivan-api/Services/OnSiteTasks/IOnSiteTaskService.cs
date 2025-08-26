using ivan_api.DTOs.Common;
using ivan_api.DTOs.OnSiteTasks;
using ivan_api.DTOs.TaskAssignments;

namespace ivan_api.Services.OnSiteTasks
{
    public interface IOnSiteTaskService
    {
        Task<bool> AddOnSiteTask(OnSiteTaskInputModel onSiteTaskInputModel, int createdById);
        Task<bool> UpdateOnSiteTask(OnSiteTaskUpdateModel OnSiteTaskUpdateModel, int id);
        Task<bool> DeleteOnSiteTask(int taskId);
        Task<IEnumerable<OnSiteTaskViewModel>> ListOnSiteTask(OnSiteTaskFilterModel filter);
        Task<OnSiteTaskViewModel> GetOnSiteTaskById(int id);
        Task<PagedResultDto<OnSiteTaskViewModel>> GetList(int pageNumber, int pageSize);
        Task<int> GetLastId();
        Task<bool> AssignAllOnSiteTask(int id);
        Task<bool> StartAllOnSiteTask(int id);
        Task<bool> CompleteAllOnSiteTask(int id);
        Task<bool> CompleteTask(int taskId, int volunteerId);
        Task<bool> UnassigTask(int taskId, int volunteerId);
        Task<IEnumerable<TaskAssignmentViewModel>> GetTaskAssignmentsById(int id);
        Task<bool> AssignTask(int taskId, int volunteerId);
        Task<bool> StartTask(int taskId, int volunteerId);
        Task<TaskAssignmentViewModel> SearchTaskAssignment(int taskId, int volunteerId);
        Task<PagedResultDto<OnSiteTaskViewModel>> GetListForCoordinator(int pageNumber, int pageSize, string idValue);
    }
}
