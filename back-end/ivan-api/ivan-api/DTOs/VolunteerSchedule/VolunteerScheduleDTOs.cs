namespace ivan_api.DTOs.VolunteerSchedule
{
    // Request DTOs for Volunteer Schedule Management
    public class VolunteerScheduleRequestDTO
    {
        public int VolunteerId { get; set; } // Target volunteer
        public int? EventId { get; set; } // Optional event association
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public string? Location { get; set; }
        public string? ScheduleType { get; set; } // "Event", "Training", "Meeting", "Task"
        public string? Priority { get; set; } // "High", "Medium", "Low"
        public string? Status { get; set; } // "Scheduled", "InProgress", "Completed", "Cancelled"
        public bool IsAllDay { get; set; } = false;
        public int ReminderMinutes { get; set; } = 60;
        public string? Notes { get; set; }
    }

    public class VolunteerScheduleDTO
    {
        public int ScheduleId { get; set; }
        public int VolunteerId { get; set; }
        public string VolunteerName { get; set; } = string.Empty;
        public string VolunteerEmail { get; set; } = string.Empty;
        public string? VolunteerPhone { get; set; }
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

    public class VolunteerScheduleFilterDTO
    {
        public int Page { get; set; } = 1;
        public int Size { get; set; } = 20;
        public string? SortBy { get; set; } = "StartDateTime";
        public string? SortDirection { get; set; } = "asc";
        public int? VolunteerId { get; set; }
        public int? EventId { get; set; }
        public DateTime? StartDateFrom { get; set; }
        public DateTime? StartDateTo { get; set; }
        public DateTime? EndDateFrom { get; set; }
        public DateTime? EndDateTo { get; set; }
        public string? ScheduleType { get; set; }
        public string? Priority { get; set; }
        public string? Status { get; set; }
        public string? Search { get; set; }
    }

    public class VolunteerScheduleStatsDTO
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
        public Dictionary<string, int> SchedulesByType { get; set; } = new();
        public Dictionary<string, int> SchedulesByPriority { get; set; } = new();
        public List<VolunteerScheduleSummaryDTO> TopVolunteers { get; set; } = new();
    }

    public class VolunteerScheduleSummaryDTO
    {
        public int VolunteerId { get; set; }
        public string VolunteerName { get; set; } = string.Empty;
        public int ScheduleCount { get; set; }
        public int CompletedCount { get; set; }
        public decimal CompletionRate { get; set; }
        public string? RecentActivity { get; set; }
    }


}
