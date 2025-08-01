namespace ivan_api.DTOs.EventManage
{
    public class EventStatsDto
    {
        public int TotalEvents { get; set; }
        public int PlanningEvents { get; set; }
        public int ActiveEvents { get; set; }
        public int InProgressEvents { get; set; }
        public int CompletedEvents { get; set; }
        public int CancelledEvents { get; set; }
        public int TotalVolunteers { get; set; }
        public int TotalRegistrations { get; set; }
        public decimal AverageRating { get; set; }
        public int UpcomingEventsThisMonth { get; set; }
        public decimal RegistrationRate { get; set; }
        public Dictionary<string, int> EventsByCategory { get; set; } = new();
        public Dictionary<string, int> EventsByMonth { get; set; } = new();
    }
}
