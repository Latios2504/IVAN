# Báo Cáo Các Phần Còn Thiếu Trong Backend Implementation

## Tổng Quan

Sau khi kiểm tra chi tiết các controller trong backend theo checklist từ flows B đến F, tôi đã phát hiện nhiều chức năng quan trọng còn thiếu hoặc chưa được implement đầy đủ. Dưới đây là báo cáo chi tiết:

---

## Flow B — Event Lifecycle (Public)

### EventsController.cs - Các phần còn thiếu:

#### ❌ **Event Approval Process**
- **Thiếu**: Endpoint để Admin approve/reject events
- **Hiện tại**: Chỉ có Create, Update, Delete
- **Cần thêm**: 
  - `PUT /api/events/{id}/approve` (Admin only)
  - `PUT /api/events/{id}/reject` (Admin only với lý do)
  - Logic chuyển status từ `Pending Approval` → `Published`

#### ❌ **Event Status Management**
- **Thiếu**: Logic tự động chuyển status theo thời gian
- **Cần thêm**:
  - Background service chuyển `Published` → `Ongoing` khi StartDate đến
  - Logic chuyển `Ongoing` → `Completed` (cần reports và approvals)
  - Endpoint manual update status cho Organization

#### ❌ **Registration Window Validation**
- **Thiếu**: Kiểm tra RegistrationStartDate và RegistrationEndDate
- **Cần thêm**: Validation logic trong Create/Update endpoints

#### ❌ **Event Capacity Management**
- **Thiếu**: Logic kiểm tra MaxVolunteers vs current registrations
- **Cần thêm**: Real-time capacity checking

---

## Flow C — Registration & Attendance

### EventRegistrationsController.cs - Các phần còn thiếu:

#### ❌ **Check-in/Check-out Process**
- **Thiếu hoàn toàn**: Không có endpoints cho check-in/check-out
- **Cần thêm**:
  - `POST /api/eventregistrations/{id}/checkin` 
  - `POST /api/eventregistrations/{id}/checkout`
  - Logic update CheckInTime, CheckOutTime, ActualHours
  - Update AttendanceStatus field

#### ❌ **Registration Status Lifecycle**
- **Thiếu**: Logic chuyển status theo flow `Pending → Approved/Rejected → Attended/No Show → Completed`
- **Hiện tại**: Chỉ có Approve/Reject
- **Cần thêm**: Status management cho attendance tracking

#### ❌ **Capacity Validation**
- **Thiếu**: Kiểm tra MaxVolunteers khi approve registrations
- **Cần thêm**: Logic block approvals khi đạt capacity

#### ❌ **Duplicate Registration Prevention**
- **Thiếu**: Validation unique constraint (EventId, VolunteerProfileId)
- **Cần thêm**: Check duplicate trong AddRegistration

---

## Flow D — Coordinator and Volunteer Scheduling

### CoordinatorScheduleController.cs - Các phần còn thiếu:

#### ❌ **Schedule Status Management**
- **Thiếu**: Endpoints để update status lifecycle
- **Cần thêm**:
  - `PUT /api/coordinatorschedule/{id}/checkin`
  - `PUT /api/coordinatorschedule/{id}/complete`
  - `PUT /api/coordinatorschedule/{id}/cancel`
  - Logic chuyển "Scheduled" → "Checked In" → "Completed"

#### ❌ **Time Conflict Validation**
- **Thiếu**: Logic kiểm tra overlapping schedules
- **Cần thêm**: Validation trong AddSchedule

#### ❌ **Coordinator Availability Checking**
- **Thiếu**: Validation coordinator được assign cho event
- **Cần thêm**: Authorization logic

### VolunteerScheduleController.cs - Các phần còn thiếu:

#### ❌ **Schedule Status Management**
- **Thiếu**: Endpoints để volunteers update status
- **Cần thêm**:
  - `PUT /api/volunteerschedule/{id}/accept`
  - `PUT /api/volunteerschedule/{id}/cancel`
  - `PUT /api/volunteerschedule/{id}/checkin`
  - `PUT /api/volunteerschedule/{id}/complete`

#### ❌ **Schedule Assignment Authorization**
- **Thiếu**: Validation coordinator có quyền assign cho volunteer
- **Cần thêm**: Check coordinator được assign cho event

#### ❌ **Volunteer Registration Validation**
- **Thiếu**: Kiểm tra volunteer đã register và approved cho event
- **Cần thêm**: Validation logic trong CreateVolunteerSchedule

#### ❌ **Time Conflict Prevention**
- **Thiếu**: Logic kiểm tra double-booking
- **Cần thêm**: Cross-event schedule conflict checking

---

## Flow E — On-site Tasks & Supervision

### CoordinatorTaskController.cs - Các phần còn thiếu:

#### ❌ **Task Status Updates**
- **Thiếu**: Endpoints để update task status
- **Cần thêm**:
  - `PUT /api/coordinatortask/{id}/start` ("Assigned" → "In Progress")
  - `PUT /api/coordinatortask/{id}/complete` ("In Progress" → "Completed")
  - `PUT /api/coordinatortask/{id}/cancel`

