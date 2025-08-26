using ivan_api.Constants;
using ivan_api.DTOs.VolunteerSchedule;
using ivan_api.DTOs.Common;
using ivan_api.Services.VolunteerScheduleServ;
using ivan_api.Services.AuthenticationSer;
using ivan_api.Services.VolunteerCoordinatorServ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VolunteerScheduleController : ControllerBase
    {
        private readonly IVolunteerScheduleService _volunteerScheduleService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IVolunteerCoordinatorService _coordinatorService;

        public VolunteerScheduleController(
            IVolunteerScheduleService volunteerScheduleService, 
            IAuthenticationService authenticationService,
            IVolunteerCoordinatorService coordinatorService)
        {
            _volunteerScheduleService = volunteerScheduleService;
            _authenticationService = authenticationService;
            _coordinatorService = coordinatorService;
        }

        #region Coordinator endpoints

        /// Get paginated list of volunteer schedules for coordinator
        [HttpGet("coordinator")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<IActionResult> GetCoordinatorVolunteerSchedules([FromQuery] VolunteerScheduleFilterDTO filter)
        {
            try
            {
                var userId = _authenticationService.GetUserIdFromClaims(User);
                var organizationId = await _coordinatorService.GetOrganizationIdByUserIdAsync(userId);
                
                if (organizationId == null)
                {
                    return Unauthorized(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Coordinator not found or not associated with any organization"
                    });
                }
                
                var result = await _volunteerScheduleService.GetOrganizationVolunteerSchedulesAsync(organizationId.Value, filter);
                
                return Ok(new ApiResponseDTO<PagedResultDto<VolunteerScheduleDTO>>
                {
                    Success = true,
                    Message = "Volunteer schedules retrieved successfully",
                    Data = result
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "User not found",
                    Errors = new List<string> { "User authentication failed" }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to retrieve volunteer schedules",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// Get volunteer schedule by ID (Coordinator role)
        [HttpGet("coordinator/{scheduleId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<IActionResult> GetVolunteerScheduleById(int scheduleId)
        {
            try
            {
                var userId = _authenticationService.GetUserIdFromClaims(User);
                var organizationId = await _coordinatorService.GetOrganizationIdByUserIdAsync(userId);
                
                if (organizationId == null)
                {
                    return Unauthorized(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Coordinator not found or not associated with any organization"
                    });
                }

                var result = await _volunteerScheduleService.GetVolunteerScheduleByIdAsync(organizationId.Value, scheduleId);
                
                if (result == null)
                {
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Schedule not found"
                    });
                }

                return Ok(new ApiResponseDTO<VolunteerScheduleDTO>
                {
                    Success = true,
                    Message = "Schedule retrieved successfully",
                    Data = result
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to retrieve schedule",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// Create new volunteer schedule (Coordinator role)
        [HttpPost("coordinator")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<IActionResult> CreateVolunteerSchedule([FromBody] VolunteerScheduleRequestDTO request)
        {
            try
            {
                // Validate status if provided, default to Scheduled if not provided
                if (string.IsNullOrEmpty(request.Status))
                {
                    request.Status = ScheduleConstants.Status.Scheduled;
                }
                else if (!ScheduleConstants.GetAllStatuses().Contains(request.Status))
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Invalid status value",
                        Errors = new List<string> { $"Status must be one of: {string.Join(", ", ScheduleConstants.GetAllStatuses())}" }
                    });
                }

                var userId = _authenticationService.GetUserIdFromClaims(User);
                var organizationId = await _coordinatorService.GetOrganizationIdByUserIdAsync(userId);
                
                if (organizationId == null)
                {
                    return Unauthorized(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Coordinator not found or not associated with any organization"
                    });
                }
                
                var result = await _volunteerScheduleService.CreateVolunteerScheduleAsync(organizationId.Value, request, userId);
                
                return CreatedAtAction(nameof(GetVolunteerScheduleById), new { scheduleId = result.ScheduleId }, new ApiResponseDTO<VolunteerScheduleDTO>
                {
                    Success = true,
                    Message = "Volunteer schedule created successfully",
                    Data = result
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Coordinator not found"
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to create volunteer schedule",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// Update volunteer schedule (Coordinator role)
        [HttpPut("coordinator/{scheduleId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<IActionResult> UpdateVolunteerSchedule(int scheduleId, [FromBody] VolunteerScheduleRequestDTO request)
        {
            try
            {
                // Validate status if provided
                if (!string.IsNullOrEmpty(request.Status) && !ScheduleConstants.GetAllStatuses().Contains(request.Status))
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Invalid status value",
                        Errors = new List<string> { $"Status must be one of: {string.Join(", ", ScheduleConstants.GetAllStatuses())}" }
                    });
                }

                var userId = _authenticationService.GetUserIdFromClaims(User);
                var organizationId = await _coordinatorService.GetOrganizationIdByUserIdAsync(userId);
                
                if (organizationId == null)
                {
                    return Unauthorized(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Coordinator not found or not associated with any organization"
                    });
                }
                
                var result = await _volunteerScheduleService.UpdateVolunteerScheduleAsync(organizationId.Value, scheduleId, request, userId);
                
                return Ok(new ApiResponseDTO<VolunteerScheduleDTO>
                {
                    Success = true,
                    Message = "Volunteer schedule updated successfully",
                    Data = result
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to update volunteer schedule",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Update volunteer schedule status (Coordinator role)
        /// </summary>
        [HttpPatch("coordinator/{scheduleId}/status")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<IActionResult> UpdateVolunteerScheduleStatus(int scheduleId, [FromBody] UpdateVolunteerScheduleStatusDto request)
        {
            try
            {
                // Validate status
                if (string.IsNullOrEmpty(request.Status) || !ScheduleConstants.GetAllStatuses().Contains(request.Status))
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Invalid status value",
                        Errors = new List<string> { $"Status must be one of: {string.Join(", ", ScheduleConstants.GetAllStatuses())}" }
                    });
                }

                var userId = _authenticationService.GetUserIdFromClaims(User);
                var organizationId = await _coordinatorService.GetOrganizationIdByUserIdAsync(userId);
                
                if (organizationId == null)
                {
                    return Unauthorized(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Coordinator not found or not associated with any organization"
                    });
                }

                var result = await _volunteerScheduleService.UpdateScheduleStatusAsync(organizationId.Value, scheduleId, request.Status, userId);
                
                if (!result)
                {
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Schedule not found"
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "Schedule status updated successfully"
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while updating the schedule status",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// Delete volunteer schedule (Coordinator role)
        [HttpDelete("coordinator/{scheduleId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<IActionResult> DeleteVolunteerSchedule(int scheduleId)
        {
            try
            {
                var userId = _authenticationService.GetUserIdFromClaims(User);
                var organizationId = await _coordinatorService.GetOrganizationIdByUserIdAsync(userId);
                
                if (organizationId == null)
                {
                    return Unauthorized(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Coordinator not found or not associated with any organization"
                    });
                }

                var result = await _volunteerScheduleService.DeleteVolunteerScheduleAsync(organizationId.Value, scheduleId);
                
                return Ok(new ApiResponseDTO<bool>
                {
                    Success = result,
                    Message = result ? "Volunteer schedule deleted successfully" : "Failed to delete volunteer schedule",
                    Data = result
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to delete volunteer schedule",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        #endregion

        #region Volunteer personal schedule endpoints

        /// Get personal schedules for volunteer
        [HttpGet("personal")]
        [Authorize(Roles = AuthenticationConstants.Roles.Volunteer)]
        public async Task<IActionResult> GetPersonalSchedules([FromQuery] VolunteerScheduleFilterDTO filter)
        {
            try
            {
                var userId = _authenticationService.GetUserIdFromClaims(User);
                var result = await _volunteerScheduleService.GetPersonalSchedulesAsync(userId, filter);
                
                return Ok(new ApiResponseDTO<PagedResultDto<VolunteerScheduleDTO>>
                {
                    Success = true,
                    Message = "Personal schedules retrieved successfully",
                    Data = result
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "User not found"
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to retrieve personal schedules",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Get personal schedule by ID for volunteer
        /// </summary>
        [HttpGet("personal/{scheduleId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.Volunteer)]
        public async Task<IActionResult> GetPersonalScheduleById(int scheduleId)
        {
            try
            {
                var userId = _authenticationService.GetUserIdFromClaims(User);
                var result = await _volunteerScheduleService.GetPersonalScheduleByIdAsync(userId, scheduleId);
                
                if (result == null)
                {
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Schedule not found"
                    });
                }

                return Ok(new ApiResponseDTO<VolunteerScheduleDTO>
                {
                    Success = true,
                    Message = "Schedule retrieved successfully",
                    Data = result
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to retrieve schedule",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        #endregion


    }
}
