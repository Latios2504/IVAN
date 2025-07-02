using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Models.Reports;
using WebAPI.Service.Reports;

namespace WebAPI.Controllers
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

        [HttpPost("listEventReport")]
        public async Task<IActionResult> ListEventReport([FromBody] ReportFilterModel filter)
        {
            var result = await _service.ListEventReport(filter);
            return Ok(result);
        }

        [HttpPost("listOrganizationReport")]
        public async Task<IActionResult> ListOrganizationReport([FromBody] ReportFilterModel filter)
        {
            var result = await _service.ListOrganizationReport(filter);
            return Ok(result);
        }

        [HttpPost("listSystemReport")]
        public async Task<IActionResult> ListSystemReport([FromBody] ReportFilterModel filter)
        {
            var result = await _service.ListSystemReport(filter);
            return Ok(result);
        }

        [HttpGet("getEventReport/{id}")]
        public async Task<IActionResult> GetEventReport(int id)
        {
            var result = await _service.GetEventReportById(id);
            return Ok(result);
        }

        [HttpGet("getOrganizationReport/{id}")]
        public async Task<IActionResult> GetOrganizationReport(int id)
        {
            var result = await _service.GetOrganizationReportById(id);
            return Ok(result);
        }

        [HttpGet("getSystemReport/{id}")]
        public async Task<IActionResult> GetSystemReport(int id)
        {
            var result = await _service.GetSystemReportById(id);
            return Ok(result);
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

            var result = await _service.AddEventReport(input);
            return Ok(result);
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

            var result = await _service.AddOrganizationReport(input);
            return Ok(result);
        }

        [HttpGet("downloadEventReport/{id}")]
        public async Task<IActionResult> DownloadEventReport(int id)
        {
            var test = await _service.GetEventReportById(id);

            if (test == null)
            {
                return NotFound();
            }

            var result = await _service.DownloadEventReportById(id);

            var stream = new MemoryStream();

            result.Save(stream);

            stream.Position = 0;
            string fileName = $"EventReport.pdf";

            return File(stream, "application/pdf", fileName);
        }

        [HttpGet("downloadOrganizationReport/{id}")]
        public async Task<IActionResult> DownloadOrganizationReport(int id)
        {
            var test = await _service.GetOrganizationReportById(id);

            if (test == null)
            {
                return NotFound();
            }

            var result = await _service.DownloadOrganizationReportById(id);

            var stream = new MemoryStream();

            result.Save(stream);

            stream.Position = 0;
            string fileName = $"OrganizationReport.pdf";

            return File(stream, "application/pdf", fileName);
        }

        [HttpGet("downloadSystemReport/{id}")]
        public async Task<IActionResult> DownloadSystemReport(int id)
        {
            var test = await _service.GetSystemReportById(id);

            if (test == null)
            {
                return NotFound();
            }

            var result = await _service.DownloadSystemReportById(id);

            var stream = new MemoryStream();

            result.Save(stream);

            stream.Position = 0;
            string fileName = $"SystemReport.pdf";

            return File(stream, "application/pdf", fileName);
        }
    }
}
