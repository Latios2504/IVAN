namespace ivan_api.DTOs.UserAccount
{
    public class UserStatisticsDto
    {

        public int? TotalEventsJoined { get; set; }
        public int? TotalEventsCompleted { get; set; }
        public int? TotalCollaborations { get; set; }
        public int? TotalHoursVolunteered { get; set; }
        public decimal? Rating { get; set; }
        public int? TotalRatings { get; set; }
        public DateTime? LastActivityAt { get; set; }
        public int? DaysSinceLastLogin => LastActivityAt.HasValue ? (DateTime.Now - LastActivityAt.Value).Days : 0;
    }
}