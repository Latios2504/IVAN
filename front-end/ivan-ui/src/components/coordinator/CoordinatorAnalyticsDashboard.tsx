import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { StatsCard } from "../common/StatsCard";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Calendar,
  ClipboardList,
  CheckCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import type { CoordinatorDashboardDto } from "../../types/analytics";
import { TimePeriod } from "../../types/analytics";
import { analyticsService } from "../../services/analyticsService";

interface CoordinatorAnalyticsDashboardProps {
  className?: string;
}

export const CoordinatorAnalyticsDashboard: React.FC<
  CoordinatorAnalyticsDashboardProps
> = ({ className }) => {
  const [dashboardData, setDashboardData] =
    useState<CoordinatorDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(
    TimePeriod.Last30Days
  );

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getCoordinatorDashboard(timePeriod);
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching coordinator dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timePeriod]);

  const getTimePeriodLabel = (period: TimePeriod): string => {
    switch (period) {
      case TimePeriod.Last7Days:
        return "7 ngày qua";
      case TimePeriod.Last30Days:
        return "30 ngày qua";
      case TimePeriod.Last3Months:
        return "3 tháng qua";
      case TimePeriod.Last6Months:
        return "6 tháng qua";
      case TimePeriod.LastYear:
        return "1 năm qua";
      default:
        return "30 ngày qua";
    }
  };

  const taskStatusColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <LoadingState loading={loading} count={8} />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <EmptyState
          icon={TrendingUp}
          title="Không thể tải dữ liệu"
          description="Không thể tải dữ liệu phân tích"
          show={true}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-50/80 via-indigo-50/80 to-blue-50/80 dark:from-violet-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 p-6 rounded-2xl border border-violet-200/50 dark:border-violet-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 dark:from-violet-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
            Phân tích Coordinator
          </h2>
          <p className="bg-gradient-to-r from-violet-700 to-indigo-700 dark:from-violet-300 dark:to-indigo-300 bg-clip-text text-transparent font-medium">
            Theo dõi hiệu suất quản lý và điều phối
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={timePeriod.toString()}
            onValueChange={(value) =>
              setTimePeriod(parseInt(value) as TimePeriod)
            }
          >
            <SelectTrigger className="w-40 bg-gradient-to-r from-white/80 to-violet-50/80 dark:from-gray-800/80 dark:to-violet-950/80 border-violet-200/50 dark:border-violet-800/50 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gradient-to-br from-white/95 to-violet-50/95 dark:from-gray-900/95 dark:to-violet-950/95 border-violet-200/50 dark:border-violet-800/50">
              <SelectItem
                value={TimePeriod.Last7Days.toString()}
                className="hover:bg-gradient-to-r hover:from-violet-50 hover:to-indigo-50 dark:hover:from-violet-950/50 dark:hover:to-indigo-950/50"
              >
                7 ngày qua
              </SelectItem>
              <SelectItem
                value={TimePeriod.Last30Days.toString()}
                className="hover:bg-gradient-to-r hover:from-violet-50 hover:to-indigo-50 dark:hover:from-violet-950/50 dark:hover:to-indigo-950/50"
              >
                30 ngày qua
              </SelectItem>
              <SelectItem
                value={TimePeriod.Last3Months.toString()}
                className="hover:bg-gradient-to-r hover:from-violet-50 hover:to-indigo-50 dark:hover:from-violet-950/50 dark:hover:to-indigo-950/50"
              >
                3 tháng qua
              </SelectItem>
              <SelectItem
                value={TimePeriod.Last6Months.toString()}
                className="hover:bg-gradient-to-r hover:from-violet-50 hover:to-indigo-50 dark:hover:from-violet-950/50 dark:hover:to-indigo-950/50"
              >
                6 tháng qua
              </SelectItem>
              <SelectItem
                value={TimePeriod.LastYear.toString()}
                className="hover:bg-gradient-to-r hover:from-violet-50 hover:to-indigo-50 dark:hover:from-violet-950/50 dark:hover:to-indigo-950/50"
              >
                1 năm qua
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={fetchDashboardData}
            variant="outline"
            size="sm"
            className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Sự kiện quản lý"
          value={dashboardData.eventsManaged}
          icon={Calendar}
          description={`${dashboardData.upcomingEvents} sự kiện sắp tới`}
        />
        <StatsCard
          title="Tình nguyện viên quản lý"
          value={dashboardData.volunteersManaged}
          icon={Users}
          description="Đang điều phối"
        />
        <StatsCard
          title="Nhiệm vụ được giao"
          value={dashboardData.tasksAssigned}
          icon={ClipboardList}
          description={`${dashboardData.tasksCompleted} hoàn thành`}
        />
        <StatsCard
          title="Tỷ lệ hoàn thành"
          value={`${Math.round(dashboardData.taskCompletionRate * 100)}%`}
          icon={CheckCircle}
          description="Hiệu suất nhiệm vụ"
        />
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-emerald-50/80 via-teal-50/80 to-cyan-50/80 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 border border-emerald-200/50 dark:border-emerald-800/50 p-1 rounded-xl">
          <TabsTrigger
            value="tasks"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 transition-all duration-300 rounded-lg"
          >
            Phân tích Nhiệm vụ
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 transition-all duration-300 rounded-lg"
          >
            Hiệu suất
          </TabsTrigger>
          <TabsTrigger
            value="volunteers"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 transition-all duration-300 rounded-lg"
          >
            Tình nguyện viên
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tasks by Status */}
            <Card className="bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Nhiệm vụ theo trạng thái
                </CardTitle>
                <CardDescription className="bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent font-medium">
                  Phân bố trạng thái các nhiệm vụ được giao
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.tasksByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {dashboardData.tasksByStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            taskStatusColors[index % taskStatusColors.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Task Completion Summary */}
            <Card className="bg-gradient-to-br from-green-50/80 via-emerald-50/80 to-teal-50/80 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border border-green-200/50 dark:border-green-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Tóm tắt nhiệm vụ
                </CardTitle>
                <CardDescription className="bg-gradient-to-r from-green-700 to-teal-700 dark:from-green-300 dark:to-teal-300 bg-clip-text text-transparent font-medium">
                  Chi tiết về tiến độ nhiệm vụ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl border border-blue-200/30 dark:border-blue-800/30">
                  <span className="font-medium bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                    Tổng nhiệm vụ
                  </span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    {dashboardData.tasksAssigned}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/50 dark:to-emerald-950/50 rounded-xl border border-green-200/30 dark:border-green-800/30">
                  <span className="font-medium bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent">
                    Đã hoàn thành
                  </span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                    {dashboardData.tasksCompleted}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 dark:from-yellow-950/50 dark:to-orange-950/50 rounded-xl border border-yellow-200/30 dark:border-yellow-800/30">
                  <span className="font-medium bg-gradient-to-r from-yellow-700 to-orange-700 dark:from-yellow-300 dark:to-orange-300 bg-clip-text text-transparent">
                    Chờ duyệt
                  </span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
                    {dashboardData.pendingApprovals}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-950/50 dark:to-pink-950/50 rounded-xl border border-purple-200/30 dark:border-purple-800/30">
                  <span className="font-medium bg-gradient-to-r from-purple-700 to-pink-700 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
                    Tỷ lệ hoàn thành
                  </span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    {Math.round(dashboardData.taskCompletionRate * 100)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card className="bg-gradient-to-br from-rose-50/80 via-pink-50/80 to-fuchsia-50/80 dark:from-rose-950/30 dark:via-pink-950/30 dark:to-fuchsia-950/30 border border-rose-200/50 dark:border-rose-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-rose-600 to-fuchsia-600 dark:from-rose-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                  Chỉ số hiệu suất
                </CardTitle>
                <CardDescription className="bg-gradient-to-r from-rose-700 to-fuchsia-700 dark:from-rose-300 dark:to-fuchsia-300 bg-clip-text text-transparent font-medium">
                  Đánh giá tổng quan về hiệu suất quản lý
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Tỷ lệ hoàn thành nhiệm vụ
                    </span>
                    <span className="text-sm text-gray-600">
                      {Math.round(dashboardData.taskCompletionRate * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full shadow-sm"
                      style={{
                        width: `${dashboardData.taskCompletionRate * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Hiệu suất quản lý sự kiện
                    </span>
                    <span className="text-sm text-gray-600">
                      {dashboardData.eventsManaged > 0
                        ? Math.round(
                            (dashboardData.eventsManaged /
                              (dashboardData.eventsManaged +
                                dashboardData.upcomingEvents)) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full shadow-sm"
                      style={{
                        width: `${
                          dashboardData.eventsManaged > 0
                            ? (dashboardData.eventsManaged /
                                (dashboardData.eventsManaged +
                                  dashboardData.upcomingEvents)) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Performance Indicators */}
            <Card className="bg-gradient-to-br from-amber-50/80 via-orange-50/80 to-red-50/80 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-red-950/30 border border-amber-200/50 dark:border-amber-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-amber-600 to-red-600 dark:from-amber-400 dark:to-red-400 bg-clip-text text-transparent">
                  Chỉ số KPI
                </CardTitle>
                <CardDescription className="bg-gradient-to-r from-amber-700 to-red-700 dark:from-amber-300 dark:to-red-300 bg-clip-text text-transparent font-medium">
                  Các chỉ số quan trọng trong {getTimePeriodLabel(timePeriod)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl border border-blue-200/30 dark:border-blue-800/30">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                      {dashboardData.eventsManaged}
                    </div>
                    <div className="text-sm bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent font-medium">
                      Sự kiện
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-950/50 dark:to-emerald-950/50 rounded-xl border border-green-200/30 dark:border-green-800/30">
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                      {dashboardData.volunteersManaged}
                    </div>
                    <div className="text-sm bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent font-medium">
                      Tình nguyện viên
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-yellow-50/80 to-orange-50/80 dark:from-yellow-950/50 dark:to-orange-950/50 rounded-xl border border-yellow-200/30 dark:border-yellow-800/30">
                    <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
                      {dashboardData.tasksAssigned}
                    </div>
                    <div className="text-sm bg-gradient-to-r from-yellow-700 to-orange-700 dark:from-yellow-300 dark:to-orange-300 bg-clip-text text-transparent font-medium">
                      Nhiệm vụ giao
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-950/50 dark:to-pink-950/50 rounded-xl border border-purple-200/30 dark:border-purple-800/30">
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                      {dashboardData.pendingApprovals}
                    </div>
                    <div className="text-sm bg-gradient-to-r from-purple-700 to-pink-700 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent font-medium">
                      Chờ duyệt
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="volunteers" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Top Volunteers */}
            <Card className="bg-gradient-to-br from-teal-50/80 via-cyan-50/80 to-blue-50/80 dark:from-teal-950/30 dark:via-cyan-950/30 dark:to-blue-950/30 border border-teal-200/50 dark:border-teal-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Tình nguyện viên xuất sắc
                </CardTitle>
                <CardDescription className="bg-gradient-to-r from-teal-700 to-blue-700 dark:from-teal-300 dark:to-blue-300 bg-clip-text text-transparent font-medium">
                  Danh sách tình nguyện viên có hiệu suất cao nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.topVolunteers &&
                dashboardData.topVolunteers.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.topVolunteers.map((volunteer, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-900/50 dark:to-blue-900/50 rounded-xl border border-gray-200/30 dark:border-gray-700/30 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100/80 to-indigo-100/80 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-full flex items-center justify-center border border-blue-200/30 dark:border-blue-800/30">
                            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                              {volunteer.volunteerName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase() || "N/A"}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium bg-gradient-to-r from-gray-900 to-blue-900 dark:from-gray-100 dark:to-blue-100 bg-clip-text text-transparent">
                              {volunteer.volunteerName || "Tên không xác định"}
                            </h4>
                            <p className="text-sm bg-gradient-to-r from-gray-600 to-blue-600 dark:from-gray-400 dark:to-blue-400 bg-clip-text text-transparent">
                              {volunteer.tasksCompleted || 0} nhiệm vụ hoàn
                              thành •{volunteer.hoursWorked || 0} giờ làm việc
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            {volunteer.rating
                              ? `${Math.round(volunteer.rating * 20)}%`
                              : "N/A"}
                          </div>
                          <div className="text-sm bg-gradient-to-r from-gray-600 to-blue-600 dark:from-gray-400 dark:to-blue-400 bg-clip-text text-transparent">
                            Điểm hiệu suất
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Users}
                    title="Chưa có dữ liệu"
                    description="Chưa có dữ liệu tình nguyện viên"
                    show={true}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoordinatorAnalyticsDashboard;
