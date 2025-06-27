using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class EventRegistration
{
    public int RegistrationId { get; set; }

    public int EventId { get; set; }

    public int VolunteerId { get; set; }

    public int StatusId { get; set; }

    public DateTime? ApplicationDate { get; set; }

    public DateTime? ApprovedDate { get; set; }

    public int? ApprovedBy { get; set; }

    public DateTime? RejectedDate { get; set; }

    public int? RejectedBy { get; set; }

    public string? RejectionReason { get; set; }

    public DateTime? CancelledDate { get; set; }

    public string? CancellationReason { get; set; }

    public string? MotivationLetter { get; set; }

    public string? AdditionalInfo { get; set; }

    public string? AttendanceStatus { get; set; }

    public DateTime? CheckInTime { get; set; }

    public DateTime? CheckOutTime { get; set; }

    public decimal? ActualHours { get; set; }

    public string? Performance { get; set; }

    public string? PerformanceNotes { get; set; }

    public bool? CertificateIssued { get; set; }

    public DateTime? CertificateIssuedDate { get; set; }

    public int? Rating { get; set; }

    public string? Review { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    // Additional properties for AI features
    public DateTime? RegistrationDate { get; set; }

    public virtual User? ApprovedByNavigation { get; set; }

    public virtual Event Event { get; set; } = null!;

    public virtual User? RejectedByNavigation { get; set; }

    public virtual RegistrationStatus Status { get; set; } = null!;

    public virtual VolunteerProfile Volunteer { get; set; } = null!;
}
