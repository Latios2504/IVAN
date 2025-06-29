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
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActionButton } from "@/components/dashboard/ActionButton";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
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
        <StatsCard
          title="Sự kiện tham gia"
          value={12}
          icon={CalendarDays}
          trend={{ value: "+2 tháng này" }}
        />
        <StatsCard
          title="Giờ tình nguyện"
          value={128}
          icon={Users}
          trend={{ value: "+24 giờ tháng này" }}
        />
        <StatsCard
          title="Chứng chỉ"
          value={5}
          icon={Award}
          description="Đã xác nhận"
        />
        <StatsCard
          title="Điểm tín nhiệm"
          value={850}
          icon={Settings}
          description="Xuất sắc"
        />
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
                <StatusBadge variant="success">Đã đăng ký</StatusBadge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Khám sức khỏe miễn phí</h4>
                  <p className="text-sm text-gray-600">
                    Chủ nhật, 16/06 • 7:00-11:00
                  </p>
                </div>
                <StatusBadge variant="pending">Chờ xác nhận</StatusBadge>
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
            <ActionButton to="/events" icon={CalendarDays}>
              Tìm sự kiện mới
            </ActionButton>
            <ActionButton to="/organizations" icon={Users} variant="outline">
              Khám phá tổ chức
            </ActionButton>
            <ActionButton to="/profile" icon={Settings} variant="outline">
              Cập nhật hồ sơ
            </ActionButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
