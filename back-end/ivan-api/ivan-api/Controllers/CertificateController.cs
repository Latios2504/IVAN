using ivan_api.Services.Certificates;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.Certificates;
using Microsoft.AspNetCore.Authorization;

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
        public async Task<IActionResult> GetList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _service.GetList(pageNumber, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("by-organization/{organizationId}")]
        public async Task<IActionResult> GetByOrganization(int organizationId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _service.GetCertificatesByOrganization(organizationId, pageNumber, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("filter")]
        public async Task<IActionResult> GetFilteredCertificates([FromBody] CertificateFilterModel filter)
        {
            try
            {
                var result = await _service.ListCertificate(filter);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> Details(int id)
        {
            try
            {
                var result = await _service.GetCertificateById(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromBody] CertificateInputModel input)
        {
            if (input == null)
            {
                return BadRequest(new { message = "Invalid input data" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _service.AddCertificate(input);

                if (!result)
                {
                    return BadRequest(new { message = "Failed to create certificate" });
                }

                // Get the newly created certificate
                var listDto = await _service.GetList(1, 100);
                var list = listDto.Items.ToList();
                var postAdd = await _service.GetCertificateById(list.Last().CertificateId);

                return Ok(postAdd);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CertificateUpdateModel updateModel)
        {
            if (updateModel == null)
            {
                return BadRequest(new { message = "Invalid update data" });
            }

            if (id != updateModel.CertificateId)
            {
                return BadRequest(new { message = "Certificate ID mismatch" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _service.UpdateCertificate(updateModel);

                if (!result)
                {
                    return BadRequest(new { message = "Failed to update certificate" });
                }

                var updatedCertificate = await _service.GetCertificateById(id);
                return Ok(updatedCertificate);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var result = await _service.DeleteCertificate(id);

                if (!result)
                {
                    return BadRequest(new { message = "Failed to delete certificate" });
                }

                return Ok(new { message = "Certificate deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("approve/{id}")]
        public async Task<IActionResult> Approve(int id, [FromBody] CertificateApprovalModel approvalModel)
        {
            if (approvalModel == null)
            {
                return BadRequest(new { message = "Invalid approval data" });
            }

            if (id != approvalModel.CertificateId)
            {
                return BadRequest(new { message = "Certificate ID mismatch" });
            }

            try
            {
                var result = await _service.ApproveCertificate(approvalModel);

                if (!result)
                {
                    return BadRequest(new { message = "Failed to approve certificate" });
                }

                var approvedCertificate = await _service.GetCertificateById(id);
                return Ok(approvedCertificate);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("reject/{id}")]
        public async Task<IActionResult> Reject(int id, [FromBody] CertificateRejectionModel rejectionModel)
        {
            if (rejectionModel == null)
            {
                return BadRequest(new { message = "Invalid rejection data" });
            }

            if (id != rejectionModel.CertificateId)
            {
                return BadRequest(new { message = "Certificate ID mismatch" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _service.RejectCertificate(rejectionModel);

                if (!result)
                {
                    return BadRequest(new { message = "Failed to reject certificate" });
                }

                var rejectedCertificate = await _service.GetCertificateById(id);
                return Ok(rejectedCertificate);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("bulk-approve")]
        public async Task<IActionResult> BulkApprove([FromBody] BulkCertificateActionModel bulkActionModel)
        {
            if (bulkActionModel == null || !bulkActionModel.CertificateIds.Any())
            {
                return BadRequest(new { message = "Invalid bulk action data" });
            }

            try
            {
                var result = await _service.BulkApproveCertificates(bulkActionModel);

                if (!result)
                {
                    return BadRequest(new { message = "Failed to approve certificates" });
                }

                return Ok(new { message = $"Successfully approved {bulkActionModel.CertificateIds.Count} certificates" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("bulk-revoke")]
        public async Task<IActionResult> BulkRevoke([FromBody] BulkCertificateActionModel bulkActionModel)
        {
            if (bulkActionModel == null || !bulkActionModel.CertificateIds.Any())
            {
                return BadRequest(new { message = "Invalid bulk action data" });
            }

            try
            {
                var result = await _service.BulkRevokeCertificates(bulkActionModel);

                if (!result)
                {
                    return BadRequest(new { message = "Failed to revoke certificates" });
                }

                return Ok(new { message = $"Successfully revoked {bulkActionModel.CertificateIds.Count} certificates" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
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
