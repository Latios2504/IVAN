using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.Services.Analytics;
using ivan_api.DTOs.Analytics;

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
        public IActionResult GetSystemStats()
        {
            var stats = new
            {
                totalVolunteers = 150,
                totalOrganizations = 25,
                totalEvents = 45,
                totalHours = 2350,
                totalPartnerships = 12
            };

            return Ok(stats);
        }

        [HttpGet("organization-stats")]
        [Authorize(Roles = "Organization")]
        public IActionResult GetOrganizationStats()
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

            return Ok(stats);
        }

        [HttpGet("volunteer-stats")]
        [Authorize(Roles = "Volunteer")]
        public IActionResult GetVolunteerStats()
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

            return Ok(stats);
        }

        [HttpGet("partner-stats")]
        [Authorize(Roles = "Partner")]
        public IActionResult GetPartnerStats()
        {
            var stats = new
            {
                totalCollaborations = 12,
                activeProjects = 4,
                totalInvestment = 250000,
                partneredOrganizations = 8
            };

            return Ok(stats);
        }

        [HttpGet("coordinator/{coordinatorId}/stats")]
        [Authorize(Roles = "Organization,Admin")]
        public IActionResult GetCoordinatorStats(int coordinatorId)
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

            return Ok(stats);
        }

        [HttpGet("{role}/charts")]
        [Authorize]
        public IActionResult GetDashboardCharts(string role, [FromQuery] int? userId = null)
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

            return Ok(charts);
        }

        [HttpGet("{role}/activities")]
        [Authorize]
        public IActionResult GetRecentActivities(string role, [FromQuery] int? userId = null, [FromQuery] int limit = 10)
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
            }.Take(limit);

            return Ok(activities);
        }

        [HttpGet("notifications/{userId}")]
        [Authorize]
        public IActionResult GetNotifications(int userId, [FromQuery] bool unreadOnly = false)
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

            var result = unreadOnly ? notifications.Where(n => !n.isRead) : notifications;
            return Ok(result);
        }

        [HttpPatch("notifications/{notificationId}/read")]
        [Authorize]
        public IActionResult MarkNotificationAsRead(string notificationId)
        {
            // In a real implementation, you would update the notification in the database
            return Ok(new { message = "Notification marked as read" });
        }

        [HttpGet("{role}/quick-actions")]
        [Authorize]
        public IActionResult GetQuickActions(string role)
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

            return Ok(actions);
        }

        [HttpGet("admin-stats")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminStats([FromQuery] TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var stats = await _analyticsService.GetAdminOverviewStatsAsync(period);
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin stats");
                return StatusCode(500, "Internal server error");
            }
        }

        // New Analytics Endpoints
        [HttpGet("admin-analytics/overview")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminOverviewAnalytics([FromQuery] TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var overview = await _analyticsService.GetAdminOverviewStatsAsync(period);
                return Ok(overview);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin overview analytics");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("admin-analytics/system-health")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetSystemHealth()
        {
            try
            {
                var health = await _analyticsService.GetSystemHealthAsync();
                return Ok(health);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system health");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("admin-analytics/users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUserAnalytics([FromQuery] TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var userStats = await _analyticsService.GetUserAnalyticsAsync(period);
                var userGrowth = await _analyticsService.GetUserGrowthTrendsAsync(period);
                var roleDistribution = await _analyticsService.GetUserRoleDistributionAsync();
                var geographicDistribution = await _analyticsService.GetUserGeographicDistributionAsync();

                return Ok(new
                {
                    userStats,
                    userGrowth,
                    roleDistribution,
                    geographicDistribution
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user analytics");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("admin-analytics/events")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetEventAnalytics([FromQuery] TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var eventStats = await _analyticsService.GetEventAnalyticsAsync(period);
                var eventTrends = await _analyticsService.GetEventTrendsAsync(period);
                var categoryStats = await _analyticsService.GetEventCategoryStatsAsync(period);
                var registrationStats = await _analyticsService.GetRegistrationAnalyticsAsync(period);

                return Ok(new
                {
                    eventStats,
                    eventTrends,
                    categoryStats,
                    registrationStats
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting event analytics");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
