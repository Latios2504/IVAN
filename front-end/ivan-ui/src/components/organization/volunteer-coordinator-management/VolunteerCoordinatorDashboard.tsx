import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, UserCheck, UserX } from "lucide-react";
import type { VolunteerCoordinatorStatsDto } from "@/types/volunteerCoordinator";

interface VolunteerCoordinatorDashboardProps {
  stats: VolunteerCoordinatorStatsDto;
}

export const VolunteerCoordinatorDashboard: React.FC<
  VolunteerCoordinatorDashboardProps
> = ({ stats }) => {
  const statCards = [
    {
      title: "Tổng số Điều phối viên",
      value: stats.totalCoordinators,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Điều phối viên Hoạt động",
      value: stats.activeCoordinators,
      icon: UserCheck,
      color: "bg-green-500",
    },
    {
      title: "Điều phối viên Không hoạt động",
      value: stats.inactiveCoordinators,
      icon: UserX,
      color: "bg-red-500",
    },
    {
      title: "Phòng ban",
      value: stats.availableDepartments?.length || 0,
      icon: Shield,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
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
    </div>
  );
};
