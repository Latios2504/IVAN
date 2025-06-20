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
import {
  Users,
  Calendar,
  BarChart3,
  Award,
  UserPlus,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function OrganizationDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý tổ chức
        </h1>
        <p className="text-gray-600">
          Điều hành hoạt động tình nguyện và quản lý tình nguyện viên
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tình nguyện viên
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12 tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sự kiện hoạt động
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+3 tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coordinators</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Đang hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chứng chỉ cấp</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Tháng này</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Management Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quản lý chính</CardTitle>
            <CardDescription>
              Các chức năng quản lý cốt lõi của tổ chức
            </CardDescription>
          </CardHeader>{" "}          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link to="/organization/profile">
                <Settings className="mr-2 h-4 w-4" />
                Quản lý hồ sơ tổ chức
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link to="/organization/management">
                <Settings className="mr-2 h-4 w-4" />
                Trang quản lý tổng hợp
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link to="/organization/events">
                <Calendar className="mr-2 h-4 w-4" />
                Quản lý sự kiện
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link to="/organization/volunteers">
                <Users className="mr-2 h-4 w-4" />
                Quản lý tình nguyện viên
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link to="/volunteers">
                <UserPlus className="mr-2 h-4 w-4" />
                Danh sách tình nguyện viên
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/organization/reports">
                <BarChart3 className="mr-2 h-4 w-4" />
                Báo cáo dữ liệu
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Coordinator Management */}
        <Card>
          <CardHeader>
            <CardTitle>Quản lý Coordinators</CardTitle>
            <CardDescription>Điều phối và quản lý coordinator</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link to="/organization/coordinators">
                <UserPlus className="mr-2 h-4 w-4" />
                Lịch trình Coordinators
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link to="/organization/coordinator-tasks">
                <Settings className="mr-2 h-4 w-4" />
                Nhiệm vụ Coordinators
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/organization/certificates">
                <Award className="mr-2 h-4 w-4" />
                Quản lý chứng chỉ
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle>Sự kiện gần đây</CardTitle>
            <CardDescription>Các sự kiện đã và đang diễn ra</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Chương trình giáo dục trẻ em</h4>
                  <p className="text-sm text-gray-600">
                    45 tình nguyện viên • Hoàn thành
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Thành công
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Khám sức khỏe cộng đồng</h4>
                  <p className="text-sm text-gray-600">
                    32 tình nguyện viên • Đang diễn ra
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  Đang diễn ra
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/organization/events">Xem tất cả sự kiện</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Volunteer Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Thống kê tình nguyện viên</CardTitle>
            <CardDescription>
              Tổng quan về đội ngũ tình nguyện viên
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Tình nguyện viên mới</span>
                <Badge variant="secondary">+12 tháng này</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Đang hoạt động</span>
                <Badge variant="secondary">134 người</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Giờ tình nguyện tháng này</span>
                <Badge variant="secondary">2,456 giờ</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Đánh giá trung bình</span>
                <Badge className="bg-yellow-100 text-yellow-800">4.8/5</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/organization/volunteers">Quản lý chi tiết</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
