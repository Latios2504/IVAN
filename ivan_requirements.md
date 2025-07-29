# IVAN

## FE-01

### Authentication

**Use Cases**: Login, Register, Logout, Authorization, Change Password, Forgot Password  
**Description**: Xác thực và quản lý truy cập người dùng vào hệ thống  
**Trigger**: Người dùng đăng nhập, đăng xuất, quên mật khẩu, hoặc cập nhật mật khẩu  
**Flow**:

1. Người dùng nhập thông tin đăng nhập (email/mật khẩu).
2. Hệ thống xác thực.
3. Thành công: truy cập dashboard; Thất bại: thông báo lỗi.
4. Quên mật khẩu: gửi mã code đặt lại qua email.
5. Nhập code, đổi mật khẩu: nhập mật khẩu mới, xác nhận.
6. Đăng xuất: kết thúc phiên.  
   **Actor**: Guest (Forgot Password, Register), Volunteer, Organization, Partner, Admin (Login, Logout, Change Password, Authorization)

**Note**: Volunteer Coordinator tài khoản KHÔNG được tạo qua đăng ký. Chỉ được Admin tạo theo yêu cầu của Organization.

## FE-02

### Manage Volunteer Profile

**Use Cases**: View Volunteer Profile, Update Volunteer Profile, Add Volunteer Profile, List Volunteer Profiles  
**Description**: Quản lý thông tin cá nhân của tình nguyện viên, bao gồm xếp hạng dựa trên hoạt động, thâm niên, và đóng góp  
**Trigger**: Tình nguyện viên xem, cập nhật, thêm hồ sơ, hoặc admin liệt kê danh sách  
**Flow**:

1. Guest đăng ký tài khoản Volunteer.
2. Volunteer nhập thông tin (tên, email, kỹ năng).
3. Hệ thống lưu hồ sơ.
4. Volunteer xem/cập nhật hồ sơ, bao gồm xếp hạng.
5. Admin xem danh sách tất cả hồ sơ Volunteer.  
   **Actor**: Volunteer (View, Update Volunteer Profile), Admin (List Volunteer Profiles)

## FE-03

### Manage Organization Profile

**Use Cases**: View Organization Profile, Update Organization Profile, Add Organization Profile, List Organization Profiles  
**Description**: Quản lý thông tin tổ chức để hỗ trợ hợp tác và sự kiện  
**Trigger**: Tổ chức thêm, cập nhật thông tin, hoặc admin xem danh sách  
**Flow**:

1. Guest đăng ký tài khoản Organization.
2. Organization nhập thông tin (tên, địa chỉ, mô tả).
3. Hệ thống lưu hồ sơ.
4. Organization xem/cập nhật hồ sơ.
5. Admin xem danh sách tất cả hồ sơ Organization.  
   **Actor**: Organization (View, Update Organization Profile), Admin (List Organization Profiles)

## FE-04

### Manage Partner Profile

**Use Cases**: View Partner Profile, Update Partner Profile, Add Partner Profile, List Partner Profiles  
**Description**: Quản lý thông tin đối tác để hỗ trợ hợp tác và tài trợ  
**Trigger**: Thêm đối tác mới, cập nhật thông tin, hoặc xem danh sách  
**Flow**:

1. Guest đăng ký tài khoản Partner.
2. Partner nhập thông tin (tên, lĩnh vực, liên hệ).
3. Hệ thống lưu hồ sơ.
4. Partner xem/cập nhật hồ sơ.
5. Admin xem danh sách tất cả hồ sơ Partner.  
   **Actor**: Partner (View, Update Partner Profile), Admin (List Partner Profiles)

## FE-05

### Manage Event

**Use Cases**: List Event, View Event, Add Event, Update Event  
**Description**: Lên kế hoạch, tổ chức, và cập nhật thông tin sự kiện  
**Trigger**: Tạo sự kiện mới, xem chi tiết, hoặc cập nhật thông tin sự kiện  
**Flow**:

1. Organization đăng nhập, chọn "Tạo sự kiện".
2. Nhập thông tin (tên, ngày, địa điểm).
3. Hệ thống lưu sự kiện.
4. Người dùng xem danh sách sự kiện hoặc chi tiết sự kiện.
5. Organization cập nhật thông tin nếu cần.  
   **Actor**: Organization (Add, Update Event), All User (List, View Event)

## FE-06

### Manage Volunteer Registration

