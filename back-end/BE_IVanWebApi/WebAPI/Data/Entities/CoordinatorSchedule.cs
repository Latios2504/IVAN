using System;
using System.Collections.Generic;

namespace WebAPI.Data.Entities;

public partial class CoordinatorSchedule
{
    public int ScheduleId { get; set; }

    public int CoordinatorId { get; set; }

    public int? EventId { get; set; }

    public string Title { get; set; } = null!;

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

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User Coordinator { get; set; } = null!;

    public virtual User? CreatedByNavigation { get; set; }

    public virtual Event? Event { get; set; }
}
