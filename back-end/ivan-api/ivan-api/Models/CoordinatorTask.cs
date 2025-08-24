using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class CoordinatorTask
{
    public int TaskId { get; set; }

    public int EventId { get; set; }

    public int CoordinatorId { get; set; }

    public string TaskName { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime? DueDate { get; set; }

    public string? Priority { get; set; }

    public string? Status { get; set; }

    public string? Category { get; set; }

    public decimal? EstimatedHours { get; set; }

    public decimal? ActualHours { get; set; }

    public DateTime? CompletedAt { get; set; }

    public string? Notes { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual VolunteerCoordinator Coordinator { get; set; } = null!;

    public virtual User? CreatedByNavigation { get; set; }

    public virtual Event Event { get; set; } = null!;
}
