namespace ivan_api.DTOs.Certificates
{
    public class CertificateInputModel
    {
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
    }
}
