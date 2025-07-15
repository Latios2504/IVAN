using ivan_api.DTOs.OnSiteTasks;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.OnSiteTasks
{
    public interface IOnSiteTaskService
    {
        Task<bool> AddOnSiteTask(OnSiteTaskInputModel onSiteTaskInputModel);
        Task<bool> UpdateOnSiteTask(OnSiteTaskViewModel onSiteTaskViewModel);
        Task<IEnumerable<OnSiteTaskViewModel>> ListOnSiteTask(OnSiteTaskFilterModel filter);
        Task<OnSiteTaskViewModel> GetOnSiteTaskById(int id);
        Task<PagedResultDto<OnSiteTaskViewModel>> GetList(int pageNumber, int pageSize);
    }
}
