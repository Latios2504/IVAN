namespace ivan_api.DTOs.CoordinatorRequests
{
    public class CoordinatorRequestListItemDto
    {
        public string RequestId { get; set; } = default!;
        public int OrganizationId { get; set; }
        public string CandidateEmail { get; set; } = default!;
        public string Status { get; set; } = default!;
        public DateTime SubmittedAt { get; set; }
    }
}
