namespace ivan_api.DTOs.CoordinatorTask
{
    public class CoordinatorTaskFilterDto
    {
        // Paging
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;

        // Sorting
        public string? SortBy { get; set; } = "DueDate"; // DueDate|CreatedAt|TaskName|Priority|Status
        public string? SortDirection { get; set; } = "desc"; // asc|desc

        // Filters
        public int? CoordinatorId { get; set; }
        public int? EventId { get; set; }
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public DateTime? DueFrom { get; set; }
        public DateTime? DueTo { get; set; }
        public string? Search { get; set; } // tìm theo TaskName/Description
    }
}
