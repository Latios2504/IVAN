using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Models.VolunteerProfile;
using WebAPI.Service.VolunteerProfileService;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VolunteerProfileController : ControllerBase
    {
        private readonly IVolunteerProfileService _service;

        public VolunteerProfileController(IVolunteerProfileService service)
        {
            _service = service;
        }

        [HttpGet("{id}")]
        //[Authorize(Roles = "Volunteer,Organization,Admin,VolunteerCoordinator")]
        public async Task<IActionResult> GetById(int id)
        {
            var profile = await _service.GetByIdAsync(id);
            return Ok(profile);
        }

        [HttpGet("user/{userId}")]
        //[Authorize(Roles = "Volunteer,Organization,Admin,VolunteerCoordinator")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var profile = await _service.GetByUserIdAsync(userId);
            return Ok(profile);
        }

        // FE-02: List Volunteer Profiles
        [HttpPost("list")]
        //[Authorize(Roles = "Organization,Admin,VolunteerCoordinator")]
        public async Task<IActionResult> List([FromBody] VolunteerProfileFilterViewModel filter)
        {
            var profiles = await _service.GetFilteredProfilesAsync(filter);
            return Ok(profiles);
        }

        // FE-02: Add Volunteer Profile
        [HttpPost]
        //[Authorize(Roles = "Volunteer")]
        public async Task<IActionResult> Add([FromBody] VolunteerProfileViewModel model)
        {
            await _service.AddAsync(model);
            return Ok(new { message = "Volunteer profile created successfully." });
        }

        // FE-02: Update Volunteer Profile
        [HttpPut]
        //[Authorize(Roles = "Volunteer")]
        public async Task<IActionResult> Update([FromBody] VolunteerProfileViewModel model)
        {
            await _service.UpdateAsync(model);
            return Ok(new { message = "Volunteer profile updated successfully." });
        }
    }
}

