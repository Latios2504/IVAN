-- ========================================
-- VOLUNTEER MANAGEMENT SYSTEM DATABASE
-- ========================================

-- Create database
CREATE DATABASE volunteer_management_system;
GO

USE volunteer_management_system;
GO

-- ========================================
-- CORE USER MANAGEMENT TABLES
-- ========================================

-- User roles table
CREATE TABLE roles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Main users table
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(100) NOT NULL UNIQUE,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    is_active BIT DEFAULT 1,
    email_verified BIT DEFAULT 0,
    last_login DATETIME2 NULL,
    failed_login_attempts INT DEFAULT 0,
    locked_until DATETIME2 NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    token NVARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME2 NOT NULL,
    used BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- PROFILE MANAGEMENT TABLES
-- ========================================

-- Volunteer profiles
CREATE TABLE volunteer_profiles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    phone NVARCHAR(20),
    date_of_birth DATE,
    gender NVARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
    address NVARCHAR(MAX),
    city NVARCHAR(100),
    state NVARCHAR(100),
    postal_code NVARCHAR(20),
    country NVARCHAR(100),
    emergency_contact_name NVARCHAR(200),
    emergency_contact_phone NVARCHAR(20),
    skills NVARCHAR(MAX),
    interests NVARCHAR(MAX),
    availability NVARCHAR(MAX),
    volunteer_hours_completed INT DEFAULT 0,
    profile_picture_url NVARCHAR(500),
    bio NVARCHAR(MAX),
    linkedin_url NVARCHAR(300),
    facebook_url NVARCHAR(300),
    twitter_url NVARCHAR(300),
    languages_spoken NVARCHAR(MAX),
    education_level NVARCHAR(100),
    occupation NVARCHAR(100),
    company NVARCHAR(200),
    is_background_checked BIT DEFAULT 0,
    background_check_date DATE,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Organization profiles
CREATE TABLE organization_profiles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    organization_name NVARCHAR(200) NOT NULL,
    organization_type NVARCHAR(50) CHECK (organization_type IN ('NGO', 'Non-profit', 'Government', 'Educational', 'Religious', 'Corporate', 'Other')),
    registration_number NVARCHAR(100),
    tax_id NVARCHAR(100),
    description NVARCHAR(MAX),
    mission_statement NVARCHAR(MAX),
    website_url NVARCHAR(300),
    phone NVARCHAR(20),
    email NVARCHAR(255),
    address NVARCHAR(MAX),
    city NVARCHAR(100),
    state NVARCHAR(100),
    postal_code NVARCHAR(20),
    country NVARCHAR(100),
    contact_person_name NVARCHAR(200),
    contact_person_title NVARCHAR(100),
    contact_person_email NVARCHAR(255),
    contact_person_phone NVARCHAR(20),
    logo_url NVARCHAR(500),
    banner_url NVARCHAR(500),
    social_media_links NVARCHAR(MAX), -- SQL Server không có JSON riêng, dùng NVARCHAR(MAX)
    founded_year SMALLINT,
    employee_count INT,
    annual_budget DECIMAL(15,2),
    focus_areas NVARCHAR(MAX),
    is_verified BIT DEFAULT 0,
    verification_documents NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Partner profiles
CREATE TABLE partner_profiles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    partner_name NVARCHAR(200) NOT NULL,
    partner_type NVARCHAR(50) CHECK (partner_type IN ('Corporate', 'Foundation', 'Government', 'Media', 'Technology', 'Other')),
    industry NVARCHAR(100),
    company_size NVARCHAR(50) CHECK (company_size IN ('Startup', 'Small', 'Medium', 'Large', 'Enterprise')),
    description NVARCHAR(MAX),
    services_offered NVARCHAR(MAX),
    website_url NVARCHAR(300),
    phone NVARCHAR(20),
    email NVARCHAR(255),
    address NVARCHAR(MAX),
    city NVARCHAR(100),
    state NVARCHAR(100),
    postal_code NVARCHAR(20),
    country NVARCHAR(100),
    primary_contact_name NVARCHAR(200),
    primary_contact_title NVARCHAR(100),
    primary_contact_email NVARCHAR(255),
    primary_contact_phone NVARCHAR(20),
    logo_url NVARCHAR(500),
    partnership_interests NVARCHAR(MAX),
    resources_available NVARCHAR(MAX),
    csr_focus_areas NVARCHAR(MAX),
    annual_contribution_budget DECIMAL(15,2),
    preferred_partnership_types NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- EVENT MANAGEMENT TABLES
-- ========================================

