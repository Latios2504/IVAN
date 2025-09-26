using ivan_api.Constants;
using ivan_api.DTOs.Common;
using ivan_api.Models;
using ivan_api.Services.AuthenticationSer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
    public class CoordinatorQueriesController : ControllerBase
    {
        private readonly VolunteerManagementSystemContext _db;
        private readonly IAuthenticationService _auth;

        public CoordinatorQueriesController(
            VolunteerManagementSystemContext db,
            IAuthenticationService auth)
        {
            _db = db;
            _auth = auth;
        }

        // ====== DTOs gọn cho trả về ======
        public class VolunteerBriefDto
        {
            public int VolunteerId { get; set; }
            public string FullName { get; set; } = string.Empty;
            public string? Email { get; set; }
            public int TotalEvents { get; set; }
            public DateTime? LastEventEndDate { get; set; }
        }

        public class EventBriefDto
        {
            public int EventId { get; set; }
            public string EventName { get; set; } = string.Empty;
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }
            public string StatusName { get; set; } = string.Empty;
            public int OrganizationId { get; set; }
        }

        /// GET volunteers tham gia các sự kiện của tổ chức mà Coordinator (JWT) trực thuộc
        /// Hỗ trợ phân trang: ?pageNumber=1&pageSize=20
        [HttpGet("volunteers")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetVolunteersOfMyOrganizations(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var userId = _auth.GetUserIdFromClaims(User);

                // Tất cả OrganizationId của coordinator hiện tại
                var orgIds = await _db.VolunteerCoordinators
                    .Where(c => c.UserId == userId && (c.IsActive == true))
                    .Select(c => c.OrganizationId)
                    .Distinct()
                    .ToListAsync();

                if (orgIds.Count == 0)
                {
                    return Ok(ApiResponseDTO<object>.Ok(new PagedResultDto<VolunteerBriefDto>
                    {
                        Items = new List<VolunteerBriefDto>(),
                        TotalCount = 0,
                        PageNumber = pageNumber,
                        PageSize = pageSize
                    }, "No organizations found for current coordinator"));
                }

                // Đăng ký thuộc events của các tổ chức đó
                var regs = _db.EventRegistrations
                    .Include(r => r.Event)
                    .Where(r => orgIds.Contains(r.Event.OrganizationId))
                    .Where(r => r.Status.StatusId == 2 || r.Status.StatusId == 5 || r.Status.StatusId == 7);

                // Join VolunteerProfiles + UserProfiles (lấy FullName) + Users (Email)
                var query = regs
                    .Join(_db.VolunteerProfiles, r => r.VolunteerId, v => v.VolunteerId, (r, v) => new { r, v })
                    .Join(_db.UserProfiles, rv => rv.v.UserId, up => up.UserId, (rv, up) => new { rv.r, rv.v, up })
                    .Join(_db.Users, rvu => rvu.v.UserId, u => u.UserId, (rvu, u) => new { rvu.r, rvu.v, rvu.up, u })
                    .GroupBy(x => new { x.v.VolunteerId, x.up.FullName, x.u.Email })
                    .Select(g => new VolunteerBriefDto
                    {
                        VolunteerId = g.Key.VolunteerId,
                        FullName = g.Key.FullName,
                        Email = g.Key.Email,
                        TotalEvents = g.Select(x => x.r.EventId).Distinct().Count(),
                        LastEventEndDate = g.Max(x => x.r.Event.EndDate)
                    });

                var total = await query.CountAsync();
                var items = await query
                    .OrderByDescending(v => v.LastEventEndDate)
                    .ThenBy(v => v.FullName)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var result = new PagedResultDto<VolunteerBriefDto>
                {
                    Items = items,
                    TotalCount = total,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };

                return Ok(ApiResponseDTO<object>.Ok(result, "Volunteers retrieved successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseDTO<object>.Fail(
                    "Failed to retrieve volunteers",
                    new List<string> { ex.Message }));
            }
        }

        /// GET các Event Completed của tổ chức mà Coordinator (JWT) trực thuộc
        /// Hỗ trợ phân trang: ?pageNumber=1&pageSize=20
        [HttpGet("events/completed")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetCompletedEventsOfMyOrganizations(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var userId = _auth.GetUserIdFromClaims(User);

                var orgIds = await _db.VolunteerCoordinators
                    .Where(c => c.UserId == userId && (c.IsActive == true))
                    .Select(c => c.OrganizationId)
                    .Distinct()
                    .ToListAsync();
                if (orgIds.Count == 0)
                {
                    return Ok(ApiResponseDTO<object>.Ok(new PagedResultDto<EventBriefDto>
                    {
                        Items = new List<EventBriefDto>(),
                        TotalCount = 0,
                        PageNumber = pageNumber,
                        PageSize = pageSize
                    }, "No organizations found for current coordinator"));
                }

                var completedStatusId = await _db.EventStatuses
                    .Where(s => s.StatusName == "Completed")
                    .Select(s => s.StatusId)
                    .FirstOrDefaultAsync();

                if (completedStatusId == 0)
                {
                    return Ok(ApiResponseDTO<object>.Ok(new PagedResultDto<EventBriefDto>
                    {
                        Items = new List<EventBriefDto>(),
                        TotalCount = 0,
                        PageNumber = pageNumber,
                        PageSize = pageSize
                    }, "No 'Completed' status found"));
                }

                var eventsQ = _db.Events
                    .Include(e => e.Status)
                    .Where(e => orgIds.Contains(e.OrganizationId) && e.StatusId == completedStatusId);

                var total = await eventsQ.CountAsync();

                var items = await eventsQ
                    .OrderByDescending(e => e.EndDate)
                    .ThenBy(e => e.EventId)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(e => new EventBriefDto
                    {
                        EventId = e.EventId,
                        EventName = e.EventName,
                        StartDate = e.StartDate,
                        EndDate = e.EndDate,
                        StatusName = e.Status.StatusName,
                        OrganizationId = e.OrganizationId
                    })
                    .ToListAsync();

                var result = new PagedResultDto<EventBriefDto>
                {
                    Items = items,
                    TotalCount = total,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };

                return Ok(ApiResponseDTO<object>.Ok(result, "Completed events retrieved successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseDTO<object>.Fail(
                    "Failed to retrieve completed events",
                    new List<string> { ex.Message }));
            }
        }

        /// GET các Event Completed của tổ chức mà Coordinator (JWT) trực thuộc
        /// Hỗ trợ phân trang: ?pageNumber=1&pageSize=20
        [HttpGet("events/completed/{volunnteerId}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetCompletedEventsOfMyOrganizations(
            int volunnteerId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var userId = _auth.GetUserIdFromClaims(User);

                var orgIds = await _db.VolunteerCoordinators
                    .Where(c => c.UserId == userId && (c.IsActive == true))
                    .Select(c => c.OrganizationId)
                    .Distinct()
                    .ToListAsync();
                if (orgIds.Count == 0)
                {
                    return Ok(ApiResponseDTO<object>.Ok(new PagedResultDto<EventBriefDto>
                    {
                        Items = new List<EventBriefDto>(),
                        TotalCount = 0,
                        PageNumber = pageNumber,
                        PageSize = pageSize
                    }, "No organizations found for current coordinator"));
                }

                var completedStatusId = await _db.EventStatuses
                    .Where(s => s.StatusName == "Completed")
                    .Select(s => s.StatusId)
                    .FirstOrDefaultAsync();

                if (completedStatusId == 0)
                {
                    return Ok(ApiResponseDTO<object>.Ok(new PagedResultDto<EventBriefDto>
                    {
                        Items = new List<EventBriefDto>(),
                        TotalCount = 0,
                        PageNumber = pageNumber,
                        PageSize = pageSize
                    }, "No 'Completed' status found"));
                }

                var eventReg = _db.EventRegistrations
                    .Where(x => x.VolunteerId == volunnteerId);

                var events = _db.Events
                    .Include(e => e.Status)
                    .Where(e => orgIds.Contains(e.OrganizationId) && e.StatusId == completedStatusId);

                var eventsQ = events
                    .Where(e => eventReg.Any(r => r.EventId == e.EventId));

                var total = await eventsQ.CountAsync();

                var items = await eventsQ
                    .OrderByDescending(e => e.EndDate)
                    .ThenBy(e => e.EventId)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(e => new EventBriefDto
                    {
                        EventId = e.EventId,
                        EventName = e.EventName,
                        StartDate = e.StartDate,
                        EndDate = e.EndDate,
                        StatusName = e.Status.StatusName,
                        OrganizationId = e.OrganizationId
                    })
                    .ToListAsync();

                var result = new PagedResultDto<EventBriefDto>
                {
                    Items = items,
                    TotalCount = total,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };

                return Ok(ApiResponseDTO<object>.Ok(result, "Completed events retrieved successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseDTO<object>.Fail(
                    "Failed to retrieve completed events",
                    new List<string> { ex.Message }));
            }
        }

        [HttpGet("events/ongoing")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetOngoingEventsOfMyOrganizations(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var userId = _auth.GetUserIdFromClaims(User);

                var orgIds = await _db.VolunteerCoordinators
                    .Where(c => c.UserId == userId && (c.IsActive == true))
                    .Select(c => c.OrganizationId)
                    .Distinct()
                    .ToListAsync();
                if (orgIds.Count == 0)
                {
                    return Ok(ApiResponseDTO<object>.Ok(new PagedResultDto<EventBriefDto>
                    {
                        Items = new List<EventBriefDto>(),
                        TotalCount = 0,
                        PageNumber = pageNumber,
                        PageSize = pageSize
                    }, "No organizations found for current coordinator"));
                }

                var completedStatusId = await _db.EventStatuses
                    .Where(s => s.StatusName == "Ongoing")
                    .Select(s => s.StatusId)
                    .FirstOrDefaultAsync();

                if (completedStatusId == 0)
                {
                    return Ok(ApiResponseDTO<object>.Ok(new PagedResultDto<EventBriefDto>
                    {
                        Items = new List<EventBriefDto>(),
                        TotalCount = 0,
                        PageNumber = pageNumber,
                        PageSize = pageSize
                    }, "No 'Ongoing' status found"));
                }

                var eventsQ = _db.Events
                    .Include(e => e.Status)
                    .Where(e => orgIds.Contains(e.OrganizationId) && e.StatusId == completedStatusId);

                var total = await eventsQ.CountAsync();

                var items = await eventsQ
                    .OrderByDescending(e => e.EndDate)
                    .ThenBy(e => e.EventId)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(e => new EventBriefDto
                    {
                        EventId = e.EventId,
                        EventName = e.EventName,
                        StartDate = e.StartDate,
                        EndDate = e.EndDate,
                        StatusName = e.Status.StatusName,
                        OrganizationId = e.OrganizationId
                    })
                    .ToListAsync();

                var result = new PagedResultDto<EventBriefDto>
                {
                    Items = items,
                    TotalCount = total,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };

                return Ok(ApiResponseDTO<object>.Ok(result, "Completed events retrieved successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseDTO<object>.Fail(
                    "Failed to retrieve completed events",
                    new List<string> { ex.Message }));
            }
        }

        [HttpGet("events/all")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetAllEventsOfMyOrganizations(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var userId = _auth.GetUserIdFromClaims(User);

                var orgIds = await _db.VolunteerCoordinators
                    .Where(c => c.UserId == userId && (c.IsActive == true))
                    .Select(c => c.OrganizationId)
                    .Distinct()
                    .ToListAsync();
                if (orgIds.Count == 0)
                {
                    return Ok(ApiResponseDTO<object>.Ok(new PagedResultDto<EventBriefDto>
                    {
                        Items = new List<EventBriefDto>(),
                        TotalCount = 0,
                        PageNumber = pageNumber,
                        PageSize = pageSize
                    }, "No organizations found for current coordinator"));
                }

                var eventsQ = _db.Events
                    .Include(e => e.Status)
                    .Where(e => orgIds.Contains(e.OrganizationId));

                var total = await eventsQ.CountAsync();

                var items = await eventsQ
                    .OrderByDescending(e => e.EndDate)
                    .ThenBy(e => e.EventId)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(e => new EventBriefDto
                    {
                        EventId = e.EventId,
                        EventName = e.EventName,
                        StartDate = e.StartDate,
                        EndDate = e.EndDate,
                        StatusName = e.Status.StatusName,
                        OrganizationId = e.OrganizationId
                    })
                    .ToListAsync();

                var result = new PagedResultDto<EventBriefDto>
                {
                    Items = items,
                    TotalCount = total,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };

                return Ok(ApiResponseDTO<object>.Ok(result, "Completed events retrieved successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseDTO<object>.Fail(
                    "Failed to retrieve completed events",
                    new List<string> { ex.Message }));
            }
        }

        [HttpGet("events/ongoing/{volunteer}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetOngoingEventsOfMyOrganizations(
            int volunteer,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var userId = _auth.GetUserIdFromClaims(User);

                var orgIds = await _db.VolunteerCoordinators
                    .Where(c => c.UserId == userId && (c.IsActive == true))
                    .Select(c => c.OrganizationId)
                    .Distinct()
                    .ToListAsync();
                if (orgIds.Count == 0)
                {
                    return Ok(ApiResponseDTO<object>.Ok(new PagedResultDto<EventBriefDto>
                    {
                        Items = new List<EventBriefDto>(),
                        TotalCount = 0,
                        PageNumber = pageNumber,
                        PageSize = pageSize
                    }, "No organizations found for current coordinator"));
                }

                var completedStatusId = await _db.EventStatuses
                    .Where(s => s.StatusName == "Ongoing")
                    .Select(s => s.StatusId)
                    .FirstOrDefaultAsync();

                if (completedStatusId == 0)
                {
                    return Ok(ApiResponseDTO<object>.Ok(new PagedResultDto<EventBriefDto>
                    {
                        Items = new List<EventBriefDto>(),
                        TotalCount = 0,
                        PageNumber = pageNumber,
                        PageSize = pageSize
                    }, "No 'Ongoing' status found"));
                }

                var eventReg = _db.EventRegistrations
                    .Where(x => x.VolunteerId == volunteer);

                var events = _db.Events
                    .Include(e => e.Status)
                    .Where(e => orgIds.Contains(e.OrganizationId) && e.StatusId == completedStatusId);

                var eventsQ = events
                    .Where(e => eventReg.Any(r => r.EventId == e.EventId));

                var total = await eventsQ.CountAsync();

                var items = await eventsQ
                    .OrderByDescending(e => e.EndDate)
                    .ThenBy(e => e.EventId)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(e => new EventBriefDto
                    {
                        EventId = e.EventId,
                        EventName = e.EventName,
                        StartDate = e.StartDate,
                        EndDate = e.EndDate,
                        StatusName = e.Status.StatusName,
                        OrganizationId = e.OrganizationId
                    })
                    .ToListAsync();

                var result = new PagedResultDto<EventBriefDto>
                {
                    Items = items,
                    TotalCount = total,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };

                return Ok(ApiResponseDTO<object>.Ok(result, "Completed events retrieved successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseDTO<object>.Fail(
                    "Failed to retrieve completed events",
                    new List<string> { ex.Message }));
            }
        }

        [HttpGet("events/all/{volunteer}")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetAllEventsOfMyOrganizations(
            int volunteer,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var userId = _auth.GetUserIdFromClaims(User);

                var orgIds = await _db.VolunteerCoordinators
                    .Where(c => c.UserId == userId && (c.IsActive == true))
                    .Select(c => c.OrganizationId)
                    .Distinct()
                    .ToListAsync();
                if (orgIds.Count == 0)
                {
                    return Ok(ApiResponseDTO<object>.Ok(new PagedResultDto<EventBriefDto>
                    {
                        Items = new List<EventBriefDto>(),
                        TotalCount = 0,
                        PageNumber = pageNumber,
                        PageSize = pageSize
                    }, "No organizations found for current coordinator"));
                }

                var eventReg = _db.EventRegistrations
                    .Where(x => x.VolunteerId == volunteer);

                var events = _db.Events
                    .Include(e => e.Status)
                    .Where(e => orgIds.Contains(e.OrganizationId));

                var eventsQ = events
                    .Where(e => eventReg.Any(r => r.EventId == e.EventId));

                var total = await eventsQ.CountAsync();

                var items = await eventsQ
                    .OrderByDescending(e => e.EndDate)
                    .ThenBy(e => e.EventId)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(e => new EventBriefDto
                    {
                        EventId = e.EventId,
                        EventName = e.EventName,
                        StartDate = e.StartDate,
                        EndDate = e.EndDate,
                        StatusName = e.Status.StatusName,
                        OrganizationId = e.OrganizationId
                    })
                    .ToListAsync();

                var result = new PagedResultDto<EventBriefDto>
                {
                    Items = items,
                    TotalCount = total,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };

                return Ok(ApiResponseDTO<object>.Ok(result, "Completed events retrieved successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseDTO<object>.Fail(
                    "Failed to retrieve completed events",
                    new List<string> { ex.Message }));
            }
        }
    }
}
