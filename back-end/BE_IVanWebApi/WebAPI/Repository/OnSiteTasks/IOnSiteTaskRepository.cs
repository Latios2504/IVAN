using WebAPI.Data.Entities;
using WebAPI.Models.OnSiteTasks;

namespace WebAPI.Repository.OnSiteTasks
{
    public interface IOnSiteTaskRepository
    {
        Task<bool> AddOnSiteTask(OnSiteTask onSiteTask);
        Task<bool> UpdateOnSiteTask(OnSiteTask onSiteTask);
        Task<IEnumerable<OnSiteTask>> ListOnSiteTask(OnSiteTaskFilterModel filter);
        Task<OnSiteTask> GetOnSiteTaskById(int id);
    }
}
