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
import { TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { ExportButton, type ExportOptions } from "../common/ExportButton";
import { toast } from "sonner";

// Types for analytics data (matching backend DTOs)
interface UserAnalytics {
  userGrowth: any[];
  userRoleDistribution: any[];
  [key: string]: any;
}

interface EventAnalytics {
  eventTrends: any[];
  [key: string]: any;
}

interface AdminOverviewStats {
  totalUsers: number;
  totalVolunteers: number;
  totalOrganizations: number;
  totalPartners: number;
  totalEvents: number;
  activeEvents: number;
  totalHours: number;
  pendingApprovals: number;
  monthlyGrowthRate: number;
  newUsersThisMonth: number;
  completedEventsThisMonth: number;
}

const AdminAnalyticsDashboard: React.FC = () => {
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>({
    userGrowth: [],
    userRoleDistribution: [],
  });
  const [eventAnalytics, setEventAnalytics] = useState<EventAnalytics | null>({
    eventTrends: [],
  });
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // Dashboard service removed - no data fetching
      console.log("Dashboard service functionality removed");
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportAnalytics = async (
    format: "excel" | "csv" | "pdf" | "json",
    options: ExportOptions
  ) => {
    try {
      setExportLoading(true);
      toast.info("Export service functionality removed");

      // Export service removed - no export functionality
      console.log("Export functionality removed", { format, options });

      toast.success("Export service functionality has been removed");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export service not available");
    } finally {
      setExportLoading(false);
    }
  };

  const refreshData = () => {
    fetchAnalyticsData();
    toast.info("Đang làm mới dữ liệu...");
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Đang tải dữ liệu thống kê...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Admin Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Thống kê toàn diện và phân tích dữ liệu hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <ExportButton
            onExport={handleExportAnalytics}
            loading={exportLoading}
            availableFormats={["excel", "csv", "json"]}
            dataType="analytics"
            buttonText="Xuất báo cáo"
          />
          <Button variant="outline" onClick={refreshData} disabled={loading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Thống kê người dùng</TabsTrigger>
          <TabsTrigger value="events">Thống kê sự kiện</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {userAnalytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Tăng trưởng người dùng</CardTitle>
                  <CardDescription>
                    Xu hướng tăng trưởng người dùng theo tháng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={userGrowthConfig}
                    className="h-[300px]"
                  >
                    <LineChart
                      data={userAnalytics.userGrowth.map((item) => ({
                        month: new Date(item.date).toLocaleDateString("vi-VN", {
                          month: "short",
                          year: "numeric",
                        }),
                        volunteers: item.totalUsers, // Approximating volunteers as total users for now
                        coordinators: item.newUsers,
                        total: item.totalUsers,
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
                        dataKey="volunteers"
                        stroke={CHART_COLORS[0]}
                        strokeWidth={2}
                        name="Tình nguyện viên"
                      />
                      <Line
                        type="monotone"
                        dataKey="coordinators"
                        stroke={CHART_COLORS[1]}
                        strokeWidth={2}
                        name="Điều phối viên"
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* User Distribution Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Phân bố người dùng</CardTitle>
                  <CardDescription>
                    Tỷ lệ các loại người dùng trong hệ thống
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={roleDistributionConfig}
                    className="h-[300px]"
                  >
                    <PieChart width={500} height={300}>
                      <Pie
                        data={
                          userAnalytics.roleDistribution?.map(
                            (item: any, index: number) => ({
                              name: item.roleName,
                              value: item.userCount,
                              fill: CHART_COLORS[index % CHART_COLORS.length],
                            })
                          ) || []
                        }
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
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Phân bố địa lý</CardTitle>
                  <CardDescription>
                    Phân bố người dùng theo tỉnh thành
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={userGrowthConfig}
                    className="h-[300px]"
                  >
                    <BarChart
                      data={userAnalytics.geographicDistribution}
                      width={500}
                      height={300}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="province" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="userCount"
                        fill={CHART_COLORS[0]}
                        name="Số người dùng"
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          {eventAnalytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Event Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Xu hướng sự kiện</CardTitle>
                  <CardDescription>
                    Số lượng sự kiện và đăng ký theo tháng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={eventTrendsConfig}
                    className="h-[300px]"
                  >
                    <LineChart
                      data={eventAnalytics.eventTrends}
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
                        dataKey="events"
                        stroke={CHART_COLORS[0]}
                        strokeWidth={2}
                        name="Sự kiện"
                      />
                      <Line
                        type="monotone"
                        dataKey="registrations"
                        stroke={CHART_COLORS[1]}
                        strokeWidth={2}
                        name="Đăng ký"
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Events by Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Sự kiện theo danh mục</CardTitle>
                  <CardDescription>
                    Phân bố sự kiện theo loại hình
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={categoryStatsConfig}
                    className="h-[300px]"
                  >
                    <PieChart width={500} height={300}>
                      <Pie
                        data={
                          eventAnalytics.categoryStats?.map(
                            (item: any, index: number) => ({
                              name: item.categoryName,
                              value: item.eventCount,
                              fill: CHART_COLORS[index % CHART_COLORS.length],
                            })
                          ) || []
                        }
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

              {/* Events by Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Sự kiện theo trạng thái</CardTitle>
                  <CardDescription>
                    Phân bố sự kiện theo tình trạng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={eventTrendsConfig}
                    className="h-[300px]"
                  >
                    <BarChart
                      data={[
                        {
                          status: "Hoạt động",
                          count: eventAnalytics.eventStats.activeEvents,
                          fill: CHART_COLORS[1], // Green for active
                        },
                        {
                          status: "Hoàn thành",
                          count: eventAnalytics.eventStats.completedEvents,
                          fill: CHART_COLORS[0], // Blue for completed
                        },
                        {
                          status: "Đã hủy",
                          count: eventAnalytics.eventStats.cancelledEvents,
                          fill: CHART_COLORS[3], // Red for cancelled
                        },
                      ]}
                      width={500}
                      height={300}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Event Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Xu hướng sự kiện</CardTitle>
                  <CardDescription>
                    Sự kiện và đăng ký theo thời gian
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={eventTrendsConfig}
                    className="h-[300px]"
                  >
                    <BarChart
                      data={eventAnalytics.eventTrends.map((item) => ({
                        month: new Date(item.date).toLocaleDateString("vi-VN", {
                          month: "short",
                          year: "numeric",
                        }),
                        events: item.eventsCreated,
                        registrations: item.registrations,
                      }))}
                      width={500}
                      height={300}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="events"
                        fill={CHART_COLORS[0]}
                        name="Sự kiện"
                      />
                      <Bar
                        dataKey="registrations"
                        fill={CHART_COLORS[1]}
                        name="Đăng ký"
                      />
                    </BarChart>
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
