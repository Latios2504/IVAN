-- =========================================================
-- VIETNAM VOLUNTEER MANAGEMENT SYSTEM DATABASE SCHEMA
-- Version: 2.0 - Organized with Vietnamese Unicode Support
-- Database: MS SQL Server Compatible
-- Description: Complete, organized schema for IVAN system with proper Vietnamese character support
-- =========================================================

-- Set connection to UTF-8 encoding for proper Vietnamese character support
-- IMPORTANT: Run these commands before executing the database creation
-- If using SSMS, go to Tools -> Options -> Query Execution -> SQL Server -> Advanced -> Set "Results to Text" output format to Unicode

-- Set database options for proper Vietnamese character handling
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

-- Volunteer Extended Profiles
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
    FOREIGN KEY (CoordinatorId) REFERENCES Users(UserId) ON DELETE CASCADE,
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
    FOREIGN KEY (CoordinatorId) REFERENCES Users(UserId),
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

-- AI Custom Instructions
CREATE TABLE AiCustomInstructions (
    InstructionId INT PRIMARY KEY IDENTITY,
    CreatedByUserId INT NOT NULL,
    InstructionName NVARCHAR(200) NOT NULL,
    SystemPrompt NVARCHAR(MAX) NOT NULL,
    BehaviorInstructions NVARCHAR(MAX),
    DataAccessRules NVARCHAR(MAX),
    IsActive BIT DEFAULT 1,
    IsDefault BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (CreatedByUserId) REFERENCES Users(UserId)
);

-- AI Query Analytics
CREATE TABLE AiQueryAnalytics (
    QueryId INT PRIMARY KEY IDENTITY,
    UserId INT NOT NULL,
    InstructionId INT,
    ConversationId NVARCHAR(100),
    QueryText NVARCHAR(MAX),
    ResponseQuality INT,
    ExecutionTime INT,
    DataTablesAccessed NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (InstructionId) REFERENCES AiCustomInstructions(InstructionId)
);

