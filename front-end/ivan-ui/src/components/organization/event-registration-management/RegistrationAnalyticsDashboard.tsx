import React from "react";
import { useEventRegistration } from "@/context/EventRegistrationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  Calendar,
  Award,
  AlertCircle,
} from "lucide-react";

// Stats calculation hook
const useRegistrationStats = () => {
  const { registrations, loading } = useEventRegistration();

  const stats = React.useMemo(() => {
    if (!registrations.length) {
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        cancelled: 0,
        approvalRate: 0,
        recentApplications: 0,
        weeklyGrowth: 0,
      };
    }

    const total = registrations.length;
    const pending = registrations.filter(
      (r) => r.statusName === "Pending"
    ).length;
    const approved = registrations.filter(
      (r) => r.statusName === "Approved"
    ).length;
    const rejected = registrations.filter(
      (r) => r.statusName === "Rejected"
    ).length;
    const cancelled = registrations.filter(
      (r) => r.statusName === "Cancelled"
    ).length;

    const approvalRate =
      total > 0 ? Math.round((approved / (approved + rejected)) * 100) || 0 : 0;

    // Recent applications (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentApplications = registrations.filter(
      (r) => new Date(r.applicationDate) >= weekAgo
    ).length;

    // Weekly growth (mock calculation - would need historical data)
    const weeklyGrowth = Math.round((recentApplications / total) * 100) || 0;

    return {
      total,
      pending,
      approved,
      rejected,
      cancelled,
      approvalRate,
      recentApplications,
      weeklyGrowth,
    };
  }, [registrations]);

  return { stats, loading };
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  description?: string;
}

function StatCard({
  title,
  value,
  icon,
  change,
  changeType,
  description,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              {description && (
                <p className="text-xs text-gray-500 mt-1">{description}</p>
              )}
            </div>
          </div>
          {change && (
            <Badge
              variant={
                changeType === "positive"
                  ? "default"
                  : changeType === "negative"
                  ? "destructive"
                  : "secondary"
              }
              className="text-xs"
            >
              {change}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function RegistrationAnalyticsDashboard() {
  const { stats, loading } = useRegistrationStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                  <div className="space-y-2">
                    <div className="w-20 h-4 bg-gray-200 rounded" />
                    <div className="w-16 h-6 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registrations"
          value={stats.total}
          icon={<Users className="w-5 h-5 text-blue-600" />}
          change={`+${stats.weeklyGrowth}%`}
          changeType="positive"
          description="All time"
        />

        <StatCard
          title="Pending Review"
          value={stats.pending}
          icon={<Clock className="w-5 h-5 text-yellow-600" />}
          description="Needs attention"
        />

        <StatCard
          title="Approved"
          value={stats.approved}
          icon={<UserCheck className="w-5 h-5 text-green-600" />}
          description="Ready to participate"
        />

        <StatCard
          title="Approval Rate"
          value={`${stats.approvalRate}%`}
          icon={<Award className="w-5 h-5 text-purple-600" />}
          change={
            stats.approvalRate >= 80
              ? "Good"
              : stats.approvalRate >= 60
              ? "Fair"
              : "Low"
          }
          changeType={
            stats.approvalRate >= 80
              ? "positive"
              : stats.approvalRate >= 60
              ? "neutral"
              : "negative"
          }
        />
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Registration Status Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Approved */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">Approved</span>
                </div>
                <span className="text-sm text-gray-600">{stats.approved}</span>
              </div>
              <Progress
                value={
                  stats.total > 0 ? (stats.approved / stats.total) * 100 : 0
                }
                className="h-2"
              />
            </div>

            {/* Pending */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="text-sm font-medium">Pending</span>
                </div>
                <span className="text-sm text-gray-600">{stats.pending}</span>
              </div>
              <Progress
                value={
                  stats.total > 0 ? (stats.pending / stats.total) * 100 : 0
                }
                className="h-2"
              />
            </div>

            {/* Rejected */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-sm font-medium">Rejected</span>
                </div>
                <span className="text-sm text-gray-600">{stats.rejected}</span>
              </div>
              <Progress
                value={
                  stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0
                }
                className="h-2"
              />
            </div>

            {/* Cancelled */}
            {stats.cancelled > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full" />
                    <span className="text-sm font-medium">Cancelled</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {stats.cancelled}
                  </span>
                </div>
                <Progress
                  value={
                    stats.total > 0 ? (stats.cancelled / stats.total) * 100 : 0
                  }
                  className="h-2"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">New Applications</p>
                  <p className="text-xs text-gray-500">Last 7 days</p>
                </div>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {stats.recentApplications}
              </span>
            </div>

            {stats.pending > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">Pending Review</p>
                    <p className="text-xs text-gray-500">Requires attention</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-yellow-600">
                  {stats.pending}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Approval Rate</p>
                  <p className="text-xs text-gray-500">Overall performance</p>
                </div>
              </div>
              <span className="text-lg font-bold text-green-600">
                {stats.approvalRate}%
              </span>
            </div>

            {stats.total === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">No registrations yet</p>
                <p className="text-xs">
                  Analytics will appear when volunteers start registering
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
