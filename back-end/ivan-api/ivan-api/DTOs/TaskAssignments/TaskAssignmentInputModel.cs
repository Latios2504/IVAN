using ivan_api.Models;

namespace ivan_api.DTOs.TaskAssignments
{
    public class TaskAssignmentInputModel
    {
        //public int AssignmentId { get; set; }

        public int TaskId { get; set; }

        public int VolunteerId { get; set; }

        public DateTime? AssignedDate { get; set; }

        //public int? AssignedBy { get; set; }

        public string? Status { get; set; }

        public DateTime? StartedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        public decimal? HoursWorked { get; set; }

        public string? Performance { get; set; }

        public string? Notes { get; set; }

        //public DateTime? CreatedAt { get; set; }

        //public DateTime? UpdatedAt { get; set; }

        //public virtual User? AssignedByNavigation { get; set; }

        //public virtual OnSiteTask Task { get; set; } = null!;

        //public virtual VolunteerProfile Volunteer { get; set; } = null!;
    }
}
