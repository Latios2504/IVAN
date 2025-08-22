# Backend Flow Consistency Checklist

## Mục đích

File này dùng để kiểm tra tính nhất quán giữa các controller trong backend và các luồng nghiệp vụ đã định nghĩa trong `flows.md`.
Yêu cầu kiểm tra toàn bộ các file liên quan như Controller, DTO, Service, Mapping, Repository liên quan đến flow kiểm tra.
Ngoài đối chiếu với `flows.md`, còn có thể đối chiếu với `ivan_database_schema.sql` `ivan_database_data.sql` để làm rõ hơn cấu trúc của các bảng.

## Flow A — Support Request (Charity-only)

### Controllers cần kiểm tra:

- [ ] **SupportRequestController.cs**
- [ ] **EventsController.cs** (tạo event từ support request)

### Checklist chi tiết:

#### SupportRequestController.cs

- [ ] **Status lifecycle**: Kiểm tra có đúng các trạng thái `Submitted → Under Review → Approved/Rejected → In Progress → Closed`
- [ ] **Create Support Request**:
  - [ ] Validate các trường bắt buộc (Title, Description, CategoryId, Priority)
  - [ ] Set status mặc định là `Submitted`
  - [ ] Set CreatedAt timestamp
- [ ] **Review Support Request**:
  - [ ] Chỉ Admin có thể chuyển từ `Submitted` → `Under Review`
  - [ ] Admin có thể `Approve` hoặc `Reject` với lý do
- [ ] **Progress Tracking**:
  - [ ] Khi tạo Event từ SR → chuyển SR sang `In Progress`
  - [ ] Khi Event hoàn tất → có thể chuyển SR sang `Closed`
- [ ] **Comments System**: Kiểm tra có hỗ trợ SupportRequestComments

#### EventsController.cs (liên quan SR)

- [ ] **Create Event from SR**:
  - [ ] Có endpoint tạo Event từ SupportRequest
  - [ ] Link Event với SR qua reference hoặc metadata
  - [ ] Tự động chuyển SR status sang `In Progress`

---

## Flow B — Event Lifecycle (Public)

### Controllers cần kiểm tra:

- [ ] **EventsController.cs**

### Checklist chi tiết:

#### EventsController.cs

- [ ] **Status lifecycle**: Kiểm tra có đúng các trạng thái `Pending Approval → Published → Ongoing → Completed/Cancelled`
- [ ] **Create Event**:
  - [ ] Organization có thể tạo event với status `Pending Approval`
  - [ ] Validate các trường bắt buộc:
    - [ ] `EventName` (required, max length)
    - [ ] `Description` (required)
    - [ ] `StartDate` và `EndDate` (StartDate < EndDate, future dates)
    - [ ] `Location` và `ContactPerson` (required fields)
    - [ ] `MaxVolunteers` (positive integer)
    - [ ] `OrganizationId` exists in Organizations table
  - [ ] Set registration window (RegistrationStartDate, RegistrationEndDate)
- [ ] **Approval Process**:
  - [ ] Admin có thể approve event → chuyển sang `Published`
  - [ ] Admin có thể reject với lý do
- [ ] **Publication Rules**:
  - [ ] Chỉ event `Published` mới hiển thị public
  - [ ] Kiểm tra registration window hợp lệ
- [ ] **Event Management**:
  - [ ] Organization có thể update event (trước khi Published)
  - [ ] Chuyển sang `Ongoing` khi StartDate đến
  - [ ] Logic complete event (cần reports và approvals)
- [ ] **Event capacity management**:
  - [ ] Check `MaxVolunteers` against current registration count
  - [ ] Block new registrations when capacity reached
- [ ] **Partner association validation**:
  - [ ] Validate `PartnerId` exists in Partners table if provided

---

## Flow C — Registration & Attendance

### Controllers cần kiểm tra:

- [ ] **EventRegistrationsController.cs**

### Checklist chi tiết:

#### EventRegistrationsController.cs

- [ ] **Registration Process**:
  - [ ] Create record in `EventRegistrations` table
  - [ ] Set initial `StatusId` to "Pending" from `RegistrationStatus` table
  - [ ] Kiểm tra event đang ở trạng thái `Published`
  - [ ] Validate `EventId` exists and event is still accepting registrations
  - [ ] Validate `VolunteerProfileId` exists
  - [ ] Kiểm tra trong registration window
  - [ ] Kiểm tra MaxVolunteers limit
