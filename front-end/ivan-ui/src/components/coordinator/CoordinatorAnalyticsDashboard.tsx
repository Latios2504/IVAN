import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { StatsCard } from '../dashboard/StatsCard';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Calendar, ClipboardList, CheckCircle, TrendingUp, RefreshCw } from 'lucide-react';
import type { CoordinatorDashboardDto } from '../../types/analytics';
import { TimePeriod } from '../../types/analytics';
import { analyticsService } from '../../services/analyticsService';

interface CoordinatorAnalyticsDashboardProps {
  className?: string;
}

export const CoordinatorAnalyticsDashboard: React.FC<CoordinatorAnalyticsDashboardProps> = ({ className }) => {
  const [dashboardData, setDashboardData] = useState<CoordinatorDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(TimePeriod.Last30Days);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getCoordinatorDashboard(timePeriod);
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching coordinator dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timePeriod]);

  const getTimePeriodLabel = (period: TimePeriod): string => {
    switch (period) {
      case TimePeriod.Last7Days: return '7 ngày qua';
      case TimePeriod.Last30Days: return '30 ngày qua';
      case TimePeriod.Last3Months: return '3 tháng qua';
      case TimePeriod.Last6Months: return '6 tháng qua';
      case TimePeriod.LastYear: return '1 năm qua';
      default: return '30 ngày qua';
    }
  };

  const taskStatusColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">Không thể tải dữ liệu phân tích</p>
        <Button onClick={fetchDashboardData} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Phân tích Coordinator</h2>
          <p className="text-gray-600">Theo dõi hiệu suất quản lý và điều phối</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timePeriod.toString()} onValueChange={(value) => setTimePeriod(parseInt(value) as TimePeriod)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TimePeriod.Last7Days.toString()}>7 ngày qua</SelectItem>
              <SelectItem value={TimePeriod.Last30Days.toString()}>30 ngày qua</SelectItem>
              <SelectItem value={TimePeriod.Last3Months.toString()}>3 tháng qua</SelectItem>
              <SelectItem value={TimePeriod.Last6Months.toString()}>6 tháng qua</SelectItem>
              <SelectItem value={TimePeriod.LastYear.toString()}>1 năm qua</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchDashboardData} variant="outline" size="sm">
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">Phân tích Nhiệm vụ</TabsTrigger>
          <TabsTrigger value="performance">Hiệu suất</TabsTrigger>
          <TabsTrigger value="volunteers">Tình nguyện viên</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tasks by Status */}
            <Card>
              <CardHeader>
                <CardTitle>Nhiệm vụ theo trạng thái</CardTitle>
                <CardDescription>Phân bố trạng thái các nhiệm vụ được giao</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.tasksByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {dashboardData.tasksByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={taskStatusColors[index % taskStatusColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Task Completion Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tóm tắt nhiệm vụ</CardTitle>
                <CardDescription>Chi tiết về tiến độ nhiệm vụ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Tổng nhiệm vụ</span>
                  <span className="text-2xl font-bold text-blue-600">{dashboardData.tasksAssigned}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Đã hoàn thành</span>
                  <span className="text-2xl font-bold text-green-600">{dashboardData.tasksCompleted}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">Chờ duyệt</span>
                  <span className="text-2xl font-bold text-yellow-600">{dashboardData.pendingApprovals}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">Tỷ lệ hoàn thành</span>
                  <span className="text-2xl font-bold text-purple-600">
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
            <Card>
              <CardHeader>
                <CardTitle>Chỉ số hiệu suất</CardTitle>
                <CardDescription>Đánh giá tổng quan về hiệu suất quản lý</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tỷ lệ hoàn thành nhiệm vụ</span>
                    <span className="text-sm text-gray-600">{Math.round(dashboardData.taskCompletionRate * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${dashboardData.taskCompletionRate * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Hiệu suất quản lý sự kiện</span>
                    <span className="text-sm text-gray-600">
                      {dashboardData.eventsManaged > 0 ? Math.round((dashboardData.eventsManaged / (dashboardData.eventsManaged + dashboardData.upcomingEvents)) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ 
                        width: `${dashboardData.eventsManaged > 0 ? (dashboardData.eventsManaged / (dashboardData.eventsManaged + dashboardData.upcomingEvents)) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Performance Indicators */}
            <Card>
              <CardHeader>
                <CardTitle>Chỉ số KPI</CardTitle>
                <CardDescription>Các chỉ số quan trọng trong {getTimePeriodLabel(timePeriod)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{dashboardData.eventsManaged}</div>
                    <div className="text-sm text-gray-600">Sự kiện</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{dashboardData.volunteersManaged}</div>
                    <div className="text-sm text-gray-600">Tình nguyện viên</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{dashboardData.tasksAssigned}</div>
                    <div className="text-sm text-gray-600">Nhiệm vụ giao</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{dashboardData.pendingApprovals}</div>
                    <div className="text-sm text-gray-600">Chờ duyệt</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="volunteers" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Top Volunteers */}
            <Card>
              <CardHeader>
                <CardTitle>Tình nguyện viên xuất sắc</CardTitle>
                <CardDescription>Danh sách tình nguyện viên có hiệu suất cao nhất</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.topVolunteers && dashboardData.topVolunteers.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.topVolunteers.map((volunteer, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {volunteer.volunteerName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium">{volunteer.volunteerName || 'Tên không xác định'}</h4>
                            <p className="text-sm text-gray-600">
                              {volunteer.tasksCompleted || 0} nhiệm vụ hoàn thành • 
                              {volunteer.hoursWorked || 0} giờ làm việc
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-600">
                            {volunteer.rating ? `${Math.round(volunteer.rating * 20)}%` : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">Điểm hiệu suất</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có dữ liệu tình nguyện viên</p>
                  </div>
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