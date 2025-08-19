namespace ivan_api.DTOs.NotificationServ
{
    public class NotificationDTO
    {
        public int NotificationId { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public DateTime? SendDate { get; set; }
        public bool? IsRead { get; set; }
    }

    public class SendNotificationDTO
    {
        public int UserId { get; set; }
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
    }

    public class NotificationPreferenceDTO
    {
        public bool ReceiveEmail { get; set; }
        public bool ReceiveWeb { get; set; }
    }


}
