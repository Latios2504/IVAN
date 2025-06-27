using ivan_api.DTOs.CoordinatorTask;
using ivan_api.Models;

namespace ivan_api.Services.CoordinatorTaskServ
{
    public interface ICoordinatorTaskService
    {
        Task<IEnumerable<CoordinatorTaskDto>> GetAllTasksAsync();
        Task<CoordinatorTaskDto> GetTaskByIdAsync(int id);
        Task<CoordinatorTask> CreateTaskAsync(CoordinatorTaskDto dto, int createdBy);
        Task<CoordinatorTask?> UpdateTaskAsync(int id, CoordinatorTaskDto dto);
    }
}
