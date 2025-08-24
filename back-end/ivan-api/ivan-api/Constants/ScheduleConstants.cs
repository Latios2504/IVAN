namespace ivan_api.Constants
{
    /// <summary>
    /// Constants for Schedule Status Lifecycle Management
    /// Defines the valid status transitions for both Coordinator and Volunteer Schedules
    /// </summary>
    public static class ScheduleConstants
    {
        /// <summary>
        /// Schedule Status Values
        /// </summary>
        public static class Status
        {
            public const string Draft = "Draft";
            public const string Scheduled = "Scheduled";
            public const string InProgress = "In Progress";
            public const string Completed = "Completed";
            public const string Cancelled = "Cancelled";
            public const string NoShow = "No Show";
            public const string CheckedIn = "Checked In";
        }

        /// <summary>
        /// Schedule Types
        /// </summary>
        public static class Type
        {
            public const string Event = "Event";
            public const string Meeting = "Meeting";
            public const string Training = "Training";
            public const string Other = "Other";
        }

        /// <summary>
        /// Schedule Priorities
        /// </summary>
        public static class Priority
        {
            public const string High = "High";
            public const string Medium = "Medium";
            public const string Low = "Low";
        }

        /// <summary>
        /// Valid Status Transitions for Schedule Lifecycle
        /// Key: Current Status, Value: List of allowed next statuses
        /// </summary>
        public static readonly Dictionary<string, List<string>> ValidStatusTransitions = new()
        {
            { Status.Draft, new List<string> { Status.Scheduled, Status.Cancelled } },
            { Status.Scheduled, new List<string> { Status.CheckedIn, Status.InProgress, Status.Cancelled, Status.NoShow } },
            { Status.CheckedIn, new List<string> { Status.InProgress, Status.Completed, Status.Cancelled } },
            { Status.InProgress, new List<string> { Status.Completed, Status.Cancelled } },
            { Status.Completed, new List<string>() }, // Terminal state
            { Status.Cancelled, new List<string>() }, // Terminal state
            { Status.NoShow, new List<string>() } // Terminal state
        };

        /// <summary>
        /// Checks if a status transition is valid
        /// </summary>
        /// <param name="currentStatus">Current schedule status</param>
        /// <param name="newStatus">Desired new status</param>
        /// <returns>True if transition is valid, false otherwise</returns>
        public static bool IsValidStatusTransition(string? currentStatus, string newStatus)
        {
            if (string.IsNullOrEmpty(currentStatus) || string.IsNullOrEmpty(newStatus))
                return false;

            return ValidStatusTransitions.ContainsKey(currentStatus) &&
                   ValidStatusTransitions[currentStatus].Contains(newStatus, StringComparer.OrdinalIgnoreCase);
        }

        /// <summary>
        /// Gets all valid statuses
        /// </summary>
        public static List<string> GetAllStatuses()
        {
            return new List<string>
            {
                Status.Draft,
                Status.Scheduled,
                Status.CheckedIn,
                Status.InProgress,
                Status.Completed,
                Status.Cancelled,
                Status.NoShow
            };
        }

        /// <summary>
        /// Gets terminal statuses (no further transitions allowed)
        /// </summary>
        public static List<string> GetTerminalStatuses()
        {
            return new List<string>
            {
                Status.Completed,
                Status.Cancelled,
                Status.NoShow
            };
        }

        /// <summary>
        /// Gets active statuses (schedule is ongoing)
        /// </summary>
        public static List<string> GetActiveStatuses()
        {
            return new List<string>
            {
                Status.Scheduled,
                Status.CheckedIn,
                Status.InProgress
            };
        }
    }
}