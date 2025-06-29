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
        <StatsCard
          title="Tình nguyện viên"
          value={156}
          icon={Users}
          trend={{ value: "+12 tháng này" }}
        />
        <StatsCard
          title="Sự kiện hoạt động"
          value={23}
          icon={Calendar}
          trend={{ value: "+3 tháng này" }}
        />
        <StatsCard
          title="Coordinators"
          value={8}
          icon={UserPlus}
          description="Đang hoạt động"
        />
        <StatsCard
          title="Chứng chỉ cấp"
          value={89}
          icon={Award}
          description="Tháng này"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Management Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quản lý chính</CardTitle>
            <CardDescription>
              Các chức năng quản lý cốt lõi của tổ chức
            </CardDescription>
          </CardHeader>{" "}
          <CardContent className="space-y-3">
            <ActionButton to="/organization/profile" icon={Settings}>
              Quản lý hồ sơ tổ chức
            </ActionButton>
            <ActionButton to="/organization/management" icon={Settings}>
              Trang quản lý tổng hợp
            </ActionButton>
            <ActionButton to="/organization/events" icon={Calendar}>
              Quản lý sự kiện
            </ActionButton>
            <ActionButton to="/organization/volunteers" icon={Users}>
              Quản lý tình nguyện viên
            </ActionButton>
            <ActionButton to="/volunteers" icon={UserPlus}>
              Danh sách tình nguyện viên
            </ActionButton>
            <ActionButton
              to="/organization/reports"
              icon={BarChart3}
              variant="outline"
            >
              Báo cáo dữ liệu
            </ActionButton>
          </CardContent>
        </Card>

        {/* Coordinator Management */}
        <Card>
          <CardHeader>
            <CardTitle>Quản lý Coordinators</CardTitle>
            <CardDescription>Điều phối và quản lý coordinator</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ActionButton to="/organization/coordinators" icon={UserPlus}>
              Lịch trình Coordinators
            </ActionButton>
            <ActionButton to="/organization/coordinator-tasks" icon={Settings}>
              Nhiệm vụ Coordinators
            </ActionButton>
            <ActionButton
              to="/organization/certificates"
              icon={Award}
              variant="outline"
            >
              Quản lý chứng chỉ
            </ActionButton>
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
                <StatusBadge variant="success">Thành công</StatusBadge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Khám sức khỏe cộng đồng</h4>
                  <p className="text-sm text-gray-600">
                    32 tình nguyện viên • Đang diễn ra
                  </p>
                </div>
                <StatusBadge variant="active">Đang diễn ra</StatusBadge>
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
                <StatusBadge variant="warning">4.8/5</StatusBadge>
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
