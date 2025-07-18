-- =========================================================
-- VIETNAM VOLUNTEER MANAGEMENT SYSTEM - METADATA INSERTS
-- Insert statements for TableSchemas, TableKeywords, TableColumns, and TableRelationships
-- =========================================================

-- =========================================================
-- 1. TABLE SCHEMAS
-- =========================================================

-- User Management Tables
INSERT INTO TableSchemas (TableName, Description) VALUES 
('UserRoles', N'Bảng vai trò người dùng - quản lý các vai trò khác nhau trong hệ thống'),
('Users', N'Bảng người dùng - thông tin đăng nhập và bảo mật'),
('UserProfiles', N'Bảng hồ sơ người dùng - thông tin cá nhân chi tiết');

-- Volunteer Management Tables
INSERT INTO TableSchemas (TableName, Description) VALUES 
('Skills', N'Bảng kỹ năng - danh sách các kỹ năng tình nguyện viên có thể có'),
('VolunteerProfiles', N'Bảng hồ sơ tình nguyện viên - thông tin chi tiết về tình nguyện viên'),
('VolunteerSkills', N'Bảng kỹ năng tình nguyện viên - liên kết giữa tình nguyện viên và kỹ năng');

-- Organization Management Tables
INSERT INTO TableSchemas (TableName, Description) VALUES 
('OrganizationTypes', N'Bảng loại tổ chức - phân loại các tổ chức tình nguyện'),
('Organizations', N'Bảng tổ chức - thông tin về các tổ chức tình nguyện');

-- Partner Management Tables
INSERT INTO TableSchemas (TableName, Description) VALUES 
('PartnerIndustries', N'Bảng ngành nghề đối tác - phân loại ngành nghề của đối tác'),
('Partners', N'Bảng đối tác - thông tin về các đối tác hợp tác');

-- Volunteer Coordinator Tables
INSERT INTO TableSchemas (TableName, Description) VALUES 
('VolunteerCoordinators', N'Bảng điều phối viên tình nguyện - quản lý nhân viên điều phối');

-- Event Management Tables
INSERT INTO TableSchemas (TableName, Description) VALUES 
('EventCategories', N'Bảng danh mục sự kiện - phân loại các loại sự kiện tình nguyện'),
('EventStatus', N'Bảng trạng thái sự kiện - các trạng thái của sự kiện'),
('Events', N'Bảng sự kiện - thông tin chi tiết về các hoạt động tình nguyện');

-- Registration Management Tables
INSERT INTO TableSchemas (TableName, Description) VALUES 
('RegistrationStatus', N'Bảng trạng thái đăng ký - trạng thái đăng ký tham gia sự kiện'),
('EventRegistrations', N'Bảng đăng ký sự kiện - quản lý đăng ký tham gia của tình nguyện viên');

-- Schedule Management Tables
INSERT INTO TableSchemas (TableName, Description) VALUES 
('VolunteerSchedules', N'Bảng lịch trình tình nguyện viên - quản lý lịch làm việc của tình nguyện viên'),
('CoordinatorSchedules', N'Bảng lịch trình điều phối viên - quản lý lịch làm việc của điều phối viên');

-- Task Management Tables
INSERT INTO TableSchemas (TableName, Description) VALUES 
('TaskCategories', N'Bảng danh mục công việc - phân loại các loại công việc'),
('TaskStatus', N'Bảng trạng thái công việc - trạng thái hoàn thành công việc'),
('OnSiteTasks', N'Bảng công việc tại chỗ - công việc cần thực hiện tại sự kiện'),
('TaskAssignments', N'Bảng phân công công việc - phân công công việc cho tình nguyện viên'),
('CoordinatorTasks', N'Bảng công việc điều phối viên - công việc của điều phối viên');

-- Feedback Management Tables
INSERT INTO TableSchemas (TableName, Description) VALUES 
('FeedbackCategories', N'Bảng danh mục phản hồi - phân loại các loại phản hồi'),
('Feedback', N'Bảng phản hồi - ý kiến đánh giá từ người dùng');

-- Certificate Management Tables
INSERT INTO TableSchemas (TableName, Description) VALUES 
('CertificateTemplates', N'Bảng mẫu chứng chỉ - các mẫu chứng chỉ có thể sử dụng'),
('Certificates', N'Bảng chứng chỉ - chứng chỉ được cấp cho tình nguyện viên');

-- Support Request Management Tables
INSERT INTO TableSchemas (TableName, Description) VALUES 
('SupportCategories', N'Bảng danh mục hỗ trợ - phân loại các yêu cầu hỗ trợ'),
('SupportRequests', N'Bảng yêu cầu hỗ trợ - các yêu cầu hỗ trợ từ người dùng'),
('SupportRequestComments', N'Bảng bình luận hỗ trợ - trao đổi trong yêu cầu hỗ trợ');

-- Collaboration Management Tables
INSERT INTO TableSchemas (TableName, Description) VALUES 
('CollaborationTypes', N'Bảng loại hợp tác - phân loại các loại hợp tác với đối tác'),
('PartnerCollaborations', N'Bảng hợp tác đối tác - quản lý hợp tác giữa tổ chức và đối tác');

-- Notification Management Tables
INSERT INTO TableSchemas (TableName, Description) VALUES 
('Notifications', N'Bảng thông báo - thông báo gửi đến người dùng');

-- Report Management Tables
INSERT INTO TableSchemas (TableName, Description) VALUES 
('Reports', N'Bảng báo cáo - các báo cáo thống kê hệ thống');

-- Role Permission Management Tables
INSERT INTO TableSchemas (TableName, Description) VALUES 
('RolePermissions', N'Bảng quyền vai trò - phân quyền cho các vai trò người dùng');

-- =========================================================
-- 2. TABLE KEYWORDS (Vietnamese focus)
-- =========================================================

-- UserRoles keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'UserRoles'), N'vai trò'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserRoles'), N'quyền hạn'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserRoles'), N'phân quyền'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserRoles'), N'role'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserRoles'), N'admin'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserRoles'), N'user'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserRoles'), N'người dùng');

-- Users keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), N'người dùng'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), N'tài khoản'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), N'đăng nhập'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), N'email'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), N'mật khẩu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), N'password'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), N'login'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), N'user'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), N'account');

-- UserProfiles keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), N'hồ sơ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), N'thông tin cá nhân'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), N'profile'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), N'tên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), N'họ tên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), N'số điện thoại'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), N'địa chỉ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), N'ngày sinh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), N'giới tính'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), N'liên hệ khẩn cấp');

-- Skills keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Skills'), N'kỹ năng'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Skills'), N'skill'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Skills'), N'năng lực'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Skills'), N'chuyên môn'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Skills'), N'khả năng'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Skills'), N'talent');

-- VolunteerProfiles keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), N'tình nguyện viên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), N'volunteer'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), N'tình nguyện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), N'sinh viên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), N'student'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), N'trường đại học'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), N'chuyên ngành'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), N'kinh nghiệm'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), N'động lực'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), N'đánh giá'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), N'giờ tình nguyện');

-- VolunteerSkills keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSkills'), N'kỹ năng tình nguyện viên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSkills'), N'trình độ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSkills'), N'thành thạo'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSkills'), N'năm kinh nghiệm'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSkills'), N'volunteer skills');

-- OrganizationTypes keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'OrganizationTypes'), N'loại tổ chức'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OrganizationTypes'), N'phân loại tổ chức'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OrganizationTypes'), N'organization type'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OrganizationTypes'), N'NGO'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OrganizationTypes'), N'phi lợi nhuận'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OrganizationTypes'), N'từ thiện');

-- Organizations keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), N'tổ chức'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), N'organization'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), N'đơn vị'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), N'công ty'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), N'doanh nghiệp'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), N'mã số thuế'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), N'giấy phép kinh doanh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), N'website'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), N'sứ mệnh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), N'tầm nhìn'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), N'xác minh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), N'đánh giá');

-- PartnerIndustries keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerIndustries'), N'ngành nghề'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerIndustries'), N'industry'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerIndustries'), N'lĩnh vực'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerIndustries'), N'sector'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerIndustries'), N'chuyên ngành');

