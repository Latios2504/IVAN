# IVAN — Charity Support & Event Lifecycle (FINAL)

> **Goal:** Một tài liệu duy nhất, đầy đủ và dễ đọc cho toàn bộ luồng nghiệp vụ: từ **Support Request** (chỉ từ thiện) → **Event** (duyệt, public, đăng ký) → **Coordinator scheduling & On‑site tasks** → **Reporting (Reports)** → **Event Completed** → **Feedback** (moderation) → (tuỳ chọn) **Certificates**.
>
> **Schema KHÔNG thay đổi.** Seed data dùng **English** cho status/priority (`Pending/Published/...`, `High/Medium/Low`), mô tả tiếng Việt.

---

## 0) Conventions & Glossary

- **Actors**
  - **User**: người gửi yêu cầu từ thiện (support request), có thể là bất kỳ ai, kể cả tài khoản chưa đăng nhập vào website.
  - **Admin**: duyệt Support Requests, duyệt Event, moderate Feedback.
  - **Organization**: tạo Event, sở hữu nội dung, phê duyệt báo cáo để đóng Event.
  - **Coordinator**: lập lịch, giao việc on‑site, giám sát & báo cáo hoàn thành.
  - **Volunteer**: đăng ký và tham gia Event, nhận task/ca, gửi feedback.
- **Core status (English labels):**
  - **EventStatus**: `Pending Approval → Published → Ongoing → Completed` _(or_ `Cancelled`_)_
  - **RegistrationStatus**: `Pending, Approved, Rejected, Cancelled, Attended, No Show, Completed`
  - **TaskStatus**: `Not Started, In Progress, Completed, On Hold, Cancelled`
  - **SupportRequests.Status (text)**: `Submitted → Under Review → Approved → In Progress → Closed` _(or `Rejected`)_
  - **Feedback.Status (text)**: `Pending → Approved → Removed` _(or `Rejected`, optional `Flagged`)_
- **Priority (text)**: `High/Medium/Low`
- **Registration window**: điều khiển bởi `Events.RegistrationStartDate/RegistrationEndDate` (không cần “Registration Open/Closed” status).
- **Reports**: dùng bảng `Reports(ReportType, Content(JSON), ...)` để lưu **EventCompletion** report; `Content` chứa `eventId` & số liệu.

> **Nguyên tắc đặt tên:** trạng thái/ưu tiên dùng **English** đồng bộ; mô tả, tiêu đề vẫn tiếng Việt cho UX.

---

## 1) Flow A — Support Request (Charity‑only)

**Mục tiêu:** Nhận yêu cầu từ thiện, review, hiển thị cho organization, thúc đẩy tạo event và đóng yêu cầu khi đạt mục tiêu.

### 1.1 Entities & Key Fields

- `SupportRequests`: `Status`, `Priority`, `AssignedTo`, `AttachmentUrls`, `Resolution`
- `SupportCategories`: `CategoryName`, `Priority (High/Medium/Low)`, `IsActive`
- `SupportRequestComments`: nhật ký trao đổi, ghi chú, bằng chứng bổ sung

### 1.2 States (SupportRequests.Status)

`Submitted → Under Review → Approved → In Progress → Closed` _(or `Rejected`)_

### 1.3 Happy Path

1. **Submit**: User tạo yêu cầu kèm bằng chứng ⇒ `Submitted`.
2. **Triage**: Admin nhận/assign người xử lý ⇒ `Under Review`.
3. **Decision**: Nếu đủ điều kiện charity ⇒ `Approved`; nếu không ⇒ `Rejected` (ghi reason ở `Resolution`).
4. **Execution**: Organization thấy các SR đã duyệt, có thể tạo **Event** dựa trên SR ⇒ SR chuyển `In Progress`.
5. **Close**: Khi các báo cáo/triển khai đạt mục tiêu ⇒ SR `Closed` (không phụ thuộc cứng vào Event, nhưng thường song hành).

### 1.4 Rules & Notes

