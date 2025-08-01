using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class VolunteerCoordinator
{
    public int CoordinatorId { get; set; }

    public int UserId { get; set; }

    public int OrganizationId { get; set; }

    public string? EmployeeId { get; set; }

    public string? Position { get; set; }

    public string? Department { get; set; }

    public string? Responsibilities { get; set; }

    public DateOnly? HireDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public decimal? Salary { get; set; }

    public int? ManagerId { get; set; }

    public bool? IsActive { get; set; }

    public string? Notes { get; set; }

    public int CreatedBy { get; set; }

    public int RequestedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User CreatedByNavigation { get; set; } = null!;

    public virtual User? Manager { get; set; }

    public virtual Organization Organization { get; set; } = null!;

    public virtual Organization RequestedByNavigation { get; set; } = null!;

    public virtual User User { get; set; } = null!;

    public virtual ICollection<CoordinatorSchedule> CoordinatorSchedules { get; set; } = new List<CoordinatorSchedule>();
}
