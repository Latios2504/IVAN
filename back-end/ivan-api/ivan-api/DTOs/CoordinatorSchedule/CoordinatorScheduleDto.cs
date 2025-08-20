namespace ivan_api.DTOs.CoordinatorSchedule
{
    // Request DTOs
    public class CreateCoordinatorScheduleDto
    {
        public int CoordinatorId { get; set; }
        public int? EventId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public string? Location { get; set; }
        public string? ScheduleType { get; set; } = "Event"; // Event, Meeting, Training, etc.
        public string? Priority { get; set; } = "Medium"; // High, Medium, Low
        public string? Status { get; set; } = "Scheduled"; // Scheduled, In Progress, Completed, Cancelled
        public bool IsAllDay { get; set; } = false;
        public int ReminderMinutes { get; set; } = 60;
        public string? Notes { get; set; }
    }

    public class UpdateCoordinatorScheduleDto
    {
        public int? EventId { get; set; }
        public int? CoordinatorId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
        public string? Location { get; set; }
        public string? ScheduleType { get; set; }
        public string? Priority { get; set; }
        public string? Status { get; set; }
        public bool? IsAllDay { get; set; }
        public int? ReminderMinutes { get; set; }
        public string? Notes { get; set; }
    }

    public class CoordinatorScheduleFilterDto
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public string? SortBy { get; set; } = "StartDateTime";
        public string? SortDirection { get; set; } = "asc";
        
        // Filters
        public int? CoordinatorId { get; set; }
        public int? EventId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? StartDateFrom { get; set; }
        public DateTime? StartDateTo { get; set; }
        public DateTime? EndDateFrom { get; set; }
        public DateTime? EndDateTo { get; set; }
        public string? ScheduleType { get; set; }
        public string? Priority { get; set; }
        public string? Status { get; set; }
        public string? Search { get; set; }
    }

    // Response DTOs
    public class CoordinatorScheduleDto
    {
        public int ScheduleId { get; set; }
        public int CoordinatorId { get; set; }
        public string CoordinatorName { get; set; } = string.Empty;
        public string CoordinatorEmail { get; set; } = string.Empty;
        public string? CoordinatorPosition { get; set; }
        public int? EventId { get; set; }
        public string? EventName { get; set; }
        public string? EventLocation { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public string? Location { get; set; }
        public string? ScheduleType { get; set; }
        public string? Priority { get; set; }
        public string? Status { get; set; }
        public bool? IsAllDay { get; set; }
        public int? ReminderMinutes { get; set; }
        public string? Notes { get; set; }
        public string? CreatedByName { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CoordinatorScheduleStatsDto
    {
        public int TotalSchedules { get; set; }
        public int ScheduledCount { get; set; }
        public int InProgressCount { get; set; }
        public int CompletedCount { get; set; }
        public int CancelledCount { get; set; }
        public int TodaySchedules { get; set; }
        public int ThisWeekSchedules { get; set; }
        public int ThisMonthSchedules { get; set; }
        public int UpcomingSchedules { get; set; }
        public int OverdueSchedules { get; set; }
        
        // By Type
        public Dictionary<string, int> SchedulesByType { get; set; } = new();
        public Dictionary<string, int> SchedulesByPriority { get; set; } = new();
        
        // By Coordinator
        public List<CoordinatorScheduleStatsItem> TopCoordinators { get; set; } = new();
    }

    public class CoordinatorScheduleStatsItem
    {
        public int CoordinatorId { get; set; }
        public string CoordinatorName { get; set; } = string.Empty;
        public int ScheduleCount { get; set; }
        public int CompletedCount { get; set; }
        public double CompletionRate { get; set; }
    }

    // Summary DTO for Calendar Views
    public class CoordinatorScheduleSummaryDto
    {
        public int ScheduleId { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public string? ScheduleType { get; set; }
        public string? Priority { get; set; }
        public string? Status { get; set; }
        public bool? IsAllDay { get; set; }
        public string? CoordinatorName { get; set; }
        public string? EventName { get; set; }
    }

    // Additional DTOs for new endpoints
    public class UpdateScheduleStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }

    public class BulkUpdateStatusDto
    {
        public List<int> ScheduleIds { get; set; } = new();
        public string Status { get; set; } = string.Empty;
    }

    public class BulkDeleteDto
    {
        public List<int> ScheduleIds { get; set; } = new();
    }

    public class CheckConflictsDto
    {
        public int CoordinatorId { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public int? ExcludeScheduleId { get; set; }
    }
}