-- Event categories
CREATE TABLE event_categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(MAX),
    icon_url NVARCHAR(300),
    color NVARCHAR(7), -- Hex color code
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Events
CREATE TABLE events (
    id INT IDENTITY(1,1) PRIMARY KEY,
    organization_id INT NOT NULL,
    category_id INT,
    title NVARCHAR(300) NOT NULL,
    description NVARCHAR(MAX),
    objectives NVARCHAR(MAX),
    location NVARCHAR(500),
    address NVARCHAR(MAX),
    city NVARCHAR(100),
    state NVARCHAR(100),
    postal_code NVARCHAR(20),
    country NVARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    registration_start_date DATE,
    registration_end_date DATE,
    max_volunteers INT,
    min_volunteers INT DEFAULT 1,
    current_volunteers INT DEFAULT 0,
    status NVARCHAR(50) CHECK (status IN ('Draft', 'Published', 'Registration_Open', 'Registration_Closed', 'In_Progress', 'Completed', 'Cancelled')) DEFAULT 'Draft',
    visibility NVARCHAR(50) CHECK (visibility IN ('Public', 'Private', 'Invite_Only')) DEFAULT 'Public',
    requirements NVARCHAR(MAX),
    benefits NVARCHAR(MAX),
    materials_provided NVARCHAR(MAX),
    what_to_bring NVARCHAR(MAX),
    age_requirement_min INT,
    age_requirement_max INT,
    skill_requirements NVARCHAR(MAX),
    physical_requirements NVARCHAR(MAX),
    background_check_required BIT DEFAULT 0,
    transportation_provided BIT DEFAULT 0,
    meals_provided BIT DEFAULT 0,
    accommodation_provided BIT DEFAULT 0,
    insurance_provided BIT DEFAULT 0,
    certificate_provided BIT DEFAULT 0,
    cover_image_url NVARCHAR(500),
    gallery_images NVARCHAR(MAX),
    contact_email NVARCHAR(255),
    contact_phone NVARCHAR(20),
    emergency_contact NVARCHAR(200),
    tags NVARCHAR(MAX),
    is_recurring BIT DEFAULT 0,
    recurring_pattern NVARCHAR(100),
    parent_event_id INT,
    estimated_impact NVARCHAR(MAX),
    budget DECIMAL(15,2),
    fundraising_goal DECIMAL(15,2),
    current_funds_raised DECIMAL(15,2) DEFAULT 0,
    approval_status NVARCHAR(50) CHECK (approval_status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
    approved_by INT,
    approved_at DATETIME2 NULL,
    rejection_reason NVARCHAR(MAX),
    created_by INT NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (organization_id) REFERENCES organization_profiles(id),
    FOREIGN KEY (category_id) REFERENCES event_categories(id),
    FOREIGN KEY (parent_event_id) REFERENCES events(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_event_dates ON events(start_date, end_date);
CREATE INDEX idx_event_status ON events(status);
CREATE INDEX idx_event_location ON events(city, state, country);

-- ========================================
-- REGISTRATION MANAGEMENT TABLES
-- ========================================

-- Volunteer registrations
CREATE TABLE volunteer_registrations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    event_id INT NOT NULL,
    volunteer_id INT NOT NULL,
    registration_date DATETIME2 DEFAULT GETDATE(),
    status NVARCHAR(50) CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Waitlisted', 'Cancelled', 'Completed', 'No_Show')) DEFAULT 'Pending',
    motivation NVARCHAR(MAX),
    availability_notes NVARCHAR(MAX),
    dietary_restrictions NVARCHAR(MAX),
    medical_conditions NVARCHAR(MAX),
    emergency_contact_name NVARCHAR(200),
    emergency_contact_phone NVARCHAR(20),
    transportation_needed BIT DEFAULT 0,
    accommodation_needed BIT DEFAULT 0,
    special_requests NVARCHAR(MAX),
    skills_offered NVARCHAR(MAX),
    previous_experience NVARCHAR(MAX),
    how_heard_about_event NVARCHAR(200),
    approved_by INT,
    approved_at DATETIME2 NULL,
    rejection_reason NVARCHAR(MAX),
    check_in_time DATETIME2 NULL,
    check_out_time DATETIME2 NULL,
    hours_completed DECIMAL(5,2) DEFAULT 0,
    performance_rating INT CHECK (performance_rating >= 1 AND performance_rating <= 5),
    coordinator_notes NVARCHAR(MAX),
    volunteer_feedback NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT unique_volunteer_event UNIQUE (event_id, volunteer_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (volunteer_id) REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

CREATE INDEX idx_registration_status ON volunteer_registrations(status);
CREATE INDEX idx_registration_date ON volunteer_registrations(registration_date);

-- ========================================
-- SCHEDULE MANAGEMENT TABLES
-- ========================================

-- Event schedules
CREATE TABLE event_schedules (
    id INT IDENTITY(1,1) PRIMARY KEY,
    event_id INT NOT NULL,
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    start_datetime DATETIME2 NOT NULL,
    end_datetime DATETIME2 NOT NULL,
    location NVARCHAR(300),
    required_volunteers INT DEFAULT 1,
    assigned_volunteers INT DEFAULT 0,
    requirements NVARCHAR(MAX),
    notes NVARCHAR(MAX),
    is_mandatory BIT DEFAULT 0,
    created_by INT NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_schedule_datetime ON event_schedules(start_datetime, end_datetime);

-- Volunteer schedule assignments
CREATE TABLE volunteer_schedule_assignments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    schedule_id INT NOT NULL,
    volunteer_id INT NOT NULL,
    status NVARCHAR(50) CHECK (status IN ('Assigned', 'Confirmed', 'Declined', 'Completed', 'No_Show')) DEFAULT 'Assigned',
    assigned_by INT NOT NULL,
    assigned_at DATETIME2 DEFAULT GETDATE(),
    confirmed_at DATETIME2 NULL,
    notes NVARCHAR(MAX),
    CONSTRAINT unique_volunteer_schedule UNIQUE (schedule_id, volunteer_id),
    FOREIGN KEY (schedule_id) REFERENCES event_schedules(id) ON DELETE CASCADE,
    FOREIGN KEY (volunteer_id) REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id)
);

-- ========================================
-- TASK MANAGEMENT TABLES
-- ========================================

-- On-site tasks
CREATE TABLE onsite_tasks (
    id INT IDENTITY(1,1) PRIMARY KEY,
    event_id INT NOT NULL,
    schedule_id INT,
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    priority NVARCHAR(50) CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
    status NVARCHAR(50) CHECK (status IN ('Pending', 'In_Progress', 'Completed', 'Cancelled')) DEFAULT 'Pending',
    assigned_to INT,
    estimated_duration INT, -- in minutes
    actual_duration INT, -- in minutes
    location NVARCHAR(300),
    equipment_needed NVARCHAR(MAX),
    instructions NVARCHAR(MAX),
    safety_notes NVARCHAR(MAX),
    completion_notes NVARCHAR(MAX),
    due_datetime DATETIME2,
    started_at DATETIME2 NULL,
    completed_at DATETIME2 NULL,
    created_by INT NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES event_schedules(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_task_status ON onsite_tasks(status);
CREATE INDEX idx_task_priority ON onsite_tasks(priority);
CREATE INDEX idx_task_due_date ON onsite_tasks(due_datetime);

-- Coordinator tasks
CREATE TABLE coordinator_tasks (
    id INT IDENTITY(1,1) PRIMARY KEY,
    event_id INT NOT NULL,
    coordinator_id INT NOT NULL,
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    category NVARCHAR(50) CHECK (category IN ('Planning', 'Coordination', 'Communication', 'Logistics', 'Reporting', 'Other')) DEFAULT 'Other',
    priority NVARCHAR(50) CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
    status NVARCHAR(50) CHECK (status IN ('Pending', 'In_Progress', 'Completed', 'Cancelled')) DEFAULT 'Pending',
    due_date DATE,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    completion_notes NVARCHAR(MAX),
    started_at DATETIME2 NULL,
    completed_at DATETIME2 NULL,
    created_by INT NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (coordinator_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ========================================
-- FEEDBACK MANAGEMENT TABLES
-- ========================================

-- Feedback categories
CREATE TABLE feedback_categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Feedback submissions
CREATE TABLE feedback (
    id INT IDENTITY(1,1) PRIMARY KEY,
    event_id INT,
    category_id INT,
    submitted_by INT,
    submitter_type NVARCHAR(50) CHECK (submitter_type IN ('Volunteer', 'Organization', 'Coordinator', 'Partner', 'Anonymous')) NOT NULL,
    title NVARCHAR(200),
    content NVARCHAR(MAX) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    suggestions NVARCHAR(MAX),
    is_anonymous BIT DEFAULT 0,
    status NVARCHAR(50) CHECK (status IN ('Pending', 'Under_Review', 'Addressed', 'Dismissed')) DEFAULT 'Pending',
    response NVARCHAR(MAX),
    responded_by INT,
    responded_at DATETIME2 NULL,
    visibility NVARCHAR(50) CHECK (visibility IN ('Public', 'Internal', 'Private')) DEFAULT 'Internal',
    helpful_votes INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (category_id) REFERENCES feedback_categories(id),
    FOREIGN KEY (submitted_by) REFERENCES users(id),
    FOREIGN KEY (responded_by) REFERENCES users(id)
);

CREATE INDEX idx_feedback_rating ON feedback(rating);
CREATE INDEX idx_feedback_status ON feedback(status);

-- ========================================
-- CERTIFICATE MANAGEMENT TABLES
-- ========================================

-- Certificate templates
CREATE TABLE certificate_templates (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    template_html NVARCHAR(MAX) NOT NULL,
    template_css NVARCHAR(MAX),
    background_image_url NVARCHAR(500),
    signature_image_url NVARCHAR(500),
    is_active BIT DEFAULT 1,
    created_by INT NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Certificates issued
CREATE TABLE certificates (
    id INT IDENTITY(1,1) PRIMARY KEY,
    certificate_number NVARCHAR(100) NOT NULL UNIQUE,
    event_id INT NOT NULL,
    volunteer_id INT NOT NULL,
    template_id INT NOT NULL,
    volunteer_name NVARCHAR(200) NOT NULL,
    event_title NVARCHAR(300) NOT NULL,
    organization_name NVARCHAR(200) NOT NULL,
    hours_completed DECIMAL(5,2) NOT NULL,
    issue_date DATE NOT NULL,
    completion_date DATE NOT NULL,
    certificate_url NVARCHAR(500),
    verification_code NVARCHAR(100) NOT NULL UNIQUE,
    additional_notes NVARCHAR(MAX),
    issued_by INT NOT NULL,
    is_verified BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (volunteer_id) REFERENCES volunteer_profiles(id),
    FOREIGN KEY (template_id) REFERENCES certificate_templates(id),
    FOREIGN KEY (issued_by) REFERENCES users(id)
);

CREATE INDEX idx_certificate_number ON certificates(certificate_number);
CREATE INDEX idx_verification_code ON certificates(verification_code);

-- ========================================
-- SUPPORT REQUEST MANAGEMENT TABLES
-- ========================================

-- Support request categories
CREATE TABLE support_request_categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(MAX),
    icon NVARCHAR(50),
    color NVARCHAR(7),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Support requests
CREATE TABLE support_requests (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ticket_number NVARCHAR(50) NOT NULL UNIQUE,
    category_id INT NOT NULL,
    title NVARCHAR(300) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    priority NVARCHAR(50) CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
    status NVARCHAR(50) CHECK (status IN ('New', 'Open', 'In_Progress', 'Pending_Response', 'Resolved', 'Closed')) DEFAULT 'New',
    requested_by INT,
    requester_email NVARCHAR(255),
    requester_phone NVARCHAR(20),
    requester_name NVARCHAR(200),
    organization_id INT,
    event_id INT,
    assigned_to INT,
    resolution NVARCHAR(MAX),
    internal_notes NVARCHAR(MAX),
    attachments NVARCHAR(MAX),
    due_date DATETIME,
    resolved_at DATETIME2 NULL,
    closed_at DATETIME2 NULL,
    satisfaction_rating INT CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    satisfaction_feedback NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (category_id) REFERENCES support_request_categories(id),
    FOREIGN KEY (requested_by) REFERENCES users(id),
    FOREIGN KEY (organization_id) REFERENCES organization_profiles(id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

CREATE INDEX idx_ticket_number ON support_requests(ticket_number);
CREATE INDEX idx_support_status ON support_requests(status);
CREATE INDEX idx_support_priority ON support_requests(priority);

-- ========================================
-- PARTNERSHIP MANAGEMENT TABLES
-- ========================================

-- Partnership types
CREATE TABLE partnership_types (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Partner collaborations
CREATE TABLE partner_collaborations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    partner_id INT NOT NULL,
    organization_id INT,
    event_id INT,
    partnership_type_id INT NOT NULL,
    title NVARCHAR(300) NOT NULL,
    description NVARCHAR(MAX),
    start_date DATE NOT NULL,
    end_date DATE,
    status NVARCHAR(50) CHECK (status IN ('Proposed', 'Under_Review', 'Active', 'Completed', 'Cancelled', 'Suspended')) DEFAULT 'Proposed',
    contribution_type NVARCHAR(50) CHECK (contribution_type IN ('Financial', 'In_Kind', 'Services', 'Venue', 'Equipment', 'Marketing', 'Other')) NOT NULL,
    financial_contribution DECIMAL(15,2),
    in_kind_value DECIMAL(15,2),
    services_description NVARCHAR(MAX),
    deliverables NVARCHAR(MAX),
    terms_and_conditions NVARCHAR(MAX),
    contact_person_partner NVARCHAR(200),
    contact_person_organization NVARCHAR(200),
    performance_metrics NVARCHAR(MAX),
    success_criteria NVARCHAR(MAX),
    reporting_requirements NVARCHAR(MAX),
    contract_url NVARCHAR(500),
    renewal_date DATE,
    is_renewable BIT DEFAULT 0,
    created_by INT NOT NULL,
    approved_by INT,
    approved_at DATETIME2 NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (partner_id) REFERENCES partner_profiles(id),
    FOREIGN KEY (organization_id) REFERENCES organization_profiles(id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (partnership_type_id) REFERENCES partnership_types(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- ========================================
-- NOTIFICATION MANAGEMENT TABLES
-- ========================================

-- Notification templates
CREATE TABLE notification_templates (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL UNIQUE,
    type NVARCHAR(50) CHECK (type IN ('Email', 'SMS', 'Push', 'In_App')) NOT NULL,
    subject NVARCHAR(300),
    body_template NVARCHAR(MAX) NOT NULL,
    variables NVARCHAR(MAX),
    is_active BIT DEFAULT 1,
    created_by INT NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Notifications sent
CREATE TABLE notifications (
    id INT IDENTITY(1,1) PRIMARY KEY,
    template_id INT,
    recipient_id INT,
    recipient_email NVARCHAR(255),
    recipient_phone NVARCHAR(20),
    type NVARCHAR(50) CHECK (type IN ('Email', 'SMS', 'Push', 'In_App')) NOT NULL,
    subject NVARCHAR(300),
    content NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(50) CHECK (status IN ('Pending', 'Sent', 'Delivered', 'Failed', 'Bounced')) DEFAULT 'Pending',
    priority NVARCHAR(50) CHECK (priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
    scheduled_at DATETIME2,
    sent_at DATETIME2 NULL,
    delivered_at DATETIME2 NULL,
    opened_at DATETIME2 NULL,
    clicked_at DATETIME2 NULL,
    error_message NVARCHAR(MAX),
    retry_count INT DEFAULT 0,
    event_id INT,
    related_entity_type NVARCHAR(50),
    related_entity_id INT,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (template_id) REFERENCES notification_templates(id),
    FOREIGN KEY (recipient_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE INDEX idx_notification_status ON notifications(status);
CREATE INDEX idx_notification_type ON notifications(type);
CREATE INDEX idx_notification_scheduled ON notifications(scheduled_at);

-- ========================================
-- CHATBOT MANAGEMENT TABLES
-- ========================================

-- Chatbot conversations
CREATE TABLE chatbot_conversations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    session_id NVARCHAR(255) NOT NULL,
    platform NVARCHAR(50) CHECK (platform IN ('Web', 'Mobile', 'WhatsApp', 'Telegram', 'Facebook')) DEFAULT 'Web',
    started_at DATETIME2 DEFAULT GETDATE(),
    ended_at DATETIME2 NULL,
    total_messages INT DEFAULT 0,
    satisfaction_rating INT CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    resolved BIT DEFAULT 0,
    escalated_to_human BIT DEFAULT 0,
    escalated_at DATETIME2 NULL,
    user_ip NVARCHAR(45),
    user_agent NVARCHAR(MAX),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_session_id ON chatbot_conversations(session_id);

-- Chatbot interactions
CREATE TABLE chatbot_interactions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    conversation_id INT NOT NULL,
    message_type NVARCHAR(50) CHECK (message_type IN ('User', 'Bot', 'System')) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    intent NVARCHAR(100),
    confidence_score DECIMAL(3,2),
    entities NVARCHAR(MAX),
    response_time_ms INT,
    was_helpful BIT,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (conversation_id) REFERENCES chatbot_conversations(id) ON DELETE CASCADE
);

CREATE INDEX idx_conversation_id ON chatbot_interactions(conversation_id);
CREATE INDEX idx_intent ON chatbot_interactions(intent);

-- ========================================
-- REPORTING TABLES
-- ========================================

-- Event reports
CREATE TABLE event_reports (
    id INT IDENTITY(1,1) PRIMARY KEY,
    event_id INT NOT NULL,
    report_type NVARCHAR(50) CHECK (report_type IN ('Pre_Event', 'Progress', 'Final', 'Impact')) NOT NULL,
    title NVARCHAR(300) NOT NULL,
    summary NVARCHAR(MAX),
    objectives_met NVARCHAR(MAX),
    challenges_faced NVARCHAR(MAX),
    lessons_learned NVARCHAR(MAX),
    recommendations NVARCHAR(MAX),
    volunteer_statistics NVARCHAR(MAX),
    financial_summary NVARCHAR(MAX),
    impact_metrics NVARCHAR(MAX),
    feedback_summary NVARCHAR(MAX),
    media_coverage NVARCHAR(MAX),
    photos_videos NVARCHAR(MAX),
    next_steps NVARCHAR(MAX),
    report_data NVARCHAR(MAX),
    generated_by INT NOT NULL,
    approved_by INT,
    approved_at DATETIME2 NULL,
    report_url NVARCHAR(500),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (generated_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- System reports
CREATE TABLE system_reports (
    id INT IDENTITY(1,1) PRIMARY KEY,
    report_type NVARCHAR(50) CHECK (report_type IN ('User_Activity', 'Event_Analytics', 'Performance_Metrics', 'Financial', 'Custom')) NOT NULL,
    title NVARCHAR(300) NOT NULL,
    description NVARCHAR(MAX),
    date_range_start DATE NOT NULL,
    date_range_end DATE NOT NULL,
    parameters NVARCHAR(MAX),
    report_data NVARCHAR(MAX) NOT NULL,
    summary NVARCHAR(MAX),
    insights NVARCHAR(MAX),
    recommendations NVARCHAR(MAX),
    generated_by INT NOT NULL,
    report_url NVARCHAR(500),
    is_scheduled BIT DEFAULT 0,
    schedule_frequency NVARCHAR(50) CHECK (schedule_frequency IN ('Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly')),
    next_generation_date DATE,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (generated_by) REFERENCES users(id)
);

-- ========================================
-- CONTENT MANAGEMENT TABLES
-- ========================================

-- Public content pages
CREATE TABLE public_content (
    id INT IDENTITY(1,1) PRIMARY KEY,
    slug NVARCHAR(200) NOT NULL UNIQUE,
    title NVARCHAR(300) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    excerpt NVARCHAR(MAX),
    content_type NVARCHAR(50) CHECK (content_type IN ('Page', 'Article', 'News', 'FAQ', 'Policy')) DEFAULT 'Page',
    status NVARCHAR(50) CHECK (status IN ('Draft', 'Published', 'Archived')) DEFAULT 'Draft',
    featured_image_url NVARCHAR(500),
    meta_title NVARCHAR(200),
    meta_description NVARCHAR(MAX),
    meta_keywords NVARCHAR(MAX),
    author_id INT NOT NULL,
    published_at DATETIME2 NULL,
    view_count INT DEFAULT 0,
    tags NVARCHAR(MAX),
    allow_comments BIT DEFAULT 0,
    is_featured BIT DEFAULT 0,
    display_order INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE INDEX idx_content_slug ON public_content(slug);
CREATE INDEX idx_content_status ON public_content(status);
CREATE INDEX idx_content_type ON public_content(content_type);

-- Content moderation queue
CREATE TABLE content_moderation (
    id INT IDENTITY(1,1) PRIMARY KEY,
    content_type NVARCHAR(50) CHECK (content_type IN ('Event', 'Feedback', 'Public_Content', 'User_Profile', 'Comment')) NOT NULL,
    content_id INT NOT NULL,
    status NVARCHAR(50) CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Under_Review')) DEFAULT 'Pending',
    moderation_reason NVARCHAR(MAX),
    flagged_content NVARCHAR(MAX),
    severity NVARCHAR(50) CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
    auto_flagged BIT DEFAULT 0,
    flag_reasons NVARCHAR(MAX),
    submitted_by INT,
    reviewed_by INT,
    reviewed_at DATETIME2 NULL,
    reviewer_notes NVARCHAR(MAX),
    action_taken NVARCHAR(50) CHECK (action_taken IN ('None', 'Edit_Required', 'Content_Hidden', 'User_Warned', 'Account_Suspended')),
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (submitted_by) REFERENCES users(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

CREATE INDEX idx_moderation_status ON content_moderation(status);
CREATE INDEX idx_moderation_content ON content_moderation(content_type, content_id);

-- ========================================
-- AUDIT AND LOGGING TABLES
-- ========================================

-- Activity logs
CREATE TABLE activity_logs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    action NVARCHAR(100) NOT NULL,
    entity_type NVARCHAR(50),
    entity_id INT,
    details NVARCHAR(MAX),
    ip_address NVARCHAR(45),
    user_agent NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_action ON activity_logs(action);
CREATE INDEX idx_activity_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_date ON activity_logs(created_at);

-- System settings
CREATE TABLE system_settings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    setting_key NVARCHAR(100) NOT NULL UNIQUE,
    setting_value NVARCHAR(MAX),
    setting_type NVARCHAR(50) CHECK (setting_type IN ('String', 'Integer', 'Boolean', 'JSON')) DEFAULT 'String',
    description NVARCHAR(MAX),
    is_public BIT DEFAULT 0,
    updated_by INT,
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- ========================================
-- ADDITIONAL UTILITY TABLES
-- ========================================

-- File uploads tracking
CREATE TABLE file_uploads (
    id INT IDENTITY(1,1) PRIMARY KEY,
    filename NVARCHAR(255) NOT NULL,
    original_filename NVARCHAR(255) NOT NULL,
    file_path NVARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type NVARCHAR(100) NOT NULL,
    uploaded_by INT NOT NULL,
    entity_type NVARCHAR(50),
    entity_id INT,
    upload_purpose NVARCHAR(100),
    is_public BIT DEFAULT 0,
    download_count INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE INDEX idx_file_entity ON file_uploads(entity_type, entity_id);

-- Event tags for better categorization
CREATE TABLE event_tags (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(MAX),
    color NVARCHAR(7),
    usage_count INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Many-to-many relationship for event tags
CREATE TABLE event_tag_associations (
    event_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (event_id, tag_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES event_tags(id) ON DELETE CASCADE
);

-- Volunteer skills for better matching
CREATE TABLE volunteer_skills (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL UNIQUE,
    category NVARCHAR(100),
    description NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Many-to-many relationship for volunteer skills
CREATE TABLE volunteer_skill_associations (
    volunteer_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency_level NVARCHAR(50) CHECK (proficiency_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')) DEFAULT 'Intermediate',
    years_of_experience INT,
    PRIMARY KEY (volunteer_id, skill_id),
    FOREIGN KEY (volunteer_id) REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES volunteer_skills(id) ON DELETE CASCADE
);

-- Event requirements matching
CREATE TABLE event_skill_requirements (
    event_id INT NOT NULL,
    skill_id INT NOT NULL,
    required_level NVARCHAR(50) CHECK (required_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')) DEFAULT 'Beginner',
    is_mandatory BIT DEFAULT 0,
    PRIMARY KEY (event_id, skill_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES volunteer_skills(id) ON DELETE CASCADE
);

-- ========================================
-- SAMPLE DATA INSERTS
-- ========================================

-- Insert roles
INSERT INTO roles (name, description) VALUES
('Guest', 'Visitor with limited access to public information'),
('Volunteer', 'Registered volunteer who can participate in events'),
('Organization', 'Organization that can create and manage events'),
('Admin', 'System administrator with full access'),
('Volunteer_Coordinator', 'Coordinates volunteers for specific events'),
('Partner', 'Partner organization providing support and collaboration');

-- Insert sample users
INSERT INTO users (username, email, password_hash, role_id, is_active, email_verified) VALUES
('admin', 'admin@volunteer.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 4, 1, 1),
('org_redcross', 'contact@redcross.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, 1, 1),
('volunteer_john', 'john.doe@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 1, 1),
('coordinator_mary', 'mary.smith@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 5, 1, 1),
('partner_microsoft', 'partnerships@microsoft.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 6, 1, 1);

-- Insert sample volunteer profile
INSERT INTO volunteer_profiles (
    user_id, first_name, last_name, phone, date_of_birth, gender, 
    address, city, state, postal_code, country, emergency_contact_name, 
    emergency_contact_phone, skills, interests, availability, bio, 
    languages_spoken, education_level, occupation
) VALUES (
    3, 'John', 'Doe', '+1-555-0123', '1990-05-15', 'Male',
    '123 Main Street', 'New York', 'NY', '10001', 'USA',
    'Jane Doe', '+1-555-0124', 
    'First Aid, Teaching, Event Management, Public Speaking',
    'Environmental Conservation, Education, Community Development',
    'Weekends, Evening hours after 6 PM',
    'Passionate volunteer with 5+ years of experience in community service. Dedicated to making a positive impact through education and environmental initiatives.',
    'English, Spanish', 'Bachelor''s Degree', 'Software Engineer'
);

-- Insert sample organization profile
INSERT INTO organization_profiles (
    user_id, organization_name, organization_type, description, mission_statement,
    website_url, phone, email, address, city, state, postal_code, country,
    contact_person_name, contact_person_title, contact_person_email, contact_person_phone,
    founded_year, employee_count, focus_areas, is_verified
) VALUES (
    2, 'Red Cross Society', 'NGO', 
    'International humanitarian organization providing emergency assistance, disaster relief, and disaster preparedness education.',
    'To prevent and alleviate human suffering in the face of emergencies by mobilizing the power of volunteers and the generosity of donors.',
    'https://redcross.org', '+1-800-RED-CROSS', 'contact@redcross.org',
    '2025 E Street NW', 'Washington', 'DC', '20006', 'USA',
    'Sarah Johnson', 'Director of Volunteer Services', 'sarah.j@redcross.org', '+1-202-303-5000',
    1881, 500, 'Disaster Relief, Blood Donation, Emergency Preparedness, Health and Safety Training', 1
);

-- Insert sample partner profile
INSERT INTO partner_profiles (
    user_id, partner_name, partner_type, industry, company_size, description,
    website_url, phone, email, address, city, state, postal_code, country,
    primary_contact_name, primary_contact_title, primary_contact_email, primary_contact_phone,
    partnership_interests, resources_available, csr_focus_areas, annual_contribution_budget
) VALUES (
    5, 'Microsoft Corporation', 'Corporate', 'Technology', 'Enterprise',
    'Multinational technology corporation providing cloud computing, productivity software, and AI solutions.',
    'https://microsoft.com', '+1-425-882-8080', 'partnerships@microsoft.com',
    'One Microsoft Way', 'Redmond', 'WA', '98052', 'USA',
    'David Chen', 'CSR Partnership Manager', 'david.chen@microsoft.com', '+1-425-882-8081',
    'Digital Skills Training, Technology Access, Environmental Sustainability',
    'Technology platforms, Cloud services, Employee volunteers, Funding',
    'Education, Environmental Sustainability, Digital Inclusion, Economic Opportunity',
    500000.00
);

-- Insert sample event categories
INSERT INTO event_categories (name, description, icon_url, color) VALUES
('Environment', 'Environmental conservation and sustainability events', '/icons/environment.svg', '#4CAF50'),
('Education', 'Educational and tutoring programs', '/icons/education.svg', '#2196F3'),
('Health', 'Health and wellness community programs', '/icons/health.svg', '#F44336'),
('Disaster Relief', 'Emergency response and disaster relief efforts', '/icons/disaster.svg', '#FF9800'),
('Community Development', 'Local community improvement projects', '/icons/community.svg', '#9C27B0'),
('Senior Care', 'Programs supporting elderly community members', '/icons/senior.svg', '#607D8B');

-- Insert sample events
INSERT INTO events (
    organization_id, category_id, title, description, location, address, city, state, postal_code, country,
    start_date, end_date, start_time, end_time, registration_start_date, registration_end_date,
    max_volunteers, status, requirements, benefits, created_by
) VALUES (
    1, 1, 'City Park Cleanup Drive', 
    'Join us for a community-wide effort to clean and beautify our local park. We will be removing litter, planting flowers, and maintaining walking trails.',
    'Central City Park', '100 Park Avenue', 'New York', 'NY', '10001', 'USA',
    '2024-06-15', '2024-06-15', '09:00:00', '15:00:00', '2024-05-01', '2024-06-10',
    50, 'Published', 
    'Comfortable outdoor clothing, work gloves recommended, minimum age 16',
    'Community service certificate, lunch provided, networking opportunities',
    2
),
(
    1, 2, 'Digital Literacy Workshop for Seniors',
    'Help senior citizens learn basic computer and internet skills. Volunteers will provide one-on-one assistance with email, social media, and online safety.',
    'Community Center', '456 Community Drive', 'New York', 'NY', '10002', 'USA',
    '2024-06-20', '2024-06-22', '10:00:00', '16:00:00', '2024-05-15', '2024-06-15',
    25, 'Registration_Open',
    'Basic computer knowledge, patience with elderly, background check required',
    'Teaching experience, volunteer certificate, refreshments provided',
    2
);

-- Insert sample volunteer skills
INSERT INTO volunteer_skills (name, category, description) VALUES
('First Aid/CPR', 'Health & Safety', 'Certified in first aid and CPR techniques'),
('Event Planning', 'Management', 'Experience in organizing and coordinating events'),
('Teaching/Tutoring', 'Education', 'Ability to teach or tutor various subjects'),
('Public Speaking', 'Communication', 'Comfortable speaking to groups and presentations'),
('Translation', 'Language', 'Multilingual translation and interpretation skills'),
('Photography/Videography', 'Media', 'Skills in capturing and editing visual content'),
('Fundraising', 'Development', 'Experience in raising funds and donations'),
('Social Media Management', 'Marketing', 'Managing social media platforms and content'),
('Construction/Handyman', 'Manual Labor', 'Building, repair, and maintenance skills'),
('Cooking/Food Service', 'Hospitality', 'Food preparation and service experience');

-- Insert sample event tags
INSERT INTO event_tags (name, description, color) VALUES
('Family Friendly', 'Suitable for volunteers of all ages including children', '#4CAF50'),
('Outdoors', 'Activities taking place in outdoor environments', '#2196F3'),
('Physical Activity', 'Events requiring moderate to high physical effort', '#FF5722'),
('Skills-Based', 'Opportunities requiring specific professional skills', '#9C27B0'),
('One-Time', 'Single occurrence events with no ongoing commitment', '#607D8B'),
('Recurring', 'Regular ongoing volunteer opportunities', '#795548'),
('Weekend', 'Events scheduled during weekend hours', '#FF9800'),
('Evening', 'Events scheduled during evening hours', '#3F51B5');

-- Insert feedback categories
INSERT INTO feedback_categories (name, description) VALUES
('Event Organization', 'Feedback about event planning and coordination'),
('Volunteer Experience', 'Comments about the volunteer experience and satisfaction'),
('Communication', 'Feedback about information sharing and updates'),
('Facilities/Location', 'Comments about event venues and facilities'),
('Impact/Outcomes', 'Feedback about the effectiveness and impact of the event'),
('Suggestions', 'Ideas for improvement and future events');

-- Insert support request categories
INSERT INTO support_request_categories (name, description, icon, color, is_active) VALUES
('Technical Issues', 'Problems with the platform or website functionality', 'bug', '#F44336', 1),
('Account Management', 'Issues related to user accounts and profiles', 'user', '#2196F3', 1),
('Event Registration', 'Problems with signing up for or managing event registrations', 'calendar', '#4CAF50', 1),
('General Inquiry', 'General questions and information requests', 'help-circle', '#FF9800', 1),
('Partnership', 'Inquiries about partnerships and collaborations', 'handshake', '#9C27B0', 1),
('Feedback/Complaints', 'User feedback and complaint submissions', 'message-circle', '#607D8B', 1);

-- Insert partnership types
INSERT INTO partnership_types (name, description) VALUES
('Sponsorship', 'Financial or in-kind sponsorship of events and programs'),
('Venue Partnership', 'Providing venues and facilities for events'),
('Technology Partnership', 'Providing technology platforms and digital services'),
('Marketing Partnership', 'Joint marketing and promotional activities'),
('Volunteer Partnership', 'Employee volunteer programs and skill-based volunteering'),
('Research Partnership', 'Collaborative research and impact measurement');

-- Insert certificate templates
INSERT INTO certificate_templates (name, description, template_html, is_active, created_by) VALUES
('Standard Volunteer Certificate', 'Basic certificate template for completed volunteer service',
'<div class="certificate"><h1>Certificate of Volunteer Service</h1><p>This certifies that</p><h2>{{volunteer_name}}</h2><p>has completed {{hours_completed}} hours of volunteer service at</p><h3>{{event_title}}</h3><p>organized by {{organization_name}}</p><p>Date: {{completion_date}}</p></div>',
1, 1),
('Leadership Recognition Certificate', 'Certificate for volunteers who demonstrated leadership',
'<div class="certificate leadership"><h1>Leadership Recognition Certificate</h1><p>In recognition of outstanding leadership and dedication</p><h2>{{volunteer_name}}</h2><p>has demonstrated exceptional service during</p><h3>{{event_title}}</h3><p>Contributing {{hours_completed}} hours of valuable service</p><p>{{organization_name}}</p><p>{{completion_date}}</p></div>',
1, 1);

-- Insert notification templates
INSERT INTO notification_templates (name, type, subject, body_template, variables, is_active, created_by) VALUES
('Registration Confirmation', 'Email', 'Registration Confirmed - {{event_title}}',
'Dear {{volunteer_name}},\n\nYour registration for "{{event_title}}" has been confirmed!\n\nEvent Details:\nDate: {{event_date}}\nTime: {{event_time}}\nLocation: {{event_location}}\n\nThank you for volunteering!\n\nBest regards,\n{{organization_name}}',
'["volunteer_name", "event_title", "event_date", "event_time", "event_location", "organization_name"]',
1, 1),
('Event Reminder', 'Email', 'Reminder: {{event_title}} is tomorrow!',
'Dear {{volunteer_name}},\n\nThis is a friendly reminder that you are registered for "{{event_title}}" tomorrow.\n\nPlease arrive at {{event_location}} by {{event_time}}.\n\nDon''t forget to bring: {{what_to_bring}}\n\nWe look forward to seeing you!\n\n{{organization_name}}',
'["volunteer_name", "event_title", "event_location", "event_time", "what_to_bring", "organization_name"]',
1, 1);

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'VolunteerConnect', 'String', 'Name of the volunteer management platform'),
('max_registration_per_event', '100', 'Integer', 'Maximum number of volunteers per event'),
('require_background_check', 'false', 'Boolean', 'Whether background checks are required by default'),
('certificate_auto_generate', 'true', 'Boolean', 'Automatically generate certificates upon event completion'),
('notification_email_from', 'noreply@volunteerconnect.org', 'String', 'Default from email for notifications'),
('maintenance_mode', 'false', 'Boolean', 'Enable maintenance mode for the platform');

GO
-- ========================================
-- VIEWS FOR COMMON QUERIES
-- ========================================

-- View for volunteer dashboard data
CREATE VIEW volunteer_dashboard AS
SELECT 
    vp.id AS volunteer_id,
    u.username,
    CONCAT(vp.first_name, ' ', vp.last_name) AS full_name,
    vp.volunteer_hours_completed,
    COUNT(DISTINCT vr.id) AS total_registrations,
    COUNT(DISTINCT CASE WHEN vr.status = 'Completed' THEN vr.id END) AS completed_events,
    COUNT(DISTINCT CASE WHEN vr.status = 'Pending' THEN vr.id END) AS pending_registrations,
    COUNT(DISTINCT c.id) AS certificates_earned,
    AVG(CASE WHEN f.rating IS NOT NULL THEN CAST(f.rating AS DECIMAL(5,2)) END) AS avg_feedback_rating
FROM volunteer_profiles vp
JOIN users u ON vp.user_id = u.id
LEFT JOIN volunteer_registrations vr ON vp.id = vr.volunteer_id
LEFT JOIN certificates c ON vp.id = c.volunteer_id
LEFT JOIN feedback f ON vr.event_id = f.event_id AND f.submitted_by = u.id
WHERE u.is_active = 1
GROUP BY vp.id, u.username, vp.first_name, vp.last_name, vp.volunteer_hours_completed;
GO

-- View for organization event statistics
CREATE VIEW organization_event_stats AS
SELECT 
    op.id AS organization_id,
    op.organization_name,
    COUNT(DISTINCT e.id) AS total_events,
    COUNT(DISTINCT CASE WHEN e.status = 'Published' THEN e.id END) AS published_events,
    COUNT(DISTINCT CASE WHEN e.status = 'Completed' THEN e.id END) AS completed_events,
    SUM(e.current_volunteers) AS total_volunteer_registrations,
    AVG(CAST(e.current_volunteers AS DECIMAL(10,2))) AS avg_volunteers_per_event,
    COUNT(DISTINCT vr.volunteer_id) AS unique_volunteers,
    AVG(CASE WHEN f.rating IS NOT NULL THEN CAST(f.rating AS DECIMAL(5,2)) END) AS avg_event_rating
FROM organization_profiles op
LEFT JOIN events e ON op.id = e.organization_id
LEFT JOIN volunteer_registrations vr ON e.id = vr.event_id
LEFT JOIN feedback f ON e.id = f.event_id
GROUP BY op.id, op.organization_name;
GO

-- View for upcoming events with registration info
CREATE VIEW upcoming_events AS
SELECT TOP (1000) -- Adjust the number as needed
    e.id,
    e.title,
    e.description,
    e.start_date,
    e.end_date,
    e.start_time,
    e.location,
    e.city,
    e.state,
    e.max_volunteers,
    e.current_volunteers,
    (e.max_volunteers - e.current_volunteers) AS available_spots,
    op.organization_name,
    ec.name AS category_name,
    ec.color AS category_color,
    e.registration_end_date,
    CASE 
        WHEN e.registration_end_date < CAST(GETDATE() AS DATE) THEN 'Closed'
        WHEN e.current_volunteers >= e.max_volunteers THEN 'Full'
        ELSE 'Open'
    END AS registration_status
FROM events e
JOIN organization_profiles op ON e.organization_id = op.id
LEFT JOIN event_categories ec ON e.category_id = ec.id
WHERE e.status IN ('Published', 'Registration_Open') 
    AND e.start_date >= CAST(GETDATE() AS DATE)
ORDER BY e.start_date, e.start_time;
GO

-- ========================================
-- STORED PROCEDURES
-- ========================================

-- Procedure to register a volunteer for an event
CREATE PROCEDURE RegisterVolunteerForEvent
    @p_event_id INT,
    @p_volunteer_id INT,
    @p_motivation NVARCHAR(MAX),
    @p_emergency_contact_name NVARCHAR(200),
    @p_emergency_contact_phone NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @v_max_volunteers INT;
    DECLARE @v_current_volunteers INT;
    DECLARE @v_registration_end DATE;
    DECLARE @v_event_status NVARCHAR(50);
    
    -- Get event details
    SELECT @v_max_volunteers = max_volunteers, 
           @v_current_volunteers = current_volunteers, 
           @v_registration_end = registration_end_date, 
           @v_event_status = status
    FROM events WHERE id = @p_event_id;
    
    -- Check if registration is still open
    IF @v_registration_end < CAST(GETDATE() AS DATE)
    BEGIN
        RAISERROR ('Registration period has ended', 16, 1);
        RETURN;
    END
    
    -- Check if event is accepting registrations
    IF @v_event_status NOT IN ('Published', 'Registration_Open')
    BEGIN
        RAISERROR ('Event is not accepting registrations', 16, 1);
        RETURN;
    END
    
    -- Check if there are available spots
    IF @v_current_volunteers >= @v_max_volunteers
    BEGIN
        -- Insert as waitlisted
        INSERT INTO volunteer_registrations (
            event_id, volunteer_id, status, motivation, 
            emergency_contact_name, emergency_contact_phone
        ) VALUES (
            @p_event_id, @p_volunteer_id, 'Waitlisted', @p_motivation,
            @p_emergency_contact_name, @p_emergency_contact_phone
        );
    END
    ELSE
    BEGIN
        -- Insert as pending
        INSERT INTO volunteer_registrations (
            event_id, volunteer_id, status, motivation,
            emergency_contact_name, emergency_contact_phone
        ) VALUES (
            @p_event_id, @p_volunteer_id, 'Pending', @p_motivation,
            @p_emergency_contact_name, @p_emergency_contact_phone
        );
        
        -- Update event volunteer count
        UPDATE events 
        SET current_volunteers = current_volunteers + 1 
        WHERE id = @p_event_id;
    END
END;
GO

-- Procedure to generate certificate for completed volunteer service
CREATE PROCEDURE GenerateCertificate
    @p_event_id INT,
    @p_volunteer_id INT,
    @p_template_id INT,
    @p_hours_completed DECIMAL(5,2),
    @p_issued_by INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @v_volunteer_name NVARCHAR(201);
    DECLARE @v_event_title NVARCHAR(300);
    DECLARE @v_organization_name NVARCHAR(200);
    DECLARE @v_completion_date DATE;
    DECLARE @v_certificate_number NVARCHAR(100);
    DECLARE @v_verification_code NVARCHAR(100);
    
    -- Get required information
    SELECT 
        @v_volunteer_name = CONCAT(vp.first_name, ' ', vp.last_name),
        @v_event_title = e.title,
        @v_organization_name = op.organization_name,
        @v_completion_date = e.end_date
    FROM volunteer_profiles vp
    JOIN events e ON e.id = @p_event_id
    JOIN organization_profiles op ON e.organization_id = op.id
    WHERE vp.id = @p_volunteer_id;
    
    -- Generate certificate number and verification code
    SET @v_certificate_number = CONCAT('CERT-', YEAR(GETDATE()), '-', RIGHT('0000' + CAST(@p_event_id AS NVARCHAR), 4), '-', RIGHT('0000' + CAST(@p_volunteer_id AS NVARCHAR), 4));
    SET @v_verification_code = UPPER(LEFT(HASHBYTES('MD5', CONCAT(@v_certificate_number, GETDATE())), 12));
    
    -- Insert certificate
    INSERT INTO certificates (
        certificate_number, event_id, volunteer_id, template_id,
        volunteer_name, event_title, organization_name,
        hours_completed, issue_date, completion_date,
        verification_code, issued_by
    ) VALUES (
        @v_certificate_number, @p_event_id, @p_volunteer_id, @p_template_id,
        @v_volunteer_name, @v_event_title, @v_organization_name,
        @p_hours_completed, CAST(GETDATE() AS DATE), @v_completion_date,
        @v_verification_code, @p_issued_by
    );
    
    -- Update volunteer's total hours
    UPDATE volunteer_profiles 
    SET volunteer_hours_completed = volunteer_hours_completed + @p_hours_completed
    WHERE id = @p_volunteer_id;
END;
GO

-- ========================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ========================================

-- Additional composite indexes for common queries
CREATE INDEX idx_event_org_status ON events(organization_id, status);
CREATE INDEX idx_registration_volunteer_status ON volunteer_registrations(volunteer_id, status);
CREATE INDEX idx_event_date_location ON events(start_date, city, state);
CREATE INDEX idx_notification_recipient_type ON notifications(recipient_id, type, status);
CREATE INDEX idx_feedback_event_rating ON feedback(event_id, rating);
CREATE INDEX idx_activity_user_date ON activity_logs(user_id, created_at);

GO

-- SQL Server không hỗ trợ FULLTEXT index giống MySQL, thay bằng indexed views hoặc dùng SQL Server Full-Text Search nếu cần
-- Ví dụ tạo Full-Text Catalog (cần cấu hình riêng trên SQL Server):
/*
CREATE FULLTEXT CATALOG VolunteerSearchCatalog AS DEFAULT;
CREATE FULLTEXT INDEX ON events(title, description, requirements) KEY INDEX PK_events;
CREATE FULLTEXT INDEX ON volunteer_profiles(skills, interests, bio) KEY INDEX PK_volunteer_profiles;
CREATE FULLTEXT INDEX ON organization_profiles(organization_name, description, focus_areas) KEY INDEX PK_organization_profiles;
*/

-- ========================================
-- TRIGGERS FOR DATA CONSISTENCY
-- ========================================

-- Trigger to update event volunteer count when registration status changes
CREATE TRIGGER update_event_volunteer_count 
ON volunteer_registrations
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    IF UPDATE(status)
    BEGIN
        -- Recalculate current volunteers for the event
        UPDATE e
        SET current_volunteers = (
            SELECT COUNT(*) 
            FROM volunteer_registrations vr 
            WHERE vr.event_id = i.event_id 
            AND vr.status IN ('Approved', 'Confirmed', 'Completed')
        )
        FROM events e
        INNER JOIN inserted i ON e.id = i.event_id
        INNER JOIN deleted d ON i.event_id = d.event_id AND i.volunteer_id = d.volunteer_id
        WHERE d.status != i.status;
    END
END;
GO

-- Trigger to log user activities
CREATE TRIGGER log_user_activity
ON volunteer_registrations
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details)
    SELECT u.id, 'VOLUNTEER_REGISTRATION', 'Event', i.event_id, 
           CONCAT('{"registration_id":', i.id, ',"status":"', i.status, '"}')
    FROM inserted i
    JOIN volunteer_profiles vp ON vp.id = i.volunteer_id
    JOIN users u ON vp.user_id = u.id;
END;
GO

-- ========================================
-- SECURITY AND PERMISSIONS
-- ========================================

-- SQL Server sử dụng các vai trò và tài khoản Windows/SQL Authentication
-- Ví dụ tạo login và user:
/*
CREATE LOGIN volunteer_app WITH PASSWORD = 'secure_password_here';
CREATE USER volunteer_app FOR LOGIN volunteer_app;
GRANT SELECT, INSERT, UPDATE ON SCHEMA::dbo TO volunteer_app;
GRANT DELETE ON dbo.password_reset_tokens TO volunteer_app;
GRANT DELETE ON dbo.activity_logs TO volunteer_app;

CREATE LOGIN volunteer_readonly WITH PASSWORD = 'readonly_password_here';
CREATE USER volunteer_readonly FOR LOGIN volunteer_readonly;
GRANT SELECT ON SCHEMA::dbo TO volunteer_readonly;
*/

-- ========================================
-- FINAL NOTES
-- ========================================

/*
This comprehensive database schema includes:

1. Complete user management with role-based access
2. Detailed profile management for all user types
3. Comprehensive event management with categories, tags, and requirements
4. Registration system with approval workflows
5. Schedule and task management
6. Feedback and rating systems
7. Certificate generation and tracking
8. Support request management
9. Partnership and collaboration tracking
10. Notification system with templates
11. Chatbot interaction logging
12. Comprehensive reporting capabilities
13. Content management and moderation
14. Audit logging and activity tracking
15. File upload management
16. Skill-based volunteer matching
17. Performance optimization with indexes
18. Data consistency with triggers
19. Security considerations

The schema supports all the use cases mentioned:
- FE-01 through FE-21 covering authentication, profile management, events, 
  registration, scheduling, feedback, certificates, support requests, 
  partnerships, notifications, chatbot, reporting, content moderation, 
  and public content management.

For production deployment, consider:
1. Implementing proper backup strategies
2. Setting up monitoring and alerting
3. Configuring SSL/TLS encryption
4. Implementing rate limiting
5. Setting up proper user permissions
6. Regular security audits
7. Data archival policies
8. Performance monitoring and optimization
*/