- **Scope**: Support Request **chỉ** cho từ thiện. Mọi yêu cầu IT/login… gắn `Rejected` + lý do.
- **Visibility**: SR `Approved` có thể được surface cho Organization trong dashboard để chọn lập Event.
- **Audit**: dùng `SupportRequestComments` để log quyết định & bằng chứng.

---

## 2) Flow B — Event Lifecycle (Public)

**Mục tiêu:** Organization tạo Event, Admin duyệt để public, volunteer đăng ký, event diễn ra & kết thúc.

### 2.1 Entities

- `Events`: `StatusId (FK→EventStatus)`, `RegistrationStartDate`, `RegistrationEndDate`, `MaxVolunteers`, `CreatedBy` …
- `EventStatus`: master 5 trạng thái chuẩn (Active = 1):  
  `Pending Approval, Published, Ongoing, Completed, Cancelled`

### 2.2 Transitions

1. **Draft**: Organization tạo ⇒ `Pending Approval`.
2. **Review**: Admin duyệt ⇒ `Published` (public).
3. **Registration**: trong khung `RegistrationStartDate/EndDate`, volunteer có thể đăng ký.
4. **Run**: tới ngày diễn ra ⇒ `Ongoing`.
5. **Finish**: đủ điều kiện hoàn tất, Organization chỉnh trạng thái ⇒ `Completed` _(nếu hủy ⇒ `Cancelled`)_.

> **Note:** Trạng thái “Registration Open/Closed” được suy luận từ ngày; không cần thêm status.

---

## 3) Flow C — Registration & Attendance

### 3.1 Entities

- `EventRegistrations`: liên kết Volunteer ↔ Event, `StatusId (FK→RegistrationStatus)`, `CheckInTime`, `CheckOutTime`, `ActualHours`, `Performance`

### 3.2 RegistrationStatus (master)

`Pending, Approved, Rejected, Cancelled, Attended, No Show, Completed`

### 3.3 Process

1. **Apply**: Volunteer nộp đơn trong cửa sổ đăng ký ⇒ `Pending`.
2. **Screen**: Coordinator/Organization duyệt ⇒ `Approved` _(hoặc `Rejected`)_.
3. **Withdraw**: Volunteer hủy ⇒ `Cancelled`.
4. **Attendance**: khi on‑site → cập nhật `CheckInTime/CheckOutTime`; hậu kiểm có thể set `Attended/No Show` hoặc `Completed` (nếu có tiêu chí hoàn thành).

---

## 4) Flow D — Coordinator and Volunteer Scheduling (post‑registration)

**Mục tiêu:** Organization lập lịch và giao nhiệm vụ cho Coordinator. Coordinator lập lịch phân ca cho volunteer.

### 4.1 Entities

- `CoordinatorSchedules`: cuộc họp/điều phối nội bộ (briefing, logistics). Fields: `Priority`, `Status`, `PlannedAt`, `Notes`
- `CoordinatorTasks`: nhiệm vụ được Organization giao, có priority, status, deadline. Fields: `Priority`, `Status`, `Deadline`, `Notes`
- `VolunteerSchedules`: ca làm của volunteer. Fields: `Priority`, `Status`, `StartAt`, `EndAt`, `Location`, `Notes`

### 4.2 Status (text)

- **CoordinatorSchedules.Status**: `Planned → In Progress → Completed` _(or `Cancelled`)_
- **CoordinatorTasks.Status**: `Not Started → In Progress → Completed` _(or `On Hold/Cancelled`)_
- **VolunteerSchedules.Status**: `Scheduled → Checked In → Completed` _(or `No Show/Cancelled`)_

### 4.3 Steps

1. Organization giao việc: tạo CoordinatorTasks (ví dụ: “Chuẩn bị briefing cho volunteer”).
2. Coordinator chuyển thành lịch: tạo CoordinatorSchedules tương ứng (thời gian họp, ca giám sát…).
3. Theo dõi tiến độ:
   - Task: update CoordinatorTasks.Status.
   - Lịch: check-in/out, đánh dấu hoàn thành schedule.
4. Kết nối với VolunteerSchedules/OnSiteTasks:
   - Từ task “Phân ca volunteer” → tạo VolunteerSchedules.
   - Từ task “Setup onsite” → tạo OnSiteTasks và assign cho volunteer.
