-- Insert default user roles
INSERT INTO UserRoles (RoleName, Description) VALUES
(N'Volunteer', N'Tình nguyện viên'),
(N'Organization', N'Tổ chức từ thiện'),
(N'Partner', N'Đối tác'),
(N'Coordinator', N'Điều phối viên tình nguyện'),
(N'Admin', N'Quản trị viên hệ thống');

INSERT INTO Users (Email, PasswordHash, Salt, RoleId) VALUES
('user1@demo.com', 'hash1', 'salt1', 1),
('user2@demo.com', 'hash2', 'salt2', 2),
('user3@demo.com', 'hash3', 'salt3', 3),
('user4@demo.com', 'hash4', 'salt4', 2),
('user5@demo.com', 'hash5', 'salt5', 1),
('user6@demo.com', 'hash6', 'salt6', 3),
('user7@demo.com', 'hash7', 'salt7', 1),
('user8@demo.com', 'hash8', 'salt8', 1),
('user9@demo.com', 'hash9', 'salt9', 2),
('user10@demo.com', 'hash10', 'salt10', 2);

INSERT INTO Skills (SkillName, Category, Description) VALUES
(N'Tiếng Anh', N'Ngôn ngữ', N'Khả năng giao tiếp bằng tiếng Anh'),
(N'Lãnh đạo', N'Mềm', N'Kỹ năng quản lý nhóm và dẫn dắt'),
(N'Tin học văn phòng', N'Technical', N'Sử dụng Word, Excel, PowerPoint thành thạo'),
(N'Thiết kế đồ họa', N'Technical', N'Sử dụng Canva, Photoshop, AI cơ bản'),
(N'Tiếng Nhật', N'Ngôn ngữ', N'Giao tiếp cơ bản bằng tiếng Nhật'),
(N'Giao tiếp', N'Mềm', N'Kỹ năng truyền đạt thông tin hiệu quả'),
(N'Tổ chức sự kiện', N'Chuyên môn', N'Lên kế hoạch và vận hành sự kiện'),
(N'Quản lý thời gian', N'Mềm', N'Phân bổ thời gian hợp lý'),
(N'Nhiếp ảnh', N'Kỹ thuật', N'Chụp hình, chỉnh sửa ảnh'),
(N'Chăm sóc khách hàng', N'Mềm', N'Ứng xử, hỗ trợ khách hiệu quả');

INSERT INTO OrganizationTypes (TypeName, Description) VALUES
(N'Trường Đại học', N'Tổ chức giáo dục bậc đại học'),
(N'Trường THPT', N'Tổ chức giáo dục bậc phổ thông'),
(N'Doanh nghiệp', N'Tổ chức kinh doanh'),
(N'Tổ chức phi lợi nhuận', N'Phi lợi nhuận, phát triển cộng đồng'),
(N'Đoàn/Hội', N'Tổ chức Đoàn Thanh niên, Hội Sinh viên'),
(N'Câu lạc bộ', N'CLB nội bộ hoặc mở rộng'),
(N'Quỹ xã hội', N'Tổ chức gây quỹ thiện nguyện'),
(N'Chính phủ', N'Cơ quan quản lý nhà nước'),
(N'Tổ chức quốc tế', N'Đơn vị nước ngoài'),
(N'Trung tâm đào tạo', N'Đào tạo kỹ năng, học thuật');

INSERT INTO PartnerIndustries (IndustryName, Description) VALUES
(N'Giáo dục', N'Đào tạo, trường học'),
(N'Công nghệ', N'Phát triển phần mềm, IT'),
(N'Ngân hàng', N'Tài chính, ngân hàng'),
(N'Viễn thông', N'Internet, điện thoại'),
(N'Y tế', N'Bệnh viện, chăm sóc sức khỏe'),
(N'Bảo hiểm', N'Bảo hiểm nhân thọ, phi nhân thọ'),
(N'FMCG', N'Hàng tiêu dùng nhanh'),
(N'Logistics', N'Giao nhận, vận chuyển'),
(N'Xây dựng', N'Dịch vụ xây dựng, kiến trúc'),
(N'Nông nghiệp', N'Nông sản, thực phẩm');

INSERT INTO EventCategories (CategoryName, Description) VALUES
(N'Hoạt động xã hội', N'Tình nguyện, thiện nguyện cộng đồng'),
(N'Giáo dục', N'Dạy học, trao đổi kiến thức'),
(N'Bảo vệ môi trường', N'Hoạt động xanh, dọn rác, trồng cây'),
(N'Chăm sóc sức khỏe', N'Khám chữa bệnh, hiến máu'),
(N'Văn nghệ', N'Tổ chức biểu diễn, giao lưu'),
(N'Trại hè', N'Trại kỹ năng, trại hè thiếu nhi'),
(N'Kỹ năng mềm', N'Training kỹ năng sống'),
(N'Tư vấn hướng nghiệp', N'Hướng nghiệp, phát triển bản thân'),
(N'Thể thao', N'Thể thao, rèn luyện sức khỏe'),
(N'Công nghệ', N'Cuộc thi lập trình, hackathon');

INSERT INTO EventStatus (StatusName, Description, Color) VALUES
(N'Pending Approval', N'Chờ admin duyệt', '#00b894'),
(N'Published', N'Đã duyệt, hiển thị công khai', '#4287f5'),
(N'Ongoing', N'Sự kiện đang diễn ra', '#2ecc71'),
(N'Completed', N'Sự kiện hoàn tất', '#888888'),
(N'Cancelled', N'Sự kiện bị huỷ', '#ff3333');

INSERT INTO VolunteerProfiles (UserId, StudentId, University, Major, YearOfStudy, Motivation, Experience, Availability, VolunteerHours, IsVerified)
VALUES
(1, 'SV001', N'ĐH Bách Khoa', N'Cơ khí', 2, N'Muốn phát triển bản thân', N'Tham gia nhiều CLB', N'Cuối tuần', 30, 1),
(2, 'SV002', N'ĐH Ngoại Thương', N'Kinh tế', 3, N'Học hỏi kỹ năng mềm', N'Đã làm leader', N'Tối thứ 3,5', 45, 1),
(3, 'SV003', N'ĐH Sư Phạm', N'Tiếng Anh', 1, N'Giao lưu bạn bè', N'Trợ giảng lớp hè', N'Thứ 7, CN', 20, 0),
(4, 'SV004', N'ĐH Y Dược', N'Y đa khoa', 4, N'Giúp cộng đồng', N'Hiến máu nhiều lần', N'Linh động', 60, 1),
(5, 'SV005', N'ĐH Quốc Gia', N'Công nghệ TT', 2, N'Mở rộng networking', N'Làm dự án', N'Ngày thường', 15, 1),
(6, 'SV006', N'ĐH Kinh Tế', N'Tài chính', 3, N'Rèn luyện bản thân', N'Thành viên CLB', N'Tối thứ 6', 25, 0),
(7, 'SV007', N'ĐH Kiến Trúc', N'Xây dựng', 2, N'Yêu thích hoạt động xã hội', N'Tham gia tình nguyện hè', N'CN', 50, 1),
(8, 'SV008', N'ĐH Nông Lâm', N'Nông nghiệp', 1, N'Tìm hiểu ngành nghề', N'Hỗ trợ hội thảo', N'Sáng thứ 7', 10, 1),
(9, 'SV009', N'ĐH Mở', N'Quản trị KD', 4, N'Tích luỹ kinh nghiệm', N'Chưa có', N'Linh hoạt', 0, 0),
(10, 'SV010', N'ĐH Sân khấu Điện ảnh', N'Diễn viên', 2, N'Tham gia văn nghệ', N'Truyền thông, tổ chức', N'Chiều tối', 32, 1);