-- Partners keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), N'đối tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), N'partner'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), N'hợp tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), N'collaboration'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), N'công ty đối tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), N'doanh nghiệp đối tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), N'tài trợ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), N'sponsor');

-- VolunteerCoordinators keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), N'điều phối viên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), N'coordinator'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), N'quản lý'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), N'nhân viên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), N'employee'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), N'chức vụ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), N'phòng ban'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), N'trách nhiệm');

-- EventCategories keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'EventCategories'), N'danh mục sự kiện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventCategories'), N'loại sự kiện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventCategories'), N'category'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventCategories'), N'phân loại'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventCategories'), N'giáo dục'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventCategories'), N'môi trường'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventCategories'), N'từ thiện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventCategories'), N'y tế');

-- EventStatus keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'EventStatus'), N'trạng thái sự kiện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventStatus'), N'status'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventStatus'), N'tình trạng'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventStatus'), N'draft'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventStatus'), N'published'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventStatus'), N'completed'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventStatus'), N'cancelled');

-- Events keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), N'sự kiện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), N'event'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), N'hoạt động'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), N'activity'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), N'chương trình'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), N'program'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), N'ngày bắt đầu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), N'ngày kết thúc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), N'địa điểm'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), N'location'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), N'đăng ký'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), N'registration'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), N'yêu cầu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), N'lợi ích'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), N'tuyển tình nguyện viên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), N'khẩn cấp'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), N'nổi bật');

-- RegistrationStatus keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'RegistrationStatus'), N'trạng thái đăng ký'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RegistrationStatus'), N'registration status'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RegistrationStatus'), N'pending'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RegistrationStatus'), N'approved'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RegistrationStatus'), N'rejected'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RegistrationStatus'), N'chờ duyệt'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RegistrationStatus'), N'được duyệt'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RegistrationStatus'), N'bị từ chối');

-- EventRegistrations keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), N'đăng ký sự kiện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), N'registration'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), N'tham gia'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), N'application'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), N'ứng tuyển'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), N'phê duyệt'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), N'từ chối'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), N'hủy'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), N'thư động lực'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), N'check in'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), N'check out'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), N'hiệu suất'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), N'chứng chỉ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), N'đánh giá');

-- VolunteerSchedules keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), N'lịch trình tình nguyện viên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), N'schedule'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), N'lịch làm việc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), N'calendar'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), N'thời gian biểu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), N'nhắc nhở'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), N'reminder'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), N'ưu tiên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), N'cả ngày');

-- CoordinatorSchedules keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), N'lịch trình điều phối viên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), N'coordinator schedule'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), N'lịch quản lý'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), N'thời gian biểu quản lý');

-- TaskCategories keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskCategories'), N'danh mục công việc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskCategories'), N'loại công việc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskCategories'), N'task category'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskCategories'), N'phân loại nhiệm vụ');

-- TaskStatus keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskStatus'), N'trạng thái công việc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskStatus'), N'task status'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskStatus'), N'tình trạng nhiệm vụ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskStatus'), N'pending'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskStatus'), N'in progress'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskStatus'), N'completed'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskStatus'), N'chờ xử lý'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskStatus'), N'đang thực hiện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskStatus'), N'hoàn thành');

-- OnSiteTasks keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), N'công việc tại chỗ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), N'nhiệm vụ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), N'task'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), N'công việc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), N'hướng dẫn'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), N'vật liệu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), N'an toàn'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), N'khó khăn'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), N'ước tính giờ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), N'tiêu chí hoàn thành');

-- TaskAssignments keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), N'phân công công việc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), N'assignment'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), N'giao việc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), N'phân nhiệm vụ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), N'hiệu suất'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), N'giờ làm việc');

-- CoordinatorTasks keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), N'công việc điều phối viên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), N'coordinator task'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), N'nhiệm vụ quản lý'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), N'hạn chót'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), N'deadline');

-- FeedbackCategories keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'FeedbackCategories'), N'danh mục phản hồi'),
((SELECT Id FROM TableSchemas WHERE TableName = 'FeedbackCategories'), N'loại phản hồi'),
((SELECT Id FROM TableSchemas WHERE TableName = 'FeedbackCategories'), N'feedback category'),
((SELECT Id FROM TableSchemas WHERE TableName = 'FeedbackCategories'), N'phân loại ý kiến');

-- Feedback keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), N'phản hồi'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), N'feedback'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), N'ý kiến'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), N'đánh giá'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), N'review'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), N'bình luận'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), N'comment'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), N'ẩn danh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), N'anonymous'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), N'phản hồi công khai'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), N'rating');

-- CertificateTemplates keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), N'mẫu chứng chỉ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), N'certificate template'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), N'template'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), N'thiết kế chứng chỉ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), N'mặc định');

-- Certificates keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), N'chứng chỉ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), N'certificate'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), N'chứng nhận'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), N'giấy chứng nhận'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), N'số chứng chỉ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), N'mã xác minh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), N'QR code'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), N'chữ ký số'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), N'digital signature'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), N'chứng chỉ tình nguyện viên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), N'chứng chỉ mẫu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), N'thiết kế mẫu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), N'mẫu mặc định'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), N'organization certificate');

-- Certificates additional keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), N'giấy chứng nhận tình nguyện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), N'chứng chỉ hoàn thành'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), N'tình nguyện viên chứng nhận'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), N'certificate status');

-- SupportCategories keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportCategories'), N'danh mục hỗ trợ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportCategories'), N'loại hỗ trợ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportCategories'), N'support category'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportCategories'), N'ưu tiên hỗ trợ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportCategories'), N'thời gian phản hồi');

-- SupportRequests keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), N'yêu cầu hỗ trợ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), N'support request'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), N'vấn đề'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), N'hỗ trợ kỹ thuật'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), N'phản hồi hỗ trợ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), N'độ hài lòng');

-- SupportRequestComments keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequestComments'), N'bình luận hỗ trợ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequestComments'), N'support comment'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequestComments'), N'trao đổi'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequestComments'), N'ghi chú hỗ trợ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequestComments'), N'nội bộ');

-- CollaborationTypes keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'CollaborationTypes'), N'loại hợp tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CollaborationTypes'), N'collaboration type'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CollaborationTypes'), N'phân loại hợp tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CollaborationTypes'), N'tài trợ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CollaborationTypes'), N'quan hệ đối tác');

-- PartnerCollaborations keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), N'hợp tác đối tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), N'collaboration'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), N'quan hệ đối tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), N'hợp đồng'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), N'mục tiêu hợp tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), N'ngân sách hợp tác');

-- Notifications keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Notifications'), N'thông báo'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Notifications'), N'notification'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Notifications'), N'cảnh báo'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Notifications'), N'thông tin'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Notifications'), N'đã đọc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Notifications'), N'chưa đọc');

-- Reports keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Reports'), N'báo cáo'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Reports'), N'report'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Reports'), N'thống kê'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Reports'), N'phân tích'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Reports'), N'dữ liệu hệ thống');

-- RolePermissions keywords
INSERT INTO TableKeywords (TableSchemaId, Keyword) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'RolePermissions'), N'quyền vai trò'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RolePermissions'), N'role permission'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RolePermissions'), N'phân quyền'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RolePermissions'), N'quyền truy cập'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RolePermissions'), N'permission');

-- =========================================================
-- 3. TABLE COLUMNS (Adding columns for all relevant tables)
-- =========================================================

-- UserRoles columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'UserRoles'), 'RoleId', 'INT', N'Khóa chính của bảng vai trò'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserRoles'), 'RoleName', 'NVARCHAR(100)', N'Tên vai trò, ví dụ: Admin, Volunteer'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserRoles'), 'Description', 'NVARCHAR(500)', N'Mô tả vai trò'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserRoles'), 'IsActive', 'BIT', N'Trạng thái hoạt động của vai trò'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserRoles'), 'CreatedAt', 'DATETIME2', N'Ngày tạo vai trò'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserRoles'), 'UpdatedAt', 'DATETIME2', N'Ngày cập nhật vai trò');

