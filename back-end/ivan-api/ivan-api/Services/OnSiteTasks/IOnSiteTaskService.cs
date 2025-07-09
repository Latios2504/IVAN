using ivan_api.DTOs.OnSiteTasks;

namespace ivan_api.Services.OnSiteTasks
{
    public interface IOnSiteTaskService
    {
        Task<bool> AddOnSiteTask(OnSiteTaskInputModel onSiteTaskInputModel);
        Task<bool> UpdateOnSiteTask(OnSiteTaskViewModel onSiteTaskViewModel);
        Task<IEnumerable<OnSiteTaskViewModel>> ListOnSiteTask(OnSiteTaskFilterModel filter);
        Task<OnSiteTaskViewModel> GetOnSiteTaskById(int id);
    }
}
