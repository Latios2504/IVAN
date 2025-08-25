using ivan_api.Constants;
using ivan_api.DTOs.OnSiteTasks;
using ivan_api.DTOs.Common;
using ivan_api.Services.OnSiteTasks;
using ivan_api.Services.TaskAssignments;
using ivan_api.Services.EventRegistrationSer;
using ivan_api.Services.AuthenticationSer;
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
        private readonly IAuthenticationService _authenticationService;

        public OnSiteTaskController(IOnSiteTaskService service, 
            ITaskAssignmentService taskAssignmentService,
            IEventRegistrationService eventRegistrationService,
            IAuthenticationService authenticationService)
        {
            _service = service;
            _taskAssignmentService = taskAssignmentService;
            _eventRegistrationService = eventRegistrationService;
            _authenticationService = authenticationService;
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

        [HttpPut("{id}/assignAll")]
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
                // Kiểm tra task tồn tại
                var task = await _service.GetOnSiteTaskById(id);
                if (task == null)
                {
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Task not found",
                        Errors = new List<string> { $"Task with ID {id} was not found" }
                    });
                }

                var result = await _service.AssignAllOnSiteTask(id);
                var data = await _service.GetTaskAssignmentsById(id);

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
                    Data = data,
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

        [HttpPut("{id}/startAll")]
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
                var data = await _service.GetTaskAssignmentsById(id);

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
                    Data = data,
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

        [HttpPut("{id}/completeAll")]
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
                var data = await _service.GetTaskAssignmentsById(id);

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
                    Data = data,
                    Message = "On-site task completed successfully"
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
                // Kiểm tra task assignment tồn tại
                var assignment = await _service.SearchTaskAssignment(id, volunteerId);
                if (assignment == null)
                {
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Task assignment not found",
                        Errors = new List<string> { $"Assignment for task {id} and volunteer {volunteerId} was not found" }
                    });
                }

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
                    Data = new { taskId = id, volunteerId = volunteerId }
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
        [Authorize(Roles = $"{AuthenticationConstants.Roles.VolunteerCoordinator},{AuthenticationConstants.Roles.Volunteer}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> Complete(int id, int volunteerId)
        {
            try
            {
                var currentUserId = GetUserId();
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                // Nếu là volunteer, chỉ được complete task của chính mình
                if (userRole == AuthenticationConstants.Roles.Volunteer)
                {
                    // Lấy VolunteerId từ UserId thông qua AuthenticationService
                    var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(currentUserId);
                    if (userInfo?.VolunteerId == null || userInfo.VolunteerId.Value != volunteerId)
                    {
                        return Forbid("You can only complete your own tasks");
                    }
                }

                var result = await _service.CompleteTask(id, volunteerId);
                var data = await _service.SearchTaskAssignment(id, volunteerId);

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
                    Data = data
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

        [HttpPut("{id}/assign/{volunteerId}")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<ActionResult<ApiResponseDTO<object>>> Assign(int id, int volunteerId)
        {
            try
            {
                // Kiểm tra volunteer đã đăng ký và được approve cho event
                var task = await _service.GetOnSiteTaskById(id);
                if (task == null)
                {
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Task not found",
                        Errors = new List<string> { $"Task with ID {id} was not found" }
                    });
                }

                // Kiểm tra volunteer có registration approved cho event này không
                var registrations = await _eventRegistrationService.GetAllVolunteerRegistration();
                var registration = registrations.FirstOrDefault(r => r.EventId == task.EventId && r.VolunteerId == volunteerId);
                if (registration == null || registration.StatusId != 2) // Assuming 2 is "Approved" status
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Volunteer is not approved for this event",
                        Errors = new List<string> { "Cannot assign task to volunteer who is not approved for the event" }
                    });
                }

                var result = await _service.AssignTask(id, volunteerId);
                var data = await _service.SearchTaskAssignment(id, volunteerId);

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
                    Message = "On-Site Task assigned successfully",
                    Data = data
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to assign on-site task",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpPut("{id}/start/{volunteerId}")]
        [Authorize(Roles = $"{AuthenticationConstants.Roles.VolunteerCoordinator},{AuthenticationConstants.Roles.Volunteer}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> Start(int id, int volunteerId)
        {
            try
            {
                var currentUserId = GetUserId();
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                // Nếu là volunteer, chỉ được start task của chính mình
                if (userRole == AuthenticationConstants.Roles.Volunteer)
                {
                    // Lấy VolunteerId từ UserId thông qua AuthenticationService
                    var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(currentUserId);
                    if (userInfo?.VolunteerId == null || userInfo.VolunteerId.Value != volunteerId)
                    {
                        return Forbid("You can only start your own tasks");
                    }
                }

                var result = await _service.StartTask(id, volunteerId);
                var data = await _service.SearchTaskAssignment(id, volunteerId);

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
                    Message = "On-Site Task started successfully",
                    Data = data
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Failed to start on-site task",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// Get tasks assigned to current volunteer
        [HttpGet("my-tasks")]
        [Authorize(Roles = AuthenticationConstants.Roles.Volunteer)]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetMyTasks([FromQuery] int? eventId = null)
        {
            try
            {
                var currentUserId = GetUserId();
                
                // Lấy VolunteerId từ UserId thông qua AuthenticationService
                var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(currentUserId);
                if (userInfo?.VolunteerId == null)
                {
                    return BadRequest(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Volunteer profile not found",
                        Errors = new List<string> { "User does not have a volunteer profile" }
                    });
                }

                var volunteerId = userInfo.VolunteerId.Value;
                
                // Lấy danh sách task assignments cho volunteer này với đầy đủ thông tin task
                var assignments = await _taskAssignmentService.GetMyTaskAssignmentsByVolunteerId(volunteerId, eventId);
                
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = assignments,
                    Message = "My tasks retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving my tasks",
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