-- Users columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'INT', N'Khóa chính của bảng người dùng'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'Email', 'NVARCHAR(255)', N'Địa chỉ email, duy nhất'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'PasswordHash', 'NVARCHAR(255)', N'Mật khẩu đã mã hóa'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'Salt', 'NVARCHAR(100)', N'Chuỗi ngẫu nhiên để mã hóa mật khẩu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'RoleId', 'INT', N'Khóa ngoại liên kết với UserRoles'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'IsActive', 'BIT', N'Trạng thái tài khoản'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'IsEmailVerified', 'BIT', N'Trạng thái xác minh email'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'EmailVerificationToken', 'NVARCHAR(255)', N'Mã xác minh email'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'PasswordResetToken', 'NVARCHAR(255)', N'Mã đặt lại mật khẩu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'PasswordResetExpiry', 'DATETIME2', N'Thời gian hết hạn mã đặt lại mật khẩu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'LastLoginAt', 'DATETIME2', N'Thời gian đăng nhập cuối'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'CreatedAt', 'DATETIME2', N'Ngày tạo tài khoản'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UpdatedAt', 'DATETIME2', N'Ngày cập nhật tài khoản');

-- UserProfiles columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), 'ProfileId', 'INT', N'Khóa chính của bảng hồ sơ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), 'UserId', 'INT', N'Khóa ngoại liên kết với Users'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), 'FirstName', 'NVARCHAR(100)', N'Tên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), 'LastName', 'NVARCHAR(100)', N'Họ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), 'FullName', 'NVARCHAR', N'Họ và tên (tính toán)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), 'PhoneNumber', 'NVARCHAR(20)', N'Số điện thoại'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), 'DateOfBirth', 'DATE', N'Ngày sinh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), 'Gender', 'NVARCHAR(10)', N'Giới tính'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), 'Avatar', 'NVARCHAR(500)', N'URL ảnh đại diện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), 'Address', 'NVARCHAR(500)', N'Địa chỉ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), 'WardCommune', 'NVARCHAR(100)', N'Phường/Xã'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), 'District', 'NVARCHAR(100)', N'Quận/Huyện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), 'Province', 'NVARCHAR(100)', N'Tỉnh/Thành phố'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), 'PostalCode', 'NVARCHAR(10)', N'Mã bưu điện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), 'EmergencyContactName', 'NVARCHAR(200)', N'Tên liên hệ khẩn cấp'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), 'EmergencyContactPhone', 'NVARCHAR(20)', N'Số điện thoại liên hệ khẩn cấp'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), 'CreatedAt', 'DATETIME2', N'Ngày tạo hồ sơ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), 'UpdatedAt', 'DATETIME2', N'Ngày cập nhật hồ sơ');

-- Skills columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Skills'), 'SkillId', 'INT', N'Khóa chính của bảng kỹ năng'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Skills'), 'SkillName', 'NVARCHAR(100)', N'Tên kỹ năng'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Skills'), 'Category', 'NVARCHAR(100)', N'Danh mục kỹ năng'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Skills'), 'Description', 'NVARCHAR(500)', N'Mô tả kỹ năng'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Skills'), 'IsActive', 'BIT', N'Trạng thái hoạt động'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Skills'), 'CreatedAt', 'DATETIME2', N'Ngày tạo kỹ năng');

-- VolunteerProfiles columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'VolunteerId', 'INT', N'Khóa chính của bảng tình nguyện viên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'UserId', 'INT', N'Khóa ngoại liên kết với Users'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'StudentId', 'NVARCHAR(50)', N'Mã số sinh viên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'University', 'NVARCHAR(200)', N'Tên trường đại học'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'Major', 'NVARCHAR(200)', N'Chuyên ngành'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'YearOfStudy', 'INT', N'Năm học'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'Motivation', 'NVARCHAR(1000)', N'Động lực tham gia'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'Experience', 'NVARCHAR(1000)', N'Kinh nghiệm'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'Availability', 'NVARCHAR(500)', N'Thời gian rảnh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'VolunteerHours', 'INT', N'Tổng số giờ tình nguyện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'Rating', 'DECIMAL(3,2)', N'Điểm đánh giá'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'RatingCount', 'INT', N'Số lượt đánh giá'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'IsVerified', 'BIT', N'Trạng thái xác minh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'VerifiedAt', 'DATETIME2', N'Ngày xác minh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'VerifiedBy', 'INT', N'Người xác minh (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'LastActiveDate', 'DATETIME2', N'Ngày hoạt động cuối'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'TotalHoursVolunteered', 'INT', N'Tổng giờ đã tham gia'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'Skills', 'NVARCHAR(MAX)', N'Danh sách kỹ năng'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'CreatedAt', 'DATETIME2', N'Ngày tạo hồ sơ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'UpdatedAt', 'DATETIME2', N'Ngày cập nhật hồ sơ');

-- VolunteerSkills columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSkills'), 'VolunteerId', 'INT', N'Khóa ngoại liên kết với VolunteerProfiles'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSkills'), 'SkillId', 'INT', N'Khóa ngoại liên kết với Skills'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSkills'), 'ProficiencyLevel', 'NVARCHAR(20)', N'Trình độ kỹ năng'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSkills'), 'YearsOfExperience', 'INT', N'Số năm kinh nghiệm'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSkills'), 'Description', 'NVARCHAR(500)', N'Mô tả chi tiết kỹ năng'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSkills'), 'CreatedAt', 'DATETIME2', N'Ngày tạo liên kết');

-- OrganizationTypes columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'OrganizationTypes'), 'TypeId', 'INT', N'Khóa chính của bảng loại tổ chức'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OrganizationTypes'), 'TypeName', 'NVARCHAR(100)', N'Tên loại tổ chức'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OrganizationTypes'), 'Description', 'NVARCHAR(500)', N'Mô tả loại tổ chức'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OrganizationTypes'), 'IsActive', 'BIT', N'Trạng thái hoạt động'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OrganizationTypes'), 'CreatedAt', 'DATETIME2', N'Ngày tạo loại tổ chức');

-- Organizations columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'OrganizationId', 'INT', N'Khóa chính của bảng tổ chức'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'UserId', 'INT', N'Khóa ngoại liên kết với Users'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'OrganizationName', 'NVARCHAR(200)', N'Tên tổ chức'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'ShortName', 'NVARCHAR(50)', N'Tên viết tắt'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'TypeId', 'INT', N'Khóa ngoại liên kết với OrganizationTypes'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'TaxCode', 'NVARCHAR(50)', N'Mã số thuế'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'BusinessLicense', 'NVARCHAR(100)', N'Giấy phép kinh doanh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'EstablishedYear', 'INT', N'Năm thành lập'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'Website', 'NVARCHAR(200)', N'Website tổ chức'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'FacebookPage', 'NVARCHAR(200)', N'Trang Facebook'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'LinkedInPage', 'NVARCHAR(200)', N'Trang LinkedIn'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'Description', 'NVARCHAR(2000)', N'Mô tả tổ chức'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'Mission', 'NVARCHAR(1000)', N'Sứ mệnh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'Vision', 'NVARCHAR(1000)', N'Tầm nhìn'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'Address', 'NVARCHAR(500)', N'Địa chỉ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'WardCommune', 'NVARCHAR(100)', N'Phường/Xã'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'District', 'NVARCHAR(100)', N'Quận/Huyện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'Province', 'NVARCHAR(100)', N'Tỉnh/Thành phố'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'PostalCode', 'NVARCHAR(10)', N'Mã bưu điện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'ContactPersonName', 'NVARCHAR(200)', N'Tên người liên hệ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'ContactPersonTitle', 'NVARCHAR(100)', N'Chức vụ người liên hệ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'ContactEmail', 'NVARCHAR(255)', N'Email liên hệ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'ContactPhone', 'NVARCHAR(20)', N'Số điện thoại liên hệ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'LogoUrl', 'NVARCHAR(500)', N'URL logo'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'BannerUrl', 'NVARCHAR(500)', N'URL banner'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'IsVerified', 'BIT', N'Trạng thái xác minh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'VerifiedAt', 'DATETIME2', N'Ngày xác minh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'VerifiedBy', 'INT', N'Người xác minh (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'Rating', 'DECIMAL(3,2)', N'Điểm đánh giá'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'RatingCount', 'INT', N'Số lượt đánh giá'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'TotalEvents', 'INT', N'Tổng số sự kiện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'TotalVolunteers', 'INT', N'Tổng số tình nguyện viên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'IsActive', 'BIT', N'Trạng thái hoạt động'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'CreatedAt', 'DATETIME2', N'Ngày tạo tổ chức'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'UpdatedAt', 'DATETIME2', N'Ngày cập nhật tổ chức');

