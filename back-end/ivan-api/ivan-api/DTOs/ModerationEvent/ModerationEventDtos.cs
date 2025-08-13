using System;
using System.Collections.Generic;
namespace ivan_api.DTOs.ModerationEvent
{
    public class ModerationEventListDto
    {
        public int EventId { get; set; }
        public string EventName { get; set; }
        public string OrganizationName { get; set; }
        public DateTime SubmissionDate { get; set; }
    }

    public class ModerationEventDetailDto
    {
        public int EventId { get; set; }
        public string EventName { get; set; }
        public string OrganizationName { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class RejectEventRequestDto
    {
        public string Reason { get; set; }
    }
}
