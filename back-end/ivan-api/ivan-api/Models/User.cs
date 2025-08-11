using System;
using System.Collections.Generic;

namespace ivan_api.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string Salt { get; set; } = null!;

    public int RoleId { get; set; }

    public bool? IsActive { get; set; }

    public bool? IsEmailVerified { get; set; }

    public string? EmailVerificationToken { get; set; }

    public string? PasswordResetToken { get; set; }

    public DateTime? PasswordResetExpiry { get; set; }

    public DateTime? LastLoginAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<CertificateTemplate> CertificateTemplates { get; set; } = new List<CertificateTemplate>();

    public virtual ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();

    public virtual ICollection<ChatbotInteraction> ChatbotInteractions { get; set; } = new List<ChatbotInteraction>();

    public virtual ICollection<CoordinatorSchedule> CoordinatorSchedules { get; set; } = new List<CoordinatorSchedule>();

    public virtual ICollection<CoordinatorTask> CoordinatorTaskCoordinators { get; set; } = new List<CoordinatorTask>();

    public virtual ICollection<CoordinatorTask> CoordinatorTaskCreatedByNavigations { get; set; } = new List<CoordinatorTask>();

    public virtual ICollection<Event> EventCreatedByNavigations { get; set; } = new List<Event>();

    public virtual ICollection<EventRegistration> EventRegistrationApprovedByNavigations { get; set; } = new List<EventRegistration>();

    public virtual ICollection<EventRegistration> EventRegistrationRejectedByNavigations { get; set; } = new List<EventRegistration>();

    public virtual ICollection<Event> EventUpdatedByNavigations { get; set; } = new List<Event>();

    public virtual ICollection<Feedback> FeedbackRespondedByNavigations { get; set; } = new List<Feedback>();

    public virtual ICollection<Feedback> FeedbackUsers { get; set; } = new List<Feedback>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<OnSiteTask> OnSiteTaskCompletedByNavigations { get; set; } = new List<OnSiteTask>();

    public virtual ICollection<OnSiteTask> OnSiteTaskCreatedByNavigations { get; set; } = new List<OnSiteTask>();

    public virtual ICollection<OnSiteTask> OnSiteTaskVerifiedByNavigations { get; set; } = new List<OnSiteTask>();

    public virtual ICollection<Organization> OrganizationUsers { get; set; } = new List<Organization>();

    public virtual ICollection<Organization> OrganizationVerifiedByNavigations { get; set; } = new List<Organization>();

    public virtual ICollection<Partner> PartnerUsers { get; set; } = new List<Partner>();

    public virtual ICollection<Partner> PartnerVerifiedByNavigations { get; set; } = new List<Partner>();

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();

    public virtual UserRole Role { get; set; } = null!;

    public virtual ICollection<SupportRequest> SupportRequestAssignedToNavigations { get; set; } = new List<SupportRequest>();

    public virtual ICollection<SupportRequestComment> SupportRequestComments { get; set; } = new List<SupportRequestComment>();

    public virtual ICollection<SupportRequest> SupportRequestResolvedByNavigations { get; set; } = new List<SupportRequest>();

    public virtual ICollection<SupportRequest> SupportRequestUsers { get; set; } = new List<SupportRequest>();

    public virtual ICollection<TaskAssignment> TaskAssignments { get; set; } = new List<TaskAssignment>();

    public virtual ICollection<UserProfile> UserProfiles { get; set; } = new List<UserProfile>();

    public virtual ICollection<VolunteerCoordinator> VolunteerCoordinatorCreatedByNavigations { get; set; } = new List<VolunteerCoordinator>();

    public virtual ICollection<VolunteerCoordinator> VolunteerCoordinatorManagers { get; set; } = new List<VolunteerCoordinator>();

    public virtual ICollection<VolunteerCoordinator> VolunteerCoordinatorUsers { get; set; } = new List<VolunteerCoordinator>();

    public virtual ICollection<VolunteerProfile> VolunteerProfileUsers { get; set; } = new List<VolunteerProfile>();

    public virtual ICollection<VolunteerProfile> VolunteerProfileVerifiedByNavigations { get; set; } = new List<VolunteerProfile>();

    public virtual ICollection<VolunteerSchedule> VolunteerSchedules { get; set; } = new List<VolunteerSchedule>();
}