INSERT INTO VolunteerSkills (VolunteerId, SkillId, ProficiencyLevel, YearsOfExperience) VALUES
(1, 1, N'Tốt', 2),
(1, 3, N'Cơ bản', 1),
(2, 2, N'Tốt', 2),
(2, 6, N'Khá', 3),
(3, 1, N'Cơ bản', 1),
(3, 5, N'Cơ bản', 1),
(4, 4, N'Khá', 2),
(5, 3, N'Tốt', 3),
(6, 7, N'Cơ bản', 1),
(7, 8, N'Khá', 2),
(8, 1, N'Cơ bản', 1),
(8, 10, N'Khá', 2),
(9, 2, N'Cơ bản', 1),
(10, 6, N'Khá', 2);

INSERT INTO Organizations (UserId, OrganizationName, ShortName, TypeId, EstablishedYear, Website, Description, Mission, Vision, Address, Province, ContactPersonName, ContactEmail)
VALUES
(2, N'Đoàn trường Đại học Bách Khoa', N'BKĐ', 1, 1995, 'https://bk-univ.edu.vn', N'Tổ chức đoàn thanh niên trường ĐHBK', N'Phát triển sinh viên toàn diện', N'Dẫn đầu phong trào', N'1 Đại Cồ Việt', N'Hà Nội', N'Nguyễn Văn A', 'contact1@bk.edu.vn'),
(3, N'CLB Tình nguyện Xanh', N'CLB Xanh', 6, 2010, 'https://clbxanh.vn', N'CLB tập hợp các bạn trẻ yêu thiện nguyện', N'Lan tỏa yêu thương', N'Kết nối cộng đồng', N'23 Nguyễn Thị Minh Khai', N'TPHCM', N'Lê Thị B', 'contact2@xanh.vn'),
(4, N'Trường THPT Chuyên Lê Hồng Phong', N'LHP', 2, 1972, 'https://lhp.edu.vn', N'Trường THPT trọng điểm miền Nam', N'Đào tạo tài năng trẻ', N'Vươn xa quốc tế', N'235 Nguyễn Văn Cừ', N'TPHCM', N'Trần Quang C', 'contact3@lhp.edu.vn'),
(5, N'Công ty Công nghệ ABC', N'ABC Tech', 3, 2015, 'https://abctech.vn', N'Doanh nghiệp chuyên phần mềm', N'Tạo ra sản phẩm giá trị', N'Hội nhập quốc tế', N'12 Trần Duy Hưng', N'Hà Nội', N'Phạm Thị D', 'contact4@abctech.vn'),
(6, N'Quỹ Trái Tim Việt', N'TTV', 7, 2008, 'https://traitimviet.org', N'Quỹ hỗ trợ trẻ em nghèo', N'Mang nụ cười cho trẻ em', N'Không ai bị bỏ lại', N'45 Lý Thường Kiệt', N'Hà Nội', N'Ngô Đức E', 'contact5@ttv.org'),
(7, N'Câu lạc bộ Môi trường Xanh', N'CLB MTX', 6, 2012, 'https://mtxclub.org', N'Bảo vệ môi trường', N'Tạo môi trường xanh', N'Phát triển bền vững', N'9 Hoàng Diệu', N'Hải Phòng', N'Vũ Thị F', 'contact6@mtxclub.org'),
(8, N'Doanh nghiệp Xây dựng Việt Nhật', N'VNConst', 3, 2011, 'https://vnconst.vn', N'Nhà thầu xây dựng uy tín', N'Xây dựng bền vững', N'Mở rộng toàn quốc', N'88 Phan Đình Phùng', N'Hà Nội', N'Phan Minh G', 'contact7@vnconst.vn'),
(9, N'Trung tâm Đào tạo Kỹ năng IT', N'ITCenter', 10, 2018, 'https://itcenter.vn', N'Đào tạo CNTT thực chiến', N'Xây dựng nguồn nhân lực IT', N'Dẫn đầu đổi mới', N'177 Phạm Văn Đồng', N'TPHCM', N'Nguyễn Văn H', 'contact8@itcenter.vn'),
(10, N'CLB Âm nhạc Hòa Bình', N'CLB HB', 6, 2013, 'https://clbhb.vn', N'Cộng đồng yêu âm nhạc', N'Lan tỏa âm nhạc', N'Gắn kết thành viên', N'12 Nguyễn Đình Chiểu', N'TPHCM', N'Trần Hoài I', 'contact9@clbhb.vn'),
(1, N'Đoàn trường Đại học Mở', N'MO ĐH', 1, 1998, 'https://open-univ.edu.vn', N'Tổ chức đoàn thanh niên ĐH Mở', N'Phát triển sinh viên toàn diện', N'Tiên phong đổi mới', N'97 Võ Văn Tần', N'TPHCM', N'Lê Bảo J', 'contact10@open.edu.vn');

INSERT INTO Partners (UserId, CompanyName, IndustryId, Website, Description, Address, Province, ContactPersonName, ContactEmail)
VALUES
(1, N'Công ty TNHH Giáo Dục Bầu Trời', 1, 'https://skyedu.vn', N'Đơn vị tổ chức các lớp kỹ năng mềm', N'78 Trần Phú', N'Hà Nội', N'Lê Thanh K', 'contact@skyedu.vn'),
(2, N'Ngân hàng Quốc tế VIB', 3, 'https://vib.com.vn', N'Ngân hàng phát triển công nghệ số', N'50 Lê Duẩn', N'TPHCM', N'Nguyễn Văn L', 'contact@vib.com.vn'),
(3, N'Công ty Phần mềm BKSoft', 2, 'https://bksoft.vn', N'Phát triển phần mềm doanh nghiệp', N'35 Bạch Mai', N'Hà Nội', N'Phạm Thu M', 'contact@bksoft.vn'),
(4, N'Viettel Group', 4, 'https://viettel.vn', N'Tập đoàn viễn thông lớn nhất VN', N'1 Giang Văn Minh', N'Hà Nội', N'Trần Quốc N', 'contact@viettel.vn'),
(5, N'Bệnh viện Hạnh Phúc', 5, 'https://hanhphuchospital.vn', N'Bệnh viện tư nhân chuẩn quốc tế', N'22 Nguyễn Văn Linh', N'Bình Dương', N'Lê Mai O', 'contact@hanhphuchospital.vn'),
(6, N'Công ty Bảo hiểm PVI', 6, 'https://pvi.com.vn', N'Bảo hiểm phi nhân thọ uy tín', N'10 Trần Hưng Đạo', N'Hà Nội', N'Đặng Quang P', 'contact@pvi.com.vn'),
(7, N'Công ty TNHH Orion', 7, 'https://orion.vn', N'Hàng tiêu dùng nhanh', N'15 Nguyễn Chí Thanh', N'Hà Nội', N'Phạm Minh Q', 'contact@orion.vn'),
(8, N'Công ty Giao nhận GHTK', 8, 'https://ghtk.vn', N'Dịch vụ vận chuyển toàn quốc', N'9 Láng Hạ', N'Hà Nội', N'Trịnh Anh R', 'contact@ghtk.vn'),
(9, N'Công ty Xây dựng Hòa Bình', 9, 'https://hbcons.vn', N'Nhà thầu xây dựng top đầu', N'45 Pasteur', N'TPHCM', N'Lê Ngọc S', 'contact@hbcons.vn'),
(10, N'Công ty Nông sản Sạch', 10, 'https://nongsansach.vn', N'Cung cấp nông sản sạch', N'60 Võ Thị Sáu', N'Hà Nội', N'Nguyễn Văn T', 'contact@nongsansach.vn');

