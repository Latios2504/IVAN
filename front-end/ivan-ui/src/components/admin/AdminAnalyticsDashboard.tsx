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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { RefreshCw, Calendar, Users, Building2, UserCheck } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { analyticsService } from "../../services/analyticsService";
import type { AdminDashboardDto } from "../../types/analytics";
import { TimePeriod } from "../../types/analytics";
import { StatsCard } from "../common/StatsCard";

const AdminAnalyticsDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardDto | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(
    TimePeriod.Last30Days
  );

  useEffect(() => {
    fetchAnalyticsData();
  }, [timePeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getAdminDashboard(timePeriod);
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      toast.error("Không thể tải dữ liệu phân tích");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchAnalyticsData();
    toast.info("Đang làm mới dữ liệu phân tích...");
  };

  const handleTimePeriodChange = (value: TimePeriod) => {
    setTimePeriod(value);
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải dữ liệu phân tích...</span>
      </div>
    );
  }

  // Chart configurations - expanded color palette for better visibility
  const CHART_COLORS = [
    "#3B82F6", // Bright Blue
    "#10B981", // Emerald Green
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
    "#F97316", // Orange
    "#84CC16", // Lime
    "#EC4899", // Pink
    "#6366F1", // Indigo
    "#14B8A6", // Teal
    "#F43F5E", // Rose
    "#A855F7", // Violet
    "#22C55E", // Green
    "#FB923C", // Orange-400
  ];

  const userGrowthConfig: ChartConfig = {
    volunteers: {
      label: "Tình nguyện viên",
      color: CHART_COLORS[0],
    },
    coordinators: {
      label: "Điều phối viên",
      color: CHART_COLORS[1],
    },
  };

  const eventTrendsConfig: ChartConfig = {
    events: {
      label: "Sự kiện",
      color: CHART_COLORS[0],
    },
    registrations: {
      label: "Đăng ký",
      color: CHART_COLORS[1],
    },
  };

  const organizationDistributionConfig: ChartConfig = {
    ngo: {
      label: "Tổ chức NGO",
      color: CHART_COLORS[0],
    },
    government: {
      label: "Cơ quan chính phủ",
      color: CHART_COLORS[1],
    },
    private: {
      label: "Tổ chức tư nhân",
      color: CHART_COLORS[2],
    },
  };

  const roleDistributionConfig: ChartConfig = {
    volunteer: {
      label: "Tình nguyện viên",
      color: CHART_COLORS[0],
    },
    coordinator: {
      label: "Điều phối viên",
      color: CHART_COLORS[1],
    },
    organization: {
      label: "Tổ chức",
      color: CHART_COLORS[2],
    },
    admin: {
      label: "Quản trị viên",
      color: CHART_COLORS[3],
    },
  };

  const categoryStatsConfig: ChartConfig = {
    category1: {
      label: "Danh mục 1",
      color: CHART_COLORS[0],
    },
    category2: {
      label: "Danh mục 2",
      color: CHART_COLORS[1],
    },
    category3: {
      label: "Danh mục 3",
      color: CHART_COLORS[2],
    },
    category4: {
      label: "Danh mục 4",
      color: CHART_COLORS[3],
    },
    category5: {
      label: "Danh mục 5",
      color: CHART_COLORS[4],
    },
    category6: {
      label: "Danh mục 6",
      color: CHART_COLORS[5],
    },
    category7: {
      label: "Danh mục 7",
      color: CHART_COLORS[6],
    },
    category8: {
      label: "Danh mục 8",
      color: CHART_COLORS[7],
    },
    category9: {
      label: "Danh mục 9",
      color: CHART_COLORS[8],
    },
    category10: {
      label: "Danh mục 10",
      color: CHART_COLORS[9],
    },
  };

  return (
    <div className="relative isolate space-y-6 p-6 bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-violet-950/40 dark:via-indigo-950/40 dark:to-blue-950/40 min-h-screen">
      {/* Hero Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-br from-violet-100/20 via-transparent to-indigo-100/20 dark:from-violet-900/10 dark:via-transparent dark:to-indigo-900/10" />
      {/* Dashboard Header */}
      <div className="relative z-10 flex justify-between items-start bg-gradient-to-r from-white/80 via-violet-50/50 to-indigo-50/50 dark:from-slate-900/80 dark:via-violet-950/50 dark:to-indigo-950/50 backdrop-blur-sm border border-violet-200/50 dark:border-violet-700/50 rounded-2xl p-6 shadow-xl shadow-violet-200/30 dark:shadow-violet-900/30">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 dark:from-violet-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
            Bảng điều khiển phân tích quản trị
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Phân tích và thông tin chi tiết toàn diện về hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={timePeriod.toString()}
            onValueChange={(value) =>
              handleTimePeriodChange(parseInt(value) as TimePeriod)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TimePeriod.Last7Days.toString()}>
                Tuần
              </SelectItem>
              <SelectItem value={TimePeriod.Last30Days.toString()}>
                Tháng
              </SelectItem>
              <SelectItem value={TimePeriod.Last3Months.toString()}>
                Quý
              </SelectItem>
              <SelectItem value={TimePeriod.LastYear.toString()}>
                Năm
              </SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refreshData} disabled={loading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      {dashboardData && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Tổng số người dùng"
            value={dashboardData.totalUsers}
            icon={Users}
            description="Tất cả người dùng trong hệ thống"
          />
          <StatsCard
            title="Tổng số sự kiện"
            value={dashboardData.totalEvents}
            icon={Calendar}
            description={`${dashboardData.totalRegistrations} đăng ký`}
          />
          <StatsCard
            title="Tổ chức"
            value={dashboardData.totalOrganizations}
            icon={Building2}
            description="Tổ chức đang hoạt động"
          />
          <StatsCard
            title="Tình nguyện viên"
            value={dashboardData.totalVolunteers}
            icon={UserCheck}
            description="Tình nguyện viên đã đăng ký"
          />
        </div>
      )}

      {/* Charts Tabs */}
      <Tabs defaultValue="users" className="relative z-10 space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-white/90 via-violet-50/50 to-indigo-50/50 dark:from-slate-900/90 dark:via-violet-950/50 dark:to-indigo-950/50 backdrop-blur-sm border border-violet-200/50 dark:border-violet-700/50 shadow-lg">
          <TabsTrigger value="users">Phân tích người dùng</TabsTrigger>
          <TabsTrigger value="events">Phân tích sự kiện</TabsTrigger>
          <TabsTrigger value="organizations">Tổ chức</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {dashboardData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
              <Card className="bg-gradient-to-br from-white/90 via-violet-50/30 to-indigo-50/30 dark:from-slate-900/90 dark:via-violet-950/30 dark:to-indigo-950/30 backdrop-blur-sm border-2 border-violet-200/50 dark:border-violet-700/50 shadow-2xl shadow-violet-200/30 dark:shadow-violet-900/30">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-slate-200 font-semibold">
                    Xu hướng tăng trưởng người dùng
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Mô hình đăng ký và tăng trưởng người dùng hàng tháng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={userGrowthConfig}
                    className="h-[300px]"
                  >
                    <LineChart
                      data={dashboardData.monthlyGrowth}
                      width={500}
                      height={300}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="totalUsers"
                        stroke={CHART_COLORS[0]}
                        strokeWidth={2}
                        name="Tổng số người dùng"
                      />
                      <Line
                        type="monotone"
                        dataKey="newUsers"
                        stroke={CHART_COLORS[1]}
                        strokeWidth={2}
                        name="Người dùng mới"
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* User Role Distribution */}
              <Card className="bg-gradient-to-br from-white/90 via-violet-50/30 to-indigo-50/30 dark:from-slate-900/90 dark:via-violet-950/30 dark:to-indigo-950/30 backdrop-blur-sm border-2 border-violet-200/50 dark:border-violet-700/50 shadow-2xl shadow-violet-200/30 dark:shadow-violet-900/30">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-slate-200 font-semibold">
                    Phân bố vai trò người dùng
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Phân bố người dùng theo loại vai trò
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={roleDistributionConfig}
                    className="h-[300px]"
                  >
                    <PieChart width={500} height={300}>
                      <Pie
                        data={dashboardData.roleDistribution.map(
                          (item, index) => ({
                            name: item.roleName,
                            value: item.userCount,
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

              {/* Geographic Distribution */}
              <Card className="lg:col-span-2 bg-gradient-to-br from-white/90 via-violet-50/30 to-indigo-50/30 dark:from-slate-900/90 dark:via-violet-950/30 dark:to-indigo-950/30 backdrop-blur-sm border-2 border-violet-200/50 dark:border-violet-700/50 shadow-2xl shadow-violet-200/30 dark:shadow-violet-900/30">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-slate-200 font-semibold">
                    Phân bố địa lý
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Phân bố người dùng theo vị trí
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={userGrowthConfig}
                    className="h-[300px]"
                  >
                    <BarChart
                      data={[
                        {
                          location: "Hà Nội",
                          userCount: Math.floor(dashboardData.totalUsers * 0.3),
                        },
                        {
                          location: "TP.HCM",
                          userCount: Math.floor(
                            dashboardData.totalUsers * 0.25
                          ),
                        },
                        {
                          location: "Đà Nẵng",
                          userCount: Math.floor(
                            dashboardData.totalUsers * 0.15
                          ),
                        },
                        {
                          location: "Khác",
                          userCount: Math.floor(dashboardData.totalUsers * 0.3),
                        },
                      ]}
                      width={500}
                      height={300}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="location" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="userCount"
                        fill={CHART_COLORS[0]}
                        name="Số lượng người dùng"
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          {dashboardData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Event Trends */}
              <Card className="bg-gradient-to-br from-white/90 via-violet-50/30 to-indigo-50/30 dark:from-slate-900/90 dark:via-violet-950/30 dark:to-indigo-950/30 backdrop-blur-sm border-2 border-violet-200/50 dark:border-violet-700/50 shadow-2xl shadow-violet-200/30 dark:shadow-violet-900/30">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-slate-200 font-semibold">
                    Xu hướng sự kiện
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Xu hướng tạo sự kiện và tham gia hàng tháng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={eventTrendsConfig}
                    className="h-[300px]"
                  >
                    <LineChart
                      data={dashboardData.monthlyGrowth}
                      width={500}
                      height={300}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="totalEvents"
                        stroke={CHART_COLORS[0]}
                        strokeWidth={2}
                        name="Tổng số sự kiện"
                      />
                      <Line
                        type="monotone"
                        dataKey="newEvents"
                        stroke={CHART_COLORS[1]}
                        strokeWidth={2}
                        name="Sự kiện mới"
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Event Status Distribution */}
              <Card className="bg-gradient-to-br from-white/90 via-violet-50/30 to-indigo-50/30 dark:from-slate-900/90 dark:via-violet-950/30 dark:to-indigo-950/30 backdrop-blur-sm border-2 border-violet-200/50 dark:border-violet-700/50 shadow-2xl shadow-violet-200/30 dark:shadow-violet-900/30">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-slate-200 font-semibold">
                    Phân bố trạng thái sự kiện
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Phân bố sự kiện theo trạng thái hiện tại
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={categoryStatsConfig}
                    className="h-[300px]"
                  >
                    <PieChart width={500} height={300}>
                      <Pie
                        data={[
                          {
                            name: "Đang hoạt động",
                            value: Math.floor(dashboardData.totalEvents * 0.3),
                            fill: CHART_COLORS[0],
                          },
                          {
                            name: "Sắp diễn ra",
                            value: Math.floor(dashboardData.totalEvents * 0.4),
                            fill: CHART_COLORS[1],
                          },
                          {
                            name: "Đã hoàn thành",
                            value: Math.floor(dashboardData.totalEvents * 0.3),
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
            </div>
          )}
        </TabsContent>

        <TabsContent value="organizations" className="space-y-4">
          {dashboardData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Organization Growth */}
              <Card className="bg-gradient-to-br from-white/90 via-violet-50/30 to-indigo-50/30 dark:from-slate-900/90 dark:via-violet-950/30 dark:to-indigo-950/30 backdrop-blur-sm border-2 border-violet-200/50 dark:border-violet-700/50 shadow-2xl shadow-violet-200/30 dark:shadow-violet-900/30">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-slate-200 font-semibold">
                    Tăng trưởng Tổ chức
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Xu hướng đăng ký tổ chức hàng tháng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={organizationDistributionConfig}
                    className="h-[300px]"
                  >
                    <LineChart
                      data={dashboardData.monthlyGrowth.map((item) => ({
                        month: item.month,
                        organizations: Math.floor(item.users * 0.1),
                        newOrganizations: Math.floor(item.users * 0.02),
                      }))}
                      width={500}
                      height={300}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="totalOrganizations"
                        stroke={CHART_COLORS[0]}
                        strokeWidth={2}
                        name="Tổng số Tổ chức"
                      />
                      <Line
                        type="monotone"
                        dataKey="newOrganizations"
                        stroke={CHART_COLORS[1]}
                        strokeWidth={2}
                        name="Tổ chức Mới"
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Organization Type Distribution */}
              <Card className="bg-gradient-to-br from-white/90 via-violet-50/30 to-indigo-50/30 dark:from-slate-900/90 dark:via-violet-950/30 dark:to-indigo-950/30 backdrop-blur-sm border-2 border-violet-200/50 dark:border-violet-700/50 shadow-2xl shadow-violet-200/30 dark:shadow-violet-900/30">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-slate-200 font-semibold">
                    Loại Tổ chức
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Phân bố theo loại tổ chức
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={organizationDistributionConfig}
                    className="h-[300px]"
                  >
                    <PieChart width={500} height={300}>
                      <Pie
                        data={[
                          {
                            name: "Phi lợi nhuận",
                            value: Math.floor(
                              dashboardData.totalOrganizations * 0.6
                            ),
                            fill: CHART_COLORS[0],
                          },
                          {
                            name: "Giáo dục",
                            value: Math.floor(
                              dashboardData.totalOrganizations * 0.25
                            ),
                            fill: CHART_COLORS[1],
                          },
                          {
                            name: "Chính phủ",
                            value: Math.floor(
                              dashboardData.totalOrganizations * 0.15
                            ),
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
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalyticsDashboard;
