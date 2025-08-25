using ivan_api.DTOs.CoordinatorTask;
using ivan_api.Models;

namespace ivan_api.Services.CoordinatorTaskServ
{
    public interface ICoordinatorTaskService
    {
        Task<IEnumerable<CoordinatorTaskDto>> GetAllTasksAsync();
        Task<CoordinatorTaskDto> GetTaskByIdAsync(int id);
        Task<CoordinatorTaskDto> CreateTaskAsync(CreateCoordinatorTaskDto dto, int createdBy);
        Task<CoordinatorTaskDto?> UpdateTaskAsync(int id, UpdateCoordinatorTaskDto dto);
    }
}
