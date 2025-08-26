import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { StatsCard } from "../common/StatsCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  Calendar,
  Clock,
  Award,
  TrendingUp,
  RefreshCw,
  Users,
  Target,
} from "lucide-react";
import { analyticsService } from "../../services/analyticsService";
import type { VolunteerDashboardDto } from "../../types/analytics";
import { TimePeriod } from "../../types/analytics";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function VolunteerAnalyticsDashboard() {
  const [dashboardData, setDashboardData] = useState<VolunteerDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(TimePeriod.Last30Days);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getVolunteerDashboard(timePeriod);
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to fetch volunteer dashboard data:", error);
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
        return "Last 7 Days";
      case TimePeriod.Last30Days:
        return "Last 30 Days";
      case TimePeriod.Last3Months:
        return "Last 3 Months";
      case TimePeriod.Last6Months:
        return "Last 6 Months";
      case TimePeriod.LastYear:
        return "Last Year";
      default:
        return "Last 30 Days";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Phân tích tình nguyện viên</h2>
          <p className="text-muted-foreground">
            Theo dõi hành trình tình nguyện và thành tích của bạn
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={timePeriod.toString()}
            onValueChange={(value) => setTimePeriod(parseInt(value) as TimePeriod)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TimePeriod.Last7Days.toString()}>
                7 ngày qua
              </SelectItem>
              <SelectItem value={TimePeriod.Last30Days.toString()}>
                30 ngày qua
              </SelectItem>
              <SelectItem value={TimePeriod.Last3Months.toString()}>
                3 tháng qua
              </SelectItem>
              <SelectItem value={TimePeriod.Last6Months.toString()}>
                6 tháng qua
              </SelectItem>
              <SelectItem value={TimePeriod.LastYear.toString()}>
                Năm qua
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Sự kiện đã tham gia"
          value={dashboardData?.eventsParticipated || 0}
          description="Tổng số sự kiện đã tham gia"
          icon={Calendar}
        />
        <StatsCard
          title="Sự kiện đã hoàn thành"
          value={dashboardData?.eventsCompleted || 0}
          description="Sự kiện hoàn thành thành công"
          icon={Target}
        />
        <StatsCard
          title="Giờ tình nguyện"
          value={dashboardData?.totalVolunteerHours || 0}
          description="Tổng số giờ đóng góp"
          icon={Clock}
        />
        <StatsCard
          title="Kỹ năng đã học"
          value={dashboardData?.skillsAcquired || 0}
          description="Kỹ năng mới đã học được"
          icon={Award}
        />
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Phân tích sự kiện</TabsTrigger>
          <TabsTrigger value="skills">Kỹ năng & Tiến độ</TabsTrigger>
          <TabsTrigger value="achievements">Thành tích</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Events by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Sự kiện theo danh mục</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Phân bố các hoạt động tình nguyện của bạn
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData?.eventsByCategory || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ categoryName, eventCount }) => `${categoryName}: ${eventCount}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="eventCount"
                    >
                      {(dashboardData?.eventsByCategory || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Volunteer Hours by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Giờ tình nguyện theo danh mục</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Thời gian dành cho các danh mục tình nguyện khác nhau
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData?.eventsByCategory || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoryName" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="volunteerCount" fill="#8884d8" name="Giờ" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {/* Skills Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Tiến độ kỹ năng</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Phát triển kỹ năng và mức độ thành thạo của bạn
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.skillProgress?.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill.skillName}</span>
                        <span className="text-sm text-muted-foreground">
                          {skill.proficiencyLevel}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Sự kiện: {skill.eventsUsed}</span>
                        <span>Kinh nghiệm: {skill.yearsOfExperience} năm</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min((skill.eventsUsed / 10) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )) || (
                    <p className="text-center text-muted-foreground py-8">
                      Không có dữ liệu kỹ năng cho khoảng thời gian đã chọn
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Thành tích gần đây</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Những thành tựu và cột mốc mới nhất của bạn
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.recentAchievements?.map((achievement, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {achievement.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Đạt được vào {new Date(achievement.achievedDate).toLocaleDateString()}
                      </p>
                    </div>
                  )) || (
                    <p className="text-center text-muted-foreground py-8">
                      Không có dữ liệu thành tích cho khoảng thời gian đã chọn
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
}

export default VolunteerAnalyticsDashboard;