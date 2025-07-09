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

        [HttpPost("list")]
        public async Task<IActionResult> List([FromBody] CertificateFilterModel filter)
        {
            var result = await _service.ListCertificate(filter);
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
            return Ok(result);
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
    }
}
