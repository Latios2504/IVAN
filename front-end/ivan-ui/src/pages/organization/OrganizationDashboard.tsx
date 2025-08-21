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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActionButton } from "@/components/dashboard/ActionButton";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import OrganizationAnalyticsDashboard from "@/components/organization/OrganizationAnalyticsDashboard";
import {
  Users,
  Calendar,
  BarChart3,
  Award,
  UserPlus,
  Settings,
  HeartHandshake,
  MessageSquare,
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-violet-950/40 dark:via-indigo-950/40 dark:to-blue-950/40">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-violet-50/80 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-violet-950/30 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg backdrop-blur-sm">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent mb-2">
            Quản lý tổ chức
          </h1>
          <p className="text-blue-700/80 dark:text-blue-300/80 text-lg">
            Điều hành hoạt động tình nguyện và quản lý tình nguyện viên
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12 bg-gradient-to-r from-emerald-50/80 via-teal-50/80 to-cyan-50/80 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50 shadow-lg backdrop-blur-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
            <span className="ml-3 text-emerald-700 dark:text-emerald-300">Đang tải dữ liệu...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50/80 via-rose-50/80 to-pink-50/80 dark:from-red-950/30 dark:via-rose-950/30 dark:to-pink-950/30 border border-red-200/50 dark:border-red-800/50 text-red-700 dark:text-red-300 rounded-2xl shadow-lg backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>
              Không thể tải thông tin thống kê: {error}
            </div>
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

        {/* Main Content Tabs */}
        <Tabs defaultValue="management" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-purple-50/80 via-violet-50/80 to-indigo-50/80 dark:from-purple-950/30 dark:via-violet-950/30 dark:to-indigo-950/30 border border-purple-200/50 dark:border-purple-800/50 shadow-lg backdrop-blur-sm">
            <TabsTrigger value="management" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-lg">Management</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg">Analytics</TabsTrigger>
          </TabsList>

        <TabsContent value="management" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Management Links */}
        <Card className="bg-gradient-to-br from-green-50/80 via-emerald-50/80 to-teal-50/80 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border border-green-200/50 dark:border-green-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b border-green-200/50 dark:border-green-800/50">
            <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Quản lý chính
            </CardTitle>
            <CardDescription className="text-green-700/80 dark:text-green-300/80">
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
        <Card className="bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border border-blue-200/50 dark:border-blue-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b border-blue-200/50 dark:border-blue-800/50">
            <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Quản lý Coordinators
            </CardTitle>
            <CardDescription className="text-blue-700/80 dark:text-blue-300/80">Điều phối và quản lý coordinator</CardDescription>
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
              to="/organization/event-feedback"
              icon={MessageSquare}
            >
              Quản lý phản hồi sự kiện
            </ActionButton>
            <ActionButton to="/organization/certificates" icon={Award}>
              Quản lý chứng chỉ
            </ActionButton>
            <ActionButton
              to="/organization/certificate-templates"
              icon={Award}
              variant="outline"
            >
              Quản lý mẫu chứng chỉ
            </ActionButton>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card className="bg-gradient-to-br from-orange-50/80 via-amber-50/80 to-yellow-50/80 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-950/30 border border-orange-200/50 dark:border-orange-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b border-orange-200/50 dark:border-orange-800/50">
            <CardTitle className="text-orange-800 dark:text-orange-200 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Sự kiện gần đây
            </CardTitle>
            <CardDescription className="text-orange-700/80 dark:text-orange-300/80">Các sự kiện đã và đang diễn ra</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/40 dark:to-emerald-950/40 rounded-xl border border-green-200/50 dark:border-green-800/50 shadow-sm">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">Chương trình giáo dục trẻ em</h4>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    45 tình nguyện viên • Hoàn thành
                  </p>
                </div>
                <StatusBadge variant="success">Thành công</StatusBadge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-950/40 dark:to-cyan-950/40 rounded-xl border border-blue-200/50 dark:border-blue-800/50 shadow-sm">
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">Khám sức khỏe cộng đồng</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
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
        <Card className="bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-rose-50/80 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30 border border-purple-200/50 dark:border-purple-800/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b border-purple-200/50 dark:border-purple-800/50">
            <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Thống kê tình nguyện viên
            </CardTitle>
            <CardDescription className="text-purple-700/80 dark:text-purple-300/80">
              Tổng quan về đội ngũ tình nguyện viên
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200/30 dark:border-purple-800/30">
                <span className="text-sm text-purple-700 dark:text-purple-300">Tình nguyện viên mới</span>
                <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  {loading
                    ? "..."
                    : `+${orgStats?.newVolunteersThisMonth || 0} tháng này`}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-blue-200/30 dark:border-blue-800/30">
                <span className="text-sm text-blue-700 dark:text-blue-300">Đang hoạt động</span>
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                  {loading ? "..." : `${orgStats?.totalVolunteers || 0} người`}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200/30 dark:border-green-800/30">
                <span className="text-sm text-green-700 dark:text-green-300">Giờ tình nguyện tháng này</span>
                <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                  {loading
                    ? "..."
                    : `${orgStats?.hoursThisMonth?.toLocaleString() || 0} giờ`}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border border-yellow-200/30 dark:border-yellow-800/30">
                <span className="text-sm text-yellow-700 dark:text-yellow-300">Đánh giá trung bình</span>
                <StatusBadge variant="warning" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                  {loading ? "..." : `${orgStats?.averageRating || 0}/5`}
                </StatusBadge>
              </div>
            </div>
          </CardContent>
        </Card>
          </div>
        </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <OrganizationAnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
