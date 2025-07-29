using ivan_api.DTOs.VolunteerProfile;
using ivan_api.Services.VolunteerProfileServ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VolunteerProfileController : ControllerBase
    {
        private readonly IVolunteerProfileService _service;
        public VolunteerProfileController(IVolunteerProfileService service) => _service = service;

        /// <summary>
        /// GET api/volunteer-profiles
        /// Chỉ Admin được xem toàn bộ
        /// </summary>
        [HttpGet]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<VolunteerProfileListDto>>> GetAll()
        {
            var list = await _service.GetAllAsync();
            return Ok(list);
        }

        /// <summary>
        /// GET api/volunteer-profiles/{userId}
        /// Get volunteer profile by User ID (not VolunteerProfile ID)
        /// Volunteer can view their own profile, Admin can view any profile
        /// </summary>
        [HttpGet("{userId:int}")]
        //[Authorize]
        public async Task<ActionResult<VolunteerProfileDetailDto>> GetById(int userId)
        {
            // Optionally: check if caller is not Admin, then userId must match their own ID
            var dto = await _service.GetByIdAsync(userId);
            if (dto == null)
                return NotFound(new { message = $"Volunteer profile for UserId={userId} not found." });

            return Ok(dto);
        }

        /// <summary>
        /// POST api/volunteer-profiles
        /// Cho phép Guest (chưa đăng nhập) hoặc User đăng ký/khởi tạo hồ sơ
        /// </summary>
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<VolunteerProfileDetailDto>> Create([FromBody] VolunteerProfileCreateDto dto)
        {
            var created = await _service.CreateAsync(dto);
            // Trả về 201 với đường dẫn đến resource vừa tạo
            return CreatedAtAction(
                nameof(GetById),
                new { userId = created.UserId },
                created
            );
        }

        /// <summary>
        /// PUT api/volunteer-profiles/{userId}
        /// Volunteer chỉ được cập nhật hồ sơ của họ, Admin có thể cập nhật bất kỳ
        /// </summary>
        [HttpPut("{userId:int}")]
        [Authorize]
        public async Task<ActionResult<VolunteerProfileDetailDto>> Update(int userId, [FromBody] VolunteerProfileUpdateDto dto)
        {
            //if (userId != dto.)
            //    return BadRequest(new { message = "UserId in URL và body không khớp." });

            var result = await _service.UpdateAsync(userId, dto);
            if (result == null)
                return NotFound(new { message = $"Volunteer profile with UserId={userId} not found." });

            return Ok(result);
        }

        /// <summary>
        /// DELETE api/volunteer-profiles/{userId}
        /// Chỉ Admin mới có quyền xóa hồ sơ
        /// </summary>
        [HttpDelete("{userId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int userId)
        {
            var success = await _service.DeleteAsync(userId);
            if (!success)
                return NotFound(new { message = $"Volunteer profile with UserId={userId} not found." });

            return NoContent();
        }

    }
}
