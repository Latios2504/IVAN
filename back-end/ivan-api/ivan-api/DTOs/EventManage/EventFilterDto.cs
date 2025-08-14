namespace ivan_api.DTOs.EventManage
{
    public class EventFilterDto
    {
        public string? Search { get; set; }
        public int? OrganizationId { get; set; } // For organization-specific filtering
        public List<int>? CategoryIds { get; set; }
        public List<int>? StatusIds { get; set; }
        public DateTime? StartDateFrom { get; set; }
        public DateTime? StartDateTo { get; set; }
        public DateTime? EndDateFrom { get; set; }
        public DateTime? EndDateTo { get; set; }
        public string? Province { get; set; }
        public string? District { get; set; }
        public bool? IsFeatured { get; set; }
        public bool? IsUrgent { get; set; }
        public bool? IsActive { get; set; } // For admin/organization to filter by active status
        public int? MinVolunteers { get; set; }
        public int? MaxVolunteers { get; set; }
        public int Page { get; set; } = 1;
        public int Size { get; set; } = 20;
        public string SortBy { get; set; } = "CreatedAt";
        public string SortDirection { get; set; } = "desc";
    }
}
