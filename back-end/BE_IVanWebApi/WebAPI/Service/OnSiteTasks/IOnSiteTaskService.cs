using WebAPI.Models.OnSiteTasks;

namespace WebAPI.Service.OnSiteTasks
{
    public interface IOnSiteTaskService
    {
        Task<bool> AddOnSiteTask(OnSiteTaskInputModel onSiteTaskInputModel);
        Task<bool> UpdateOnSiteTask(OnSiteTaskViewModel onSiteTaskViewModel);
        Task<IEnumerable<OnSiteTaskViewModel>> ListOnSiteTask(OnSiteTaskFilterModel filter);
        Task<OnSiteTaskViewModel> GetOnSiteTaskById(int id);
    }
}