-- PartnerIndustries columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerIndustries'), 'IndustryId', 'INT', N'Khóa chính của bảng ngành nghề'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerIndustries'), 'IndustryName', 'NVARCHAR(100)', N'Tên ngành nghề'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerIndustries'), 'Description', 'NVARCHAR(500)', N'Mô tả ngành nghề'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerIndustries'), 'IsActive', 'BIT', N'Trạng thái hoạt động'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerIndustries'), 'CreatedAt', 'DATETIME2', N'Ngày tạo ngành nghề');

-- Partners columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'PartnerId', 'INT', N'Khóa chính của bảng đối tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'UserId', 'INT', N'Khóa ngoại liên kết với Users'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'CompanyName', 'NVARCHAR(200)', N'Tên công ty đối tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'IndustryId', 'INT', N'Khóa ngoại liên kết với PartnerIndustries'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'TaxCode', 'NVARCHAR(50)', N'Mã số thuế'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'BusinessLicense', 'NVARCHAR(100)', N'Giấy phép kinh doanh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'Website', 'NVARCHAR(200)', N'Website đối tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'Description', 'NVARCHAR(2000)', N'Mô tả đối tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'Address', 'NVARCHAR(500)', N'Địa chỉ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'WardCommune', 'NVARCHAR(100)', N'Phường/Xã'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'District', 'NVARCHAR(100)', N'Quận/Huyện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'Province', 'NVARCHAR(100)', N'Tỉnh/Thành phố'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'PostalCode', 'NVARCHAR(10)', N'Mã bưu điện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'ContactPersonName', 'NVARCHAR(200)', N'Tên người liên hệ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'ContactPersonTitle', 'NVARCHAR(100)', N'Chức vụ người liên hệ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'ContactEmail', 'NVARCHAR(255)', N'Email liên hệ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'ContactPhone', 'NVARCHAR(20)', N'Số điện thoại liên hệ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'LogoUrl', 'NVARCHAR(500)', N'URL logo'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'IsVerified', 'BIT', N'Trạng thái xác minh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'VerifiedAt', 'DATETIME2', N'Ngày xác minh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'VerifiedBy', 'INT', N'Người xác minh (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'Rating', 'DECIMAL(3,2)', N'Điểm đánh giá'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'RatingCount', 'INT', N'Số lượt đánh giá'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'TotalCollaborations', 'INT', N'Tổng số hợp tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'IsActive', 'BIT', N'Trạng thái hoạt động'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'CreatedAt', 'DATETIME2', N'Ngày tạo đối tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'UpdatedAt', 'DATETIME2', N'Ngày cập nhật đối tác');

-- VolunteerCoordinators columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'CoordinatorId', 'INT', N'Khóa chính của bảng điều phối viên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'UserId', 'INT', N'Khóa ngoại liên kết với Users'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'OrganizationId', 'INT', N'Khóa ngoại liên kết với Organizations'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'EmployeeId', 'NVARCHAR(50)', N'Mã nhân viên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'Position', 'NVARCHAR(100)', N'Chức vụ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'Department', 'NVARCHAR(100)', N'Phòng ban'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'Responsibilities', 'NVARCHAR(1000)', N'Trách nhiệm'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'HireDate', 'DATE', N'Ngày tuyển dụng'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'EndDate', 'DATE', N'Ngày kết thúc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'Salary', 'DECIMAL(15,2)', N'Lương'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'ManagerId', 'INT', N'Khóa ngoại liên kết với Users (quản lý)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'IsActive', 'BIT', N'Trạng thái hoạt động'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'Notes', 'NVARCHAR(1000)', N'Ghi chú'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'CreatedBy', 'INT', N'Người tạo (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'RequestedBy', 'INT', N'Tổ chức yêu cầu (liên kết Organizations)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'CreatedAt', 'DATETIME2', N'Ngày tạo'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'UpdatedAt', 'DATETIME2', N'Ngày cập nhật');

-- EventCategories columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'EventCategories'), 'CategoryId', 'INT', N'Khóa chính của bảng danh mục sự kiện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventCategories'), 'CategoryName', 'NVARCHAR(100)', N'Tên danh mục'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventCategories'), 'Description', 'NVARCHAR(500)', N'Mô tả danh mục'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventCategories'), 'IconUrl', 'NVARCHAR(500)', N'URL biểu tượng'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventCategories'), 'Color', 'NVARCHAR(7)', N'Mã màu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventCategories'), 'IsActive', 'BIT', N'Trạng thái hoạt động'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventCategories'), 'CreatedAt', 'DATETIME2', N'Ngày tạo danh mục');

-- EventStatus columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'EventStatus'), 'StatusId', 'INT', N'Khóa chính của bảng trạng thái sự kiện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventStatus'), 'StatusName', 'NVARCHAR(50)', N'Tên trạng thái'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventStatus'), 'Description', 'NVARCHAR(500)', N'Mô tả trạng thái'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventStatus'), 'Color', 'NVARCHAR(7)', N'Mã màu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventStatus'), 'IsActive', 'BIT', N'Trạng thái hoạt động'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventStatus'), 'CreatedAt', 'DATETIME2', N'Ngày tạo trạng thái');

-- Events columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'EventId', 'INT', N'Khóa chính của bảng sự kiện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'OrganizationId', 'INT', N'Khóa ngoại liên kết với Organizations'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'EventName', 'NVARCHAR(300)', N'Tên sự kiện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'CategoryId', 'INT', N'Khóa ngoại liên kết với EventCategories'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'StatusId', 'INT', N'Khóa ngoại liên kết với EventStatus'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'Description', 'NVARCHAR(MAX)', N'Mô tả chi tiết'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'ShortDescription', 'NVARCHAR(500)', N'Mô tả ngắn'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'StartDate', 'DATETIME2', N'Ngày bắt đầu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'EndDate', 'DATETIME2', N'Ngày kết thúc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'RegistrationStartDate', 'DATETIME2', N'Ngày bắt đầu đăng ký'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'RegistrationEndDate', 'DATETIME2', N'Ngày kết thúc đăng ký'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'Location', 'NVARCHAR(500)', N'Địa điểm'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'DetailedAddress', 'NVARCHAR(1000)', N'Địa chỉ chi tiết'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'WardCommune', 'NVARCHAR(100)', N'Phường/Xã'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'District', 'NVARCHAR(100)', N'Quận/Huyện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'Province', 'NVARCHAR(100)', N'Tỉnh/Thành phố'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'Latitude', 'DECIMAL(10,8)', N'Vĩ độ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'Longitude', 'DECIMAL(11,8)', N'Kinh độ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'MaxVolunteers', 'INT', N'Số tình nguyện viên tối đa'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'MinVolunteers', 'INT', N'Số tình nguyện viên tối thiểu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'CurrentVolunteers', 'INT', N'Số tình nguyện viên hiện tại'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'RequiredSkills', 'NVARCHAR(1000)', N'Kỹ năng yêu cầu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'AgeRequirement', 'NVARCHAR(100)', N'Yêu cầu độ tuổi'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'GenderRequirement', 'NVARCHAR(20)', N'Yêu cầu giới tính'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'Requirements', 'NVARCHAR(2000)', N'Yêu cầu khác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'Benefits', 'NVARCHAR(2000)', N'Lợi ích tham gia'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'ContactPerson', 'NVARCHAR(200)', N'Người liên hệ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'ContactPhone', 'NVARCHAR(20)', N'Số điện thoại liên hệ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'ContactEmail', 'NVARCHAR(255)', N'Email liên hệ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'BannerImageUrl', 'NVARCHAR(500)', N'URL hình ảnh banner'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'GalleryImages', 'NVARCHAR(MAX)', N'Danh sách URL hình ảnh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'IsFeatured', 'BIT', N'Sự kiện nổi bật'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'IsUrgent', 'BIT', N'Sự kiện khẩn cấp'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'Priority', 'INT', N'Độ ưu tiên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'ViewCount', 'INT', N'Số lượt xem'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'RegistrationCount', 'INT', N'Số lượt đăng ký'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'CompletedVolunteers', 'INT', N'Số tình nguyện viên hoàn thành'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'Rating', 'DECIMAL(3,2)', N'Điểm đánh giá'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'RatingCount', 'INT', N'Số lượt đánh giá'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'Budget', 'DECIMAL(15,2)', N'Ngân sách'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'Currency', 'NVARCHAR(3)', N'Loại tiền tệ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'EventType', 'NVARCHAR(100)', N'Loại sự kiện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'MaxParticipants', 'INT', N'Số người tham gia tối đa'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'IsActive', 'BIT', N'Trạng thái hoạt động'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'CreatedAt', 'DATETIME2', N'Ngày tạo sự kiện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'UpdatedAt', 'DATETIME2', N'Ngày cập nhật sự kiện'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'CreatedBy', 'INT', N'Người tạo (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'UpdatedBy', 'INT', N'Người cập nhật (liên kết Users)');

