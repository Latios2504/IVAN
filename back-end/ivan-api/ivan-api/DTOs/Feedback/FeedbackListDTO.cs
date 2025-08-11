namespace ivan_api.DTOs.Feedback
{
    public class FeedbackListDTO
    {
        public int FeedbackId { get; set; }

        public int EventId { get; set; }

        public int UserId { get; set; }

        public int CategoryId { get; set; }
        public string? CategoryName { get; set; } = null!;

        public string Subject { get; set; } = null!;

        public string Content { get; set; } = null!;

        public int? Rating { get; set; }

        public bool? IsAnonymous { get; set; }

        public string? Status { get; set; }
    }
}