INSERT INTO VolunteerCoordinators (UserId, OrganizationId, EmployeeId, Position, Department, Responsibilities, HireDate, CreatedBy, RequestedBy)
VALUES
(1, 1, 'E001', N'Trưởng ban điều phối', N'Thanh niên', N'Điều phối hoạt động, quản lý tình nguyện viên', '2023-01-10', 2, 1),
(2, 2, 'E002', N'Phó ban điều phối', N'Thanh niên', N'Hỗ trợ sự kiện, tuyển tình nguyện viên', '2023-03-05', 2, 2),
(3, 3, 'E003', N'Trưởng ban chuyên môn', N'Chuyên môn', N'Đào tạo kỹ năng cho TNV', '2022-12-01', 3, 3),
(4, 4, 'E004', N'Điều phối viên sự kiện', N'Tổ chức sự kiện', N'Lên kế hoạch chương trình', '2022-10-15', 4, 4),
(5, 5, 'E005', N'Điều phối viên dự án', N'Phát triển dự án', N'Triển khai dự án xã hội', '2023-02-20', 5, 5),
(6, 6, 'E006', N'Trợ lý điều phối', N'Thanh niên', N'Hỗ trợ đăng ký, liên lạc', '2022-09-12', 6, 6),
(7, 7, 'E007', N'Điều phối nội dung', N'Truyền thông', N'Chịu trách nhiệm truyền thông sự kiện', '2022-11-20', 7, 7),
(8, 8, 'E008', N'Điều phối logistics', N'Logistics', N'Quản lý hậu cần sự kiện', '2023-01-15', 8, 8),
(9, 9, 'E009', N'Điều phối hợp tác', N'Hợp tác', N'Kết nối các đối tác, doanh nghiệp', '2023-04-01', 9, 9),
(10, 10, 'E010', N'Điều phối viên truyền thông', N'Truyền thông', N'Triển khai các chiến dịch truyền thông', '2022-08-28', 10, 10);

INSERT INTO Events (OrganizationId, EventName, CategoryId, StatusId, Description, StartDate, EndDate, Location, MaxVolunteers, CreatedBy)
VALUES
(1, N'Ngày hội hiến máu BK', 4, 1, N'Sự kiện hiến máu nhân đạo lớn nhất ĐHBK', '2025-07-20', '2025-07-20', N'Hội trường A1, ĐHBK', 200, 2),
(2, N'Dọn rác bờ kè Xanh', 3, 2, N'Tình nguyện viên thu gom rác bảo vệ môi trường', '2025-08-10', '2025-08-10', N'Bờ kè Nhiêu Lộc', 100, 3),
(3, N'Hội trại kỹ năng trẻ', 6, 1, N'Trại hè kỹ năng sống cho học sinh', '2025-07-25', '2025-07-28', N'Công viên Lê Văn Tám', 50, 4),
(4, N'Khám sức khỏe cộng đồng', 4, 2, N'Khám, phát thuốc miễn phí', '2025-07-30', '2025-08-01', N'Phường 5, Q.10', 80, 5),
(5, N'Trại hè bóng đá thiếu nhi', 9, 1, N'Trại hè thể thao phát triển kỹ năng', '2025-07-18', '2025-07-25', N'Sân bóng Thống Nhất', 60, 6),
(6, N'Giao lưu âm nhạc thiện nguyện', 5, 1, N'Chương trình ca nhạc gây quỹ', '2025-08-05', '2025-08-05', N'Nhà văn hóa Thanh Niên', 40, 7),
(7, N'Ngày hội định hướng nghề nghiệp', 8, 2, N'Tư vấn chọn ngành cho học sinh lớp 12', '2025-07-27', '2025-07-27', N'Trường Lê Hồng Phong', 150, 8),
(8, N'Workshop thiết kế CV', 2, 1, N'Hướng dẫn viết CV xin việc', '2025-08-12', '2025-08-12', N'Phòng 201, ĐH Mở', 70, 9),
(9, N'Cuộc thi lập trình AI', 10, 1, N'Hackathon về AI dành cho sinh viên', '2025-07-19', '2025-07-20', N'Lab CNTT, ĐH BK', 30, 10),
(10, N'Trồng cây xanh tại Củ Chi', 3, 1, N'Hoạt động trồng cây gây rừng', '2025-08-02', '2025-08-02', N'Xã Phú Mỹ Hưng, Củ Chi', 120, 1);

