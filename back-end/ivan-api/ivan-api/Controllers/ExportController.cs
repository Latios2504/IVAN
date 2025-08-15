using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.Export;
using ivan_api.Services.ExportService;
using ivan_api.Constants;
using ivan_api.DTOs;
using ivan_api.DTOs.Common;

namespace ivan_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ExportController : ControllerBase
    {
        private readonly IExportService _exportService;
        private readonly ILogger<ExportController> _logger;

        public ExportController(IExportService exportService, ILogger<ExportController> logger)
        {
            _exportService = exportService;
            _logger = logger;
        }

        /// Export analytics data in various formats (Excel, CSV, PDF, JSON)
        [HttpPost("analytics")]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.Admin},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<IActionResult> ExportAnalytics([FromBody] AnalyticsExportRequest request)
        {
            try
            {
                _logger.LogInformation("Analytics export requested by user {UserId} with format {Format}", 
                    User?.Identity?.Name, request.Format);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _exportService.ExportAnalyticsAsync(request);

                if (!result.Success)
                {
                    _logger.LogError("Analytics export failed: {ErrorMessage}", result.ErrorMessage);
                    return BadRequest(new { message = result.ErrorMessage });
                }

                _logger.LogInformation("Analytics export completed successfully. File: {FileName}, Records: {RecordCount}, Size: {FileSizeBytes} bytes", 
                    result.FileName, result.RecordCount, result.FileSizeBytes);

                return File(result.Data, result.ContentType, result.FileName);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning("Invalid analytics export request: {Message}", ex.Message);
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = ex.Message,
                    Errors = new List<string> { ex.Message }
                });
            }
            catch (NotImplementedException ex)
            {
                _logger.LogWarning("Export format not yet implemented: {Message}", ex.Message);
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Định dạng xuất dữ liệu này chưa được hỗ trợ. Vui lòng sử dụng Excel, CSV hoặc JSON.",
                    Errors = new List<string> { ex.Message }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during analytics export");
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi trong quá trình xuất dữ liệu. Vui lòng thử lại sau.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// Export user data in various formats
        [HttpPost("users")]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.Admin},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<IActionResult> ExportUsers([FromBody] UserExportRequest request)
        {
            try
            {
                _logger.LogInformation("User export requested by user {UserId} with format {Format}", 
                    User?.Identity?.Name, request.Format);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _exportService.ExportUsersAsync(request);

                if (!result.Success)
                {
                    _logger.LogError("User export failed: {ErrorMessage}", result.ErrorMessage);
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = result.ErrorMessage,
                        Errors = new List<string> { result.ErrorMessage }
                    });
                }

                _logger.LogInformation("User export completed successfully. File: {FileName}, Records: {RecordCount}", 
                    result.FileName, result.RecordCount);

                return File(result.Data, result.ContentType, result.FileName);
            }
            catch (NotImplementedException ex)
            {
                _logger.LogWarning("User export not yet implemented: {Message}", ex.Message);
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Tính năng xuất dữ liệu người dùng sẽ được triển khai trong Giai đoạn 2.",
                    Errors = new List<string> { ex.Message }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during user export");
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi trong quá trình xuất dữ liệu. Vui lòng thử lại sau.",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// Export event data in various formats
        [HttpPost("events")]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.Admin},{AuthenticationConstants.Roles.VolunteerCoordinator},{AuthenticationConstants.Roles.Organization}")]
        public async Task<IActionResult> ExportEvents([FromBody] EventExportRequest request)
        {
            try
            {
                _logger.LogInformation("Event export requested by user {UserId} with format {Format}", 
                    User?.Identity?.Name, request.Format);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _exportService.ExportEventsAsync(request);

                if (!result.Success)
                {
                    _logger.LogError("Event export failed: {ErrorMessage}", result.ErrorMessage);
                    return BadRequest(new { message = result.ErrorMessage });
                }

                _logger.LogInformation("Event export completed successfully. File: {FileName}, Records: {RecordCount}", 
                    result.FileName, result.RecordCount);

                return File(result.Data, result.ContentType, result.FileName);
            }
            catch (NotImplementedException ex)
            {
                _logger.LogWarning("Event export not yet implemented: {Message}", ex.Message);
                return BadRequest(new { message = "Tính năng xuất dữ liệu sự kiện sẽ được triển khai trong Giai đoạn 2." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during event export");
                return StatusCode(500, new { message = "Đã xảy ra lỗi trong quá trình xuất dữ liệu. Vui lòng thử lại sau." });
            }
        }

        /// Export event registration data in various formats
        [HttpPost("event-registrations")]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.Admin},{AuthenticationConstants.Roles.VolunteerCoordinator},{AuthenticationConstants.Roles.Organization}")]
        public async Task<IActionResult> ExportEventRegistrations([FromBody] EventRegistrationExportRequest request)
        {
            try
            {
                _logger.LogInformation("Event registration export requested by user {UserId} with format {Format}", 
                    User?.Identity?.Name, request.Format);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _exportService.ExportEventRegistrationsAsync(request);

                if (!result.Success)
                {
                    _logger.LogError("Event registration export failed: {ErrorMessage}", result.ErrorMessage);
                    return BadRequest(new { message = result.ErrorMessage });
                }

                _logger.LogInformation("Event registration export completed successfully. File: {FileName}, Records: {RecordCount}", 
                    result.FileName, result.RecordCount);

                return File(result.Data, result.ContentType, result.FileName);
            }
            catch (NotImplementedException ex)
            {
                _logger.LogWarning("Event registration export not yet implemented: {Message}", ex.Message);
                return BadRequest(new { message = "Tính năng xuất dữ liệu đăng ký sự kiện sẽ được triển khai trong Giai đoạn 2." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during event registration export");
                return StatusCode(500, new { message = "Đã xảy ra lỗi trong quá trình xuất dữ liệu. Vui lòng thử lại sau." });
            }
        }

        /// Export organization data in various formats (Admin only)
        [HttpPost("organizations")]
        [Authorize(Roles = AuthenticationConstants.Roles.Admin)]
        public async Task<IActionResult> ExportOrganizations([FromBody] OrganizationExportRequest request)
        {
            try
            {
                _logger.LogInformation("Organization export requested by admin user {UserId} with format {Format}", 
                    User?.Identity?.Name, request.Format);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _exportService.ExportOrganizationDataAsync(request);

                if (!result.Success)
                {
                    _logger.LogError("Organization export failed: {ErrorMessage}", result.ErrorMessage);
                    return BadRequest(new { message = result.ErrorMessage });
                }

                _logger.LogInformation("Organization export completed successfully. File: {FileName}, Records: {RecordCount}", 
                    result.FileName, result.RecordCount);

                return File(result.Data, result.ContentType, result.FileName);
            }
            catch (NotImplementedException ex)
            {
                _logger.LogWarning("Organization export not yet implemented: {Message}", ex.Message);
                return BadRequest(new { message = "Tính năng xuất dữ liệu tổ chức sẽ được triển khai trong Giai đoạn 2." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during organization export");
                return StatusCode(500, new { message = "Đã xảy ra lỗi trong quá trình xuất dữ liệu. Vui lòng thử lại sau." });
            }
        }

        /// Get available export formats and their capabilities
        [HttpGet("formats")]
        public ActionResult<ApiResponseDTO<object>> GetSupportedFormats()
        {
            var formats = new[]
            {
                new
                {
                    Format = "Excel",
                    Value = "Excel",
                    Description = "Tệp Excel (.xlsx) với định dạng và biểu đồ",
                    MimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    Extension = ".xlsx",
                    Supported = true
                },
                new
                {
                    Format = "CSV",
                    Value = "Csv",
                    Description = "Tệp CSV (.csv) tương thích với Excel và Google Sheets",
                    MimeType = "text/csv",
                    Extension = ".csv",
                    Supported = true
                },
                new
                {
                    Format = "JSON",
                    Value = "Json",
                    Description = "Tệp JSON (.json) cho phân tích và tích hợp API",
                    MimeType = "application/json",
                    Extension = ".json",
                    Supported = true
                },
                new
                {
                    Format = "PDF",
                    Value = "Pdf",
                    Description = "Báo cáo PDF (.pdf) với biểu đồ và định dạng chuyên nghiệp",
                    MimeType = "application/pdf",
                    Extension = ".pdf",
                    Supported = false // Will be implemented in Phase 3
                }
            };

            return Ok(new ApiResponseDTO<object>
            {
                Success = true,
                Data = new
                {
                    Formats = formats,
                    DefaultFormat = "Excel",
                    SupportedLanguages = new[] { "vi-VN", "en-US" },
                    DefaultLanguage = "vi-VN"
                },
                Message = "Export formats retrieved successfully"
            });
        }

        /// Get export statistics and usage information
        [HttpGet("statistics")]
        [Authorize(Roles = AuthenticationConstants.Roles.Admin)]
        public ActionResult<ApiResponseDTO<object>> GetExportStatistics()
        {
            // TODO: Implement export statistics tracking
            // This would track export frequency, popular formats, file sizes, etc.
            return Ok(new ApiResponseDTO<object>
            {
                Success = true,
                Data = new
                {
                    Message = "Thống kê xuất dữ liệu sẽ được triển khai trong phiên bản tương lai",
                    TotalExports = 0,
                    PopularFormat = "Excel",
                    LastExportDate = (DateTime?)null
                },
                Message = "Export statistics retrieved successfully"
            });
        }
    }
}