-- RegistrationStatus columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'RegistrationStatus'), 'StatusId', 'INT', N'Khóa chính của bảng trạng thái đăng ký'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RegistrationStatus'), 'StatusName', 'NVARCHAR(50)', N'Tên trạng thái'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RegistrationStatus'), 'Description', 'NVARCHAR(500)', N'Mô tả trạng thái'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RegistrationStatus'), 'Color', 'NVARCHAR(7)', N'Mã màu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RegistrationStatus'), 'IsActive', 'BIT', N'Trạng thái hoạt động'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RegistrationStatus'), 'CreatedAt', 'DATETIME2', N'Ngày tạo trạng thái');

-- EventRegistrations columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'RegistrationId', 'INT', N'Khóa chính của bảng đăng ký'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'EventId', 'INT', N'Khóa ngoại liên kết với Events'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'VolunteerId', 'INT', N'Khóa ngoại liên kết với VolunteerProfiles'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'StatusId', 'INT', N'Khóa ngoại liên kết với RegistrationStatus'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'ApplicationDate', 'DATETIME2', N'Ngày đăng ký'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'ApprovedDate', 'DATETIME2', N'Ngày phê duyệt'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'ApprovedBy', 'INT', N'Người phê duyệt (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'RejectedDate', 'DATETIME2', N'Ngày từ chối'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'RejectedBy', 'INT', N'Người từ chối (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'RejectionReason', 'NVARCHAR(1000)', N'Lý do từ chối'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'CancelledDate', 'DATETIME2', N'Ngày hủy'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'CancellationReason', 'NVARCHAR(1000)', N'Lý do hủy'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'MotivationLetter', 'NVARCHAR(2000)', N'Thư động lực'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'AdditionalInfo', 'NVARCHAR(1000)', N'Thông tin bổ sung'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'AttendanceStatus', 'NVARCHAR(50)', N'Trạng thái tham gia'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'CheckInTime', 'DATETIME2', N'Thời gian check-in'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'CheckOutTime', 'DATETIME2', N'Thời gian check-out'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'ActualHours', 'DECIMAL(5,2)', N'Số giờ thực tế'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'Performance', 'NVARCHAR(20)', N'Hiệu suất'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'PerformanceNotes', 'NVARCHAR(1000)', N'Ghi chú hiệu suất'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'CertificateIssued', 'BIT', N'Trạng thái cấp chứng chỉ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'CertificateIssuedDate', 'DATETIME2', N'Ngày cấp chứng chỉ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'Rating', 'INT', N'Điểm đánh giá'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'Review', 'NVARCHAR(1000)', N'Nhận xét'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'RegistrationDate', 'DATETIME2', N'Ngày đăng ký'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'CreatedAt', 'DATETIME2', N'Ngày tạo đăng ký'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'UpdatedAt', 'DATETIME2', N'Ngày cập nhật đăng ký');

-- VolunteerSchedules columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'ScheduleId', 'INT', N'Khóa chính của bảng lịch trình'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'VolunteerId', 'INT', N'Khóa ngoại liên kết với VolunteerProfiles'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'EventId', 'INT', N'Khóa ngoại liên kết với Events'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'Title', 'NVARCHAR(200)', N'Tiêu đề lịch trình'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'Description', 'NVARCHAR(1000)', N'Mô tả lịch trình'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'StartDateTime', 'DATETIME2', N'Thời gian bắt đầu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'EndDateTime', 'DATETIME2', N'Thời gian kết thúc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'Location', 'NVARCHAR(500)', N'Địa điểm'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'ScheduleType', 'NVARCHAR(50)', N'Loại lịch trình'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'Priority', 'NVARCHAR(20)', N'Độ ưu tiên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'Status', 'NVARCHAR(50)', N'Trạng thái'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'IsAllDay', 'BIT', N'Sự kiện cả ngày'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'ReminderMinutes', 'INT', N'Thời gian nhắc nhở (phút)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'Notes', 'NVARCHAR(1000)', N'Ghi chú'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'CreatedBy', 'INT', N'Người tạo (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'CreatedAt', 'DATETIME2', N'Ngày tạo lịch trình'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'UpdatedAt', 'DATETIME2', N'Ngày cập nhật lịch trình');

-- CoordinatorSchedules columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'ScheduleId', 'INT', N'Khóa chính của bảng lịch trình'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'CoordinatorId', 'INT', N'Khóa ngoại liên kết với Users'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'EventId', 'INT', N'Khóa ngoại liên kết với Events'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'Title', 'NVARCHAR(200)', N'Tiêu đề lịch trình'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'Description', 'NVARCHAR(1000)', N'Mô tả lịch trình'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'StartDateTime', 'DATETIME2', N'Thời gian bắt đầu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'EndDateTime', 'DATETIME2', N'Thời gian kết thúc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'Location', 'NVARCHAR(500)', N'Địa điểm'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'ScheduleType', 'NVARCHAR(50)', N'Loại lịch trình'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'Priority', 'NVARCHAR(20)', N'Độ ưu tiên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'Status', 'NVARCHAR(50)', N'Trạng thái'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'IsAllDay', 'BIT', N'Sự kiện cả ngày'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'ReminderMinutes', 'INT', N'Thời gian nhắc nhở (phút)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'Notes', 'NVARCHAR(1000)', N'Ghi chú'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'CreatedBy', 'INT', N'Người tạo (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'CreatedAt', 'DATETIME2', N'Ngày tạo lịch trình'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'UpdatedAt', 'DATETIME2', N'Ngày cập nhật lịch trình');

-- TaskCategories columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskCategories'), 'CategoryId', 'INT', N'Khóa chính của bảng danh mục công việc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskCategories'), 'CategoryName', 'NVARCHAR(100)', N'Tên danh mục'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskCategories'), 'Description', 'NVARCHAR(500)', N'Mô tả danh mục'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskCategories'), 'Color', 'NVARCHAR(7)', N'Mã màu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskCategories'), 'IsActive', 'BIT', N'Trạng thái hoạt động'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskCategories'), 'CreatedAt', 'DATETIME2', N'Ngày tạo danh mục');

-- TaskStatus columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskStatus'), 'StatusId', 'INT', N'Khóa chính của bảng trạng thái công việc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskStatus'), 'StatusName', 'NVARCHAR(50)', N'Tên trạng thái'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskStatus'), 'Description', 'NVARCHAR(500)', N'Mô tả trạng thái'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskStatus'), 'Color', 'NVARCHAR(7)', N'Mã màu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskStatus'), 'IsActive', 'BIT', N'Trạng thái hoạt động'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskStatus'), 'CreatedAt', 'DATETIME2', N'Ngày tạo trạng thái');

