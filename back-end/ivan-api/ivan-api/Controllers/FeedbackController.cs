using ivan_api.DTOs.Feedback;
using ivan_api.DTOs.Common;
using ivan_api.Services.FeedbackServ;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;
        public FeedbackController(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpPost("listAllFeedbacks")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetListAllFeedback(int PageNumber, int PageSize)
        {
            try
            {
                var result = await _feedbackService.getListAllFeedback(PageNumber, PageSize);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "All feedbacks retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost("listFeedbackByEvent")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetListFeedbackByEvent(int eventId, int PageNumber, int PageSize)
        {
            try
            {
                var result = await _feedbackService.getListFeedbackByEvent(eventId, PageNumber, PageSize);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "Event feedbacks retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost("listFeedbackByUser")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetListFeedbackByUser(int userId, int PageNumber, int PageSize)
        {
            try
            {
                var result = await _feedbackService.getListFeedbackByUser(userId, PageNumber, PageSize);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "User feedbacks retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPost("updateFeedback")]
        public async Task<ActionResult<ApiResponseDTO<object>>> UpdateFeedback(FeedbackUpdateDTO dto)
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

            try
            {
                var result = await _feedbackService.updateFeedback(dto);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "Feedback updated successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}
