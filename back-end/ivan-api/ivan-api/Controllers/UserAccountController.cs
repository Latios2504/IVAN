using ivan_api.DTOs.UserAccount;
using ivan_api.Services.UserAccountServ;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ivan_api.Constants;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserAccountController : ControllerBase
    {
        private readonly IUserAccountService _userAccountService;
        public UserAccountController(IUserAccountService userAccountService)
        {
            _userAccountService = userAccountService;
        }

        /// <summary>
        /// Get paginated list of users with filtering (Admin only)
        /// </summary>
        [HttpPost("getListUser")]
        [Authorize(Roles = AuthenticationConstants.Roles.Admin)]
        public async Task<IActionResult> GetListUser([FromBody] UserAccountFilterDto filter)
        {
            try
            {
                var result = await _userAccountService.getListUserAsync(filter);
                return Ok(new { success = true, message = "Users retrieved successfully", data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error retrieving users", errors = new[] { ex.Message } });
            }
        }

        /// <summary>
        /// Get detailed user information by ID or email (Admin only)
        /// </summary>
        [HttpPost("getUserInforDetail")]
        [Authorize(Roles = AuthenticationConstants.Roles.Admin)]
        public async Task<IActionResult> GetUserDetail(int? userId, string? email)
        {
            try
            {
                var result = await _userAccountService.getUserInforByIdOrEmail(userId, email);
                if (result == null)
                {
                    return NotFound(new { success = false, message = "User not found" });
                }
                return Ok(new { success = true, message = "User details retrieved successfully", data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error retrieving user details", errors = new[] { ex.Message } });
            }
        }

        /// <summary>
        /// Update user account information (Admin only)
        /// </summary>
        [HttpPost("updateUserAccount")]
        [Authorize(Roles = AuthenticationConstants.Roles.Admin)]
        public async Task<IActionResult> UpdateUserAccount(int userId, int adminUser, UserAccountUpdateDTO_Admin dto)
        {
            try
            {
                // Get admin user ID from JWT token
                var adminUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(adminUserIdClaim) || !int.TryParse(adminUserIdClaim, out int authenticatedAdminId))
                {
                    return Unauthorized(new { success = false, message = "Invalid admin user authentication" });
                }

                var result = await _userAccountService.updateUserAccount_Admin(userId, authenticatedAdminId, dto);
                if (result == null) 
                {
                    return BadRequest(new { success = false, message = "Update thông tin không thành công" });
                }
                return Ok(new { success = true, message = "User account updated successfully", data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error updating user account", errors = new[] { ex.Message } });
            }
        }

        /// <summary>
        /// Get user statistics (Admin only)
        /// </summary>
        [HttpGet("statistics")]
        [Authorize(Roles = AuthenticationConstants.Roles.Admin)]
        public async Task<IActionResult> GetUserStatistics()
        {
            try
            {
                var stats = await _userAccountService.getUserStatisticsAsync();
                return Ok(new { success = true, message = "Statistics retrieved successfully", data = stats });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error retrieving statistics", errors = new[] { ex.Message } });
            }
        }
    }
}
