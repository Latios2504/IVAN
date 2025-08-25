# Luồng Hoàn Chỉnh Sự Kiện từ Flow B đến Flow F

## Tổng Quan
Tài liệu này mô tả luồng hoàn chỉnh của một sự kiện từ lúc khởi tạo đến lúc hoàn thành, bao gồm các controller được sử dụng trong từng bước.

## Flow B: Event Creation & Approval

### B1. Tạo Sự Kiện (Event Creation)
**Controller:** `EventsController`
- **Endpoint:** `POST /api/events`
- **Role:** Organization
- **Chức năng:** Tạo sự kiện mới với trạng thái "Pending"
- **Input:** Thông tin sự kiện (tên, mô tả, ngày, địa điểm, số lượng tình nguyện viên tối đa)

### B2. Phê Duyệt Sự Kiện (Event Approval)
**Controller:** `EventsController`
- **Endpoint:** `POST /api/events/{eventId}/approve`
- **Role:** Admin
- **Chức năng:** Phê duyệt sự kiện, chuyển trạng thái từ "Pending" sang "Published"

### B3. Từ Chối Sự Kiện (Event Rejection)
**Controller:** `EventsController`
- **Endpoint:** `POST /api/events/{eventId}/reject`
- **Role:** Admin
- **Chức năng:** Từ chối sự kiện với lý do cụ thể

## Flow C: Event Registration Management

### C1. Đăng Ký Tham Gia (Volunteer Registration)
**Controller:** `EventRegistrationsController`
- **Endpoint:** `POST /api/events/{eventId}/registrations`
- **Role:** Volunteer
- **Chức năng:** Tình nguyện viên đăng ký tham gia sự kiện
- **Validation:** Kiểm tra thời gian đăng ký, số lượng tối đa

### C2. Quản Lý Đăng Ký (Registration Management)
**Controller:** `EventRegistrationsController`
- **Endpoint:** `GET /api/events/{eventId}/registrations`
- **Role:** Organization, VolunteerCoordinator
- **Chức năng:** Xem danh sách đăng ký của sự kiện

### C3. Cập Nhật Đăng Ký (Update Registration)
**Controller:** `EventRegistrationsController`
- **Endpoint:** `PUT /api/events/{eventId}/registrations/{registrationId}`
- **Role:** Organization, VolunteerCoordinator
- **Chức năng:** Cập nhật thông tin đăng ký

### C4. Hủy Đăng Ký (Cancel Registration)
**Controller:** `EventRegistrationsController`
- **Endpoint:** `DELETE /api/events/{eventId}/registrations/{registrationId}`
- **Role:** Volunteer
- **Chức năng:** Tình nguyện viên hủy đăng ký tham gia

## Flow D: Schedule & Task Management

### D1. Tạo Lịch Trình Coordinator (Coordinator Schedule Creation)
**Controller:** `CoordinatorScheduleController`
- **Endpoint:** `POST /api/coordinatorschedule`
- **Role:** Organization
- **Chức năng:** Tạo lịch trình cho volunteer coordinator

### D2. Quản Lý Lịch Trình Cá Nhân (Personal Schedule Management)
**Controller:** `CoordinatorScheduleController`
- **Endpoint:** `GET /api/coordinatorschedule/personal`
- **Role:** VolunteerCoordinator
- **Chức năng:** Xem lịch trình cá nhân của coordinator

### D3. Tạo Lịch Trình Tình Nguyện Viên (Volunteer Schedule Creation)
**Controller:** `VolunteerScheduleController`
- **Endpoint:** `POST /api/volunteerschedule/coordinator`
- **Role:** VolunteerCoordinator
- **Chức năng:** Tạo lịch trình cho tình nguyện viên

### D4. Quản Lý Task Coordinator (Coordinator Task Management)
**Controller:** `CoordinatorTaskController`
- **Endpoint:** `GET /api/coordinatortask`
- **Role:** Organization, VolunteerCoordinator
- **Chức năng:** Xem danh sách task của coordinator

### D5. Tạo Task Coordinator (Create Coordinator Task)
**Controller:** `CoordinatorTaskController`
- **Endpoint:** `POST /api/coordinatortask`
- **Role:** Organization
- **Chức năng:** Tạo task mới cho coordinator

### D6. Quản Lý Task Tại Chỗ (On-Site Task Management)
**Controller:** `OnSiteTaskController`
- **Endpoint:** `GET /api/onsitetask`
- **Role:** VolunteerCoordinator, Volunteer
- **Chức năng:** Xem danh sách task tại chỗ

### D7. Tạo Task Tại Chỗ (Create On-Site Task)
**Controller:** `OnSiteTaskController`
- **Endpoint:** `POST /api/onsitetask`
- **Role:** VolunteerCoordinator
- **Chức năng:** Tạo task tại chỗ cho tình nguyện viên

