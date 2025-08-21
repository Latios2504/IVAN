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
import { CoordinatorAnalyticsDashboard } from "@/components/coordinator/CoordinatorAnalyticsDashboard";
import {
  Users,
  Calendar,
  UserCheck,
  Settings,
  ClipboardList,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function CoordinatorDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 p-6 bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          Dashboard Coordinator
        </h1>
        <p className="bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent font-medium">
          Quản lý lịch trình và điều phối tình nguyện viên
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="management" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-gray-100/80 to-blue-100/80 dark:from-gray-800/80 dark:to-blue-800/80 border border-gray-200/50 dark:border-gray-700/50">
          <TabsTrigger value="management" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-200">Quản lý</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-200">Phân tích</TabsTrigger>
        </TabsList>

        <TabsContent value="management" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <Card className="bg-gradient-to-br from-white/80 via-blue-50/30 to-indigo-50/30 dark:from-gray-900/80 dark:via-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-t-lg">
            <CardTitle className="bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">Quản lý lịch trình</CardTitle>
            <CardDescription className="text-blue-600/80 dark:text-blue-400/80">
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
        <Card className="bg-gradient-to-br from-white/80 via-green-50/30 to-emerald-50/30 dark:from-gray-900/80 dark:via-green-950/30 dark:to-emerald-950/30 border border-green-200/50 dark:border-green-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-t-lg">
            <CardTitle className="bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent">Quản lý đăng ký sự kiện</CardTitle>
            <CardDescription className="text-green-600/80 dark:text-green-400/80">
              Xử lý đăng ký của tình nguyện viên cho các sự kiện được phân công
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border border-green-200/50 dark:border-green-800/50">
                <div>
                  <span className="font-medium bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent">Đã duyệt</span>
                  <p className="text-sm text-green-600/80 dark:text-green-400/80">16 đăng ký</p>
                </div>
                <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-800 text-green-800 dark:text-green-200 border border-green-200/50 dark:border-green-700/50">16</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 dark:from-yellow-950/50 dark:to-orange-950/50 rounded-lg border border-yellow-200/50 dark:border-yellow-800/50">
                <div>
                  <span className="font-medium bg-gradient-to-r from-yellow-700 to-orange-700 dark:from-yellow-300 dark:to-orange-300 bg-clip-text text-transparent">Chờ duyệt</span>
                  <p className="text-sm text-yellow-600/80 dark:text-yellow-400/80">8 đăng ký mới</p>
                </div>
                <StatusBadge variant="warning">8</StatusBadge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50/80 to-pink-50/80 dark:from-red-950/50 dark:to-pink-950/50 rounded-lg border border-red-200/50 dark:border-red-800/50">
                <div>
                  <span className="font-medium bg-gradient-to-r from-red-700 to-pink-700 dark:from-red-300 dark:to-pink-300 bg-clip-text text-transparent">Từ chối</span>
                  <p className="text-sm text-red-600/80 dark:text-red-400/80">2 đăng ký</p>
                </div>
                <StatusBadge variant="error">2</StatusBadge>
              </div>
            </div>
            <div className="text-center py-2">
              <span className="text-sm text-muted-foreground">
                Tính năng đang phát triển
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Volunteers */}
        <Card className="bg-gradient-to-br from-white/80 via-purple-50/30 to-pink-50/30 dark:from-gray-900/80 dark:via-purple-950/30 dark:to-pink-950/30 border border-purple-200/50 dark:border-purple-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-t-lg">
            <CardTitle className="bg-gradient-to-r from-purple-700 to-pink-700 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">Tình nguyện viên phụ trách</CardTitle>
            <CardDescription className="text-purple-600/80 dark:text-purple-400/80">
              Danh sách tình nguyện viên bạn đang điều phối
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 rounded-full flex items-center justify-center border border-blue-200/50 dark:border-blue-700/50">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-300">NA</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">Nguyễn Văn An</h4>
                  <p className="text-sm text-blue-600/80 dark:text-blue-400/80">Lập trình, Giảng dạy</p>
                </div>
                <Badge variant="outline" className="border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400">Online</Badge>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border border-green-200/50 dark:border-green-800/50">
                <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-800 rounded-full flex items-center justify-center border border-green-200/50 dark:border-green-700/50">
                  <span className="text-sm font-medium text-green-600 dark:text-green-300">TB</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent">Trần Thị Bình</h4>
                  <p className="text-sm text-green-600/80 dark:text-green-400/80">Giảng dạy, Tổ chức</p>
                </div>
                <Badge variant="outline" className="border-green-200 dark:border-green-700 text-green-600 dark:text-green-400">Hoạt động</Badge>
              </div>
            </div>
            <div className="text-center py-2">
              <span className="text-sm text-muted-foreground">
                Tính năng đang phát triển
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-white/80 via-orange-50/30 to-amber-50/30 dark:from-gray-900/80 dark:via-orange-950/30 dark:to-amber-950/30 border border-orange-200/50 dark:border-orange-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-950/50 dark:to-amber-950/50 rounded-t-lg">
            <CardTitle className="bg-gradient-to-r from-orange-700 to-amber-700 dark:from-orange-300 dark:to-amber-300 bg-clip-text text-transparent">Hành động nhanh</CardTitle>
            <CardDescription className="text-orange-600/80 dark:text-orange-400/80">
              Các tác vụ thường dùng của coordinator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ActionButton to="/coordinator/schedule" icon={Calendar}>
              Quản lý lịch trình tình nguyện viên
            </ActionButton>
            <ActionButton to="/coordinator/onsite-tasks" icon={ClipboardList}>
              Quản lý nhiệm vụ tại chỗ
            </ActionButton>
            <ActionButton to="/coordinator/my-tasks" icon={Settings}>
              Xem nhiệm vụ của tôi
            </ActionButton>
            <ActionButton to="/organization/certificates" icon={Award}>
              Xem chứng chỉ sự kiện
            </ActionButton>
            <Button variant="outline" className="w-full" disabled>
              <UserCheck className="w-4 h-4 mr-2" />
              Duyệt đăng ký mới (Sắp có)
            </Button>
            <ActionButton to="/profile" icon={Settings} variant="outline">
              Cập nhật thông tin
            </ActionButton>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="analytics">
          <CoordinatorAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
