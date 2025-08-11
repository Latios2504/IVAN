namespace ivan_api.DTOs.CertificateTemplates
{
    public class CertificateTemplateInputModel
    {
        public string TemplateName { get; set; } = null!;

        public string? Description { get; set; }

        public string? TemplateType { get; set; }

        public string? TemplateDesign { get; set; }

        public string? RequiredFields { get; set; }

        public int? OrganizationId { get; set; }

        public bool? IsDefault { get; set; }

        public bool? IsActive { get; set; }

        //public int? CreatedBy { get; set; }

        //public DateTime? CreatedAt { get; set; }

        //public DateTime? UpdatedAt { get; set; }
    }
}
