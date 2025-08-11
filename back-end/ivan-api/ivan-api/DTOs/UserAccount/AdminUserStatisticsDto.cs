namespace ivan_api.DTOs.UserAccount
{
    public class AdminUserStatisticsDto
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int InactiveUsers { get; set; }
        public int UnverifiedUsers { get; set; }
        public Dictionary<string, int> UsersByRole { get; set; } = new Dictionary<string, int>();
    }
}
