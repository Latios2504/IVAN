using ivan_api.DTOs.Common;
using ivan_api.DTOs.Feedback;
using ivan_api.Models;
using ivan_api.Repository.FeedbackRepo;
using ivan_api.Services.FeedbackServ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;
        private readonly ILogger<FeedbackController> _logger;
        private readonly IFeedbackRepository _feedbackRepository;
        public FeedbackController(IFeedbackService feedbackService, ILogger<FeedbackController> logger, IFeedbackRepository feedbackRepository)
        {
            _feedbackService = feedbackService;
            this._logger = logger;
            _feedbackRepository = feedbackRepository;
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

        // Add feedback for an event
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ApiResponseDTO<Feedback>>> AddFeedback([FromBody] FeedbackCreateDTO dto)
        {
            try
            {
                // Lấy UserId từ token
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

                if (userIdClaim == null)
                {
                    return Unauthorized(new ApiResponseDTO<Feedback>
                    {
                        Success = false,
                        Message = "Invalid token",
                        Errors = new List<string> { "User ID not found in token" }
                    });
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    return Unauthorized(new ApiResponseDTO<Feedback>
                    {
                        Success = false,
                        Message = "Invalid token",
                        Errors = new List<string> { "Invalid user ID format" }
                    });
                }

                // Gán UserId từ token
                dto.UserId = userId;

                // Gọi repository để lưu feedback
                var feedback = await _feedbackRepository.addFeedback(dto);

                return Ok(new ApiResponseDTO<Feedback>
                {
                    Success = true,
                    Message = "Feedback created successfully",
                    Data = feedback
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponseDTO<Feedback>
                {
                    Success = false,
                    Message = "Related resource not found",
                    Errors = new List<string> { ex.Message }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating feedback");
                return StatusCode(500, new ApiResponseDTO<Feedback>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to create feedback" }
                });
            }
        }
    }
}
