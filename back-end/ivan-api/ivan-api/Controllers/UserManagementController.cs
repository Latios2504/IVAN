using ivan_api.Constants;
using ivan_api.DTOs.UserManagement;
using ivan_api.Services.UserManagement;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.Common;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserManagementController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UserManagementController> _logger;

        public UserManagementController(
            IUserService userService,
            ILogger<UserManagementController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        #region Admin Only Endpoints

        // Get paginated users list for admin
        [HttpGet]
        [Authorize(Roles = AuthenticationConstants.Roles.Admin)]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDto<UserListDTO>>>> GetUsers(
            [FromQuery] string? search = null,
            [FromQuery] int? roleId = null,
            [FromQuery] bool? isActive = null,
            [FromQuery] bool? isEmailVerified = null,
            [FromQuery] int page = 1,
            [FromQuery] int size = 10)
        {
            try
            {
                // Validate pagination parameters
                if (page < 1) page = 1;
                if (size < 1) size = 10;
                if (size > 100) size = 100;

                var filters = new UserFiltersDTO
                {
                    Search = search,
                    RoleId = roleId,
                    IsActive = isActive,
                    IsEmailVerified = isEmailVerified,
                    Page = page,
                    Size = size
                };

                var result = await _userService.GetUsersAsync(filters);

                _logger.LogInformation("Retrieved users for page {Page}", page);

                return Ok(new ApiResponseDTO<PagedResultDto<UserListDTO>>
                {
                    Success = true,
                    Message = "Users retrieved successfully",
                    Data = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving users");

                return StatusCode(500, new ApiResponseDTO<PagedResultDto<UserListDTO>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving users",
                    Data = null
                });
            }
        }

        // Get detailed user information for admin
        [HttpGet("{userId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.Admin)]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetUserDetails(int userId)
        {
            try
            {
                if (userId <= 0)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Invalid user ID",
                        Data = null
                    });
                }

                var userDetails = await _userService.GetUserDetailsAsync(userId);

                _logger.LogInformation("Retrieved user details for user {UserId}", userId);

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "User details retrieved successfully",
                    Data = userDetails
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user details for user {UserId}", userId);

                if (ex.Message.Contains("not found"))
                {
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "User not found",
                        Data = null
                    });
                }

                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving user details",
                    Data = null
                });
            }
        }

        // Update user account status (admin only)
        [HttpPut("{userId}/status")]
        [Authorize(Roles = AuthenticationConstants.Roles.Admin)]
        public async Task<ActionResult<ApiResponseDTO<bool>>> UpdateUserStatus(int userId,
            [FromBody] UserStatusUpdateDTO statusUpdate)
        {
            try
            {
                if (userId <= 0)
                {
                    return BadRequest(new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Invalid user ID",
                        Data = false
                    });
                }

                var result = await _userService.UpdateUserStatusAsync(userId, statusUpdate.IsActive);

                if (!result)
                {
                    return NotFound(new ApiResponseDTO<bool>
                    {
                        Success = false,
                        Message = "User not found or update failed",
                        Data = false
                    });
                }

                _logger.LogInformation("Updated user status for user {UserId} to {IsActive}", userId,
                    statusUpdate.IsActive);

                return Ok(new ApiResponseDTO<bool>
                {
                    Success = true,
                    Message = $"User status updated to {(statusUpdate.IsActive ? "Active" : "Inactive")} successfully",
                    Data = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user status for user {UserId}", userId);

                return StatusCode(500, new ApiResponseDTO<bool>
                {
                    Success = false,
                    Message = "An error occurred while updating user status",
                    Data = false
                });
            }
        }

        #endregion

        #region Lookup Endpoints

        // Get all user roles for dropdown/filter
        [HttpGet("roles")]
        [Authorize(Roles = AuthenticationConstants.Roles.Admin)]
        public async Task<ActionResult<ApiResponseDTO<IEnumerable<UserRoleDto>>>> GetUserRoles()
        {
            try
            {
                var roles = await _userService.GetAllUserRolesAsync();

                return Ok(new ApiResponseDTO<IEnumerable<UserRoleDto>>
                {
                    Success = true,
                    Message = "User roles retrieved successfully",
                    Data = roles
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user roles");

                return StatusCode(500, new ApiResponseDTO<IEnumerable<UserRoleDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving user roles",
                    Data = null
                });
            }
        }

        #endregion
    }
}