5. Ngày diễn ra: điểm danh (check‑in) theo ca; cập nhật giờ làm thực tế (có thể đồng bộ sang `EventRegistrations`).

---

## 5) Flow E — On‑site Tasks & Supervision

**Mục tiêu:** Giao task đúng người, giám sát tiến độ, chốt kết quả.

### 5.1 Entities

- `OnSiteTasks`: việc cụ thể trong event (set‑up, đón tiếp, kỹ thuật, an toàn…). Fields: `TaskStatusId (FK→TaskStatus)`, `Priority`, `StartAt`, `EndAt`, `Location`, `CompletionCriteria`, `CompletedAt`, `VerifiedBy`.
- `TaskAssignments`: mapping Task ↔ Volunteer. Fields: `Status (text)`, `VolunteerId`, `Notes`.

### 5.2 Status

- **TaskStatus (master):** `Not Started → In Progress → Completed` _(or `On Hold/Cancelled`)_
- **TaskAssignments.Status (text):** `Assigned → Accepted → In Progress → Completed` _(or `Declined/Cancelled`)_

### 5.3 Steps

1. Coordinator tạo **OnSiteTasks** (đặt `Priority` & tiêu chí `CompletionCriteria`).
2. Giao việc qua **TaskAssignments** (có thể yêu cầu volunteer **Accept**).
3. Giám sát on‑site, cập nhật TaskStatus theo tiến độ.
4. Task xong ⇒ `Completed`, điền `CompletedAt` & (nếu có) `VerifiedBy`.

---

## 6) Flow F — Reporting → Gate to **Event Completed** (using `Reports`)

**Mục tiêu:** Dùng bảng `Reports` làm “bằng chứng” và checklist để organization đóng Event.

### 6.1 Entities

- `Reports`: `ReportType`, `Content(JSON)`, `CreatedBy`, `GeneratedDate`

### 6.2 ReportType & JSON

- **ReportType**: `EventCompletion`
- **Content(JSON) — gợi ý cấu trúc:**

```json
{
  "eventId": 123,
  "summary": "Completion checklist & outcomes",
  "totals": {
    "tasksCompleted": 18,
    "tasksCancelled": 1,
    "volunteersCheckedIn": 32,
    "volunteerHours": 112.5
  },
  "artifacts": {
    "taskClosureSnapshot": true,
    "attendanceExport": "/exports/attendance_event_123.csv"
  },
  "approvals": {
    "coordinatorVerified": true,
    "organizationApproved": false
  }
}
```

### 6.3 Completion Rule (service layer)

1. **Tasks**: toàn bộ `OnSiteTasks` ∈ {`Completed`, `Cancelled` có lý do}.
2. **Schedules**: không còn `VolunteerSchedules` ở `Scheduled/Checked In` (đã `Completed`/`Cancelled`/`No Show`).
3. **Report**: tồn tại `Reports.ReportType='EventCompletion'` cho `eventId`, với `approvals.coordinatorVerified=true`.
4. **Approve**: Organization duyệt completion report (`organizationApproved=true`) ⇒ set `Events.StatusId → Completed`.

> Triển khai: Coordinator bấm **Submit Completion Report** (tạo record `Reports`); Organization bấm **Approve & Complete Event**.

---

## 7) Flow G — Feedback (Moderation)

**Mục tiêu:** Thu nhận feedback có kiểm duyệt, an toàn cho public feed; feedback không khoá “Completed”.

### 7.1 Entities

- `Feedback`: `FeedbackId`, `EventId`, `UserId`, `CategoryId`, `Rating`, `Status`, `IsPublic`, `IsVerified`, `ResponseContent`, `RespondedBy`, `RespondedAt`
- `FeedbackCategories`: master

### 7.2 Status lifecycle (text)

- `Pending` → chờ duyệt
- `Approved` → nội dung hợp lệ (option: `IsPublic=1`, `IsVerified`)
- `Rejected` → vi phạm/nội dung không phù hợp (ghi reason ở `ResponseContent`)
- `Removed` → gỡ khỏi public (hậu kiểm), giữ record để audit
- (Optional) `Flagged` → user report nội dung

