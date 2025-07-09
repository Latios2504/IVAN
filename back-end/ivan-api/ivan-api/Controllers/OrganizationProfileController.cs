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

        [HttpPost("list")]
        public async Task<IActionResult> List([FromBody] OrganizationProfileFilterModel filter)
        {
            var result = await _service.ListOrganizationProfile(filter);
            return Ok(result);
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> Details(int id)
        {
            var result = await _service.GetOrganizationProfileById(id);
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
            return Ok(result);
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] OrganizationProfileViewModel input)
        {
            if (input == null)
            {
                input = new OrganizationProfileViewModel();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _service.UpdateOrganizationProfile(input);
            return Ok(result);
        }
    }
}
