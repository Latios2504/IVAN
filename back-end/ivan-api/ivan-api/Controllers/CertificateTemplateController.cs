using ivan_api.Services.CertificateTemplates;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.CertificateTemplates;
using ivan_api.Services.AuthenticationSer;
using Microsoft.AspNetCore.Authorization;
using ivan_api.DTOs.Common;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CertificateTemplateController : ControllerBase
    {
        private readonly ICertificateTemplateService _service;
        private readonly IAuthenticationService _authenticationService;

        public CertificateTemplateController(ICertificateTemplateService service, IAuthenticationService authenticationService)
        {
            _service = service;
            _authenticationService = authenticationService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _service.GetList(pageNumber, pageSize);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "Certificate templates retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving certificate templates",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("get/{id}")]
        public async Task<ActionResult<ApiResponseDTO<CertificateTemplateViewModel>>> Details(int id)
        {
            try
            {
                var result = await _service.GetCertificateTemplateById(id);
                if (result == null)
                {
                    return NotFound(new ApiResponseDTO<CertificateTemplateViewModel>
                    {
                        Success = false,
                        Message = "Certificate template not found",
                        Errors = new List<string> { $"Certificate template with ID {id} was not found" }
                    });
                }

                return Ok(new ApiResponseDTO<CertificateTemplateViewModel>
                {
                    Success = true,
                    Data = result,
                    Message = "Certificate template retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<CertificateTemplateViewModel>
                {
                    Success = false,
                    Message = "An error occurred while retrieving certificate template",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost("add")]
        [Authorize]
        public async Task<ActionResult<ApiResponseDTO<CertificateTemplateViewModel>>> Add([FromBody] CertificateTemplateInputModel input)
        {
            if (input == null)
            {
                return BadRequest(new ApiResponseDTO<CertificateTemplateViewModel>
                {
                    Success = false,
                    Message = "Invalid input data",
                    Errors = new List<string> { "Input model is required" }
                });
            }

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                    
                return BadRequest(new ApiResponseDTO<CertificateTemplateViewModel>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                });
            }

            try
            {
                // Get the authenticated user's ID
                var userId = _authenticationService.GetUserIdFromClaims(User);
                
                // Get the user's profile information including organization ID
                var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);
                
                // Set the organization ID from authenticated user (don't rely on frontend input)
                if (userInfo != null && userInfo.OrganizationId.HasValue)
                {
                    input.OrganizationId = userInfo.OrganizationId.Value;
                }
                
                var result = await _service.AddCertificateTemplate(input, userId);

                if (result == null)
                {
                    return BadRequest(new ApiResponseDTO<CertificateTemplateViewModel>
                    {
                        Success = false,
                        Message = "Failed to create certificate template",
                        Errors = new List<string> { "Unable to create certificate template" }
                    });
                }

                return CreatedAtAction(
                    nameof(Details),
                    new { id = result.TemplateId },
                    new ApiResponseDTO<CertificateTemplateViewModel>
                    {
                        Success = true,
                        Data = result,
                        Message = "Certificate template created successfully"
                    }
                );
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<CertificateTemplateViewModel>
                {
                    Success = false,
                    Message = "An error occurred while creating certificate template",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

    }
}