-- OnSiteTasks columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'TaskId', 'INT', N'Khóa chính của bảng công việc tại chỗ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'EventId', 'INT', N'Khóa ngoại liên kết với Events'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'CategoryId', 'INT', N'Khóa ngoại liên kết với TaskCategories'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'StatusId', 'INT', N'Khóa ngoại liên kết với TaskStatus'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'TaskName', 'NVARCHAR(200)', N'Tên công việc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'Description', 'NVARCHAR(2000)', N'Mô tả công việc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'StartTime', 'DATETIME2', N'Thời gian bắt đầu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'EndTime', 'DATETIME2', N'Thời gian kết thúc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'EstimatedHours', 'DECIMAL(5,2)', N'Số giờ ước tính'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'ActualHours', 'DECIMAL(5,2)', N'Số giờ thực tế'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'Location', 'NVARCHAR(500)', N'Địa điểm'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'RequiredVolunteers', 'INT', N'Số tình nguyện viên cần'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'AssignedVolunteers', 'INT', N'Số tình nguyện viên được phân công'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'RequiredSkills', 'NVARCHAR(1000)', N'Kỹ năng yêu cầu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'Priority', 'NVARCHAR(20)', N'Độ ưu tiên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'Difficulty', 'NVARCHAR(20)', N'Độ khó'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'Instructions', 'NVARCHAR(MAX)', N'Hướng dẫn công việc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'Materials', 'NVARCHAR(1000)', N'Vật liệu cần thiết'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'SafetyRequirements', 'NVARCHAR(1000)', N'Yêu cầu an toàn'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'CompletionCriteria', 'NVARCHAR(1000)', N'Tiêu chí hoàn thành'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'CompletedAt', 'DATETIME2', N'Ngày hoàn thành'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'CompletedBy', 'INT', N'Người hoàn thành (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'VerifiedBy', 'INT', N'Người xác minh (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'Notes', 'NVARCHAR(1000)', N'Ghi chú'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'CreatedBy', 'INT', N'Người tạo (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'CreatedAt', 'DATETIME2', N'Ngày tạo công việc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'UpdatedAt', 'DATETIME2', N'Ngày cập nhật công việc');

-- TaskAssignments columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), 'AssignmentId', 'INT', N'Khóa chính của bảng phân công'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), 'TaskId', 'INT', N'Khóa ngoại liên kết với OnSiteTasks'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), 'VolunteerId', 'INT', N'Khóa ngoại liên kết với VolunteerProfiles'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), 'AssignedDate', 'DATETIME2', N'Ngày phân công'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), 'AssignedBy', 'INT', N'Người phân công (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), 'Status', 'NVARCHAR(50)', N'Trạng thái phân công'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), 'StartedAt', 'DATETIME2', N'Thời gian bắt đầu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), 'CompletedAt', 'DATETIME2', N'Thời gian hoàn thành'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), 'HoursWorked', 'DECIMAL(5,2)', N'Số giờ làm việc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), 'Performance', 'NVARCHAR(20)', N'Hiệu suất'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), 'Notes', 'NVARCHAR(1000)', N'Ghi chú'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), 'CreatedAt', 'DATETIME2', N'Ngày tạo phân công'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), 'UpdatedAt', 'DATETIME2', N'Ngày cập nhật phân công');

-- CoordinatorTasks columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), 'TaskId', 'INT', N'Khóa chính của bảng công việc điều phối viên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), 'EventId', 'INT', N'Khóa ngoại liên kết với Events'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), 'CoordinatorId', 'INT', N'Khóa ngoại liên kết với Users'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), 'TaskName', 'NVARCHAR(200)', N'Tên công việc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), 'Description', 'NVARCHAR(2000)', N'Mô tả công việc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), 'DueDate', 'DATETIME2', N'Hạn chót'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), 'Priority', 'NVARCHAR(20)', N'Độ ưu tiên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), 'Status', 'NVARCHAR(50)', N'Trạng thái'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), 'Category', 'NVARCHAR(100)', N'Danh mục'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), 'EstimatedHours', 'DECIMAL(5,2)', N'Số giờ ước tính'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), 'ActualHours', 'DECIMAL(5,2)', N'Số giờ thực tế'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), 'CompletedAt', 'DATETIME2', N'Ngày hoàn thành'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), 'Notes', 'NVARCHAR(1000)', N'Ghi chú'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), 'CreatedBy', 'INT', N'Người tạo (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), 'CreatedAt', 'DATETIME2', N'Ngày tạo công việc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), 'UpdatedAt', 'DATETIME2', N'Ngày cập nhật công việc');

-- FeedbackCategories columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'FeedbackCategories'), 'CategoryId', 'INT', N'Khóa chính của bảng danh mục phản hồi'),
((SELECT Id FROM TableSchemas WHERE TableName = 'FeedbackCategories'), 'CategoryName', 'NVARCHAR(100)', N'Tên danh mục'),
((SELECT Id FROM TableSchemas WHERE TableName = 'FeedbackCategories'), 'Description', 'NVARCHAR(500)', N'Mô tả danh mục'),
((SELECT Id FROM TableSchemas WHERE TableName = 'FeedbackCategories'), 'IsActive', 'BIT', N'Trạng thái hoạt động'),
((SELECT Id FROM TableSchemas WHERE TableName = 'FeedbackCategories'), 'CreatedAt', 'DATETIME2', N'Ngày tạo danh mục');

-- Feedback columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'FeedbackId', 'INT', N'Khóa chính của bảng phản hồi'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'EventId', 'INT', N'Khóa ngoại liên kết với Events'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'UserId', 'INT', N'Khóa ngoại liên kết với Users'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'CategoryId', 'INT', N'Khóa ngoại liên kết với FeedbackCategories'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'Subject', 'NVARCHAR(300)', N'Tiêu đề phản hồi'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'Content', 'NVARCHAR(MAX)', N'Nội dung phản hồi'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'Rating', 'INT', N'Điểm đánh giá'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'IsAnonymous', 'BIT', N'Phản hồi ẩn danh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'Status', 'NVARCHAR(50)', N'Trạng thái phản hồi'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'ResponseContent', 'NVARCHAR(MAX)', N'Nội dung trả lời'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'RespondedBy', 'INT', N'Người trả lời (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'RespondedAt', 'DATETIME2', N'Ngày trả lời'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'IsPublic', 'BIT', N'Phản hồi công khai'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'IsVerified', 'BIT', N'Trạng thái xác minh'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'AttachmentUrls', 'NVARCHAR(MAX)', N'Danh sách URL tệp đính kèm'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'CreatedAt', 'DATETIME2', N'Ngày tạo phản hồi'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'UpdatedAt', 'DATETIME2', N'Ngày cập nhật phản hồi');

-- CertificateTemplates columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), 'TemplateId', 'INT', N'Khóa chính của bảng mẫu chứng chỉ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), 'TemplateName', 'NVARCHAR(200)', N'Tên mẫu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), 'Description', 'NVARCHAR(1000)', N'Mô tả mẫu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), 'TemplateType', 'NVARCHAR(50)', N'Loại mẫu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), 'TemplateDesign', 'NVARCHAR(MAX)', N'Thiết kế mẫu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), 'RequiredFields', 'NVARCHAR(1000)', N'Các trường bắt buộc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), 'OrganizationId', 'INT', N'Khóa ngoại liên kết với Organizations'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), 'IsDefault', 'BIT', N'Mẫu mặc định'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), 'IsActive', 'BIT', N'Trạng thái hoạt động'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), 'CreatedBy', 'INT', N'Người tạo (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), 'CreatedAt', 'DATETIME2', N'Ngày tạo mẫu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), 'UpdatedAt', 'DATETIME2', N'Ngày cập nhật mẫu');

