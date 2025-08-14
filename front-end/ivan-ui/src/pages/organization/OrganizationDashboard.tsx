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
  HeartHandshake,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function OrganizationDashboard() {
  const { user } = useAuth();

  // Mock organization stats
  const orgStats = {
    totalEvents: 45,
    totalVolunteers: 230,
    activeEvents: 8,
    completedEvents: 37,
    totalHours: 4850,
    newVolunteersThisMonth: 15,
    totalCoordinators: 8,
    certificatesIssued: 125,
    hoursThisMonth: 320,
    averageRating: 4.7,
  };
  const loading = false;
  const error = null;

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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          Không thể tải thông tin thống kê: {error}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Tình nguyện viên"
          value={loading ? "..." : orgStats?.totalVolunteers || 0}
          icon={Users}
          trend={{
            value: loading
              ? "..."
              : `+${orgStats?.newVolunteersThisMonth || 0} tháng này`,
          }}
        />
        <StatsCard
          title="Sự kiện hoạt động"
          value={loading ? "..." : orgStats?.activeEvents || 0}
          icon={Calendar}
          trend={{ value: "Đang diễn ra" }}
        />
        <StatsCard
          title="Coordinators"
          value={loading ? "..." : orgStats?.totalCoordinators || 0}
          icon={UserPlus}
          description="Đang hoạt động"
        />
        <StatsCard
          title="Chứng chỉ cấp"
          value={loading ? "..." : orgStats?.certificatesIssued || 0}
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
            <ActionButton
              to="/organization/event-registrations"
              icon={UserPlus}
            >
              Quản lý đăng ký sự kiện
            </ActionButton>
            <ActionButton
              to="/organization/volunteer-coordinators"
              icon={UserPlus}
            >
              Quản lý Coordinators
            </ActionButton>
            <ActionButton
              to="/organization/support-requests"
              icon={HeartHandshake}
            >
              Yêu cầu Từ thiện
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
            <ActionButton
              to="/organization/volunteer-coordinators"
              icon={UserPlus}
            >
              Quản lý Coordinators
            </ActionButton>
            <ActionButton
              to="/organization/coordinator-schedule"
              icon={Calendar}
            >
              Lịch trình Coordinators
            </ActionButton>
            <ActionButton to="/organization/coordinator-tasks" icon={Settings}>
              Nhiệm vụ Coordinators
            </ActionButton>
            <ActionButton to="/organization/event-registrations" icon={Users}>
              Quản lý đăng ký sự kiện
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
                <Badge variant="secondary">
                  {loading
                    ? "..."
                    : `+${orgStats?.newVolunteersThisMonth || 0} tháng này`}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Đang hoạt động</span>
                <Badge variant="secondary">
                  {loading ? "..." : `${orgStats?.totalVolunteers || 0} người`}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Giờ tình nguyện tháng này</span>
                <Badge variant="secondary">
                  {loading
                    ? "..."
                    : `${orgStats?.hoursThisMonth?.toLocaleString() || 0} giờ`}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Đánh giá trung bình</span>
                <StatusBadge variant="warning">
                  {loading ? "..." : `${orgStats?.averageRating || 0}/5`}
                </StatusBadge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
