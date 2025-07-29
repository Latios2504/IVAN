using ivan_api.Services.Reports;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.Reports;

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

        //[HttpPost("listEventReport")]
        //public async Task<IActionResult> ListEventReport([FromBody] ReportFilterModel filter)
        //{
        //    var result = await _service.ListEventReport(filter);
        //    return Ok(result);
        //}

        //[HttpPost("listOrganizationReport")]
        //public async Task<IActionResult> ListOrganizationReport([FromBody] ReportFilterModel filter)
        //{
        //    var result = await _service.ListOrganizationReport(filter);
        //    return Ok(result);
        //}

        //[HttpPost("listSystemReport")]
        //public async Task<IActionResult> ListSystemReport([FromBody] ReportFilterModel filter)
        //{
        //    var result = await _service.ListSystemReport(filter);
        //    return Ok(result);
        //}

        [HttpGet("listEventReport")]
        public async Task<IActionResult> GetEventReportList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _service.GetEventReportList(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("listOrganizationReport")]
        public async Task<IActionResult> GetOrganizationReportList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _service.GetOrganizationReportList(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("listSystemReport")]
        public async Task<IActionResult> GetSystemReportList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _service.GetSystemReportList(pageNumber, pageSize);
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

            if (!result)//if false
            {
                return BadRequest(null);
            }

            var listDto = await _service.GetEventReportList(1, 100);

            var list = listDto.Items.ToList();

            var postAdd = await _service.GetEventReportById(list.Last().ReportId);

            return Ok(postAdd);
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


            if (!result)//if false
            {
                return BadRequest(null);
            }

            var listDto = await _service.GetOrganizationReportList(1, 100);

            var list = listDto.Items.ToList();

            var postAdd = await _service.GetOrganizationReportById(list.Last().ReportId);

            return Ok(postAdd);
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

        //public async Task<int> getLastIdEvent()
        //{
        //    var temp = await _service.GetEventReportList(1, 1000);
        //    if (temp.Items == null) return -1;
        //    var lastLst = temp.Items.ToList();
        //    var last = lastLst.Last().ReportId;

        //    return last == null ? -1 : last;
        //}

        //public async Task<int> getLastIdOrganization()
        //{
        //    var temp = await _service.GetOrganizationReportList(1, 1000);
        //    if (temp.Items == null) return -1;
        //    var lastLst = temp.Items.ToList();
        //    var last = lastLst.Last().ReportId;

        //    return last == null ? -1 : last;
        //}

        //public async Task<int> getLastIdSystem()
        //{
        //    var temp = await _service.GetSystemReportList(1, 1000);
        //    if (temp.Items == null) return -1;
        //    var lastLst = temp.Items.ToList();
        //    var last = lastLst.Last().ReportId;

        //    return last == null ? -1 : last;
        //}
    }
}