-- Insert Support Categories
INSERT INTO SupportCategories (CategoryName, Description, Priority, ExpectedResponseTime) VALUES
(N'Yêu cầu khẩn cấp', N'Cứu trợ khẩn cấp (tai nạn, bệnh nặng, thiếu nhu yếu phẩm tức thời)', N'High', 4),
(N'Hỗ trợ y tế cá nhân', N'Chi phí khám/chữa bệnh, vật tư y tế', N'High', 24),
(N'Hỗ trợ giáo dục', N'Học bổng, dụng cụ học tập, học phí', N'Medium', 72),
(N'Hỗ trợ thực phẩm', N'Gạo, nhu yếu phẩm cho hộ khó khăn', N'High', 24),
(N'Hỗ trợ nhà ở', N'Sửa chữa nhà, nhà tình thương', N'Medium', 168),
(N'Hỗ trợ thiên tai', N'Cứu trợ lũ lụt, hạn hán, sạt lở...', N'High', 12),
(N'Kêu gọi hiến máu', N'Đề nghị tổ chức/đồng hành hiến máu', N'Medium', 48),
(N'Tạo tài khoản cho điều phối viên', N'Yêu cầu tạo tài khoản cho điều phối viên', N'High', 3600, 1);
-- Insert User Profiles
INSERT INTO UserProfiles (UserId, FirstName, LastName, PhoneNumber, DateOfBirth, Gender, Address, District, Province, EmergencyContactName, EmergencyContactPhone) VALUES
(1, N'Nguyễn', N'Văn An', '0912345678', '2002-05-15', N'Nam', N'123 Trần Duy Hưng', N'Cầu Giấy', N'Hà Nội', N'Nguyễn Thị Bình', '0987654321'),
(2, N'Trần', N'Thị Bình', '0923456789', '1995-08-20', N'Nữ', N'456 Nguyễn Thái Học', N'Ba Đình', N'Hà Nội', N'Trần Văn Cường', '0976543210'),
(3, N'Lê', N'Công Danh', '0934567890', '1990-12-10', N'Nam', N'789 Lê Duẩn', N'Quận 1', N'TPHCM', N'Lê Thị Dung', '0965432109'),
(4, N'Phạm', N'Thị Duyên', '0945678901', '1988-03-25', N'Nữ', N'321 Hai Bà Trưng', N'Quận 3', N'TPHCM', N'Phạm Văn Em', '0954321098'),
(5, N'Hoàng', N'Minh Đức', '0956789012', '2001-11-08', N'Nam', N'654 Nguyễn Huệ', N'Quận 1', N'TPHCM', N'Hoàng Thị Phương', '0943210987'),
(6, N'Vũ', N'Thị Giang', '0967890123', '1993-07-14', N'Nữ', N'987 Lý Thường Kiệt', N'Hoàn Kiếm', N'Hà Nội', N'Vũ Văn Hải', '0932109876'),
(7, N'Đỗ', N'Văn Hiếu', '0978901234', '1996-04-30', N'Nam', N'246 Trường Chinh', N'Đống Đa', N'Hà Nội', N'Đỗ Thị Lan', '0921098765'),
(8, N'Ngô', N'Thị Hoa', '0989012345', '1999-09-18', N'Nữ', N'135 Pasteur', N'Quận 3', N'TPHCM', N'Ngô Văn Khánh', '0910987654'),
(9, N'Bùi', N'Văn Long', '0990123456', '1991-06-22', N'Nam', N'468 Võ Văn Tần', N'Quận 3', N'TPHCM', N'Bùi Thị Mai', '0909876543'),
(10, N'Lý', N'Thị Oanh', '0901234567', '1997-01-05', N'Nữ', N'579 Điện Biên Phủ', N'Bình Thạnh', N'TPHCM', N'Lý Văn Nam', '0898765432');

-- Insert Registration Status
INSERT INTO RegistrationStatus (StatusName, Description, Color) VALUES
(N'Pending', N'Đăng ký đang chờ được xem xét', '#ffc107'),
(N'Approved', N'Đăng ký đã được chấp nhận', '#28a745'),
(N'Rejected', N'Đăng ký không được chấp nhận', '#dc3545'),
(N'Cancelled', N'Người dùng đã hủy đăng ký', '#6c757d'),
(N'Attended', N'Đã tham gia sự kiện thành công', '#17a2b8'),
(N'No Show', N'Không tham gia sự kiện đã đăng ký', '#fd7e14'),
(N'Completed', N'Đã hoàn thành sự kiện và nhận chứng chỉ', '#20c997');

-- Insert Event Registrations
INSERT INTO EventRegistrations (EventId, VolunteerId, StatusId, ApplicationDate, MotivationLetter, AdditionalInfo) VALUES
(1, 1, 2, '2025-07-10', N'Tôi muốn đóng góp cho cộng đồng thông qua việc hiến máu cứu người', N'Đã từng hiến máu 3 lần'),
(1, 2, 2, '2025-07-11', N'Hiến máu là việc làm ý nghĩa, tôi muốn tham gia', N'Sức khỏe tốt, không có tiền sử bệnh'),
(2, 3, 1, '2025-07-15', N'Bảo vệ môi trường là trách nhiệm của mỗi người', N'Có kinh nghiệm tham gia các hoạt động môi trường'),
(2, 4, 2, '2025-07-16', N'Muốn góp phần làm sạch môi trường sống', N'Có thể tham gia cả ngày'),
(3, 5, 2, '2025-07-12', N'Yêu thích làm việc với trẻ em', N'Có kinh nghiệm dạy kèm'),
(4, 6, 1, '2025-07-18', N'Muốn hỗ trợ công tác y tế cộng đồng', N'Sinh viên y khoa năm 3'),
(5, 7, 2, '2025-07-08', N'Đam mê bóng đá và muốn truyền cảm hứng cho trẻ', N'Từng là cầu thủ nghiệp dư'),
(6, 8, 2, '2025-07-20', N'Yêu âm nhạc và muốn làm từ thiện', N'Biết chơi guitar và hát'),
(7, 9, 1, '2025-07-22', N'Muốn chia sẻ kinh nghiệm với học sinh', N'Đang học năm cuối đại học'),
(8, 10, 2, '2025-08-05', N'Muốn học hỏi kỹ năng viết CV', N'Chuẩn bị tốt nghiệp');

-- Insert Task Categories
INSERT INTO TaskCategories (CategoryName, Description, Color) VALUES
(N'Chuẩn bị', N'Các công việc chuẩn bị trước sự kiện', '#007bff'),
(N'Đón tiếp', N'Tiếp đón và hướng dẫn khách tham gia', '#28a745'),
(N'Hỗ trợ kỹ thuật', N'Hỗ trợ âm thanh, ánh sáng, thiết bị', '#ffc107'),
(N'Truyền thông', N'Chụp ảnh, quay phim, đăng bài', '#17a2b8'),
(N'Logistics', N'Vận chuyển, sắp xếp vật dụng', '#fd7e14'),
(N'An ninh', N'Bảo đảm an toàn và trật tự', '#dc3545'),
(N'Y tế', N'Hỗ trợ y tế, sơ cứu', '#e83e8c'),
(N'Dọn dẹp', N'Vệ sinh sau sự kiện', '#6f42c1'),
(N'Hướng dẫn', N'Hướng dẫn hoạt động, thuyết trình', '#20c997'),
(N'Khác', N'Các công việc khác', '#6c757d');

-- Insert Task Status
INSERT INTO TaskStatus (StatusName, Description, Color) VALUES
(N'Not Started', N'Nhiệm vụ chưa được thực hiện', '#6c757d'),
(N'In Progress', N'Nhiệm vụ đang được thực hiện', '#ffc107'),
(N'Completed', N'Nhiệm vụ đã hoàn thành', '#28a745'),
(N'On Hold', N'Nhiệm vụ bị tạm dừng', '#fd7e14'),
(N'Cancelled', N'Nhiệm vụ bị hủy bỏ', '#dc3545');