-- AI Query Categories
CREATE TABLE AiQueryCategories (
    CategoryId INT PRIMARY KEY IDENTITY,
    CategoryName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    DataTablesRequired NVARCHAR(MAX),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- AI Conversation Context
CREATE TABLE AiConversationContexts (
    ContextId INT PRIMARY KEY IDENTITY,
    ConversationId NVARCHAR(100) UNIQUE NOT NULL,
    UserId INT NOT NULL,
    InstructionId INT,
    SessionData NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (InstructionId) REFERENCES AiCustomInstructions(InstructionId)
);

-- AI Security Audit Logs
CREATE TABLE AiSecurityAuditLogs (
    LogId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    EventType NVARCHAR(100) NOT NULL,
    Details NVARCHAR(MAX) NOT NULL DEFAULT '',
    Severity NVARCHAR(20) NOT NULL DEFAULT 'INFO',
    IpAddress NVARCHAR(45) NULL,
    UserAgent NVARCHAR(500) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

-- AI Performance Metrics
CREATE TABLE AiPerformanceMetrics (
    MetricId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    InstructionId INT NULL,
    Query NVARCHAR(500) NOT NULL,
    ExecutionTimeMs INT NOT NULL,
    DataSize INT NOT NULL DEFAULT 0,
    CacheStatus NVARCHAR(20) NOT NULL DEFAULT 'MISS',
    QueryCategory NVARCHAR(100) NOT NULL DEFAULT '',
    OptimizationApplied NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (InstructionId) REFERENCES AiCustomInstructions(InstructionId) ON DELETE SET NULL
);

-- AI Cache Entries
CREATE TABLE AiCacheEntries (
    CacheId INT IDENTITY(1,1) PRIMARY KEY,
    CacheKey NVARCHAR(255) NOT NULL UNIQUE,
    CacheValue NVARCHAR(MAX) NOT NULL,
    ExpiresAt DATETIME2 NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    LastAccessedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    AccessCount INT NOT NULL DEFAULT 0,
    DataType NVARCHAR(50) NOT NULL DEFAULT '',
    SizeBytes BIGINT NOT NULL DEFAULT 0,
    UserId NVARCHAR(100) NULL
);

-- AI Rate Limits
CREATE TABLE AiRateLimits (
    RateLimitId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Operation NVARCHAR(50) NOT NULL,
    RequestCount INT NOT NULL DEFAULT 0,
    WindowStart DATETIME2 NOT NULL,
    WindowEnd DATETIME2 NOT NULL,
    LastRequestAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsBlocked BIT NOT NULL DEFAULT 0,
    BlockedUntil DATETIME2 NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    UNIQUE (UserId, Operation)
);

-- AI User Permissions
CREATE TABLE AiUserPermissions (
    PermissionId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Permission NVARCHAR(100) NOT NULL,
    IsGranted BIT NOT NULL DEFAULT 0,
    GrantedAt DATETIME2 NULL,
    RevokedAt DATETIME2 NULL,
    GrantedByUserId INT NULL,
    Notes NVARCHAR(MAX) NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (GrantedByUserId) REFERENCES Users(UserId) ON DELETE NO ACTION,
    UNIQUE (UserId, Permission)
);

-- AI System Configurations
CREATE TABLE AiSystemConfigurations (
    ConfigId INT IDENTITY(1,1) PRIMARY KEY,
    ConfigKey NVARCHAR(100) NOT NULL UNIQUE,
    ConfigValue NVARCHAR(MAX) NOT NULL,
    Description NVARCHAR(500) NULL,
    ConfigType NVARCHAR(20) NOT NULL DEFAULT 'STRING',
    IsSecure BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedByUserId INT NULL,
    FOREIGN KEY (UpdatedByUserId) REFERENCES Users(UserId) ON DELETE SET NULL
);

-- =========================================================
-- SECTION 19: INDEXES FOR PERFORMANCE OPTIMIZATION
-- =========================================================

-- User Management Indexes
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_RoleId ON Users(RoleId);
CREATE INDEX IX_UserProfiles_UserId ON UserProfiles(UserId);

-- Volunteer Management Indexes
CREATE INDEX IX_VolunteerProfiles_UserId ON VolunteerProfiles(UserId);
CREATE INDEX IX_VolunteerProfiles_IsVerified ON VolunteerProfiles(IsVerified);
CREATE INDEX IX_VolunteerSkills_VolunteerId ON VolunteerSkills(VolunteerId);
CREATE INDEX IX_VolunteerSkills_SkillId ON VolunteerSkills(SkillId);

-- Organization Management Indexes
CREATE INDEX IX_Organizations_UserId ON Organizations(UserId);
CREATE INDEX IX_Organizations_TypeId ON Organizations(TypeId);
CREATE INDEX IX_Organizations_IsVerified ON Organizations(IsVerified);

-- Event Management Indexes
CREATE INDEX IX_Events_OrganizationId ON Events(OrganizationId);
CREATE INDEX IX_Events_CategoryId ON Events(CategoryId);
CREATE INDEX IX_Events_StatusId ON Events(StatusId);
CREATE INDEX IX_Events_StartDate ON Events(StartDate);
CREATE INDEX IX_Events_EndDate ON Events(EndDate);

-- Registration Management Indexes
CREATE INDEX IX_EventRegistrations_EventId ON EventRegistrations(EventId);
CREATE INDEX IX_EventRegistrations_VolunteerId ON EventRegistrations(VolunteerId);
CREATE INDEX IX_EventRegistrations_StatusId ON EventRegistrations(StatusId);
CREATE INDEX IX_EventRegistrations_ApplicationDate ON EventRegistrations(ApplicationDate);

-- AI System Indexes
CREATE INDEX IX_AiSecurityAuditLogs_UserId ON AiSecurityAuditLogs(UserId);
CREATE INDEX IX_AiSecurityAuditLogs_EventType ON AiSecurityAuditLogs(EventType);
CREATE INDEX IX_AiSecurityAuditLogs_CreatedAt ON AiSecurityAuditLogs(CreatedAt);
CREATE INDEX IX_AiSecurityAuditLogs_Severity ON AiSecurityAuditLogs(Severity);

CREATE INDEX IX_AiPerformanceMetrics_UserId ON AiPerformanceMetrics(UserId);
CREATE INDEX IX_AiPerformanceMetrics_CreatedAt ON AiPerformanceMetrics(CreatedAt);
CREATE INDEX IX_AiPerformanceMetrics_ExecutionTime ON AiPerformanceMetrics(CacheStatus);
CREATE INDEX IX_AiPerformanceMetrics_CacheStatus ON AiPerformanceMetrics(QueryCategory);
CREATE INDEX IX_AiPerformanceMetrics_QueryCategory ON AiPerformanceMetrics(ExecutionTimeMs);

CREATE INDEX IX_AiCacheEntries_CacheKey ON AiCacheEntries(CacheKey);
CREATE INDEX IX_AiCacheEntries_ExpiresAt ON AiCacheEntries(ExpiresAt);
CREATE INDEX IX_AiCacheEntries_DataType ON AiCacheEntries(DataType);
CREATE INDEX IX_AiCacheEntries_UserId ON AiCacheEntries(UserId);

CREATE INDEX IX_AiRateLimits_UserId ON AiRateLimits(UserId);
CREATE INDEX IX_AiRateLimits_Operation ON AiRateLimits(Operation);
CREATE INDEX IX_AiRateLimits_WindowStart ON AiRateLimits(WindowStart);
CREATE INDEX IX_AiRateLimits_IsBlocked ON AiRateLimits(IsBlocked);

CREATE INDEX IX_AiUserPermissions_UserId ON AiUserPermissions(UserId);
CREATE INDEX IX_AiUserPermissions_Permission ON AiUserPermissions(Permission);
CREATE INDEX IX_AiUserPermissions_IsGranted ON AiUserPermissions(IsGranted);

CREATE INDEX IX_AiSystemConfigurations_ConfigKey ON AiSystemConfigurations(ConfigKey);
CREATE INDEX IX_AiSystemConfigurations_ConfigType ON AiSystemConfigurations(ConfigType);
CREATE INDEX IX_AiSystemConfigurations_IsSecure ON AiSystemConfigurations(IsSecure);

-- =========================================================
-- SECTION 20: STORED PROCEDURES
-- =========================================================

-- Procedure to clean up expired cache entries
IF OBJECT_ID('sp_CleanupExpiredCache', 'P') IS NOT NULL
    DROP PROCEDURE sp_CleanupExpiredCache;
GO

CREATE PROCEDURE sp_CleanupExpiredCache
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @DeletedCount INT;
    
    DELETE FROM AiCacheEntries 
    WHERE ExpiresAt < GETUTCDATE();
    
    SET @DeletedCount = @@ROWCOUNT;
    
    PRINT CONCAT('Cleaned up ', @DeletedCount, ' expired cache entries');
END
GO

-- Procedure to clean up old audit logs
IF OBJECT_ID('sp_CleanupOldAuditLogs', 'P') IS NOT NULL
    DROP PROCEDURE sp_CleanupOldAuditLogs;
GO

CREATE PROCEDURE sp_CleanupOldAuditLogs
    @RetentionDays INT = 90
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @DeletedCount INT;
    DECLARE @CutoffDate DATETIME2 = DATEADD(DAY, -@RetentionDays, GETUTCDATE());
    
    DELETE FROM AiSecurityAuditLogs 
    WHERE CreatedAt < @CutoffDate AND Severity IN ('INFO', 'WARNING');
    
    SET @DeletedCount = @@ROWCOUNT;
    
    PRINT CONCAT('Cleaned up ', @DeletedCount, ' old audit log entries older than ', @RetentionDays, ' days');
END
GO

-- Procedure to get performance summary
IF OBJECT_ID('sp_GetPerformanceSummary', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetPerformanceSummary;
GO

CREATE PROCEDURE sp_GetPerformanceSummary
    @Hours INT = 24
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @FromDate DATETIME2 = DATEADD(HOUR, -@Hours, GETUTCDATE());
    
    SELECT 
        COUNT(*) AS TotalQueries,
        AVG(CAST(ExecutionTimeMs AS FLOAT)) AS AvgExecutionTimeMs,
        MAX(ExecutionTimeMs) AS MaxExecutionTimeMs,
        COUNT(DISTINCT UserId) AS UniqueUsers,
        SUM(CASE WHEN CacheStatus = 'HIT' THEN 1 ELSE 0 END) AS CacheHits,
        SUM(CASE WHEN CacheStatus = 'MISS' THEN 1 ELSE 0 END) AS CacheMisses,
        CAST(SUM(CASE WHEN CacheStatus = 'HIT' THEN 1 ELSE 0 END) AS FLOAT) / COUNT(*) * 100 AS CacheHitRatio,
        SUM(DataSize) AS TotalDataSize
    FROM AiPerformanceMetrics
    WHERE CreatedAt >= @FromDate;
    
    -- Top query categories
    SELECT TOP 10
        QueryCategory,
        COUNT(*) AS QueryCount,
        AVG(CAST(ExecutionTimeMs AS FLOAT)) AS AvgExecutionTime
    FROM AiPerformanceMetrics
    WHERE CreatedAt >= @FromDate
    GROUP BY QueryCategory
    ORDER BY QueryCount DESC;
    
    -- Top users by query count
    SELECT TOP 10
        UserId,
        COUNT(*) AS QueryCount,
        AVG(CAST(ExecutionTimeMs AS FLOAT)) AS AvgExecutionTime
    FROM AiPerformanceMetrics
    WHERE CreatedAt >= @FromDate
    GROUP BY UserId
    ORDER BY QueryCount DESC;
END
GO

-- =========================================================
-- SECTION 21: DEFAULT DATA INSERTION
-- =========================================================

-- Insert default user roles
INSERT INTO UserRoles (RoleName, Description) VALUES
(N'Admin', N'Quản trị viên hệ thống'),
(N'Organization', N'Tổ chức từ thiện'),
(N'Volunteer', N'Tình nguyện viên'),
(N'Partner', N'Đối tác'),
(N'Coordinator', N'Điều phối viên tình nguyện');

-- Insert default organization types
INSERT INTO OrganizationTypes (TypeName, Description) VALUES
(N'Phi lợi nhuận', N'Tổ chức phi lợi nhuận'),
(N'Từ thiện', N'Tổ chức từ thiện'),
(N'Giáo dục', N'Tổ chức giáo dục'),
(N'Y tế', N'Tổ chức y tế'),
(N'Môi trường', N'Tổ chức bảo vệ môi trường');

-- Insert default event categories
INSERT INTO EventCategories (CategoryName, Description, Color) VALUES
(N'Môi trường', N'Các hoạt động bảo vệ môi trường', N'#4CAF50'),
(N'Giáo dục', N'Các hoạt động giáo dục và đào tạo', N'#2196F3'),
(N'Y tế', N'Các hoạt động chăm sóc sức khỏe', N'#F44336'),
(N'Xã hội', N'Các hoạt động phát triển cộng đồng', N'#FF9800'),
(N'Văn hóa', N'Các hoạt động văn hóa nghệ thuật', N'#9C27B0');

-- Insert default event status
INSERT INTO EventStatus (StatusName, Description, Color) VALUES
(N'Đang lên kế hoạch', N'Sự kiện đang trong giai đoạn lên kế hoạch', N'#FFC107'),
(N'Đang mở đăng ký', N'Sự kiện đang mở đăng ký tình nguyện viên', N'#2196F3'),
(N'Sắp diễn ra', N'Sự kiện sắp diễn ra', N'#FF9800'),
(N'Đang diễn ra', N'Sự kiện đang diễn ra', N'#4CAF50'),
(N'Đã kết thúc', N'Sự kiện đã kết thúc', N'#9E9E9E'),
(N'Đã hủy', N'Sự kiện đã bị hủy', N'#F44336');

-- Insert default registration status
INSERT INTO RegistrationStatus (StatusName, Description, Color) VALUES
(N'Đang chờ duyệt', N'Đăng ký đang chờ phê duyệt', N'#FFC107'),
(N'Đã duyệt', N'Đăng ký đã được phê duyệt', N'#4CAF50'),
(N'Bị từ chối', N'Đăng ký bị từ chối', N'#F44336'),
(N'Đã hủy', N'Đăng ký đã bị hủy', N'#9E9E9E');

-- Create default admin user first
DECLARE @AdminUserId INT;

-- Insert default admin user
INSERT INTO Users (Email, PasswordHash, Salt, RoleId, IsActive, IsEmailVerified) 
VALUES ('admin@ivan.vn', 'default_hash', 'default_salt', 1, 1, 1);

SET @AdminUserId = SCOPE_IDENTITY();

-- Insert admin profile
INSERT INTO UserProfiles (UserId, FirstName, LastName, PhoneNumber, Address, Province) 
VALUES (@AdminUserId, N'System', N'Administrator', N'0000000000', N'Hệ thống', N'Hà Nội');

-- Insert default AI instruction templates
INSERT INTO AiCustomInstructions (CreatedByUserId, InstructionName, SystemPrompt, BehaviorInstructions, DataAccessRules, IsDefault) VALUES 
(@AdminUserId, N'Default IVAN Assistant', 
 N'Bạn là trợ lý AI của hệ thống IVAN (Intelligent Volunteer Assistant Network) - hệ thống quản lý tình nguyện viên thông minh. Bạn đang hỗ trợ một quản trị viên (Admin) của hệ thống.',
 N'Hãy trả lời bằng tiếng Việt và tập trung vào việc hỗ trợ quản lý tình nguyện viên, tổ chức sự kiện, và các hoạt động phi lợi nhuận. Hãy giữ phong cách chuyên nghiệp nhưng thân thiện.',
 N'Access to basic system data, volunteer profiles, events, and organization information.',
 1),

(@AdminUserId, N'Volunteer Management Assistant',
 N'Bạn là chuyên gia quản lý tình nguyện viên của hệ thống IVAN. Bạn chuyên về tuyển dụng, lập lịch và giữ chân tình nguyện viên.',
 N'Tập trung vào các chiến lược tuyển dụng tình nguyện viên, quản lý lịch trình và cải thiện sự gắn kết. Luôn ưu tiên sự an toàn và phúc lợi của tình nguyện viên.',
 N'Full access to volunteer profiles, skills, availability, performance metrics, and scheduling data.',
 0),

(@AdminUserId, N'Event Planning Expert',
 N'Bạn là chuyên gia tổ chức sự kiện của IVAN. Bạn giúp tối ưu hóa việc tổ chức sự kiện, phân bổ tình nguyện viên và đo lường thành công.',
 N'Tập trung vào lời khuyên quản lý sự kiện thực tế với các khuyến nghị dựa trên dữ liệu. Đưa ra thông tin chi tiết về hiệu suất sự kiện.',
 N'Access to events, registrations, feedback, performance data, and volunteer allocation information.',
 0);

-- Insert default AI query categories
INSERT INTO AiQueryCategories (CategoryName, Description, DataTablesRequired) VALUES 
('Volunteer Analytics', 'Questions about volunteer statistics, performance, and trends', 'VolunteerProfiles,VolunteerSkills,EventRegistrations'),
('Event Performance', 'Questions about event success metrics and analysis', 'Events,EventRegistrations,Feedback,EventCategories'),
('Partner Insights', 'Questions about partner relationships and collaborations', 'Partners,PartnerCollaborations,Organizations'),
('Trend Analysis', 'Questions about data trends and patterns over time', 'All tables for comprehensive analysis'),
('Custom Reporting', 'General data queries and custom report generation', 'User-specified based on query content');

-- Insert default AI system configurations
INSERT INTO AiSystemConfigurations (ConfigKey, ConfigValue, Description, ConfigType) VALUES
('MaxQueriesPerHour', '100', 'Maximum number of AI queries per hour per user', 'INT'),
('CacheExpirationMinutes', '30', 'Default cache expiration time in minutes', 'INT'),
('EnableQueryOptimization', 'true', 'Enable automatic query optimization', 'BOOL'),
('SecurityAuditRetentionDays', '90', 'Number of days to retain security audit logs', 'INT'),
('PerformanceAlertThresholds', '{"SlowQueryMs": 1000, "HighCpuPercent": 75, "HighMemoryPercent": 80}', 'Performance alert thresholds in JSON format', 'JSON');

-- =========================================================
-- SECTION 21.5: EXTENDED SAMPLE DATA
-- =========================================================

-- Insert sample skills
INSERT INTO Skills (SkillName, Category, Description) VALUES
(N'Giảng dạy', N'Giáo dục', N'Kỹ năng giảng dạy và truyền đạt kiến thức'),
(N'Chăm sóc y tế', N'Y tế', N'Kỹ năng chăm sóc sức khỏe cơ bản'),
(N'Tổ chức sự kiện', N'Quản lý', N'Kỹ năng tổ chức và điều phối sự kiện'),
(N'Tiếng Anh', N'Ngôn ngữ', N'Giao tiếp bằng tiếng Anh'),
(N'Thiết kế đồ họa', N'Sáng tạo', N'Thiết kế poster, banner, tài liệu'),
(N'Nhiếp ảnh', N'Sáng tạo', N'Chụp ảnh sự kiện và hoạt động'),
(N'Hướng dẫn du lịch', N'Du lịch', N'Hướng dẫn và giới thiệu địa điểm'),
(N'Nấu ăn', N'Ẩm thực', N'Nấu ăn cho sự kiện và hoạt động'),
(N'Xe máy', N'Vận chuyển', N'Lái xe máy để vận chuyển'),
(N'Sơ cứu', N'Y tế', N'Kỹ năng sơ cứu cơ bản'),
(N'Marketing', N'Truyền thông', N'Quảng bá và marketing sự kiện'),
(N'IT Support', N'Công nghệ', N'Hỗ trợ kỹ thuật máy tính'),
(N'Âm nhạc', N'Nghệ thuật', N'Biểu diễn nhạc cụ hoặc ca hát'),
(N'Thể thao', N'Thể chất', N'Hướng dẫn và tổ chức hoạt động thể thao'),
(N'Trồng cây', N'Môi trường', N'Kỹ năng trồng và chăm sóc cây xanh');

-- Insert partner industries
INSERT INTO PartnerIndustries (IndustryName, Description) VALUES
(N'Công nghệ thông tin', N'Các công ty phần mềm, IT'),
(N'Ngân hàng - Tài chính', N'Ngân hàng, công ty tài chính'),
(N'Giáo dục', N'Trường học, trung tâm đào tạo'),
(N'Y tế - Dược phẩm', N'Bệnh viện, công ty dược'),
(N'Bán lẻ - Tiêu dùng', N'Siêu thị, cửa hàng bán lẻ'),
(N'Sản xuất', N'Nhà máy sản xuất'),
(N'Truyền thông', N'Báo chí, truyền hình, quảng cáo'),
(N'Du lịch - Khách sạn', N'Công ty du lịch, khách sạn'),
(N'Bất động sản', N'Công ty phát triển bất động sản'),
(N'Năng lượng', N'Công ty năng lượng, điện lực');

-- Create variables for sample data
DECLARE @OrgUser1 INT, @OrgUser2 INT, @OrgUser3 INT, @OrgUser4 INT;
DECLARE @VolUser1 INT, @VolUser2 INT, @VolUser3 INT, @VolUser4 INT, @VolUser5 INT;
DECLARE @PartnerUser1 INT, @PartnerUser2 INT, @PartnerUser3 INT;
DECLARE @CoordUser1 INT, @CoordUser2 INT;

DECLARE @Org1 INT, @Org2 INT, @Org3 INT, @Org4 INT;
DECLARE @Vol1 INT, @Vol2 INT, @Vol3 INT, @Vol4 INT, @Vol5 INT;
DECLARE @Partner1 INT, @Partner2 INT, @Partner3 INT;

-- Insert sample organization users
INSERT INTO Users (Email, PasswordHash, Salt, RoleId, IsActive, IsEmailVerified) VALUES
('contact@greenearth.vn', 'hash_greenearth', 'salt_ge', 2, 1, 1),
('info@educationforall.vn', 'hash_efa', 'salt_efa', 2, 1, 1),
('admin@healthcareplus.vn', 'hash_hcp', 'salt_hcp', 2, 1, 1),
('contact@youthdevvn.org', 'hash_ydv', 'salt_ydv', 2, 1, 1);

SET @OrgUser1 = SCOPE_IDENTITY() - 3;
SET @OrgUser2 = SCOPE_IDENTITY() - 2;
SET @OrgUser3 = SCOPE_IDENTITY() - 1;
SET @OrgUser4 = SCOPE_IDENTITY();

-- Insert sample volunteer users
INSERT INTO Users (Email, PasswordHash, Salt, RoleId, IsActive, IsEmailVerified) VALUES
('nguyen.van.a@gmail.com', 'hash_nva', 'salt_nva', 3, 1, 1),
('tran.thi.b@gmail.com', 'hash_ttb', 'salt_ttb', 3, 1, 1),
('le.minh.c@gmail.com', 'hash_lmc', 'salt_lmc', 3, 1, 1),
('pham.thu.d@gmail.com', 'hash_ptd', 'salt_ptd', 3, 1, 1),
('hoang.van.e@gmail.com', 'hash_hve', 'salt_hve', 3, 1, 1);

SET @VolUser1 = SCOPE_IDENTITY() - 4;
SET @VolUser2 = SCOPE_IDENTITY() - 3;
SET @VolUser3 = SCOPE_IDENTITY() - 2;
SET @VolUser4 = SCOPE_IDENTITY() - 1;
SET @VolUser5 = SCOPE_IDENTITY();

-- Insert sample partner users
INSERT INTO Users (Email, PasswordHash, Salt, RoleId, IsActive, IsEmailVerified) VALUES
('partnership@techcorp.vn', 'hash_tc', 'salt_tc', 4, 1, 1),
('csr@vietbank.vn', 'hash_vb', 'salt_vb', 4, 1, 1),
('community@retailplus.vn', 'hash_rp', 'salt_rp', 4, 1, 1);

SET @PartnerUser1 = SCOPE_IDENTITY() - 2;
SET @PartnerUser2 = SCOPE_IDENTITY() - 1;
SET @PartnerUser3 = SCOPE_IDENTITY();

-- Insert sample coordinator users
INSERT INTO Users (Email, PasswordHash, Salt, RoleId, IsActive, IsEmailVerified) VALUES
('coordinator1@greenearth.vn', 'hash_c1', 'salt_c1', 5, 1, 1),
('coordinator2@educationforall.vn', 'hash_c2', 'salt_c2', 5, 1, 1);

SET @CoordUser1 = SCOPE_IDENTITY() - 1;
SET @CoordUser2 = SCOPE_IDENTITY();

-- Insert user profiles for organizations
INSERT INTO UserProfiles (UserId, FirstName, LastName, PhoneNumber, Address, District, Province, EmergencyContactName, EmergencyContactPhone) VALUES
(@OrgUser1, N'Nguyễn', N'Minh Hà', N'0901234567', N'123 Đường Láng', N'Đống Đa', N'Hà Nội', N'Trần Văn Nam', N'0987654321'),
(@OrgUser2, N'Lê', N'Thu Hương', N'0912345678', N'456 Nguyễn Thái Học', N'Ba Đình', N'Hà Nội', N'Phạm Thị Lan', N'0976543210'),
(@OrgUser3, N'Trần', N'Quốc Dũng', N'0923456789', N'789 Điện Biên Phủ', N'Quận 1', N'TP. Hồ Chí Minh', N'Nguyễn Thị Mai', N'0965432109'),
(@OrgUser4, N'Phạm', N'Thanh Tâm', N'0934567890', N'321 Lý Tự Trọng', N'Quận 1', N'TP. Hồ Chí Minh', N'Lê Văn Tùng', N'0954321098');

-- Insert user profiles for volunteers
INSERT INTO UserProfiles (UserId, FirstName, LastName, PhoneNumber, DateOfBirth, Gender, Address, District, Province, EmergencyContactName, EmergencyContactPhone) VALUES
(@VolUser1, N'Nguyễn', N'Văn A', N'0945678901', '1995-05-15', N'Nam', N'15 Giải Phóng', N'Hoàng Mai', N'Hà Nội', N'Nguyễn Thị Lan', N'0943210987'),
(@VolUser2, N'Trần', N'Thị B', N'0956789012', '1998-08-22', N'Nữ', N'28 Nguyễn Huệ', N'Quận 1', N'TP. Hồ Chí Minh', N'Trần Văn Hùng', N'0932109876'),
(@VolUser3, N'Lê', N'Minh C', N'0967890123', '1996-12-03', N'Nam', N'42 Hàng Bài', N'Hoàn Kiếm', N'Hà Nội', N'Lê Thị Thu', N'0921098765'),
(@VolUser4, N'Phạm', N'Thu D', N'0978901234', '1999-03-18', N'Nữ', N'67 Lê Lợi', N'Quận 1', N'TP. Hồ Chí Minh', N'Phạm Văn Đức', N'0910987654'),
(@VolUser5, N'Hoàng', N'Văn E', N'0989012345', '1997-07-29', N'Nam', N'89 Trần Hưng Đạo', N'Hoàn Kiếm', N'Hà Nội', N'Hoàng Thị Nga', N'0909876543');

-- Insert user profiles for partners
INSERT INTO UserProfiles (UserId, FirstName, LastName, PhoneNumber, Address, District, Province, EmergencyContactName, EmergencyContactPhone) VALUES
(@PartnerUser1, N'Võ', N'Minh Quân', N'0990123456', N'100 Đường Láng', N'Đống Đa', N'Hà Nội', N'Võ Thị Hoa', N'0908765432'),
(@PartnerUser2, N'Đặng', N'Thị Linh', N'0901234567', N'200 Nguyễn Du', N'Quận 1', N'TP. Hồ Chí Minh', N'Đặng Văn Long', N'0897654321'),
(@PartnerUser3, N'Bùi', N'Văn Thành', N'0912345678', N'300 Cách Mạng Tháng 8', N'Quận 3', N'TP. Hồ Chí Minh', N'Bùi Thị Sen', N'0886543210');

-- Insert user profiles for coordinators
INSERT INTO UserProfiles (UserId, FirstName, LastName, PhoneNumber, Address, District, Province, EmergencyContactName, EmergencyContactPhone) VALUES
(@CoordUser1, N'Ngô', N'Thanh Hà', N'0923456789', N'150 Đường Láng', N'Đống Đa', N'Hà Nội', N'Ngô Văn Tâm', N'0875432109'),
(@CoordUser2, N'Vũ', N'Minh Tú', N'0934567890', N'250 Lê Duẩn', N'Quận 1', N'TP. Hồ Chí Minh', N'Vũ Thị Xuân', N'0864321098');

-- Insert sample organizations
INSERT INTO Organizations (UserId, OrganizationName, ShortName, TypeId, Description, Mission, Vision, Address, District, Province, ContactPersonName, ContactEmail, ContactPhone, IsVerified, VerifiedAt, VerifiedBy, TotalEvents, TotalVolunteers) VALUES
(@OrgUser1, N'Quỹ Trái Đất Xanh Việt Nam', N'Green Earth VN', 5, N'Tổ chức phi lợi nhuận chuyên về bảo vệ môi trường và phát triển bền vững tại Việt Nam.', N'Bảo vệ môi trường và xây dựng tương lai xanh cho thế hệ mai sau.', N'Trở thành tổ chức dẫn đầu về bảo vệ môi trường tại Việt Nam.', N'123 Đường Láng', N'Đống Đa', N'Hà Nội', N'Nguyễn Minh Hà', N'contact@greenearth.vn', N'0901234567', 1, GETDATE(), @AdminUserId, 15, 250),
(@OrgUser2, N'Giáo Dục Cho Mọi Người', N'Education For All', 3, N'Tổ chức giáo dục nhằm cung cấp cơ hội học tập cho trẻ em vùng khó khăn.', N'Đem giáo dục đến với mọi trẻ em Việt Nam.', N'Xây dựng một xã hội có giáo dục công bằng và chất lượng.', N'456 Nguyễn Thái Học', N'Ba Đình', N'Hà Nội', N'Lê Thu Hương', N'info@educationforall.vn', N'0912345678', 1, GETDATE(), @AdminUserId, 12, 180),
(@OrgUser3, N'Chăm Sóc Sức Khỏe Cộng Đồng Plus', N'Healthcare Plus', 4, N'Tổ chức y tế cộng đồng cung cấp dịch vụ chăm sóc sức khỏe miễn phí.', N'Mang dịch vụ y tế chất lượng đến với mọi người dân.', N'Trở thành đối tác y tế đáng tin cậy của cộng đồng.', N'789 Điện Biên Phủ', N'Quận 1', N'TP. Hồ Chí Minh', N'Trần Quốc Dũng', N'admin@healthcareplus.vn', N'0923456789', 1, GETDATE(), @AdminUserId, 8, 120),
(@OrgUser4, N'Phát Triển Thanh Niên Việt Nam', N'Youth Dev VN', 1, N'Tổ chức phát triển thanh niên, hỗ trợ kỹ năng sống và nghề nghiệp.', N'Trao quyền cho thanh niên Việt Nam phát triển toàn diện.', N'Xây dựng thế hệ thanh niên tự tin và có năng lực.', N'321 Lý Tự Trọng', N'Quận 1', N'TP. Hồ Chí Minh', N'Phạm Thanh Tâm', N'contact@youthdevvn.org', N'0934567890', 1, GETDATE(), @AdminUserId, 20, 350);

SET @Org1 = SCOPE_IDENTITY() - 3;
SET @Org2 = SCOPE_IDENTITY() - 2;
SET @Org3 = SCOPE_IDENTITY() - 1;
SET @Org4 = SCOPE_IDENTITY();

-- Insert sample volunteer profiles
INSERT INTO VolunteerProfiles (UserId, StudentId, University, Major, YearOfStudy, Motivation, Experience, Availability, VolunteerHours, IsVerified, VerifiedAt, VerifiedBy, TotalHoursVolunteered) VALUES
(@VolUser1, N'SV001', N'Đại học Bách Khoa Hà Nội', N'Công nghệ Thông tin', 3, N'Muốn đóng góp cho cộng đồng và phát triển kỹ năng cá nhân.', N'Đã tham gia 3 sự kiện tình nguyện trước đây.', N'Cuối tuần và tối thứ 7', 45, 1, GETDATE(), @AdminUserId, 45),
(@VolUser2, N'SV002', N'Đại học Kinh tế TP.HCM', N'Quản trị Kinh doanh', 2, N'Đam mê giúp đỡ trẻ em và phát triển giáo dục.', N'Tình nguyện viên tại trung tâm trẻ em khuyết tật 6 tháng.', N'Thứ 7, Chủ nhật', 62, 1, GETDATE(), @AdminUserId, 62),
(@VolUser3, N'SV003', N'Đại học Y Hà Nội', N'Y khoa', 4, N'Sử dụng kiến thức y học để giúp đỡ cộng đồng.', N'Hỗ trợ khám bệnh miễn phí tại các xã vùng cao.', N'Linh hoạt', 78, 1, GETDATE(), @AdminUserId, 78),
(@VolUser4, N'SV004', N'Đại học Sư phạm TP.HCM', N'Sư phạm Tiếng Anh', 3, N'Muốn chia sẻ kiến thức và kỹ năng tiếng Anh.', N'Dạy tiếng Anh miễn phí cho trẻ em vùng khó khăn.', N'Tối thứ 2, 4, 6', 35, 1, GETDATE(), @AdminUserId, 35),
(@VolUser5, N'SV005', N'Đại học Ngoại thương', N'Marketing', 2, N'Học hỏi kinh nghiệm và mở rộng mạng lưới xã hội.', N'Mới bắt đầu hoạt động tình nguyện.', N'Cuối tuần', 12, 1, GETDATE(), @AdminUserId, 12);

SET @Vol1 = SCOPE_IDENTITY() - 4;
SET @Vol2 = SCOPE_IDENTITY() - 3;
SET @Vol3 = SCOPE_IDENTITY() - 2;
SET @Vol4 = SCOPE_IDENTITY() - 1;
SET @Vol5 = SCOPE_IDENTITY();

-- Insert sample partners
INSERT INTO Partners (UserId, CompanyName, IndustryId, Description, Address, District, Province, ContactPersonName, ContactEmail, ContactPhone, IsVerified, VerifiedAt, VerifiedBy, TotalCollaborations) VALUES
(@PartnerUser1, N'TechCorp Việt Nam', 1, N'Công ty công nghệ hàng đầu chuyên về phát triển phần mềm và giải pháp số.', N'100 Đường Láng', N'Đống Đa', N'Hà Nội', N'Võ Minh Quân', N'partnership@techcorp.vn', N'0990123456', 1, GETDATE(), @AdminUserId, 5),
(@PartnerUser2, N'VietBank', 2, N'Ngân hàng thương mại cổ phần hàng đầu Việt Nam.', N'200 Nguyễn Du', N'Quận 1', N'TP. Hồ Chí Minh', N'Đặng Thị Linh', N'csr@vietbank.vn', N'0901234567', 1, GETDATE(), @AdminUserId, 8),
(@PartnerUser3, N'RetailPlus', 5, N'Chuỗi siêu thị và cửa hàng bán lẻ lớn nhất miền Nam.', N'300 Cách Mạng Tháng 8', N'Quận 3', N'TP. Hồ Chí Minh', N'Bùi Văn Thành', N'community@retailplus.vn', N'0912345678', 1, GETDATE(), @AdminUserId, 3);

SET @Partner1 = SCOPE_IDENTITY() - 2;
SET @Partner2 = SCOPE_IDENTITY() - 1;
SET @Partner3 = SCOPE_IDENTITY();

-- Insert volunteer coordinators
INSERT INTO VolunteerCoordinators (UserId, OrganizationId, Position, Department, Responsibilities, HireDate, CreatedBy, RequestedBy) VALUES
(@CoordUser1, @Org1, N'Điều phối viên tình nguyện', N'Phát triển chương trình', N'Quản lý và điều phối các hoạt động tình nguyện môi trường', '2024-01-15', @AdminUserId, @Org1),
(@CoordUser2, @Org2, N'Trưởng nhóm tình nguyện', N'Giáo dục cộng đồng', N'Tổ chức các chương trình giáo dục và đào tạo tình nguyện viên', '2024-02-01', @AdminUserId, @Org2);

-- Insert volunteer skills
INSERT INTO VolunteerSkills (VolunteerId, SkillId, ProficiencyLevel, YearsOfExperience, Description) VALUES
(@Vol1, 1, N'Trung bình', 1, N'Có kinh nghiệm dạy học cho trẻ em'),
(@Vol1, 12, N'Cao', 3, N'Chuyên về lập trình và hỗ trợ kỹ thuật'),
(@Vol2, 1, N'Cao', 2, N'Giảng dạy tiếng Anh cho trẻ em'),
(@Vol2, 4, N'Cao', 3, N'Thành thạo tiếng Anh giao tiếp'),
(@Vol3, 2, N'Cao', 2, N'Sinh viên y khoa có kinh nghiệm thực tế'),
(@Vol3, 10, N'Trung bình', 1, N'Được đào tạo sơ cứu cơ bản'),
(@Vol4, 1, N'Cao', 2, N'Chuyên dạy tiếng Anh'),
(@Vol4, 4, N'Cao', 4, N'Bằng IELTS 7.5'),
(@Vol5, 11, N'Trung bình', 1, N'Hiểu biết về marketing số'),
(@Vol5, 5, N'Trung bình', 1, N'Sử dụng Photoshop cơ bản');

-- Declare event variables
DECLARE @Event1 INT, @Event2 INT, @Event3 INT, @Event4 INT, @Event5 INT, @Event6 INT;

-- Insert sample events
INSERT INTO Events (OrganizationId, EventName, CategoryId, StatusId, Description, StartDate, EndDate, RegistrationStartDate, RegistrationEndDate, Location, MaxVolunteers, RequiredSkills, Benefits, ContactPerson, ContactPhone, ContactEmail, CreatedBy) VALUES
(@Org1, N'Chiến dịch Làm sạch Sông Hồng 2025', 1, 2, N'Hoạt động làm sạch và bảo vệ môi trường sông Hồng, nâng cao ý thức người dân về bảo vệ nguồn nước.', '2025-07-15 07:00:00', '2025-07-15 16:00:00', '2025-06-15 00:00:00', '2025-07-10 23:59:59', N'Bờ sông Hồng, Quận Long Biên, Hà Nội', 100, N'Không yêu cầu kỹ năng đặc biệt', N'Chứng chỉ tình nguyện, áo thun, ăn trưa miễn phí', N'Nguyễn Minh Hà', N'0901234567', N'contact@greenearth.vn', @OrgUser1),

(@Org2, N'Lớp học Tiếng Anh miễn phí cho trẻ em vùng cao', 2, 2, N'Chương trình giảng dạy tiếng Anh miễn phí cho trẻ em tại các xã vùng cao, giúp các em tiếp cận với ngôn ngữ quốc tế.', '2025-08-01 08:00:00', '2025-08-31 17:00:00', '2025-06-20 00:00:00', '2025-07-25 23:59:59', N'Xã Tà Chải, Sapa, Lào Cai', 30, N'Tiếng Anh, Giảng dạy', N'Chứng chỉ, hỗ trợ đi lại, lưu trú', N'Lê Thu Hương', N'0912345678', N'info@educationforall.vn', @OrgUser2),

(@Org3, N'Khám bệnh miễn phí cho người cao tuổi', 3, 3, N'Chương trình khám sức khỏe miễn phí dành cho người cao tuổi có hoàn cảnh khó khăn tại khu vực nội thành.', '2025-07-20 08:00:00', '2025-07-20 15:00:00', '2025-06-18 00:00:00', '2025-07-15 23:59:59', N'Trung tâm Y tế Quận 1, TP.HCM', 50, N'Chăm sóc y tế, Sơ cứu', N'Chứng chỉ tình nguyện, ăn trưa', N'Trần Quốc Dũng', N'0923456789', N'admin@healthcareplus.vn', @OrgUser3),

(@Org4, N'Workshop Kỹ năng sống cho Thanh niên', 4, 2, N'Tập huấn kỹ năng sống, kỹ năng mềm và định hướng nghề nghiệp cho thanh niên từ 16-25 tuổi.', '2025-08-10 09:00:00', '2025-08-12 17:00:00', '2025-06-25 00:00:00', '2025-08-05 23:59:59', N'Trung tâm Thanh niên TP.HCM', 80, N'Tổ chức sự kiện, Giảng dạy', N'Chứng chỉ hoàn thành, tài liệu, ăn uống', N'Phạm Thanh Tâm', N'0934567890', N'contact@youthdevvn.org', @OrgUser4),

(@Org1, N'Trồng cây xanh tại Công viên Thống Nhất', 1, 4, N'Hoạt động trồng cây xanh nhằm cải thiện không khí và cảnh quan đô thị tại Công viên Thống Nhất.', '2025-06-30 06:00:00', '2025-06-30 11:00:00', '2025-06-01 00:00:00', '2025-06-28 23:59:59', N'Công viên Thống Nhất, Hai Bà Trưng, Hà Nội', 60, N'Trồng cây, Làm việc ngoài trời', N'Chứng chỉ, nước uống, ăn sáng', N'Nguyễn Minh Hà', N'0901234567', N'contact@greenearth.vn', @OrgUser1),

(@Org2, N'Tặng sách và dụng cụ học tập cho trẻ em nghèo', 2, 1, N'Chương trình quyên góp và trao tặng sách vở, dụng cụ học tập cho trẻ em có hoàn cảnh khó khăn.', '2025-09-15 14:00:00', '2025-09-15 17:00:00', '2025-07-01 00:00:00', '2025-09-10 23:59:59', N'Trường Tiểu học Đồng Tâm, Hà Nội', 25, N'Tổ chức sự kiện, Giao tiếp với trẻ em', N'Chứng chỉ tình nguyện', N'Lê Thu Hương', N'0912345678', N'info@educationforall.vn', @OrgUser2);

SET @Event1 = SCOPE_IDENTITY() - 5;
SET @Event2 = SCOPE_IDENTITY() - 4;
SET @Event3 = SCOPE_IDENTITY() - 3;
SET @Event4 = SCOPE_IDENTITY() - 2;
SET @Event5 = SCOPE_IDENTITY() - 1;
SET @Event6 = SCOPE_IDENTITY();

-- Insert event registrations
INSERT INTO EventRegistrations (EventId, VolunteerId, StatusId, ApplicationDate, MotivationLetter, AdditionalInfo) VALUES
(@Event1, @Vol1, 2, '2025-06-20 10:30:00', N'Tôi rất quan tâm đến việc bảo vệ môi trường và muốn đóng góp cho cộng đồng.', N'Có kinh nghiệm tham gia hoạt động làm sạch môi trường.'),
(@Event1, @Vol2, 2, '2025-06-21 15:20:00', N'Muốn tham gia bảo vệ nguồn nước sạch cho thế hệ tương lai.', N'Sẵn sàng làm việc cả ngày.'),
(@Event1, @Vol5, 1, '2025-06-22 09:15:00', N'Lần đầu tham gia hoạt động môi trường, mong được học hỏi.', N'Có thể hỗ trợ chụp ảnh sự kiện.'),

(@Event2, @Vol2, 2, '2025-06-22 14:45:00', N'Tôi có kinh nghiệm dạy tiếng Anh và muốn giúp đỡ trẻ em vùng cao.', N'Có thể ở lại dài hạn nếu cần thiết.'),
(@Event2, @Vol4, 2, '2025-06-23 11:30:00', N'Là sinh viên sư phạm tiếng Anh, tôi muốn áp dụng kiến thức vào thực tế.', N'Có tài liệu giảng dạy phù hợp với trẻ em.'),

(@Event3, @Vol3, 2, '2025-06-19 16:20:00', N'Là sinh viên y khoa, tôi muốn sử dụng kiến thức để giúp đỡ người cao tuổi.', N'Có kinh nghiệm thực tập tại bệnh viện.'),

(@Event4, @Vol1, 1, '2025-06-26 13:10:00', N'Muốn học hỏi kỹ năng tổ chức sự kiện và chia sẻ kinh nghiệm IT.', N'Có thể hỗ trợ về mặt kỹ thuật.'),
(@Event4, @Vol5, 2, '2025-06-27 10:45:00', N'Sinh viên marketing muốn học hỏi về tổ chức workshop.', N'Có thể hỗ trợ quảng bá sự kiện.'),

(@Event5, @Vol1, 2, '2025-06-15 08:30:00', N'Thích hoạt động ngoài trời và bảo vệ môi trường.', N'Có kinh nghiệm trồng cây.'),
(@Event5, @Vol3, 2, '2025-06-16 12:20:00', N'Muốn đóng góp cho môi trường xanh thành phố.', N'Sẵn sàng làm việc từ sớm.');

-- Insert sample feedback categories
INSERT INTO FeedbackCategories (CategoryName, Description) VALUES
(N'Tổ chức sự kiện', N'Phản hồi về cách tổ chức và điều phối sự kiện'),
(N'Chất lượng hoạt động', N'Đánh giá về nội dung và chất lượng hoạt động'),
(N'Hỗ trợ tình nguyện viên', N'Phản hồi về việc hỗ trợ và chăm sóc tình nguyện viên'),
(N'Cơ sở vật chất', N'Đánh giá về địa điểm, thiết bị và cơ sở vật chất'),
(N'Gợi ý cải thiện', N'Đề xuất và gợi ý để cải thiện các hoạt động');

-- Insert sample feedback
INSERT INTO Feedback (EventId, UserId, CategoryId, Subject, Content, Rating, Status) VALUES
(@Event1, @VolUser1, 1, N'Sự kiện được tổ chức rất tốt', N'Sự kiện làm sạch sông Hồng được tổ chức chuyên nghiệp, BTC hỗ trợ tình nguyện viên rất tốt. Hy vọng có thêm nhiều hoạt động như vậy.', 5, N'Approved'),
(@Event2, @VolUser2, 2, N'Chương trình giảng dạy hiệu quả', N'Chương trình dạy tiếng Anh cho trẻ em rất ý nghĩa. Trẻ em rất hào hứng và tiếp thu nhanh. Tài liệu giảng dạy phù hợp với lứa tuổi.', 5, N'Approved'),
(@Event3, @VolUser3, 3, N'Cần cải thiện hỗ trợ y tế', N'Sự kiện khám bệnh miễn phí rất tốt nhưng cần có thêm bác sĩ chuyên khoa và thiết bị y tế hiện đại hơn.', 4, N'Pending');

-- Insert sample support categories
INSERT INTO SupportCategories (CategoryName, Description, Priority) VALUES
(N'Đăng ký sự kiện', N'Hỗ trợ về việc đăng ký tham gia sự kiện', N'High'),
(N'Tài khoản người dùng', N'Hỗ trợ về tài khoản và thông tin cá nhân', N'Medium'),
(N'Thanh toán', N'Hỗ trợ về vấn đề thanh toán và phí', N'High'),
(N'Kỹ thuật', N'Hỗ trợ về lỗi kỹ thuật và sử dụng hệ thống', N'Medium'),
(N'Khác', N'Các vấn đề hỗ trợ khác', N'Low');

-- Insert sample support requests
INSERT INTO SupportRequests (UserId, CategoryId, Subject, Description, Priority, Status) VALUES
(@VolUser1, 1, N'Không thể đăng ký sự kiện', N'Tôi đã cố gắng đăng ký sự kiện "Làm sạch Sông Hồng" nhưng hệ thống báo lỗi. Xin hỗ trợ.', N'High', N'Open'),
(@VolUser2, 2, N'Cập nhật thông tin cá nhân', N'Tôi muốn thay đổi số điện thoại và địa chỉ trong hồ sơ cá nhân.', N'Medium', N'In Progress');

-- Insert collaboration types
INSERT INTO CollaborationTypes (TypeName, Description) VALUES
(N'Tài trợ tài chính', N'Đối tác cung cấp tài trợ tài chính cho sự kiện'),
(N'Tài trợ hiện vật', N'Đối tác cung cấp thiết bị, vật dụng cho hoạt động'),
(N'Hỗ trợ nhân lực', N'Đối tác cử nhân viên tham gia hoạt động tình nguyện'),
(N'Chia sẻ chuyên môn', N'Đối tác chia sẻ kiến thức, kỹ năng chuyên môn'),
(N'Quảng bá truyền thông', N'Đối tác hỗ trợ quảng bá và truyền thông sự kiện');

-- Insert partner collaborations
INSERT INTO PartnerCollaborations (OrganizationId, PartnerId, TypeId, CollaborationName, Description, StartDate, EndDate, Status, Budget) VALUES
(@Org1, @Partner1, 1, N'Tài trợ Chiến dịch Môi trường 2025', N'TechCorp tài trợ 50 triệu đồng cho các hoạt động bảo vệ môi trường trong năm 2025.', '2025-01-01', '2025-12-31', N'Active', 50000000),
(@Org2, @Partner2, 2, N'Tài trợ thiết bị giáo dục', N'VietBank tài trợ laptop, máy chiếu cho chương trình giáo dục vùng cao.', '2025-06-01', '2025-08-31', N'Active', 30000000),
(@Org3, @Partner3, 3, N'Tình nguyện viên từ RetailPlus', N'Nhân viên RetailPlus tham gia hoạt động khám bệnh miễn phí.', '2025-07-01', '2025-07-31', N'Active', 0);

PRINT 'Sample data insertion completed successfully!';
PRINT 'Added:';
PRINT '- 15 Skills';
PRINT '- 10 Partner Industries';  
PRINT '- 4 Organizations with verified status';
PRINT '- 5 Volunteers with skills and experience';
PRINT '- 3 Partners from different industries';
PRINT '- 2 Volunteer Coordinators';
PRINT '- 6 Events with different categories and status';
PRINT '- Event registrations and volunteer assignments';
PRINT '- Sample feedback and support requests';
PRINT '- Partner collaborations';
PRINT '';
PRINT '=====================================================';
PRINT 'IVAN VOLUNTEER MANAGEMENT SYSTEM DATABASE';
PRINT 'Version 2.0 - Organized Structure';
PRINT 'Database schema created successfully!';
PRINT '=====================================================';
PRINT '';
PRINT 'Core Tables Created:';
PRINT '- User Management (3 tables)';
PRINT '- Organization Management (4 tables)';  
PRINT '- Volunteer Management (4 tables)';
PRINT '- Partner Management (3 tables)';
PRINT '- Event Management (6 tables)';
PRINT '- Task Management (6 tables)';
PRINT '- Feedback & Support (6 tables)';
PRINT '- AI System (9 tables)';
PRINT '- Total: 41+ tables with comprehensive indexing';
PRINT '';
PRINT 'Sample Data Inserted:';
PRINT '- 5 User Roles with Vietnamese descriptions';
PRINT '- 5 Organization Types';
PRINT '- 15 Skills with Vietnamese names';
PRINT '- 10 Partner Industries';
PRINT '- 4 Organizations with verified status';
PRINT '- 5 Volunteers with skills and experience';
PRINT '- 3 Partners from different industries';
PRINT '- 6 Events with Vietnamese descriptions';
PRINT '- Event registrations and feedback';
PRINT '- AI instruction templates in Vietnamese';
PRINT '';
PRINT 'Vietnamese Character Support: ✓ CONFIGURED';
PRINT 'Ready for production use!';
PRINT '=====================================================';

-- =====================================================
-- VIETNAMESE CHARACTER SUPPORT NOTES
-- =====================================================
-- 
-- This database schema has been optimized for Vietnamese character support with the following improvements:
--
-- 1. DATABASE COLLATION: Vietnamese_CI_AS
--    - Ensures proper sorting and comparison of Vietnamese characters
--    - Case-insensitive (CI) and accent-sensitive (AS)
--
-- 2. UNICODE DATA TYPES: All text fields use NVARCHAR instead of VARCHAR
--    - Supports full Unicode character set including Vietnamese diacritics
--    - Proper storage of special characters like ă, â, đ, ê, ô, ơ, ư
--
-- 3. UNICODE LITERALS: All Vietnamese text in INSERT statements uses N prefix
--    - Example: N'Nguyễn Văn A' instead of 'Nguyễn Văn A'
--    - Ensures proper Unicode interpretation during insertion
--
-- 4. CLIENT CONFIGURATION:
--    - Ensure your client application connects with UTF-8 encoding
--    - For SSMS: Tools -> Options -> Query Execution -> SQL Server -> Advanced
--    - Set "Results to Text" output format to Unicode if needed
--
-- 5. CONNECTION STRINGS should include:
--    - For .NET: "...;CharSet=UTF-8;" or "...;MultipleActiveResultSets=true;"
--    - For ODBC: "...;CharacterSet=UTF8;"
--
-- TESTING VIETNAMESE CHARACTERS:
-- After creating the database, test with these queries:
--
-- SELECT N'Xin chào! Tôi là Nguyễn Văn A.' AS TestVietnamese;
-- INSERT INTO UserProfiles (FirstName, LastName) VALUES (N'Nguyễn', N'Văn A');
-- SELECT FirstName, LastName FROM UserProfiles WHERE FirstName = N'Nguyễn';
--
-- If characters display correctly, the setup is successful!
-- =====================================================
