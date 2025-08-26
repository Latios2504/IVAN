namespace ivan_api.DTOs.CoordinatorTask
{
    public class VolunteerOnSiteTaskDto
    {
        public int TaskAssignmentId { get; set; }
        public int OnSiteTaskId { get; set; }

        public int? EventId { get; set; }
        public string EventName { get; set; }

        public string TaskName { get; set; }
        public string Description { get; set; }

        public int StatusId { get; set; }
        public string StatusName { get; set; }

        public string Location { get; set; }

        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public double? EstimatedHours { get; set; }

        // Thông tin từ TaskAssignments
        public string AssignmentStatus { get; set; }
        public string AssignmentNotes { get; set; }
    }
}