#### ❌ **Task Assignment Validation**
- **Thiếu**: Validation coordinator được assign cho event
- **Cần thêm**: Authorization logic trong Create

#### ❌ **Delete Task Functionality**
- **Thiếu hoàn toàn**: Không có DELETE endpoint
- **Cần thêm**: `DELETE /api/coordinatortask/{id}`

### OnSiteTaskController.cs - Các phần còn thiếu:

#### ❌ **Task Assignment Management**
- **Thiếu hoàn toàn**: Không có logic assign tasks cho volunteers
- **Cần thêm**:
  - `POST /api/onsitetask/{id}/assign` (assign to volunteers)
  - `DELETE /api/onsitetask/{id}/unassign/{volunteerId}`
  - TaskAssignments table management

#### ❌ **Task Status Lifecycle**
- **Thiếu**: Endpoints để update task status
- **Cần thêm**:
  - `PUT /api/onsitetask/{id}/assign` ("Created" → "Assigned")
  - `PUT /api/onsitetask/{id}/start` ("Assigned" → "In Progress")
  - `PUT /api/onsitetask/{id}/complete` ("In Progress" → "Completed")

#### ❌ **Task Assignment Validation**
- **Thiếu**: Logic kiểm tra volunteers đã register cho event
- **Cần thêm**: Validation trong assignment process

#### ❌ **Progress Tracking**
- **Thiếu**: Logic track completion của all assignments
- **Cần thêm**: Update parent task status khi all assignments done

#### ❌ **Delete Task Functionality**
- **Thiếu hoàn toàn**: Không có DELETE endpoint
- **Cần thêm**: `DELETE /api/onsitetask/{id}`

---

## Flow F — Reporting → Gate to Event Completed

### ReportController.cs - Các phần còn thiếu:

#### ❌ **Report Authorization**
- **Thiếu**: Logic validate chỉ Coordinator có thể generate reports
- **Cần thêm**: Check user trong VolunteerCoordinators table

#### ❌ **Event-Specific Authorization**
- **Thiếu**: Validation coordinator được assign cho event cụ thể
- **Cần thêm**: Check via CoordinatorSchedules hoặc CoordinatorTasks

#### ❌ **Completion Gates Validation**
- **Thiếu hoàn toàn**: Logic kiểm tra prerequisites trước khi generate report
- **Cần thêm**:
  - Check all CoordinatorTasks completed/cancelled
  - Check all OnSiteTasks completed/cancelled
  - Check all TaskAssignments completed/cancelled
  - Check all Schedules completed/cancelled/no-show
  - Check all EventRegistrations checked-out

#### ❌ **Report Approval Process**
- **Thiếu**: Endpoints để Organization approve reports
- **Cần thêm**:
  - `PUT /api/report/{id}/approve` (Organization only)
  - Logic set approvals.organizationApproved = true

#### ❌ **Event Status Update Integration**
- **Thiếu**: Logic update Event status sau khi report approved
- **Cần thêm**: Integration với EventsController để chuyển "Ongoing" → "Completed"

#### ❌ **Data Aggregation Logic**
- **Thiếu**: Logic tính toán metrics từ các bảng liên quan
- **Cần thêm**:
  - Aggregate ActualHours từ EventRegistrations
  - Count completed tasks
  - Calculate volunteer performance metrics

#### ❌ **Report Content Structure**
- **Thiếu**: Standardized JSON structure cho report content
- **Cần thêm**: Defined schema cho totals, artifacts, approvals

---

## Các Controller/Functionality Hoàn Toàn Thiếu

### ❌ **TaskAssignments Management**
- **Thiếu hoàn toàn**: Không có controller riêng cho TaskAssignments
- **Cần tạo**: TaskAssignmentsController.cs với:
  - CRUD operations cho task assignments
  - Status management cho assignments
  - Volunteer task tracking

### ❌ **Event Status Management Service**
- **Thiếu**: Background service tự động update event status
- **Cần tạo**: EventStatusService với:
  - Scheduled jobs chuyển Published → Ongoing
  - Logic completion checking

### ❌ **Notification System**
- **Thiếu**: Hệ thống thông báo cho status changes
- **Cần tạo**: NotificationService với:
  - Email notifications
  - In-app notifications
  - Status change alerts

---

## Tổng Kết

### Mức Độ Thiếu Sót:
- **Flow B (Event Lifecycle)**: ~40% thiếu
- **Flow C (Registration & Attendance)**: ~60% thiếu
- **Flow D (Scheduling)**: ~70% thiếu
- **Flow E (On-site Tasks)**: ~80% thiếu
- **Flow F (Reporting)**: ~90% thiếu

### Ưu Tiên Implement:
1. **Cao**: Flow C (Check-in/Check-out), Flow F (Completion Gates)
2. **Trung bình**: Flow D (Schedule Status), Flow E (Task Assignment)
3. **Thấp**: Flow B (Auto Status Updates), Notification System

### Khuyến Nghị:
1. Tập trung vào Flow C và F trước vì chúng là core của event lifecycle
2. Implement TaskAssignments management để hoàn thiện Flow E
3. Thêm comprehensive validation và authorization cho tất cả endpoints
4. Tạo background services cho auto status updates
5. Implement notification system để improve user experience