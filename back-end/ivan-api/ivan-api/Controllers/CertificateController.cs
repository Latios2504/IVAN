using ivan_api.Constants;
using ivan_api.DTOs.Certificates;
using ivan_api.DTOs.Common;
using ivan_api.Models;
using ivan_api.Services.AuthenticationSer;
using ivan_api.Services.Certificates;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CertificateController : ControllerBase
    {
        private readonly ICertificateService _service;
        private readonly VolunteerManagementSystemContext _dbContext;
        private readonly IAuthenticationService _auth;


        public CertificateController(ICertificateService service, IAuthenticationService auth, VolunteerManagementSystemContext dbContext)
        {
            _service = service;
            _auth = auth;
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetList([FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = _auth.GetUserIdFromClaims(User);

            var result = role switch
            {
                AuthenticationConstants.Roles.Admin => await _service.GetAllCertificates(pageNumber, pageSize),
                AuthenticationConstants.Roles.Volunteer => await _service.GetCertificatesForVolunteer(userId, pageNumber, pageSize),
                AuthenticationConstants.Roles.Organization or AuthenticationConstants.Roles.VolunteerCoordinator
                    => await _service.GetCertificatesForMyOrganization(userId, pageNumber, pageSize),
                _ => null
            };

            if (result == null) return Forbid();

            return Ok(new ApiResponseDTO<object> { Success = true, Data = result, Message = "Certificates retrieved successfully" });

        }



        [HttpGet("by-organization/{organizationId}")]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.Admin},{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetByOrganization(int organizationId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = _auth.GetUserIdFromClaims(User);

            if (role != AuthenticationConstants.Roles.Admin)
            {
                var myOrgId = await _service.ResolveMyOrganizationId(userId);
                if (myOrgId == null || myOrgId.Value != organizationId) return Forbid();
            }

            var result = await _service.GetCertificatesByOrganization(organizationId, pageNumber, pageSize);
            return Ok(new ApiResponseDTO<object> { Success = true, Data = result, Message = "Organization certificates retrieved successfully" });
        }

        [HttpPost("filter")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetFilteredCertificates(
            [FromBody] CertificateFilterModel filter)
        {
            try
            {
                if (filter == null)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Invalid filter data",
                        Errors = new List<string> { "Request body cannot be null" }
                    });
                }

                // LẤY UserId từ JWT
                var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)
                             ?? User.FindFirst("nameid")
                             ?? User.FindFirst("sub")
                             ?? User.FindFirst("userId")
                             ?? User.FindFirst("uid");

                if (idClaim == null || !int.TryParse(idClaim.Value, out var userId))
                {
                    return Unauthorized(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Cannot resolve user id from JWT",
                        Errors = new List<string> { "Missing or invalid user id claim" }
                    });
                }

                // Truy vấn OrganizationId dựa vào UserId hiện tại
                var organizationId = await _dbContext.Organizations
                    .Where(o => o.UserId == userId)
                    .Select(o => o.OrganizationId)
                    .FirstOrDefaultAsync();

                if (organizationId == 0)
                {
                    return Forbid();
                }

                // GÁN OrganizationId vào filter để service chỉ trả chứng chỉ của tổ chức này
                filter.OrganizationId = organizationId;

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
        [Authorize(Roles = ivan_api.Constants.AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<ActionResult<ApiResponseDTO<object>>> Add([FromBody] CertificateInputModel input)
        {
            if (input == null)
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Invalid input data",
                    Errors = new List<string> { "Request body cannot be null" }
                });

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                });
            }

            var userId = _auth.GetUserIdFromClaims(User); // _auth: service đọc JWT như hiện có trong dự án
            var ok = await _service.AddCertificate(input, userId); // truyền createdByUserId xuống service
            if (!ok)
                return BadRequest(new ApiResponseDTO<object> { Success = false, Message = "Failed to create certificate" });

            // Giữ logic trả về bản ghi vừa tạo (tương tự code gốc của bạn)
            var lastId = await _service.GetLastId();
            var postAdd = await _service.GetCertificateById(lastId);
            return Ok(new ApiResponseDTO<object> { Success = true, Data = postAdd, Message = "Certificate created and submitted for approval" });
        }


        [HttpPut("update/{id}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> Update(int id,
            [FromBody] CertificateUpdateModel updateModel)
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

        // Approve — chỉ cho Organization (và Admin)
        [Authorize(Roles = $"{ivan_api.Constants.AuthenticationConstants.Roles.Organization},{ivan_api.Constants.AuthenticationConstants.Roles.Admin}")]
        [HttpPut("approve/{id:int}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> Approve(int id,
            [FromBody] CertificateApprovalModel approvalModel)
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

            // Chuẩn hoá certificateId: nếu body không có thì dùng id từ URL;
            // nếu cả hai đều có thì bắt buộc trùng nhau.
            if (approvalModel.CertificateId == null || approvalModel.CertificateId <= 0)
            {
                approvalModel.CertificateId = id;
            }
            else if (id != approvalModel.CertificateId)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Certificate ID mismatch",
                    Errors = new List<string> { "URL ID does not match request body ID" }
                });
            }

            // --- LẤY ApprovedBy TỪ JWT (BỎ QUA GIÁ TRỊ CLIENT GỬI LÊN) ---
            // Ưu tiên ClaimTypes.NameIdentifier; fallback các claim phổ biến khác
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)
                         ?? User.FindFirst("nameid")
                         ?? User.FindFirst("sub")
                         ?? User.FindFirst("userId")
                         ?? User.FindFirst("uid");

            if (idClaim == null || !int.TryParse(idClaim.Value, out var approverUserId))
            {
                return Unauthorized(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Cannot resolve approver from JWT",
                    Errors = new List<string> { "Missing/invalid user id claim" }
                });
            }

            // Gán lại ApprovedBy để service/repository dùng đúng UserId tồn tại trong bảng Users
            approvalModel.ApprovedBy = approverUserId;

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

        // Reject — chỉ cho Organization (và Admin)
        [Authorize(Roles = $"{ivan_api.Constants.AuthenticationConstants.Roles.Organization},{ivan_api.Constants.AuthenticationConstants.Roles.Admin}")]
        [HttpPut("reject/{id}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> Reject(int id,
            [FromBody] CertificateRejectionModel rejectionModel)
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
        public async Task<ActionResult<ApiResponseDTO<object>>> BulkApprove(
            [FromBody] BulkCertificateActionModel bulkActionModel)
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
        public async Task<ActionResult<ApiResponseDTO<object>>> BulkRevoke(
            [FromBody] BulkCertificateActionModel bulkActionModel)
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
