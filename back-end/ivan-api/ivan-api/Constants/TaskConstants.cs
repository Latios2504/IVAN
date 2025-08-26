namespace ivan_api.Constants
{
    /// <summary>
    /// Constants for Task Status Lifecycle Management
    /// Defines the valid status transitions for Coordinator Tasks
    /// </summary>
    public static class TaskConstants
    {
        /// <summary>
        /// Task Status Values (English for database storage)
        /// </summary>
        public static class Status
        {
            public const string Assigned = "Assigned";
            public const string InProgress = "In Progress";
            public const string Completed = "Completed";
            public const string OnHold = "On Hold";
            public const string Cancelled = "Cancelled";
        }

        /// <summary>
        /// Task Priorities
        /// </summary>
        public static class Priority
        {
            public const string High = "High";
            public const string Medium = "Medium";
            public const string Low = "Low";
        }

        /// <summary>
        /// Valid Status Transitions for Task Lifecycle
        /// Key: Current Status, Value: List of allowed next statuses
        /// Updated: Proper workflow - Assigned → InProgress → Completed
        /// </summary>
        public static readonly Dictionary<string, List<string>> ValidStatusTransitions = new()
        {
            { Status.Assigned, new List<string> { Status.InProgress, Status.OnHold, Status.Cancelled } },
            { Status.InProgress, new List<string> { Status.Completed, Status.OnHold, Status.Cancelled } },
            { Status.OnHold, new List<string> { Status.InProgress, Status.Cancelled } },
            { Status.Completed, new List<string>() }, // Terminal state
            { Status.Cancelled, new List<string>() } // Terminal state
        };

        /// <summary>
        /// Checks if a status transition is valid
        /// </summary>
        /// <param name="currentStatus">Current task status</param>
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
                Status.Assigned,
                Status.InProgress,
                Status.OnHold,
                Status.Completed,
                Status.Cancelled
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
                Status.Cancelled
            };
        }

        /// <summary>
        /// Gets active statuses (task is ongoing)
        /// </summary>
        public static List<string> GetActiveStatuses()
        {
            return new List<string>
            {
                Status.Assigned,
                Status.InProgress,
                Status.OnHold
            };
        }

        /// <summary>
        /// Gets the default initial status for new tasks
        /// </summary>
        public static string GetDefaultStatus()
        {
            return Status.Assigned;
        }
    }
}