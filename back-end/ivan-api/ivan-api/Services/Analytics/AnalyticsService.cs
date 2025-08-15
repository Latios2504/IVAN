using Microsoft.EntityFrameworkCore;
using ivan_api.DTOs.Analytics;
using ivan_api.Models;

namespace ivan_api.Services.Analytics
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly ILogger<AnalyticsService> _logger;

        public AnalyticsService(VolunteerManagementSystemContext context, ILogger<AnalyticsService> logger)
        {
            _context = context;
            _logger = logger;
        }

        #region Admin Dashboard

        public async Task<AdminDashboardDto> GetAdminDashboardAsync(TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var dateFilter = GetDateFilter(period);

                // System Overview Stats
                var totalUsers = await _context.Users.CountAsync();
                var totalVolunteers = await _context.VolunteerProfiles.CountAsync();
                var totalOrganizations = await _context.Organizations.CountAsync();
                var totalPartners = await _context.Partners.CountAsync();
                var totalEvents = await _context.Events.CountAsync();
                var activeEvents = await _context.Events.CountAsync(e => e.Status.StatusName == "Active");
                var pendingApprovals = await _context.EventRegistrations.CountAsync(r => r.Status.StatusName == "Pending");

                // Growth metrics
                var newUsersThisMonth = await _context.Users.CountAsync(u => u.CreatedAt >= dateFilter);
                var completedEventsThisMonth = await _context.Events.CountAsync(e => e.Status.StatusName == "Completed" && e.CreatedAt >= dateFilter);

                // Role distribution
                var roleDistribution = await _context.Users
                    .GroupBy(u => u.Role.RoleName)
                    .Select(g => new RoleDistributionDto
                    {
                        RoleName = g.Key,
                        UserCount = g.Count(),
                        Percentage = (decimal)g.Count() / totalUsers * 100
                    })
                    .ToListAsync();

                // Monthly stats for charts
                var monthlyStats = await GetMonthlyStatsAsync(period);

                return new AdminDashboardDto
                {
                    TotalUsers = totalUsers,
                    TotalVolunteers = totalVolunteers,
                    TotalOrganizations = totalOrganizations,
                    TotalPartners = totalPartners,
                    TotalCoordinators = await _context.VolunteerCoordinators.CountAsync(vc => vc.IsActive == true),
                    TotalEvents = totalEvents,
                    TotalRegistrations = await _context.EventRegistrations.CountAsync(),
                    PendingVerifications = pendingApprovals,
                    RoleDistribution = roleDistribution,
                    MonthlyGrowth = monthlyStats
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin dashboard data");
                throw;
            }
        }

        #endregion

        #region Organization Dashboard

        public async Task<OrganizationDashboardDto> GetOrganizationDashboardAsync(int organizationId, TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var dateFilter = GetDateFilter(period);

                // Organization's events
                var totalEvents = await _context.Events.CountAsync(e => e.OrganizationId == organizationId);
                var activeEvents = await _context.Events.CountAsync(e => e.OrganizationId == organizationId && e.Status.StatusName == "Active");
                var completedEvents = await _context.Events.CountAsync(e => e.OrganizationId == organizationId && e.Status.StatusName == "Completed");

                // Volunteer engagement
                var totalVolunteers = await _context.EventRegistrations
                    .Where(r => r.Event.OrganizationId == organizationId && r.Status.StatusName == "Approved")
                    .Select(r => r.VolunteerId)
                    .Distinct()
                    .CountAsync();

                var totalRegistrations = await _context.EventRegistrations
                    .CountAsync(r => r.Event.OrganizationId == organizationId);

                var pendingRegistrations = await _context.EventRegistrations
                    .CountAsync(r => r.Event.OrganizationId == organizationId && r.Status.StatusName == "Pending");

                // Event categories
                var eventCategories = await _context.Events
                    .Where(e => e.OrganizationId == organizationId)
                    .GroupBy(e => e.Category.CategoryName)
                    .Select(g => new EventCategoryStatsDto
                    {
                        CategoryName = g.Key,
                        EventCount = g.Count(),
                        VolunteerCount = g.Sum(e => e.CurrentVolunteers ?? 0)
                    })
                    .ToListAsync();

                // Performance metrics
                var avgRating = await _context.Events
                    .Where(e => e.OrganizationId == organizationId && e.Rating.HasValue)
                    .AverageAsync(e => e.Rating ?? 0);

                // Calculate total volunteer hours from approved registrations
                var totalVolunteerHours = (int)Math.Round(await _context.EventRegistrations
                    .Where(r => r.Event.OrganizationId == organizationId && r.Status.StatusName == "Approved")
                    .SumAsync(r => (double)(r.ActualHours ?? 0)));

                // Get recent events
                var recentEvents = await _context.Events
                    .Where(e => e.OrganizationId == organizationId)
                    .OrderByDescending(e => e.CreatedAt)
                    .Take(5)
                    .Select(e => new RecentEventDto
                    {
                        EventId = e.EventId,
                        EventName = e.EventName,
                        StartDate = e.StartDate,
                        Status = e.Status.StatusName,
                        RegisteredVolunteers = e.EventRegistrations.Count(r => r.Status.StatusName == "Approved")
                    })
                    .ToListAsync();

                return new OrganizationDashboardDto
                {
                    MyTotalEvents = totalEvents,
                    MyActiveEvents = activeEvents,
                    MyCompletedEvents = completedEvents,
                    TotalVolunteersReached = totalVolunteers,
                    PendingRegistrations = pendingRegistrations,
                    ApprovedRegistrations = totalRegistrations - pendingRegistrations,
                    AverageEventRating = avgRating,
                    TotalVolunteerHours = totalVolunteerHours,
                    EventsByCategory = eventCategories,
                    RecentEvents = recentEvents
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting organization dashboard data for organization {OrganizationId}", organizationId);
                throw;
            }
        }

        #endregion

        #region Partner Dashboard

        public async Task<PartnerDashboardDto> GetPartnerDashboardAsync(int partnerId, TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var partner = await _context.Partners.FindAsync(partnerId);
                if (partner == null) throw new ArgumentException("Partner not found");

                // Partner collaboration stats
                var totalCollaborations = partner.TotalCollaborations ?? 0;
                var activeCollaborations = await _context.PartnerCollaborations
                    .Where(pc => pc.PartnerId == partnerId && pc.Status == "Active")
                    .CountAsync();
                var totalFunding = await _context.PartnerCollaborations
                    .Where(pc => pc.PartnerId == partnerId)
                    .SumAsync(pc => pc.Budget ?? 0);
                var avgRating = partner.Rating ?? 0;

                // Recent activities (simplified) - Events don't have direct PartnerId, using PartnerCollaborations
                var recentActivities = await _context.PartnerCollaborations
                    .Where(pc => pc.PartnerId == partnerId)
                    .OrderByDescending(pc => pc.CreatedAt)
                    .Take(5)
                    .Select(pc => new PartnerActivityDto
                    {
                        ActivityType = "Collaboration",
                        Description = pc.CollaborationName ?? "Partnership Activity",
                        Date = pc.CreatedAt ?? DateTime.Now,
                        Status = pc.Status ?? "Active"
                    })
                    .ToListAsync();

                // Get total collaborations count
                var sponsoredEvents = await _context.PartnerCollaborations
                    .Where(pc => pc.PartnerId == partnerId)
                    .CountAsync();

                // Get collaboration types
                var collaborationsByType = await _context.PartnerCollaborations
                    .Where(pc => pc.PartnerId == partnerId)
                    .GroupBy(pc => pc.Type.TypeName ?? "General")
                    .Select(g => new CollaborationTypeDto
                    {
                        Type = g.Key,
                        Count = g.Count(),
                        Amount = g.Sum(pc => pc.Budget ?? 0)
                    })
                    .ToListAsync();

                return new PartnerDashboardDto
                {
                    TotalCollaborations = totalCollaborations,
                    ActiveCollaborations = activeCollaborations,
                    TotalSponsorshipAmount = totalFunding,
                    AveragePartnerRating = avgRating,
                    SponsoredEvents = sponsoredEvents,
                    CollaborationsByType = collaborationsByType,
                    IndustryComparison = new List<IndustryStatsDto>() // Keep empty as industry comparison requires complex logic
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting partner dashboard data for partner {PartnerId}", partnerId);
                throw;
            }
        }

        #endregion

        #region Coordinator Dashboard

        public async Task<CoordinatorDashboardDto> GetCoordinatorDashboardAsync(int coordinatorId, TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var dateFilter = GetDateFilter(period);

                // Events managed by coordinator (through CoordinatorTasks)
                var eventsWithCoordinator = await _context.CoordinatorTasks
                    .Where(ct => ct.CoordinatorId == coordinatorId)
                    .Select(ct => ct.EventId)
                    .Distinct()
                    .ToListAsync();
                
                var totalEventsManaged = eventsWithCoordinator.Count;
                var activeEventsManaged = await _context.Events
                    .CountAsync(e => eventsWithCoordinator.Contains(e.EventId) && e.Status.StatusName == "Active");

                // Volunteer management
                var totalVolunteersManaged = await _context.EventRegistrations
                    .Where(r => eventsWithCoordinator.Contains(r.EventId) && r.Status.StatusName == "Approved")
                    .Select(r => r.VolunteerId)
                    .Distinct()
                    .CountAsync();

                var pendingApprovals = await _context.EventRegistrations
                    .CountAsync(r => eventsWithCoordinator.Contains(r.EventId) && r.Status.StatusName == "Pending");

                // Performance metrics
                var avgEventRating = await _context.Events
                    .Where(e => eventsWithCoordinator.Contains(e.EventId) && e.Rating.HasValue)
                    .AverageAsync(e => e.Rating ?? 0);

                // Recent tasks (simplified) - OnSiteTasks don't have AssignedCoordinatorId, using CoordinatorTasks instead
                var recentTasks = await _context.CoordinatorTasks
                    .Where(t => t.CoordinatorId == coordinatorId)
                    .OrderByDescending(t => t.CreatedAt)
                    .Take(5)
                    .Select(t => new CoordinatorTaskDto
                    {
                        TaskName = t.TaskName,
                        Status = t.Status ?? "Pending",
                        DueDate = t.DueDate,
                        Priority = t.Priority ?? "Medium"
                    })
                    .ToListAsync();

                // Calculate task statistics
                var tasksAssigned = await _context.CoordinatorTasks
                    .CountAsync(t => t.CoordinatorId == coordinatorId);
                
                var tasksCompleted = await _context.CoordinatorTasks
                    .CountAsync(t => t.CoordinatorId == coordinatorId && t.Status == "Completed");
                
                var taskCompletionRate = tasksAssigned > 0 ? (decimal)tasksCompleted / tasksAssigned * 100 : 0;

                // Get tasks by status
                var tasksByStatus = await _context.CoordinatorTasks
                    .Where(t => t.CoordinatorId == coordinatorId)
                    .GroupBy(t => t.Status ?? "Pending")
                    .Select(g => new TaskStatusDto
                    {
                        Status = g.Key,
                        Count = g.Count()
                    })
                    .ToListAsync();

                // Get top volunteers based on event participation in coordinator's events
                var topVolunteers = await _context.EventRegistrations
                    .Where(r => eventsWithCoordinator.Contains(r.EventId) && r.Status.StatusName == "Approved")
                    .GroupBy(r => new { r.VolunteerId, r.Volunteer.User.UserProfiles.FirstOrDefault().FirstName, r.Volunteer.User.UserProfiles.FirstOrDefault().LastName })
                    .Select(g => new VolunteerPerformanceDto
                    {
                        VolunteerId = g.Key.VolunteerId,
                        VolunteerName = $"{g.Key.FirstName} {g.Key.LastName}",
                        TasksCompleted = g.Count(), // Using event participation as tasks completed
                        Rating = 4.5m, // Simplified rating
                        HoursWorked = (int)Math.Round((double)(g.Sum(r => r.ActualHours ?? 0)))
                    })
                    .OrderByDescending(v => v.TasksCompleted)
                    .Take(5)
                    .ToListAsync();

                return new CoordinatorDashboardDto
                {
                    EventsManaged = totalEventsManaged,
                    VolunteersManaged = totalVolunteersManaged,
                    TasksAssigned = tasksAssigned,
                    TasksCompleted = tasksCompleted,
                    TaskCompletionRate = taskCompletionRate,
                    UpcomingEvents = activeEventsManaged,
                    PendingApprovals = pendingApprovals,
                    TasksByStatus = tasksByStatus,
                    TopVolunteers = topVolunteers
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting coordinator dashboard data for coordinator {CoordinatorId}", coordinatorId);
                throw;
            }
        }

        #endregion

        #region Volunteer Dashboard

        public async Task<VolunteerDashboardDto> GetVolunteerDashboardAsync(int volunteerId, TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var volunteer = await _context.VolunteerProfiles.FindAsync(volunteerId);
                if (volunteer == null) throw new ArgumentException("Volunteer not found");

                // Volunteer participation stats
                var totalEventsJoined = await _context.EventRegistrations
                    .CountAsync(r => r.VolunteerId == volunteerId && r.Status.StatusName == "Approved");

                var completedEvents = await _context.EventRegistrations
                    .CountAsync(r => r.VolunteerId == volunteerId && r.Event.Status.StatusName == "Completed");

                var totalHoursVolunteered = volunteer.TotalHoursVolunteered ?? 0;
                var impactScore = volunteer.TotalHoursVolunteered ?? 0; // Using total hours as impact score

                // Upcoming events count
                var upcomingEventsCount = await _context.EventRegistrations
                    .CountAsync(r => r.VolunteerId == volunteerId && r.Status.StatusName == "Approved" && r.Event.StartDate > DateTime.Now);

                // Skills and achievements (simplified)
                var skillsCount = await _context.VolunteerSkills
                    .CountAsync(vs => vs.VolunteerId == volunteerId);

                // Calculate total volunteer hours from approved registrations
                var totalVolunteerHours = (int)Math.Round(await _context.EventRegistrations
                    .Where(r => r.VolunteerId == volunteerId && r.Status.StatusName == "Approved")
                    .SumAsync(r => (double)(r.ActualHours ?? 0)));

                // Get recent achievements (using event completions as achievements)
                var recentAchievements = await _context.EventRegistrations
                    .Where(r => r.VolunteerId == volunteerId && r.Status.StatusName == "Approved")
                    .OrderByDescending(r => r.Event.EndDate)
                    .Take(5)
                    .Select(r => new RecentAchievementDto
                    {
                        Title = $"Completed {r.Event.EventName}",
                        Description = $"Successfully participated in {r.Event.EventName}",
                        AchievedDate = r.Event.EndDate,
                        Type = "Event Completion"
                    })
                    .ToListAsync();

                // Get events by category
                var eventsByCategory = await _context.EventRegistrations
                    .Where(r => r.VolunteerId == volunteerId && r.Status.StatusName == "Approved")
                    .GroupBy(r => r.Event.Category.CategoryName)
                    .Select(g => new EventCategoryStatsDto
                    {
                        CategoryName = g.Key,
                        EventCount = g.Count(),
                        VolunteerCount = g.Select(r => r.VolunteerId).Distinct().Count()
                    })
                    .ToListAsync();

                // Get skill progress from volunteer skills
                var skillProgress = await _context.VolunteerSkills
                    .Where(vs => vs.VolunteerId == volunteerId)
                    .Select(vs => new SkillProgressDto
                    {
                        SkillName = vs.Skill.SkillName,
                        ProficiencyLevel = vs.ProficiencyLevel ?? "Beginner",
                        EventsUsed = 0, // Simplified - could be calculated from events
                        YearsOfExperience = 1 // Simplified - could be calculated from CreatedAt
                    })
                    .ToListAsync();

                return new VolunteerDashboardDto
                {
                    EventsParticipated = totalEventsJoined,
                    EventsCompleted = completedEvents,
                    TotalVolunteerHours = totalVolunteerHours,
                    SkillsAcquired = skillsCount,
                    UpcomingEvents = upcomingEventsCount,
                    EventsByCategory = eventsByCategory,
                    SkillProgress = skillProgress,
                    RecentAchievements = recentAchievements
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting volunteer dashboard data for volunteer {VolunteerId}", volunteerId);
                throw;
            }
        }

        #endregion

        #region Helper Methods

        private DateTime GetDateFilter(TimePeriod period)
        {
            return period switch
            {
                TimePeriod.Last7Days => DateTime.UtcNow.AddDays(-7),
                TimePeriod.Last30Days => DateTime.UtcNow.AddDays(-30),
                TimePeriod.Last3Months => DateTime.UtcNow.AddMonths(-3),
                TimePeriod.LastYear => DateTime.UtcNow.AddYears(-1),
                _ => DateTime.UtcNow.AddDays(-30)
            };
        }

        private async Task<List<MonthlyStatsDto>> GetMonthlyStatsAsync(TimePeriod period)
        {
            var months = period == TimePeriod.LastYear ? 12 : 6;
            var monthlyStats = new List<MonthlyStatsDto>();

            for (int i = months - 1; i >= 0; i--)
            {
                var startDate = DateTime.UtcNow.AddMonths(-i).Date;
                var endDate = startDate.AddMonths(1).AddDays(-1);

                var newUsers = await _context.Users.CountAsync(u => u.CreatedAt >= startDate && u.CreatedAt <= endDate);
                var newEvents = await _context.Events.CountAsync(e => e.CreatedAt >= startDate && e.CreatedAt <= endDate);

                monthlyStats.Add(new MonthlyStatsDto
                {
                    Month = startDate.ToString("MMM yyyy"),
                    Users = newUsers,
                    Events = newEvents
                });
            }

            return monthlyStats;
        }

        #endregion
    }
}
