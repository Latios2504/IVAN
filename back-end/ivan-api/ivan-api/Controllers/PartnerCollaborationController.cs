using ivan_api.DTOs.PartnerCollaboration;
using ivan_api.DTOs.Common;
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
        public async Task<ActionResult<ApiResponseDTO<object>>> GetList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _service.GetList(pageNumber, pageSize);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "Partner collaborations retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving partner collaborations",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        // GET: api/partnercollaboration/{collaborationId}
        [HttpGet("{collaborationId:int}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetCollaborationDetail(int collaborationId)
        {
            try
            {
                var result = await _service.GetCollaborationDetail(collaborationId);
                if (result == null)
                {
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Partner collaboration not found",
                        Errors = new List<string> { $"Collaboration with ID {collaborationId} was not found" }
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "Partner collaboration retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving partner collaboration",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost("createCollaboration")]
        public async Task<ActionResult<ApiResponseDTO<object>>> CreateCollaboration(PartnerCollaborationCreateDto dto)
        {
            if (dto == null)
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
                var result = await _service.CreateCollaboration(dto);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "Partner collaboration created successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while creating partner collaboration",
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}
