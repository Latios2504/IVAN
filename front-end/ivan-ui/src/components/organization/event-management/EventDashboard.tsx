import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Calendar, Users, Star, TrendingUp } from "lucide-react";
import type { EventStatsDto } from "../../../types/event";

interface EventDashboardProps {
  stats: EventStatsDto;
}

export const EventDashboard: React.FC<EventDashboardProps> = ({ stats }) => {
  const statCards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: "Active Events",
      value: stats.activeEvents,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "Total Volunteers",
      value: stats.totalVolunteers,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Average Rating",
      value: stats.averageRating?.toFixed(1) || "N/A",
      icon: Star,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon
                className={`h-4 w-4 text-white ${stat.color} rounded p-1`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Event Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline">Planning: {stats.planningEvents}</Badge>
            <Badge variant="default">Active: {stats.activeEvents}</Badge>
            <Badge variant="secondary">
              In Progress: {stats.inProgressEvents}
            </Badge>
            <Badge variant="outline">Completed: {stats.completedEvents}</Badge>
            <Badge variant="destructive">
              Cancelled: {stats.cancelledEvents}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Events by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.eventsByCategory || {}).map(
                ([category, count]) => (
                  <div key={category} className="flex justify-between">
                    <span className="text-sm">{category}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.eventsByMonth || {}).map(
                ([month, count]) => (
                  <div key={month} className="flex justify-between">
                    <span className="text-sm">{month}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
