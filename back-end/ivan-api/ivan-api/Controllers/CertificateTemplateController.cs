using ivan_api.DTOs.CertificateTemplates;
using ivan_api.DTOs.Common;
using ivan_api.Services.AuthenticationSer;
using ivan_api.Services.CertificateTemplates;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CertificateTemplateController : ControllerBase
    {
        private readonly ICertificateTemplateService _service;
        private readonly IAuthenticationService _authenticationService;

        public CertificateTemplateController(ICertificateTemplateService service,
            IAuthenticationService authenticationService)
        {
            _service = service;
            _authenticationService = authenticationService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetList([FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
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

        [HttpPost("filter")]
        [Authorize]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetFilteredCertificateTemplates(
            [FromBody] CertificateTemplateFilterModel filter)
        {
            try
            {
                // Get the authenticated user's ID
                var userId = _authenticationService.GetUserIdFromClaims(User);

                // Get the user's profile information including organization ID
                var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);

                // Set the organization ID from authenticated user for organization-specific filtering
                // Only filter by organization if the user is not an admin and has an organization
                if (userInfo != null && userInfo.OrganizationId.HasValue && userInfo.RoleName.ToLower() != "admin")
                {
                    filter.OrganizationId = userInfo.OrganizationId.Value;
                }
                // For admin users, don't set OrganizationId filter - let them see all

                var result = await _service.ListCertificateTemplate(filter);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "Filtered certificate templates retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to retrieve filtered certificate templates",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost("add")]
        [Authorize]
        public async Task<ActionResult<ApiResponseDTO<CertificateTemplateViewModel>>> Add(
            [FromBody] CertificateTemplateInputModel input)
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

        [HttpPut("update/{id}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> Update(int id,
            [FromBody] CertificateTemplateUpdateModel updateModel)
        {
            if (updateModel == null)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Invalid update data",
                    Errors = new List<string> { "Request body cannot be null" }
                });
            }

            if (id != updateModel.TemplateId)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Certificate Template ID mismatch",
                    Errors = new List<string> { "URL ID does not match request body ID" }
                });
            }

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                });
            }

            try
            {
                var result = await _service.UpdateCertificateTemplate(updateModel);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to update certificate template",
                        Errors = new List<string> { "Unable to update certificate template" }
                    });
                }

                var updatedCertificateTemplate = await _service.GetCertificateTemplateById(id);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = updatedCertificateTemplate,
                    Message = "Certificate Template updated successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to update certificate template",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> Delete(int id)
        {
            try
            {
                var result = await _service.DeleteCertificateTemplate(id);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to delete certificate template",
                        Errors = new List<string> { "Unable to delete certificate template" }
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "Certificate Template deleted successfully",
                    Data = new { deletedId = id }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to delete certificate template",
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}
