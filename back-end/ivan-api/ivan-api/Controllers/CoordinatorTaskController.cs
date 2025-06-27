using ivan_api.DTOs.CoordinatorTask;
using ivan_api.Services.CoordinatorTaskServ;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoordinatorTaskController : ControllerBase
    {
        private readonly ICoordinatorTaskService _service;

        public CoordinatorTaskController(ICoordinatorTaskService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tasks = await _service.GetAllTasksAsync();
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var task = await _service.GetTaskByIdAsync(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CoordinatorTaskDto dto)
        {
            var userId = GetUserId(); // implement lấy UserId từ JWT
            var task = await _service.CreateTaskAsync(dto, userId);
            return CreatedAtAction(nameof(GetById), new { id = task.TaskId }, task);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CoordinatorTaskDto dto)
        {
            var task = await _service.UpdateTaskAsync(id, dto);
            if (task == null) return NotFound();
            return Ok(task);
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }
    }
}
