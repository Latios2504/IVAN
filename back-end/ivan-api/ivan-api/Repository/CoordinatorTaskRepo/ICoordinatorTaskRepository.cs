using ivan_api.DTOs.Common;
using ivan_api.DTOs.CoordinatorTask;
using ivan_api.Models;

namespace ivan_api.Repository.CoordinatorTaskRepo
{
    public interface ICoordinatorTaskRepository
    {
        Task<IEnumerable<CoordinatorTask>> GetAllAsync();
        Task<CoordinatorTask?> GetByIdAsync(int id);
        Task AddAsync(CoordinatorTask task);
        void Update(CoordinatorTask task);
        Task SaveChangesAsync();

        // NEW:
        Task<PagedResultDto<CoordinatorTask>> GetOrgTasksAsync(int organizationId, CoordinatorTaskFilterDto filter);
        Task<PagedResultDto<CoordinatorTask>> GetPersonalTasksAsync(int coordinatorId, CoordinatorTaskFilterDto filter);
        Task<CoordinatorTask?> GetByIdAndOrganizationAsync(int taskId, int organizationId);

    }
}