-- Insert On-Site Tasks
INSERT INTO OnSiteTasks (EventId, CategoryId, StatusId, TaskName, Description, StartTime, EndTime, EstimatedHours, Location, RequiredVolunteers, Priority, Difficulty, Instructions) VALUES
(1, 1, 1, N'Chuẩn bị bàn ghế', N'Sắp xếp bàn ghế cho khu vực tiếp đón', '2025-07-20 07:00:00', '2025-07-20 08:00:00', 1.0, N'Hội trường A1', 4, N'High', N'Dễ', N'Sắp xếp theo sơ đồ đã có'),
(1, 2, 1, N'Đón tiếp người hiến máu', N'Hướng dẫn và đón tiếp người đến hiến máu', '2025-07-20 08:00:00', '2025-07-20 17:00:00', 9.0, N'Lễ tân', 6, N'High', N'Medium', N'Thân thiện, nhiệt tình, hướng dẫn rõ ràng'),
(2, 1, 1, N'Chuẩn bị dụng cụ dọn rác', N'Phát găng tay, túi rác cho tình nguyện viên', '2025-08-10 06:30:00', '2025-08-10 07:30:00', 1.0, N'Điểm tập trung', 2, N'High', N'Dễ', N'Kiểm tra đủ số lượng dụng cụ'),
(2, 9, 1, N'Hướng dẫn dọn rác', N'Hướng dẫn cách phân loại và thu gom rác', '2025-08-10 07:30:00', '2025-08-10 11:30:00', 4.0, N'Khu vực bờ kè', 3, N'High', N'Medium', N'Chú ý an toàn, phân loại đúng cách'),
(3, 9, 1, N'Hướng dẫn hoạt động team building', N'Tổ chức các trò chơi nhóm cho trẻ', '2025-07-25 14:00:00', '2025-07-25 17:00:00', 3.0, N'Khu vực sân chơi', 5, N'Medium', N'Medium', N'Tương tác tích cực với trẻ em'),
(4, 7, 1, N'Hỗ trợ y tế', N'Đo huyết áp, kiểm tra sức khỏe cơ bản', '2025-07-30 08:00:00', '2025-07-30 16:00:00', 8.0, N'Khu khám bệnh', 4, N'High', N'Khó', N'Yêu cầu có kiến thức y tế cơ bản'),
(5, 9, 1, N'Huấn luyện bóng đá cơ bản', N'Dạy kỹ thuật cơ bản cho trẻ em', '2025-07-18 15:00:00', '2025-07-18 18:00:00', 3.0, N'Sân bóng', 3, N'Medium', N'Medium', N'Cần có kinh nghiệm chơi bóng đá'),
(6, 4, 1, N'Quay phim chương trình', N'Ghi lại các tiết mục biểu diễn', '2025-08-05 19:00:00', '2025-08-05 22:00:00', 3.0, N'Sân khấu', 2, N'Medium', N'Medium', N'Cần biết sử dụng camera'),
(7, 2, 1, N'Đón tiếp học sinh', N'Hướng dẫn học sinh đến các gian tư vấn', '2025-07-27 08:00:00', '2025-07-27 17:00:00', 9.0, N'Sảnh chính', 8, N'High', N'Dễ', N'Thân thiện, am hiểu thông tin sự kiện'),
(8, 3, 1, N'Hỗ trợ máy chiếu', N'Cài đặt và vận hành thiết bị chiếu', '2025-08-12 13:00:00', '2025-08-12 17:00:00', 4.0, N'Phòng 201', 2, N'Medium', N'Medium', N'Cần biết sử dụng thiết bị AV'),
(9, 3, 1, N'Hỗ trợ kỹ thuật máy tính', N'Thiết lập máy tính cho thí sinh', '2025-07-19 08:00:00', '2025-07-19 09:00:00', 1.0, N'Lab CNTT', 4, N'High', N'Khó', N'Cần kiến thức IT tốt');

-- Insert Task Assignments
INSERT INTO TaskAssignments (TaskId, VolunteerId, AssignedBy, Status) VALUES
(1, 1, 2, N'Accepted'),
(1, 5, 2, N'Accepted'),
(2, 2, 2, N'Accepted'),
(2, 4, 2, N'Accepted'),
(3, 3, 3, N'Accepted'),
(4, 3, 3, N'Accepted'),
(5, 5, 4, N'Accepted'),
(6, 6, 5, N'Accepted'),
(7, 7, 6, N'Accepted'),
(8, 8, 7, N'Accepted'),
(9, 9, 8, N'Accepted'),
(10, 10, 10, N'Accepted');

-- Insert Feedback Categories
INSERT INTO FeedbackCategories (CategoryName, Description) VALUES
(N'Tổ chức sự kiện', N'Phản hồi về cách tổ chức và điều phối sự kiện'),
(N'Nội dung chương trình', N'Đánh giá về nội dung và chất lượng chương trình'),
(N'Cơ sở vật chất', N'Phản hồi về địa điểm, thiết bị, tiện ích'),
(N'Đội ngũ tổ chức', N'Đánh giá về thái độ và năng lực của BTC'),
(N'Truyền thông', N'Phản hồi về hoạt động truyền thông, quảng bá'),
(N'Đăng ký tham gia', N'Phản hồi về quy trình đăng ký và xác nhận'),
(N'Khác', N'Các phản hồi khác không thuộc danh mục trên');

-- Insert Feedback
INSERT INTO Feedback (EventId, UserId, CategoryId, Subject, Content, Rating, IsAnonymous, Status) VALUES
(1, 1, 1, N'Sự kiện tổ chức rất tốt', N'Ban tổ chức rất chu đáo, sự kiện ý nghĩa. Tôi sẽ tham gia những lần sau.', 5, 0, N'Approved'),
(1, 2, 2, N'Nội dung bổ ích', N'Được tìm hiểu nhiều về việc hiến máu, rất bổ ích và ý nghĩa.', 5, 0, N'Approved'),
(2, 3, 1, N'Hoạt động ý nghĩa', N'Dọn rác bảo vệ môi trường rất cần thiết, mong có thêm nhiều hoạt động như vậy.', 4, 0, N'Approved'),
(3, 5, 4, N'Anh chị hướng dẫn nhiệt tình', N'Các anh chị tình nguyện viên rất nhiệt tình và thân thiện với các em.', 5, 0, N'Approved'),
(4, 6, 3, N'Cần cải thiện cơ sở vật chất', N'Nên có thêm ghế ngồi và nước uống cho người chờ khám.', 3, 0, N'Pending'),
(5, 7, 2, N'Trại bóng đá vui và bổ ích', N'Các em học được nhiều kỹ năng bóng đá, rất vui và hấp dẫn.', 4, 1, N'Approved'),
(6, 8, 1, N'Chương trình âm nhạc tuyệt vời', N'Âm nhạc hay, ý nghĩa, góp phần làm từ thiện tốt.', 5, 0, N'Approved'),
(7, 9, 2, N'Thông tin tư vấn hữu ích', N'Nhận được nhiều thông tin bổ ích về các ngành nghề và trường đại học.', 4, 0, N'Approved'),
(8, 10, 1, N'Workshop rất thực tế', N'Học được cách viết CV hiệu quả, rất cần thiết cho sinh viên sắp tốt nghiệp.', 5, 0, N'Approved'),
(9, 1, 2, N'Cuộc thi thử thách và thú vị', N'Đề bài hay, thử thách khả năng lập trình AI, học hỏi được nhiều.', 4, 0, N'Approved');