## Flow E: Event Execution & Status Updates

### E1. Cập Nhật Trạng Thái Sự Kiện (Event Status Update)
**Controller:** `EventsController`
- **Endpoint:** `PUT /api/events/{eventId}/status`
- **Role:** Organization
- **Chức năng:** Cập nhật trạng thái sự kiện
- **Trạng thái hợp lệ:** Published → Ongoing → Completed/Cancelled

### E2. Theo Dõi Tiến Độ Task (Task Progress Tracking)
**Controller:** `CoordinatorTaskController`, `OnSiteTaskController`
- **Chức năng:** Cập nhật trạng thái hoàn thành các task

### E3. Quản Lý Lịch Trình Trong Sự Kiện (In-Event Schedule Management)
**Controller:** `VolunteerScheduleController`, `CoordinatorScheduleController`
- **Chức năng:** Cập nhật và theo dõi lịch trình trong quá trình thực hiện sự kiện

## Flow F: Event Completion & Reporting

### F1. Hoàn Thành Sự Kiện (Event Completion)
**Controller:** `EventsController`
- **Endpoint:** `PUT /api/events/{eventId}/status`
- **Role:** Organization
- **Chức năng:** Đánh dấu sự kiện hoàn thành (status = "Completed")

### F2. Tạo Báo Cáo Sự Kiện (Event Report Creation)
**Controller:** `ReportController`
- **Endpoint:** `POST /api/report/addEventReport/{eventId}`
- **Role:** VolunteerCoordinator, Admin
- **Chức năng:** Tạo báo cáo tổng kết sự kiện

### F3. Tạo Báo Cáo Tổ Chức (Organization Report Creation)
**Controller:** `ReportController`
- **Endpoint:** `POST /api/report/addOrganizationReport/{orgId}`
- **Role:** Organization, Admin
- **Chức năng:** Tạo báo cáo cho tổ chức

### F4. Xem Báo Cáo (Report Viewing)
**Controller:** `ReportController`
- **Endpoint:** `GET /api/report/getReport/{id}`
- **Chức năng:** Xem chi tiết báo cáo đã tạo

### F5. Báo Cáo Hệ Thống (System Reports)
**Controller:** `ReportController`
- **Endpoint:** `GET /api/report/getSystemReport`
- **Role:** Admin
- **Chức năng:** Xem báo cáo tổng quan hệ thống

## Luồng Tổng Thể (Complete Flow)

```
1. Organization tạo sự kiện → EventsController (POST /api/events)
2. Admin phê duyệt sự kiện → EventsController (POST /api/events/{id}/approve)
3. Volunteers đăng ký tham gia → EventRegistrationsController (POST /api/events/{id}/registrations)
4. Organization tạo lịch trình cho Coordinators → CoordinatorScheduleController (POST /api/coordinatorschedule)
5. Coordinators tạo lịch trình cho Volunteers → VolunteerScheduleController (POST /api/volunteerschedule/coordinator)
6. Organization/Coordinators tạo tasks → CoordinatorTaskController, OnSiteTaskController
7. Organization bắt đầu sự kiện → EventsController (PUT /api/events/{id}/status - "Ongoing")
8. Thực hiện các tasks và cập nhật tiến độ
9. Organization hoàn thành sự kiện → EventsController (PUT /api/events/{id}/status - "Completed")
10. Tạo báo cáo tổng kết → ReportController (POST /api/report/addEventReport/{eventId})
```

## Các Role và Quyền Hạn

- **Admin:** Phê duyệt/từ chối sự kiện, xem báo cáo hệ thống
- **Organization:** Tạo sự kiện, quản lý đăng ký, tạo lịch trình coordinator, cập nhật trạng thái sự kiện
- **VolunteerCoordinator:** Tạo lịch trình volunteer, quản lý task tại chỗ, tạo báo cáo sự kiện
- **Volunteer:** Đăng ký/hủy đăng ký sự kiện, xem task được giao

## Kết Luận

Luồng hoàn chỉnh từ Flow B đến Flow F bao gồm 6 controller chính:
1. **EventsController** - Quản lý vòng đời sự kiện
2. **EventRegistrationsController** - Quản lý đăng ký tham gia
3. **CoordinatorScheduleController** - Quản lý lịch trình coordinator
4. **VolunteerScheduleController** - Quản lý lịch trình volunteer
5. **CoordinatorTaskController & OnSiteTaskController** - Quản lý tasks
6. **ReportController** - Quản lý báo cáo và tổng kết

Mỗi controller đảm nhận vai trò cụ thể trong việc đảm bảo sự kiện được thực hiện một cách có tổ chức và hiệu quả từ khâu khởi tạo đến hoàn thành.