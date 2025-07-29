using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ivan_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
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
        public IActionResult GetAdminStats()
        {
            var stats = new
            {
                totalVolunteers = 150,
                totalOrganizations = 25,
                totalEvents = 45,
                totalHours = 2350,
                totalPartnerships = 12,
                pendingApprovals = 7,
                recentUsers = 23,
                systemHealth = "Healthy"
            };

            return Ok(stats);
        }
    }
}
