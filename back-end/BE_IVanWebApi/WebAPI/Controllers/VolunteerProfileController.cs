using Microsoft.AspNetCore.Authorization;
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

        // GET: /api/volunteerprofiles
        [HttpGet]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.ListAsync();
            return Ok(list);
        }

        // GET: /api/volunteerprofiles/user/5
        [HttpGet("user/{userId}")]
        //[Authorize(Roles = "Volunteer,Admin")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var profile = await _service.GetByUserIdAsync(userId);
            return profile == null ? NotFound() : Ok(profile);
        }

        // POST: /api/volunteerprofiles
        [HttpPost]
        //[Authorize(Roles = "Volunteer")]
        public async Task<IActionResult> Create([FromBody] VolunteerProfileDto dto)
        {
            var profile = await _service.AddAsync(dto);
            return Ok(profile);
        }

        // PUT: /api/volunteerprofiles/user/5
        [HttpPut("user/{userId}")]
        //[Authorize(Roles = "Volunteer")]
        public async Task<IActionResult> Update(int userId, [FromBody] VolunteerProfileDto dto)
        {
            var profile = await _service.UpdateAsync(userId, dto);
            return profile == null ? NotFound() : Ok(profile);
        }
    }
}

