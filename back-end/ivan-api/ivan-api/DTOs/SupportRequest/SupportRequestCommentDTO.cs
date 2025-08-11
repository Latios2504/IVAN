namespace ivan_api.DTOs.SupportRequest
{
    public class SupportRequestCommentDTO
    {
        public int CommentId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string Comment { get; set; } = null!;
        public bool IsInternal { get; set; }
        public List<string>? AttachmentUrls { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
