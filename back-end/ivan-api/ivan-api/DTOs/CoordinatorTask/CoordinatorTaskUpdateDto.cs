namespace ivan_api.DTOs.CoordinatorTask
{
    public class CoordinatorTaskUpdateDto
    {
        public string? TaskName { get; set; }
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public string? Priority { get; set; }
        public string? Status { get; set; }           // (In Progress, Completed, etc.)
        public string? Category { get; set; }
        public decimal? EstimatedHours { get; set; }
        public decimal? ActualHours { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string? Notes { get; set; }
    }
}
