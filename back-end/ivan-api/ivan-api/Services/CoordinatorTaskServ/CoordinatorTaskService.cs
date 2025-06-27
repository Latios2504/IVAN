using ivan_api.DTOs.CoordinatorTask;
using ivan_api.Models;
using ivan_api.Repository.CoordinatorTaskRepo;

namespace ivan_api.Services.CoordinatorTaskServ
{
    public class CoordinatorTaskService : ICoordinatorTaskService
    {
        private readonly ICoordinatorTaskRepository _repository;

        public CoordinatorTaskService(ICoordinatorTaskRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<CoordinatorTaskDto>> GetAllTasksAsync()
        {
            var tasks = await _repository.GetAllAsync();
            var listTaskDTO = tasks.Select(x => new CoordinatorTaskDto
            {
                EventId = x.EventId,
                CoordinatorId = x.CoordinatorId,
                TaskName = x.TaskName,
                Description = x.Description,
                DueDate = x.DueDate,
                Priority = x.Priority,
                Status = x.Status,
                Category = x.Category,
                EstimatedHours = x.EstimatedHours,
                ActualHours = x.ActualHours,
                CompletedAt = x.CompletedAt,
                Notes = x.Notes
            });
            return listTaskDTO;
        }

        public async Task<CoordinatorTaskDto> GetTaskByIdAsync(int id)
        {
            var tasks = await _repository.GetByIdAsync(id);
            if (tasks == null) return null!; // Handle not found case
            var taskDto = new CoordinatorTaskDto
            {
                EventId = tasks.EventId,
                CoordinatorId = tasks.CoordinatorId,
                TaskName = tasks.TaskName,
                Description = tasks.Description,
                DueDate = tasks.DueDate,
                Priority = tasks.Priority,
                Status = tasks.Status,
                Category = tasks.Category,
                EstimatedHours = tasks.EstimatedHours,
                ActualHours = tasks.ActualHours,
                CompletedAt = tasks.CompletedAt,
                Notes = tasks.Notes
            };
            return taskDto;
        }

        public async Task<CoordinatorTask> CreateTaskAsync(CoordinatorTaskDto dto, int createdBy)
        {
            var task = new CoordinatorTask
            {
                EventId = dto.EventId,
                CoordinatorId = dto.CoordinatorId,
                TaskName = dto.TaskName,
                Description = dto.Description,
                DueDate = dto.DueDate,
                Priority = dto.Priority,
                Status = dto.Status ?? "Chưa bắt đầu",
                Category = dto.Category,
                EstimatedHours = dto.EstimatedHours,
                ActualHours = dto.ActualHours,
                CompletedAt = dto.CompletedAt,
                Notes = dto.Notes,
                CreatedBy = createdBy,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(task);
            await _repository.SaveChangesAsync();

            return task;
        }

        public async Task<CoordinatorTask?> UpdateTaskAsync(int id, CoordinatorTaskDto dto)
        {
            var task = await _repository.GetByIdAsync(id);
            if (task == null) return null;

            task.TaskName = dto.TaskName;
            task.Description = dto.Description;
            task.DueDate = dto.DueDate;
            task.Priority = dto.Priority;
            task.Status = dto.Status;
            task.Category = dto.Category;
            task.EstimatedHours = dto.EstimatedHours;
            task.ActualHours = dto.ActualHours;
            task.CompletedAt = dto.CompletedAt;
            task.Notes = dto.Notes;
            task.UpdatedAt = DateTime.UtcNow;

            _repository.Update(task);
            await _repository.SaveChangesAsync();

            return task;
        }
    }
}
