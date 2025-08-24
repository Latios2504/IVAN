namespace ivan_api.DTOs.OnSiteTasks
{
    public class OnSiteTaskFilterModel
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public int? EventId { get; set; }
        public int? CategoryId { get; set; }
        public int? StatusId { get; set; }

        public DateTime? StartTimeFrom { get; set; }
        public DateTime? StartTimeTo { get; set; }
        public DateTime? EndTimeFrom { get; set; }
        public DateTime? EndTimeTo { get; set; }
        public DateTime? CompletedFrom { get; set; }
        public DateTime? CompletedTo { get; set; }

        public string? SearchTerm { get; set; }
    }
}
