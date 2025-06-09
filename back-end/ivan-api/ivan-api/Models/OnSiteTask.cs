using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class OnSiteTask
{
    public int TaskId { get; set; }

    public int EventId { get; set; }

    public int CategoryId { get; set; }

    public int StatusId { get; set; }

    public string TaskName { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public decimal? EstimatedHours { get; set; }

    public decimal? ActualHours { get; set; }

    public string? Location { get; set; }

    public int? RequiredVolunteers { get; set; }

    public int? AssignedVolunteers { get; set; }

    public string? RequiredSkills { get; set; }

    public string? Priority { get; set; }

    public string? Difficulty { get; set; }

    public string? Instructions { get; set; }

    public string? Materials { get; set; }

    public string? SafetyRequirements { get; set; }

    public string? CompletionCriteria { get; set; }

    public DateTime? CompletedAt { get; set; }

    public int? CompletedBy { get; set; }

    public int? VerifiedBy { get; set; }

    public string? Notes { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual TaskCategory Category { get; set; } = null!;

    public virtual User? CompletedByNavigation { get; set; }

    public virtual User? CreatedByNavigation { get; set; }

    public virtual Event Event { get; set; } = null!;

    public virtual TaskStatus Status { get; set; } = null!;

    public virtual ICollection<TaskAssignment> TaskAssignments { get; set; } = new List<TaskAssignment>();

    public virtual User? VerifiedByNavigation { get; set; }
}
