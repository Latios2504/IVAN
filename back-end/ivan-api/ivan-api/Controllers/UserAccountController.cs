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

        [HttpPut("getListUser")]
        public async Task<IActionResult> GetListUser([FromBody] UserAccountFilterDto filter)
        {
            var result = await _userAccountService.getListUserAsync(filter);
            return Ok(result);
        }
    }
}
