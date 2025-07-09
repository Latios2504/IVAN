using ivan_api.Services.CertificateTemplates;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.CertificateTemplates;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CertificateTemplateController : ControllerBase
    {
        private readonly ICertificateTemplateService _service;

        public CertificateTemplateController(ICertificateTemplateService service)
        {
            _service = service;
        }

        [HttpPost("list")]
        public async Task<IActionResult> List([FromBody] CertificateTemplateFilterModel filter)
        {
            var result = await _service.ListCertificateTemplate(filter);
            return Ok(result);
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> Details(int id)
        {
            var result = await _service.GetCertificateTemplateById(id);
            return Ok(result);
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromBody] CertificateTemplateInputModel input)
        {
            if (input == null)
            {
                input = new CertificateTemplateInputModel();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _service.AddCertificateTemplate(input);
            return Ok(result);
        }
    }
}