- [ ] **Status lifecycle using EventRegistrations.StatusId → RegistrationStatus table**:
  - [ ] `Pending → Approved/Rejected → Attended/No Show → Completed`
  - [ ] Rejected status for declined applications
- [ ] **Approval System**:
  - [ ] **Organization** có thể approve/reject registrations
  - [ ] **Authorization**: Validate user is Organization
  - [ ] Gửi notification khi status thay đổi
- [ ] **Check-in Process**:
  - [ ] Update `CheckInTime` when volunteer arrives (status: Pending/Approved → Attended)
  - [ ] Record ActualStartTime
  - [ ] Update `AttendanceStatus` field accordingly
- [ ] **Check-out Process**:
  - [ ] Update `CheckOutTime` when volunteer leaves (status: Attended → Completed)
  - [ ] Record ActualEndTime và tính `ActualHours` = CheckOutTime - CheckInTime
- [ ] **Registration capacity validation**:
  - [ ] Count approved registrations against `Events.MaxVolunteers`
  - [ ] Block new approvals when capacity reached
- [ ] **Duplicate registration prevention**:
  - [ ] Check unique constraint on (EventId, VolunteerProfileId)

---

## Flow D — Coordinator and Volunteer Scheduling

### Controllers cần kiểm tra:

- [ ] **CoordinatorScheduleController.cs**
- [ ] **VolunteerScheduleController.cs**
- [ ] **CoordinatorTaskController.cs**

### Checklist chi tiết:

#### CoordinatorScheduleController.cs

- [ ] **Self Schedule Management**:
  - [ ] **Coordinator** có thể tạo lịch cho chính mình
  - [ ] **Authorization**: Validate `CreatedBy` là chính Coordinator đó (CoordinatorId trong VolunteerCoordinators)
  - [ ] Create record in `CoordinatorSchedules` table với `CreatedBy` = Coordinator's UserId
  - [ ] Validate `CoordinatorId` exists in `VolunteerCoordinators` table
  - [ ] Validate `EventId` exists and is active
  - [ ] Set `StartDateTime` and `EndDateTime` within event duration
- [ ] **Status lifecycle using CoordinatorSchedules.Status (NVARCHAR field)**:
  - [ ] "Scheduled" → "Checked In" → "Completed"
  - [ ] "Cancelled" and "No Show" statuses
  - [ ] Use constants in backend for status values
- [ ] **Time conflict validation**:
  - [ ] Check overlapping schedules for same coordinator
  - [ ] Query existing schedules with time range overlap
- [ ] **Coordinator availability checking**:
  - [ ] Validate coordinator is assigned to the event
  - [ ] Check coordinator's other commitments

#### VolunteerScheduleController.cs

- [ ] **Schedule Assignment by Coordinator**:
  - [ ] **Coordinator** có thể tạo lịch cho volunteers trong event của mình
  - [ ] **Authorization**: Validate `CreatedBy` là Coordinator được assign cho event này
  - [ ] Create record in `VolunteerSchedules` table với `CreatedBy` = Coordinator's UserId
  - [ ] Validate `VolunteerProfileId` exists và đã register cho event
  - [ ] Validate volunteer is registered for the event
  - [ ] Assign volunteer đã approved registration
- [ ] **Schedule status management using VolunteerSchedules.Status (NVARCHAR field)**:
  - [ ] "Scheduled" → "Checked In" → "Completed"
  - [ ] "Cancelled" and "No Show" statuses
- [ ] **Time conflict validation**:
  - [ ] Check overlapping schedules for same volunteer
  - [ ] Prevent double-booking across events
- [ ] **Schedule acceptance/rejection**:
  - [ ] Allow volunteers to update status to "Cancelled"
  - [ ] Send notifications on status changes

#### CoordinatorTaskController.cs

- [ ] **Task Assignment by Organization**:
  - [ ] **Organization** có thể tạo và assign tasks cho Coordinator
  - [ ] **Authorization**: Validate `CreatedBy` là Organization owner của event
  - [ ] Create record in `CoordinatorTasks` table với `CreatedBy` = Organization UserId
  - [ ] Validate `CoordinatorId` exists in `VolunteerCoordinators` và được assign cho event này
  - [ ] Link to `EventId` for event-specific tasks
  - [ ] Set initial status = "Assigned"
