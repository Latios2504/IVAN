namespace ivan_api.DTOs.SupportRequest
{
    public class SupportRequestResponseDTO
    {
        public int RequestId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string UserEmail { get; set; } = null!;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = null!;
        public string Subject { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Priority { get; set; } = null!;
        public string Status { get; set; } = null!;
        public int? AssignedTo { get; set; }
        public string? AssignedToName { get; set; }
        public DateTime? AssignedDate { get; set; }
        public string? Resolution { get; set; }
        public int? ResolvedBy { get; set; }
        public string? ResolvedByName { get; set; }
        public DateTime? ResolvedDate { get; set; }
        public int? SatisfactionRating { get; set; }
        public string? SatisfactionFeedback { get; set; }
        public List<string>? AttachmentUrls { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<SupportRequestCommentDTO>? Comments { get; set; }
    }
}
