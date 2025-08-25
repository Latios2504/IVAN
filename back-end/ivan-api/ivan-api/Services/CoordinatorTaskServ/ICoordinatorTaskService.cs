using ivan_api.DTOs.Common;
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

        // NEW:
        Task<PagedResultDto<CoordinatorTaskDto>> GetOrgTasksPagedAsync(int organizationId, CoordinatorTaskFilterDto filter);
        Task<PagedResultDto<CoordinatorTaskDto>> GetPersonalTasksPagedAsync(int coordinatorId, CoordinatorTaskFilterDto filter);
        Task<CoordinatorTaskDto?> GetTaskByIdForOrgAsync(int organizationId, int taskId);

    }
}
