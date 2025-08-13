using ivan_api.Constants;
using ivan_api.DTOs;
using ivan_api.DTOs.Authentication;
using ivan_api.DTOs.Common;
using ivan_api.Extensions;
using ivan_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventRegistrationsController : ControllerBase
    {
        private readonly IEventRegistrationService _registrationService;
        public EventRegistrationsController(IEventRegistrationService eventRegistrationService)
        {
            _registrationService = eventRegistrationService;
        }
        [HttpPost]
        [Authorize(Roles = AuthenticationConstants.Roles.Volunteer)]
        public async Task<ActionResult<ApiResponseDTO<RegistrationDTO>>> AddRegistration(int eventId, [FromBody] RegistrationRequestDTO request)
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

            var claim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }
            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var result = await _registrationService.AddRegistrationAsync(eventId, userId, request);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) :
                       result.Errors.Any(e => e.Contains("Duplicate")) ? Conflict(result) :
                       BadRequest(result);
            }
            return CreatedAtAction(nameof(GetRegistration), new { eventId, registrationId = result.Data.RegistrationId }, result);
        }
        

        [HttpPut("{registrationId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.Volunteer)]
        public async Task<ActionResult<ApiResponseDTO<RegistrationDTO>>> UpdateRegistration(int eventId, int registrationId, [FromBody] RegistrationRequestDTO request)
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

            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }
            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var result = await _registrationService.UpdateRegistrationAsync(eventId, registrationId, userId, request);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) : BadRequest(result);
            }
            return Ok(result);
        }

        [HttpDelete("{registrationId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.Volunteer)]
        public async Task<ActionResult<ApiResponseDTO<SuccessResponseDTO>>> CancelRegistration(int eventId, int registrationId)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<SuccessResponseDTO>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }
            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<SuccessResponseDTO>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var result = await _registrationService.CancelRegistrationAsync(eventId, registrationId, userId);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) : BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDTO<RegistrationDTO>>>> ListRegistrations(int eventId, [FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int size = 20)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<PagedResultDTO<RegistrationDTO>>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }
            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<PagedResultDTO<RegistrationDTO>>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var result = await _registrationService.ListRegistrationsAsync(eventId, userId, status, page, size);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) :
                       result.Errors.Any(e => e.Contains("Coordinator")) ? Unauthorized(result) :
                       StatusCode(500, result);
            }
            return Ok(result);
        }

        [HttpGet("{registrationId}")]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<ActionResult<ApiResponseDTO<RegistrationDTO>>> GetRegistration(int eventId, int registrationId)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }
            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var result = await _registrationService.GetRegistrationAsync(eventId, registrationId, userId);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) :
                       result.Errors.Any(e => e.Contains("Coordinator")) ? Unauthorized(result) :
                       StatusCode(500, result);
            }
            return Ok(result);
        }

        [HttpPatch("{registrationId}/approve")]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<ActionResult<ApiResponseDTO<RegistrationDTO>>> ApproveRegistration(int eventId, int registrationId, [FromBody] ApproveRegistrationRequestDTO request)
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

            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }
            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var result = await _registrationService.ApproveRegistrationAsync(eventId, registrationId, userId, request);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) :
                       result.Errors.Any(e => e.Contains("Coordinator")) ? Unauthorized(result) :
                       BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPatch("{registrationId}/reject")]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<ActionResult<ApiResponseDTO<RegistrationDTO>>> RejectRegistration(int eventId, int registrationId, [FromBody] RejectRegistrationRequestDTO request)
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

            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }
            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<RegistrationDTO>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var result = await _registrationService.RejectRegistrationAsync(eventId, registrationId, userId, request);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) :
                       result.Errors.Any(e => e.Contains("Coordinator")) ? Unauthorized(result) :
                       BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("{registrationId}/status")]
        [Authorize(Roles = AuthenticationConstants.Roles.Volunteer)]
        public async Task<ActionResult<ApiResponseDTO<RegistrationStatusDTO>>> GetRegistrationStatus(int eventId, int registrationId)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized(new ApiResponseDTO<RegistrationStatusDTO>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }
            if (!int.TryParse(claim.Value, out var userId))
            {
                return BadRequest(new ApiResponseDTO<RegistrationStatusDTO>
                {
                    Success = false,
                    Message = "Invalid user ID format"
                });
            }

            var result = await _registrationService.GetRegistrationStatusAsync(eventId, registrationId, userId);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) : StatusCode(500, result);
            }
            return Ok(result);
        }
    }

}

