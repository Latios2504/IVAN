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
import type { VolunteerCoordinatorStatsDto } from "../../../types/volunteerCoordinator";

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
      title: "Inactive Coordinators",
      value: stats.inactiveCoordinators,
      icon: UserX,
      color: "bg-red-500",
    },
    {
      title: "Departments",
      value: stats.availableDepartments?.length || 0,
      icon: Shield,
      color: "bg-purple-500",
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
              Available Positions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-white bg-indigo-500 rounded p-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.availablePositions?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Departments
            </CardTitle>
            <Users className="h-4 w-4 text-white bg-orange-500 rounded p-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.availableDepartments?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Statistics */}
      {stats.departmentStats && stats.departmentStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Department Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.departmentStats.map((dept) => (
                <Badge
                  key={dept.department}
                  variant="secondary"
                  className="text-sm"
                >
                  {dept.department}: {dept.count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Positions */}
      {stats.availablePositions && stats.availablePositions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.availablePositions.map((position) => (
                <Badge key={position} variant="outline" className="text-sm">
                  {position}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Departments */}
      {stats.availableDepartments && stats.availableDepartments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.availableDepartments.map((department) => (
                <Badge key={department} variant="outline" className="text-sm">
                  {department}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
