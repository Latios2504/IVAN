namespace ivan_api.DTOs.EventManage
{
    public class EventDto
    {
        public int EventId { get; set; }
        public int OrganizationId { get; set; }
        public string EventName { get; set; } = default!;
        public int CategoryId { get; set; }
        public int StatusId { get; set; }
        public string ShortDescription { get; set; } = default!;
        public string Description { get; set; } = default!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Location { get; set; } = default!;
    }
}
