using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.Eventing.Reader;

namespace WebAPI.Data_old.Entities
{
    //[Table("events")]
    public class Event
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int OrganizationId { get; set; }

        public int? CategoryId { get; set; }
        [Required]
        [MaxLength(300)]
        public string Title { get; set; } = null!;
        [MaxLength(1000)]
        public string? Description { get; set; }
        [MaxLength(1000)]
        public string? Objectives { get; set; }
        [MaxLength(500)]
        public string? Location { get; set; }
        [MaxLength(1000)]
        public string? Address { get; set; }
        [MaxLength(100)]
        public string? City { get; set; }
        [MaxLength(100)]
        public string? State { get; set; }
        [MaxLength(20)]
        public string? PostalCode { get; set; }
        [MaxLength(100)]
        public string? Country { get; set; }

        public decimal? Latitude { get; set; }

        public decimal? Longitude { get; set; }
        [Required]
        public DateOnly StartDate { get; set; }
        [Required]
        public DateOnly EndDate { get; set; }

        public TimeOnly? StartTime { get; set; }

        public TimeOnly? EndTime { get; set; }

        public DateOnly? RegistrationStartDate { get; set; }

        public DateOnly? RegistrationEndDate { get; set; }

        public int? MaxVolunteers { get; set; }

        public int? MinVolunteers { get; set; }

        public int? CurrentVolunteers { get; set; }
        [MaxLength(50)]
        public string? Status { get; set; }
        [MaxLength(50)]
        public string? Visibility { get; set; }
        [MaxLength(1000)]
        public string? Requirements { get; set; }
        [MaxLength(1000)]
        public string? Benefits { get; set; }
        [MaxLength(1000)]
        public string? MaterialsProvided { get; set; }
        [MaxLength(1000)]
        public string? WhatToBring { get; set; }

        public int? AgeRequirementMin { get; set; }

        public int? AgeRequirementMax { get; set; }
        [MaxLength(1000)]
        public string? SkillRequirements { get; set; }
        [MaxLength(1000)]
        public string? PhysicalRequirements { get; set; }

        public bool? BackgroundCheckRequired { get; set; }

        public bool? TransportationProvided { get; set; }

        public bool? MealsProvided { get; set; }

        public bool? AccommodationProvided { get; set; }

        public bool? InsuranceProvided { get; set; }

        public bool? CertificateProvided { get; set; }
        [MaxLength(500)]
        public string? CoverImageUrl { get; set; }
        [MaxLength(1000)]
        public string? GalleryImages { get; set; }
        [MaxLength(255)]
        public string? ContactEmail { get; set; }
        [MaxLength(20)]
        public string? ContactPhone { get; set; }
        [MaxLength(200)]
        public string? EmergencyContact { get; set; }
        [MaxLength(1000)]
        public string? Tags { get; set; }

        public bool? IsRecurring { get; set; }
        [MaxLength(100)]
        public string? RecurringPattern { get; set; }

        public int? ParentEventId { get; set; }
        [MaxLength(1000)]
        public string? EstimatedImpact { get; set; }

        public decimal? Budget { get; set; }

        public decimal? FundraisingGoal { get; set; }

        public decimal? CurrentFundsRaised { get; set; }
        [MaxLength(50)]
        public string? ApprovalStatus { get; set; }

        public int? ApprovedBy { get; set; }

        public DateTime? ApprovedAt { get; set; }
        [MaxLength(1000)]
        public string? RejectionReason { get; set; }
        [Required]
        public int CreatedBy { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }


        public virtual User? ApprovedByNavigation { get; set; }

        //public virtual EventCategory? Category { get; set; }

        //public virtual ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();

        //public virtual ICollection<CoordinatorTask> CoordinatorTasks { get; set; } = new List<CoordinatorTask>();

        //public virtual User CreatedByNavigation { get; set; } = null!;
        //public virtual ICollection<EventReport> EventReports { get; set; } = new List<EventReport>();

        //public virtual ICollection<EventSchedule> EventSchedules { get; set; } = new List<EventSchedule>();

        //public virtual ICollection<EventSkillRequirement> EventSkillRequirements { get; set; } = new List<EventSkillRequirement>();

        //public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

        //public virtual ICollection<Event> InverseParentEvent { get; set; } = new List<Event>();

        //public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

        //public virtual ICollection<OnsiteTask> OnsiteTasks { get; set; } = new List<OnsiteTask>();

        //public virtual OrganizationProfile Organization { get; set; } = null!;

        //public virtual Event? ParentEvent { get; set; }

        //public virtual ICollection<PartnerCollaboration> PartnerCollaborations { get; set; } = new List<PartnerCollaboration>();

        //public virtual ICollection<SupportRequest> SupportRequests { get; set; } = new List<SupportRequest>();

        //public virtual ICollection<VolunteerRegistration> VolunteerRegistrations { get; set; } = new List<VolunteerRegistration>();

        //public virtual ICollection<EventTag> TagsNavigation { get; set; } = new List<EventTag>();
    }
}
