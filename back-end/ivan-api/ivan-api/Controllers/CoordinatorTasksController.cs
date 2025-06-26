using ivan_api.DTOs.CoordinatorTask;
using ivan_api.Services.CoordinatorTaskServ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoordinatorTasksController : ControllerBase
    {
        private readonly ICoordinatorTaskService _service;

        public CoordinatorTasksController(ICoordinatorTaskService service)
        {
            _service = service;
        }

        // ❓Xem tất cả nhiệm vụ
        [HttpGet]
        //[Authorize(Roles = "Organization,VolunteerCoordinator")]
        public async Task<IActionResult> GetAll()
        {
            // Nếu là VolunteerCoordinator, chỉ lấy nhiệm vụ của mình
            var role = User.FindFirst("role")?.Value;
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");

            var tasks = await _service.GetAllTasksAsync();

            if (role == "VolunteerCoordinator")
                tasks = tasks.Where(t => t.CoordinatorName == User.Identity?.Name).ToList();

            return Ok(tasks);
        }

        // ❓Xem chi tiết
        [HttpGet("{id}")]
        //[Authorize(Roles = "Organization,VolunteerCoordinator")]
        public async Task<IActionResult> Get(int id)
        {
            var task = await _service.GetTaskByIdAsync(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        // ✅ Tạo mới
        [HttpPost]
        //[Authorize(Roles = "Organization")]
        public async Task<IActionResult> Create([FromBody] CoordinatorTaskCreateDto dto)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var taskId = await _service.CreateTaskAsync(dto, userId);
            return CreatedAtAction(nameof(Get), new { id = taskId }, null);
        }

        // 🛠 Cập nhật
        [HttpPut("{id}")]
        //[Authorize(Roles = "Organization,VolunteerCoordinator")]
        public async Task<IActionResult> Update(int id, [FromBody] CoordinatorTaskUpdateDto dto)
        {
            var updated = await _service.UpdateTaskAsync(id, dto);
            return updated ? NoContent() : NotFound();
        }

        // ❌ Xoá
        [HttpDelete("{id}")]
        //[Authorize(Roles = "Organization")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteTaskAsync(id);
            return deleted ? NoContent() : NotFound();
        }

        // 📤 Xuất Excel
        [HttpGet("export")]
        //[Authorize(Roles = "Organization,VolunteerCoordinator")]
        public async Task<IActionResult> Export()
        {
            var file = await _service.ExportToExcelAsync();
            return File(file, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "coordinator_tasks.xlsx");
        }
    }
}
