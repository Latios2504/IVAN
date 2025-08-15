namespace ivan_api.DTOs.CertificateTemplates
{
    public class CertificateTemplateFilterModel
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public int? OrganizationId { get; set; }
        public string? SearchTerm { get; set; }
    }
}
