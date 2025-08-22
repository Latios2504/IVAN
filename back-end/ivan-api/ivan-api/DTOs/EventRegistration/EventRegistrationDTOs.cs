using System.ComponentModel.DataAnnotations;

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
        [StringLength(1000, ErrorMessage = "Additional info cannot exceed 1000 characters")]
        public string AdditionalInfo { get; set; } = string.Empty;
        
        [StringLength(2000, ErrorMessage = "Motivation letter cannot exceed 2000 characters")]
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

    public class CheckInRequestDTO
    {
        public string? Notes { get; set; }
        public string? Location { get; set; }
    }

    public class CheckOutRequestDTO
    {
        public string? Notes { get; set; }
        public string? Feedback { get; set; }
    }

    public class AttendanceDTO
    {
        public int RegistrationId { get; set; }
        public int EventId { get; set; }
        public int VolunteerId { get; set; }
        public string? VolunteerName { get; set; }
        public string AttendanceStatus { get; set; } = string.Empty;
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public decimal? ActualHours { get; set; }
        public string StatusName { get; set; } = string.Empty;
    }

    public class ApproveRegistrationRequestDTO
    {
        public string? Notes { get; set; }
    }

    public class RejectRegistrationRequestDTO
    {
        [Required(ErrorMessage = "Rejection reason is required")]
        [StringLength(1000, ErrorMessage = "Reason cannot exceed 1000 characters")]
        public string Reason { get; set; } = string.Empty;
    }
}
