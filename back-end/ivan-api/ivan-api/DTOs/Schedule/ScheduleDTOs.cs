namespace ivan_api.DTOs.Schedule
{
    public class ScheduleRequestDTO
    {
        public int CoordinatorId { get; set; } // UserId of Volunteer Coordinator (RoleId = 4)
        public int? EventId { get; set; } // Optional EventId
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public string? Location { get; set; }
        public string? ScheduleType { get; set; } // e.g., "Event", "Meeting"
        public string? Priority { get; set; } // e.g., "High", "Low"
        public string? Status { get; set; } // e.g., "Scheduled"
        public bool IsAllDay { get; set; } = false;
        public int ReminderMinutes { get; set; } = 60;
        public string? Notes { get; set; }
    }

    public class ScheduleDTO
    {
        public int ScheduleId { get; set; }
        public int CoordinatorId { get; set; }
        public string CoordinatorName { get; set; } = string.Empty;
        public int? EventId { get; set; }
        public string? EventName { get; set; }
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
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
