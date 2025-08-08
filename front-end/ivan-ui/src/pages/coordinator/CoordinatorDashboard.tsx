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
        <StatsCard
          title="Tình nguyện viên phụ trách"
          value={24}
          icon={Users}
          description="Đang hoạt động"
        />
        <StatsCard
          title="Sự kiện được phân công"
          value={5}
          icon={Calendar}
          description="3 đang diễn ra"
        />
        <StatsCard
          title="Đăng ký chờ duyệt"
          value={8}
          icon={UserCheck}
          description="Cần xem xét"
        />
        <StatsCard
          title="Nhiệm vụ tuần này"
          value={12}
          icon={Settings}
          description="7 hoàn thành"
        />
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
                <StatusBadge variant="active">Đang diễn ra</StatusBadge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Chương trình y tế miền núi</h4>
                  <p className="text-sm text-gray-600">
                    9 tình nguyện viên • 5 ngày
                  </p>
                </div>
                <StatusBadge variant="warning">Chuẩn bị</StatusBadge>
              </div>
            </div>
            <ActionButton to="/coordinator/schedule" icon={Calendar}>
              Quản lý lịch trình
            </ActionButton>
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
                <StatusBadge variant="warning">8</StatusBadge>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <span className="font-medium">Từ chối</span>
                  <p className="text-sm text-gray-600">2 đăng ký</p>
                </div>
                <StatusBadge variant="error">2</StatusBadge>
              </div>
            </div>
            <ActionButton to="/coordinator/registrations" icon={UserCheck}>
              Xử lý đăng ký
            </ActionButton>
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
            <ActionButton to="/coordinator/schedule" icon={Calendar}>
              Cập nhật lịch trình
            </ActionButton>
            <ActionButton
              to="/coordinator/registrations"
              icon={UserCheck}
              variant="outline"
            >
              Duyệt đăng ký mới
            </ActionButton>
            <ActionButton to="/profile" icon={Settings} variant="outline">
              Cập nhật thông tin
            </ActionButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