**Use Cases**: List Registration, View Registration, Add Registration, Update Registration, Approve Registration, Reject Registration  
**Description**: Quản lý đăng ký tham gia sự kiện của tình nguyện viên  
**Trigger**: Tình nguyện viên đăng ký, admin duyệt hoặc từ chối đăng ký, tình nguyện viên hủy đăng ký  
**Flow**:

1. Volunteer xem sự kiện, chọn "Đăng ký".
2. Nhập thông tin đăng ký.
3. Hệ thống gửi đăng ký đến Volunteer Coordinator.
4. Volunteer Coordinator xem danh sách đăng ký, duyệt/từ chối.
5. Volunteer nhận thông báo kết quả.
6. Volunteer có thể hủy đăng ký trong thời gian mở đơn đăng ký sự kiện  
   **Actor**: Volunteer (Add, Update Registration), Volunteer Coordinator (List, View, Approve, Reject Registration)

## FE-07

### Manage Volunteer Schedule

**Use Cases**: List Volunteer Schedule, View Volunteer Schedule, Add Volunteer Schedule, Update Volunteer Schedule  
**Description**: Quản lý lịch trình cá nhân của tình nguyện viên  
**Trigger**: Lên lịch mới, điều chỉnh lịch, hoặc xem lịch trình  
**Flow**:

1. Volunteer Coordinator thêm lịch (thời gian, nhiệm vụ).
2. Hệ thống lưu lịch.
3. Volunteer xem lịch cá nhân.
4. Volunteer Coordinator cập nhật lịch nếu cần.  
   **Actor**: Volunteer(View Volunteer Schedule), Volunteer Coordinator (Add, Update, List, View Volunteer Schedule)

## FE-08

### Manage Volunteer Coordinator Schedule

**Use Cases**: List Volunteer Coordinator Schedule, View Volunteer Coordinator Schedule, Add Volunteer Coordinator Schedule, Update Volunteer Coordinator Schedule  
**Description**: Quản lý lịch trình của điều phối viên tình nguyện  
**Trigger**: Phân công lịch, cập nhật lịch, hoặc xem lịch của điều phối viên  
**Flow**:

1. Organization thêm lịch cho Volunteer Coordinator (thời gian, event cho Volunteer Coordinator).
2. Hệ thống lưu lịch.
3. Volunteer Coordinator xem lịch cá nhân.
4. Organization cập nhật lịch nếu cần.  
   **Actor**: Volunteer Coordinator(View Volunteer Coordinator Schedule), Organization (Add, Update, List, View Volunteer Coordinator Schedule)

## FE-09

### Manage On-Site Task

**Use Cases**: List On-Site Task, View On-Site Task, Add On-Site Task, Update On-Site Task  
**Description**: Quản lý nhiệm vụ tại chỗ trong sự kiện  
**Trigger**: Phân công, cập nhật nhiệm vụ tại sự kiện  
**Flow**:

1. Volunteer Coordinator thêm nhiệm vụ (mô tả, thời gian, địa điểm).
2. Hệ thống lưu nhiệm vụ.
3. Volunteer Coordinator xem danh sách nhiệm vụ.
4. Cập nhật trạng thái nhiệm vụ khi thực hiện.
5. Volunteer được xem danh sách nhiệm vụ mà mình cần thực hiện trong event.  
   **Actor**: Volunteer(View On-Site Task), Volunteer Coordinator (Add, Update, List, View On-Site Task)

## FE-10

### Manage Volunteer Coordinator Task

**Use Cases**: List Coordinator Task, View Coordinator Task, Add Coordinator Task, Update Coordinator Task, Export Tasks to Excel  
**Description**: Quản lý nhiệm vụ của tổng đốc tình nguyện viên trong sự kiện, bao gồm xuất danh sách nhiệm vụ ra Excel  
**Trigger**: Phân công, cập nhật nhiệm vụ cho tổng đốc, xuất danh sách ra Excel  
**Flow**:

1. Organization thêm nhiệm vụ cho Volunteer Coordinator (quản lý Volunteer, giám sát).
2. Hệ thống lưu nhiệm vụ.
3. Volunteer Coordinator xem danh sách nhiệm vụ.
4. Cập nhật trạng thái nhiệm vụ.
5. Coordinator/Organization xuất danh sách nhiệm vụ ra Excel.  
   **Actor**: Organization, Volunteer Coordinator (Add, Update, List, View Coordinator Task, Export Tasks to Excel)

