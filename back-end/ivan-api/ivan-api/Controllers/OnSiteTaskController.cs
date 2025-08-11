using DocumentFormat.OpenXml.Office2010.Excel;
using ivan_api.Constants;
using ivan_api.DTOs.OnSiteTasks;
using ivan_api.Services.OnSiteTasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OnSiteTaskController : ControllerBase
    {
        private readonly IOnSiteTaskService _service;

        public OnSiteTaskController(IOnSiteTaskService service)
        {
            _service = service;
        }

        //[HttpPost("list")]
        //public async Task<IActionResult> List([FromBody] OnSiteTaskFilterModel filter)
        //{
        //    var result = await _service.ListOnSiteTask(filter);
        //    return Ok(result);
        //}

        /// <summary>
        /// Get list of on-site tasks (Coordinator and Volunteer can view)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.VolunteerCoordinator},{AuthenticationConstants.Roles.Volunteer}")]
        public async Task<IActionResult> GetList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _service.GetList(pageNumber, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get on-site task details by ID (Coordinator and Volunteer can view)
        /// </summary>
        [HttpGet("get/{id}")]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.VolunteerCoordinator},{AuthenticationConstants.Roles.Volunteer}")]
        public async Task<IActionResult> Details(int id)
        {
            try
            {
                var result = await _service.GetOnSiteTaskById(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Add new on-site task (Only Coordinator can add)
        /// </summary>
        [HttpPost("add")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<IActionResult> Add([FromBody] OnSiteTaskInputModel input)
        {
            if (input == null)
            {
                input = new OnSiteTaskInputModel();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _service.AddOnSiteTask(input);

                if (!result)//if false
                {
                    return BadRequest("Failed to add task");
                }

                var listDto = await _service.GetList(1, 100);

                var list = listDto.Items.ToList();

                var postAdd = await _service.GetOnSiteTaskById(list.Last().TaskId);

                return Ok(postAdd);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Update on-site task (Only Coordinator can update)
        /// </summary>
        [HttpPut("update/{id}")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<IActionResult> Update([FromBody] OnSiteTaskUpdateModel input, int id)
        {
            if (input == null)
            {
                input = new OnSiteTaskUpdateModel();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _service.UpdateOnSiteTask(input, id);

                var postUpate = await _service.GetOnSiteTaskById(id);

                if (!result)//if false
                {
                    return BadRequest(postUpate);
                }

                return Ok(postUpate);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }
    }
}
