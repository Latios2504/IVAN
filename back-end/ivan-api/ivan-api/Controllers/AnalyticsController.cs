using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.Services.Analytics;
using ivan_api.DTOs.Analytics;
using ivan_api.Constants;
using ivan_api.Services.AuthenticationSer;
using ivan_api.DTOs.Common;

namespace ivan_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;
        private readonly IAuthenticationService _authenticationService;
        private readonly ILogger<AnalyticsController> _logger;

        public AnalyticsController(IAnalyticsService analyticsService, IAuthenticationService authenticationService,
            ILogger<AnalyticsController> logger)
        {
            _analyticsService = analyticsService;
            _authenticationService = authenticationService;
            _logger = logger;
        }

        /// Get admin dashboard analytics - System overview, user statistics, and growth metrics
        [HttpGet("admin/dashboard")]
        [Authorize(Roles = AuthenticationConstants.Roles.Admin)]
        public async Task<ActionResult<ApiResponseDTO<AdminDashboardDto>>> GetAdminDashboard(
            [FromQuery] TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var dashboard = await _analyticsService.GetAdminDashboardAsync(period);
                return Ok(new ApiResponseDTO<AdminDashboardDto>
                {
                    Success = true,
                    Message = "Admin dashboard analytics retrieved successfully",
                    Data = dashboard
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin dashboard analytics");
                return StatusCode(500, new ApiResponseDTO<AdminDashboardDto>
                {
                    Success = false,
                    Message = "Internal server error while retrieving admin dashboard data",
                    Data = null,
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// Get organization dashboard analytics - Event management, volunteer engagement, and performance metrics
        [HttpGet("organization/dashboard")]
        [Authorize(Roles = AuthenticationConstants.Roles.Organization)]
        public async Task<ActionResult<ApiResponseDTO<OrganizationDashboardDto>>> GetOrganizationDashboard(
            [FromQuery] TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                // Get user ID from claims and then get organization-specific info
                var userId = _authenticationService.GetUserIdFromClaims(User);
                var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);

                if (!userInfo.OrganizationId.HasValue)
                {
                    return BadRequest(new ApiResponseDTO<OrganizationDashboardDto>
                    {
                        Success = false,
                        Message = "Organization profile not found for user",
                        Data = null
                    });
                }

                var dashboard =
                    await _analyticsService.GetOrganizationDashboardAsync(userInfo.OrganizationId.Value, period);
                return Ok(new ApiResponseDTO<OrganizationDashboardDto>
                {
                    Success = true,
                    Message = "Organization dashboard analytics retrieved successfully",
                    Data = dashboard
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting organization dashboard analytics");
                return StatusCode(500, new ApiResponseDTO<OrganizationDashboardDto>
                {
                    Success = false,
                    Message = "Internal server error while retrieving organization dashboard data",
                    Data = null,
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// Get partner dashboard analytics - Collaboration statistics, funding metrics, and recent activities
        [HttpGet("partner/dashboard")]
        [Authorize(Roles = AuthenticationConstants.Roles.Partner)]
        public async Task<ActionResult<ApiResponseDTO<PartnerDashboardDto>>> GetPartnerDashboard(
            [FromQuery] TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                // Get user ID from claims and then get partner-specific info
                var userId = _authenticationService.GetUserIdFromClaims(User);
                var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);

                if (!userInfo.PartnerId.HasValue)
                {
                    return BadRequest(new ApiResponseDTO<PartnerDashboardDto>
                    {
                        Success = false,
                        Message = "Partner profile not found for user",
                        Data = null
                    });
                }

                var dashboard = await _analyticsService.GetPartnerDashboardAsync(userInfo.PartnerId.Value, period);
                return Ok(new ApiResponseDTO<PartnerDashboardDto>
                {
                    Success = true,
                    Message = "Partner dashboard analytics retrieved successfully",
                    Data = dashboard
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting partner dashboard analytics");
                return StatusCode(500, new ApiResponseDTO<PartnerDashboardDto>
                {
                    Success = false,
                    Message = "Internal server error while retrieving partner dashboard data",
                    Data = null,
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// Get coordinator dashboard analytics - Event management, volunteer coordination, and task tracking
        [HttpGet("coordinator/dashboard")]
        [Authorize(Roles = AuthenticationConstants.Roles.VolunteerCoordinator)]
        public async Task<ActionResult<ApiResponseDTO<CoordinatorDashboardDto>>> GetCoordinatorDashboard(
            [FromQuery] TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                // Get user ID from claims and then get coordinator-specific info
                var userId = _authenticationService.GetUserIdFromClaims(User);
                var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);

                if (!userInfo.CoordinatorId.HasValue)
                {
                    return BadRequest(new ApiResponseDTO<CoordinatorDashboardDto>
                    {
                        Success = false,
                        Message = "Coordinator profile not found for user",
                        Data = null
                    });
                }

                var dashboard =
                    await _analyticsService.GetCoordinatorDashboardAsync(userInfo.CoordinatorId.Value, period);
                return Ok(new ApiResponseDTO<CoordinatorDashboardDto>
                {
                    Success = true,
                    Message = "Coordinator dashboard analytics retrieved successfully",
                    Data = dashboard
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting coordinator dashboard analytics");
                return StatusCode(500, new ApiResponseDTO<CoordinatorDashboardDto>
                {
                    Success = false,
                    Message = "Internal server error while retrieving coordinator dashboard data",
                    Data = null,
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// Get volunteer dashboard analytics - Participation history, impact metrics, and upcoming events
        [HttpGet("volunteer/dashboard")]
        [Authorize(Roles = AuthenticationConstants.Roles.Volunteer)]
        public async Task<ActionResult<ApiResponseDTO<VolunteerDashboardDto>>> GetVolunteerDashboard(
            [FromQuery] TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                // Get user ID from claims and then get volunteer-specific info
                var userId = _authenticationService.GetUserIdFromClaims(User);
                var userInfo = await _authenticationService.GetUserInfoWithProfileAsync(userId);

                if (!userInfo.VolunteerId.HasValue)
                {
                    return BadRequest(new ApiResponseDTO<VolunteerDashboardDto>
                    {
                        Success = false,
                        Message = "Volunteer profile not found for user",
                        Data = null
                    });
                }

                var dashboard = await _analyticsService.GetVolunteerDashboardAsync(userInfo.VolunteerId.Value, period);
                return Ok(new ApiResponseDTO<VolunteerDashboardDto>
                {
                    Success = true,
                    Message = "Volunteer dashboard analytics retrieved successfully",
                    Data = dashboard
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting volunteer dashboard analytics");
                return StatusCode(500, new ApiResponseDTO<VolunteerDashboardDto>
                {
                    Success = false,
                    Message = "Internal server error while retrieving volunteer dashboard data",
                    Data = null,
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}
