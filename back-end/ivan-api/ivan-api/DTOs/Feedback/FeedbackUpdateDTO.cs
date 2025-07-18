namespace ivan_api.DTOs.Feedback
{
    public class FeedbackUpdateDTO
    {
        public int idFeedback { get; set; }
        public string? Content { get; set; } = null!;
    }
}
