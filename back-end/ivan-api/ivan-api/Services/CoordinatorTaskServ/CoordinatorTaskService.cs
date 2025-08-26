using ivan_api.DTOs.Common;
using ivan_api.DTOs.CoordinatorTask;
using ivan_api.Models;
using ivan_api.Repository.CoordinatorTaskRepo;
using ivan_api.Constants;

namespace ivan_api.Services.CoordinatorTaskServ
{
    public class CoordinatorTaskService : ICoordinatorTaskService
    {
        private readonly ICoordinatorTaskRepository _repository;
        private readonly VolunteerManagementSystemContext _context;

        public CoordinatorTaskService(ICoordinatorTaskRepository repository, VolunteerManagementSystemContext context)
        {
            _repository = repository;
            _context = context;
        }

        /// <summary>
        /// Updates only the status of a coordinator task with validation
        /// </summary>
        /// <param name="id">Task ID</param>
        /// <param name="newStatus">New status to set</param>
        /// <returns>Updated task DTO or null if not found</returns>
        public async Task<CoordinatorTaskDto?> UpdateTaskStatusAsync(int id, string newStatus)
        {
            var existingTask = await _repository.GetByIdAsync(id);
            if (existingTask == null) return null;

            // Validate status transition
            if (!TaskConstants.IsValidStatusTransition(existingTask.Status, newStatus))
            {
                throw new InvalidOperationException(
                    $"Invalid status transition from '{existingTask.Status}' to '{newStatus}'. " +
                    $"Valid transitions from '{existingTask.Status}' are: {string.Join(", ", TaskConstants.ValidStatusTransitions.GetValueOrDefault(existingTask.Status ?? "", new List<string>()))}");
            }

            // Update status and related fields
            existingTask.Status = newStatus;
            existingTask.UpdatedAt = DateTime.UtcNow;

            // Set completion timestamp if task is completed
            if (newStatus == TaskConstants.Status.Completed && existingTask.CompletedAt == null)
            {
                existingTask.CompletedAt = DateTime.UtcNow;
            }
            // Clear completion timestamp if task is moved away from completed status
            else if (newStatus != TaskConstants.Status.Completed && existingTask.CompletedAt != null)
            {
                existingTask.CompletedAt = null;
            }

            _repository.Update(existingTask);
            await _repository.SaveChangesAsync();

            return MapToDto(existingTask);
        }

        public async Task<IEnumerable<CoordinatorTaskDto>> GetAllTasksAsync()
        {
            var tasks = await _repository.GetAllAsync();
            var listTaskDTO = tasks.Select(x => new CoordinatorTaskDto
            {
                TaskId = x.TaskId,
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
                Notes = x.Notes,
                CreatedBy = x.CreatedBy,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            });
            return listTaskDTO;
        }

        public async Task<CoordinatorTaskDto> GetTaskByIdAsync(int id)
        {
            var tasks = await _repository.GetByIdAsync(id);
            if (tasks == null) return null!; // Handle not found case
            var taskDto = new CoordinatorTaskDto
            {
                TaskId = tasks.TaskId,
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
                Notes = tasks.Notes,
                CreatedBy = tasks.CreatedBy,
                CreatedAt = tasks.CreatedAt,
                UpdatedAt = tasks.UpdatedAt
            };
            return taskDto;
        }

