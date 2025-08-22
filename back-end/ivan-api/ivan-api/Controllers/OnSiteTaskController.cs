using ivan_api.Constants;
using ivan_api.DTOs.OnSiteTasks;
using ivan_api.DTOs.Common;
using ivan_api.Services.OnSiteTasks;
using ivan_api.Services.TaskAssignments;
using ivan_api.Services.EventRegistrationSer;
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
        private readonly ITaskAssignmentService _taskAssignmentService;
        private readonly IEventRegistrationService _eventRegistrationService;

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

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<ActionResult<ApiResponseDTO<object>>> Delete(int id)
        {
            try
            {
                var result = await _service.DeleteOnSiteTask(id);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to delete on-site task",
                        Errors = new List<string> { "Unable to delete on-site task" }
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "On-Site Task deleted successfully",
                    Data = new { deletedId = id }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to delete on-site task",
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

        [HttpPut("{id}/assign")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<ActionResult<ApiResponseDTO<object>>> AssignAll(int id)
        {
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
                var result = await _service.AssignOnSiteTask( id);
                var postUpdate = await _service.GetOnSiteTaskById(id);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to assign on-site task",
                        Errors = new List<string> { "Unable to assign on-site task" }
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = postUpdate,
                    Message = "On-site task assigned successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while assigning on-site task",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPut("{id}/start")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<ActionResult<ApiResponseDTO<object>>> StartAll(int id)
        {
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
                var result = await _service.StartAllOnSiteTask(id);
                var postUpdate = await _service.GetOnSiteTaskById(id);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to start on-site task",
                        Errors = new List<string> { "Unable to start on-site task" }
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = postUpdate,
                    Message = "On-site task started successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while starting on-site task",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPut("{id}/complete")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<ActionResult<ApiResponseDTO<object>>> CompleteAll(int id)
        {
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
                var result = await _service.CompleteAllOnSiteTask(id);
                var postUpdate = await _service.GetOnSiteTaskById(id);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to complete on-site task",
                        Errors = new List<string> { "Unable to complete on-site task" }
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = postUpdate,
                    Message = "On-site task completeed successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while completing on-site task",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpDelete("{id}/unassign/{volunteerId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<ActionResult<ApiResponseDTO<object>>> Unassign(int id, int volunteerId)
        {
            try
            {
                var result = await _service.UnassigTask(id, volunteerId);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to unassign on-site task",
                        Errors = new List<string> { "Unable to unassign on-site task" }
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "On-Site Task unassigned successfully",
                    Data = new { deletedId = id }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to unassign on-site task",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPut("{id}/complete/{volunteerId}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> Complete(int id, int volunteerId)
        {
            try
            {
                var result = await _service.CompleteTask(id, volunteerId);

                if (!result)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Failed to complete on-site task",
                        Errors = new List<string> { "Unable to complete on-site task" }
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "On-Site Task completed successfully",
                    Data = new { deletedId = id }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to complete on-site task",
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
