using System.ComponentModel.DataAnnotations;

namespace ivan_api.DTOs.Certificates
{
    public class CertificateUpdateModel
    {
        [Required]
        public int CertificateId { get; set; }

        public string? CertificateName { get; set; }

        public string? Description { get; set; }

        public string? PerformanceLevel { get; set; }

        public DateTime? ExpiryDate { get; set; }

        public string? Status { get; set; }

        public decimal? HoursCompleted { get; set; }
    }
}
