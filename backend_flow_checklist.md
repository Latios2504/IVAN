# Backend Flow Consistency Checklist

## Mục đích

File này dùng để kiểm tra tính nhất quán giữa các controller trong backend và các luồng nghiệp vụ đã định nghĩa trong `flows.md`.
Yêu cầu kiểm tra toàn bộ các file liên quan như Controller, DTO, Service, Mapping, Repository liên quan đến flow kiểm tra.
Ngoài đối chiếu với `flows.md`, còn có thể đối chiếu với `ivan_database_schema.sql` `ivan_database_data.sql` để làm rõ hơn cấu trúc của các bảng.

---

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

- [ ] **Status lifecycle**: Kiểm tra có đúng các trạng thái `Pending Approval → Published → Ongoing → Completed → Cancelled`
- [ ] **Create Event**:
  - [ ] Organization có thể tạo event với status `Pending Approval`
  - [ ] Validate các trường bắt buộc (Title, Description, StartDate, EndDate, Location)
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

---

## Flow C — Registration & Attendance

### Controllers cần kiểm tra:

- [ ] **EventRegistrationsController.cs**

### Checklist chi tiết:

#### EventRegistrationsController.cs

- [ ] **Registration Process**:
  - [ ] Kiểm tra event đang ở trạng thái `Published`
  - [ ] Kiểm tra trong registration window
  - [ ] Kiểm tra MaxVolunteers limit
  - [ ] Set status mặc định `Pending`
- [ ] **Status lifecycle**: `Pending → Approved/Rejected → Attended/No Show → Completed`
- [ ] **Approval System**:
  - [ ] Organization/Coordinator có thể approve/reject registrations
  - [ ] Gửi notification khi status thay đổi
- [ ] **Check-in Process**:
  - [ ] Endpoint check-in volunteer → chuyển sang `Attended`
  - [ ] Record ActualStartTime
- [ ] **Check-out Process**:
  - [ ] Endpoint check-out → chuyển sang `Completed`
  - [ ] Record ActualEndTime và tính ActualHours

---

## Flow D — Coordinator and Volunteer Scheduling

### Controllers cần kiểm tra:

- [ ] **CoordinatorScheduleController.cs**
- [ ] **VolunteerScheduleController.cs**
- [ ] **CoordinatorTaskController.cs**

### Checklist chi tiết:

#### CoordinatorScheduleController.cs

- [ ] **Schedule Management**:
  - [ ] Tạo schedule cho coordinator
  - [ ] Status lifecycle: `Scheduled → Checked In → Completed/Cancelled/No Show`
  - [ ] Validate time conflicts
- [ ] **Check-in/out Process**:
  - [ ] Record actual times
  - [ ] Calculate actual hours

#### VolunteerScheduleController.cs

- [ ] **Schedule Assignment**:
  - [ ] Assign volunteer đã approved registration
  - [ ] Kiểm tra time conflicts
  - [ ] Status management tương tự coordinator
- [ ] **Attendance Tracking**:
  - [ ] Check-in/out process
  - [ ] Hours calculation

#### CoordinatorTaskController.cs

- [ ] **Assignment Management**:
  - [ ] Assign coordinator cho event
  - [ ] Manage coordinator permissions
  - [ ] Link với CoordinatorSchedule

---

## Flow E — On-site Tasks & Supervision

### Controllers cần kiểm tra:

- [ ] **OnSiteTaskController.cs**
- [ ] **CoordinatorTaskController.cs**

### Checklist chi tiết:

#### OnSiteTaskController.cs

- [ ] **Task Management**:
  - [ ] Create tasks cho event
  - [ ] Status lifecycle: `Pending → In Progress → Completed/Cancelled`
  - [ ] Priority levels (High/Medium/Low)
- [ ] **Task Assignment**:
  - [ ] Assign tasks cho volunteers
  - [ ] Track TaskAssignments với status
- [ ] **Progress Tracking**:
  - [ ] Update task progress
  - [ ] Mark completion với timestamps
  - [ ] Verification by coordinator

## Flow F — Reporting → Gate to Event Completed

### Controllers cần kiểm tra:

- [ ] **ReportController.cs**
- [ ] **EventsController.cs** (completion logic)
- [ ] **ExportController.cs** (data exports)

### Checklist chi tiết:

#### ReportController.cs

- [ ] **Event Completion Reports**:
  - [ ] Generate EventCompletion report type
  - [ ] JSON content structure với totals, artifacts, approvals
  - [ ] Coordinator có thể submit completion report
- [ ] **Report Approval**:
  - [ ] Organization có thể approve completion report
  - [ ] Set approvals.organizationApproved = true
- [ ] **Completion Gates**:
  - [ ] Validate tất cả tasks đã Completed/Cancelled
  - [ ] Validate tất cả schedules đã closed
  - [ ] Require completion report approved

#### ExportController.cs

- [ ] **Data Exports**:
  - [ ] Attendance CSV export
  - [ ] Task closure snapshots
  - [ ] Store export URLs trong Reports.Content.artifacts

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
