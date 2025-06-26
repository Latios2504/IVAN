namespace ivan_api.DTOs.CoordinatorTask
{
    public class CoordinatorTaskCreateDto
    {
        public int EventId { get; set; }
        public int CoordinatorId { get; set; }
        public string TaskName { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public string? Priority { get; set; }
        public string? Category { get; set; }
        public decimal? EstimatedHours { get; set; }
    }
}