        public async Task<CoordinatorTaskDto> CreateTaskAsync(CreateCoordinatorTaskDto dto, int createdBy)
        {
            var task = new CoordinatorTask
            {
                EventId = dto.EventId,
                CoordinatorId = dto.CoordinatorId,
                TaskName = dto.TaskName,
                Description = dto.Description,
                DueDate = dto.DueDate,
                Priority = dto.Priority,
                Status = dto.Status ?? TaskConstants.Status.Assigned,
                Category = dto.Category,
                EstimatedHours = dto.EstimatedHours,
                Notes = dto.Notes,
                CreatedBy = createdBy,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(task);
            await _repository.SaveChangesAsync();

            return new CoordinatorTaskDto
            {
                TaskId = task.TaskId,
                EventId = task.EventId,
                CoordinatorId = task.CoordinatorId,
                TaskName = task.TaskName,
                Description = task.Description,
                DueDate = task.DueDate,
                Priority = task.Priority,
                Status = task.Status,
                Category = task.Category,
                EstimatedHours = task.EstimatedHours,
                ActualHours = task.ActualHours,
                CompletedAt = task.CompletedAt,
                Notes = task.Notes,
                CreatedBy = task.CreatedBy,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt
            };
        }

        public async Task<CoordinatorTaskDto?> UpdateTaskAsync(int id, UpdateCoordinatorTaskDto dto)
        {
            var existingTask = await _repository.GetByIdAsync(id);
            if (existingTask == null) return null;

            // Validate status transition if status is being changed
            if (!string.IsNullOrEmpty(dto.Status) && dto.Status != existingTask.Status)
            {
                if (!TaskConstants.IsValidStatusTransition(existingTask.Status, dto.Status))
                {
                    throw new InvalidOperationException(
                        $"Invalid status transition from '{existingTask.Status}' to '{dto.Status}'. " +
                        $"Valid transitions from '{existingTask.Status}' are: {string.Join(", ", TaskConstants.ValidStatusTransitions.GetValueOrDefault(existingTask.Status ?? "", new List<string>()))}");
                }
            }

            existingTask.EventId = dto.EventId;
            existingTask.CoordinatorId = dto.CoordinatorId;
            existingTask.TaskName = dto.TaskName;
            existingTask.Description = dto.Description;
            existingTask.DueDate = dto.DueDate;
            existingTask.Priority = dto.Priority;
            existingTask.Status = dto.Status;
            existingTask.Category = dto.Category;
            existingTask.EstimatedHours = dto.EstimatedHours;
            existingTask.ActualHours = dto.ActualHours;
            existingTask.CompletedAt = dto.CompletedAt;
            existingTask.Notes = dto.Notes;
            existingTask.UpdatedAt = DateTime.UtcNow;

            _repository.Update(existingTask);
            await _repository.SaveChangesAsync();

            return new CoordinatorTaskDto
            {
                TaskId = existingTask.TaskId,
                EventId = existingTask.EventId,
                CoordinatorId = existingTask.CoordinatorId,
                TaskName = existingTask.TaskName,
                Description = existingTask.Description,
                DueDate = existingTask.DueDate,
                Priority = existingTask.Priority,
                Status = existingTask.Status,
                Category = existingTask.Category,
                EstimatedHours = existingTask.EstimatedHours,
                ActualHours = existingTask.ActualHours,
                CompletedAt = existingTask.CompletedAt,
                Notes = existingTask.Notes,
                CreatedBy = existingTask.CreatedBy,
                CreatedAt = existingTask.CreatedAt,
                UpdatedAt = existingTask.UpdatedAt
            };
        }

        public async Task<PagedResultDto<CoordinatorTaskDto>> GetOrgTasksPagedAsync(int organizationId, CoordinatorTaskFilterDto filter)
        {
            var page = await _repository.GetOrgTasksAsync(organizationId, filter);
            return new PagedResultDto<CoordinatorTaskDto>
            {
                Items = page.Items.Select(MapToDto),
                TotalCount = page.TotalCount,
                PageNumber = page.PageNumber,
                PageSize = page.PageSize
            };
        }

        public async Task<PagedResultDto<CoordinatorTaskDto>> GetPersonalTasksPagedAsync(int coordinatorId, CoordinatorTaskFilterDto filter)
        {
            var page = await _repository.GetPersonalTasksAsync(coordinatorId, filter);
            return new PagedResultDto<CoordinatorTaskDto>
            {
                Items = page.Items.Select(MapToDto),
                TotalCount = page.TotalCount,
                PageNumber = page.PageNumber,
                PageSize = page.PageSize
            };
        }

        public async Task<CoordinatorTaskDto?> GetTaskByIdForOrgAsync(int organizationId, int taskId)
        {
            var task = await _repository.GetByIdAndOrganizationAsync(taskId, organizationId);
            return task == null ? null : MapToDto(task);
        }

        private static CoordinatorTaskDto MapToDto(CoordinatorTask x) => new CoordinatorTaskDto
        {
            TaskId = x.TaskId,
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
            Notes = x.Notes,
            CreatedBy = x.CreatedBy,
            CreatedAt = x.CreatedAt,
            UpdatedAt = x.UpdatedAt
        };
    }
}
