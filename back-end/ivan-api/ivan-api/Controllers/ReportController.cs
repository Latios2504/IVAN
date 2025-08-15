using DocumentFormat.OpenXml.Wordprocessing;
using ivan_api.DTOs.Reports;
using ivan_api.DTOs.Common;
using ivan_api.Services.Reports;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _service;

        public ReportController(IReportService service)
        {
            _service = service;
        }

        [HttpGet("listEventReport")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetEventReportList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _service.GetEventReportList(pageNumber, pageSize);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "Event reports retrieved successfully"
                });
            }
            catch(Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving event reports",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("listOrganizationReport")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetOrganizationReportList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _service.GetOrganizationReportList(pageNumber, pageSize);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "Organization reports retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving organization reports",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("listSystemReport")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetSystemReportList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _service.GetSystemReportList(pageNumber, pageSize);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "System reports retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving system reports",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("getEventReport/{id}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetEventReport(int id)
        {
            try
            {
                var result = await _service.GetEventReportById(id);
                if (result == null)
                {
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Event report not found",
                        Errors = new List<string> { $"Event report with ID {id} was not found" }
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "Event report retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving event report",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("getOrganizationReport/{id}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetOrganizationReport(int id)
        {
            try
            {
                var result = await _service.GetOrganizationReportById(id);
                if (result == null)
                {
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Organization report not found",
                        Errors = new List<string> { $"Organization report with ID {id} was not found" }
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "Organization report retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving organization report",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("getSystemReport/{id}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetSystemReport(int id)
        {
            try
            {
                var result = await _service.GetSystemReportById(id);
                if (result == null)
                {
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "System report not found",
                        Errors = new List<string> { $"System report with ID {id} was not found" }
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "System report retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving system report",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost("addEventReport")]
        public async Task<ActionResult<ApiResponseDTO<object>>> AddEventReport([FromBody] ReportInputModel input)
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
                var result = await _service.AddEventReport(input);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to add event report",
                        Errors = new List<string> { "Unable to create event report" }
                    });
                }

                var listDto = await _service.GetEventReportList(1, 100);
                var list = listDto.Items.ToList();
                var postAdd = await _service.GetEventReportById(list.Last().ReportId);

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = postAdd,
                    Message = "Event report created successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while creating event report",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost("addOrganizationReport")]
        public async Task<ActionResult<ApiResponseDTO<object>>> AddOrganizationReport([FromBody] ReportInputModel input)
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
                var result = await _service.AddOrganizationReport(input);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to add organization report",
                        Errors = new List<string> { "Unable to create organization report" }
                    });
                }

                var listDto = await _service.GetOrganizationReportList(1, 100);
                var list = listDto.Items.ToList();
                var postAdd = await _service.GetOrganizationReportById(list.Last().ReportId);

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = postAdd,
                    Message = "Organization report created successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while creating organization report",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("downloadEventReport/{id}")]
        public async Task<IActionResult> DownloadEventReport(int id)
        {
            var test = await _service.GetEventReportById(id);

            if (test == null)
            {
                return NotFound();
            }

            try
            {
                var result = await _service.DownloadEventReportById(id);

                var stream = new MemoryStream();

                result.Save(stream);

                stream.Position = 0;
                string fileName = $"EventReport.pdf";

                return File(stream, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("downloadOrganizationReport/{id}")]
        public async Task<IActionResult> DownloadOrganizationReport(int id)
        {
            var test = await _service.GetOrganizationReportById(id);

            if (test == null)
            {
                return NotFound();
            }

            try
            {
                var result = await _service.DownloadOrganizationReportById(id);

                var stream = new MemoryStream();

                result.Save(stream);

                stream.Position = 0;
                string fileName = $"OrganizationReport.pdf";

                return File(stream, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("downloadSystemReport/{id}")]
        public async Task<IActionResult> DownloadSystemReport(int id)
        {
            var test = await _service.GetSystemReportById(id);

            if (test == null)
            {
                return NotFound();
            }

            try
            {
                var result = await _service.DownloadSystemReportById(id);

                var stream = new MemoryStream();

                result.Save(stream);

                stream.Position = 0;
                string fileName = $"SystemReport.pdf";

                return File(stream, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
