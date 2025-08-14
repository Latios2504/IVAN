using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.Services.Analytics;
using ivan_api.DTOs.Analytics;
using ivan_api.DTOs.Common;

namespace ivan_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(IAnalyticsService analyticsService, ILogger<DashboardController> logger)
        {
            _analyticsService = analyticsService;
            _logger = logger;
        }

        [HttpGet("system-stats")]
        [AllowAnonymous]
        public ActionResult<ApiResponseDTO<object>> GetSystemStats()
        {
            try
            {
                var stats = new
                {
                    totalVolunteers = 150,
                    totalOrganizations = 25,
                    totalEvents = 45,
                    totalHours = 2350,
                    totalPartnerships = 12
                };

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = stats,
                    Message = "System statistics retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving system statistics");
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve system statistics" }
                });
            }
        }

        [HttpGet("organization-stats")]
        [Authorize(Roles = "Organization")]
        public ActionResult<ApiResponseDTO<object>> GetOrganizationStats()
        {
            try
            {
                var stats = new
                {
                    totalVolunteers = 45,
                    activeEvents = 5,
                    totalCoordinators = 3,
                    certificatesIssued = 28,
                    newVolunteersThisMonth = 8,
                    hoursThisMonth = 120,
                    averageRating = 4.5
                };

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = stats,
                    Message = "Organization statistics retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving organization statistics");
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve organization statistics" }
                });
            }
        }

        [HttpGet("volunteer-stats")]
        [Authorize(Roles = "Volunteer")]
        public ActionResult<ApiResponseDTO<object>> GetVolunteerStats()
        {
            try
            {
                var stats = new
                {
                    eventsJoined = 8,
                    eventsCompleted = 6,
                    hoursVolunteered = 45,
                    certificatesEarned = 3,
                    currentRating = 4.2,
                    upcomingEvents = 2
                };

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = stats,
                    Message = "Volunteer statistics retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving volunteer statistics");
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve volunteer statistics" }
                });
            }
        }

        [HttpGet("partner-stats")]
        [Authorize(Roles = "Partner")]
        public ActionResult<ApiResponseDTO<object>> GetPartnerStats()
        {
            try
            {
                var stats = new
                {
                    totalCollaborations = 12,
                    activeProjects = 4,
                    totalInvestment = 250000,
                    partneredOrganizations = 8
                };

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = stats,
                    Message = "Partner statistics retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving partner statistics");
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve partner statistics" }
                });
            }
        }

        [HttpGet("coordinator/{coordinatorId}/stats")]
        [Authorize(Roles = "Organization,Admin")]
        public ActionResult<ApiResponseDTO<object>> GetCoordinatorStats(int coordinatorId)
        {
            try
            {
                var stats = new
                {
                    coordinatorId = coordinatorId,
                    managedVolunteers = 15,
                    managedEvents = 8,
                    completedTasks = 45,
                    averageEventRating = 4.3,
                    hoursManaged = 320
                };

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = stats,
                    Message = "Coordinator statistics retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving coordinator statistics for coordinator {CoordinatorId}", coordinatorId);
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve coordinator statistics" }
                });
            }
        }

        [HttpGet("{role}/charts")]
        [Authorize]
        public ActionResult<ApiResponseDTO<object[]>> GetDashboardCharts(string role, [FromQuery] int? userId = null)
        {
            try
            {
                var charts = new[]
                {
                    new
                    {
                        id = "events-chart",
                        title = "Events Over Time",
                        type = "line",
                        data = new[] { 10, 15, 12, 20, 18, 25 },
                        labels = new[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun" }
                    },
                    new
                    {
                        id = "volunteers-chart", 
                        title = "Volunteer Distribution",
                        type = "pie",
                        data = new[] { 30, 25, 20, 15, 10 },
                        labels = new[] { "Active", "Pending", "Inactive", "New", "Alumni" }
                    }
                };

                return Ok(new ApiResponseDTO<object[]>
                {
                    Success = true,
                    Data = charts,
                    Message = "Dashboard charts retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving dashboard charts for role {Role}", role);
                return StatusCode(500, new ApiResponseDTO<object[]>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve dashboard charts" }
                });
            }
        }

        [HttpGet("{role}/activities")]
        [Authorize]
        public ActionResult<ApiResponseDTO<object[]>> GetRecentActivities(string role, [FromQuery] int? userId = null, [FromQuery] int limit = 10)
        {
            try
            {
                var activities = new[]
                {
                    new
                    {
                        id = "1",
                        title = "New volunteer registered",
                        description = "John Doe joined the platform",
                        timestamp = DateTime.UtcNow.AddHours(-1),
                        type = "volunteer_registration",
                        userId = 123
                    },
                    new
                    {
                        id = "2", 
                        title = "Event completed",
                        description = "Community cleanup event finished",
                        timestamp = DateTime.UtcNow.AddHours(-3),
                        type = "event_completion",
                        userId = 456
                    }
                }.Take(limit).ToArray();

                return Ok(new ApiResponseDTO<object[]>
                {
                    Success = true,
                    Data = activities,
                    Message = "Recent activities retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recent activities for role {Role}", role);
                return StatusCode(500, new ApiResponseDTO<object[]>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve recent activities" }
                });
            }
        }

        [HttpGet("notifications/{userId}")]
        [Authorize]
        public ActionResult<ApiResponseDTO<object[]>> GetNotifications(int userId, [FromQuery] bool unreadOnly = false)
        {
            try
            {
                var notifications = new[]
                {
                    new
                    {
                        id = "1",
                        title = "Event reminder",
                        message = "Don't forget about tomorrow's community cleanup",
                        timestamp = DateTime.UtcNow.AddHours(-2),
                        isRead = false,
                        type = "reminder",
                        priority = "medium"
                    },
                    new
                    {
                        id = "2",
                        title = "New volunteer application", 
                        message = "A new volunteer has applied to join your organization",
                        timestamp = DateTime.UtcNow.AddHours(-5),
                        isRead = unreadOnly ? false : true,
                        type = "application",
                        priority = "high"
                    }
                };

                var result = unreadOnly ? notifications.Where(n => !n.isRead).ToArray() : notifications;
                
                return Ok(new ApiResponseDTO<object[]>
                {
                    Success = true,
                    Data = result,
                    Message = "Notifications retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving notifications for user {UserId}", userId);
                return StatusCode(500, new ApiResponseDTO<object[]>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve notifications" }
                });
            }
        }

        [HttpPatch("notifications/{notificationId}/read")]
        [Authorize]
        public ActionResult<ApiResponseDTO<object>> MarkNotificationAsRead(string notificationId)
        {
            try
            {
                // In a real implementation, you would update the notification in the database
                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Message = "Notification marked as read",
                    Data = new { notificationId }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking notification {NotificationId} as read", notificationId);
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to mark notification as read" }
                });
            }
        }

        [HttpGet("{role}/quick-actions")]
        [Authorize]
        public ActionResult<ApiResponseDTO<object[]>> GetQuickActions(string role)
        {
            try
            {
                var actions = role.ToLower() switch
                {
                    "admin" => new[]
                    {
                        new { id = "add-user", title = "Add User", icon = "user-plus", url = "/admin/users/add" },
                        new { id = "view-reports", title = "View Reports", icon = "chart-bar", url = "/admin/reports" },
                        new { id = "system-settings", title = "System Settings", icon = "cog", url = "/admin/settings" }
                    },
                    "organization" => new[]
                    {
                        new { id = "create-event", title = "Create Event", icon = "calendar-plus", url = "/events/create" },
                        new { id = "manage-volunteers", title = "Manage Volunteers", icon = "users", url = "/volunteers" },
                        new { id = "view-analytics", title = "View Analytics", icon = "chart-line", url = "/analytics" }
                    },
                    "volunteer" => new[]
                    {
                        new { id = "find-events", title = "Find Events", icon = "search", url = "/events" },
                        new { id = "my-schedule", title = "My Schedule", icon = "calendar", url = "/schedule" },
                        new { id = "update-profile", title = "Update Profile", icon = "user", url = "/profile" }
                    },
                    "partner" => new[]
                    {
                        new { id = "collaboration-requests", title = "Collaboration Requests", icon = "handshake", url = "/collaborations" },
                        new { id = "project-overview", title = "Project Overview", icon = "briefcase", url = "/projects" },
                        new { id = "impact-reports", title = "Impact Reports", icon = "chart-pie", url = "/reports" }
                    },
                    _ => new[]
                    {
                        new { id = "dashboard", title = "Dashboard", icon = "home", url = "/dashboard" }
                    }
                };

                return Ok(new ApiResponseDTO<object[]>
                {
                    Success = true,
                    Data = actions,
                    Message = "Quick actions retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving quick actions for role {Role}", role);
                return StatusCode(500, new ApiResponseDTO<object[]>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve quick actions" }
                });
            }
        }

        [HttpGet("admin-stats")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponseDTO<AdminOverviewStatsDto>>> GetAdminStats([FromQuery] TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var stats = await _analyticsService.GetAdminOverviewStatsAsync(period);
                return Ok(new ApiResponseDTO<AdminOverviewStatsDto>
                {
                    Success = true,
                    Data = stats,
                    Message = "Admin statistics retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin stats");
                return StatusCode(500, new ApiResponseDTO<AdminOverviewStatsDto>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve admin statistics" }
                });
            }
        }

        // New Analytics Endpoints
        [HttpGet("admin-analytics/overview")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponseDTO<AdminOverviewStatsDto>>> GetAdminOverviewAnalytics([FromQuery] TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var overview = await _analyticsService.GetAdminOverviewStatsAsync(period);
                return Ok(new ApiResponseDTO<AdminOverviewStatsDto>
                {
                    Success = true,
                    Data = overview,
                    Message = "Admin overview analytics retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin overview analytics");
                return StatusCode(500, new ApiResponseDTO<AdminOverviewStatsDto>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve admin overview analytics" }
                });
            }
        }

        [HttpGet("admin-analytics/system-health")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponseDTO<SystemHealthDto>>> GetSystemHealth()
        {
            try
            {
                var health = await _analyticsService.GetSystemHealthAsync();
                return Ok(new ApiResponseDTO<SystemHealthDto>
                {
                    Success = true,
                    Data = health,
                    Message = "System health retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system health");
                return StatusCode(500, new ApiResponseDTO<SystemHealthDto>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve system health" }
                });
            }
        }

        [HttpGet("admin-analytics/users")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetUserAnalytics([FromQuery] TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var userStats = await _analyticsService.GetUserAnalyticsAsync(period);
                var userGrowth = await _analyticsService.GetUserGrowthTrendsAsync(period);
                var roleDistribution = await _analyticsService.GetUserRoleDistributionAsync();
                var geographicDistribution = await _analyticsService.GetUserGeographicDistributionAsync();

                var analyticsData = new
                {
                    userStats,
                    userGrowth,
                    roleDistribution,
                    geographicDistribution
                };

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = analyticsData,
                    Message = "User analytics retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user analytics");
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve user analytics" }
                });
            }
        }

        [HttpGet("admin-analytics/events")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponseDTO<object>>> GetEventAnalytics([FromQuery] TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var eventStats = await _analyticsService.GetEventAnalyticsAsync(period);
                var eventTrends = await _analyticsService.GetEventTrendsAsync(period);
                var categoryStats = await _analyticsService.GetEventCategoryStatsAsync(period);
                var registrationStats = await _analyticsService.GetRegistrationAnalyticsAsync(period);

                var analyticsData = new
                {
                    eventStats,
                    eventTrends,
                    categoryStats,
                    registrationStats
                };

                return Ok(new ApiResponseDTO<object>
                {
                    Success = true,
                    Data = analyticsData,
                    Message = "Event analytics retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting event analytics");
                return StatusCode(500, new ApiResponseDTO<object>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to retrieve event analytics" }
                });
            }
        }
    }
}
