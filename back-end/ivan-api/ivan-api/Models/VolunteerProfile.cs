using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class VolunteerProfile
{
    public int VolunteerId { get; set; }

    public int UserId { get; set; }

    public string? StudentId { get; set; }

    public string? University { get; set; }

    public string? Major { get; set; }

    public int? YearOfStudy { get; set; }

    public string? Motivation { get; set; }

    public string? Experience { get; set; }

    public string? Availability { get; set; }

    public int? VolunteerHours { get; set; }

    public decimal? Rating { get; set; }

    public int? RatingCount { get; set; }

    public bool? IsVerified { get; set; }

    public DateTime? VerifiedAt { get; set; }

    public int? VerifiedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    // Additional properties for AI features
    public DateTime? LastActiveDate { get; set; }
    
    public int? TotalHoursVolunteered { get; set; }
    
    public string? Skills { get; set; }

    public virtual ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();

    public virtual ICollection<EventRegistration> EventRegistrations { get; set; } = new List<EventRegistration>();

    public virtual ICollection<TaskAssignment> TaskAssignments { get; set; } = new List<TaskAssignment>();

    public virtual User User { get; set; } = null!;

    public virtual User? VerifiedByNavigation { get; set; }

    public virtual ICollection<VolunteerSchedule> VolunteerSchedules { get; set; } = new List<VolunteerSchedule>();

    public virtual ICollection<VolunteerSkill> VolunteerSkills { get; set; } = new List<VolunteerSkill>();
}
