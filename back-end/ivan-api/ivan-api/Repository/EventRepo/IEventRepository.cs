using ivan_api.Models;

namespace ivan_api.Repository.EventRepo
{
    public interface IEventRepository
    {
        Task<IEnumerable<Event>> GetAllAsync();
        Task<Event?> GetByIdAsync(int id);
        Task AddAsync(Event evt);
        Task UpdateAsync(Event evt);
    }
}
