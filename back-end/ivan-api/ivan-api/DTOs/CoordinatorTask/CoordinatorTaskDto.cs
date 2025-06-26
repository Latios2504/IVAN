namespace ivan_api.DTOs.CoordinatorTask
{
    public class CoordinatorTaskDto
    {
        public int TaskId { get; set; }
        public string TaskName { get; set; } = null!;
        public string? CoordinatorName { get; set; }  // Ghép từ User.Email hoặc FullName
        public string? EventName { get; set; }
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public string? Category { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}
