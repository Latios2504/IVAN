using ivan_api.Constants;
using ivan_api.DTOs.OnSiteTasks;
using ivan_api.DTOs.Common;
using ivan_api.Services.OnSiteTasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OnSiteTaskController : ControllerBase
    {
        private readonly IOnSiteTaskService _service;

        public OnSiteTaskController(IOnSiteTaskService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles =
            $"{AuthenticationConstants.Roles.VolunteerCoordinator},{AuthenticationConstants.Roles.Volunteer}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetList([FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _service.GetList(pageNumber, pageSize);
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "On-site tasks retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving on-site tasks",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// Get on-site task details by ID (Coordinator and Volunteer can view)
        [HttpGet("get/{id}")]
        [Authorize(Roles =
            $"{AuthenticationConstants.Roles.VolunteerCoordinator},{AuthenticationConstants.Roles.Volunteer}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> Details(int id)
        {
            try
            {
                var result = await _service.GetOnSiteTaskById(id);
                if (result == null)
                {
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "On-site task not found",
                        Errors = new List<string> { $"On-site task with ID {id} was not found" }
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = result,
                    Message = "On-site task retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving on-site task",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// Add new on-site task (Only Coordinator can add)
        [HttpPost("add")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<ActionResult<ApiResponseDTO<object>>> Add([FromBody] OnSiteTaskInputModel input)
        {
            if (input == null)
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
                var result = await _service.AddOnSiteTask(input);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to add on-site task",
                        Errors = new List<string> { "Unable to create on-site task" }
                    });
                }

                var listDto = await _service.GetList(1, 100);
                var list = listDto.Items.ToList();
                var postAdd = await _service.GetOnSiteTaskById(list.Last().TaskId);

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = postAdd,
                    Message = "On-site task created successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while creating on-site task",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// Update on-site task (Only Coordinator can update)
        [HttpPut("update/{id}")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<ActionResult<ApiResponseDTO<object>>> Update([FromBody] OnSiteTaskUpdateModel input, int id)
        {
            if (input == null)
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
                var result = await _service.UpdateOnSiteTask(input, id);
                var postUpdate = await _service.GetOnSiteTaskById(id);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to update on-site task",
                        Errors = new List<string> { "Unable to update on-site task" }
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = postUpdate,
                    Message = "On-site task updated successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while updating on-site task",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }
    }
}