### 7.3 Moderation

- **Admin/Moderator**:
  - Approve: `Status='Approved'`, set `IsPublic=1`, `IsVerified=0/1`
  - Reject: `Status='Rejected'`, thêm lý do ở `ResponseContent`
  - Remove: `IsPublic=0` hoặc `Status='Removed'`
  - Official reply: `ResponseContent` + `RespondedBy/At`
- **Visibility**: Public feed = `Approved AND IsPublic=1`
- **Relation to completion**: Feedback **không** là điều kiện hoàn tất event; có thể mở **post‑event survey** sau `Completed`.

---

## 8) Flow H — Certificates (Optional)

**Mục tiêu:** Cấp chứng nhận cho volunteer đủ điều kiện sau sự kiện.

### 8.1 Entities

- `Certificates`: `UserId`, `EventId`, `Status (text)`, `IssuedAt`, `EvidenceUrl`, `Notes`

### 8.2 Rule gợi ý

- Chỉ phát khi Event `Completed`.
- Volunteer có `EventRegistrations.Status ∈ {Attended, Completed}` và `ActualHours ≥ threshold`.
- `Certificates.Status`: `Pending → Issued` _(or `Revoked`)_.

---

## 9) Service‑Layer Rules (Checklist)

- **Before Publish Event**: Validate trường bắt buộc, quota, thời gian đăng ký hợp lệ.
- **During Registration**: Chặn đăng ký ngoài khung ngày; kiểm tra `MaxVolunteers`.
- **Before Start (Ongoing)**: Bảo đảm có ít nhất một Coordinator & plan tối thiểu.
- **Complete Event (Gate)**: Áp dụng 4 điều kiện ở **6.3**.
- **Moderate Feedback**: Auto‑flag nếu `Rating ≤ 2`, `IsAnonymous=1` ⇒ `Verified=0`.
- **Close Support Request**: Có báo cáo đạt mục tiêu thực tế (không ràng buộc cứng, nhưng nên có liên hệ tới Event/Reports).

---

## 10) Data Model Notes

- **Master tables**: `EventStatus`, `RegistrationStatus`, `TaskStatus`, `FeedbackCategories`
- **Text status/priority**: `SupportRequests.Status`, `CoordinatorSchedules.Status`, `VolunteerSchedules.Status`, `TaskAssignments.Status`, `Feedback.Status`, `Certificates.Status`, `Priority` dùng ở nhiều bảng (`High/Medium/Low`).
- **Reports**: không FK trực tiếp tới `Events`; chứa `eventId` trong JSON -> filter/parse ở service.
- **Registration window**: dùng `Events.RegistrationStartDate/EndDate`.
- **Audit**: dùng `...Comments` / `Notes` / `ResponseContent` và timestamps.

---

## 11) Example Timelines (tóm tắt)

- **SR → Event**
  - SR `Submitted` → `Under Review` → `Approved` → Event được tạo → SR `In Progress` → Xong sự kiện → `Closed`.
- **Event công khai**
  - `Pending Approval` → `Published` (mở đăng ký) → `Ongoing` → (Report+Approve) → `Completed`.
- **Volunteer**
  - Register `Pending` → `Approved` → Lên ca `Scheduled` → Check‑in → Task `In Progress` → Hoàn tất → Hours chốt.
- **Report & Complete**
  - Coordinator submit **EventCompletion** (Reports) → Organization approve → Event `Completed`.
- **Feedback**
  - User gửi `Pending` → Moderator `Approved` (`IsPublic=1`) hoặc `Rejected/Removed`.

---

## 12) Operational Tips

- **UI gợi ý**: checklist rõ ràng cho từng cổng (Publish/Start/Complete).
- **Exports**: attendance CSV, task closure snapshot lưu đường dẫn trong `Reports.Content.artifacts`.
- **Idempotency**: thao tác “Approve/Complete” nên an toàn nếu ấn lại (no‑op khi đã đạt trạng thái đích).
- **Permissions**: phân quyền theo vai trò (Admin, OrgOwner, Coordinator, Volunteer, User).
