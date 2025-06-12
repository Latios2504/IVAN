using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data.Entities;

namespace WebAPI.Data;

public partial class IVANContext : DbContext
{
    public IVANContext()
    {
    }

    public IVANContext(DbContextOptions<IVANContext> options)
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

    public virtual DbSet<Data.Entities.TaskStatus> TaskStatuses { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserProfile> UserProfiles { get; set; }

    public virtual DbSet<UserRole> UserRoles { get; set; }

    public virtual DbSet<VolunteerCoordinator> VolunteerCoordinators { get; set; }

    public virtual DbSet<VolunteerProfile> VolunteerProfiles { get; set; }

    public virtual DbSet<VolunteerSchedule> VolunteerSchedules { get; set; }

    public virtual DbSet<VolunteerSkill> VolunteerSkills { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            var builder = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            IConfigurationRoot configuration = builder.Build();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("SystemDB"));
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Certificate>(entity =>
        {
            entity.HasKey(e => e.CertificateId).HasName("PK__Certific__BBF8A7C1A0B11F21");

            entity.HasIndex(e => e.VerificationCode, "UQ__Certific__DA24CB14432F4B97").IsUnique();

            entity.HasIndex(e => e.CertificateNumber, "UQ__Certific__E384CE0F7897A2B7").IsUnique();

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
                .HasConstraintName("FK__Certifica__Event__6FB49575");

            entity.HasOne(d => d.IssuedByNavigation).WithMany(p => p.Certificates)
                .HasForeignKey(d => d.IssuedBy)
                .HasConstraintName("FK__Certifica__Issue__719CDDE7");

            entity.HasOne(d => d.Template).WithMany(p => p.Certificates)
                .HasForeignKey(d => d.TemplateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Certifica__Templ__70A8B9AE");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.Certificates)
                .HasForeignKey(d => d.VolunteerId)
                .HasConstraintName("FK__Certifica__Volun__6EC0713C");
        });

        modelBuilder.Entity<CertificateTemplate>(entity =>
        {
            entity.HasKey(e => e.TemplateId).HasName("PK__Certific__F87ADD27FF18B4BB");

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
                .HasConstraintName("FK__Certifica__Creat__662B2B3B");

            entity.HasOne(d => d.Organization).WithMany(p => p.CertificateTemplates)
                .HasForeignKey(d => d.OrganizationId)
                .HasConstraintName("FK__Certifica__Organ__65370702");
        });

        modelBuilder.Entity<ChatbotInteraction>(entity =>
        {
            entity.HasKey(e => e.InteractionId).HasName("PK__ChatbotI__922C049602F548A4");

            entity.Property(e => e.InteractionDate).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.User).WithMany(p => p.ChatbotInteractions)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__ChatbotIn__UserI__1C873BEC");
        });

        modelBuilder.Entity<CollaborationType>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PK__Collabor__516F03B5E02E20E3");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.TypeName).HasMaxLength(100);
        });

        modelBuilder.Entity<CoordinatorSchedule>(entity =>
        {
            entity.HasKey(e => e.ScheduleId).HasName("PK__Coordina__9C8A5B4964951BDB");

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
                .HasConstraintName("FK__Coordinat__Coord__2B0A656D");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.CoordinatorScheduleCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Coordinat__Creat__2CF2ADDF");

            entity.HasOne(d => d.Event).WithMany(p => p.CoordinatorSchedules)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__Coordinat__Event__2BFE89A6");
        });

        modelBuilder.Entity<CoordinatorTask>(entity =>
        {
            entity.HasKey(e => e.TaskId).HasName("PK__Coordina__7C6949B143ABCB24");

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
                .HasConstraintName("FK__Coordinat__Coord__4E53A1AA");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.CoordinatorTaskCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Coordinat__Creat__4F47C5E3");

            entity.HasOne(d => d.Event).WithMany(p => p.CoordinatorTasks)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__Coordinat__Event__4D5F7D71");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.EventId).HasName("PK__Events__7944C810F819F20D");

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
                .HasConstraintName("FK__Events__Category__09A971A2");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.EventCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Events__CreatedB__0B91BA14");

            entity.HasOne(d => d.Organization).WithMany(p => p.Events)
                .HasForeignKey(d => d.OrganizationId)
                .HasConstraintName("FK__Events__Organiza__08B54D69");

            entity.HasOne(d => d.Status).WithMany(p => p.Events)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Events__StatusId__0A9D95DB");

            entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.EventUpdatedByNavigations)
                .HasForeignKey(d => d.UpdatedBy)
                .HasConstraintName("FK__Events__UpdatedB__0C85DE4D");
        });

        modelBuilder.Entity<EventCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__EventCat__19093A0B9FDF4AD5");

            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IconUrl).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<EventRegistration>(entity =>
        {
            entity.HasKey(e => e.RegistrationId).HasName("PK__EventReg__6EF588108A9A140A");

            entity.HasIndex(e => e.RegistrationId, "IX_EventRegistrations_RegistrationId");

            entity.HasIndex(e => new { e.EventId, e.VolunteerId }, "UQ__EventReg__AE523EE3F5C7FF7B").IsUnique();

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
                .HasConstraintName("FK__EventRegi__Appro__1AD3FDA4");

            entity.HasOne(d => d.Event).WithMany(p => p.EventRegistrations)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__EventRegi__Event__17F790F9");

            entity.HasOne(d => d.RejectedByNavigation).WithMany(p => p.EventRegistrationRejectedByNavigations)
                .HasForeignKey(d => d.RejectedBy)
                .HasConstraintName("FK__EventRegi__Rejec__1BC821DD");

            entity.HasOne(d => d.Status).WithMany(p => p.EventRegistrations)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__EventRegi__Statu__19DFD96B");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.EventRegistrations)
                .HasForeignKey(d => d.VolunteerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__EventRegi__Volun__18EBB532");
        });

        modelBuilder.Entity<EventStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__EventSta__C8EE2063B5CB9CC9");

            entity.ToTable("EventStatus");

            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.StatusName).HasMaxLength(50);
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4BEDD632C9EDA5");

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
                .HasConstraintName("FK__Feedback__Catego__5D95E53A");

            entity.HasOne(d => d.Event).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__Feedback__EventI__5BAD9CC8");

            entity.HasOne(d => d.RespondedByNavigation).WithMany(p => p.FeedbackRespondedByNavigations)
                .HasForeignKey(d => d.RespondedBy)
                .HasConstraintName("FK__Feedback__Respon__5E8A0973");

            entity.HasOne(d => d.User).WithMany(p => p.FeedbackUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Feedback__UserId__5CA1C101");
        });

        modelBuilder.Entity<FeedbackCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Feedback__19093A0B9183AD28");

            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E12F1EEE020");

            entity.HasIndex(e => e.NotificationId, "IX_Notifications_NotificationId");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsRead).HasDefaultValue(false);
            entity.Property(e => e.SendDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Title).HasMaxLength(200);

            entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Notificat__UserI__18B6AB08");
        });

        modelBuilder.Entity<OnSiteTask>(entity =>
        {
            entity.HasKey(e => e.TaskId).HasName("PK__OnSiteTa__7C6949B12AD497B6");

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
                .HasConstraintName("FK__OnSiteTas__Categ__3C34F16F");

            entity.HasOne(d => d.CompletedByNavigation).WithMany(p => p.OnSiteTaskCompletedByNavigations)
                .HasForeignKey(d => d.CompletedBy)
                .HasConstraintName("FK__OnSiteTas__Compl__3E1D39E1");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.OnSiteTaskCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__OnSiteTas__Creat__40058253");

            entity.HasOne(d => d.Event).WithMany(p => p.OnSiteTasks)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__OnSiteTas__Event__3B40CD36");

            entity.HasOne(d => d.Status).WithMany(p => p.OnSiteTasks)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OnSiteTas__Statu__3D2915A8");

            entity.HasOne(d => d.VerifiedByNavigation).WithMany(p => p.OnSiteTaskVerifiedByNavigations)
                .HasForeignKey(d => d.VerifiedBy)
                .HasConstraintName("FK__OnSiteTas__Verif__3F115E1A");
        });

        modelBuilder.Entity<Organization>(entity =>
        {
            entity.HasKey(e => e.OrganizationId).HasName("PK__Organiza__CADB0B1262727D6C");

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
                .HasConstraintName("FK__Organizat__TypeI__571DF1D5");

            entity.HasOne(d => d.User).WithMany(p => p.OrganizationUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Organizat__UserI__5629CD9C");

            entity.HasOne(d => d.VerifiedByNavigation).WithMany(p => p.OrganizationVerifiedByNavigations)
                .HasForeignKey(d => d.VerifiedBy)
                .HasConstraintName("FK__Organizat__Verif__5812160E");
        });

        modelBuilder.Entity<OrganizationType>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PK__Organiza__516F03B55235DC52");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.TypeName).HasMaxLength(100);
        });

        modelBuilder.Entity<Partner>(entity =>
        {
            entity.HasKey(e => e.PartnerId).HasName("PK__Partners__39FD6312DEC6A3A0");

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
                .HasConstraintName("FK__Partners__Indust__66603565");

            entity.HasOne(d => d.User).WithMany(p => p.PartnerUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Partners__UserId__656C112C");

            entity.HasOne(d => d.VerifiedByNavigation).WithMany(p => p.PartnerVerifiedByNavigations)
                .HasForeignKey(d => d.VerifiedBy)
                .HasConstraintName("FK__Partners__Verifi__6754599E");
        });

        modelBuilder.Entity<PartnerCollaboration>(entity =>
        {
            entity.HasKey(e => e.CollaborationId).HasName("PK__PartnerC__4F8136645D06E5C4");

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
                .HasConstraintName("FK__PartnerCo__Organ__11158940");

            entity.HasOne(d => d.Partner).WithMany(p => p.PartnerCollaborations)
                .HasForeignKey(d => d.PartnerId)
                .HasConstraintName("FK__PartnerCo__Partn__1209AD79");

            entity.HasOne(d => d.Type).WithMany(p => p.PartnerCollaborations)
                .HasForeignKey(d => d.TypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PartnerCo__TypeI__12FDD1B2");
        });

        modelBuilder.Entity<PartnerIndustry>(entity =>
        {
            entity.HasKey(e => e.IndustryId).HasName("PK__PartnerI__808DEDCCD4B1E6E6");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IndustryName).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<RegistrationStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__Registra__C8EE20635AB847C7");

            entity.ToTable("RegistrationStatus");

            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.StatusName).HasMaxLength(50);
        });

        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("PK__Reports__D5BD4805A26E2191");

            entity.HasIndex(e => e.ReportId, "IX_Reports_ReportId");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.GeneratedDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.ReportType).HasMaxLength(50);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Reports)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Reports__Created__214BF109");
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(e => e.PermissionId).HasName("PK__RolePerm__EFA6FB2FA35889C9");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.PermissionName).HasMaxLength(100);

            entity.HasOne(d => d.Role).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.RoleId)
                .HasConstraintName("FK__RolePermi__RoleI__251C81ED");
        });

        modelBuilder.Entity<Skill>(entity =>
        {
            entity.HasKey(e => e.SkillId).HasName("PK__Skills__DFA09187372C37A9");

            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.SkillName).HasMaxLength(100);
        });

        modelBuilder.Entity<SupportCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__SupportC__19093A0B044EE1B6");

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
            entity.HasKey(e => e.RequestId).HasName("PK__SupportR__33A8517ADB3D760F");

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
                .HasConstraintName("FK__SupportRe__Assig__7FEAFD3E");

            entity.HasOne(d => d.Category).WithMany(p => p.SupportRequests)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SupportRe__Categ__7EF6D905");

            entity.HasOne(d => d.ResolvedByNavigation).WithMany(p => p.SupportRequestResolvedByNavigations)
                .HasForeignKey(d => d.ResolvedBy)
                .HasConstraintName("FK__SupportRe__Resol__00DF2177");

            entity.HasOne(d => d.User).WithMany(p => p.SupportRequestUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SupportRe__UserI__7E02B4CC");
        });

        modelBuilder.Entity<SupportRequestComment>(entity =>
        {
            entity.HasKey(e => e.CommentId).HasName("PK__SupportR__C3B4DFCA3D9EE17C");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsInternal).HasDefaultValue(false);

            entity.HasOne(d => d.Request).WithMany(p => p.SupportRequestComments)
                .HasForeignKey(d => d.RequestId)
                .HasConstraintName("FK__SupportRe__Reque__05A3D694");

            entity.HasOne(d => d.User).WithMany(p => p.SupportRequestComments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SupportRe__UserI__0697FACD");
        });

        modelBuilder.Entity<TaskAssignment>(entity =>
        {
            entity.HasKey(e => e.AssignmentId).HasName("PK__TaskAssi__32499E77154A5E9A");

            entity.HasIndex(e => new { e.TaskId, e.VolunteerId }, "UQ__TaskAssi__AB7FBF42FC870D22").IsUnique();

            entity.Property(e => e.AssignedDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.HoursWorked).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.Notes).HasMaxLength(1000);
            entity.Property(e => e.Performance).HasMaxLength(20);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.AssignedByNavigation).WithMany(p => p.TaskAssignments)
                .HasForeignKey(d => d.AssignedBy)
                .HasConstraintName("FK__TaskAssig__Assig__489AC854");

            entity.HasOne(d => d.Task).WithMany(p => p.TaskAssignments)
                .HasForeignKey(d => d.TaskId)
                .HasConstraintName("FK__TaskAssig__TaskI__46B27FE2");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.TaskAssignments)
                .HasForeignKey(d => d.VolunteerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TaskAssig__Volun__47A6A41B");
        });

        modelBuilder.Entity<TaskCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__TaskCate__19093A0B49671B45");

            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Data.Entities.TaskStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__TaskStat__C8EE2063EB4DD214");

            entity.ToTable("TaskStatus");

            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.StatusName).HasMaxLength(50);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C6FA3FD52");

            entity.HasIndex(e => e.UserId, "IX_Users_UserId");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D1053430D70888").IsUnique();

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
                .HasConstraintName("FK__Users__RoleId__2F10007B");
        });

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(e => e.ProfileId).HasName("PK__UserProf__290C88E430AB29A6");

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
                .HasConstraintName("FK__UserProfi__UserI__33D4B598");
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__UserRole__8AFACE1A5EF84F95");

            entity.HasIndex(e => e.RoleName, "UQ__UserRole__8A2B6160C736347D").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.RoleName).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<VolunteerCoordinator>(entity =>
        {
            entity.HasKey(e => e.CoordinatorId).HasName("PK__Voluntee__91C373DFC83EAC0D");

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
                .HasConstraintName("FK__Volunteer__Creat__6FE99F9F");

            entity.HasOne(d => d.Manager).WithMany(p => p.VolunteerCoordinatorManagers)
                .HasForeignKey(d => d.ManagerId)
                .HasConstraintName("FK__Volunteer__Manag__6EF57B66");

            entity.HasOne(d => d.Organization).WithMany(p => p.VolunteerCoordinatorOrganizations)
                .HasForeignKey(d => d.OrganizationId)
                .HasConstraintName("FK__Volunteer__Organ__6E01572D");

            entity.HasOne(d => d.RequestedByNavigation).WithMany(p => p.VolunteerCoordinatorRequestedByNavigations)
                .HasForeignKey(d => d.RequestedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Volunteer__Reque__70DDC3D8");

            entity.HasOne(d => d.User).WithMany(p => p.VolunteerCoordinatorUsers)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Volunteer__UserI__6D0D32F4");
        });

        modelBuilder.Entity<VolunteerProfile>(entity =>
        {
            entity.HasKey(e => e.VolunteerId).HasName("PK__Voluntee__716F6F2C71699E52");

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
                .HasConstraintName("FK__Volunteer__UserI__403A8C7D");

            entity.HasOne(d => d.VerifiedByNavigation).WithMany(p => p.VolunteerProfileVerifiedByNavigations)
                .HasForeignKey(d => d.VerifiedBy)
                .HasConstraintName("FK__Volunteer__Verif__412EB0B6");
        });

        modelBuilder.Entity<VolunteerSchedule>(entity =>
        {
            entity.HasKey(e => e.ScheduleId).HasName("PK__Voluntee__9C8A5B493366FDCE");

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
                .HasConstraintName("FK__Volunteer__Creat__245D67DE");

            entity.HasOne(d => d.Event).WithMany(p => p.VolunteerSchedules)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__Volunteer__Event__236943A5");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.VolunteerSchedules)
                .HasForeignKey(d => d.VolunteerId)
                .HasConstraintName("FK__Volunteer__Volun__22751F6C");
        });

        modelBuilder.Entity<VolunteerSkill>(entity =>
        {
            entity.HasKey(e => new { e.VolunteerId, e.SkillId }).HasName("PK__Voluntee__1C956634F9F11FBA");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.ProficiencyLevel)
                .HasMaxLength(20)
                .HasDefaultValue("Cơ bản");
            entity.Property(e => e.YearsOfExperience).HasDefaultValue(0);

            entity.HasOne(d => d.Skill).WithMany(p => p.VolunteerSkills)
                .HasForeignKey(d => d.SkillId)
                .HasConstraintName("FK__Volunteer__Skill__47DBAE45");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.VolunteerSkills)
                .HasForeignKey(d => d.VolunteerId)
                .HasConstraintName("FK__Volunteer__Volun__46E78A0C");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