-- Insert Certificate Templates
INSERT INTO CertificateTemplates (TemplateName, Description, TemplateType, RequiredFields, OrganizationId, IsDefault, CreatedBy) VALUES
(N'Chứng nhận tham gia sự kiện', N'Mẫu chứng nhận cơ bản cho người tham gia sự kiện', N'Participation', N'FullName,EventName,Date,Hours', 1, 1, 2),
(N'Chứng nhận tình nguyện viên xuất sắc', N'Mẫu chứng nhận cho tình nguyện viên có thành tích tốt', N'Achievement', N'FullName,EventName,Performance,Date,Hours', 1, 0, 2),
(N'Chứng nhận hoàn thành khóa đào tạo', N'Mẫu chứng nhận cho người hoàn thành khóa đào tạo', N'Completion', N'FullName,CourseName,Date,Skills', 2, 1, 3),
(N'Chứng nhận đóng góp cộng đồng', N'Mẫu chứng nhận cho hoạt động đóng góp cộng đồng', N'Community', N'FullName,EventName,Contribution,Date', 3, 1, 4),
(N'Chứng nhận tham gia workshop', N'Mẫu chứng nhận cho người tham gia workshop', N'Workshop', N'FullName,WorkshopName,Skills,Date', 4, 1, 5);

-- Insert Certificates
INSERT INTO Certificates (VolunteerId, EventId, TemplateId, CertificateNumber, CertificateName, Description, HoursCompleted, PerformanceLevel, VerificationCode, IssuedBy, Status) VALUES
(1, 1, 1, 'CERT-2025-001', N'Chứng nhận tham gia hiến máu', N'Chứng nhận tham gia sự kiện hiến máu nhân đạo', 4.0, N'Tốt', 'VER-001-2025', 2, N'Active'),
(2, 1, 1, 'CERT-2025-002', N'Chứng nhận tham gia hiến máu', N'Chứng nhận tham gia sự kiện hiến máu nhân đạo', 4.0, N'Tốt', 'VER-002-2025', 2, N'Active'),
(4, 2, 1, 'CERT-2025-003', N'Chứng nhận bảo vệ môi trường', N'Chứng nhận tham gia hoạt động dọn rác bảo vệ môi trường', 6.0, N'Xuất sắc', 'VER-003-2025', 3, N'Active'),
(5, 3, 1, 'CERT-2025-004', N'Chứng nhận tham gia trại hè', N'Chứng nhận tham gia trại hè kỹ năng sống', 24.0, N'Tốt', 'VER-004-2025', 4, N'Active'),
(7, 5, 1, 'CERT-2025-005', N'Chứng nhận huấn luyện bóng đá', N'Chứng nhận tham gia huấn luyện bóng đá thiếu nhi', 40.0, N'Tốt', 'VER-005-2025', 6, N'Active'),
(8, 6, 1, 'CERT-2025-006', N'Chứng nhận tham gia chương trình âm nhạc', N'Chứng nhận tham gia giao lưu âm nhạc thiện nguyện', 8.0, N'Khá', 'VER-006-2025', 7, N'Active'),
(10, 8, 5, 'CERT-2025-007', N'Chứng nhận tham gia workshop CV', N'Chứng nhận hoàn thành workshop thiết kế CV', 4.0, N'Tốt', 'VER-007-2025', 9, N'Active'),
(1, 9, 1, 'CERT-2025-008', N'Chứng nhận tham gia cuộc thi AI', N'Chứng nhận tham gia cuộc thi lập trình AI', 16.0, N'Khá', 'VER-008-2025', 10, N'Active');

-- Insert Collaboration Types
INSERT INTO CollaborationTypes (TypeName, Description) VALUES
(N'Tài trợ tài chính', N'Đối tác cung cấp kinh phí cho sự kiện'),
(N'Tài trợ kỹ thuật', N'Đối tác cung cấp thiết bị, công nghệ'),
(N'Cung cấp tình nguyện viên', N'Đối tác hỗ trợ nhân lực tình nguyện'),
(N'Đồng tổ chức sự kiện', N'Cùng nhau tổ chức và thực hiện sự kiện'),
(N'Hỗ trợ truyền thông', N'Đối tác hỗ trợ quảng bá, truyền thông'),
(N'Cung cấp địa điểm', N'Đối tác cung cấp không gian tổ chức'),
(N'Hỗ trợ logistics', N'Đối tác hỗ trợ vận chuyển, chuẩn bị'),
(N'Tư vấn chuyên môn', N'Đối tác cung cấp kiến thức chuyên môn'),
(N'Cung cấp quà tặng', N'Đối tác tài trợ quà tặng, phần thưởng'),
(N'Hỗ trợ y tế', N'Đối tác cung cấp dịch vụ y tế, sức khỏe');

-- Insert Partner Collaborations
INSERT INTO PartnerCollaborations (OrganizationId, PartnerId, TypeId, CollaborationName, Description, StartDate, EndDate, Status, Budget, Currency) VALUES
(1, 1, 4, N'Hợp tác tổ chức workshop kỹ năng', N'Cùng nhau tổ chức các workshop kỹ năng mềm cho sinh viên', '2025-01-01', '2025-12-31', N'In Progress', 50000000, 'VND'),
(1, 2, 1, N'Tài trợ sự kiện hiến máu', N'VIB tài trợ kinh phí cho chương trình hiến máu nhân đạo', '2025-07-01', '2025-07-31', N'Completed', 20000000, 'VND'),
(2, 3, 2, N'Hỗ trợ công nghệ cho sự kiện', N'BKSoft cung cấp hệ thống quản lý đăng ký trực tuyến', '2025-06-01', '2025-08-31', N'In Progress', 15000000, 'VND'),
(3, 4, 5, N'Truyền thông sự kiện giáo dục', N'Viettel hỗ trợ truyền thông cho các chương trình giáo dục', '2025-03-01', '2025-12-31', N'In Progress', 30000000, 'VND'),
(4, 5, 10, N'Hỗ trợ y tế sự kiện cộng đồng', N'Bệnh viện Hạnh Phúc cung cấp dịch vụ khám sức khỏe', '2025-07-15', '2025-08-15', N'In Progress', 25000000, 'VND'),
(5, 6, 1, N'Tài trợ hoạt động từ thiện', N'PVI tài trợ cho các hoạt động từ thiện của quỹ', '2025-01-01', '2025-12-31', N'In Progress', 100000000, 'VND'),
(6, 7, 9, N'Cung cấp thực phẩm cho sự kiện', N'Orion tài trợ thực phẩm cho các hoạt động môi trường', '2025-08-01', '2025-08-31', N'Negotiating', 10000000, 'VND'),
(7, 8, 7, N'Hỗ trợ vận chuyển thiết bị', N'GHTK hỗ trợ vận chuyển thiết bị xây dựng', '2025-06-01', '2025-12-31', N'In Progress', 12000000, 'VND'),
(8, 9, 6, N'Cung cấp địa điểm đào tạo', N'Hòa Bình cung cấp không gian cho các khóa đào tạo', '2025-07-01', '2025-09-30', N'Signed', 8000000, 'VND'),
(9, 10, 8, N'Tư vấn dinh dưỡng sự kiện', N'Nông sản Sạch tư vấn dinh dưỡng cho chương trình âm nhạc', '2025-08-01', '2025-08-10', N'Negotiating', 5000000, 'VND');

