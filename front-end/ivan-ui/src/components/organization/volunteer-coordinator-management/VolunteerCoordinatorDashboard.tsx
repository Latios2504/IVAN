import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import {
  Users,
  Shield,
  TrendingUp,
  Star,
  UserCheck,
  UserX,
} from "lucide-react";
import type { VolunteerCoordinatorStatsDto } from "../../../types/volunteer-coordinator";

interface VolunteerCoordinatorDashboardProps {
  stats: VolunteerCoordinatorStatsDto;
}

export const VolunteerCoordinatorDashboard: React.FC<
  VolunteerCoordinatorDashboardProps
> = ({ stats }) => {
  const statCards = [
    {
      title: "Total Coordinators",
      value: stats.totalCoordinators,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active Coordinators",
      value: stats.activeCoordinators,
      icon: UserCheck,
      color: "bg-green-500",
    },
    {
      title: "Senior Coordinators",
      value: stats.seniorCoordinators,
      icon: Shield,
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

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Coordinators
            </CardTitle>
            <UserX className="h-4 w-4 text-white bg-red-500 rounded p-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.inactiveCoordinators}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Events Managed
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-white bg-indigo-500 rounded p-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEventsManaged}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Volunteers Managed
            </CardTitle>
            <Users className="h-4 w-4 text-white bg-orange-500 rounded p-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalVolunteersManaged}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Level Distribution */}
      {stats.managementLevelDistribution &&
        stats.managementLevelDistribution.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Management Level Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.managementLevelDistribution.map((level) => (
                  <Badge
                    key={level.level}
                    variant="secondary"
                    className="text-sm"
                  >
                    {level.level}: {level.count}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Top Specializations */}
      {stats.topSpecializations && stats.topSpecializations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Specializations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.topSpecializations.map((spec) => (
                <Badge
                  key={spec.specialization}
                  variant="outline"
                  className="text-sm"
                >
                  {spec.specialization}: {spec.count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Average Volunteers per Coordinator:
              </span>
              <span className="font-medium">
                {stats.averageVolunteersPerCoordinator?.toFixed(1) || "0"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Coordinators with Managers:
              </span>
              <span className="font-medium">
                {stats.coordinatorsWithManagers}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                New Coordinators This Month:
              </span>
              <span className="font-medium">
                {stats.coordinatorsJoinedThisMonth}
              </span>
            </div>
          </CardContent>
        </Card>

        {stats.mostActiveCoordinator && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Most Active Coordinator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {stats.mostActiveCoordinator}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Leading by example
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