## FE-11

### Manage Feedback

**Use Cases**: List Feedback, View Feedback, Add Feedback, Update Feedback  
**Description**: Thu thập và quản lý phản hồi từ các bên liên quan bao gồm Organization, Event.  
**Trigger**: Người dùng gửi phản hồi sau sự kiện, admin xem hoặc chỉnh sửa  
**Flow**:

1. Volunteer/Partner gửi phản hồi sau sự kiện cho tổ chức 1 lần duy nhất và có thể update feedback đó.
2. Hệ thống lưu phản hồi.
3. Organization/Admin xem danh sách phản hồi.
4. Admin cập nhật phản hồi nếu cần (ví dụ: loại bỏ spam ảo).  
   **Actor**: Volunteer, Partner (Add Feedback, Update Feedback), Organization(List, View), Admin (List, View, Update Feedback)

## FE-12

### Manage Certificate

**Use Cases**: List Certificate, View Certificate, Add Certificate, Download Certificate  
**Description**: Cấp và quản lý chứng chỉ công nhận đóng góp của tình nguyện viên  
**Trigger**: Phát hành chứng chỉ, tình nguyện viên tải về  
**Flow**:

1. Organization tạo chứng chỉ cho Volunteer sau sự kiện.
2. Hệ thống lưu chứng chỉ.
3. Volunteer xem danh sách chứng chỉ.
4. Volunteer tải chứng chỉ về.  
   **Actor**: Organization (Add Certificate), Volunteer (List, View, Download Certificate)

## FE-13

### Manage Support Request

**Use Cases**: List Support Request, View Support Request, Add Support Request, Update Support Request  
**Description**: Xử lý các yêu cầu hỗ trợ từ cộng đồng  
**Trigger**: Cộng đồng gửi yêu cầu, admin cập nhật trạng thái  
**Flow**:

1. Người dùng gửi yêu cầu hỗ trợ qua hệ thống.
2. Hệ thống lưu yêu cầu.
3. Admin xem danh sách yêu cầu.
4. Cập nhật trạng thái (đang xử lý, hoàn thành).
5. Organization có thể danh sách các yêu cầu hỗ trợ.  
   **Actor**: All User (Add Support Request), Organization(View Support Request), Admin (List, View, Update Support Request)

## FE-14

### Manage Partner Collaboration

**Use Cases**: List Collaboration, View Collaboration, Add Collaboration, Add Donation Utilization Report, View Donation Utilization Report  
**Description**: Quản lý hợp tác với đối tác để hỗ trợ sự kiện và tài trợ, bao gồm xem báo cáo sử dụng quỹ từ thiện  
**Trigger**: Thiết lập, quản lý quan hệ đối tác, xem báo cáo sử dụng quỹ  
**Flow**:

1. Organization/Partner đề xuất hợp tác.
2. Nhập chi tiết hợp tác (mục tiêu, điều khoản).
3. Hệ thống lưu hợp tác.
4. Organization/Partner xem danh sách hợp tác.
5. Organization tạo báo cáo sử dụng quỹ từ thiện.
6. Partner xem báo cáo sử dụng quỹ từ thiện liên quan đến hợp tác của họ.  
   **Actor**: Organization, Partner (Add, List, View Collaboration, View Donation Utilization Report)

## FE-15

### Manage Notification

**Use Cases**: List Notification, View Notification, Send Notification, Configure Notification  
**Description**: Gửi và quản lý thông báo qua email hoặc notification trên web  
**Trigger**: Gửi thông báo, thiết lập cách nhận thông báo  
**Flow**:

1. Organization/Admin/Volunteer Coordinator tạo thông báo (sự kiện mới, cập nhật).
2. Chọn phương thức gửi (email, notification trên web).
3. Hệ thống gửi thông báo.
4. Người dùng xem danh sách thông báo.  
   **Actor**: Organization, Admin, Volunteer Coordinator (Send, Configure Notification), Volunteer, Partner (List, View Notification)

## FE-16

### Manage Chatbot Interaction

**Use Cases**: View Chatbot Interaction, Add Chatbot Interaction  
**Description**: Quản lý tương tác với chatbot AI để hỗ trợ người dùng  
**Trigger**: Người dùng tương tác với chatbot  
**Flow**:

1. Người dùng gửi câu hỏi qua chatbot.
2. Chatbot trả lời.  
   **Actor**: All User (Add Chatbot Interaction)

## FE-17

### Manage Event Report

**Use Cases**: List Event Report, View Event Report, Add Event Report, Download Event Report  
**Description**: Tạo và quản lý báo cáo hiệu quả sự kiện, bao gồm báo cáo hàng tháng  
**Trigger**: Tổng hợp báo cáo sau sự kiện, tải báo cáo  
**Flow**:

1. Volunteer Coordinator tạo báo cáo sau sự kiện (kết quả, số liệu).
2. Hệ thống lưu báo cáo.
3. Organization/Admin xem danh sách báo cáo.
4. Tải báo cáo về.  
   **Actor**: Volunteer Coordinator (Add Event Report), Organization, Admin (List, View, Download Event Report)

## FE-18

### Manage Organization Report

**Use Cases**: List Organization Report, View Organization Report, Add Organization Report, Download Organization Report  
**Description**: Quản lý báo cáo về hoạt động của tổ chức, bao gồm báo cáo tài chính và thống kê quỹ  
**Trigger**: Tạo báo cáo tổ chức, tải báo cáo  
**Flow**:

1. Organization tạo báo cáo (hoạt động, sự kiện tổ chức, tài chính).
2. Hệ thống lưu báo cáo.
3. Organization/Admin xem danh sách báo cáo.
4. Tải báo cáo về.  
   **Actor**: Organization (Add Organization Report), Organization, Admin (List, View, Download Organization Report)

## FE-19

### Manage System Report

**Use Cases**: List System Report, View System Report, Download System Report  
**Description**: Theo dõi và quản lý báo cáo tổng quan về hệ thống, bao gồm báo cáo tài chính như doanh thu quảng cáo hàng tháng  
**Trigger**: Tạo, xem, hoặc tải báo cáo hệ thống  
**Flow**:

1. Hệ thống tạo báo cáo hệ thống (hiệu suất, người dùng, tài chính).
2. Hệ thống lưu báo cáo.
3. Admin xem danh sách báo cáo.
4. Tải báo cáo về.  
   **Actor**: Admin (Add, List, View, Download System Report)

## FE-20

### Manage User Account và Volunteer Coordinator Creation

**Use Cases**: List User Account, View User Account, Update User Account, Create Volunteer Coordinator Account  
**Description**: Quản lý tài khoản của tất cả vai trò trong hệ thống và tạo tài khoản Volunteer Coordinator theo yêu cầu Organization  
**Trigger**: Admin quản lý, cập nhật, hoặc vô hiệu hóa tài khoản; Organization yêu cầu tạo Coordinator  
**Flow**:

1. Admin xem danh sách tài khoản.
2. Chọn tài khoản để xem chi tiết.
3. Cập nhật thông tin (vai trò, trạng thái).
4. Organization gửi yêu cầu tạo Coordinator cho Admin.
5. Admin tạo tài khoản Coordinator và gắn với Organization.
6. Hệ thống lưu thay đổi.  
   **Actor**: Admin (List, View, Update User Account, Create Volunteer Coordinator Account), Organization (Request Volunteer Coordinator Creation)

## FE-21

### Manage Content Moderation

**Use Cases**: List Content for Moderation, View Content for Moderation, Approve Content, Reject Content  
**Description**: Kiểm duyệt nội dung để đảm bảo phù hợp với quy định  
**Trigger**: Nội dung mới được gửi, cần duyệt hoặc từ chối  
**Flow**:

1. Organization gửi nội dung (sự kiện).
2. Hệ thống xếp hàng kiểm duyệt.
3. Admin xem danh sách nội dung.
4. Duyệt/từ chối nội dung, thông báo kết quả.  
   **Actor**: Admin (List, View, Approve, Reject Content for Moderation)

## FE-22

### Manage Public Content

**Use Cases**: View Public Content, Add Public Content, Update Public Content  
**Description**: Quản lý nội dung công khai để truyền thông và thu hút cộng đồng  
**Trigger**: Cập nhật, thêm nội dung công khai  
**Flow**:

1. Admin thêm nội dung công khai (tin tức, sự kiện).
2. Hệ thống lưu nội dung.
3. Người dùng xem nội dung công khai.
4. Admin cập nhật nội dung nếu cần.  
   **Actor**: Admin (Add, Update Public Content), All User(View Public Content)