- [ ] **Task supervision and monitoring**:
  - [ ] Update `CoordinatorTasks.Status` (NVARCHAR field)
  - [ ] Track task progress and completion
- [ ] **Task status updates using string constants**:
  - [ ] "Assigned" → "In Progress" → "Completed"
  - [ ] "Cancelled" status for abandoned tasks

---

## Flow E — On-site Tasks & Supervision

### Controllers cần kiểm tra:

- [ ] **OnSiteTaskController.cs**
- [ ] **TaskAssignments Management**

### Checklist chi tiết:

#### OnSiteTaskController.cs

- [ ] **Task Creation by Coordinator**:
  - [ ] **Coordinator** có thể tạo on-site tasks
  - [ ] **Authorization**: Validate `CreatedBy` là Coordinator
  - [ ] Create record in `OnSiteTasks` table với `CreatedBy` = Coordinator UserId
  - [ ] Validate `EventId` exists and is active
  - [ ] Set `CategoryId` from `TaskCategories` table
  - [ ] Set initial `StatusId` from `TaskStatus` table ("Created")
  - [ ] Define `RequiredVolunteers` count
- [ ] **Task status lifecycle using OnSiteTasks.StatusId → TaskStatus table**:
  - [ ] `Created → Assigned → In Progress → Completed`
  - [ ] `Cancelled` status for abandoned tasks
- [ ] **Task priority management**:
  - [ ] Use `Priority` field (High/Medium/Low)
  - [ ] Sort tasks by priority and due date
- [ ] **Task assignment validation**:
  - [ ] Create records in `TaskAssignments` table
  - [ ] Validate assigned volunteers are registered for event
  - [ ] Check volunteer availability during task timeframe
- [ ] **Progress Tracking**:
  - [ ] Update task progress
  - [ ] Mark completion với timestamps
  - [ ] Verification by coordinator

#### TaskAssignments Management (inside On-siteTaskController)

- [ ] **Task Assignment by Coordinator**:
  - [ ] **Coordinator** có thể assign on-site tasks cho volunteers
  - [ ] **Authorization**: Validate `AssignedBy` là Coordinator được assign cho event này
  - [ ] Create record in `TaskAssignments` table
  - [ ] Link `OnSiteTaskId` to `VolunteerProfileId`
  - [ ] Set `AssignedBy` = Coordinator's UserId
  - [ ] Set `AssignedDate` to current timestamp
  - [ ] Validate volunteer đã register và approved cho event
  - [ ] Update `OnSiteTasks.AssignedVolunteers` count
- [ ] **Volunteer task assignment tracking**:
  - [ ] Use `TaskAssignments.Status` (NVARCHAR field)
  - [ ] Track assignment date and completion
- [ ] **Task completion validation**:
  - [ ] Verify all assigned volunteers completed their parts
  - [ ] Update parent `OnSiteTasks.StatusId` when all assignments done

## Flow F — Reporting → Gate to Event Completed

### Controllers cần kiểm tra:

- [ ] **ReportController.cs**
- [ ] **EventsController.cs** (completion logic)
- [ ] **ExportController.cs** (data exports)

### Checklist chi tiết:

#### ReportController.cs

- [ ] **Report generation and management**:
  - [ ] Create record in `Reports` table
  - [ ] Set `ReportType` (Event Summary, Volunteer Hours, Task Completion, etc.)
  - [ ] Validate `GeneratedBy` user has reporting permissions
  - [ ] **ONLY Coordinator can generate reports** - validate user is in `VolunteerCoordinators` table
  - [ ] Set `GeneratedDate` to current timestamp
  - [ ] **Important Note**: Report generation does NOT automatically change event status. Event status (`Events.StatusId`) must be manually updated by the organization from 'Ongoing' to 'Completed' through a separate process
- [ ] **Event Completion Reports**:
  - [ ] Generate EventCompletion report type
  - [ ] JSON content structure với totals, artifacts, approvals
  - [ ] **Authorization Check**: Validate coordinator is assigned to this specific event via `CoordinatorSchedules` or `CoordinatorTasks`
  - [ ] **Pre-completion Validation**: Run all completion gates before allowing report creation
  - [ ] Coordinator có thể submit completion report ONLY after all prerequisites met
- [ ] **Report data aggregation**:
  - [ ] Query `EventRegistrations` for attendance data
  - [ ] Aggregate `ActualHours` from registrations
  - [ ] Count completed tasks from `OnSiteTasks` and `TaskAssignments`
  - [ ] Calculate volunteer performance metrics
