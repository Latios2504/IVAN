namespace ivan_api.DTOs.Certificates
{
    public class CertificateFilterModel
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public int? OrganizationId { get; set; }
        public string? Status { get; set; }
        public int? VolunteerId { get; set; }
        public int? EventId { get; set; }
        public string? SearchTerm { get; set; }
        public DateTime? IssuedDateFrom { get; set; }
        public DateTime? IssuedDateTo { get; set; }
    }
}
