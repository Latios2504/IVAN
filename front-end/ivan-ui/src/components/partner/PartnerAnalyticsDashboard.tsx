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
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gradient-to-br from-gray-200/80 to-gray-300/80 dark:from-gray-700/80 dark:to-gray-600/80 rounded-xl shadow-sm"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Partnership Analytics</h2>
          <p className="bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent font-medium">
            Monitor your partnerships and collaboration performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={timePeriod.toString()}
            onValueChange={(value) => setTimePeriod(parseInt(value) as TimePeriod)}
          >
            <SelectTrigger className="w-[180px] bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-gray-900/80 dark:to-blue-900/80 border border-blue-200/50 dark:border-blue-800/50 hover:shadow-md transition-all duration-200">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent className="bg-gradient-to-br from-white/95 to-blue-50/95 dark:from-gray-900/95 dark:to-blue-900/95 border border-blue-200/50 dark:border-blue-800/50">
              <SelectItem value={TimePeriod.Last7Days.toString()} className="hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50">
                Last 7 Days
              </SelectItem>
              <SelectItem value={TimePeriod.Last30Days.toString()} className="hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50">
                Last 30 Days
              </SelectItem>
              <SelectItem value={TimePeriod.Last3Months.toString()} className="hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50">
                Last 3 Months
              </SelectItem>
              <SelectItem value={TimePeriod.Last6Months.toString()} className="hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50">
                Last 6 Months
              </SelectItem>
              <SelectItem value={TimePeriod.LastYear.toString()} className="hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50">
                Last Year
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchDashboardData}
            disabled={loading}
            className="bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-gray-900/80 dark:to-blue-900/80 border border-blue-200/50 dark:border-blue-800/50 hover:shadow-md transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""} text-blue-600 dark:text-blue-400`} />
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
        <TabsList className="bg-gradient-to-r from-gray-100/80 to-blue-100/80 dark:from-gray-800/80 dark:to-blue-800/80 border border-gray-200/50 dark:border-gray-700/50">
          <TabsTrigger value="collaborations" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-200">Collaboration Analytics</TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-200">Performance Metrics</TabsTrigger>
          <TabsTrigger value="industry" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-200">Industry Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="collaborations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Collaborations by Type */}
            <Card className="bg-gradient-to-br from-green-50/80 via-emerald-50/80 to-teal-50/80 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border border-green-200/50 dark:border-green-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">Collaborations by Type</CardTitle>
                <p className="text-sm bg-gradient-to-r from-green-700 to-teal-700 dark:from-green-300 dark:to-teal-300 bg-clip-text text-transparent font-medium">
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
            <Card className="bg-gradient-to-br from-yellow-50/80 via-orange-50/80 to-red-50/80 dark:from-yellow-950/30 dark:via-orange-950/30 dark:to-red-950/30 border border-yellow-200/50 dark:border-yellow-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-yellow-600 to-red-600 dark:from-yellow-400 dark:to-red-400 bg-clip-text text-transparent">Investment by Type</CardTitle>
                <p className="text-sm bg-gradient-to-r from-yellow-700 to-red-700 dark:from-yellow-300 dark:to-red-300 bg-clip-text text-transparent font-medium">
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
            <Card className="bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-rose-50/80 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30 border border-purple-200/50 dark:border-purple-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-purple-600 to-rose-600 dark:from-purple-400 dark:to-rose-400 bg-clip-text text-transparent">Partnership Rating</CardTitle>
                <p className="text-sm bg-gradient-to-r from-purple-700 to-rose-700 dark:from-purple-300 dark:to-rose-300 bg-clip-text text-transparent font-medium">
                  Average rating from partner organizations
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[200px]">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <Star className="h-12 w-12 text-yellow-500 fill-current" />
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
                      {dashboardData?.averagePartnerRating?.toFixed(1) || "0.0"}
                    </div>
                    <p className="text-sm bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent font-medium mt-2">
                      out of 5.0 stars
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Partnership Summary */}
            <Card className="bg-gradient-to-br from-cyan-50/80 via-blue-50/80 to-indigo-50/80 dark:from-cyan-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 border border-cyan-200/50 dark:border-cyan-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">Partnership Summary</CardTitle>
                <p className="text-sm bg-gradient-to-r from-cyan-700 to-indigo-700 dark:from-cyan-300 dark:to-indigo-300 bg-clip-text text-transparent font-medium">
                  Key performance indicators
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium bg-gradient-to-r from-gray-700 to-blue-700 dark:from-gray-300 dark:to-blue-300 bg-clip-text text-transparent">Success Rate</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                      {dashboardData?.activeCollaborations && dashboardData?.totalCollaborations
                        ? Math.round((dashboardData.activeCollaborations / dashboardData.totalCollaborations) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium bg-gradient-to-r from-gray-700 to-blue-700 dark:from-gray-300 dark:to-blue-300 bg-clip-text text-transparent">Average Investment</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                      {dashboardData?.totalCollaborations
                        ? formatCurrency((dashboardData.totalSponsorshipAmount || 0) / dashboardData.totalCollaborations)
                        : formatCurrency(0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium bg-gradient-to-r from-gray-700 to-blue-700 dark:from-gray-300 dark:to-blue-300 bg-clip-text text-transparent">Events per Partnership</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
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
            <Card className="bg-gradient-to-br from-slate-50/80 via-gray-50/80 to-zinc-50/80 dark:from-slate-950/30 dark:via-gray-950/30 dark:to-zinc-950/30 border border-slate-200/50 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-slate-600 to-zinc-600 dark:from-slate-400 dark:to-zinc-400 bg-clip-text text-transparent">Industry Comparison</CardTitle>
                <p className="text-sm bg-gradient-to-r from-slate-700 to-zinc-700 dark:from-slate-300 dark:to-zinc-300 bg-clip-text text-transparent font-medium">
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
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50/50 to-slate-50/50 dark:from-gray-900/30 dark:to-slate-900/30 rounded-xl border border-gray-200/30 dark:border-gray-700/30">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 bg-gradient-to-r from-gray-400 to-slate-400 dark:from-gray-500 dark:to-slate-500 bg-clip-text text-transparent" />
                    <p className="bg-gradient-to-r from-gray-600 to-slate-600 dark:from-gray-400 dark:to-slate-400 bg-clip-text text-transparent">
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