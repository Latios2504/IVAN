using System.ComponentModel.DataAnnotations;

namespace ivan_api.DTOs.Certificates
{
    public class BulkCertificateActionModel
    {
        [Required]
        public List<int> CertificateIds { get; set; } = new List<int>();
        
        public string? Reason { get; set; }
        
        public int? ApprovedBy { get; set; }
    }

    public class CertificateApprovalModel
    {
        [Required]
        public int CertificateId { get; set; }
        
        public string? ApprovalNotes { get; set; }
        
        public int? ApprovedBy { get; set; }
    }

    public class CertificateRejectionModel
    {
        [Required]
        public int CertificateId { get; set; }
        
        [Required]
        public string RejectionReason { get; set; } = string.Empty;
        
        public int? RejectedBy { get; set; }
    }
}
