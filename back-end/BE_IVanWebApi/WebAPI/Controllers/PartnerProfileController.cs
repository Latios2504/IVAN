using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Models.PartnerProfiles;
using WebAPI.Service.PartnerProfiles;

namespace WebAPI.Controllers
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

        [HttpGet("list")]
        public async Task<IActionResult> List([FromBody] PartnerProfileFilterModel filter)
        {
            var result = await _service.ListPartnerProfile(filter);
            return Ok(result);
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> Details(int id)
        {
            var result = await _service.GetPartnerProfileById(id);
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
            return Ok(result);
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] PartnerProfileViewModel input)
        {
            if (input == null)
            {
                input = new PartnerProfileViewModel();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _service.UpdatePartnerProfile(input);
            return Ok(result);
        }
    }
}