-- Certificates columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'CertificateId', 'INT', N'Khóa chính của bảng chứng chỉ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'VolunteerId', 'INT', N'Khóa ngoại liên kết với VolunteerProfiles'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'EventId', 'INT', N'Khóa ngoại liên kết với Events'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'TemplateId', 'INT', N'Khóa ngoại liên kết với CertificateTemplates'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'CertificateNumber', 'NVARCHAR(100)', N'Số chứng chỉ, duy nhất'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'CertificateName', 'NVARCHAR(300)', N'Tên chứng chỉ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'Description', 'NVARCHAR(1000)', N'Mô tả chứng chỉ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'HoursCompleted', 'DECIMAL(5,2)', N'Số giờ hoàn thành'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'PerformanceLevel', 'NVARCHAR(50)', N'Mức hiệu suất'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'IssueDate', 'DATETIME2', N'Ngày cấp'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'ExpiryDate', 'DATETIME2', N'Ngày hết hạn'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'CertificateFileUrl', 'NVARCHAR(500)', N'URL tệp chứng chỉ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'DigitalSignature', 'NVARCHAR(1000)', N'Chữ ký số'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'VerificationCode', 'NVARCHAR(100)', N'Mã xác minh, duy nhất'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'QRCodeUrl', 'NVARCHAR(500)', N'URL mã QR'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'IssuedBy', 'INT', N'Người cấp (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'Status', 'NVARCHAR(50)', N'Trạng thái chứng chỉ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'DownloadCount', 'INT', N'Số lượt tải xuống'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'LastDownloadDate', 'DATETIME2', N'Ngày tải xuống cuối'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'CreatedAt', 'DATETIME2', N'Ngày tạo chứng chỉ');

-- SupportCategories columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportCategories'), 'CategoryId', 'INT', N'Khóa chính của bảng danh mục hỗ trợ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportCategories'), 'CategoryName', 'NVARCHAR(100)', N'Tên danh mục'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportCategories'), 'Description', 'NVARCHAR(500)', N'Mô tả danh mục'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportCategories'), 'Priority', 'NVARCHAR(20)', N'Độ ưu tiên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportCategories'), 'ExpectedResponseTime', 'INT', N'Thời gian phản hồi dự kiến (giờ)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportCategories'), 'IsActive', 'BIT', N'Trạng thái hoạt động'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportCategories'), 'CreatedAt', 'DATETIME2', N'Ngày tạo danh mục');

-- SupportRequests columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'RequestId', 'INT', N'Khóa chính của bảng yêu cầu hỗ trợ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'UserId', 'INT', N'Khóa ngoại liên kết với Users'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'CategoryId', 'INT', N'Khóa ngoại liên kết với SupportCategories'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'Subject', 'NVARCHAR(300)', N'Tiêu đề yêu cầu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'Description', 'NVARCHAR(MAX)', N'Mô tả yêu cầu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'Priority', 'NVARCHAR(20)', N'Độ ưu tiên'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'Status', 'NVARCHAR(50)', N'Trạng thái yêu cầu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'AssignedTo', 'INT', N'Người được phân công (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'AssignedDate', 'DATETIME2', N'Ngày phân công'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'Resolution', 'NVARCHAR(MAX)', N'Giải pháp'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'ResolvedBy', 'INT', N'Người giải quyết (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'ResolvedDate', 'DATETIME2', N'Ngày giải quyết'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'SatisfactionRating', 'INT', N'Điểm hài lòng'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'SatisfactionFeedback', 'NVARCHAR(1000)', N'Phản hồi hài lòng'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'AttachmentUrls', 'NVARCHAR(MAX)', N'Danh sách URL tệp đính kèm'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'CreatedAt', 'DATETIME2', N'Ngày tạo yêu cầu'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'UpdatedAt', 'DATETIME2', N'Ngày cập nhật yêu cầu');

-- SupportRequestComments columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequestComments'), 'CommentId', 'INT', N'Khóa chính của bảng bình luận'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequestComments'), 'RequestId', 'INT', N'Khóa ngoại liên kết với SupportRequests'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequestComments'), 'UserId', 'INT', N'Khóa ngoại liên kết với Users'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequestComments'), 'Comment', 'NVARCHAR(MAX)', N'Nội dung bình luận'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequestComments'), 'IsInternal', 'BIT', N'Bình luận nội bộ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequestComments'), 'AttachmentUrls', 'NVARCHAR(MAX)', N'Danh sách URL tệp đính kèm'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequestComments'), 'CreatedAt', 'DATETIME2', N'Ngày tạo bình luận');

-- CollaborationTypes columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'CollaborationTypes'), 'TypeId', 'INT', N'Khóa chính của bảng loại hợp tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CollaborationTypes'), 'TypeName', 'NVARCHAR(100)', N'Tên loại hợp tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CollaborationTypes'), 'Description', 'NVARCHAR(500)', N'Mô tả loại hợp tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CollaborationTypes'), 'IsActive', 'BIT', N'Trạng thái hoạt động'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CollaborationTypes'), 'CreatedAt', 'DATETIME2', N'Ngày tạo loại hợp tác');

-- PartnerCollaborations columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), 'CollaborationId', 'INT', N'Khóa chính của bảng hợp tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), 'OrganizationId', 'INT', N'Khóa ngoại liên kết với Organizations'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), 'PartnerId', 'INT', N'Khóa ngoại liên kết với Partners'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), 'TypeId', 'INT', N'Khóa ngoại liên kết với CollaborationTypes'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), 'CollaborationName', 'NVARCHAR(300)', N'Tên hợp tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), 'Description', 'NVARCHAR(2000)', N'Mô tả hợp tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), 'Objectives', 'NVARCHAR(2000)', N'Mục tiêu hợp tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), 'StartDate', 'DATE', N'Ngày bắt đầu hợp tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), 'EndDate', 'DATE', N'Ngày kết thúc hợp tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), 'Status', 'NVARCHAR(50)', N'Trạng thái hợp tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), 'Budget', 'DECIMAL(15,2)', N'Ngân sách hợp tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), 'Currency', 'NVARCHAR(3)', N'Loại tiền tệ'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), 'ContractDocumentUrl', 'NVARCHAR(500)', N'URL tài liệu hợp đồng'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), 'CreatedAt', 'DATETIME2', N'Ngày tạo hợp tác'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), 'UpdatedAt', 'DATETIME2', N'Ngày cập nhật hợp tác');

-- Notifications columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Notifications'), 'NotificationId', 'INT', N'Khóa chính của bảng thông báo'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Notifications'), 'UserId', 'INT', N'Khóa ngoại liên kết với Users'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Notifications'), 'Title', 'NVARCHAR(200)', N'Tiêu đề thông báo'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Notifications'), 'Content', 'NVARCHAR(MAX)', N'Nội dung thông báo'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Notifications'), 'SendDate', 'DATETIME2', N'Ngày gửi thông báo'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Notifications'), 'IsRead', 'BIT', N'Trạng thái đã đọc'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Notifications'), 'CreatedAt', 'DATETIME2', N'Ngày tạo thông báo');

-- Reports columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Reports'), 'ReportId', 'INT', N'Khóa chính của bảng báo cáo'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Reports'), 'ReportType', 'NVARCHAR(50)', N'Loại báo cáo'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Reports'), 'Content', 'NVARCHAR(MAX)', N'Nội dung báo cáo'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Reports'), 'GeneratedDate', 'DATETIME2', N'Ngày tạo báo cáo'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Reports'), 'CreatedBy', 'INT', N'Người tạo (liên kết Users)'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Reports'), 'CreatedAt', 'DATETIME2', N'Ngày tạo báo cáo');

-- RolePermissions columns
INSERT INTO TableColumns (TableSchemaId, ColumnName, DataType, Description) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'RolePermissions'), 'PermissionId', 'INT', N'Khóa chính của bảng quyền vai trò'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RolePermissions'), 'RoleId', 'INT', N'Khóa ngoại liên kết với UserRoles'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RolePermissions'), 'PermissionName', 'NVARCHAR(100)', N'Tên quyền'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RolePermissions'), 'Description', 'NVARCHAR(500)', N'Mô tả quyền'),
((SELECT Id FROM TableSchemas WHERE TableName = 'RolePermissions'), 'CreatedAt', 'DATETIME2', N'Ngày tạo quyền');

