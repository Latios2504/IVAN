using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PartnershipType",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PartnershipType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SupportRequestCategory",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Icon = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Color = table.Column<string>(type: "nvarchar(7)", maxLength: 7, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupportRequestCategory", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    EmailVerified = table.Column<bool>(type: "bit", nullable: false),
                    LastLogin = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OrganizationProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    OrganizationName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    OrganizationType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    RegistrationNumber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    TaxId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    MissionStatement = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    WebsiteUrl = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    State = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    PostalCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Country = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ContactPersonName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ContactPersonTitle = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ContactPersonEmail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ContactPersonPhone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    LogoUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    BannerUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    SocialMediaLinks = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    FoundedYear = table.Column<short>(type: "smallint", nullable: true),
                    EmployeeCount = table.Column<int>(type: "int", nullable: true),
                    AnnualBudget = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    FocusAreas = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    IsVerified = table.Column<bool>(type: "bit", nullable: true),
                    VerificationDocuments = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrganizationProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrganizationProfiles_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PartnerProfile",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PartnerName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    PartnerType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Industry = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CompanySize = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ServicesOffered = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    WebsiteUrl = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    State = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    PostalCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Country = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    PrimaryContactName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    PrimaryContactTitle = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    PrimaryContactEmail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    PrimaryContactPhone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    LogoUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    PartnershipInterests = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ResourcesAvailable = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CsrFocusAreas = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    AnnualContributionBudget = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PreferredPartnershipTypes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PartnerProfile", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PartnerProfile_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Event",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrganizationId = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Objectives = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Location = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    State = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    PostalCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Country = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Latitude = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Longitude = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time", nullable: true),
                    EndTime = table.Column<TimeOnly>(type: "time", nullable: true),
                    RegistrationStartDate = table.Column<DateOnly>(type: "date", nullable: true),
                    RegistrationEndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    MaxVolunteers = table.Column<int>(type: "int", nullable: true),
                    MinVolunteers = table.Column<int>(type: "int", nullable: true),
                    CurrentVolunteers = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Visibility = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Requirements = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Benefits = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    MaterialsProvided = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    WhatToBring = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    AgeRequirementMin = table.Column<int>(type: "int", nullable: true),
                    AgeRequirementMax = table.Column<int>(type: "int", nullable: true),
                    SkillRequirements = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    PhysicalRequirements = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    BackgroundCheckRequired = table.Column<bool>(type: "bit", nullable: true),
                    TransportationProvided = table.Column<bool>(type: "bit", nullable: true),
                    MealsProvided = table.Column<bool>(type: "bit", nullable: true),
                    AccommodationProvided = table.Column<bool>(type: "bit", nullable: true),
                    InsuranceProvided = table.Column<bool>(type: "bit", nullable: true),
                    CertificateProvided = table.Column<bool>(type: "bit", nullable: true),
                    CoverImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    GalleryImages = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ContactEmail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ContactPhone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    EmergencyContact = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Tags = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    IsRecurring = table.Column<bool>(type: "bit", nullable: true),
                    RecurringPattern = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ParentEventId = table.Column<int>(type: "int", nullable: true),
                    EstimatedImpact = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Budget = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    FundraisingGoal = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    CurrentFundsRaised = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ApprovalStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ApprovedBy = table.Column<int>(type: "int", nullable: true),
                    ApprovedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ApprovedByNavigationId = table.Column<int>(type: "int", nullable: true),
                    OrganizationProfileId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Event", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Event_OrganizationProfiles_OrganizationProfileId",
                        column: x => x.OrganizationProfileId,
                        principalTable: "OrganizationProfiles",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Event_User_ApprovedByNavigationId",
                        column: x => x.ApprovedByNavigationId,
                        principalTable: "User",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PartnerCollaboration",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PartnerId = table.Column<int>(type: "int", nullable: false),
                    OrganizationId = table.Column<int>(type: "int", nullable: true),
                    EventId = table.Column<int>(type: "int", nullable: true),
                    PartnershipTypeId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ContributionType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FinancialContribution = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    InKindValue = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ServicesDescription = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Deliverables = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    TermsAndConditions = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ContactPersonPartner = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ContactPersonOrganization = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    PerformanceMetrics = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    SuccessCriteria = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ReportingRequirements = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ContractUrl = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    RenewalDate = table.Column<DateOnly>(type: "date", nullable: true),
                    IsRenewable = table.Column<bool>(type: "bit", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    ApprovedBy = table.Column<int>(type: "int", nullable: true),
                    ApprovedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PartnerCollaboration", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PartnerCollaboration_Event_EventId",
                        column: x => x.EventId,
                        principalTable: "Event",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PartnerCollaboration_OrganizationProfiles_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "OrganizationProfiles",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PartnerCollaboration_PartnerProfile_PartnerId",
                        column: x => x.PartnerId,
                        principalTable: "PartnerProfile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PartnerCollaboration_PartnershipType_PartnershipTypeId",
                        column: x => x.PartnershipTypeId,
                        principalTable: "PartnershipType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PartnerCollaboration_User_ApprovedBy",
                        column: x => x.ApprovedBy,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PartnerCollaboration_User_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SupportRequest",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TicketNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Priority = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    RequestedBy = table.Column<int>(type: "int", nullable: true),
                    RequesterEmail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    RequesterPhone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    RequesterName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    OrganizationId = table.Column<int>(type: "int", nullable: true),
                    EventId = table.Column<int>(type: "int", nullable: true),
                    AssignedTo = table.Column<int>(type: "int", nullable: true),
                    Resolution = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    InternalNotes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Attachments = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ResolvedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ClosedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    SatisfactionRating = table.Column<int>(type: "int", nullable: true),
                    SatisfactionFeedback = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AssignedToNavigationId = table.Column<int>(type: "int", nullable: true),
                    RequestedByNavigationId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupportRequest", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SupportRequest_Event_EventId",
                        column: x => x.EventId,
                        principalTable: "Event",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SupportRequest_OrganizationProfiles_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "OrganizationProfiles",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SupportRequest_SupportRequestCategory_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "SupportRequestCategory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SupportRequest_User_AssignedToNavigationId",
                        column: x => x.AssignedToNavigationId,
                        principalTable: "User",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SupportRequest_User_RequestedByNavigationId",
                        column: x => x.RequestedByNavigationId,
                        principalTable: "User",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Event_ApprovedByNavigationId",
                table: "Event",
                column: "ApprovedByNavigationId");

            migrationBuilder.CreateIndex(
                name: "IX_Event_OrganizationProfileId",
                table: "Event",
                column: "OrganizationProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_OrganizationProfiles_UserId",
                table: "OrganizationProfiles",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PartnerCollaboration_ApprovedBy",
                table: "PartnerCollaboration",
                column: "ApprovedBy");

            migrationBuilder.CreateIndex(
                name: "IX_PartnerCollaboration_CreatedBy",
                table: "PartnerCollaboration",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_PartnerCollaboration_EventId",
                table: "PartnerCollaboration",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_PartnerCollaboration_OrganizationId",
                table: "PartnerCollaboration",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_PartnerCollaboration_PartnerId",
                table: "PartnerCollaboration",
                column: "PartnerId");

            migrationBuilder.CreateIndex(
                name: "IX_PartnerCollaboration_PartnershipTypeId",
                table: "PartnerCollaboration",
                column: "PartnershipTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PartnerProfile_UserId",
                table: "PartnerProfile",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SupportRequest_AssignedToNavigationId",
                table: "SupportRequest",
                column: "AssignedToNavigationId");

            migrationBuilder.CreateIndex(
                name: "IX_SupportRequest_CategoryId",
                table: "SupportRequest",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_SupportRequest_EventId",
                table: "SupportRequest",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_SupportRequest_OrganizationId",
                table: "SupportRequest",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_SupportRequest_RequestedByNavigationId",
                table: "SupportRequest",
                column: "RequestedByNavigationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PartnerCollaboration");

            migrationBuilder.DropTable(
                name: "SupportRequest");

            migrationBuilder.DropTable(
                name: "PartnerProfile");

            migrationBuilder.DropTable(
                name: "PartnershipType");

            migrationBuilder.DropTable(
                name: "Event");

            migrationBuilder.DropTable(
                name: "SupportRequestCategory");

            migrationBuilder.DropTable(
                name: "OrganizationProfiles");

            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
