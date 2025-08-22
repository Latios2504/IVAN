using ivan_api.Constants;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.EventRegistration;
using ivan_api.Extensions;
using ivan_api.Services.EventRegistrationSer;
using ivan_api.Services.AuthenticationSer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.Services.EventServ;
using ivan_api.Models;

namespace ivan_api.Controllers
{
    [Route("api/events/{eventId}/registrations")]
    [ApiController]
    public class EventRegistrationsController : ControllerBase
    {
        private readonly IEventRegistrationService _registrationService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IEventService _eventService;
        private readonly ILogger<EventRegistrationsController> _logger;
        private readonly VolunteerManagementSystemContext _context;

        public EventRegistrationsController(
            IEventRegistrationService registrationService,
            IAuthenticationService authenticationService,
            ILogger<EventRegistrationsController> logger, IEventService eventService, VolunteerManagementSystemContext context)
        {
            _registrationService = registrationService;
            _authenticationService = authenticationService;
            _logger = logger;
            _eventService = eventService;
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = AuthenticationConstants.Roles.Volunteer)]
        public async Task<ActionResult<ApiResponseDTO<RegistrationDTO>>> AddRegistration(int eventId,
            [FromBody] RegistrationRequestDTO request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.GetErrorMessages();
                    return BadRequest(new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = errors
                    });
                }

                var eventInfo = await _eventService.GetEventAsync(eventId);
                if (eventInfo == null)
                {
                    return NotFound(new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Event not found"
                    });
                }

                 //Kiểm tra cửa sổ đăng ký
                var now = DateTime.UtcNow;
                if (eventInfo.RegistrationStartDate.HasValue && now < eventInfo.RegistrationStartDate.Value)
                {
                    return BadRequest(new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Registration has not started yet"
                    });
                }

                if (eventInfo.RegistrationEndDate.HasValue && now > eventInfo.RegistrationEndDate.Value)
                {
                    return BadRequest(new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Registration period has ended"
                    });
                }

                var eventRaw = await _eventService.GetEventNotDTO(eventId);
                var currentVolunteers =  eventRaw.CurrentVolunteers;
                if (eventRaw.MaxVolunteers.HasValue && currentVolunteers >= eventRaw.MaxVolunteers.Value)
                {
                    return BadRequest(new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Maximum number of volunteers for this event has been reached"
                    });
                }


                var userId = _authenticationService.GetUserIdFromClaims(User);
                var registration = await _registrationService.AddRegistrationAsync(eventId, userId, request);

                return CreatedAtAction(nameof(GetRegistration),
                    new { eventId, registrationId = registration.RegistrationId },
                    new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = true,
                        Data = registration,
                        Message = "Registration submitted successfully"
                    });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (InvalidOperationException ex)
            {
                if (ex.Message.Contains("not found"))
                    return NotFound(new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = ex.Message
                    });

                if (ex.Message.Contains("Already registered"))
                    return Conflict(new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = ex.Message
                    });

                return BadRequest(new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }


        [HttpPut("{registrationId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.Volunteer)]
        public async Task<ActionResult<ApiResponseDTO<object>>> UpdateRegistration(int eventId, int registrationId,
            [FromBody] RegistrationRequestDTO request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.GetErrorMessages();
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = errors
                    });
                }

                var userId = _authenticationService.GetUserIdFromClaims(User);
                var eventInfo = await _eventService.GetEventAsync(eventId);
                if (eventInfo == null)
                {
                    return NotFound(new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Event not found"
                    });
                }

                // Kiểm tra cửa sổ đăng ký
                var now = DateTime.UtcNow;
                if (eventInfo.RegistrationStartDate.HasValue && now < eventInfo.RegistrationStartDate.Value)
                {
                    return BadRequest(new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Registration has not started yet"
                    });
                }

                if (eventInfo.RegistrationEndDate.HasValue && now > eventInfo.RegistrationEndDate.Value)
                {
                    return BadRequest(new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Registration period has ended"
                    });
                }

                var success =
                    await _registrationService.UpdateRegistrationAsync(eventId, registrationId, userId, request);

                if (!success)
                {
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Registration not found or update failed"
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "Registration updated successfully"
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
                if (ex.Message.Contains("not found") || ex.Message.Contains("access denied"))
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = ex.Message
                    });

                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpDelete("{registrationId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.Volunteer)]
        public async Task<ActionResult<ApiResponseDTO<object>>> CancelRegistration(int eventId, int registrationId)
        {
            try
            {
                var userId = _authenticationService.GetUserIdFromClaims(User);
                var success = await _registrationService.CancelRegistrationAsync(eventId, registrationId, userId);

                if (!success)
                {
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Registration not found or cancellation failed"
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "Registration cancelled successfully"
                });
            }
            catch (InvalidOperationException ex)
            {
                if (ex.Message.Contains("not found") || ex.Message.Contains("access denied"))
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = ex.Message
                    });

                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpGet]
        [Authorize(Roles =
            $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDto<RegistrationDTO>>>> ListRegistrations(int eventId,
            [FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int size = 20)
        {
            try
            {
                var userId = _authenticationService.GetUserIdFromClaims(User);

                // Get user info with profile to determine organization ID if user is organization
                var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);

                var result = await _registrationService.ListRegistrationsAsync(eventId, userId, userInfo.OrganizationId,
                    status, page, size);

                return Ok(new ApiResponseDTO<PagedResultDto<RegistrationDTO>>
                {
                    Success = true,
                    Data = result,
                    Message = "Registrations retrieved successfully"
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new ApiResponseDTO<PagedResultDto<RegistrationDTO>>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (InvalidOperationException ex)
            {
                if (ex.Message.Contains("Event not found"))
                    return NotFound(new ApiResponseDTO<PagedResultDto<RegistrationDTO>>
                    {
                        Success = false,
                        Message = ex.Message
                    });

                return BadRequest(new ApiResponseDTO<PagedResultDto<RegistrationDTO>>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error listing registrations for event {EventId}", eventId);
                return StatusCode(500, new ApiResponseDTO<PagedResultDto<RegistrationDTO>>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpGet("{registrationId}")]
        [Authorize(Roles =
            $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<ActionResult<ApiResponseDTO<RegistrationDTO>>> GetRegistration(int eventId,
            int registrationId)
        {
            try
            {
                var userId = _authenticationService.GetUserIdFromClaims(User);
                var registration = await _registrationService.GetRegistrationAsync(eventId, registrationId, userId);

                if (registration == null)
                {
                    return NotFound(new ApiResponseDTO<RegistrationDTO>
                    {
                        Success = false,
                        Message = "Registration not found"
                    });
                }

                return Ok(new ApiResponseDTO<RegistrationDTO>
                {
                    Success = true,
                    Data = registration,
                    Message = "Registration retrieved successfully"
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpPatch("{registrationId}/approve")]
        [Authorize(Roles =
            $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> ApproveRegistration(int eventId, int registrationId,
            [FromBody] ApproveRegistrationRequestDTO request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.GetErrorMessages();
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = errors
                    });
                }

                var userId = _authenticationService.GetUserIdFromClaims(User);
                var success =
                    await _registrationService.ApproveRegistrationAsync(eventId, registrationId, userId, request);

                if (!success)
                {
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Registration not found or approval failed"
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "Registration approved successfully"
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
            catch (Exception)
            {
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpPatch("{registrationId}/reject")]
        [Authorize(Roles =
            $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> RejectRegistration(int eventId, int registrationId,
            [FromBody] RejectRegistrationRequestDTO request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.GetErrorMessages();
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = errors
                    });
                }

                var userId = _authenticationService.GetUserIdFromClaims(User);
                var success =
                    await _registrationService.RejectRegistrationAsync(eventId, registrationId, userId, request);

                if (!success)
                {
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Registration not found or rejection failed"
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "Registration rejected successfully"
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
            catch (Exception)
            {
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpGet("{registrationId}/status")]
        [Authorize(Roles = AuthenticationConstants.Roles.Volunteer)]
        public async Task<ActionResult<ApiResponseDTO<RegistrationStatusDTO>>> GetRegistrationStatus(int eventId,
            int registrationId)
        {
            try
            {
                var userId = _authenticationService.GetUserIdFromClaims(User);
                var status = await _registrationService.GetRegistrationStatusAsync(eventId, registrationId, userId);

                if (status == null)
                {
                    return NotFound(new ApiResponseDTO<RegistrationStatusDTO>
                    {
                        Success = false,
                        Message = "Registration not found or access denied"
                    });
                }

                return Ok(new ApiResponseDTO<RegistrationStatusDTO>
                {
                    Success = true,
                    Data = status,
                    Message = "Registration status retrieved successfully"
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponseDTO<RegistrationStatusDTO>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponseDTO<RegistrationStatusDTO>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>Get volunteer's own registrations across all events</summary>
        [HttpGet("~/api/volunteer/registrations")]
        [Authorize(Roles = AuthenticationConstants.Roles.Volunteer)]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDto<RegistrationDTO>>>> GetMyRegistrations(
            [FromQuery] string? status,
            [FromQuery] int page = 1,
            [FromQuery] int size = 20)
        {
            try
            {
                var userId = _authenticationService.GetUserIdFromClaims(User);
                var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);

                if (!userInfo.VolunteerId.HasValue)
                {
                    return BadRequest(new ApiResponseDTO<PagedResultDto<RegistrationDTO>>
                    {
                        Success = false,
                        Message = "Volunteer profile not found"
                    });
                }

                var result =
                    await _registrationService.GetVolunteerRegistrationsAsync(userInfo.VolunteerId.Value, status, page,
                        size);

                return Ok(new ApiResponseDTO<PagedResultDto<RegistrationDTO>>
                {
                    Success = true,
                    Data = result,
                    Message = "Registrations retrieved successfully"
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponseDTO<PagedResultDto<RegistrationDTO>>
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }
    }
}