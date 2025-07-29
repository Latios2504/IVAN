using ivan_api.Services.PartnerProfiles;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.PartnerProfiles;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartnerProfileController : ControllerBase
    {
        private readonly IPartnerProfileService _service;

        public PartnerProfileController(IPartnerProfileService service)
        {
            _service = service;
        }

        //[HttpPost("list")]
        //public async Task<IActionResult> List([FromBody] PartnerProfileFilterModel filter)
        //{
        //    var result = await _service.ListPartnerProfile(filter);
        //    return Ok(result);
        //}

        [HttpGet]
        public async Task<IActionResult> GetList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _service.GetList(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("get/{userId}")]
        public async Task<IActionResult> Details(int userId)
        {
            var result = await _service.GetPartnerProfileById(userId);
            return Ok(result);
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromBody] PartnerProfileInputModel input)
        {
            if (input == null)
            {
                input = new PartnerProfileInputModel();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _service.AddPartnerProfile(input);

            if (!result)//if false
            {
                return BadRequest(null);
            }

            var listDto = await _service.GetList(1, 100);

            var list = listDto.Items.ToList();

            var postAdd = await _service.GetPartnerProfileById(list.Last().PartnerId);

            return Ok(postAdd);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update([FromBody] PartnerProfileUpdateModel input, int id)
        {
            if (input == null)
            {
                input = new PartnerProfileUpdateModel();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _service.UpdatePartnerProfile(input, id);

            var postUpate = await _service.GetPartnerProfileById(id);

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
        //    var last = lastLst.Last().PartnerId;

        //    return last == null ? -1 : last;
        //}
    }
}
