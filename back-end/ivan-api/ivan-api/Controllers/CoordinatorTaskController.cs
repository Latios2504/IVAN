using ivan_api.Constants;
using ivan_api.DTOs.CoordinatorTask;
using ivan_api.DTOs.Common;
using ivan_api.Services.CoordinatorTaskServ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ivan_api.Services.AuthenticationSer;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoordinatorTaskController : ControllerBase
    {
        private readonly ICoordinatorTaskService _service;
        private readonly IAuthenticationService _auth; // NEW

        public CoordinatorTaskController(ICoordinatorTaskService service, IAuthenticationService auth)
        {
            _service = service;
            _auth = auth; // NEW
        }

        /// Get all coordinator tasks (Organization and Coordinator can view)
        /// SECURITY FIX: This method needs proper authorization logic
        /// Organizations should only see tasks from their coordinators
        /// Coordinators should only see their own tasks
        [HttpGet]
        [Authorize(Roles =
            $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetAll()
        {
            try
            {
                // TODO: Implement proper filtering based on user role
                // - Organization: filter by organizationId
                // - VolunteerCoordinator: filter by coordinatorId
                var tasks = await _service.GetAllTasksAsync();
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = tasks,
                    Message = "Coordinator tasks retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving coordinator tasks",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// Get coordinator task by ID (Organization and Coordinator can view)
        [HttpGet("{id}")]
        [Authorize(Roles =
            $"{AuthenticationConstants.Roles.Organization},{AuthenticationConstants.Roles.VolunteerCoordinator}")]
        public async Task<ActionResult<ApiResponseDTO<CoordinatorTaskDto>>> GetById(int id)
        {
            try
            {
                var task = await _service.GetTaskByIdAsync(id);
                if (task == null)
                {
                    return NotFound(new ApiResponseDTO<CoordinatorTaskDto>
                    {
                        Success = false,
                        Message = "Coordinator task not found",
                        Errors = new List<string> { $"Coordinator task with ID {id} was not found" }
                    });
                }

                return Ok(new ApiResponseDTO<CoordinatorTaskDto>
                {
                    Success = true,
                    Data = task,
                    Message = "Coordinator task retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<CoordinatorTaskDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving coordinator task",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// Create new coordinator task (Only Organization can create)
        [HttpPost]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<object>>> Create([FromBody] CreateCoordinatorTaskDto dto)
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
                var userId = GetUserId();
                var task = await _service.CreateTaskAsync(dto, userId);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = task.TaskId },
                    new ApiResponseDTO<object>
                    {
                        Success = true,
                        Data = task,
                        Message = "Coordinator task created successfully"
                    }
                );
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while creating coordinator task",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// Update coordinator task (Only Organization can update)
        [HttpPut("{id}")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<object>>> Update(int id, [FromBody] UpdateCoordinatorTaskDto dto)
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
                var task = await _service.UpdateTaskAsync(id, dto);
                if (task == null)
                {
                    return NotFound(new ApiResponseDTO<object>
                    {
                        Success = false,
                        Message = "Coordinator task not found",
                        Errors = new List<string> { $"Coordinator task with ID {id} was not found" }
                    });
                }

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = task,
                    Message = "Coordinator task updated successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "An error occurred while updating coordinator task",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        // NEW: Organization xem task thuộc tổ chức mình (có phân trang + filter)
        [HttpGet("organization")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDto<CoordinatorTaskDto>>>> ListForOrganization(
            [FromQuery] int? coordinatorId,
            [FromQuery] int? eventId,
            [FromQuery] string? status,
            [FromQuery] string? priority,
            [FromQuery] DateTime? dueFrom,
            [FromQuery] DateTime? dueTo,
            [FromQuery] string? search,
            [FromQuery] string? sortBy = "DueDate",
            [FromQuery] string? sortDirection = "desc",
            [FromQuery] int page = 1,
            [FromQuery] int size = 20)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new ApiResponseDTO<PagedResultDto<CoordinatorTaskDto>>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }

            var userInfo = await _auth.GetUserInfoWithProfileAsync(userId);
            if (userInfo?.OrganizationId == null)
            {
                return BadRequest(new ApiResponseDTO<PagedResultDto<CoordinatorTaskDto>>
                {
                    Success = false,
                    Message = "Organization not found for this user"
                });
            }

            var filter = new CoordinatorTaskFilterDto
            {
                CoordinatorId = coordinatorId,
                EventId = eventId,
                Status = status,
                Priority = priority,
                DueFrom = dueFrom,
                DueTo = dueTo,
                Search = search,
                SortBy = sortBy,
                SortDirection = sortDirection,
                PageNumber = page,
                PageSize = size
            };

            var result = await _service.GetOrgTasksPagedAsync(userInfo.OrganizationId.Value, filter);

            return Ok(new ApiResponseDTO<PagedResultDto<CoordinatorTaskDto>>
            {
                Success = true,
                Message = "Organization tasks retrieved successfully",
                Data = result
            });
        }

        // NEW: Volunteer Coordinator xem task cá nhân của mình
        [HttpGet("personal")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<ActionResult<ApiResponseDTO<PagedResultDto<CoordinatorTaskDto>>>> ListForCoordinator(
            [FromQuery] int? eventId,
            [FromQuery] string? status,
            [FromQuery] string? priority,
            [FromQuery] DateTime? dueFrom,
            [FromQuery] DateTime? dueTo,
            [FromQuery] string? search,
            [FromQuery] string? sortBy = "DueDate",
            [FromQuery] string? sortDirection = "desc",
            [FromQuery] int page = 1,
            [FromQuery] int size = 20)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null || !int.TryParse(claim.Value, out var userId))
            {
                return Unauthorized(new ApiResponseDTO<PagedResultDto<CoordinatorTaskDto>>
                {
                    Success = false,
                    Message = "User not authenticated or missing user ID claim"
                });
            }

            // Lấy CoordinatorId từ profile
            var userInfo = await _auth.GetUserInfoWithProfileAsync(userId);
            if (userInfo?.CoordinatorId == null)
            {
                return BadRequest(new ApiResponseDTO<PagedResultDto<CoordinatorTaskDto>>
                {
                    Success = false,
                    Message = "Coordinator not found for this user"
                });
            }

            var filter = new CoordinatorTaskFilterDto
            {
                EventId = eventId,
                Status = status,
                Priority = priority,
                DueFrom = dueFrom,
                DueTo = dueTo,
                Search = search,
                SortBy = sortBy,
                SortDirection = sortDirection,
                PageNumber = page,
                PageSize = size
            };

            var result = await _service.GetPersonalTasksPagedAsync(userInfo.CoordinatorId.Value, filter);

            return Ok(new ApiResponseDTO<PagedResultDto<CoordinatorTaskDto>>
            {
                Success = true,
                Message = "Coordinator tasks retrieved successfully",
                Data = result
            });
        }
    }
}
