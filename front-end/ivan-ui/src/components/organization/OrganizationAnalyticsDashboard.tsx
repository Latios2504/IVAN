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
import { StatsCard } from "../dashboard/StatsCard";

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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        <span>Loading analytics data...</span>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Organization Analytics</h2>
          <p className="text-muted-foreground">
            Track your organization's performance and impact
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timePeriod.toString()} onValueChange={(value) => handleTimePeriodChange(parseInt(value) as TimePeriod)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TimePeriod.Last7Days.toString()}>Last 7 days</SelectItem>
              <SelectItem value={TimePeriod.Last30Days.toString()}>
                Last 30 days
              </SelectItem>
              <SelectItem value={TimePeriod.Last3Months.toString()}>
                Last 3 months
              </SelectItem>
              <SelectItem value={TimePeriod.LastYear.toString()}>Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchDashboardData} variant="outline" size="sm">
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Events"
          value={dashboardData.myTotalEvents}
          icon={Calendar}
          description={`${dashboardData.myActiveEvents} active`}
        />
        <StatsCard
          title="Volunteers Reached"
          value={dashboardData.totalVolunteersReached}
          icon={Users}
        />
        <StatsCard
          title="Volunteer Hours"
          value={dashboardData.totalVolunteerHours.toLocaleString()}
          icon={UserCheck}
          description="Total contributed"
        />
        <StatsCard
          title="Average Rating"
          value={dashboardData.averageEventRating.toFixed(1)}
          icon={Star}
          description="Event satisfaction"
        />
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events">Event Analytics</TabsTrigger>
          <TabsTrigger value="registrations">
            Registration Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Events by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Events by Category</CardTitle>
                <CardDescription>
                  Distribution of events across different categories
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
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Participation</CardTitle>
                <CardDescription>
                  Number of volunteers by event category
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
            <Card>
              <CardHeader>
                <CardTitle>Registration Status</CardTitle>
                <CardDescription>
                  Current status of event registrations
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
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>
                  Your organization's latest events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.recentEvents.slice(0, 5).map((event) => (
                    <div
                      key={event.eventId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{event.eventName}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(event.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary">{event.status}</Badge>
                    </div>
                  ))}
                  {dashboardData.recentEvents.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
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