-- Insert Notifications
INSERT INTO Notifications (UserId, Title, Content, SendDate, IsRead) VALUES
(1, N'Đăng ký sự kiện thành công', N'Bạn đã đăng ký thành công sự kiện "Ngày hội hiến máu BK". Vui lòng có mặt đúng giờ.', '2025-07-10 10:30:00', 1),
(2, N'Xác nhận tham gia sự kiện', N'Đăng ký của bạn cho sự kiện hiến máu đã được chấp nhận. Hẹn gặp bạn vào ngày 20/7.', '2025-07-12 14:20:00', 1),
(3, N'Cập nhật thông tin sự kiện', N'Sự kiện "Dọn rác bờ kè Xanh" có thay đổi giờ tập trung. Chi tiết xem trong ứng dụng.', '2025-08-08 09:15:00', 0),
(4, N'Chứng chỉ đã sẵn sàng', N'Chứng chỉ tham gia sự kiện "Dọn rác bờ kè Xanh" của bạn đã được cấp. Vào ứng dụng để tải về.', '2025-08-11 16:45:00', 0),
(5, N'Lời cảm ơn từ BTC', N'Cảm ơn bạn đã tham gia tích cực vào trại hè kỹ năng. Hy vọng gặp lại bạn ở các sự kiện tiếp theo.', '2025-07-29 11:30:00', 1),
(6, N'Nhắc nhở sự kiện sắp diễn ra', N'Sự kiện "Khám sức khỏe cộng đồng" sẽ diễn ra vào ngày mai. Đừng quên mang theo giấy tờ tùy thân.', '2025-07-29 18:00:00', 0),
(7, N'Thông báo hủy nhiệm vụ', N'Nhiệm vụ "Hỗ trợ kỹ thuật" trong sự kiện bóng đá đã bị hủy do thay đổi kế hoạch.', '2025-07-17 13:20:00', 1),
(8, N'Mời tham gia khảo sát', N'Vui lòng tham gia khảo sát đánh giá chất lượng sự kiện âm nhạc để chúng tôi cải thiện hơn.', '2025-08-06 10:15:00', 0),
(9, N'Cơ hội tình nguyện mới', N'Có sự kiện mới phù hợp với kỹ năng của bạn. Đăng ký ngay để không bỏ lỡ cơ hội.', '2025-08-07 14:30:00', 0),
(10, N'Chúc mừng hoàn thành sự kiện', N'Chúc mừng bạn đã hoàn thành xuất sắc workshop thiết kế CV. Chúc bạn thành công trong công việc!', '2025-08-12 17:50:00', 1);

-- Insert Support Requests
INSERT INTO SupportRequests (UserId, CategoryId, Subject, Description, Priority, Status, AttachmentUrls) VALUES
(1, (SELECT CategoryId FROM SupportCategories WHERE CategoryName=N'Hỗ trợ y tế cá nhân'), N'[SR-0001] Hỗ trợ phẫu thuật tim cho bé H.', N'Gia đình khó khăn, cần hỗ trợ 40 triệu cho ca phẫu thuật tim. Đính kèm hồ sơ bệnh án.', N'High', N'Submitted', N'["/evidence/medical_report_0001.pdf","/evidence/family_cert_0001.jpg"]'),
(2, (SELECT CategoryId FROM SupportCategories WHERE CategoryName=N'Hỗ trợ thực phẩm'), N'[SR-0002] Gạo & nhu yếu phẩm cho 20 hộ nghèo phường 8', N'Tổ dân phố đề nghị hỗ trợ 20 suất quà (gạo, dầu ăn, sữa) cho các hộ khó khăn.', N'High', N'Under Review', N'["/evidence/list_households_p8.xlsx"]'),
(3, (SELECT CategoryId FROM SupportCategories WHERE CategoryName=N'Kêu gọi hiến máu'), N'[SR-0003] Tổ chức ngày hội hiến máu tại quận 10', N'Đề xuất phối hợp tổ chức hiến máu tại Nhà văn hoá phường, dự kiến 200 người tham gia.', N'Medium', N'Approved', NULL);

