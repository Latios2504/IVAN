namespace ivan_api.DTOs.CertificateTemplates
{
    public class CertificateTemplateUpdateModel
    {
        public int TemplateId { get; set; }
        public string TemplateName { get; set; } = null!;

        public string? Description { get; set; }

        public string? TemplateType { get; set; }

        public string? TemplateDesign { get; set; }

        public string? RequiredFields { get; set; }

        public int? OrganizationId { get; set; } // Will be auto-set by controller, but keep for AutoMapper

        public bool? IsDefault { get; set; }

        public bool? IsActive { get; set; }

        //public int? CreatedBy { get; set; }

        //public DateTime? CreatedAt { get; set; }

        //public DateTime? UpdatedAt { get; set; }
    }
}

