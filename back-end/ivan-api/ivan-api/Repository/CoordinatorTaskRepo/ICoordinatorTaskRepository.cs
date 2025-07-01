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
    }
}
