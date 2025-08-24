-- =========================================================
-- VIETNAM VOLUNTEER MANAGEMENT SYSTEM DATABASE SCHEMA
-- Version: 2.0 - Organized with Vietnamese Unicode Support
-- Database: MS SQL Server Compatible
-- Description: Complete
-- =========================================================

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

-- Create database with Vietnamese collation support
-- DROP DATABASE IF EXISTS VolunteerManagementSystem;
CREATE DATABASE VolunteerManagementSystem
COLLATE Vietnamese_CI_AS;
GO

-- Use the database
USE VolunteerManagementSystem;
GO

-- Set Vietnamese collation and date format for session
SET DATEFORMAT dmy;
GO

-- Add database level configuration for Vietnamese character support
ALTER DATABASE VolunteerManagementSystem
SET ALLOW_SNAPSHOT_ISOLATION ON;
GO

ALTER DATABASE VolunteerManagementSystem  
SET READ_COMMITTED_SNAPSHOT ON;
GO

-- =========================================================
-- SECTION 1: USER MANAGEMENT TABLES
-- =========================================================

-- User Roles Table
CREATE TABLE UserRoles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Base Users Table  
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Salt NVARCHAR(100) NOT NULL,
    RoleId INT NOT NULL,
    IsActive BIT DEFAULT 1,
    IsEmailVerified BIT DEFAULT 0,
    EmailVerificationToken NVARCHAR(255),
    PasswordResetToken NVARCHAR(255),
    PasswordResetExpiry DATETIME2,
    LastLoginAt DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (RoleId) REFERENCES UserRoles(RoleId)
);

