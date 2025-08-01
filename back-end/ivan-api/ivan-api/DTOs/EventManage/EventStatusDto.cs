namespace ivan_api.DTOs.EventManage
{
    public class EventStatusDto
    {
        public int StatusId { get; set; }
        public string StatusName { get; set; } = default!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }
}
