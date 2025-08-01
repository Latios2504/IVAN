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
