using ivan_api.Services.Certificates;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.Certificates;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CertificateController : ControllerBase
    {
        private readonly ICertificateService _service;

        public CertificateController(ICertificateService service)
        {
            _service = service;
        }

        //[HttpPost("list")]
        //public async Task<IActionResult> List([FromBody] CertificateFilterModel filter)
        //{
        //    var result = await _service.ListCertificate(filter);
        //    return Ok(result);
        //}

        [HttpGet]
        public async Task<IActionResult> GetList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _service.GetList(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> Details(int id)
        {
            var result = await _service.GetCertificateById(id);
            return Ok(result);
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromBody] CertificateInputModel input)
        {
            if (input == null)
            {
                input = new CertificateInputModel();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _service.AddCertificate(input);

            if (!result)//if false
            {
                return BadRequest(null);
            }

            var listDto = await _service.GetList(1, 100);

            var list = listDto.Items.ToList();

            var postAdd = await _service.GetCertificateById(list.Last().CertificateId);

            return Ok(postAdd);
        }

        [HttpGet("download/{id}")]
        public async Task<IActionResult> Download(int id)
        {
            var test = await _service.GetCertificateById(id);

            if (test == null)
            {
                return NotFound();
            }

            var result = await _service.DownloadCertificateById(id);

            var stream = new MemoryStream();

            result.Save(stream);

            stream.Position = 0;
            string fileName = $"certificate.pdf";

            return File(stream, "application/pdf", fileName);
        }

        //public async Task<int> getLastId()
        //{
        //    var temp = await _service.GetList(1, 1000);
        //    if (temp.Items == null) return -1;
        //    var lastLst = temp.Items.ToList();
        //    var last = lastLst.Last().CertificateId;

        //    return last == null ? -1 : last;
        //}
    }
}
