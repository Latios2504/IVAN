namespace ivan_api.DTOs.SupportRequest
{
    public class SupportCategoryDTO
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = null!;
        public string? Description { get; set; }
        public string Priority { get; set; } = null!;
        public int ExpectedResponseTime { get; set; }
        public bool IsActive { get; set; }
    }
}
