using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class Event
{
    public int EventId { get; set; }

    public int OrganizationId { get; set; }

    public string EventName { get; set; } = null!;

    public int CategoryId { get; set; }

    public int StatusId { get; set; }

    public string? Description { get; set; }

    public string? ShortDescription { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public DateTime? RegistrationStartDate { get; set; }

    public DateTime? RegistrationEndDate { get; set; }

    public string? Location { get; set; }

    public string? DetailedAddress { get; set; }

    public string? WardCommune { get; set; }

    public string? District { get; set; }

    public string? Province { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public int? MaxVolunteers { get; set; }

    public int? MinVolunteers { get; set; }

    public int? CurrentVolunteers { get; set; }

    public string? RequiredSkills { get; set; }

    public string? AgeRequirement { get; set; }

    public string? GenderRequirement { get; set; }

    public string? Requirements { get; set; }

    public string? Benefits { get; set; }

    public string? ContactPerson { get; set; }

    public string? ContactPhone { get; set; }

    public string? ContactEmail { get; set; }

    public string? BannerImageUrl { get; set; }

    public string? GalleryImages { get; set; }

    public bool? IsFeatured { get; set; }

    public bool? IsUrgent { get; set; }

    public int? Priority { get; set; }

    public int? ViewCount { get; set; }

    public int? RegistrationCount { get; set; }

    public int? CompletedVolunteers { get; set; }

    public decimal? Rating { get; set; }

    public int? RatingCount { get; set; }

    public decimal? Budget { get; set; }

    public string? Currency { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    // Additional properties for AI features
    public string? EventType { get; set; }
    
    public int? MaxParticipants { get; set; }
    
    public int? CreatedByUserId { get; set; }

    public virtual EventCategory Category { get; set; } = null!;

    public virtual ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();

    public virtual ICollection<CoordinatorSchedule> CoordinatorSchedules { get; set; } = new List<CoordinatorSchedule>();

    public virtual ICollection<CoordinatorTask> CoordinatorTasks { get; set; } = new List<CoordinatorTask>();

    public virtual User? CreatedByNavigation { get; set; }

    public virtual ICollection<EventRegistration> EventRegistrations { get; set; } = new List<EventRegistration>();

    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    public virtual ICollection<OnSiteTask> OnSiteTasks { get; set; } = new List<OnSiteTask>();

    public virtual Organization Organization { get; set; } = null!;

    public virtual EventStatus Status { get; set; } = null!;

    public virtual User? UpdatedByNavigation { get; set; }

    public virtual ICollection<VolunteerSchedule> VolunteerSchedules { get; set; } = new List<VolunteerSchedule>();
}
