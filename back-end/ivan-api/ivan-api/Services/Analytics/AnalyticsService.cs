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

        #region Overview Statistics

        public async Task<AdminOverviewStatsDto> GetAdminOverviewStatsAsync(TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var dateRange = GetDateRange(period);
                var startDate = dateRange.StartDate;
                var endDate = dateRange.EndDate;

                var totalUsers = await _context.Users.CountAsync(u => u.IsActive == true);
                var totalVolunteers = await _context.VolunteerProfiles.CountAsync();
                var totalOrganizations = await _context.Organizations.CountAsync(o => o.IsActive == true);
                var totalPartners = await _context.Partners.CountAsync(p => p.IsActive == true);
                var totalEvents = await _context.Events.CountAsync(e => e.IsActive == true);
                
                // Get status IDs first
                var activeEventStatusId = await GetActiveEventStatusId();
                var pendingRegistrationStatusId = await GetPendingRegistrationStatusId();
                var completedEventStatusId = await GetCompletedEventStatusId();
                
                var activeEvents = await _context.Events.CountAsync(e => e.IsActive == true && 
                    e.StatusId == activeEventStatusId);

                var totalHours = await _context.VolunteerProfiles
                    .SumAsync(vp => vp.TotalHoursVolunteered ?? 0);

                var pendingApprovals = await _context.EventRegistrations
                    .CountAsync(er => er.StatusId == pendingRegistrationStatusId);

                var newUsersThisMonth = await _context.Users
                    .CountAsync(u => u.CreatedAt >= startDate && u.CreatedAt <= endDate);

                var completedEventsThisMonth = await _context.Events
                    .CountAsync(e => e.EndDate >= startDate && e.EndDate <= endDate && 
                        e.StatusId == completedEventStatusId);

                // Calculate monthly growth rate
                var previousPeriodStart = startDate.AddDays(-(endDate - startDate).Days);
                var previousPeriodUsers = await _context.Users
                    .CountAsync(u => u.CreatedAt >= previousPeriodStart && u.CreatedAt < startDate);

                var monthlyGrowthRate = previousPeriodUsers > 0 
                    ? ((decimal)(newUsersThisMonth - previousPeriodUsers) / previousPeriodUsers) * 100 
                    : 0;

                return new AdminOverviewStatsDto
                {
                    TotalUsers = totalUsers,
                    TotalVolunteers = totalVolunteers,
                    TotalOrganizations = totalOrganizations,
                    TotalPartners = totalPartners,
                    TotalEvents = totalEvents,
                    ActiveEvents = activeEvents,
                    TotalHours = totalHours,
                    PendingApprovals = pendingApprovals,
                    MonthlyGrowthRate = monthlyGrowthRate,
                    NewUsersThisMonth = newUsersThisMonth,
                    CompletedEventsThisMonth = completedEventsThisMonth
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin overview stats");
                throw;
            }
        }

        public async Task<SystemHealthDto> GetSystemHealthAsync()
        {
            try
            {
                // Simulate system health metrics - in production, these would come from monitoring tools
                var activeConnections = await _context.Users.CountAsync(u => u.LastLoginAt > DateTime.UtcNow.AddHours(-1));
                
                // Mock performance metrics - replace with actual monitoring
                return new SystemHealthDto
                {
                    OverallStatus = "Healthy",
                    DatabaseResponseTime = 45.2, // ms
                    ApiResponseTime = 120.5, // ms
                    ActiveConnections = activeConnections,
                    CpuUsage = 25.6, // %
                    MemoryUsage = 68.2, // %
                    ErrorRate = 0, // %
                    LastUpdated = DateTime.UtcNow
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system health");
                return new SystemHealthDto
                {
                    OverallStatus = "Error",
                    LastUpdated = DateTime.UtcNow
                };
            }
        }

        #endregion

        #region User Analytics

        public async Task<UserAnalyticsDto> GetUserAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var dateRange = GetDateRange(period);
                var startDate = dateRange.StartDate;
                var endDate = dateRange.EndDate;

                var totalUsers = await _context.Users.CountAsync();
                var activeUsers = await _context.Users.CountAsync(u => u.IsActive == true);
                var newUsers = await _context.Users.CountAsync(u => u.CreatedAt >= startDate && u.CreatedAt <= endDate);
                var verifiedUsers = await _context.Users.CountAsync(u => u.IsEmailVerified == true);

                // Calculate retention rate (users who logged in recently vs total users)
                var recentlyActiveUsers = await _context.Users
                    .CountAsync(u => u.LastLoginAt.HasValue && u.LastLoginAt >= startDate);
                var userRetentionRate = totalUsers > 0 ? (decimal)recentlyActiveUsers / totalUsers * 100 : 0;

                // Get most active role
                var roleStats = await _context.Users
                    .GroupBy(u => u.RoleId)
                    .Select(g => new { RoleId = g.Key, Count = g.Count() })
                    .OrderByDescending(r => r.Count)
                    .FirstOrDefaultAsync();

                var mostActiveRoleName = roleStats != null 
                    ? await _context.UserRoles.Where(ur => ur.RoleId == roleStats.RoleId)
                        .Select(ur => ur.RoleName).FirstOrDefaultAsync() ?? "Unknown"
                    : "No Data";

                return new UserAnalyticsDto
                {
                    TotalUsers = totalUsers,
                    ActiveUsers = activeUsers,
                    NewUsers = newUsers,
                    VerifiedUsers = verifiedUsers,
                    UserRetentionRate = userRetentionRate,
                    AverageSessionDuration = 25.5m, // Mock data - would need session tracking
                    MostActiveRole = roleStats?.RoleId ?? 0,
                    MostActiveRoleName = mostActiveRoleName
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user analytics");
                throw;
            }
        }

        public async Task<IEnumerable<UserGrowthDto>> GetUserGrowthTrendsAsync(TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var dateRange = GetDateRange(period);
                var startDate = dateRange.StartDate;
                var endDate = dateRange.EndDate;

                var growthData = new List<UserGrowthDto>();
                var currentDate = startDate;

                while (currentDate <= endDate)
                {
                    var nextDate = currentDate.AddDays(1);
                    
                    var newUsers = await _context.Users
                        .CountAsync(u => u.CreatedAt >= currentDate && u.CreatedAt < nextDate);
                    
                    var totalUsers = await _context.Users
                        .CountAsync(u => u.CreatedAt <= currentDate);
                    
                    var activeUsers = await _context.Users
                        .CountAsync(u => u.IsActive == true && u.CreatedAt <= currentDate);

                    growthData.Add(new UserGrowthDto
                    {
                        Date = currentDate,
                        NewUsers = newUsers,
                        TotalUsers = totalUsers,
                        ActiveUsers = activeUsers
                    });

                    currentDate = nextDate;
                }

                return growthData;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user growth trends");
                throw;
            }
        }

        public async Task<IEnumerable<RoleDistributionDto>> GetUserRoleDistributionAsync()
        {
            try
            {
                var totalUsers = await _context.Users.CountAsync();
                
                var roleDistribution = await _context.Users
                    .GroupBy(u => u.Role)
                    .Select(g => new RoleDistributionDto
                    {
                        RoleName = g.Key.RoleName,
                        UserCount = g.Count(),
                        Percentage = totalUsers > 0 ? (decimal)g.Count() / totalUsers * 100 : 0
                    })
                    .OrderByDescending(r => r.UserCount)
                    .ToListAsync();

                return roleDistribution;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user role distribution");
                throw;
            }
        }

        public async Task<IEnumerable<GeographicDistributionDto>> GetUserGeographicDistributionAsync()
        {
            try
            {
                var totalUsers = await _context.UserProfiles.CountAsync();
                
                var geographicDistribution = await _context.UserProfiles
                    .Where(up => !string.IsNullOrEmpty(up.Province))
                    .GroupBy(up => up.Province)
                    .Select(g => new GeographicDistributionDto
                    {
                        Province = g.Key ?? "Unknown",
                        UserCount = g.Count(),
                        Percentage = totalUsers > 0 ? (decimal)g.Count() / totalUsers * 100 : 0
                    })
                    .OrderByDescending(g => g.UserCount)
                    .Take(10)
                    .ToListAsync();

                return geographicDistribution;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting geographic distribution");
                throw;
            }
        }

        #endregion

        #region Event Analytics

        public async Task<EventAnalyticsDto> GetEventAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var dateRange = GetDateRange(period);
                var startDate = dateRange.StartDate;
                var endDate = dateRange.EndDate;

                var totalEvents = await _context.Events.CountAsync(e => e.IsActive == true);
                
                // Get status IDs first
                var activeEventStatusId = await GetActiveEventStatusId();
                var completedEventStatusId = await GetCompletedEventStatusId();
                var cancelledEventStatusId = await GetCancelledEventStatusId();
                var approvedRegistrationStatusId = await GetApprovedRegistrationStatusId();
                
                var activeEvents = await _context.Events.CountAsync(e => e.IsActive == true && 
                    e.StatusId == activeEventStatusId);
                var completedEvents = await _context.Events.CountAsync(e => 
                    e.StatusId == completedEventStatusId);
                var cancelledEvents = await _context.Events.CountAsync(e => 
                    e.StatusId == cancelledEventStatusId);

                var totalRegistrations = await _context.EventRegistrations.CountAsync();
                var approvedRegistrations = await _context.EventRegistrations
                    .CountAsync(er => er.StatusId == approvedRegistrationStatusId);

                var averageRegistrationsPerEvent = totalEvents > 0 
                    ? (decimal)totalRegistrations / totalEvents : 0;
                
                var eventCompletionRate = totalEvents > 0 
                    ? (decimal)completedEvents / totalEvents * 100 : 0;
                
                var registrationApprovalRate = totalRegistrations > 0 
                    ? (decimal)approvedRegistrations / totalRegistrations * 100 : 0;

                return new EventAnalyticsDto
                {
                    TotalEvents = totalEvents,
                    ActiveEvents = activeEvents,
                    CompletedEvents = completedEvents,
                    CancelledEvents = cancelledEvents,
                    AverageRegistrationsPerEvent = averageRegistrationsPerEvent,
                    EventCompletionRate = eventCompletionRate,
                    TotalRegistrations = totalRegistrations,
                    ApprovedRegistrations = approvedRegistrations,
                    RegistrationApprovalRate = registrationApprovalRate
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting event analytics");
                throw;
            }
        }

        public async Task<IEnumerable<EventTrendDto>> GetEventTrendsAsync(TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var dateRange = GetDateRange(period);
                var startDate = dateRange.StartDate;
                var endDate = dateRange.EndDate;

                // Get completed status ID first
                var completedStatusId = await _context.EventStatuses
                    .Where(es => es.StatusName == "Completed")
                    .Select(es => es.StatusId)
                    .FirstOrDefaultAsync();

                // Get event data by date
                var eventsByDate = await _context.Events
                    .Where(e => e.CreatedAt.HasValue && e.CreatedAt >= startDate && e.CreatedAt <= endDate)
                    .GroupBy(e => e.CreatedAt!.Value.Date)
                    .Select(g => new
                    {
                        Date = g.Key,
                        EventsCreated = g.Count(),
                        EventsCompleted = g.Count(e => e.StatusId == completedStatusId),
                        EventIds = g.Select(e => e.EventId).ToList()
                    })
                    .ToListAsync();

                // Get registration counts separately
                var registrationsByDate = await _context.EventRegistrations
                    .Where(er => er.ApplicationDate.HasValue && 
                                er.ApplicationDate >= startDate && 
                                er.ApplicationDate <= endDate)
                    .GroupBy(er => er.ApplicationDate!.Value.Date)
                    .Select(g => new
                    {
                        Date = g.Key,
                        RegistrationCount = g.Count()
                    })
                    .ToListAsync();

                // Combine the results
                var eventTrends = eventsByDate.Select(e => new EventTrendDto
                {
                    Date = e.Date,
                    EventsCreated = e.EventsCreated,
                    EventsCompleted = e.EventsCompleted,
                    Registrations = registrationsByDate
                        .Where(r => r.Date == e.Date)
                        .Sum(r => r.RegistrationCount)
                })
                .OrderBy(et => et.Date)
                .ToList();

                return eventTrends;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting event trends");
                throw;
            }
        }

        public async Task<IEnumerable<EventCategoryStatsDto>> GetEventCategoryStatsAsync(TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var totalEvents = await _context.Events.CountAsync(e => e.IsActive == true);

                var categoryStats = await _context.Events
                    .Where(e => e.IsActive == true)
                    .GroupBy(e => e.Category)
                    .Select(g => new EventCategoryStatsDto
                    {
                        CategoryName = g.Key.CategoryName,
                        EventCount = g.Count(),
                        TotalRegistrations = _context.EventRegistrations
                            .Count(er => g.Any(e => e.EventId == er.EventId)),
                        AverageRating = g.Average(e => e.Rating) ?? 0,
                        Percentage = totalEvents > 0 ? (decimal)g.Count() / totalEvents * 100 : 0
                    })
                    .OrderByDescending(cs => cs.EventCount)
                    .ToListAsync();

                return categoryStats;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting event category stats");
                throw;
            }
        }

        public async Task<RegistrationAnalyticsDto> GetRegistrationAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days)
        {
            try
            {
                var totalRegistrations = await _context.EventRegistrations.CountAsync();
                
                // Get status IDs first
                var approvedRegistrationStatusId = await GetApprovedRegistrationStatusId();
                var pendingRegistrationStatusId = await GetPendingRegistrationStatusId();
                var rejectedRegistrationStatusId = await GetRejectedRegistrationStatusId();
                
                var approvedRegistrations = await _context.EventRegistrations
                    .CountAsync(er => er.StatusId == approvedRegistrationStatusId);
                var pendingRegistrations = await _context.EventRegistrations
                    .CountAsync(er => er.StatusId == pendingRegistrationStatusId);
                var rejectedRegistrations = await _context.EventRegistrations
                    .CountAsync(er => er.StatusId == rejectedRegistrationStatusId);

                var approvalRate = totalRegistrations > 0 
                    ? (decimal)approvedRegistrations / totalRegistrations * 100 : 0;

                // Mock average processing time - would need to calculate from actual approval dates
                var averageProcessingTime = 2.5m; // days

                // Mock attendance rate
                var attendanceRate = 85; // percentage

                return new RegistrationAnalyticsDto
                {
                    TotalRegistrations = totalRegistrations,
                    ApprovedRegistrations = approvedRegistrations,
                    PendingRegistrations = pendingRegistrations,
                    RejectedRegistrations = rejectedRegistrations,
                    ApprovalRate = approvalRate,
                    AverageProcessingTime = averageProcessingTime,
                    AttendanceRate = attendanceRate
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting registration analytics");
                throw;
            }
        }

        #endregion

        #region Helper Methods

        private (DateTime StartDate, DateTime EndDate) GetDateRange(TimePeriod period)
        {
            var endDate = DateTime.UtcNow;
            var startDate = period switch
            {
                TimePeriod.Last7Days => endDate.AddDays(-7),
                TimePeriod.Last30Days => endDate.AddDays(-30),
                TimePeriod.Last3Months => endDate.AddMonths(-3),
                TimePeriod.Last6Months => endDate.AddMonths(-6),
                TimePeriod.LastYear => endDate.AddYears(-1),
                _ => endDate.AddDays(-30)
            };

            return (startDate, endDate);
        }

        private async Task<int> GetActiveEventStatusId()
        {
            return await _context.EventStatuses
                .Where(es => es.StatusName == "Active" || es.StatusName == "Ongoing")
                .Select(es => es.StatusId)
                .FirstOrDefaultAsync();
        }

        private async Task<int> GetCompletedEventStatusId()
        {
            return await _context.EventStatuses
                .Where(es => es.StatusName == "Completed" || es.StatusName == "Finished")
                .Select(es => es.StatusId)
                .FirstOrDefaultAsync();
        }

        private async Task<int> GetCancelledEventStatusId()
        {
            return await _context.EventStatuses
                .Where(es => es.StatusName == "Cancelled" || es.StatusName == "Canceled")
                .Select(es => es.StatusId)
                .FirstOrDefaultAsync();
        }

        private async Task<int> GetPendingRegistrationStatusId()
        {
            return await _context.RegistrationStatuses
                .Where(rs => rs.StatusName == "Pending")
                .Select(rs => rs.StatusId)
                .FirstOrDefaultAsync();
        }

        private async Task<int> GetApprovedRegistrationStatusId()
        {
            return await _context.RegistrationStatuses
                .Where(rs => rs.StatusName == "Approved")
                .Select(rs => rs.StatusId)
                .FirstOrDefaultAsync();
        }

        private async Task<int> GetRejectedRegistrationStatusId()
        {
            return await _context.RegistrationStatuses
                .Where(rs => rs.StatusName == "Rejected")
                .Select(rs => rs.StatusId)
                .FirstOrDefaultAsync();
        }

        #endregion

        #region Not Yet Implemented Methods

        public Task<IEnumerable<FeedbackAnalyticsDto>> GetFeedbackAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days)
        {
            throw new NotImplementedException("Will be implemented in next phase");
        }

        public Task<CertificateAnalyticsDto> GetCertificateAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days)
        {
            throw new NotImplementedException("Will be implemented in next phase");
        }

        public Task<EngagementAnalyticsDto> GetEngagementAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days)
        {
            throw new NotImplementedException("Will be implemented in next phase");
        }

        public Task<IEnumerable<SupportTicketAnalyticsDto>> GetSupportTicketAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days)
        {
            throw new NotImplementedException("Will be implemented in next phase");
        }

        public Task<NotificationAnalyticsDto> GetNotificationAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days)
        {
            throw new NotImplementedException("Will be implemented in next phase");
        }

        public Task<ChatbotAnalyticsDto> GetChatbotAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days)
        {
            throw new NotImplementedException("Will be implemented in next phase");
        }

        public Task<PartnershipAnalyticsDto> GetPartnershipAnalyticsAsync(TimePeriod period = TimePeriod.Last30Days)
        {
            throw new NotImplementedException("Will be implemented in next phase");
        }

        public Task<IEnumerable<CollaborationTrendDto>> GetCollaborationTrendsAsync(TimePeriod period = TimePeriod.Last30Days)
        {
            throw new NotImplementedException("Will be implemented in next phase");
        }

        public Task<IEnumerable<DailyStatsDto>> GetDailyStatsAsync(DateTime startDate, DateTime endDate)
        {
            throw new NotImplementedException("Will be implemented in next phase");
        }

        public Task<IEnumerable<MonthlyStatsDto>> GetMonthlyStatsAsync(int year)
        {
            throw new NotImplementedException("Will be implemented in next phase");
        }

        public Task<YearlyStatsDto> GetYearlyStatsAsync(int year)
        {
            throw new NotImplementedException("Will be implemented in next phase");
        }

        public Task<DetailedAnalyticsDto> GetDetailedAnalyticsAsync(AnalyticsRequestDto request)
        {
            throw new NotImplementedException("Will be implemented in next phase");
        }

        #endregion
    }
}
