using ivan_api.Services.OrganizationProfiles;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.OrganizationProfiles;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizationProfileController : ControllerBase
    {
        private readonly IOrganizationProfileService _service;

        public OrganizationProfileController(IOrganizationProfileService service)
        {
            _service = service;
        }

        //[HttpPost("list")]
        //public async Task<IActionResult> List([FromBody] OrganizationProfileFilterModel filter)
        //{
        //    var result = await _service.ListOrganizationProfile(filter);
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
            var result = await _service.GetOrganizationProfileById(userId);
            return Ok(result);
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromBody] OrganizationProfileInputModel input)
        {
            if (input == null)
            {
                input = new OrganizationProfileInputModel();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _service.AddOrganizationProfile(input);

            if (!result)//if false
            {
                return BadRequest("Failed to add organization profile");
            }

            var listDto = await _service.GetList(1, 100);

            var list = listDto.Items.ToList();

            var postAdd = await _service.GetOrganizationProfileById(list.Last().OrganizationId);

            return Ok(postAdd);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update([FromBody] OrganizationProfileUpdateModel input, int id)
        {
            if (input == null)
            {
                input = new OrganizationProfileUpdateModel();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _service.UpdateOrganizationProfile(input, id);

            return Ok(result);
        }

        //public async Task<int> getLastId()
        //{
        //    var temp = await _service.GetList(1, 1000);
        //    if (temp.Items == null) return -1;
        //    var lastLst = temp.Items.ToList();
        //    var last = lastLst.Last().OrganizationId;

        //    return last == null ? -1 : last;
        //}
    }
}
