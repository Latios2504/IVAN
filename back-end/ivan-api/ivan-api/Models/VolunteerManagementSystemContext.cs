using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Models;

public partial class VolunteerManagementSystemContext : DbContext
{
    public VolunteerManagementSystemContext()
    {
    }

    public VolunteerManagementSystemContext(DbContextOptions<VolunteerManagementSystemContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Certificate> Certificates { get; set; }

    public virtual DbSet<CertificateTemplate> CertificateTemplates { get; set; }

    public virtual DbSet<ChatbotInteraction> ChatbotInteractions { get; set; }

    public virtual DbSet<CollaborationType> CollaborationTypes { get; set; }

    public virtual DbSet<CoordinatorSchedule> CoordinatorSchedules { get; set; }

    public virtual DbSet<CoordinatorTask> CoordinatorTasks { get; set; }

    public virtual DbSet<Event> Events { get; set; }

    public virtual DbSet<EventCategory> EventCategories { get; set; }

    public virtual DbSet<EventRegistration> EventRegistrations { get; set; }

    public virtual DbSet<EventStatus> EventStatuses { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<FeedbackCategory> FeedbackCategories { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<OnSiteTask> OnSiteTasks { get; set; }

    public virtual DbSet<Organization> Organizations { get; set; }

    public virtual DbSet<OrganizationType> OrganizationTypes { get; set; }

    public virtual DbSet<Partner> Partners { get; set; }

    public virtual DbSet<PartnerCollaboration> PartnerCollaborations { get; set; }

    public virtual DbSet<PartnerIndustry> PartnerIndustries { get; set; }

    public virtual DbSet<RegistrationStatus> RegistrationStatuses { get; set; }

    public virtual DbSet<Report> Reports { get; set; }

    public virtual DbSet<RolePermission> RolePermissions { get; set; }

    public virtual DbSet<Skill> Skills { get; set; }

    public virtual DbSet<SupportCategory> SupportCategories { get; set; }

    public virtual DbSet<SupportRequest> SupportRequests { get; set; }

    public virtual DbSet<SupportRequestComment> SupportRequestComments { get; set; }

    public virtual DbSet<TaskAssignment> TaskAssignments { get; set; }

    public virtual DbSet<TaskCategory> TaskCategories { get; set; }

    public virtual DbSet<TaskStatus> TaskStatuses { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserProfile> UserProfiles { get; set; }

    public virtual DbSet<UserRole> UserRoles { get; set; }

    public virtual DbSet<VolunteerCoordinator> VolunteerCoordinators { get; set; }

    public virtual DbSet<VolunteerProfile> VolunteerProfiles { get; set; }

    public virtual DbSet<VolunteerSchedule> VolunteerSchedules { get; set; }

    public virtual DbSet<VolunteerSkill> VolunteerSkills { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var builder = new ConfigurationBuilder()
                               .SetBasePath(Directory.GetCurrentDirectory())
                               .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
        IConfigurationRoot configuration = builder.Build();
        optionsBuilder.UseSqlServer(configuration.GetConnectionString("MyCnn"));
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Certificate>(entity =>
        {
            entity.HasKey(e => e.CertificateId).HasName("PK__Certific__BBF8A7C128FDEBB8");

            entity.HasIndex(e => e.VerificationCode, "UQ__Certific__DA24CB14274F9239").IsUnique();

            entity.HasIndex(e => e.CertificateNumber, "UQ__Certific__E384CE0F4B21A998").IsUnique();

            entity.Property(e => e.CertificateFileUrl).HasMaxLength(500);
            entity.Property(e => e.CertificateName).HasMaxLength(300);
            entity.Property(e => e.CertificateNumber).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.DigitalSignature).HasMaxLength(1000);
            entity.Property(e => e.DownloadCount).HasDefaultValue(0);
            entity.Property(e => e.HoursCompleted).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.IssueDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.PerformanceLevel).HasMaxLength(50);
            entity.Property(e => e.QrcodeUrl)
                .HasMaxLength(500)
                .HasColumnName("QRCodeUrl");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("Active");
            entity.Property(e => e.VerificationCode).HasMaxLength(100);

            entity.HasOne(d => d.Event).WithMany(p => p.Certificates)
                .HasForeignKey(d => d.EventId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Certifica__Event__02C769E9");

            entity.HasOne(d => d.IssuedByNavigation).WithMany(p => p.Certificates)
                .HasForeignKey(d => d.IssuedBy)
                .HasConstraintName("FK__Certifica__Issue__04AFB25B");

            entity.HasOne(d => d.Template).WithMany(p => p.Certificates)
                .HasForeignKey(d => d.TemplateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Certifica__Templ__03BB8E22");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.Certificates)
                .HasForeignKey(d => d.VolunteerId)
                .HasConstraintName("FK__Certifica__Volun__01D345B0");
        });

        modelBuilder.Entity<CertificateTemplate>(entity =>
        {
            entity.HasKey(e => e.TemplateId).HasName("PK__Certific__F87ADD271A4165E5");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsDefault).HasDefaultValue(false);
            entity.Property(e => e.RequiredFields).HasMaxLength(1000);
            entity.Property(e => e.TemplateName).HasMaxLength(200);
            entity.Property(e => e.TemplateType).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.CertificateTemplates)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Certifica__Creat__793DFFAF");

            entity.HasOne(d => d.Organization).WithMany(p => p.CertificateTemplates)
                .HasForeignKey(d => d.OrganizationId)
                .HasConstraintName("FK__Certifica__Organ__7849DB76");
        });

        modelBuilder.Entity<ChatbotInteraction>(entity =>
        {
            entity.HasKey(e => e.InteractionId).HasName("PK__ChatbotI__922C049673D52D64");

            entity.Property(e => e.InteractionDate).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.User).WithMany(p => p.ChatbotInteractions)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__ChatbotIn__UserI__2F9A1060");
        });

        modelBuilder.Entity<CollaborationType>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PK__Collabor__516F03B52D76602D");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.TypeName).HasMaxLength(100);
        });

