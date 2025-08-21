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
    <div className="space-y-6 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 dark:from-slate-900/50 dark:via-blue-900/10 dark:to-indigo-900/20 rounded-xl p-6 backdrop-blur-sm">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-gradient-to-br from-white/80 via-blue-50/40 to-indigo-50/60 dark:from-slate-800/80 dark:via-slate-700/40 dark:to-slate-600/60 border-blue-200/30 dark:border-slate-600/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
                {stat.title}
              </CardTitle>
              <stat.icon
                className={`h-4 w-4 text-white ${stat.color} rounded p-1 shadow-md`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 dark:from-blue-300 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-red-50/80 via-pink-50/60 to-rose-50/80 dark:from-red-900/20 dark:via-pink-900/15 dark:to-rose-900/20 border-red-200/40 dark:border-red-700/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-red-700 to-rose-700 dark:from-red-300 dark:to-rose-300 bg-clip-text text-transparent">
              Inactive Coordinators
            </CardTitle>
            <UserX className="h-4 w-4 text-white bg-red-500 rounded p-1 shadow-md" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
              {stats.inactiveCoordinators}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-violet-50/80 dark:from-indigo-900/20 dark:via-purple-900/15 dark:to-violet-900/20 border-indigo-200/40 dark:border-indigo-700/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-indigo-700 to-violet-700 dark:from-indigo-300 dark:to-violet-300 bg-clip-text text-transparent">
              Available Positions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-white bg-indigo-500 rounded p-1 shadow-md" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              {stats.availablePositions?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50/80 via-amber-50/60 to-yellow-50/80 dark:from-orange-900/20 dark:via-amber-900/15 dark:to-yellow-900/20 border-orange-200/40 dark:border-orange-700/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-orange-700 to-yellow-700 dark:from-orange-300 dark:to-yellow-300 bg-clip-text text-transparent">
              Available Departments
            </CardTitle>
            <Users className="h-4 w-4 text-white bg-orange-500 rounded p-1 shadow-md" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 dark:from-orange-400 dark:to-yellow-400 bg-clip-text text-transparent">
              {stats.availableDepartments?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Statistics */}
      {stats.departmentStats && stats.departmentStats.length > 0 && (
        <Card className="bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-cyan-50/80 dark:from-emerald-900/20 dark:via-teal-900/15 dark:to-cyan-900/20 border-emerald-200/40 dark:border-emerald-700/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 dark:from-emerald-300 dark:via-teal-300 dark:to-cyan-300 bg-clip-text text-transparent">Department Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.departmentStats.map((dept) => (
                <Badge
                  key={dept.department}
                  variant="secondary"
                  className="text-sm bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-800 dark:to-teal-800 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-600"
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
        <Card className="bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80 dark:from-blue-900/20 dark:via-indigo-900/15 dark:to-purple-900/20 border-blue-200/40 dark:border-blue-700/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 dark:from-blue-300 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">Available Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.availablePositions.map((position) => (
                <Badge key={position} variant="outline" className="text-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600">
                  {position}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Departments */}
      {stats.availableDepartments && stats.availableDepartments.length > 0 && (
        <Card className="bg-gradient-to-br from-orange-50/80 via-amber-50/60 to-yellow-50/80 dark:from-orange-900/20 dark:via-amber-900/15 dark:to-yellow-900/20 border-orange-200/40 dark:border-orange-700/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-orange-700 via-amber-700 to-yellow-700 dark:from-orange-300 dark:via-amber-300 dark:to-yellow-300 bg-clip-text text-transparent">Available Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.availableDepartments.map((department) => (
                <Badge key={department} variant="outline" className="text-sm bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900 dark:to-amber-900 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-600">
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
