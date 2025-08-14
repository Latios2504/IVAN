using DocumentFormat.OpenXml.Wordprocessing;
using ivan_api.DTOs.Reports;
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
        public async Task<IActionResult> GetEventReportList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _service.GetEventReportList(pageNumber, pageSize);
                return Ok(result);
            }
            catch(Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("listOrganizationReport")]
        public async Task<IActionResult> GetOrganizationReportList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _service.GetOrganizationReportList(pageNumber, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("listSystemReport")]
        public async Task<IActionResult> GetSystemReportList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _service.GetSystemReportList(pageNumber, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getEventReport/{id}")]
        public async Task<IActionResult> GetEventReport(int id)
        {
            try
            {
                var result = await _service.GetEventReportById(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("getOrganizationReport/{id}")]
        public async Task<IActionResult> GetOrganizationReport(int id)
        {
            try
            {
                var result = await _service.GetOrganizationReportById(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("getSystemReport/{id}")]
        public async Task<IActionResult> GetSystemReport(int id)
        {
            try
            {
                var result = await _service.GetSystemReportById(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost("addEventReport")]
        public async Task<IActionResult> AddEventReport([FromBody] ReportInputModel input)
        {
            if (input == null)
            {
                input = new ReportInputModel();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _service.AddEventReport(input);

                if (!result)//if false
                {
                    return BadRequest(null);
                }

                var listDto = await _service.GetEventReportList(1, 100);

                var list = listDto.Items.ToList();

                var postAdd = await _service.GetEventReportById(list.Last().ReportId);

                return Ok(postAdd);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("addOrganizationReport")]
        public async Task<IActionResult> AddOrganizationReport([FromBody] ReportInputModel input)
        {
            if (input == null)
            {
                input = new ReportInputModel();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _service.AddOrganizationReport(input);


                if (!result)//if false
                {
                    return BadRequest(null);
                }

                var listDto = await _service.GetOrganizationReportList(1, 100);

                var list = listDto.Items.ToList();

                var postAdd = await _service.GetOrganizationReportById(list.Last().ReportId);

                return Ok(postAdd);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
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
