namespace WebAPI.Models.Reports
{
    public class ReportInputModel
    {
        //public string ReportType { get; set; } = null!;

        public string Content { get; set; } = null!;

        public DateTime? GeneratedDate { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}