-- =========================================================
-- 4. TABLE RELATIONSHIPS (Defining all foreign key relationships)
-- =========================================================

-- Users relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'RoleId', (SELECT Id FROM TableSchemas WHERE TableName = 'UserRoles'), 'RoleId', 'FK');

-- UserProfiles relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'UserProfiles'), 'UserId', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK');

-- VolunteerProfiles relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'UserId', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'VerifiedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK');

-- VolunteerSkills relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSkills'), 'VolunteerId', (SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'VolunteerId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSkills'), 'SkillId', (SELECT Id FROM TableSchemas WHERE TableName = 'Skills'), 'SkillId', 'FK');

-- Organizations relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'UserId', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'TypeId', (SELECT Id FROM TableSchemas WHERE TableName = 'OrganizationTypes'), 'TypeId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'VerifiedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK');

-- Partners relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'UserId', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'IndustryId', (SELECT Id FROM TableSchemas WHERE TableName = 'PartnerIndustries'), 'IndustryId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'VerifiedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK');

-- VolunteerCoordinators relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'UserId', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'OrganizationId', (SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'OrganizationId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'ManagerId', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'CreatedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerCoordinators'), 'RequestedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'OrganizationId', 'FK');

-- Events relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'OrganizationId', (SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'OrganizationId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'CategoryId', (SELECT Id FROM TableSchemas WHERE TableName = 'EventCategories'), 'CategoryId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'StatusId', (SELECT Id FROM TableSchemas WHERE TableName = 'EventStatus'), 'StatusId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'CreatedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'UpdatedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK');

-- EventRegistrations relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'EventId', (SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'EventId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'VolunteerId', (SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'VolunteerId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'StatusId', (SELECT Id FROM TableSchemas WHERE TableName = 'RegistrationStatus'), 'StatusId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'ApprovedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'EventRegistrations'), 'RejectedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK');

-- VolunteerSchedules relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'VolunteerId', (SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'VolunteerId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'EventId', (SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'EventId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerSchedules'), 'CreatedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK');

-- CoordinatorSchedules relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'CoordinatorId', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'EventId', (SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'EventId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorSchedules'), 'CreatedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK');

-- OnSiteTasks relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'EventId', (SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'EventId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'CategoryId', (SELECT Id FROM TableSchemas WHERE TableName = 'TaskCategories'), 'CategoryId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'StatusId', (SELECT Id FROM TableSchemas WHERE TableName = 'TaskStatus'), 'StatusId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'CompletedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'VerifiedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'CreatedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK');

-- TaskAssignments relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), 'TaskId', (SELECT Id FROM TableSchemas WHERE TableName = 'OnSiteTasks'), 'TaskId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), 'VolunteerId', (SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'VolunteerId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'TaskAssignments'), 'AssignedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK');

-- CoordinatorTasks relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), 'EventId', (SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'EventId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), 'CoordinatorId', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CoordinatorTasks'), 'CreatedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK');

-- Feedback relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'EventId', (SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'EventId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'UserId', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'CategoryId', (SELECT Id FROM TableSchemas WHERE TableName = 'FeedbackCategories'), 'CategoryId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Feedback'), 'RespondedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK');

-- CertificateTemplates relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), 'OrganizationId', (SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'OrganizationId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), 'CreatedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK');

-- Certificates relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'VolunteerId', (SELECT Id FROM TableSchemas WHERE TableName = 'VolunteerProfiles'), 'VolunteerId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'EventId', (SELECT Id FROM TableSchemas WHERE TableName = 'Events'), 'EventId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'TemplateId', (SELECT Id FROM TableSchemas WHERE TableName = 'CertificateTemplates'), 'TemplateId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'Certificates'), 'IssuedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK');

-- SupportRequests relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'UserId', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'CategoryId', (SELECT Id FROM TableSchemas WHERE TableName = 'SupportCategories'), 'CategoryId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'AssignedTo', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'ResolvedBy', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK');

-- SupportRequestComments relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequestComments'), 'RequestId', (SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequests'), 'RequestId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'SupportRequestComments'), 'UserId', (SELECT Id FROM TableSchemas WHERE TableName = 'Users'), 'UserId', 'FK');

-- PartnerCollaborations relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), 'OrganizationId', (SELECT Id FROM TableSchemas WHERE TableName = 'Organizations'), 'OrganizationId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), 'PartnerId', (SELECT Id FROM TableSchemas WHERE TableName = 'Partners'), 'PartnerId', 'FK'),
((SELECT Id FROM TableSchemas WHERE TableName = 'PartnerCollaborations'), 'TypeId', (SELECT Id FROM TableSchemas WHERE TableName = 'CollaborationTypes'), 'TypeId', 'FK');

-- RolePermissions relationships
INSERT INTO TableRelationships (FromTableId, FromColumn, ToTableId, ToColumn, RelationshipType) VALUES 
((SELECT Id FROM TableSchemas WHERE TableName = 'RolePermissions'), 'RoleId', (SELECT Id FROM TableSchemas WHERE TableName = 'UserRoles'), 'RoleId', 'FK');

-- =========================================================
-- AI CUSTOM INSTRUCTIONS SAMPLE DATA
-- =========================================================

-- Insert sample custom instructions for better AI responses
INSERT INTO AiCustomInstructions (InstructionName, SystemPrompt, BehaviorInstructions, IsActive, CreatedAt, UpdatedAt) VALUES 
('Volunteer Query Assistant', 
N'Bạn là trợ lý AI chuyên về hệ thống quản lý tình nguyện viên IVAN. Bạn có khả năng tạo ra các câu SQL chính xác để truy vấn dữ liệu về tình nguyện viên, sự kiện, và đăng ký tham gia.',
N'1. Luôn sử dụng tên bảng và cột chính xác từ schema
2. Khi truy vấn tên tình nguyện viên, luôn JOIN qua Users → UserProfiles
3. Sử dụng IsActive = 1 cho các bản ghi đang hoạt động
4. Thêm điều kiện ngày tháng phù hợp (StartDate >= GETDATE())
5. Trả lời bằng tiếng Việt tự nhiên và hữu ích',
1, GETDATE(), GETDATE()),

('Event Management Expert', 
N'Bạn là chuyên gia về quản lý sự kiện tình nguyện. Bạn có thể tạo SQL để tìm kiếm, thống kê và phân tích các hoạt động tình nguyện.',
N'1. Ưu tiên sử dụng bảng Events cho các truy vấn sự kiện
2. Kiểm tra IsActive = 1 và ngày tháng hợp lệ
3. Tính toán số chỗ còn trống: MaxVolunteers - CurrentVolunteers
4. Sắp xếp theo StartDate cho các sự kiện sắp diễn ra
5. Bao gồm thông tin địa điểm và mô tả chi tiết',
1, GETDATE(), GETDATE()),

('Data Analysis Specialist', 
N'Bạn là chuyên gia phân tích dữ liệu cho hệ thống tình nguyện. Bạn có thể tạo các câu SQL phức tạp để thống kê và báo cáo.',
N'1. Sử dụng GROUP BY, COUNT, SUM, AVG cho thống kê
2. JOIN nhiều bảng để lấy thông tin đầy đủ
3. Sử dụng subquery khi cần thiết
4. Thêm điều kiện WHERE phù hợp
5. Sắp xếp kết quả theo thứ tự logic',
1, GETDATE(), GETDATE()),

('Simple Query Helper', 
N'Bạn là trợ lý đơn giản cho các truy vấn cơ bản. Bạn tạo SQL đơn giản, dễ hiểu và hiệu quả.',
N'1. Sử dụng SELECT với các cột cụ thể, không dùng SELECT *
2. Chỉ JOIN khi thực sự cần thiết
3. Sử dụng WHERE đơn giản và rõ ràng
4. Giới hạn kết quả với TOP khi phù hợp
5. Trả lời ngắn gọn và trực tiếp',
1, GETDATE(), GETDATE());