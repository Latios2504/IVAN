namespace ivan_api.DTOs.Feedback
{
    public class FeedbackCreateDTO
    {
        public int EventId { get; set; }
        public int UserId { get; set; } // Sẽ được gán từ token, không lấy từ client
        public int CategoryId { get; set; }
        public string Subject { get; set; } = null!;
        public string Content { get; set; } = null!;
        public int? Rating { get; set; }
        public bool? IsAnonymous { get; set; }
        public bool? IsPublic { get; set; }
        public string? AttachmentUrls { get; set; }

    }
}
