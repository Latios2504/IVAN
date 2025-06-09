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
import { Users, Calendar, UserCheck, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function CoordinatorDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Coordinator
        </h1>
        <p className="text-gray-600">
          Quản lý lịch trình và điều phối tình nguyện viên
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tình nguyện viên phụ trách
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Đang hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sự kiện được phân công
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">3 đang diễn ra</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đăng ký chờ duyệt
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Cần xem xét</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nhiệm vụ tuần này
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">7 hoàn thành</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Schedule Management */}
        <Card>
          <CardHeader>
            <CardTitle>Quản lý lịch trình</CardTitle>
            <CardDescription>
              Phân lịch cho tình nguyện viên trong các sự kiện dài ngày
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Trại hè giáo dục</h4>
                  <p className="text-sm text-gray-600">
                    15 tình nguyện viên • 7 ngày
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  Đang diễn ra
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Chương trình y tế miền núi</h4>
                  <p className="text-sm text-gray-600">
                    9 tình nguyện viên • 5 ngày
                  </p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">
                  Chuẩn bị
                </Badge>
              </div>
            </div>
            <Button className="w-full" asChild>
              <Link to="/coordinator/schedule">
                <Calendar className="mr-2 h-4 w-4" />
                Quản lý lịch trình
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Event Registration Management */}
        <Card>
          <CardHeader>
            <CardTitle>Quản lý đăng ký sự kiện</CardTitle>
            <CardDescription>
              Xử lý đăng ký của tình nguyện viên cho các sự kiện được phân công
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <span className="font-medium">Đã duyệt</span>
                  <p className="text-sm text-gray-600">16 đăng ký</p>
                </div>
                <Badge className="bg-green-100 text-green-800">16</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div>
                  <span className="font-medium">Chờ duyệt</span>
                  <p className="text-sm text-gray-600">8 đăng ký mới</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">8</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <span className="font-medium">Từ chối</span>
                  <p className="text-sm text-gray-600">2 đăng ký</p>
                </div>
                <Badge className="bg-red-100 text-red-800">2</Badge>
              </div>
            </div>
            <Button className="w-full" asChild>
              <Link to="/coordinator/registrations">
                <UserCheck className="mr-2 h-4 w-4" />
                Xử lý đăng ký
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Assigned Volunteers */}
        <Card>
          <CardHeader>
            <CardTitle>Tình nguyện viên phụ trách</CardTitle>
            <CardDescription>
              Danh sách tình nguyện viên bạn đang điều phối
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">NA</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Nguyễn Văn An</h4>
                  <p className="text-sm text-gray-600">Lập trình, Giảng dạy</p>
                </div>
                <Badge variant="outline">Online</Badge>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-600">TB</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Trần Thị Bình</h4>
                  <p className="text-sm text-gray-600">Giảng dạy, Tổ chức</p>
                </div>
                <Badge variant="outline">Hoạt động</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/coordinator/volunteers">Xem tất cả</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Hành động nhanh</CardTitle>
            <CardDescription>
              Các tác vụ thường dùng của coordinator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link to="/coordinator/schedule">
                <Calendar className="mr-2 h-4 w-4" />
                Cập nhật lịch trình
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/coordinator/registrations">
                <UserCheck className="mr-2 h-4 w-4" />
                Duyệt đăng ký mới
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/profile">
                <Settings className="mr-2 h-4 w-4" />
                Cập nhật thông tin
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