        modelBuilder.Entity<CoordinatorSchedule>(entity =>
        {
            entity.HasKey(e => e.ScheduleId).HasName("PK__Coordina__9C8A5B4935E18BE8");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.IsAllDay).HasDefaultValue(false);
            entity.Property(e => e.Location).HasMaxLength(500);
            entity.Property(e => e.Notes).HasMaxLength(1000);
            entity.Property(e => e.Priority).HasMaxLength(20);
            entity.Property(e => e.ReminderMinutes).HasDefaultValue(60);
            entity.Property(e => e.ScheduleType).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Coordinator).WithMany(p => p.CoordinatorScheduleCoordinators)
                .HasForeignKey(d => d.CoordinatorId)
                .HasConstraintName("FK__Coordinat__Coord__3E1D39E1");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.CoordinatorScheduleCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Coordinat__Creat__40058253");

            entity.HasOne(d => d.Event).WithMany(p => p.CoordinatorSchedules)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__Coordinat__Event__3F115E1A");
        });

        modelBuilder.Entity<CoordinatorTask>(entity =>
        {
            entity.HasKey(e => e.TaskId).HasName("PK__Coordina__7C6949B1FEAFBBAE");

            entity.Property(e => e.ActualHours).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.EstimatedHours).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.Notes).HasMaxLength(1000);
            entity.Property(e => e.Priority).HasMaxLength(20);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.TaskName).HasMaxLength(200);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Coordinator).WithMany(p => p.CoordinatorTaskCoordinators)
                .HasForeignKey(d => d.CoordinatorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Coordinat__Coord__6166761E");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.CoordinatorTaskCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Coordinat__Creat__625A9A57");

            entity.HasOne(d => d.Event).WithMany(p => p.CoordinatorTasks)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__Coordinat__Event__607251E5");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.EventId).HasName("PK__Events__7944C8108A77AF74");

            entity.HasIndex(e => e.EventId, "IX_Events_EventId");

            entity.Property(e => e.AgeRequirement).HasMaxLength(100);
            entity.Property(e => e.BannerImageUrl).HasMaxLength(500);
            entity.Property(e => e.Benefits).HasMaxLength(2000);
            entity.Property(e => e.Budget).HasColumnType("decimal(15, 2)");
            entity.Property(e => e.CompletedVolunteers).HasDefaultValue(0);
            entity.Property(e => e.ContactEmail).HasMaxLength(255);
            entity.Property(e => e.ContactPerson).HasMaxLength(200);
            entity.Property(e => e.ContactPhone).HasMaxLength(20);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Currency)
                .HasMaxLength(3)
                .HasDefaultValue("VND");
            entity.Property(e => e.CurrentVolunteers).HasDefaultValue(0);
            entity.Property(e => e.DetailedAddress).HasMaxLength(1000);
            entity.Property(e => e.District).HasMaxLength(100);
            entity.Property(e => e.EventName).HasMaxLength(300);
            entity.Property(e => e.GenderRequirement).HasMaxLength(20);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsFeatured).HasDefaultValue(false);
            entity.Property(e => e.IsUrgent).HasDefaultValue(false);
            entity.Property(e => e.Latitude).HasColumnType("decimal(10, 8)");
            entity.Property(e => e.Location).HasMaxLength(500);
            entity.Property(e => e.Longitude).HasColumnType("decimal(11, 8)");
            entity.Property(e => e.MinVolunteers).HasDefaultValue(1);
            entity.Property(e => e.Priority).HasDefaultValue(0);
            entity.Property(e => e.Province).HasMaxLength(100);
            entity.Property(e => e.Rating)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(3, 2)");
            entity.Property(e => e.RatingCount).HasDefaultValue(0);
            entity.Property(e => e.RegistrationCount).HasDefaultValue(0);
            entity.Property(e => e.RequiredSkills).HasMaxLength(1000);
            entity.Property(e => e.Requirements).HasMaxLength(2000);
            entity.Property(e => e.ShortDescription).HasMaxLength(500);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.ViewCount).HasDefaultValue(0);
            entity.Property(e => e.WardCommune).HasMaxLength(100);

            entity.HasOne(d => d.Category).WithMany(p => p.Events)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Events__Category__1CBC4616");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.EventCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Events__CreatedB__1EA48E88");

            entity.HasOne(d => d.Organization).WithMany(p => p.Events)
                .HasForeignKey(d => d.OrganizationId)
                .HasConstraintName("FK__Events__Organiza__1BC821DD");

            entity.HasOne(d => d.Status).WithMany(p => p.Events)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Events__StatusId__1DB06A4F");

            entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.EventUpdatedByNavigations)
                .HasForeignKey(d => d.UpdatedBy)
                .HasConstraintName("FK__Events__UpdatedB__1F98B2C1");
        });

        modelBuilder.Entity<EventCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__EventCat__19093A0BB2EEC1EB");

            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IconUrl).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<EventRegistration>(entity =>
        {
            entity.HasKey(e => e.RegistrationId).HasName("PK__EventReg__6EF588104AFD3FF4");

            entity.HasIndex(e => e.RegistrationId, "IX_EventRegistrations_RegistrationId");

            entity.HasIndex(e => new { e.EventId, e.VolunteerId }, "UQ__EventReg__AE523EE3E3693D4E").IsUnique();

            entity.Property(e => e.ActualHours).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.AdditionalInfo).HasMaxLength(1000);
            entity.Property(e => e.ApplicationDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.AttendanceStatus).HasMaxLength(50);
            entity.Property(e => e.CancellationReason).HasMaxLength(1000);
            entity.Property(e => e.CertificateIssued).HasDefaultValue(false);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.MotivationLetter).HasMaxLength(2000);
            entity.Property(e => e.Performance).HasMaxLength(20);
            entity.Property(e => e.PerformanceNotes).HasMaxLength(1000);
            entity.Property(e => e.RejectionReason).HasMaxLength(1000);
            entity.Property(e => e.Review).HasMaxLength(1000);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.ApprovedByNavigation).WithMany(p => p.EventRegistrationApprovedByNavigations)
                .HasForeignKey(d => d.ApprovedBy)
                .HasConstraintName("FK__EventRegi__Appro__2DE6D218");

            entity.HasOne(d => d.Event).WithMany(p => p.EventRegistrations)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__EventRegi__Event__2B0A656D");

            entity.HasOne(d => d.RejectedByNavigation).WithMany(p => p.EventRegistrationRejectedByNavigations)
                .HasForeignKey(d => d.RejectedBy)
                .HasConstraintName("FK__EventRegi__Rejec__2EDAF651");

            entity.HasOne(d => d.Status).WithMany(p => p.EventRegistrations)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__EventRegi__Statu__2CF2ADDF");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.EventRegistrations)
                .HasForeignKey(d => d.VolunteerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__EventRegi__Volun__2BFE89A6");
        });

        modelBuilder.Entity<EventStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__EventSta__C8EE206304B7C3FE");

            entity.ToTable("EventStatus");

            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.StatusName).HasMaxLength(50);
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4BEDD6133D6577");

            entity.ToTable("Feedback");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsAnonymous).HasDefaultValue(false);
            entity.Property(e => e.IsPublic).HasDefaultValue(false);
            entity.Property(e => e.IsVerified).HasDefaultValue(false);
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("Pending");
            entity.Property(e => e.Subject).HasMaxLength(300);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Category).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Feedback__Catego__70A8B9AE");

            entity.HasOne(d => d.Event).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__Feedback__EventI__6EC0713C");

            entity.HasOne(d => d.RespondedByNavigation).WithMany(p => p.FeedbackRespondedByNavigations)
                .HasForeignKey(d => d.RespondedBy)
                .HasConstraintName("FK__Feedback__Respon__719CDDE7");

            entity.HasOne(d => d.User).WithMany(p => p.FeedbackUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Feedback__UserId__6FB49575");
        });

        modelBuilder.Entity<FeedbackCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Feedback__19093A0B2AEE1805");

            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E128A9F5E33");

            entity.HasIndex(e => e.NotificationId, "IX_Notifications_NotificationId");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsRead).HasDefaultValue(false);
            entity.Property(e => e.SendDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Title).HasMaxLength(200);

            entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Notificat__UserI__2BC97F7C");
        });

        modelBuilder.Entity<OnSiteTask>(entity =>
        {
            entity.HasKey(e => e.TaskId).HasName("PK__OnSiteTa__7C6949B10165A2E7");

            entity.Property(e => e.ActualHours).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.AssignedVolunteers).HasDefaultValue(0);
            entity.Property(e => e.CompletionCriteria).HasMaxLength(1000);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.Difficulty).HasMaxLength(20);
            entity.Property(e => e.EstimatedHours).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.Location).HasMaxLength(500);
            entity.Property(e => e.Materials).HasMaxLength(1000);
            entity.Property(e => e.Notes).HasMaxLength(1000);
            entity.Property(e => e.Priority).HasMaxLength(20);
            entity.Property(e => e.RequiredSkills).HasMaxLength(1000);
            entity.Property(e => e.RequiredVolunteers).HasDefaultValue(1);
            entity.Property(e => e.SafetyRequirements).HasMaxLength(1000);
            entity.Property(e => e.TaskName).HasMaxLength(200);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Category).WithMany(p => p.OnSiteTasks)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OnSiteTas__Categ__4F47C5E3");

            entity.HasOne(d => d.CompletedByNavigation).WithMany(p => p.OnSiteTaskCompletedByNavigations)
                .HasForeignKey(d => d.CompletedBy)
                .HasConstraintName("FK__OnSiteTas__Compl__51300E55");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.OnSiteTaskCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__OnSiteTas__Creat__531856C7");

            entity.HasOne(d => d.Event).WithMany(p => p.OnSiteTasks)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__OnSiteTas__Event__4E53A1AA");

            entity.HasOne(d => d.Status).WithMany(p => p.OnSiteTasks)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OnSiteTas__Statu__503BEA1C");

            entity.HasOne(d => d.VerifiedByNavigation).WithMany(p => p.OnSiteTaskVerifiedByNavigations)
                .HasForeignKey(d => d.VerifiedBy)
                .HasConstraintName("FK__OnSiteTas__Verif__5224328E");
        });

        modelBuilder.Entity<Organization>(entity =>
        {
            entity.HasKey(e => e.OrganizationId).HasName("PK__Organiza__CADB0B1215209A3C");

            entity.HasIndex(e => e.OrganizationId, "IX_Organizations_OrganizationId");

            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.BannerUrl).HasMaxLength(500);
            entity.Property(e => e.BusinessLicense).HasMaxLength(100);
            entity.Property(e => e.ContactEmail).HasMaxLength(255);
            entity.Property(e => e.ContactPersonName).HasMaxLength(200);
            entity.Property(e => e.ContactPersonTitle).HasMaxLength(100);
            entity.Property(e => e.ContactPhone).HasMaxLength(20);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.District).HasMaxLength(100);
            entity.Property(e => e.FacebookPage).HasMaxLength(200);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsVerified).HasDefaultValue(false);
            entity.Property(e => e.LinkedInPage).HasMaxLength(200);
            entity.Property(e => e.LogoUrl).HasMaxLength(500);
            entity.Property(e => e.Mission).HasMaxLength(1000);
            entity.Property(e => e.OrganizationName).HasMaxLength(200);
            entity.Property(e => e.PostalCode).HasMaxLength(10);
            entity.Property(e => e.Province).HasMaxLength(100);
            entity.Property(e => e.Rating)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(3, 2)");
            entity.Property(e => e.RatingCount).HasDefaultValue(0);
            entity.Property(e => e.ShortName).HasMaxLength(50);
            entity.Property(e => e.TaxCode).HasMaxLength(50);
            entity.Property(e => e.TotalEvents).HasDefaultValue(0);
            entity.Property(e => e.TotalVolunteers).HasDefaultValue(0);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Vision).HasMaxLength(1000);
            entity.Property(e => e.WardCommune).HasMaxLength(100);
            entity.Property(e => e.Website).HasMaxLength(200);

            entity.HasOne(d => d.Type).WithMany(p => p.Organizations)
                .HasForeignKey(d => d.TypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Organizat__TypeI__6A30C649");

            entity.HasOne(d => d.User).WithMany(p => p.OrganizationUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Organizat__UserI__693CA210");

            entity.HasOne(d => d.VerifiedByNavigation).WithMany(p => p.OrganizationVerifiedByNavigations)
                .HasForeignKey(d => d.VerifiedBy)
                .HasConstraintName("FK__Organizat__Verif__6B24EA82");
        });

        modelBuilder.Entity<OrganizationType>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PK__Organiza__516F03B596BB69B5");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.TypeName).HasMaxLength(100);
        });

        modelBuilder.Entity<Partner>(entity =>
        {
            entity.HasKey(e => e.PartnerId).HasName("PK__Partners__39FD63121801C7E5");

            entity.HasIndex(e => e.PartnerId, "IX_Partners_PartnerId");

            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.BusinessLicense).HasMaxLength(100);
            entity.Property(e => e.CompanyName).HasMaxLength(200);
            entity.Property(e => e.ContactEmail).HasMaxLength(255);
            entity.Property(e => e.ContactPersonName).HasMaxLength(200);
            entity.Property(e => e.ContactPersonTitle).HasMaxLength(100);
            entity.Property(e => e.ContactPhone).HasMaxLength(20);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.District).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsVerified).HasDefaultValue(false);
            entity.Property(e => e.LogoUrl).HasMaxLength(500);
            entity.Property(e => e.PostalCode).HasMaxLength(10);
            entity.Property(e => e.Province).HasMaxLength(100);
            entity.Property(e => e.Rating)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(3, 2)");
            entity.Property(e => e.RatingCount).HasDefaultValue(0);
            entity.Property(e => e.TaxCode).HasMaxLength(50);
            entity.Property(e => e.TotalCollaborations).HasDefaultValue(0);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.WardCommune).HasMaxLength(100);
            entity.Property(e => e.Website).HasMaxLength(200);

            entity.HasOne(d => d.Industry).WithMany(p => p.Partners)
                .HasForeignKey(d => d.IndustryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Partners__Indust__797309D9");

            entity.HasOne(d => d.User).WithMany(p => p.PartnerUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Partners__UserId__787EE5A0");

            entity.HasOne(d => d.VerifiedByNavigation).WithMany(p => p.PartnerVerifiedByNavigations)
                .HasForeignKey(d => d.VerifiedBy)
                .HasConstraintName("FK__Partners__Verifi__7A672E12");
        });

        modelBuilder.Entity<PartnerCollaboration>(entity =>
        {
            entity.HasKey(e => e.CollaborationId).HasName("PK__PartnerC__4F8136641B7D492E");

            entity.Property(e => e.Budget).HasColumnType("decimal(15, 2)");
            entity.Property(e => e.CollaborationName).HasMaxLength(300);
            entity.Property(e => e.ContractDocumentUrl).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Currency)
                .HasMaxLength(3)
                .HasDefaultValue("VND");
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.Objectives).HasMaxLength(2000);
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("Active");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Organization).WithMany(p => p.PartnerCollaborations)
                .HasForeignKey(d => d.OrganizationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PartnerCo__Organ__24285DB4");

            entity.HasOne(d => d.Partner).WithMany(p => p.PartnerCollaborations)
                .HasForeignKey(d => d.PartnerId)
                .HasConstraintName("FK__PartnerCo__Partn__251C81ED");

            entity.HasOne(d => d.Type).WithMany(p => p.PartnerCollaborations)
                .HasForeignKey(d => d.TypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PartnerCo__TypeI__2610A626");
        });

        modelBuilder.Entity<PartnerIndustry>(entity =>
        {
            entity.HasKey(e => e.IndustryId).HasName("PK__PartnerI__808DEDCCC8CC419E");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IndustryName).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<RegistrationStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__Registra__C8EE2063D6CFF2BC");

            entity.ToTable("RegistrationStatus");

            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.StatusName).HasMaxLength(50);
        });

        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("PK__Reports__D5BD4805307EC04D");

            entity.HasIndex(e => e.ReportId, "IX_Reports_ReportId");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.GeneratedDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.ReportType).HasMaxLength(50);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Reports)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Reports__Created__345EC57D");
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(e => e.PermissionId).HasName("PK__RolePerm__EFA6FB2F39B73075");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.PermissionName).HasMaxLength(100);

            entity.HasOne(d => d.Role).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.RoleId)
                .HasConstraintName("FK__RolePermi__RoleI__382F5661");
        });

        modelBuilder.Entity<Skill>(entity =>
        {
            entity.HasKey(e => e.SkillId).HasName("PK__Skills__DFA0918737948FD2");

            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.SkillName).HasMaxLength(100);
        });

        modelBuilder.Entity<SupportCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__SupportC__19093A0BD67A6DD0");

            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.ExpectedResponseTime).HasDefaultValue(24);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Priority)
                .HasMaxLength(20)
                .HasDefaultValue("Medium");
        });

        modelBuilder.Entity<SupportRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__SupportR__33A8517ADAFBBDFC");

            entity.HasIndex(e => e.RequestId, "IX_SupportRequests_RequestId");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Priority)
                .HasMaxLength(20)
                .HasDefaultValue("Medium");
            entity.Property(e => e.SatisfactionFeedback).HasMaxLength(1000);
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("Open");
            entity.Property(e => e.Subject).HasMaxLength(300);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.AssignedToNavigation).WithMany(p => p.SupportRequestAssignedToNavigations)
                .HasForeignKey(d => d.AssignedTo)
                .HasConstraintName("FK__SupportRe__Assig__12FDD1B2");

            entity.HasOne(d => d.Category).WithMany(p => p.SupportRequests)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SupportRe__Categ__1209AD79");

            entity.HasOne(d => d.ResolvedByNavigation).WithMany(p => p.SupportRequestResolvedByNavigations)
                .HasForeignKey(d => d.ResolvedBy)
                .HasConstraintName("FK__SupportRe__Resol__13F1F5EB");

            entity.HasOne(d => d.User).WithMany(p => p.SupportRequestUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SupportRe__UserI__11158940");
        });

        modelBuilder.Entity<SupportRequestComment>(entity =>
        {
            entity.HasKey(e => e.CommentId).HasName("PK__SupportR__C3B4DFCAFD9BFE3C");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsInternal).HasDefaultValue(false);

            entity.HasOne(d => d.Request).WithMany(p => p.SupportRequestComments)
                .HasForeignKey(d => d.RequestId)
                .HasConstraintName("FK__SupportRe__Reque__18B6AB08");

            entity.HasOne(d => d.User).WithMany(p => p.SupportRequestComments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SupportRe__UserI__19AACF41");
        });

        modelBuilder.Entity<TaskAssignment>(entity =>
        {
            entity.HasKey(e => e.AssignmentId).HasName("PK__TaskAssi__32499E775C71ECF3");

            entity.HasIndex(e => new { e.TaskId, e.VolunteerId }, "UQ__TaskAssi__AB7FBF42FBE851F6").IsUnique();

            entity.Property(e => e.AssignedDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.HoursWorked).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.Notes).HasMaxLength(1000);
            entity.Property(e => e.Performance).HasMaxLength(20);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.AssignedByNavigation).WithMany(p => p.TaskAssignments)
                .HasForeignKey(d => d.AssignedBy)
                .HasConstraintName("FK__TaskAssig__Assig__5BAD9CC8");

            entity.HasOne(d => d.Task).WithMany(p => p.TaskAssignments)
                .HasForeignKey(d => d.TaskId)
                .HasConstraintName("FK__TaskAssig__TaskI__59C55456");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.TaskAssignments)
                .HasForeignKey(d => d.VolunteerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TaskAssig__Volun__5AB9788F");
        });

        modelBuilder.Entity<TaskCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__TaskCate__19093A0B81331ECE");

            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<TaskStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__TaskStat__C8EE206356FCC1AB");

            entity.ToTable("TaskStatus");

            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.StatusName).HasMaxLength(50);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C09FFD45B");

            entity.HasIndex(e => e.UserId, "IX_Users_UserId");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D1053458E98F2D").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.EmailVerificationToken).HasMaxLength(255);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsEmailVerified).HasDefaultValue(false);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.PasswordResetToken).HasMaxLength(255);
            entity.Property(e => e.Salt).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Users__RoleId__4222D4EF");
        });

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(e => e.ProfileId).HasName("PK__UserProf__290C88E475D0E32D");

            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.Avatar).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.District).HasMaxLength(100);
            entity.Property(e => e.EmergencyContactName).HasMaxLength(200);
            entity.Property(e => e.EmergencyContactPhone).HasMaxLength(20);
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.FullName)
                .HasMaxLength(201)
                .HasComputedColumnSql("(([FirstName]+' ')+[LastName])", true);
            entity.Property(e => e.Gender).HasMaxLength(10);
            entity.Property(e => e.LastName).HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.PostalCode).HasMaxLength(10);
            entity.Property(e => e.Province).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.WardCommune).HasMaxLength(100);

            entity.HasOne(d => d.User).WithMany(p => p.UserProfiles)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__UserProfi__UserI__46E78A0C");
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__UserRole__8AFACE1A6C123EAC");

            entity.HasIndex(e => e.RoleName, "UQ__UserRole__8A2B6160A2607FEF").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.RoleName).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<VolunteerCoordinator>(entity =>
        {
            entity.HasKey(e => e.CoordinatorId).HasName("PK__Voluntee__91C373DFDF629F85");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Department).HasMaxLength(100);
            entity.Property(e => e.EmployeeId).HasMaxLength(50);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Notes).HasMaxLength(1000);
            entity.Property(e => e.Position).HasMaxLength(100);
            entity.Property(e => e.Responsibilities).HasMaxLength(1000);
            entity.Property(e => e.Salary).HasColumnType("decimal(15, 2)");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.VolunteerCoordinatorCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Volunteer__Creat__02FC7413");

            entity.HasOne(d => d.Manager).WithMany(p => p.VolunteerCoordinatorManagers)
                .HasForeignKey(d => d.ManagerId)
                .HasConstraintName("FK__Volunteer__Manag__02084FDA");

            entity.HasOne(d => d.Organization).WithMany(p => p.VolunteerCoordinatorOrganizations)
                .HasForeignKey(d => d.OrganizationId)
                .HasConstraintName("FK__Volunteer__Organ__01142BA1");

            entity.HasOne(d => d.RequestedByNavigation).WithMany(p => p.VolunteerCoordinatorRequestedByNavigations)
                .HasForeignKey(d => d.RequestedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Volunteer__Reque__03F0984C");

            entity.HasOne(d => d.User).WithMany(p => p.VolunteerCoordinatorUsers)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Volunteer__UserI__00200768");
        });

        modelBuilder.Entity<VolunteerProfile>(entity =>
        {
            entity.HasKey(e => e.VolunteerId).HasName("PK__Voluntee__716F6F2CED9BF191");

            entity.HasIndex(e => e.VolunteerId, "IX_VolunteerProfiles_VolunteerId");

            entity.Property(e => e.Availability).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Experience).HasMaxLength(1000);
            entity.Property(e => e.IsVerified).HasDefaultValue(false);
            entity.Property(e => e.Major).HasMaxLength(200);
            entity.Property(e => e.Motivation).HasMaxLength(1000);
            entity.Property(e => e.Rating)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(3, 2)");
            entity.Property(e => e.RatingCount).HasDefaultValue(0);
            entity.Property(e => e.StudentId).HasMaxLength(50);
            entity.Property(e => e.University).HasMaxLength(200);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.VolunteerHours).HasDefaultValue(0);

            entity.HasOne(d => d.User).WithMany(p => p.VolunteerProfileUsers)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Volunteer__UserI__534D60F1");

            entity.HasOne(d => d.VerifiedByNavigation).WithMany(p => p.VolunteerProfileVerifiedByNavigations)
                .HasForeignKey(d => d.VerifiedBy)
                .HasConstraintName("FK__Volunteer__Verif__5441852A");
        });

        modelBuilder.Entity<VolunteerSchedule>(entity =>
        {
            entity.HasKey(e => e.ScheduleId).HasName("PK__Voluntee__9C8A5B49E0421F14");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.IsAllDay).HasDefaultValue(false);
            entity.Property(e => e.Location).HasMaxLength(500);
            entity.Property(e => e.Notes).HasMaxLength(1000);
            entity.Property(e => e.Priority).HasMaxLength(20);
            entity.Property(e => e.ReminderMinutes).HasDefaultValue(60);
            entity.Property(e => e.ScheduleType).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.VolunteerSchedules)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Volunteer__Creat__37703C52");

            entity.HasOne(d => d.Event).WithMany(p => p.VolunteerSchedules)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__Volunteer__Event__367C1819");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.VolunteerSchedules)
                .HasForeignKey(d => d.VolunteerId)
                .HasConstraintName("FK__Volunteer__Volun__3587F3E0");
        });

        modelBuilder.Entity<VolunteerSkill>(entity =>
        {
            entity.HasKey(e => new { e.VolunteerId, e.SkillId }).HasName("PK__Voluntee__1C956634C0989E91");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.ProficiencyLevel)
                .HasMaxLength(20)
                .HasDefaultValue("Cơ bản");
            entity.Property(e => e.YearsOfExperience).HasDefaultValue(0);

            entity.HasOne(d => d.Skill).WithMany(p => p.VolunteerSkills)
                .HasForeignKey(d => d.SkillId)
                .HasConstraintName("FK__Volunteer__Skill__5AEE82B9");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.VolunteerSkills)
                .HasForeignKey(d => d.VolunteerId)
                .HasConstraintName("FK__Volunteer__Volun__59FA5E80");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
