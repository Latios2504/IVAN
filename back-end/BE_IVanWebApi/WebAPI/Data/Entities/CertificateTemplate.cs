using System;
using System.Collections.Generic;

namespace WebAPI.Data.Entities;

public partial class CertificateTemplate
{
    public int TemplateId { get; set; }

    public string TemplateName { get; set; } = null!;

    public string? Description { get; set; }

    public string? TemplateType { get; set; }

    public string? TemplateDesign { get; set; }

    public string? RequiredFields { get; set; }

    public int? OrganizationId { get; set; }

    public bool? IsDefault { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();

    public virtual User? CreatedByNavigation { get; set; }

    public virtual Organization? Organization { get; set; }
}
