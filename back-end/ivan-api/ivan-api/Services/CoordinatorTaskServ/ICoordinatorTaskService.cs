using ivan_api.DTOs.CoordinatorTask;

namespace ivan_api.Services.CoordinatorTaskServ
{
    public interface ICoordinatorTaskService
    {
        Task<IEnumerable<CoordinatorTaskDto>> GetAllTasksAsync();
        Task<CoordinatorTaskDto?> GetTaskByIdAsync(int id);
        Task<int> CreateTaskAsync(CoordinatorTaskCreateDto dto, int creatorId);
        Task<bool> UpdateTaskAsync(int id, CoordinatorTaskUpdateDto dto);
        Task<bool> DeleteTaskAsync(int id);
        Task<byte[]> ExportToExcelAsync(); // tùy chọn export
    }
}
