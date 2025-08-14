namespace ivan_api.DTOs.EventRegistration
{
    public class EventDTO
    {
        public int EventId { get; set; }
        public string EventName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ShortDescription { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? RegistrationStartDate { get; set; }
        public DateTime? RegistrationEndDate { get; set; }
        public string Location { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public string StatusName { get; set; } = string.Empty;
    }

    public class RegistrationRequestDTO
    {
        public string AdditionalInfo { get; set; } = string.Empty;
        public string MotivationLetter { get; set; } = string.Empty;
    }

    public class RegistrationDTO
    {
        public int RegistrationId { get; set; }
        public int EventId { get; set; }
        public int VolunteerId { get; set; }
        public string StatusName { get; set; } = string.Empty;
        public DateTime? ApplicationDate { get; set; }
        public string? FullName { get; set; }
        public string? AdditionalInfo { get; set; }
        public string? MotivationLetter { get; set; }
    }

    public class RegistrationStatusDTO
    {
        public int RegistrationId { get; set; }
        public int EventId { get; set; }
        public int VolunteerId { get; set; }
        public string StatusName { get; set; } = string.Empty;
        public string? StatusColor { get; set; }
    }

    public class ApproveRegistrationRequestDTO
    {
        public string? Notes { get; set; }
    }

    public class RejectRegistrationRequestDTO
    {
        public string Reason { get; set; } = string.Empty;
    }
}
