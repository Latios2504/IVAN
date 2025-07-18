-- Insert default user roles
INSERT INTO UserRoles (RoleName, Description) VALUES
(N'Admin', N'Quản trị viên hệ thống'),
(N'Organization', N'Tổ chức từ thiện'),
(N'Volunteer', N'Tình nguyện viên'),
(N'Partner', N'Đối tác'),
(N'Coordinator', N'Điều phối viên tình nguyện');

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
(N'Sắp diễn ra', N'Sự kiện chưa bắt đầu', '#4287f5'),
(N'Đang diễn ra', N'Sự kiện đang tiến hành', '#2ecc71'),
(N'Đã kết thúc', N'Sự kiện đã hoàn thành', '#888888'),
(N'Huỷ', N'Sự kiện bị huỷ', '#ff3333'),
(N'Đóng đăng ký', N'Không nhận đăng ký mới', '#ffc107'),
(N'Chờ duyệt', N'Chờ xác nhận tổ chức', '#00b894'),
(N'Hoãn', N'Tạm hoãn sự kiện', '#fdcb6e'),
(N'Đầy slot', N'Đủ số lượng tham gia', '#00b894'),
(N'Cần hỗ trợ', N'Cần thêm nhân sự', '#e17055'),
(N'Nổi bật', N'Sự kiện nổi bật', '#fd79a8');

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