-- Insert AI Custom Instructions
INSERT INTO AiCustomInstructions (InstructionName, SystemPrompt, BehaviorInstructions, IsActive) VALUES
(N'Hỗ trợ tình nguyện viên', N'Bạn là trợ lý AI của hệ thống quản lý tình nguyện IVAN. Hãy hỗ trợ người dùng bằng tiếng Việt một cách thân thiện và chuyên nghiệp.', N'- Luôn trả lời bằng tiếng Việt
- Thân thiện và nhiệt tình
- Cung cấp thông tin chính xác về sự kiện và hoạt động tình nguyện
- Hướng dẫn cách sử dụng các tính năng
- Khuyến khích tham gia hoạt động ý nghĩa', 1),
(N'Hỗ trợ tổ chức', N'Bạn là chuyên gia tư vấn cho các tổ chức trong việc quản lý sự kiện và tình nguyện viên. Hãy đưa ra lời khuyên hữu ích.', N'- Tập trung vào hiệu quả tổ chức
- Đưa ra gợi ý cải thiện quy trình
- Hỗ trợ lập kế hoạch sự kiện
- Tư vấn quản lý nhân sự tình nguyện
- Chia sẻ best practices', 1),
(N'SQL Query Assistant', N'Bạn là chuyên gia SQL giúp tạo các câu truy vấn cho cơ sở dữ liệu IVAN. Chỉ trả lời bằng SQL query và giải thích ngắn gọn.', N'- Chỉ tạo SQL query an toàn
- Không sử dụng DELETE hoặc DROP
- Ưu tiên SELECT, INSERT, UPDATE
- Giải thích logic query
- Tối ưu hiệu suất truy vấn', 1);

INSERT INTO VolunteerSchedules (VolunteerId, EventId, Title, Description, StartDateTime, EndDateTime, Location, ScheduleType, Priority, Status, IsAllDay, ReminderMinutes, Notes, CreatedBy)
VALUES
(1, 1, N'Ca sáng hiến máu', N'Chuẩn bị khu vực tiếp đón', '2025-07-20 08:00:00', '2025-07-20 12:00:00', N'BK HCM', N'Onsite', N'High', N'Scheduled', 0, 30, N'Có mặt trước 15 phút', 2),
(2, 1, N'Ca chiều hiến máu', N'Hỗ trợ hướng dẫn quy trình', '2025-07-20 13:00:00', '2025-07-20 17:00:00', N'BK HCM', N'Onsite', N'High', N'Scheduled', 0, 30, N'Liên hệ điều phối viên khi đến', 2),
(3, 2, N'Dọn rác bờ kè - Ca sáng', N'Chuẩn bị dụng cụ và phân nhóm', '2025-07-26 07:30:00', '2025-07-26 11:30:00', N'Bờ kè Xanh', N'Onsite', N'Medium', N'Scheduled', 0, 60, N'Đem theo găng tay', 2),
(4, 8, N'Workshop CV - check-in', N'Điểm danh và phát tài liệu', '2025-08-12 08:00:00', '2025-08-12 12:00:00', N'Phòng 201, ĐH Mở', N'Onsite', N'High', N'Scheduled', 0, 30, N'Kiểm tra máy chiếu', 5),
(5, 9, N'Hackathon AI - hỗ trợ kỹ thuật', N'Hỗ trợ setup máy và IDE', '2025-07-19 08:00:00', '2025-07-19 20:00:00', N'Lab CNTT, ĐH BK', N'Onsite', N'High', N'Scheduled', 0, 15, N'Checklist cài đặt', 5);

INSERT INTO CoordinatorSchedules (CoordinatorId, EventId, Title, Description, StartDateTime, EndDateTime, Location, ScheduleType, Priority, Status, IsAllDay, ReminderMinutes, Notes, CreatedBy)
VALUES
((SELECT TOP 1 CoordinatorId FROM VolunteerCoordinators WHERE EmployeeId='E001'), 1, N'Briefing đầu ngày', N'Phân công công việc cho TNV', '2025-07-20 07:30:00', '2025-07-20 08:00:00', N'BK HCM', N'Meeting', N'High', N'Planned', 0, 30, N'Chuẩn bị danh sách', 2),
((SELECT TOP 1 CoordinatorId FROM VolunteerCoordinators WHERE EmployeeId='E001'), 1, N'Rút kinh nghiệm', N'Họp nhanh tổng kết', '2025-07-20 17:15:00', '2025-07-20 17:45:00', N'BK HCM', N'Meeting', N'Low', N'Planned', 0, 10, N'Ghi chú sự cố', 2),
((SELECT TOP 1 CoordinatorId FROM VolunteerCoordinators WHERE EmployeeId='E002'), 8, N'Chuẩn bị Workshop', N'Kiểm tra CSVC và tài liệu', '2025-08-12 07:30:00', '2025-08-12 08:30:00', N'Phòng 201, ĐH Mở', N'Meeting', N'High', N'Planned', 0, 15, N'In thêm phiếu khảo sát', 2);

INSERT INTO CoordinatorTasks (EventId, CoordinatorId, TaskName, Description, DueDate, Priority, Status, Category, EstimatedHours, Notes, CreatedBy)
VALUES
(1, (SELECT TOP 1 CoordinatorId FROM VolunteerCoordinators WHERE EmployeeId='E001'), N'Lập kế hoạch phân luồng', N'Xác định khu vực đón tiếp, hiến và nghỉ', '2025-07-18 18:00:00', N'High', N'Not Started', N'Planning', 3.5, N'Dùng sơ đồ nhà thi đấu', 2),
(1, (SELECT TOP 1 CoordinatorId FROM VolunteerCoordinators WHERE EmployeeId='E001'), N'Liên hệ nhà tài trợ', N'Xác nhận nước uống và snack', '2025-07-19 12:00:00', N'Medium', N'In Progress', N'Logistics', 2.0, N'Nhà tài trợ Orion', 2),
(8, (SELECT TOP 1 CoordinatorId FROM VolunteerCoordinators WHERE EmployeeId='E002'), N'Chuẩn bị thiết bị', N'Máy chiếu, micro, wifi', '2025-08-11 17:00:00', N'High', N'Not Started', N'Operations', 1.5, N'Kiểm tra dây HDMI', 2);

INSERT INTO ChatbotInteractions (UserId, Question, Response, InteractionDate)
VALUES
(1, N'Làm sao đăng ký sự kiện hiến máu?', N'Bạn vào mục Sự kiện, chọn \"Ngày hội hiến máu BK\" và nhấn Đăng ký.', '2025-07-09 09:45:00'),
(3, N'Làm thế nào để nhận chứng chỉ?', N'Sau khi sự kiện kết thúc và được đánh dấu Attended, chứng chỉ sẽ được cấp tự động.', '2025-07-21 10:00:00'),
(5, N'Tôi có thể đổi ca làm không?', N'Bạn có thể gửi yêu cầu đổi ca trong phần Lịch làm việc.', '2025-07-26 15:20:00');

INSERT INTO Reports (ReportType, Content, GeneratedDate, CreatedBy)
VALUES
(N'EventSummary', N'Tổng hợp sự kiện tháng 7: 10 sự kiện, 540 lượt đăng ký, 480 tham gia.', '2025-08-01 08:00:00', 2),
(N'VolunteerHours', N'Tổng giờ tình nguyện tháng 7: 1,250 giờ.', '2025-08-01 08:10:00', 2);

-- Use role names to remain robust against identity values
INSERT INTO RolePermissions (RoleId, PermissionName, Description)
SELECT RoleId, 'ManageEvents', N'Tạo, cập nhật, hủy sự kiện' FROM UserRoles WHERE RoleName = 'Admin';
INSERT INTO RolePermissions (RoleId, PermissionName, Description)
SELECT RoleId, 'ApproveRegistrations', N'Duyệt đăng ký sự kiện' FROM UserRoles WHERE RoleName = 'Admin';
INSERT INTO RolePermissions (RoleId, PermissionName, Description)
SELECT RoleId, 'ViewReports', N'Xem báo cáo' FROM UserRoles WHERE RoleName IN ('Admin', 'Organization');
INSERT INTO RolePermissions (RoleId, PermissionName, Description)
SELECT RoleId, 'RegisterEvents', N'Đăng ký tham gia sự kiện' FROM UserRoles WHERE RoleName = 'Volunteer';
INSERT INTO RolePermissions (RoleId, PermissionName, Description)
SELECT RoleId, 'ManageCollaborations', N'Quản lý hợp tác' FROM UserRoles WHERE RoleName = 'Organization';


-- ===== Add-on seed for Reports =====

/* Seed sample completion reports (EventCompletion) using JSON content, without changing schema */
DECLARE @AnyEvent INT = (SELECT TOP 1 EventId FROM Events ORDER BY EventId);
DECLARE @AnyCoordinator INT = (
    SELECT TOP 1 VC.CoordinatorId 
    FROM VolunteerCoordinators VC
    ORDER BY VC.CoordinatorId
);
IF @AnyEvent IS NOT NULL
BEGIN
    INSERT INTO Reports (ReportType, Content, CreatedBy)
    VALUES
    (N'EventCompletion', 
     N'{
        "eventId": ' + CAST(@AnyEvent AS NVARCHAR(20)) + N',
        "summary": "Completion checklist & outcomes",
        "totals": {
            "tasksCompleted": 18,
            "tasksCancelled": 1,
            "volunteersCheckedIn": 32,
            "volunteerHours": 112.5
        },
        "artifacts": {
            "taskClosureSnapshot": true,
            "attendanceExport": "/exports/attendance_event_' + CAST(@AnyEvent AS NVARCHAR(20)) + N'.csv"
        },
        "approvals": {
            "coordinatorVerified": true,
            "organizationApproved": false
        }
     }',
     (SELECT TOP 1 UserId FROM Users ORDER BY UserId));
END
GO
