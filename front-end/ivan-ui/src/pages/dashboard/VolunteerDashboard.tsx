import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, Award, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function VolunteerDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Chào mừng, {user?.fullName}
        </h1>
        <p className="text-gray-600">
          Quản lý hoạt động tình nguyện và khám phá cơ hội mới
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sự kiện tham gia
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Giờ tình nguyện
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+24 giờ tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chứng chỉ</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Đã xác nhận</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Điểm tín nhiệm
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">850</div>
            <p className="text-xs text-muted-foreground">Xuất sắc</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Company */}
        <Card>
          <CardHeader>
            <CardTitle>Tổ chức hiện tại</CardTitle>
            <CardDescription>
              Tổ chức bạn đang tham gia hoạt động tình nguyện
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Quỹ Tấm Lòng Việt</h3>
                <p className="text-sm text-gray-600">Giáo dục và Y tế</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Giáo dục</Badge>
              <Badge variant="secondary">Y tế</Badge>
              <Badge variant="secondary">Cộng đồng</Badge>
            </div>
            <div className="flex space-x-2">
              {" "}
              <Button asChild className="flex-1">
                <Link to="/organizations">Xem trang tổ chức</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/schedule">Lịch trình</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Sự kiện sắp tới</CardTitle>
            <CardDescription>
              Các hoạt động tình nguyện bạn đã đăng ký
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Dạy máy tính cho trẻ em</h4>
                  <p className="text-sm text-gray-600">
                    Thứ 7, 15/06 • 8:00-12:00
                  </p>
                </div>
                <Badge>Đã đăng ký</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Khám sức khỏe miễn phí</h4>
                  <p className="text-sm text-gray-600">
                    Chủ nhật, 16/06 • 7:00-11:00
                  </p>
                </div>
                <Badge variant="outline">Chờ xác nhận</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/events">Khám phá thêm sự kiện</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Certificates */}
        <Card>
          <CardHeader>
            <CardTitle>Chứng chỉ gần đây</CardTitle>
            <CardDescription>Các chứng nhận bạn đã nhận được</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Award className="h-8 w-8 text-green-600" />
                <div>
                  <h4 className="font-medium">Tình nguyện viên xuất sắc</h4>
                  <p className="text-sm text-gray-600">
                    Quỹ Tấm Lòng Việt • 10/06/2024
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Award className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-medium">Hoàn thành khóa đào tạo</h4>
                  <p className="text-sm text-gray-600">
                    Kỹ năng giao tiếp • 05/06/2024
                  </p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/certificates">Xem tất cả chứng chỉ</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Hành động nhanh</CardTitle>
            <CardDescription>Các tác vụ thường dùng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link to="/events">
                <CalendarDays className="mr-2 h-4 w-4" />
                Tìm sự kiện mới
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/organizations">
                <Users className="mr-2 h-4 w-4" />
                Khám phá tổ chức
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/profile">
                <Settings className="mr-2 h-4 w-4" />
                Cập nhật hồ sơ
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
