using ivan_api.DTOs.UserAccount;
using ivan_api.Services.UserAccountServ;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAccountController : ControllerBase
    {
        private readonly IUserAccountService _userAccountService;
        public UserAccountController(IUserAccountService userAccountService)
        {
            _userAccountService = userAccountService;
        }

        [HttpPost("getListUser")]
        public async Task<IActionResult> GetListUser([FromBody] UserAccountFilterDto filter)
        {
            var result = await _userAccountService.getListUserAsync(filter);
            return Ok(result);
        }

        [HttpPost("getUserInforDetail")]
        public async Task<IActionResult> GetUserDetail(int? userId, string? email)
        {
            var result = await _userAccountService.getUserInforByIdOrEmail(userId, email);
            if (result == null)
            {
                return NotFound(new { Message = "User not found" });
            }
            return Ok(result);
        }

        [HttpPost("updateUserAccount")]
        public async Task<IActionResult> UpdateUserAccount(int userId, int adminUser, UserAccountUpdateDTO_Admin dto)
        {
            var result = await _userAccountService.updateUserAccount_Admin(userId, adminUser,dto);
            if (result == null) {
                return BadRequest("Update thông tin không thành công");
            }
            return Ok(result);
        }
    }
}
