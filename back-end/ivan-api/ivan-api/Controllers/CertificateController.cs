using ivan_api.Services.Certificates;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.Certificates;
using Microsoft.AspNetCore.Authorization;
using ivan_api.DTOs.Common;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CertificateController : ControllerBase
    {
        private readonly ICertificateService _service;

        public CertificateController(ICertificateService service)
        {
            _service = service;
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
                    Message = "Certificates retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to retrieve certificates",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("by-organization/{organizationId}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetByOrganization(int organizationId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _service.GetCertificatesByOrganization(organizationId, pageNumber, pageSize);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "Organization certificates retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to retrieve organization certificates",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost("filter")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetFilteredCertificates([FromBody] CertificateFilterModel filter)
        {
            try
            {
                var result = await _service.ListCertificate(filter);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "Filtered certificates retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to retrieve filtered certificates",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("get/{id}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> Details(int id)
        {
            try
            {
                var result = await _service.GetCertificateById(id);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "Certificate retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return NotFound(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Certificate not found",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost("add")]
        public async Task<ActionResult<ApiResponseDTO<object>>> Add([FromBody] CertificateInputModel input)
        {
            if (input == null)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Invalid input data",
                    Errors = new List<string> { "Request body cannot be null" }
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
                var result = await _service.AddCertificate(input);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to create certificate",
                        Errors = new List<string> { "Unable to create certificate" }
                    });
                }

                // Get the newly created certificate
                var listDto = await _service.GetList(1, 100);
                var list = listDto.Items.ToList();
                var postAdd = await _service.GetCertificateById(list.Last().CertificateId);

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = postAdd,
                    Message = "Certificate created successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to create certificate",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPut("update/{id}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> Update(int id, [FromBody] CertificateUpdateModel updateModel)
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

            if (id != updateModel.CertificateId)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Certificate ID mismatch",
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
                var result = await _service.UpdateCertificate(updateModel);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to update certificate",
                        Errors = new List<string> { "Unable to update certificate" }
                    });
                }

                var updatedCertificate = await _service.GetCertificateById(id);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = updatedCertificate,
                    Message = "Certificate updated successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to update certificate",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> Delete(int id)
        {
            try
            {
                var result = await _service.DeleteCertificate(id);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to delete certificate",
                        Errors = new List<string> { "Unable to delete certificate" }
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "Certificate deleted successfully",
                    Data = new { deletedId = id }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to delete certificate",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPut("approve/{id}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> Approve(int id, [FromBody] CertificateApprovalModel approvalModel)
        {
            if (approvalModel == null)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Invalid approval data",
                    Errors = new List<string> { "Request body cannot be null" }
                });
            }

            if (id != approvalModel.CertificateId)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Certificate ID mismatch",
                    Errors = new List<string> { "URL ID does not match request body ID" }
                });
            }

            try
            {
                var result = await _service.ApproveCertificate(approvalModel);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to approve certificate",
                        Errors = new List<string> { "Unable to approve certificate" }
                    });
                }

                var approvedCertificate = await _service.GetCertificateById(id);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = approvedCertificate,
                    Message = "Certificate approved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to approve certificate",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPut("reject/{id}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> Reject(int id, [FromBody] CertificateRejectionModel rejectionModel)
        {
            if (rejectionModel == null)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Invalid rejection data",
                    Errors = new List<string> { "Request body cannot be null" }
                });
            }

            if (id != rejectionModel.CertificateId)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Certificate ID mismatch",
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
                var result = await _service.RejectCertificate(rejectionModel);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to reject certificate",
                        Errors = new List<string> { "Unable to reject certificate" }
                    });
                }

                var rejectedCertificate = await _service.GetCertificateById(id);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = rejectedCertificate,
                    Message = "Certificate rejected successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to reject certificate",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost("bulk-approve")]
        public async Task<ActionResult<ApiResponseDTO<object>>> BulkApprove([FromBody] BulkCertificateActionModel bulkActionModel)
        {
            if (bulkActionModel == null || !bulkActionModel.CertificateIds.Any())
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Invalid bulk action data",
                    Errors = new List<string> { "Certificate IDs list cannot be null or empty" }
                });
            }

            try
            {
                var result = await _service.BulkApproveCertificates(bulkActionModel);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to approve certificates",
                        Errors = new List<string> { "Unable to approve certificates" }
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = $"Successfully approved {bulkActionModel.CertificateIds.Count} certificates",
                    Data = new { approvedCount = bulkActionModel.CertificateIds.Count }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to approve certificates",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost("bulk-revoke")]
        public async Task<ActionResult<ApiResponseDTO<object>>> BulkRevoke([FromBody] BulkCertificateActionModel bulkActionModel)
        {
            if (bulkActionModel == null || !bulkActionModel.CertificateIds.Any())
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Invalid bulk action data",
                    Errors = new List<string> { "Certificate IDs list cannot be null or empty" }
                });
            }

            try
            {
                var result = await _service.BulkRevokeCertificates(bulkActionModel);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to revoke certificates",
                        Errors = new List<string> { "Unable to revoke certificates" }
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = $"Successfully revoked {bulkActionModel.CertificateIds.Count} certificates",
                    Data = new { revokedCount = bulkActionModel.CertificateIds.Count }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to revoke certificates",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("download/{id}")]
        public async Task<IActionResult> Download(int id)
        {
            try
            {
                var certificate = await _service.GetCertificateById(id);

                if (certificate == null)
                {
                    return NotFound(new { message = "Certificate not found" });
                }

                var result = await _service.DownloadCertificateById(id);

                var stream = new MemoryStream();
                result.Save(stream);
                stream.Position = 0;

                string fileName = $"certificate_{certificate.CertificateNumber ?? id.ToString()}.pdf";

                return File(stream, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
