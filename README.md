# IVAN - Volunteer Management System

Hệ thống thông minh hỗ trợ điều phối và quản lý hoạt động tình nguyện, tích hợp các mô hình ngôn ngữ lớn (AI) để tối ưu hóa vận hành.

## 🌟 Tính năng cốt lõi
- **AI Integration:** Tích hợp đa mô hình (Gemini, OpenRouter) hỗ trợ xử lý dữ liệu thông minh.
- **Volunteer Management:** Quản lý sự kiện, tình nguyện viên và phân quyền chi tiết.
- **Workflow Automation:** Hỗ trợ quy trình vận hành nhanh chóng.

## 🏗 Công nghệ & Kiến trúc
- **Backend:** ASP.NET Core API, Entity Framework Core.
- **Frontend:** React.js/Next.js, TypeScript, Tailwind CSS & shadcn/ui
- **Database:** SQL Server (Database First).
- **Architecture:** Layered Architecture.

## 🛠 Hướng dẫn cài đặt (Installation)
Dự án sử dụng cách tiếp cận **Database First**. Vui lòng thực hiện tuần tự các bước sau để khởi tạo database:

I.Backend Installation
1. **Chuẩn bị:** Cài đặt SQL Server Management Studio (SSMS).
2. **Khởi tạo Database:** Chạy các file script trong thư mục `/Database` theo thứ tự:
   - Bước 1: `ivan_database_schema.sql` (Tạo cấu trúc database)
   - Bước 2: `ivan_database_data_ai.sql` (Nạp cấu hình AI)
   - Bước 3: `IVAN_Demo_Data.sql` (Nạp dữ liệu mẫu)
   - Bước 4: `test_custom_instruction.sql` (Nạp câu lệnh test AI - Tùy chọn)
3. **Cấu hình:** Mở `appsettings.json`, cập nhật `ConnectionStrings:MyCnn` khớp với SQL Server của bạn.
4. **Chạy dự án:** ```bash
   dotnet run

II.Frontend Installation
1. **Thiết lập môi trường** Node.js 
2. **Cài đặt thư viện:** `npm install`
3. **Chạy dev mode:** `npm run dev`
