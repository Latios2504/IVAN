using ivan_api.DTOs.OnSiteTasks;

namespace ivan_api.DTOs.TaskAssignments
{
    public class MyTaskAssignmentDto
    {
        // TaskAssignment properties
        public int AssignmentId { get; set; }
        public int TaskId { get; set; }
        public int VolunteerId { get; set; }
        public DateTime? AssignedDate { get; set; }
        public int? AssignedBy { get; set; }
        public string? AssignmentStatus { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public decimal? HoursWorked { get; set; }
        public string? Performance { get; set; }
        public string? AssignmentNotes { get; set; }
        public DateTime? AssignmentCreatedAt { get; set; }
        public DateTime? AssignmentUpdatedAt { get; set; }

        // OnSiteTask properties
        public string TaskName { get; set; } = string.Empty;
        public string? TaskDescription { get; set; }
        public int EventId { get; set; }
        public string? EventName { get; set; }
        public int? LocationId { get; set; }
        public string? LocationName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int EstimatedHours { get; set; }
        public int? ActualHours { get; set; }
        public int StatusId { get; set; }
        public string? StatusName { get; set; }
        public int? PriorityId { get; set; }
        public string? PriorityName { get; set; }
        public string? TaskNotes { get; set; }
        public DateTime TaskCreatedAt { get; set; }
        public DateTime? TaskUpdatedAt { get; set; }

        // Additional info
        public string? AssignedByName { get; set; }
        public string? VolunteerName { get; set; }
    }
}