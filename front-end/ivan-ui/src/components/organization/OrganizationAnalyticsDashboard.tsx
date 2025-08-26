import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ChartContainer, type ChartConfig } from "../ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  TrendingUp,
  RefreshCw,
  Calendar,
  Users,
  Building2,
  UserCheck,
  Star,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { analyticsService } from "../../services/analyticsService";
import type { OrganizationDashboardDto } from "../../types/analytics";
import { TimePeriod } from "../../types/analytics";
import { StatsCard } from "../common/StatsCard";

const CHART_COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#f97316", // orange
];

const eventCategoryConfig: ChartConfig = {
  eventCount: {
    label: "Events",
    color: CHART_COLORS[0],
  },
  volunteerCount: {
    label: "Volunteers",
    color: CHART_COLORS[1],
  },
};

const OrganizationAnalyticsDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] =
    useState<OrganizationDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(
    TimePeriod.Last30Days
  );

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getOrganizationDashboard(timePeriod);
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to fetch organization dashboard data:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timePeriod]);

  const handleTimePeriodChange = (value: TimePeriod) => {
    setTimePeriod(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-lg backdrop-blur-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mr-3"></div>
        <span className="text-emerald-800 dark:text-emerald-200 font-medium">Loading analytics data...</span>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-gray-950 dark:via-slate-950 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg backdrop-blur-sm">
        <p className="text-gray-600 dark:text-gray-400 font-medium">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-violet-950 dark:via-indigo-950 dark:to-blue-950 rounded-xl p-6 border border-violet-200 dark:border-violet-800 shadow-lg backdrop-blur-sm">
      {/* Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-purple-100 via-violet-100 to-indigo-100 dark:from-purple-900 dark:via-violet-900 dark:to-indigo-900 rounded-lg p-4 border border-purple-200 dark:border-purple-800 shadow-md">
        <div>
          <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100">Phân tích tổ chức</h2>
          <p className="text-purple-700 dark:text-purple-300">
            Theo dõi hiệu suất và tác động của tổ chức bạn
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timePeriod.toString()} onValueChange={(value) => handleTimePeriodChange(parseInt(value) as TimePeriod)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TimePeriod.Last7Days.toString()}>7 ngày qua</SelectItem>
              <SelectItem value={TimePeriod.Last30Days.toString()}>
                30 ngày qua
              </SelectItem>
              <SelectItem value={TimePeriod.Last3Months.toString()}>
                3 tháng qua
              </SelectItem>
              <SelectItem value={TimePeriod.LastYear.toString()}>Năm qua</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchDashboardData} variant="outline" size="sm">
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 rounded-lg border border-blue-200 dark:border-blue-800 shadow-md">
          <StatsCard
            title="Tổng số sự kiện"
            value={dashboardData.myTotalEvents}
            icon={Calendar}
            description={`${dashboardData.myActiveEvents} đang hoạt động`}
          />
        </div>
        <div className="bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 dark:from-green-900 dark:via-emerald-900 dark:to-teal-900 rounded-lg border border-green-200 dark:border-green-800 shadow-md">
          <StatsCard
            title="Tình nguyện viên tiếp cận"
            value={dashboardData.totalVolunteersReached}
            icon={Users}
          />
        </div>
        <div className="bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 dark:from-yellow-900 dark:via-amber-900 dark:to-orange-900 rounded-lg border border-yellow-200 dark:border-yellow-800 shadow-md">
          <StatsCard
            title="Giờ tình nguyện"
            value={dashboardData.totalVolunteerHours.toLocaleString()}
            icon={UserCheck}
            description="Tổng đóng góp"
          />
        </div>
        <div className="bg-gradient-to-br from-pink-100 via-rose-100 to-red-100 dark:from-pink-900 dark:via-rose-900 dark:to-red-900 rounded-lg border border-pink-200 dark:border-pink-800 shadow-md">
          <StatsCard
            title="Đánh giá trung bình"
            value={dashboardData.averageEventRating.toFixed(1)}
            icon={Star}
            description="Sự hài lòng sự kiện"
          />
        </div>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-purple-100 via-violet-100 to-indigo-100 dark:from-purple-900 dark:via-violet-900 dark:to-indigo-900 border border-purple-200 dark:border-purple-800 shadow-md">
          <TabsTrigger value="events" className="text-purple-800 dark:text-purple-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-200 data-[state=active]:to-violet-200 dark:data-[state=active]:from-purple-800 dark:data-[state=active]:to-violet-800">Phân tích sự kiện</TabsTrigger>
          <TabsTrigger value="registrations" className="text-purple-800 dark:text-purple-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-200 data-[state=active]:to-violet-200 dark:data-[state=active]:from-purple-800 dark:data-[state=active]:to-violet-800">
            Phân tích đăng ký
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Events by Category */}
            <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-t-lg border-b border-blue-200 dark:border-blue-800">
                <CardTitle className="text-blue-900 dark:text-blue-100">Sự kiện theo danh mục</CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-300">
                  Phân bố sự kiện theo các danh mục khác nhau
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={eventCategoryConfig}
                  className="h-[300px]"
                >
                  <PieChart width={500} height={300}>
                    <Pie
                      data={dashboardData.eventsByCategory.map(
                        (item, index) => ({
                          name: item.categoryName,
                          value: item.eventCount,
                          fill: CHART_COLORS[index % CHART_COLORS.length],
                        })
                      )}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      dataKey="value"
                    />
                    <Tooltip />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Volunteer Participation by Category */}
            <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950 border border-green-200 dark:border-green-800 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-t-lg border-b border-green-200 dark:border-green-800">
                <CardTitle className="text-green-900 dark:text-green-100">Sự tham gia của tình nguyện viên</CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300">
                  Số lượng tình nguyện viên theo danh mục sự kiện
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={eventCategoryConfig}
                  className="h-[300px]"
                >
                  <BarChart
                    data={dashboardData.eventsByCategory}
                    width={500}
                    height={300}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoryName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="volunteerCount"
                      fill={CHART_COLORS[1]}
                      name="Volunteers"
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="registrations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Registration Status */}
            <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950 border border-orange-200 dark:border-orange-800 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900 rounded-t-lg border-b border-orange-200 dark:border-orange-800">
                <CardTitle className="text-orange-900 dark:text-orange-100">Trạng thái đăng ký</CardTitle>
                <CardDescription className="text-orange-700 dark:text-orange-300">
                  Trạng thái đăng ký hiện tại cho các sự kiện
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={eventCategoryConfig}
                  className="h-[300px]"
                >
                  <PieChart width={500} height={300}>
                    <Pie
                      data={[
                        {
                          name: "Approved",
                          value: dashboardData.approvedRegistrations,
                          fill: CHART_COLORS[1],
                        },
                        {
                          name: "Pending",
                          value: dashboardData.pendingRegistrations,
                          fill: CHART_COLORS[2],
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      dataKey="value"
                    />
                    <Tooltip />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Recent Events */}
            <Card className="bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-pink-950 dark:via-rose-950 dark:to-red-950 border border-pink-200 dark:border-pink-800 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900 dark:to-rose-900 rounded-t-lg border-b border-pink-200 dark:border-pink-800">
                <CardTitle className="text-pink-900 dark:text-pink-100">Sự kiện gần đây</CardTitle>
                <CardDescription className="text-pink-700 dark:text-pink-300">
                  Các sự kiện mới nhất của tổ chức bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.recentEvents.slice(0, 5).map((event) => (
                    <div
                      key={event.eventId}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-100 via-rose-100 to-red-100 dark:from-pink-900 dark:via-rose-900 dark:to-red-900 rounded-lg border border-pink-200 dark:border-pink-800 shadow-sm"
                    >
                      <div>
                        <h4 className="font-medium text-pink-900 dark:text-pink-100">{event.eventName}</h4>
                        <p className="text-sm text-pink-700 dark:text-pink-300">
                          {new Date(event.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-pink-200 text-pink-800 dark:bg-pink-800 dark:text-pink-200">{event.status}</Badge>
                    </div>
                  ))}
                  {dashboardData.recentEvents.length === 0 && (
                    <p className="text-center text-pink-600 dark:text-pink-400 py-4 font-medium">
                      No recent events found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationAnalyticsDashboard;