-- User Profiles Table
CREATE TABLE UserProfiles (
    ProfileId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    FullName AS (FirstName + ' ' + LastName) PERSISTED,
    PhoneNumber NVARCHAR(20),
    DateOfBirth DATE,
    Gender NVARCHAR(10),
    Avatar NVARCHAR(500),
    Address NVARCHAR(500),
    WardCommune NVARCHAR(100),
    District NVARCHAR(100),
    Province NVARCHAR(100),
    PostalCode NVARCHAR(10),
    EmergencyContactName NVARCHAR(200),
    EmergencyContactPhone NVARCHAR(20),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

-- =========================================================
-- SECTION 2: VOLUNTEER MANAGEMENT TABLES
-- =========================================================

-- Skills Table
CREATE TABLE Skills (
    SkillId INT IDENTITY(1,1) PRIMARY KEY,
    SkillName NVARCHAR(100) NOT NULL,
    Category NVARCHAR(100),
    Description NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Volunteer Profiles Table
CREATE TABLE VolunteerProfiles (
    VolunteerId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    StudentId NVARCHAR(50) NULL,
    University NVARCHAR(200) NULL,
    Major NVARCHAR(200) NULL,
    YearOfStudy INT NULL,
    Motivation NVARCHAR(1000),
    Experience NVARCHAR(1000),
    Availability NVARCHAR(500),
    VolunteerHours INT DEFAULT 0,
    Rating DECIMAL(3,2) DEFAULT 0,
    RatingCount INT DEFAULT 0,
    IsVerified BIT DEFAULT 0,
    VerifiedAt DATETIME2,
    VerifiedBy INT,
    LastActiveDate DATETIME2,
    TotalHoursVolunteered INT DEFAULT 0,
    Skills NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (VerifiedBy) REFERENCES Users(UserId)
);

-- Volunteer Skills Junction Table
CREATE TABLE VolunteerSkills (
    VolunteerId INT NOT NULL,
    SkillId INT NOT NULL,
    ProficiencyLevel NVARCHAR(20) DEFAULT N'Cơ bản',
    YearsOfExperience INT DEFAULT 0,
    Description NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    PRIMARY KEY (VolunteerId, SkillId),
    FOREIGN KEY (VolunteerId) REFERENCES VolunteerProfiles(VolunteerId) ON DELETE CASCADE,
    FOREIGN KEY (SkillId) REFERENCES Skills(SkillId) ON DELETE CASCADE
);

-- =========================================================
-- SECTION 3: ORGANIZATION MANAGEMENT TABLES
-- =========================================================

-- Organization Types
CREATE TABLE OrganizationTypes (
    TypeId INT IDENTITY(1,1) PRIMARY KEY,
    TypeName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Organizations
CREATE TABLE Organizations (
    OrganizationId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    OrganizationName NVARCHAR(200) NOT NULL,
    ShortName NVARCHAR(50),
    TypeId INT NOT NULL,
    TaxCode NVARCHAR(50),
    BusinessLicense NVARCHAR(100),
    EstablishedYear INT,
    Website NVARCHAR(200),
    FacebookPage NVARCHAR(200),
    LinkedInPage NVARCHAR(200),
    Description NVARCHAR(2000),
    Mission NVARCHAR(1000),
    Vision NVARCHAR(1000),
    Address NVARCHAR(500),
    WardCommune NVARCHAR(100),
    District NVARCHAR(100),
    Province NVARCHAR(100),
    PostalCode NVARCHAR(10),
    ContactPersonName NVARCHAR(200),
    ContactPersonTitle NVARCHAR(100),
    ContactEmail NVARCHAR(255),
    ContactPhone NVARCHAR(20),
    LogoUrl NVARCHAR(500),
    BannerUrl NVARCHAR(500),
    IsVerified BIT DEFAULT 0,
    VerifiedAt DATETIME2,
    VerifiedBy INT,
    Rating DECIMAL(3,2) DEFAULT 0,
    RatingCount INT DEFAULT 0,
    TotalEvents INT DEFAULT 0,
    TotalVolunteers INT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE NO ACTION,
    FOREIGN KEY (TypeId) REFERENCES OrganizationTypes(TypeId),
    FOREIGN KEY (VerifiedBy) REFERENCES Users(UserId)
);

-- =========================================================
-- SECTION 4: PARTNER MANAGEMENT TABLES
-- =========================================================

-- Partner Industries
CREATE TABLE PartnerIndustries (
    IndustryId INT IDENTITY(1,1) PRIMARY KEY,
    IndustryName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Partners
CREATE TABLE Partners (
    PartnerId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    CompanyName NVARCHAR(200) NOT NULL,
    IndustryId INT NOT NULL,
    TaxCode NVARCHAR(50),
    BusinessLicense NVARCHAR(100),
    Website NVARCHAR(200),
    Description NVARCHAR(2000),
    Address NVARCHAR(500),
    WardCommune NVARCHAR(100),
    District NVARCHAR(100),
    Province NVARCHAR(100),
    PostalCode NVARCHAR(10),
    ContactPersonName NVARCHAR(200),
    ContactPersonTitle NVARCHAR(100),
    ContactEmail NVARCHAR(255),
    ContactPhone NVARCHAR(20),
    LogoUrl NVARCHAR(500),
    IsVerified BIT DEFAULT 0,
    VerifiedAt DATETIME2,
    VerifiedBy INT,
    Rating DECIMAL(3,2) DEFAULT 0,
    RatingCount INT DEFAULT 0,
    TotalCollaborations INT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE NO ACTION,
    FOREIGN KEY (IndustryId) REFERENCES PartnerIndustries(IndustryId),
    FOREIGN KEY (VerifiedBy) REFERENCES Users(UserId)
);

-- =========================================================
-- SECTION 5: VOLUNTEER COORDINATOR MANAGEMENT TABLES
-- =========================================================

-- Volunteer Coordinators
CREATE TABLE VolunteerCoordinators (
    CoordinatorId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    OrganizationId INT NOT NULL,
    EmployeeId NVARCHAR(50),
    Position NVARCHAR(100),
    Department NVARCHAR(100),
    Responsibilities NVARCHAR(1000),
    HireDate DATE,
    EndDate DATE,
    Salary DECIMAL(15,2),
    ManagerId INT,
    IsActive BIT DEFAULT 1,
    Notes NVARCHAR(1000),
    CreatedBy INT NOT NULL,
    RequestedBy INT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (OrganizationId) REFERENCES Organizations(OrganizationId) ON DELETE CASCADE,
    FOREIGN KEY (ManagerId) REFERENCES Users(UserId),
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserId),
    FOREIGN KEY (RequestedBy) REFERENCES Organizations(OrganizationId)
);

-- =========================================================
-- SECTION 6: EVENT MANAGEMENT TABLES
-- =========================================================

-- Event Categories
CREATE TABLE EventCategories (
    CategoryId INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    IconUrl NVARCHAR(500),
    Color NVARCHAR(7),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Event Status
CREATE TABLE EventStatus (
    StatusId INT IDENTITY(1,1) PRIMARY KEY,
    StatusName NVARCHAR(50) NOT NULL,
    Description NVARCHAR(500),
    Color NVARCHAR(7),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Events
CREATE TABLE Events (
    EventId INT IDENTITY(1,1) PRIMARY KEY,
    OrganizationId INT NOT NULL,
    EventName NVARCHAR(300) NOT NULL,
    CategoryId INT NOT NULL,
    StatusId INT NOT NULL,
    Description NVARCHAR(MAX),
    ShortDescription NVARCHAR(500),
    StartDate DATETIME2 NOT NULL,
    EndDate DATETIME2 NOT NULL,
    RegistrationStartDate DATETIME2,
    RegistrationEndDate DATETIME2,
    Location NVARCHAR(500),
    DetailedAddress NVARCHAR(1000),
    WardCommune NVARCHAR(100),
    District NVARCHAR(100),
    Province NVARCHAR(100),
    Latitude DECIMAL(10, 8),
    Longitude DECIMAL(11, 8),
    MaxVolunteers INT,
    MinVolunteers INT DEFAULT 1,
    CurrentVolunteers INT DEFAULT 0,
    RequiredSkills NVARCHAR(1000),
    AgeRequirement NVARCHAR(100),
    GenderRequirement NVARCHAR(20),
    Requirements NVARCHAR(2000),
    Benefits NVARCHAR(2000),
    ContactPerson NVARCHAR(200),
    ContactPhone NVARCHAR(20),
    ContactEmail NVARCHAR(255),
    BannerImageUrl NVARCHAR(500),
    GalleryImages NVARCHAR(MAX),
    IsFeatured BIT DEFAULT 0,
    IsUrgent BIT DEFAULT 0,
    Priority INT DEFAULT 0,
    ViewCount INT DEFAULT 0,
    RegistrationCount INT DEFAULT 0,
    CompletedVolunteers INT DEFAULT 0,
    Rating DECIMAL(3,2) DEFAULT 0,
    RatingCount INT DEFAULT 0,
    Budget DECIMAL(15,2),
    Currency NVARCHAR(3) DEFAULT 'VND',
    EventType NVARCHAR(100),
    MaxParticipants INT,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    CreatedBy INT,
    UpdatedBy INT,
    FOREIGN KEY (OrganizationId) REFERENCES Organizations(OrganizationId) ON DELETE CASCADE,
    FOREIGN KEY (CategoryId) REFERENCES EventCategories(CategoryId),
    FOREIGN KEY (StatusId) REFERENCES EventStatus(StatusId),
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserId),
    FOREIGN KEY (UpdatedBy) REFERENCES Users(UserId)
);

-- =========================================================
-- SECTION 7: REGISTRATION MANAGEMENT TABLES
-- =========================================================

-- Registration Status
CREATE TABLE RegistrationStatus (
    StatusId INT IDENTITY(1,1) PRIMARY KEY,
    StatusName NVARCHAR(50) NOT NULL,
    Description NVARCHAR(500),
    Color NVARCHAR(7),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Event Registrations
CREATE TABLE EventRegistrations (
    RegistrationId INT IDENTITY(1,1) PRIMARY KEY,
    EventId INT NOT NULL,
    VolunteerId INT NOT NULL,
    StatusId INT NOT NULL,
    ApplicationDate DATETIME2 DEFAULT GETDATE(),
    ApprovedDate DATETIME2,
    ApprovedBy INT,
    RejectedDate DATETIME2,
    RejectedBy INT,
    RejectionReason NVARCHAR(1000),
    CancelledDate DATETIME2,
    CancellationReason NVARCHAR(1000),
    MotivationLetter NVARCHAR(2000),
    AdditionalInfo NVARCHAR(1000),
    AttendanceStatus NVARCHAR(50),
    CheckInTime DATETIME2,
    CheckOutTime DATETIME2,
    ActualHours DECIMAL(5,2),
    Performance NVARCHAR(20),
    PerformanceNotes NVARCHAR(1000),
    CertificateIssued BIT DEFAULT 0,
    CertificateIssuedDate DATETIME2,
    Rating INT,
    Review NVARCHAR(1000),
    RegistrationDate DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (EventId) REFERENCES Events(EventId) ON DELETE CASCADE,
    FOREIGN KEY (VolunteerId) REFERENCES VolunteerProfiles(VolunteerId) ON DELETE NO ACTION,
    FOREIGN KEY (StatusId) REFERENCES RegistrationStatus(StatusId),
    FOREIGN KEY (ApprovedBy) REFERENCES Users(UserId),
    FOREIGN KEY (RejectedBy) REFERENCES Users(UserId),
    UNIQUE(EventId, VolunteerId)
);

-- =========================================================
-- SECTION 8: SCHEDULE MANAGEMENT TABLES
-- =========================================================

-- Volunteer Schedules
CREATE TABLE VolunteerSchedules (
    ScheduleId INT IDENTITY(1,1) PRIMARY KEY,
    VolunteerId INT NOT NULL,
    EventId INT,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    StartDateTime DATETIME2 NOT NULL,
    EndDateTime DATETIME2 NOT NULL,
    Location NVARCHAR(500),
    ScheduleType NVARCHAR(50),
    Priority NVARCHAR(20),
    Status NVARCHAR(50),
    IsAllDay BIT DEFAULT 0,
    ReminderMinutes INT DEFAULT 60,
    Notes NVARCHAR(1000),
    CreatedBy INT,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (VolunteerId) REFERENCES VolunteerProfiles(VolunteerId) ON DELETE CASCADE,
    FOREIGN KEY (EventId) REFERENCES Events(EventId),
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);

-- Coordinator Schedules
CREATE TABLE CoordinatorSchedules (
    ScheduleId INT IDENTITY(1,1) PRIMARY KEY,
    CoordinatorId INT NOT NULL,
    EventId INT,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    StartDateTime DATETIME2 NOT NULL,
    EndDateTime DATETIME2 NOT NULL,
    Location NVARCHAR(500),
    ScheduleType NVARCHAR(50),
    Priority NVARCHAR(20),
    Status NVARCHAR(50),
    IsAllDay BIT DEFAULT 0,
    ReminderMinutes INT DEFAULT 60,
    Notes NVARCHAR(1000),
    CreatedBy INT,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (CoordinatorId) REFERENCES VolunteerCoordinators(CoordinatorId) ON DELETE NO ACTION,
    FOREIGN KEY (EventId) REFERENCES Events(EventId),
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);

-- =========================================================
-- SECTION 9: TASK MANAGEMENT TABLES
-- =========================================================

-- Task Categories
CREATE TABLE TaskCategories (
    CategoryId INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    Color NVARCHAR(7),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Task Status
CREATE TABLE TaskStatus (
    StatusId INT IDENTITY(1,1) PRIMARY KEY,
    StatusName NVARCHAR(50) NOT NULL,
    Description NVARCHAR(500),
    Color NVARCHAR(7),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- On-Site Tasks
CREATE TABLE OnSiteTasks (
    TaskId INT IDENTITY(1,1) PRIMARY KEY,
    EventId INT NOT NULL,
    CategoryId INT NOT NULL,
    StatusId INT NOT NULL,
    TaskName NVARCHAR(200) NOT NULL,
    Description NVARCHAR(2000),
    StartTime DATETIME2,
    EndTime DATETIME2,
    EstimatedHours DECIMAL(5,2),
    ActualHours DECIMAL(5,2),
    Location NVARCHAR(500),
    RequiredVolunteers INT DEFAULT 1,
    AssignedVolunteers INT DEFAULT 0,
    RequiredSkills NVARCHAR(1000),
    Priority NVARCHAR(20),
    Difficulty NVARCHAR(20),
    Instructions NVARCHAR(MAX),
    Materials NVARCHAR(1000),
    SafetyRequirements NVARCHAR(1000),
    CompletionCriteria NVARCHAR(1000),
    CompletedAt DATETIME2,
    CompletedBy INT,
    VerifiedBy INT,
    Notes NVARCHAR(1000),
    CreatedBy INT,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (EventId) REFERENCES Events(EventId) ON DELETE CASCADE,
    FOREIGN KEY (CategoryId) REFERENCES TaskCategories(CategoryId),
    FOREIGN KEY (StatusId) REFERENCES TaskStatus(StatusId),
    FOREIGN KEY (CompletedBy) REFERENCES Users(UserId),
    FOREIGN KEY (VerifiedBy) REFERENCES Users(UserId),
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);

-- Task Assignments
CREATE TABLE TaskAssignments (
    AssignmentId INT IDENTITY(1,1) PRIMARY KEY,
    TaskId INT NOT NULL,
    VolunteerId INT NOT NULL,
    AssignedDate DATETIME2 DEFAULT GETDATE(),
    AssignedBy INT,
    Status NVARCHAR(50),
    StartedAt DATETIME2,
    CompletedAt DATETIME2,
    HoursWorked DECIMAL(5,2),
    Performance NVARCHAR(20),
    Notes NVARCHAR(1000),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (TaskId) REFERENCES OnSiteTasks(TaskId) ON DELETE CASCADE,
    FOREIGN KEY (VolunteerId) REFERENCES VolunteerProfiles(VolunteerId) ON DELETE NO ACTION,
    FOREIGN KEY (AssignedBy) REFERENCES Users(UserId),
    UNIQUE(TaskId, VolunteerId)
);

-- Coordinator Tasks
CREATE TABLE CoordinatorTasks (
    TaskId INT IDENTITY(1,1) PRIMARY KEY,
    EventId INT NOT NULL,
    CoordinatorId INT NOT NULL,
    TaskName NVARCHAR(200) NOT NULL,
    Description NVARCHAR(2000),
    DueDate DATETIME2,
    Priority NVARCHAR(20),
    Status NVARCHAR(50),
    Category NVARCHAR(100),
    EstimatedHours DECIMAL(5,2),
    ActualHours DECIMAL(5,2),
    CompletedAt DATETIME2,
    Notes NVARCHAR(1000),
    CreatedBy INT,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (EventId) REFERENCES Events(EventId) ON DELETE CASCADE,
    FOREIGN KEY (CoordinatorId) REFERENCES VolunteerCoordinators(CoordinatorId) ON DELETE NO ACTION,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);

-- =========================================================
-- SECTION 10: FEEDBACK MANAGEMENT TABLES
-- =========================================================

-- Feedback Categories
CREATE TABLE FeedbackCategories (
    CategoryId INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Feedback
CREATE TABLE Feedback (
    FeedbackId INT IDENTITY(1,1) PRIMARY KEY,
    EventId INT NOT NULL,
    UserId INT NOT NULL,
    CategoryId INT NOT NULL,
    Subject NVARCHAR(300) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    Rating INT,
    IsAnonymous BIT DEFAULT 0,
    Status NVARCHAR(50) DEFAULT 'Pending',
    ResponseContent NVARCHAR(MAX),
    RespondedBy INT,
    RespondedAt DATETIME2,
    IsPublic BIT DEFAULT 0,
    IsVerified BIT DEFAULT 0,
    AttachmentUrls NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (EventId) REFERENCES Events(EventId) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (CategoryId) REFERENCES FeedbackCategories(CategoryId),
    FOREIGN KEY (RespondedBy) REFERENCES Users(UserId)
);

-- =========================================================
-- SECTION 11: CERTIFICATE MANAGEMENT TABLES
-- =========================================================

-- Certificate Templates
CREATE TABLE CertificateTemplates (
    TemplateId INT IDENTITY(1,1) PRIMARY KEY,
    TemplateName NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    TemplateType NVARCHAR(50),
    TemplateDesign NVARCHAR(MAX),
    RequiredFields NVARCHAR(1000),
    OrganizationId INT,
    IsDefault BIT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedBy INT,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (OrganizationId) REFERENCES Organizations(OrganizationId),
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);

-- Certificates
CREATE TABLE Certificates (
    CertificateId INT IDENTITY(1,1) PRIMARY KEY,
    VolunteerId INT NOT NULL,
    EventId INT NOT NULL,
    TemplateId INT NOT NULL,
    CertificateNumber NVARCHAR(100) NOT NULL UNIQUE,
    CertificateName NVARCHAR(300) NOT NULL,
    Description NVARCHAR(1000),
    HoursCompleted DECIMAL(5,2),
    PerformanceLevel NVARCHAR(50),
    IssueDate DATETIME2 DEFAULT GETDATE(),
    ExpiryDate DATETIME2,
    CertificateFileUrl NVARCHAR(500),
    DigitalSignature NVARCHAR(1000),
    VerificationCode NVARCHAR(100) NOT NULL UNIQUE,
    QRCodeUrl NVARCHAR(500),
    IssuedBy INT,
    Status NVARCHAR(50) DEFAULT 'Active',
    DownloadCount INT DEFAULT 0,
    LastDownloadDate DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (VolunteerId) REFERENCES VolunteerProfiles(VolunteerId) ON DELETE CASCADE,
    FOREIGN KEY (EventId) REFERENCES Events(EventId),
    FOREIGN KEY (TemplateId) REFERENCES CertificateTemplates(TemplateId),
    FOREIGN KEY (IssuedBy) REFERENCES Users(UserId)
);

-- =========================================================
-- SECTION 12: SUPPORT REQUEST MANAGEMENT TABLES
-- =========================================================

-- Support Categories
CREATE TABLE SupportCategories (
    CategoryId INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    Priority NVARCHAR(20) DEFAULT 'Medium',
    ExpectedResponseTime INT DEFAULT 24,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Support Requests
CREATE TABLE SupportRequests (
    RequestId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    CategoryId INT NOT NULL,
    Subject NVARCHAR(300) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Priority NVARCHAR(20) DEFAULT 'Medium',
    Status NVARCHAR(50) DEFAULT 'Open',
    AssignedTo INT,
    AssignedDate DATETIME2,
    Resolution NVARCHAR(MAX),
    ResolvedBy INT,
    ResolvedDate DATETIME2,
    SatisfactionRating INT,
    SatisfactionFeedback NVARCHAR(1000),
    AttachmentUrls NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (CategoryId) REFERENCES SupportCategories(CategoryId),
    FOREIGN KEY (AssignedTo) REFERENCES Users(UserId),
    FOREIGN KEY (ResolvedBy) REFERENCES Users(UserId)
);

-- Support Request Comments
CREATE TABLE SupportRequestComments (
    CommentId INT IDENTITY(1,1) PRIMARY KEY,
    RequestId INT NOT NULL,
    UserId INT NOT NULL,
    Comment NVARCHAR(MAX) NOT NULL,
    IsInternal BIT DEFAULT 0,
    AttachmentUrls NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (RequestId) REFERENCES SupportRequests(RequestId) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- =========================================================
-- SECTION 13: COLLABORATION MANAGEMENT TABLES
-- =========================================================

-- Collaboration Types
CREATE TABLE CollaborationTypes (
    TypeId INT IDENTITY(1,1) PRIMARY KEY,
    TypeName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Partner Collaborations
CREATE TABLE PartnerCollaborations (
    CollaborationId INT IDENTITY(1,1) PRIMARY KEY,
    OrganizationId INT NOT NULL,
    PartnerId INT NOT NULL,
    TypeId INT NOT NULL,
    CollaborationName NVARCHAR(300) NOT NULL,
    Description NVARCHAR(2000),
    Objectives NVARCHAR(2000),
    StartDate DATE NOT NULL,
    EndDate DATE,
    Status NVARCHAR(50) DEFAULT 'Active',
    Budget DECIMAL(15,2),
    Currency NVARCHAR(3) DEFAULT 'VND',
    ContractDocumentUrl NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (OrganizationId) REFERENCES Organizations(OrganizationId) ON DELETE NO ACTION,
    FOREIGN KEY (PartnerId) REFERENCES Partners(PartnerId) ON DELETE CASCADE,
    FOREIGN KEY (TypeId) REFERENCES CollaborationTypes(TypeId)
);

-- =========================================================
-- SECTION 14: NOTIFICATION MANAGEMENT TABLES
-- =========================================================

-- Notifications
CREATE TABLE Notifications (
    NotificationId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    SendDate DATETIME2 DEFAULT GETDATE(),
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

-- =========================================================
-- SECTION 15: CHATBOT INTERACTION MANAGEMENT TABLES
-- =========================================================

-- Chatbot Interactions
CREATE TABLE ChatbotInteractions (
    InteractionId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Question NVARCHAR(MAX) NOT NULL,
    Response NVARCHAR(MAX) NOT NULL,
    InteractionDate DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

-- =========================================================
-- SECTION 16: REPORT MANAGEMENT TABLES
-- =========================================================

-- Reports
CREATE TABLE Reports (
    ReportId INT IDENTITY(1,1) PRIMARY KEY,
    ReportType NVARCHAR(50) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    GeneratedDate DATETIME2 DEFAULT GETDATE(),
    CreatedBy INT,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);

-- =========================================================
-- SECTION 17: ROLE PERMISSION MANAGEMENT TABLES
-- =========================================================

-- Role Permissions
CREATE TABLE RolePermissions (
    PermissionId INT IDENTITY(1,1) PRIMARY KEY,
    RoleId INT NOT NULL,
    PermissionName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (RoleId) REFERENCES UserRoles(RoleId) ON DELETE CASCADE
);

-- =========================================================
-- SECTION 18: AI SYSTEM TABLES
-- =========================================================

CREATE TABLE AiCustomInstructions (
    InstructionId INT PRIMARY KEY IDENTITY,
    InstructionName NVARCHAR(200) NOT NULL,
    SystemPrompt NVARCHAR(MAX) NOT NULL,
    BehaviorInstructions NVARCHAR(MAX),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE [TableSchemas] (
    [Id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [TableName] NVARCHAR(255) NOT NULL,           -- Exact name of the table in the DB
    [Description] NVARCHAR(MAX) NULL              -- Optional human-readable description
);

CREATE TABLE [TableKeywords] (
    [Id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [TableSchemaId] INT NOT NULL,
    [Keyword] NVARCHAR(255) NOT NULL,
    FOREIGN KEY (TableSchemaId) REFERENCES TableSchemas(Id) ON DELETE CASCADE
);

CREATE TABLE [TableColumns] (
    [Id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [TableSchemaId] INT NOT NULL,
    [ColumnName] NVARCHAR(255) NOT NULL,
    [DataType] NVARCHAR(100) NULL, -- optional: can help with query validation
    [Description] NVARCHAR(MAX) NULL,
    FOREIGN KEY (TableSchemaId) REFERENCES TableSchemas(Id) ON DELETE CASCADE
);

CREATE TABLE [TableRelationships] (
    [Id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    [FromTableId] INT NOT NULL,
    [FromColumn] NVARCHAR(255) NOT NULL,
    [ToTableId] INT NOT NULL,
    [ToColumn] NVARCHAR(255) NOT NULL,
    [RelationshipType] NVARCHAR(50) DEFAULT 'FK',
    FOREIGN KEY (FromTableId) REFERENCES TableSchemas(Id) ON DELETE NO ACTION,
    FOREIGN KEY (ToTableId) REFERENCES TableSchemas(Id) ON DELETE NO ACTION
);

