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
import { StatsCard } from "../dashboard/StatsCard";
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
  Building2,
  DollarSign,
  Star,
  TrendingUp,
  RefreshCw,
  Users,
  Calendar,
} from "lucide-react";
import { analyticsService } from "../../services/analyticsService";
import type { PartnerDashboardDto } from "../../types/analytics";
import { TimePeriod } from "../../types/analytics";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function PartnerAnalyticsDashboard() {
  const [dashboardData, setDashboardData] = useState<PartnerDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(TimePeriod.Last30Days);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getPartnerDashboard(timePeriod);
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to fetch partner dashboard data:", error);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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
          <h2 className="text-2xl font-bold tracking-tight">Partnership Analytics</h2>
          <p className="text-muted-foreground">
            Monitor your partnerships and collaboration performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={timePeriod.toString()}
            onValueChange={(value) => setTimePeriod(parseInt(value) as TimePeriod)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TimePeriod.Last7Days.toString()}>
                Last 7 Days
              </SelectItem>
              <SelectItem value={TimePeriod.Last30Days.toString()}>
                Last 30 Days
              </SelectItem>
              <SelectItem value={TimePeriod.Last3Months.toString()}>
                Last 3 Months
              </SelectItem>
              <SelectItem value={TimePeriod.Last6Months.toString()}>
                Last 6 Months
              </SelectItem>
              <SelectItem value={TimePeriod.LastYear.toString()}>
                Last Year
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
          title="Total Collaborations"
          value={dashboardData?.totalCollaborations || 0}
          description="All partnership agreements"
          icon={Building2}
        />
        <StatsCard
          title="Active Collaborations"
          value={dashboardData?.activeCollaborations || 0}
          description="Currently active partnerships"
          icon={Users}
        />
        <StatsCard
          title="Sponsored Events"
          value={dashboardData?.sponsoredEvents || 0}
          description="Events supported"
          icon={Calendar}
        />
        <StatsCard
          title="Total Investment"
          value={formatCurrency(dashboardData?.totalSponsorshipAmount || 0)}
          description="Total sponsorship amount"
          icon={DollarSign}
        />
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="collaborations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="collaborations">Collaboration Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="industry">Industry Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="collaborations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Collaborations by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Collaborations by Type</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Distribution of partnership types
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData?.collaborationsByType || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, count }) => `${type}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {(dashboardData?.collaborationsByType || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Investment by Collaboration Type */}
            <Card>
              <CardHeader>
                <CardTitle>Investment by Type</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Financial commitment across partnership types
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData?.collaborationsByType || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="amount" fill="#8884d8" name="Investment Amount" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Partnership Rating */}
            <Card>
              <CardHeader>
                <CardTitle>Partnership Rating</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Average rating from partner organizations
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[200px]">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <Star className="h-12 w-12 text-yellow-500 fill-current" />
                    </div>
                    <div className="text-4xl font-bold text-yellow-600">
                      {dashboardData?.averagePartnerRating?.toFixed(1) || "0.0"}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      out of 5.0 stars
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Partnership Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Partnership Summary</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Key performance indicators
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Success Rate</span>
                    <span className="text-lg font-bold text-green-600">
                      {dashboardData?.activeCollaborations && dashboardData?.totalCollaborations
                        ? Math.round((dashboardData.activeCollaborations / dashboardData.totalCollaborations) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Investment</span>
                    <span className="text-lg font-bold">
                      {dashboardData?.totalCollaborations
                        ? formatCurrency((dashboardData.totalSponsorshipAmount || 0) / dashboardData.totalCollaborations)
                        : formatCurrency(0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Events per Partnership</span>
                    <span className="text-lg font-bold">
                      {dashboardData?.totalCollaborations
                        ? Math.round((dashboardData.sponsoredEvents || 0) / dashboardData.totalCollaborations * 10) / 10
                        : 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="industry" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {/* Industry Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Industry Comparison</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Compare your partnerships across different industries
                </p>
              </CardHeader>
              <CardContent>
                {dashboardData?.industryComparison && dashboardData.industryComparison.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={dashboardData.industryComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="industryName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="partnerCount" fill="#8884d8" name="Partners" />
                      <Bar dataKey="collaborationCount" fill="#82ca9d" name="Collaborations" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Industry comparison data will be available as you build more partnerships
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PartnerAnalyticsDashboard;