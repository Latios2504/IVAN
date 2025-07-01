namespace ivan_api.DTOs.SupportRequest
{
    public class AddSupportRequestDto
    {
        public int CategoryId { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public string Priority { get; set; } = "Medium";
        public string[] AttachmentUrls { get; set; }
    }

    public class SupportRequestDto
    {
        public int RequestId { get; set; }
        public int UserId { get; set; }
        public string CategoryName { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public string Priority { get; set; }
        public string Status { get; set; }
        public int? AssignedTo { get; set; }
        public DateTime? AssignedDate { get; set; }
        public string Resolution { get; set; }
        public int? ResolvedBy { get; set; }
        public DateTime? ResolvedDate { get; set; }
        public int? SatisfactionRating { get; set; }
        public string SatisfactionFeedback { get; set; }
        public string[] AttachmentUrls { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class UpdateSupportRequestDto
    {
        public string Status { get; set; }
        public int? AssignedTo { get; set; }
        public string Resolution { get; set; }
        public int? SatisfactionRating { get; set; }
        public string SatisfactionFeedback { get; set; }
    }
}
