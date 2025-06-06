using System;
using System.Collections.Generic;

namespace WebAPI.Data.Entities;

public partial class Certificate
{
    public int CertificateId { get; set; }

    public int VolunteerId { get; set; }

    public int EventId { get; set; }

    public int TemplateId { get; set; }

    public string CertificateNumber { get; set; } = null!;

    public string CertificateName { get; set; } = null!;

    public string? Description { get; set; }

    public decimal? HoursCompleted { get; set; }

    public string? PerformanceLevel { get; set; }

    public DateTime? IssueDate { get; set; }

    public DateTime? ExpiryDate { get; set; }

    public string? CertificateFileUrl { get; set; }

    public string? DigitalSignature { get; set; }

    public string VerificationCode { get; set; } = null!;

    public string? QrcodeUrl { get; set; }

    public int? IssuedBy { get; set; }

    public string? Status { get; set; }

    public int? DownloadCount { get; set; }

    public DateTime? LastDownloadDate { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Event Event { get; set; } = null!;

    public virtual User? IssuedByNavigation { get; set; }

    public virtual CertificateTemplate Template { get; set; } = null!;

    public virtual VolunteerProfile Volunteer { get; set; } = null!;
}
