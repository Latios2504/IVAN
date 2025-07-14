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

    public virtual DbSet<AiCacheEntry> AiCacheEntries { get; set; }

    public virtual DbSet<AiConfiguration> AiConfigurations { get; set; }

    public virtual DbSet<AiCustomInstruction> AiCustomInstructions { get; set; }

    public virtual DbSet<AiEntityMapping> AiEntityMappings { get; set; }

    public virtual DbSet<AiQueryIntent> AiQueryIntents { get; set; }

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

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder){
        var builder = new ConfigurationBuilder()
                               .SetBasePath(Directory.GetCurrentDirectory())
                               .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            IConfigurationRoot configuration = builder.Build();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("MyCnn"));
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseCollation("Vietnamese_CI_AS");

        modelBuilder.Entity<AiCacheEntry>(entity =>
        {
            entity.HasKey(e => e.CacheId).HasName("PK__AiCacheE__4EDCCD33B00BE402");

            entity.HasIndex(e => e.CacheKey, "IX_AiCacheEntries_CacheKey");

            entity.HasIndex(e => e.ExpiresAt, "IX_AiCacheEntries_ExpiresAt");

            entity.HasIndex(e => e.UserId, "IX_AiCacheEntries_UserId");

            entity.HasIndex(e => e.CacheKey, "UQ__AiCacheE__98E2A34695CE515A").IsUnique();

            entity.Property(e => e.CacheKey).HasMaxLength(255);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");

            entity.HasOne(d => d.User).WithMany(p => p.AiCacheEntries)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK__AiCacheEn__UserI__59904A2C");
        });

        modelBuilder.Entity<AiConfiguration>(entity =>
        {
            entity.HasKey(e => e.ConfigKey).HasName("PK__AiConfig__4A306785F8067631");

            entity.HasIndex(e => e.ConfigKey, "IX_AiConfigurations_ConfigKey");

            entity.Property(e => e.ConfigKey).HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getutcdate())");
        });

        modelBuilder.Entity<AiCustomInstruction>(entity =>
        {
            entity.HasKey(e => e.InstructionId).HasName("PK__AiCustom__CE0694714A158A19");

            entity.HasIndex(e => e.CreatedByUserId, "IX_AiCustomInstructions_CreatedByUserId");

            entity.HasIndex(e => e.IsActive, "IX_AiCustomInstructions_IsActive");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.InstructionName).HasMaxLength(200);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsDefault).HasDefaultValue(false);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.CreatedByUser).WithMany(p => p.AiCustomInstructions)
                .HasForeignKey(d => d.CreatedByUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AiCustomI__Creat__54CB950F");
        });

        modelBuilder.Entity<AiEntityMapping>(entity =>
        {
            entity.HasKey(e => e.MappingId).HasName("PK__AiEntity__8B57819D4AC387D7");

            entity.HasIndex(e => e.ConfidenceScore, "IX_AiEntityMappings_ConfidenceScore").IsDescending();

            entity.HasIndex(e => e.EntityId, "IX_AiEntityMappings_EntityId");

            entity.HasIndex(e => e.EntityType, "IX_AiEntityMappings_EntityType");

            entity.HasIndex(e => e.InputText, "IX_AiEntityMappings_InputText");

            entity.Property(e => e.ConfidenceScore).HasColumnType("decimal(3, 2)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.EntityTable).HasMaxLength(100);
            entity.Property(e => e.EntityType).HasMaxLength(50);
            entity.Property(e => e.InputText).HasMaxLength(500);
            entity.Property(e => e.MatchingAlgorithm).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<AiQueryIntent>(entity =>
        {
            entity.HasKey(e => e.IntentId).HasName("PK__AiQueryI__C3B0534790698561");

            entity.ToTable("AiQueryIntent");

            entity.HasIndex(e => e.DetectedIntent, "IX_AiQueryIntent_DetectedIntent");

            entity.HasIndex(e => e.IsCorrect, "IX_AiQueryIntent_IsCorrect");

            entity.HasIndex(e => new { e.UserId, e.CreatedAt }, "IX_AiQueryIntent_UserId_CreatedAt").IsDescending(false, true);

            entity.Property(e => e.ConversationId).HasMaxLength(100);
            entity.Property(e => e.CorrectedIntent).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.DataTablesAccessed).HasMaxLength(500);
            entity.Property(e => e.DetectedIntent).HasMaxLength(100);

            entity.HasOne(d => d.Instruction).WithMany(p => p.AiQueryIntents)
                .HasForeignKey(d => d.InstructionId)
                .HasConstraintName("FK__AiQueryIn__Instr__6225902D");

            entity.HasOne(d => d.User).WithMany(p => p.AiQueryIntents)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__AiQueryIn__UserI__61316BF4");
        });

        modelBuilder.Entity<Certificate>(entity =>
        {
            entity.HasKey(e => e.CertificateId).HasName("PK__Certific__BBF8A7C1077AD15D");

            entity.HasIndex(e => e.CertificateName, "IX_Certificates_CertificateName");

            entity.HasIndex(e => e.CertificateNumber, "IX_Certificates_CertificateNumber");

            entity.HasIndex(e => e.IssueDate, "IX_Certificates_IssueDate");

            entity.HasIndex(e => e.PerformanceLevel, "IX_Certificates_PerformanceLevel");

            entity.HasIndex(e => e.Status, "IX_Certificates_Status");

            entity.HasIndex(e => e.VerificationCode, "UQ__Certific__DA24CB14381AB1D0").IsUnique();

            entity.HasIndex(e => e.CertificateNumber, "UQ__Certific__E384CE0F5FC9781D").IsUnique();

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
                .HasConstraintName("FK__Certifica__Event__18B6AB08");

            entity.HasOne(d => d.IssuedByNavigation).WithMany(p => p.Certificates)
                .HasForeignKey(d => d.IssuedBy)
                .HasConstraintName("FK__Certifica__Issue__1A9EF37A");

            entity.HasOne(d => d.Template).WithMany(p => p.Certificates)
                .HasForeignKey(d => d.TemplateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Certifica__Templ__19AACF41");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.Certificates)
                .HasForeignKey(d => d.VolunteerId)
                .HasConstraintName("FK__Certifica__Volun__17C286CF");
        });

        modelBuilder.Entity<CertificateTemplate>(entity =>
        {
            entity.HasKey(e => e.TemplateId).HasName("PK__Certific__F87ADD274BBD2710");

            entity.HasIndex(e => e.TemplateName, "IX_CertificateTemplates_TemplateName");

            entity.HasIndex(e => e.TemplateType, "IX_CertificateTemplates_TemplateType");

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
                .HasConstraintName("FK__Certifica__Creat__0F2D40CE");

            entity.HasOne(d => d.Organization).WithMany(p => p.CertificateTemplates)
                .HasForeignKey(d => d.OrganizationId)
                .HasConstraintName("FK__Certifica__Organ__0E391C95");
        });

        modelBuilder.Entity<ChatbotInteraction>(entity =>
        {
            entity.HasKey(e => e.InteractionId).HasName("PK__ChatbotI__922C04961555F4A3");

            entity.Property(e => e.InteractionDate).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.User).WithMany(p => p.ChatbotInteractions)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__ChatbotIn__UserI__4589517F");
        });

        modelBuilder.Entity<CollaborationType>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PK__Collabor__516F03B5312F9A40");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.TypeName).HasMaxLength(100);
        });

        modelBuilder.Entity<CoordinatorSchedule>(entity =>
        {
            entity.HasKey(e => e.ScheduleId).HasName("PK__Coordina__9C8A5B4924CB7246");

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
                .HasConstraintName("FK__Coordinat__Coord__540C7B00");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.CoordinatorScheduleCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Coordinat__Creat__55F4C372");

            entity.HasOne(d => d.Event).WithMany(p => p.CoordinatorSchedules)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__Coordinat__Event__55009F39");
        });

        modelBuilder.Entity<CoordinatorTask>(entity =>
        {
            entity.HasKey(e => e.TaskId).HasName("PK__Coordina__7C6949B1CA8DBBA3");

            entity.HasIndex(e => e.TaskName, "IX_CoordinatorTasks_TaskName");

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
                .HasConstraintName("FK__Coordinat__Coord__7755B73D");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.CoordinatorTaskCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Coordinat__Creat__7849DB76");

            entity.HasOne(d => d.Event).WithMany(p => p.CoordinatorTasks)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__Coordinat__Event__76619304");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.EventId).HasName("PK__Events__7944C8109838AB25");

            entity.HasIndex(e => e.CategoryId, "IX_Events_CategoryId");

            entity.HasIndex(e => e.EndDate, "IX_Events_EndDate");

            entity.HasIndex(e => e.EventName, "IX_Events_EventName");

            entity.HasIndex(e => e.OrganizationId, "IX_Events_OrganizationId");

            entity.HasIndex(e => e.StartDate, "IX_Events_StartDate");

            entity.HasIndex(e => e.StatusId, "IX_Events_StatusId");

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
            entity.Property(e => e.EventType).HasMaxLength(100);
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
                .HasConstraintName("FK__Events__Category__32AB8735");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.EventCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Events__CreatedB__3493CFA7");

            entity.HasOne(d => d.Organization).WithMany(p => p.Events)
                .HasForeignKey(d => d.OrganizationId)
                .HasConstraintName("FK__Events__Organiza__31B762FC");

            entity.HasOne(d => d.Status).WithMany(p => p.Events)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Events__StatusId__339FAB6E");

            entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.EventUpdatedByNavigations)
                .HasForeignKey(d => d.UpdatedBy)
                .HasConstraintName("FK__Events__UpdatedB__3587F3E0");
        });

        modelBuilder.Entity<EventCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__EventCat__19093A0B991A95A9");

            entity.HasIndex(e => e.CategoryName, "IX_EventCategories_CategoryName");

            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IconUrl).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<EventRegistration>(entity =>
        {
            entity.HasKey(e => e.RegistrationId).HasName("PK__EventReg__6EF58810685F48B1");

            entity.HasIndex(e => e.ApplicationDate, "IX_EventRegistrations_ApplicationDate");

            entity.HasIndex(e => e.AttendanceStatus, "IX_EventRegistrations_AttendanceStatus");

            entity.HasIndex(e => e.EventId, "IX_EventRegistrations_EventId");

            entity.HasIndex(e => e.Performance, "IX_EventRegistrations_Performance");

            entity.HasIndex(e => e.StatusId, "IX_EventRegistrations_StatusId");

            entity.HasIndex(e => e.VolunteerId, "IX_EventRegistrations_VolunteerId");

            entity.HasIndex(e => new { e.EventId, e.VolunteerId }, "UQ__EventReg__AE523EE3C2FE960D").IsUnique();

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
                .HasConstraintName("FK__EventRegi__Appro__43D61337");

            entity.HasOne(d => d.Event).WithMany(p => p.EventRegistrations)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__EventRegi__Event__40F9A68C");

            entity.HasOne(d => d.RejectedByNavigation).WithMany(p => p.EventRegistrationRejectedByNavigations)
                .HasForeignKey(d => d.RejectedBy)
                .HasConstraintName("FK__EventRegi__Rejec__44CA3770");

            entity.HasOne(d => d.Status).WithMany(p => p.EventRegistrations)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__EventRegi__Statu__42E1EEFE");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.EventRegistrations)
                .HasForeignKey(d => d.VolunteerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__EventRegi__Volun__41EDCAC5");
        });

        modelBuilder.Entity<EventStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__EventSta__C8EE20635E882B3F");

            entity.ToTable("EventStatus");

            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.StatusName).HasMaxLength(50);
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4BEDD6A38E1F1B");

            entity.ToTable("Feedback");

            entity.HasIndex(e => e.Rating, "IX_Feedback_Rating");

            entity.HasIndex(e => e.Status, "IX_Feedback_Status");

            entity.HasIndex(e => e.Subject, "IX_Feedback_Subject");

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
                .HasConstraintName("FK__Feedback__Catego__0697FACD");

            entity.HasOne(d => d.Event).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__Feedback__EventI__04AFB25B");

            entity.HasOne(d => d.RespondedByNavigation).WithMany(p => p.FeedbackRespondedByNavigations)
                .HasForeignKey(d => d.RespondedBy)
                .HasConstraintName("FK__Feedback__Respon__078C1F06");

            entity.HasOne(d => d.User).WithMany(p => p.FeedbackUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Feedback__UserId__05A3D694");
        });

        modelBuilder.Entity<FeedbackCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Feedback__19093A0BAF45BD89");

            entity.HasIndex(e => e.CategoryName, "IX_FeedbackCategories_CategoryName");

            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E12DEAE2E27");

            entity.HasIndex(e => e.IsRead, "IX_Notifications_IsRead");

            entity.HasIndex(e => e.SendDate, "IX_Notifications_SendDate");

            entity.HasIndex(e => e.Title, "IX_Notifications_Title");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsRead).HasDefaultValue(false);
            entity.Property(e => e.SendDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Title).HasMaxLength(200);

            entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Notificat__UserI__41B8C09B");
        });

        modelBuilder.Entity<OnSiteTask>(entity =>
        {
            entity.HasKey(e => e.TaskId).HasName("PK__OnSiteTa__7C6949B1DA937621");

            entity.HasIndex(e => e.Difficulty, "IX_OnSiteTasks_Difficulty");

            entity.HasIndex(e => e.Priority, "IX_OnSiteTasks_Priority");

            entity.HasIndex(e => e.TaskName, "IX_OnSiteTasks_TaskName");

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
                .HasConstraintName("FK__OnSiteTas__Categ__65370702");

            entity.HasOne(d => d.CompletedByNavigation).WithMany(p => p.OnSiteTaskCompletedByNavigations)
                .HasForeignKey(d => d.CompletedBy)
                .HasConstraintName("FK__OnSiteTas__Compl__671F4F74");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.OnSiteTaskCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__OnSiteTas__Creat__690797E6");

            entity.HasOne(d => d.Event).WithMany(p => p.OnSiteTasks)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__OnSiteTas__Event__6442E2C9");

            entity.HasOne(d => d.Status).WithMany(p => p.OnSiteTasks)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OnSiteTas__Statu__662B2B3B");

            entity.HasOne(d => d.VerifiedByNavigation).WithMany(p => p.OnSiteTaskVerifiedByNavigations)
                .HasForeignKey(d => d.VerifiedBy)
                .HasConstraintName("FK__OnSiteTas__Verif__681373AD");
        });

        modelBuilder.Entity<Organization>(entity =>
        {
            entity.HasKey(e => e.OrganizationId).HasName("PK__Organiza__CADB0B1235061FD3");

            entity.HasIndex(e => e.IsVerified, "IX_Organizations_IsVerified");

            entity.HasIndex(e => e.OrganizationName, "IX_Organizations_OrganizationName");

            entity.HasIndex(e => e.ShortName, "IX_Organizations_ShortName");

            entity.HasIndex(e => e.TypeId, "IX_Organizations_TypeId");

            entity.HasIndex(e => e.UserId, "IX_Organizations_UserId");

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
                .HasConstraintName("FK__Organizat__TypeI__00200768");

            entity.HasOne(d => d.User).WithMany(p => p.OrganizationUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Organizat__UserI__7F2BE32F");

            entity.HasOne(d => d.VerifiedByNavigation).WithMany(p => p.OrganizationVerifiedByNavigations)
                .HasForeignKey(d => d.VerifiedBy)
                .HasConstraintName("FK__Organizat__Verif__01142BA1");
        });

        modelBuilder.Entity<OrganizationType>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PK__Organiza__516F03B545FE5FCB");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.TypeName).HasMaxLength(100);
        });

        modelBuilder.Entity<Partner>(entity =>
        {
            entity.HasKey(e => e.PartnerId).HasName("PK__Partners__39FD6312A04A493D");

            entity.HasIndex(e => e.CompanyName, "IX_Partners_CompanyName");

            entity.HasIndex(e => e.IsActive, "IX_Partners_IsActive");

            entity.HasIndex(e => e.IsVerified, "IX_Partners_IsVerified");

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
                .HasConstraintName("FK__Partners__Indust__0F624AF8");

            entity.HasOne(d => d.User).WithMany(p => p.PartnerUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Partners__UserId__0E6E26BF");

            entity.HasOne(d => d.VerifiedByNavigation).WithMany(p => p.PartnerVerifiedByNavigations)
                .HasForeignKey(d => d.VerifiedBy)
                .HasConstraintName("FK__Partners__Verifi__10566F31");
        });

        modelBuilder.Entity<PartnerCollaboration>(entity =>
        {
            entity.HasKey(e => e.CollaborationId).HasName("PK__PartnerC__4F81366427E6AF04");

            entity.HasIndex(e => e.CollaborationName, "IX_PartnerCollaborations_CollaborationName");

            entity.HasIndex(e => e.Status, "IX_PartnerCollaborations_Status");

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
                .HasConstraintName("FK__PartnerCo__Organ__3A179ED3");

            entity.HasOne(d => d.Partner).WithMany(p => p.PartnerCollaborations)
                .HasForeignKey(d => d.PartnerId)
                .HasConstraintName("FK__PartnerCo__Partn__3B0BC30C");

            entity.HasOne(d => d.Type).WithMany(p => p.PartnerCollaborations)
                .HasForeignKey(d => d.TypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PartnerCo__TypeI__3BFFE745");
        });

        modelBuilder.Entity<PartnerIndustry>(entity =>
        {
            entity.HasKey(e => e.IndustryId).HasName("PK__PartnerI__808DEDCC49DD2363");

            entity.HasIndex(e => e.IndustryName, "IX_PartnerIndustries_IndustryName");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IndustryName).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<RegistrationStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__Registra__C8EE2063EF3E6BED");

            entity.ToTable("RegistrationStatus");

            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.StatusName).HasMaxLength(50);
        });

        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("PK__Reports__D5BD48053D9853F2");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.GeneratedDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.ReportType).HasMaxLength(50);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Reports)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Reports__Created__4A4E069C");
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(e => e.PermissionId).HasName("PK__RolePerm__EFA6FB2F83F52088");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.PermissionName).HasMaxLength(100);

            entity.HasOne(d => d.Role).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.RoleId)
                .HasConstraintName("FK__RolePermi__RoleI__4E1E9780");
        });

        modelBuilder.Entity<Skill>(entity =>
        {
            entity.HasKey(e => e.SkillId).HasName("PK__Skills__DFA09187CFD94583");

            entity.HasIndex(e => e.Category, "IX_Skills_Category");

            entity.HasIndex(e => e.SkillName, "IX_Skills_SkillName");

            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.SkillName).HasMaxLength(100);
        });

        modelBuilder.Entity<SupportCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__SupportC__19093A0B7ABA8F30");

            entity.HasIndex(e => e.CategoryName, "IX_SupportCategories_CategoryName");

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
            entity.HasKey(e => e.RequestId).HasName("PK__SupportR__33A8517AF7101368");

            entity.HasIndex(e => e.Priority, "IX_SupportRequests_Priority");

            entity.HasIndex(e => e.Status, "IX_SupportRequests_Status");

            entity.HasIndex(e => e.Subject, "IX_SupportRequests_Subject");

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
                .HasConstraintName("FK__SupportRe__Assig__28ED12D1");

            entity.HasOne(d => d.Category).WithMany(p => p.SupportRequests)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SupportRe__Categ__27F8EE98");

            entity.HasOne(d => d.ResolvedByNavigation).WithMany(p => p.SupportRequestResolvedByNavigations)
                .HasForeignKey(d => d.ResolvedBy)
                .HasConstraintName("FK__SupportRe__Resol__29E1370A");

            entity.HasOne(d => d.User).WithMany(p => p.SupportRequestUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SupportRe__UserI__2704CA5F");
        });

        modelBuilder.Entity<SupportRequestComment>(entity =>
        {
            entity.HasKey(e => e.CommentId).HasName("PK__SupportR__C3B4DFCA333B48C9");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsInternal).HasDefaultValue(false);

            entity.HasOne(d => d.Request).WithMany(p => p.SupportRequestComments)
                .HasForeignKey(d => d.RequestId)
                .HasConstraintName("FK__SupportRe__Reque__2EA5EC27");

            entity.HasOne(d => d.User).WithMany(p => p.SupportRequestComments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SupportRe__UserI__2F9A1060");
        });

        modelBuilder.Entity<TaskAssignment>(entity =>
        {
            entity.HasKey(e => e.AssignmentId).HasName("PK__TaskAssi__32499E7776063054");

            entity.HasIndex(e => e.Status, "IX_TaskAssignments_Status");

            entity.HasIndex(e => new { e.TaskId, e.VolunteerId }, "UQ__TaskAssi__AB7FBF429691B0C4").IsUnique();

            entity.Property(e => e.AssignedDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.HoursWorked).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.Notes).HasMaxLength(1000);
            entity.Property(e => e.Performance).HasMaxLength(20);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.AssignedByNavigation).WithMany(p => p.TaskAssignments)
                .HasForeignKey(d => d.AssignedBy)
                .HasConstraintName("FK__TaskAssig__Assig__719CDDE7");

            entity.HasOne(d => d.Task).WithMany(p => p.TaskAssignments)
                .HasForeignKey(d => d.TaskId)
                .HasConstraintName("FK__TaskAssig__TaskI__6FB49575");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.TaskAssignments)
                .HasForeignKey(d => d.VolunteerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TaskAssig__Volun__70A8B9AE");
        });

        modelBuilder.Entity<TaskCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__TaskCate__19093A0BE7C9400E");

            entity.HasIndex(e => e.CategoryName, "IX_TaskCategories_CategoryName");

            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<TaskStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__TaskStat__C8EE2063F899D676");

            entity.ToTable("TaskStatus");

            entity.HasIndex(e => e.StatusName, "IX_TaskStatus_StatusName");

            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.StatusName).HasMaxLength(50);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C5DA20E67");

            entity.HasIndex(e => e.Email, "IX_Users_Email");

            entity.HasIndex(e => e.RoleId, "IX_Users_RoleId");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D10534E889CCAD").IsUnique();

            entity.Property(e => e.AiPersonalizationEnabled).HasDefaultValue(true);
            entity.Property(e => e.AiPreferredLanguage)
                .HasMaxLength(10)
                .HasDefaultValue("vi-VN");
            entity.Property(e => e.AiQueryComplexityLevel)
                .HasMaxLength(20)
                .HasDefaultValue("Medium");
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
                .HasConstraintName("FK__Users__RoleId__571DF1D5");
        });

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(e => e.ProfileId).HasName("PK__UserProf__290C88E434A02F0C");

            entity.HasIndex(e => e.FirstName, "IX_UserProfiles_FirstName");

            entity.HasIndex(e => e.LastName, "IX_UserProfiles_LastName");

            entity.HasIndex(e => e.UserId, "IX_UserProfiles_UserId");

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
                .HasConstraintName("FK__UserProfi__UserI__5BE2A6F2");
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__UserRole__8AFACE1AE3C20D25");

            entity.HasIndex(e => e.RoleName, "UQ__UserRole__8A2B616068553E09").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.RoleName).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<VolunteerCoordinator>(entity =>
        {
            entity.HasKey(e => e.CoordinatorId).HasName("PK__Voluntee__91C373DF4F65DBF6");

            entity.HasIndex(e => e.Department, "IX_VolunteerCoordinators_Department");

            entity.HasIndex(e => e.IsActive, "IX_VolunteerCoordinators_IsActive");

            entity.HasIndex(e => e.OrganizationId, "IX_VolunteerCoordinators_OrganizationId");

            entity.HasIndex(e => e.Position, "IX_VolunteerCoordinators_Position");

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
                .HasConstraintName("FK__Volunteer__Creat__18EBB532");

            entity.HasOne(d => d.Manager).WithMany(p => p.VolunteerCoordinatorManagers)
                .HasForeignKey(d => d.ManagerId)
                .HasConstraintName("FK__Volunteer__Manag__17F790F9");

            entity.HasOne(d => d.Organization).WithMany(p => p.VolunteerCoordinatorOrganizations)
                .HasForeignKey(d => d.OrganizationId)
                .HasConstraintName("FK__Volunteer__Organ__17036CC0");

            entity.HasOne(d => d.RequestedByNavigation).WithMany(p => p.VolunteerCoordinatorRequestedByNavigations)
                .HasForeignKey(d => d.RequestedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Volunteer__Reque__19DFD96B");

            entity.HasOne(d => d.User).WithMany(p => p.VolunteerCoordinatorUsers)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Volunteer__UserI__160F4887");
        });

        modelBuilder.Entity<VolunteerProfile>(entity =>
        {
            entity.HasKey(e => e.VolunteerId).HasName("PK__Voluntee__716F6F2C37BC32D8");

            entity.HasIndex(e => e.IsVerified, "IX_VolunteerProfiles_IsVerified");

            entity.HasIndex(e => e.Major, "IX_VolunteerProfiles_Major");

            entity.HasIndex(e => e.University, "IX_VolunteerProfiles_University");

            entity.HasIndex(e => e.UserId, "IX_VolunteerProfiles_UserId");

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
            entity.Property(e => e.TotalHoursVolunteered).HasDefaultValue(0);
            entity.Property(e => e.University).HasMaxLength(200);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.VolunteerHours).HasDefaultValue(0);

            entity.HasOne(d => d.User).WithMany(p => p.VolunteerProfileUsers)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Volunteer__UserI__693CA210");

            entity.HasOne(d => d.VerifiedByNavigation).WithMany(p => p.VolunteerProfileVerifiedByNavigations)
                .HasForeignKey(d => d.VerifiedBy)
                .HasConstraintName("FK__Volunteer__Verif__6A30C649");
        });

        modelBuilder.Entity<VolunteerSchedule>(entity =>
        {
            entity.HasKey(e => e.ScheduleId).HasName("PK__Voluntee__9C8A5B4934C319B0");

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
                .HasConstraintName("FK__Volunteer__Creat__4D5F7D71");

            entity.HasOne(d => d.Event).WithMany(p => p.VolunteerSchedules)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__Volunteer__Event__4C6B5938");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.VolunteerSchedules)
                .HasForeignKey(d => d.VolunteerId)
                .HasConstraintName("FK__Volunteer__Volun__4B7734FF");
        });

        modelBuilder.Entity<VolunteerSkill>(entity =>
        {
            entity.HasKey(e => new { e.VolunteerId, e.SkillId }).HasName("PK__Voluntee__1C95663462675FEF");

            entity.HasIndex(e => e.SkillId, "IX_VolunteerSkills_SkillId");

            entity.HasIndex(e => e.VolunteerId, "IX_VolunteerSkills_VolunteerId");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.ProficiencyLevel)
                .HasMaxLength(20)
                .HasDefaultValue("Cơ bản");
            entity.Property(e => e.YearsOfExperience).HasDefaultValue(0);

            entity.HasOne(d => d.Skill).WithMany(p => p.VolunteerSkills)
                .HasForeignKey(d => d.SkillId)
                .HasConstraintName("FK__Volunteer__Skill__70DDC3D8");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.VolunteerSkills)
                .HasForeignKey(d => d.VolunteerId)
                .HasConstraintName("FK__Volunteer__Volun__6FE99F9F");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
