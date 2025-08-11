namespace ivan_api.DTOs.Reports
{
    public class ReportViewModel
    {
        public int ReportId { get; set; }

        public string ReportType { get; set; } = null!;

        public string Content { get; set; } = null!;

        public DateTime? GeneratedDate { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}
