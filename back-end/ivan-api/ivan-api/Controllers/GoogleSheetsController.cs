using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs;
using ivan_api.Services;

namespace ivan_api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")] // Chỉ Admin được sử dụng
public class GoogleSheetsController : ControllerBase
{
    private readonly IGoogleSheetsService _googleSheetsService;
    private readonly ILogger<GoogleSheetsController> _logger;

    public GoogleSheetsController(IGoogleSheetsService googleSheetsService, ILogger<GoogleSheetsController> logger)
    {
        _googleSheetsService = googleSheetsService;
        _logger = logger;
    }

    [HttpPost("read-data")]
    public async Task<ActionResult<ApiResponseDTO<GoogleSheetsResponseDTO>>> ReadSheetData([FromBody] GoogleSheetsRequestDTO request)
    {
        try
        {
            _logger.LogInformation("Reading Google Sheets data with query: {Query}", request.Query);

            var result = await _googleSheetsService.ReadSheetDataAsync(
                request.Query, 
                request.SheetId, 
                request.Range
            );

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reading Google Sheets data");
            
            return StatusCode(500, new ApiResponseDTO<GoogleSheetsResponseDTO>
            {
                Success = false,
                Message = "Lỗi server khi đọc dữ liệu Google Sheets",
                Data = null
            });
        }
    }

    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { status = "healthy", service = "Google Sheets Service", timestamp = DateTime.UtcNow });
    }
}
