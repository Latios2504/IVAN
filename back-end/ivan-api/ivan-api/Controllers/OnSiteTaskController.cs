using DocumentFormat.OpenXml.Office2010.Excel;
using ivan_api.DTOs.OnSiteTasks;
using ivan_api.Services.OnSiteTasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet]
        public async Task<IActionResult> GetList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _service.GetList(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> Details(int id)
        {
            var result = await _service.GetOnSiteTaskById(id);
            return Ok(result);
        }

        [HttpPost("add")]
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

            var result = await _service.AddOnSiteTask(input);

            if (!result)//if false
            {
                return BadRequest(null);
            }

            var listDto = await _service.GetList(1, 100);

            var list = listDto.Items.ToList();

            var postAdd = await _service.GetOnSiteTaskById(list.Last().TaskId);

            return Ok(postAdd);
        }

        [HttpPut("update/{id}")]
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

            var result = await _service.UpdateOnSiteTask(input, id);

            var postUpate = await _service.GetOnSiteTaskById(id);

            if (!result)//if false
            {
                return BadRequest(postUpate);
            }

            return Ok(postUpate);
        }

        //public async Task<int> getLastId()
        //{
        //    var temp = await _service.GetList(1, 1000);
        //    if (temp.Items == null) return -1;
        //    var lastLst = temp.Items.ToList();
        //    var last = lastLst.Last().TaskId;

        //    return last == null ? -1 : last;
        //}
    }
}
