using ivan_api.DTOs.PartnerCollaboration;
using ivan_api.Services.PartnerCollaborationServ;
using Microsoft.AspNetCore.Mvc;

namespace ivan_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PartnerCollaborationController : ControllerBase
    {
        private readonly IPartnerCollaborationService _service;

        public PartnerCollaborationController(IPartnerCollaborationService service)
        {
            _service = service;
        }

        // GET: api/partnercollaboration
        [HttpGet]
        public async Task<IActionResult> GetList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _service.GetList(pageNumber, pageSize);
            return Ok(result);
        }

        // GET: api/partnercollaboration/{collaborationId}
        [HttpGet("{collaborationId:int}")]
        public async Task<IActionResult> GetCollaborationDetail(int collaborationId)
        {
            try
            {
                var result = await _service.GetCollaborationDetail(collaborationId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost("createCollaboration")]
        public async Task<IActionResult> CreateCollaboration(PartnerCollaborationCreateDto dto)
        {
            try
            {
                var result = await _service.CreateCollaboration(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
