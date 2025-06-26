using AutoMapper;
using ClosedXML.Excel;
using ivan_api.DTOs.CoordinatorTask;
using ivan_api.Models;
using ivan_api.Repository.CoordinatorTaskRepo;

namespace ivan_api.Services.CoordinatorTaskServ
{
    public class CoordinatorTaskService : ICoordinatorTaskService
    {
        private readonly ICoordinatorTaskRepository _repo;
        private readonly IMapper _mapper;

        public CoordinatorTaskService(ICoordinatorTaskRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<int> CreateTaskAsync(CoordinatorTaskCreateDto dto, int creatorId)
        {
            var task = _mapper.Map<CoordinatorTask>(dto);
            task.CreatedBy = creatorId;
            task.CreatedAt = DateTime.UtcNow;
            task.UpdatedAt = DateTime.UtcNow;

            await _repo.AddAsync(task);
            await _repo.SaveChangesAsync();
            return task.TaskId;
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            var task = await _repo.GetByIdAsync(id);
            if (task == null) return false;

            _repo.Delete(task);
            return await _repo.SaveChangesAsync();
        }

        public async Task<byte[]> ExportToExcelAsync()
        {
            var tasks = await _repo.GetAllAsync();

            using var workbook = new XLWorkbook();
            var sheet = workbook.Worksheets.Add("Coordinator Tasks");

            sheet.Cell(1, 1).Value = "Task ID";
            sheet.Cell(1, 2).Value = "Task Name";
            sheet.Cell(1, 3).Value = "Coordinator";
            sheet.Cell(1, 4).Value = "Event";
            sheet.Cell(1, 5).Value = "Status";
            sheet.Cell(1, 6).Value = "Due Date";

            int row = 2;
            foreach (var t in tasks)
            {
                sheet.Cell(row, 1).Value = t.TaskId;
                sheet.Cell(row, 2).Value = t.TaskName;
                sheet.Cell(row, 3).Value = t.Coordinator?.Email ?? "";
                sheet.Cell(row, 4).Value = t.Event?.EventName ?? "";
                sheet.Cell(row, 5).Value = t.Status ?? "";
                sheet.Cell(row, 6).Value = t.DueDate?.ToString("yyyy-MM-dd");
                row++;
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }

        public async Task<IEnumerable<CoordinatorTaskDto>> GetAllTasksAsync()
        {
            var tasks = await _repo.GetAllAsync();
            return tasks.Select(_mapper.Map<CoordinatorTaskDto>);
        }

        public async Task<CoordinatorTaskDto?> GetTaskByIdAsync(int id)
        {
            var task = await _repo.GetByIdAsync(id);
            return task == null ? null : _mapper.Map<CoordinatorTaskDto>(task);
        }

        public async Task<bool> UpdateTaskAsync(int id, CoordinatorTaskUpdateDto dto)
        {
            var task = await _repo.GetByIdAsync(id);
            if (task == null) return false;

            _mapper.Map(dto, task); // chỉ map trường nào không null (do dùng .Condition)
            task.UpdatedAt = DateTime.UtcNow;

            _repo.Update(task);
            return await _repo.SaveChangesAsync();
        }
    }
}
