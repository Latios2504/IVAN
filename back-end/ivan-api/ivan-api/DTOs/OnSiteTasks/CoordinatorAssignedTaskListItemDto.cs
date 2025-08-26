namespace ivan_api.DTOs.OnSiteTasks
{
    public class CoordinatorAssignedTaskListItemDto
    {
        public int AssignmentId { get; set; }
        public int TaskId { get; set; }

        public int EventId { get; set; }
        public string EventName { get; set; }

        public string TaskName { get; set; }
        public string TaskStatusName { get; set; }   // tên trạng thái OnSiteTask

        public int VolunteerId { get; set; }
        public string VolunteerDisplay { get; set; } // tên/email rút gọn để hiển thị

        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string Location { get; set; }

        public string AssignmentStatus { get; set; } // trạng thái ở bảng TaskAssignments
    }
}