- [ ] **Report Approval**:
  - [ ] Organization có thể approve completion report
  - [ ] Set approvals.organizationApproved = true
- [ ] **Report access control**:
  - [ ] Validate user permissions before generating reports
  - [ ] Filter data based on user's organization/role
  - [ ] Store `FilePath` securely for generated reports
- [ ] **Completion Gates - Prerequisites for Report Generation**:
  - [ ] **Coordinator Task Completion**: All `CoordinatorTasks` for the event must be "Completed" or "Cancelled"
  - [ ] **OnSite Task Completion**: All `OnSiteTasks` for the event must have StatusId = "Completed" or "Cancelled"
  - [ ] **Task Assignment Completion**: All `TaskAssignments` for event tasks must have Status = "Completed" or "Cancelled"
  - [ ] **Schedule Completion**: All `CoordinatorSchedules` and `VolunteerSchedules` for the event must be "Completed", "Cancelled", or "No Show"
  - [ ] **Registration Check-out**: All approved `EventRegistrations` must have CheckOutTime filled (status = "Completed" or "No Show")
  - [ ] **Coordinator Authorization**: Only coordinators assigned to the event can generate completion reports
  - [ ] Require completion report approved by organization
- [ ] **Report parameters and filtering**:
  - [ ] Use `Parameters` JSON field for report criteria
  - [ ] Support date ranges, event filters, volunteer filters

#### ExportController.cs (Addtional Function for future - no need to check now)

- [ ] **Data export functionality**:
  - [ ] Generate exports from `Reports` table data
  - [ ] Support multiple formats via `Parameters` field
- [ ] **Export format support (PDF, Excel, CSV)**:
  - [ ] Use `ReportType` to determine appropriate format
  - [ ] Store file path in `Reports.FilePath`
- [ ] **Data Exports**:
  - [ ] Attendance CSV export
  - [ ] Task closure snapshots
  - [ ] Store export URLs trong Reports.Content.artifacts
- [ ] **Large dataset handling**:
  - [ ] Implement pagination for large reports
  - [ ] Use streaming for large file exports
- [ ] **Export history tracking**:
  - [ ] Maintain records in `Reports` table
  - [ ] Track download count and last access

---

## Flow G — Feedback (Moderation)

### Controllers cần kiểm tra:

- [ ] **FeedbackController.cs**
- [ ] **ModerationController.cs**

### Checklist chi tiết:

#### FeedbackController.cs

- [ ] **Feedback Submission**:
  - [ ] User có thể submit feedback cho event
  - [ ] Set status mặc định `Pending`
  - [ ] Support rating, category, anonymous option
- [ ] **Feedback Display**:
  - [ ] Public feed chỉ hiển thị Approved + IsPublic=1
  - [ ] Filter theo event, category
- [ ] **Response System**:
  - [ ] Organization có thể reply feedback
  - [ ] Track ResponseContent, RespondedBy, RespondedAt

#### ModerationController.cs

- [ ] **Moderation Process**:
  - [ ] Admin/Moderator có thể approve/reject feedback
  - [ ] Set IsPublic, IsVerified flags
  - [ ] Add rejection reason trong ResponseContent
- [ ] **Content Management**:
  - [ ] Remove feedback khỏi public (IsPublic=0)
  - [ ] Flag inappropriate content
  - [ ] Auto-flag low ratings (≤2) với IsAnonymous=1

---

## Flow H — Certificates (Optional)

### Controllers cần kiểm tra:

- [ ] **CertificateController.cs**
- [ ] **CertificateTemplateController.cs**

### Checklist chi tiết:

#### CertificateController.cs

- [ ] **Certificate Issuance**:
  - [ ] Chỉ issue khi Event đã Completed
  - [ ] Kiểm tra volunteer có Attended/Completed registration
  - [ ] Validate ActualHours ≥ threshold
- [ ] **Status Management**:
  - [ ] Status lifecycle: Pending → Issued/Revoked
  - [ ] Track IssuedAt timestamp
- [ ] **Evidence & Notes**:
  - [ ] Store EvidenceUrl
  - [ ] Support Notes field

#### CertificateTemplateController.cs

- [ ] **Template Management**:
  - [ ] Manage certificate templates
  - [ ] Link templates với certificate generation
