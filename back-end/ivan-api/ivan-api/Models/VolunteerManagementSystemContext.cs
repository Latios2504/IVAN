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

    public virtual DbSet<AiConversationContext> AiConversationContexts { get; set; }

    public virtual DbSet<AiCustomInstruction> AiCustomInstructions { get; set; }

    public virtual DbSet<AiPerformanceMetric> AiPerformanceMetrics { get; set; }

    public virtual DbSet<AiQueryAnalytic> AiQueryAnalytics { get; set; }

    public virtual DbSet<AiQueryCategory> AiQueryCategories { get; set; }

    public virtual DbSet<AiRateLimit> AiRateLimits { get; set; }

    public virtual DbSet<AiSecurityAuditLog> AiSecurityAuditLogs { get; set; }

    public virtual DbSet<AiSystemConfiguration> AiSystemConfigurations { get; set; }

    public virtual DbSet<AiUserPermission> AiUserPermissions { get; set; }

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
        if (!optionsBuilder.IsConfigured)
        {
            var builder = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            IConfigurationRoot configuration = builder.Build();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("MyCnn"));
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AiCacheEntry>(entity =>
        {
            entity.HasKey(e => e.CacheId).HasName("PK__AiCacheE__4EDCCD33A3F5530F");

            entity.HasIndex(e => e.CacheKey, "IX_AiCacheEntries_CacheKey");

            entity.HasIndex(e => e.DataType, "IX_AiCacheEntries_DataType");

            entity.HasIndex(e => e.ExpiresAt, "IX_AiCacheEntries_ExpiresAt");

            entity.HasIndex(e => e.UserId, "IX_AiCacheEntries_UserId");

            entity.HasIndex(e => e.CacheKey, "UQ__AiCacheE__98E2A346A3D23EDF").IsUnique();

            entity.Property(e => e.CacheKey).HasMaxLength(255);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");
            entity.Property(e => e.DataType)
                .HasMaxLength(50)
                .HasDefaultValue("");
            entity.Property(e => e.LastAccessedAt).HasDefaultValueSql("(getutcdate())");
            entity.Property(e => e.UserId).HasMaxLength(100);
        });

        modelBuilder.Entity<AiConversationContext>(entity =>
        {
            entity.HasKey(e => e.ContextId).HasName("PK__AiConver__23A237496A3CBCAD");

            entity.HasIndex(e => e.ConversationId, "UQ__AiConver__C050D876EA77CF49").IsUnique();

            entity.Property(e => e.ConversationId).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Instruction).WithMany(p => p.AiConversationContexts)
                .HasForeignKey(d => d.InstructionId)
                .HasConstraintName("FK__AiConvers__Instr__4F12BBB9");

            entity.HasOne(d => d.User).WithMany(p => p.AiConversationContexts)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AiConvers__UserI__4E1E9780");
        });

        modelBuilder.Entity<AiCustomInstruction>(entity =>
        {
            entity.HasKey(e => e.InstructionId).HasName("PK__AiCustom__CE0694714955B0E7");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.InstructionName).HasMaxLength(200);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsDefault).HasDefaultValue(false);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.CreatedByUser).WithMany(p => p.AiCustomInstructions)
                .HasForeignKey(d => d.CreatedByUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AiCustomI__Creat__3FD07829");
        });

        modelBuilder.Entity<AiPerformanceMetric>(entity =>
        {
            entity.HasKey(e => e.MetricId).HasName("PK__AiPerfor__561056A51EDEEF06");

            entity.HasIndex(e => e.CacheStatus, "IX_AiPerformanceMetrics_CacheStatus");

            entity.HasIndex(e => e.CreatedAt, "IX_AiPerformanceMetrics_CreatedAt");

            entity.HasIndex(e => e.ExecutionTimeMs, "IX_AiPerformanceMetrics_ExecutionTime");

            entity.HasIndex(e => e.QueryCategory, "IX_AiPerformanceMetrics_QueryCategory");

            entity.HasIndex(e => e.UserId, "IX_AiPerformanceMetrics_UserId");

            entity.Property(e => e.CacheStatus)
                .HasMaxLength(20)
                .HasDefaultValue("MISS");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");
            entity.Property(e => e.Query).HasMaxLength(500);
            entity.Property(e => e.QueryCategory)
                .HasMaxLength(100)
                .HasDefaultValue("");

            entity.HasOne(d => d.Instruction).WithMany(p => p.AiPerformanceMetrics)
                .HasForeignKey(d => d.InstructionId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK__AiPerform__Instr__5C6CB6D7");

            entity.HasOne(d => d.User).WithMany(p => p.AiPerformanceMetrics)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__AiPerform__UserI__5B78929E");
        });

        modelBuilder.Entity<AiQueryAnalytic>(entity =>
        {
            entity.HasKey(e => e.QueryId).HasName("PK__AiQueryA__5967F7DB2BB66B58");

            entity.Property(e => e.ConversationId).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.DataTablesAccessed).HasMaxLength(500);

            entity.HasOne(d => d.Instruction).WithMany(p => p.AiQueryAnalytics)
                .HasForeignKey(d => d.InstructionId)
                .HasConstraintName("FK__AiQueryAn__Instr__44952D46");

            entity.HasOne(d => d.User).WithMany(p => p.AiQueryAnalytics)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AiQueryAn__UserI__43A1090D");
        });

        modelBuilder.Entity<AiQueryCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__AiQueryC__19093A0B67F4BFDD");

            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<AiRateLimit>(entity =>
        {
            entity.HasKey(e => e.RateLimitId).HasName("PK__AiRateLi__0B581845FD5A93E3");

            entity.HasIndex(e => e.IsBlocked, "IX_AiRateLimits_IsBlocked");

            entity.HasIndex(e => e.Operation, "IX_AiRateLimits_Operation");

            entity.HasIndex(e => e.UserId, "IX_AiRateLimits_UserId");

            entity.HasIndex(e => e.WindowStart, "IX_AiRateLimits_WindowStart");

            entity.HasIndex(e => new { e.UserId, e.Operation }, "UQ__AiRateLi__783ECD0FBFE3279F").IsUnique();

            entity.Property(e => e.LastRequestAt).HasDefaultValueSql("(getutcdate())");
            entity.Property(e => e.Operation).HasMaxLength(50);

            entity.HasOne(d => d.User).WithMany(p => p.AiRateLimits)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__AiRateLim__UserI__6ABAD62E");
        });

        modelBuilder.Entity<AiSecurityAuditLog>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("PK__AiSecuri__5E54864829A19C75");

            entity.HasIndex(e => e.CreatedAt, "IX_AiSecurityAuditLogs_CreatedAt");

            entity.HasIndex(e => e.EventType, "IX_AiSecurityAuditLogs_EventType");

            entity.HasIndex(e => e.Severity, "IX_AiSecurityAuditLogs_Severity");

            entity.HasIndex(e => e.UserId, "IX_AiSecurityAuditLogs_UserId");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");
            entity.Property(e => e.Details).HasDefaultValue("");
            entity.Property(e => e.EventType).HasMaxLength(100);
            entity.Property(e => e.IpAddress).HasMaxLength(45);
            entity.Property(e => e.Severity)
                .HasMaxLength(20)
                .HasDefaultValue("INFO");
            entity.Property(e => e.UserAgent).HasMaxLength(500);

            entity.HasOne(d => d.User).WithMany(p => p.AiSecurityAuditLogs)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__AiSecurit__UserI__54CB950F");
        });

        modelBuilder.Entity<AiSystemConfiguration>(entity =>
        {
            entity.HasKey(e => e.ConfigId).HasName("PK__AiSystem__C3BC335CF73C3234");

            entity.HasIndex(e => e.ConfigKey, "IX_AiSystemConfigurations_ConfigKey");

            entity.HasIndex(e => e.ConfigType, "IX_AiSystemConfigurations_ConfigType");

            entity.HasIndex(e => e.IsSecure, "IX_AiSystemConfigurations_IsSecure");

            entity.HasIndex(e => e.ConfigKey, "UQ__AiSystem__4A30678473781DCD").IsUnique();

            entity.Property(e => e.ConfigKey).HasMaxLength(100);
            entity.Property(e => e.ConfigType)
                .HasMaxLength(20)
                .HasDefaultValue("STRING");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getutcdate())");

            entity.HasOne(d => d.UpdatedByUser).WithMany(p => p.AiSystemConfigurations)
                .HasForeignKey(d => d.UpdatedByUserId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK__AiSystemC__Updat__7814D14C");
        });

        modelBuilder.Entity<AiUserPermission>(entity =>
        {
            entity.HasKey(e => e.PermissionId).HasName("PK__AiUserPe__EFA6FB2FC1A46081");

            entity.HasIndex(e => e.IsGranted, "IX_AiUserPermissions_IsGranted");

            entity.HasIndex(e => e.Permission, "IX_AiUserPermissions_Permission");

            entity.HasIndex(e => e.UserId, "IX_AiUserPermissions_UserId");

            entity.HasIndex(e => new { e.UserId, e.Permission }, "UQ__AiUserPe__A8D4BFC3349CDF49").IsUnique();

            entity.Property(e => e.Permission).HasMaxLength(100);

            entity.HasOne(d => d.GrantedByUser).WithMany(p => p.AiUserPermissionGrantedByUsers)
                .HasForeignKey(d => d.GrantedByUserId)
                .HasConstraintName("FK__AiUserPer__Grant__7073AF84");

            entity.HasOne(d => d.User).WithMany(p => p.AiUserPermissionUsers)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__AiUserPer__UserI__6F7F8B4B");
        });

        modelBuilder.Entity<Certificate>(entity =>
        {
            entity.HasKey(e => e.CertificateId).HasName("PK__Certific__BBF8A7C1E5763C62");

            entity.HasIndex(e => e.VerificationCode, "UQ__Certific__DA24CB14AC1E9856").IsUnique();

            entity.HasIndex(e => e.CertificateNumber, "UQ__Certific__E384CE0FE5325641").IsUnique();

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
                .HasConstraintName("FK__Certifica__Event__03BB8E22");

            entity.HasOne(d => d.IssuedByNavigation).WithMany(p => p.Certificates)
                .HasForeignKey(d => d.IssuedBy)
                .HasConstraintName("FK__Certifica__Issue__05A3D694");

            entity.HasOne(d => d.Template).WithMany(p => p.Certificates)
                .HasForeignKey(d => d.TemplateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Certifica__Templ__04AFB25B");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.Certificates)
                .HasForeignKey(d => d.VolunteerId)
                .HasConstraintName("FK__Certifica__Volun__02C769E9");
        });

        modelBuilder.Entity<CertificateTemplate>(entity =>
        {
            entity.HasKey(e => e.TemplateId).HasName("PK__Certific__F87ADD27399A44EF");

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
                .HasConstraintName("FK__Certifica__Creat__7A3223E8");

            entity.HasOne(d => d.Organization).WithMany(p => p.CertificateTemplates)
                .HasForeignKey(d => d.OrganizationId)
                .HasConstraintName("FK__Certifica__Organ__793DFFAF");
        });

        modelBuilder.Entity<ChatbotInteraction>(entity =>
        {
            entity.HasKey(e => e.InteractionId).HasName("PK__ChatbotI__922C04966184789F");

            entity.Property(e => e.InteractionDate).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.User).WithMany(p => p.ChatbotInteractions)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__ChatbotIn__UserI__308E3499");
        });

        modelBuilder.Entity<CollaborationType>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PK__Collabor__516F03B5A7515C4A");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.TypeName).HasMaxLength(100);
        });

        modelBuilder.Entity<CoordinatorSchedule>(entity =>
        {
            entity.HasKey(e => e.ScheduleId).HasName("PK__Coordina__9C8A5B499A77E174");

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
                .HasConstraintName("FK__Coordinat__Coord__3F115E1A");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.CoordinatorScheduleCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Coordinat__Creat__40F9A68C");

            entity.HasOne(d => d.Event).WithMany(p => p.CoordinatorSchedules)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__Coordinat__Event__40058253");
        });

        modelBuilder.Entity<CoordinatorTask>(entity =>
        {
            entity.HasKey(e => e.TaskId).HasName("PK__Coordina__7C6949B15E507935");

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
                .HasConstraintName("FK__Coordinat__Coord__625A9A57");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.CoordinatorTaskCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Coordinat__Creat__634EBE90");

            entity.HasOne(d => d.Event).WithMany(p => p.CoordinatorTasks)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__Coordinat__Event__6166761E");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.EventId).HasName("PK__Events__7944C81088FCC9A7");

            entity.HasIndex(e => e.CategoryId, "IX_Events_CategoryId");

            entity.HasIndex(e => e.EndDate, "IX_Events_EndDate");

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
                .HasConstraintName("FK__Events__Category__1DB06A4F");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.EventCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Events__CreatedB__1F98B2C1");

            entity.HasOne(d => d.Organization).WithMany(p => p.Events)
                .HasForeignKey(d => d.OrganizationId)
                .HasConstraintName("FK__Events__Organiza__1CBC4616");

            entity.HasOne(d => d.Status).WithMany(p => p.Events)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Events__StatusId__1EA48E88");

            entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.EventUpdatedByNavigations)
                .HasForeignKey(d => d.UpdatedBy)
                .HasConstraintName("FK__Events__UpdatedB__208CD6FA");
        });

        modelBuilder.Entity<EventCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__EventCat__19093A0BA1153BB6");

            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IconUrl).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<EventRegistration>(entity =>
        {
            entity.HasKey(e => e.RegistrationId).HasName("PK__EventReg__6EF588100AADA361");

            entity.HasIndex(e => e.ApplicationDate, "IX_EventRegistrations_ApplicationDate");

            entity.HasIndex(e => e.EventId, "IX_EventRegistrations_EventId");

            entity.HasIndex(e => e.StatusId, "IX_EventRegistrations_StatusId");

            entity.HasIndex(e => e.VolunteerId, "IX_EventRegistrations_VolunteerId");

            entity.HasIndex(e => new { e.EventId, e.VolunteerId }, "UQ__EventReg__AE523EE31829AE66").IsUnique();

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
                .HasConstraintName("FK__EventRegi__Appro__2EDAF651");

            entity.HasOne(d => d.Event).WithMany(p => p.EventRegistrations)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__EventRegi__Event__2BFE89A6");

            entity.HasOne(d => d.RejectedByNavigation).WithMany(p => p.EventRegistrationRejectedByNavigations)
                .HasForeignKey(d => d.RejectedBy)
                .HasConstraintName("FK__EventRegi__Rejec__2FCF1A8A");

            entity.HasOne(d => d.Status).WithMany(p => p.EventRegistrations)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__EventRegi__Statu__2DE6D218");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.EventRegistrations)
                .HasForeignKey(d => d.VolunteerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__EventRegi__Volun__2CF2ADDF");
        });

        modelBuilder.Entity<EventStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__EventSta__C8EE206328B89F62");

            entity.ToTable("EventStatus");

            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.StatusName).HasMaxLength(50);
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4BEDD68F42C8CD");

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
                .HasConstraintName("FK__Feedback__Catego__719CDDE7");

            entity.HasOne(d => d.Event).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__Feedback__EventI__6FB49575");

            entity.HasOne(d => d.RespondedByNavigation).WithMany(p => p.FeedbackRespondedByNavigations)
                .HasForeignKey(d => d.RespondedBy)
                .HasConstraintName("FK__Feedback__Respon__72910220");

            entity.HasOne(d => d.User).WithMany(p => p.FeedbackUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Feedback__UserId__70A8B9AE");
        });

        modelBuilder.Entity<FeedbackCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Feedback__19093A0B2A3E7718");

            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E1293B3D0E3");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsRead).HasDefaultValue(false);
            entity.Property(e => e.SendDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Title).HasMaxLength(200);

            entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Notificat__UserI__2CBDA3B5");
        });

        modelBuilder.Entity<OnSiteTask>(entity =>
        {
            entity.HasKey(e => e.TaskId).HasName("PK__OnSiteTa__7C6949B17AE40AC0");

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
                .HasConstraintName("FK__OnSiteTas__Categ__503BEA1C");

            entity.HasOne(d => d.CompletedByNavigation).WithMany(p => p.OnSiteTaskCompletedByNavigations)
                .HasForeignKey(d => d.CompletedBy)
                .HasConstraintName("FK__OnSiteTas__Compl__5224328E");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.OnSiteTaskCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__OnSiteTas__Creat__540C7B00");

            entity.HasOne(d => d.Event).WithMany(p => p.OnSiteTasks)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__OnSiteTas__Event__4F47C5E3");

            entity.HasOne(d => d.Status).WithMany(p => p.OnSiteTasks)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OnSiteTas__Statu__51300E55");

            entity.HasOne(d => d.VerifiedByNavigation).WithMany(p => p.OnSiteTaskVerifiedByNavigations)
                .HasForeignKey(d => d.VerifiedBy)
                .HasConstraintName("FK__OnSiteTas__Verif__531856C7");
        });

        modelBuilder.Entity<Organization>(entity =>
        {
            entity.HasKey(e => e.OrganizationId).HasName("PK__Organiza__CADB0B12EFC0F689");

            entity.HasIndex(e => e.IsVerified, "IX_Organizations_IsVerified");

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
                .HasConstraintName("FK__Organizat__TypeI__6B24EA82");

            entity.HasOne(d => d.User).WithMany(p => p.OrganizationUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Organizat__UserI__6A30C649");

            entity.HasOne(d => d.VerifiedByNavigation).WithMany(p => p.OrganizationVerifiedByNavigations)
                .HasForeignKey(d => d.VerifiedBy)
                .HasConstraintName("FK__Organizat__Verif__6C190EBB");
        });

        modelBuilder.Entity<OrganizationType>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PK__Organiza__516F03B58B844DAE");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.TypeName).HasMaxLength(100);
        });

        modelBuilder.Entity<Partner>(entity =>
        {
            entity.HasKey(e => e.PartnerId).HasName("PK__Partners__39FD6312BF4095E9");

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
                .HasConstraintName("FK__Partners__Indust__7A672E12");

            entity.HasOne(d => d.User).WithMany(p => p.PartnerUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Partners__UserId__797309D9");

            entity.HasOne(d => d.VerifiedByNavigation).WithMany(p => p.PartnerVerifiedByNavigations)
                .HasForeignKey(d => d.VerifiedBy)
                .HasConstraintName("FK__Partners__Verifi__7B5B524B");
        });

        modelBuilder.Entity<PartnerCollaboration>(entity =>
        {
            entity.HasKey(e => e.CollaborationId).HasName("PK__PartnerC__4F81366461931741");

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
                .HasConstraintName("FK__PartnerCo__Organ__251C81ED");

            entity.HasOne(d => d.Partner).WithMany(p => p.PartnerCollaborations)
                .HasForeignKey(d => d.PartnerId)
                .HasConstraintName("FK__PartnerCo__Partn__2610A626");

            entity.HasOne(d => d.Type).WithMany(p => p.PartnerCollaborations)
                .HasForeignKey(d => d.TypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PartnerCo__TypeI__2704CA5F");
        });

        modelBuilder.Entity<PartnerIndustry>(entity =>
        {
            entity.HasKey(e => e.IndustryId).HasName("PK__PartnerI__808DEDCC1C14EEB1");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IndustryName).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<RegistrationStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__Registra__C8EE206354768A7A");

            entity.ToTable("RegistrationStatus");

            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.StatusName).HasMaxLength(50);
        });

        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("PK__Reports__D5BD480564A784CF");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.GeneratedDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.ReportType).HasMaxLength(50);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Reports)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Reports__Created__3552E9B6");
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(e => e.PermissionId).HasName("PK__RolePerm__EFA6FB2FA9C9FCC2");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.PermissionName).HasMaxLength(100);

            entity.HasOne(d => d.Role).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.RoleId)
                .HasConstraintName("FK__RolePermi__RoleI__39237A9A");
        });

        modelBuilder.Entity<Skill>(entity =>
        {
            entity.HasKey(e => e.SkillId).HasName("PK__Skills__DFA091877F3023C0");

            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.SkillName).HasMaxLength(100);
        });

        modelBuilder.Entity<SupportCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__SupportC__19093A0BDF51C12A");

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
            entity.HasKey(e => e.RequestId).HasName("PK__SupportR__33A8517AF4365498");

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
                .HasConstraintName("FK__SupportRe__Assig__13F1F5EB");

            entity.HasOne(d => d.Category).WithMany(p => p.SupportRequests)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SupportRe__Categ__12FDD1B2");

            entity.HasOne(d => d.ResolvedByNavigation).WithMany(p => p.SupportRequestResolvedByNavigations)
                .HasForeignKey(d => d.ResolvedBy)
                .HasConstraintName("FK__SupportRe__Resol__14E61A24");

            entity.HasOne(d => d.User).WithMany(p => p.SupportRequestUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SupportRe__UserI__1209AD79");
        });

        modelBuilder.Entity<SupportRequestComment>(entity =>
        {
            entity.HasKey(e => e.CommentId).HasName("PK__SupportR__C3B4DFCA32AC27E8");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsInternal).HasDefaultValue(false);

            entity.HasOne(d => d.Request).WithMany(p => p.SupportRequestComments)
                .HasForeignKey(d => d.RequestId)
                .HasConstraintName("FK__SupportRe__Reque__19AACF41");

            entity.HasOne(d => d.User).WithMany(p => p.SupportRequestComments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SupportRe__UserI__1A9EF37A");
        });

        modelBuilder.Entity<TaskAssignment>(entity =>
        {
            entity.HasKey(e => e.AssignmentId).HasName("PK__TaskAssi__32499E774A43E2A3");

            entity.HasIndex(e => new { e.TaskId, e.VolunteerId }, "UQ__TaskAssi__AB7FBF42E17340A4").IsUnique();

            entity.Property(e => e.AssignedDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.HoursWorked).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.Notes).HasMaxLength(1000);
            entity.Property(e => e.Performance).HasMaxLength(20);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.AssignedByNavigation).WithMany(p => p.TaskAssignments)
                .HasForeignKey(d => d.AssignedBy)
                .HasConstraintName("FK__TaskAssig__Assig__5CA1C101");

            entity.HasOne(d => d.Task).WithMany(p => p.TaskAssignments)
                .HasForeignKey(d => d.TaskId)
                .HasConstraintName("FK__TaskAssig__TaskI__5AB9788F");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.TaskAssignments)
                .HasForeignKey(d => d.VolunteerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TaskAssig__Volun__5BAD9CC8");
        });

        modelBuilder.Entity<TaskCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__TaskCate__19093A0B31B137DB");

            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<TaskStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__TaskStat__C8EE20633CED797A");

            entity.ToTable("TaskStatus");

            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.StatusName).HasMaxLength(50);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C3F0285B1");

            entity.HasIndex(e => e.Email, "IX_Users_Email");

            entity.HasIndex(e => e.RoleId, "IX_Users_RoleId");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D105347B44906D").IsUnique();

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
            entity.HasKey(e => e.ProfileId).HasName("PK__UserProf__290C88E468A655CC");

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
                .HasConstraintName("FK__UserProfi__UserI__46E78A0C");
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__UserRole__8AFACE1A8F72A646");

            entity.HasIndex(e => e.RoleName, "UQ__UserRole__8A2B61602217437E").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.RoleName).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<VolunteerCoordinator>(entity =>
        {
            entity.HasKey(e => e.CoordinatorId).HasName("PK__Voluntee__91C373DF635B3EB0");

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
                .HasConstraintName("FK__Volunteer__Creat__03F0984C");

            entity.HasOne(d => d.Manager).WithMany(p => p.VolunteerCoordinatorManagers)
                .HasForeignKey(d => d.ManagerId)
                .HasConstraintName("FK__Volunteer__Manag__02FC7413");

            entity.HasOne(d => d.Organization).WithMany(p => p.VolunteerCoordinatorOrganizations)
                .HasForeignKey(d => d.OrganizationId)
                .HasConstraintName("FK__Volunteer__Organ__02084FDA");

            entity.HasOne(d => d.RequestedByNavigation).WithMany(p => p.VolunteerCoordinatorRequestedByNavigations)
                .HasForeignKey(d => d.RequestedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Volunteer__Reque__04E4BC85");

            entity.HasOne(d => d.User).WithMany(p => p.VolunteerCoordinatorUsers)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Volunteer__UserI__01142BA1");
        });

        modelBuilder.Entity<VolunteerProfile>(entity =>
        {
            entity.HasKey(e => e.VolunteerId).HasName("PK__Voluntee__716F6F2C599D2FE6");

            entity.HasIndex(e => e.IsVerified, "IX_VolunteerProfiles_IsVerified");

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
                .HasConstraintName("FK__Volunteer__UserI__5441852A");

            entity.HasOne(d => d.VerifiedByNavigation).WithMany(p => p.VolunteerProfileVerifiedByNavigations)
                .HasForeignKey(d => d.VerifiedBy)
                .HasConstraintName("FK__Volunteer__Verif__5535A963");
        });

        modelBuilder.Entity<VolunteerSchedule>(entity =>
        {
            entity.HasKey(e => e.ScheduleId).HasName("PK__Voluntee__9C8A5B494CBF337F");

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
                .HasConstraintName("FK__Volunteer__Creat__3864608B");

            entity.HasOne(d => d.Event).WithMany(p => p.VolunteerSchedules)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__Volunteer__Event__37703C52");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.VolunteerSchedules)
                .HasForeignKey(d => d.VolunteerId)
                .HasConstraintName("FK__Volunteer__Volun__367C1819");
        });

        modelBuilder.Entity<VolunteerSkill>(entity =>
        {
            entity.HasKey(e => new { e.VolunteerId, e.SkillId }).HasName("PK__Voluntee__1C9566341973771A");

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
                .HasConstraintName("FK__Volunteer__Skill__5BE2A6F2");

            entity.HasOne(d => d.Volunteer).WithMany(p => p.VolunteerSkills)
                .HasForeignKey(d => d.VolunteerId)
                .HasConstraintName("FK__Volunteer__Volun__5AEE82B9");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
