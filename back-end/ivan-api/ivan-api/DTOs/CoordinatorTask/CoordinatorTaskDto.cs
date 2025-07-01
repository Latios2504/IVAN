namespace ivan_api.DTOs.CoordinatorTask
{
    public class CoordinatorTaskDto
    {
        public int EventId { get; set; }
        public int CoordinatorId { get; set; }
        public string TaskName { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public string? Priority { get; set; }
        public string? Status { get; set; }
        public string? Category { get; set; }
        public decimal? EstimatedHours { get; set; }
        public decimal? ActualHours { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string? Notes { get; set; }
    }
}
