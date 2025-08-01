namespace ivan_api.DTOs.EventManage
{
    public class EventCategoryDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = default!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }
}
