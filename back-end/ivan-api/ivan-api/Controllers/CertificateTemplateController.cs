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

        //[HttpPost("list")]
        //public async Task<IActionResult> List([FromBody] CertificateTemplateFilterModel filter)
        //{
        //    var result = await _service.ListCertificateTemplate(filter);
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

            if (!result)//if false
            {
                return BadRequest(null);
            }

            var listDto = await _service.GetList(1, 100);

            var list = listDto.Items.ToList();

            var postAdd = await _service.GetCertificateTemplateById(list.Last().TemplateId);

            return Ok(postAdd);
        }

        //public async Task<int> getLastId()
        //{
        //    var temp = await _service.GetList(1, 1000);
        //    if (temp.Items == null) return -1;
        //    var lastLst = temp.Items.ToList();
        //    var last = lastLst.Last().TemplateId;

        //    return last == null ? -1 : last;
        //}
    }
}
