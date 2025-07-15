using ivan_api.Models;
using ivan_api.DTOs.OnSiteTasks;
using ivan_api.DTOs.Common;

namespace ivan_api.Repository.OnSiteTasks
{
    public interface IOnSiteTaskRepository
    {
        Task<bool> AddOnSiteTask(OnSiteTask onSiteTask);
        Task<bool> UpdateOnSiteTask(OnSiteTask onSiteTask);
        Task<IEnumerable<OnSiteTask>> ListOnSiteTask(OnSiteTaskFilterModel filter);
        Task<OnSiteTask> GetOnSiteTaskById(int id);
        Task<PagedResultDto<OnSiteTaskViewModel>> GetOnSiteTasksAsync(int PageNumber, int PageSize);
    }
}
