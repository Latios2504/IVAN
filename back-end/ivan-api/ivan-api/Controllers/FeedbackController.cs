using ivan_api.DTOs.Feedback;
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
        public async Task<IActionResult> GetListAllFeedback(int PageNumber, int PageSize)
        {
            try
            {
                var result = await _feedbackService.getListAllFeedback(PageNumber, PageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("listFeedbackByEvent")]
        public async Task<IActionResult> GetListFeedbackByEvent(int eventId, int PageNumber, int PageSize)
        {
            try
            {
                var result = await _feedbackService.getListFeedbackByEvent(eventId, PageNumber, PageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("listFeedbackByUser")]
        public async Task<IActionResult> GetListFeedbackByUser(int userId, int PageNumber, int PageSize)
        {
            try
            {
                var result = await _feedbackService.getListFeedbackByUser(userId, PageNumber, PageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("updateFeedback")]
        public async Task<IActionResult> UpdateFeedback(FeedbackUpdateDTO dto)
        {
            try
            {
                var result = await _feedbackService.updateFeedback(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }
    }
}
