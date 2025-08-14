import React, { useState } from "react";
import { DataTable } from "../../common/DataTable";
import type { TableColumn } from "../../common/DataTable";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { MoreHorizontal, Edit, Trash2, Eye, UserMinus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import type { VolunteerCoordinatorDto } from "../../../types/volunteerCoordinator";
import { volunteerCoordinatorService } from "../../../services/volunteerCoordinatorService";

interface VolunteerCoordinatorListProps {
  organizationId: number;
  coordinators: VolunteerCoordinatorDto[];
  onCoordinatorUpdated?: () => void;
}

export const VolunteerCoordinatorList: React.FC<
  VolunteerCoordinatorListProps
> = ({ organizationId, coordinators, onCoordinatorUpdated }) => {
  const [loading, setLoading] = useState(false);

  const getStatusColor = (isActive?: boolean) => {
    if (isActive === true) {
      return "bg-green-100 text-green-800";
    } else if (isActive === false) {
      return "bg-red-100 text-red-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

  const handleDeleteCoordinator = async (
    coordinator: VolunteerCoordinatorDto
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete ${
          coordinator.user?.fullName || coordinator.user?.email
        }?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await volunteerCoordinatorService.deleteCoordinator(
        coordinator.coordinatorId
      );
      onCoordinatorUpdated?.();
    } catch (error) {
      console.error("Failed to delete coordinator:", error);
      alert("Failed to delete coordinator. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCoordinator = (coordinator: VolunteerCoordinatorDto) => {
    // TODO: Implement edit functionality
    console.log("Edit coordinator:", coordinator);
  };

  const handleViewDetails = (coordinator: VolunteerCoordinatorDto) => {
    // TODO: Implement view details functionality
    console.log("View coordinator details:", coordinator);
  };

  const columns: TableColumn<VolunteerCoordinatorDto>[] = [
    {
      key: "coordinator",
      header: "Coordinator",
      render: (_, coordinator) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={coordinator.user?.avatar}
              alt={coordinator.user?.fullName}
            />
            <AvatarFallback>
              {coordinator.user?.fullName
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase() || "UC"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-gray-900">
              {coordinator.user?.fullName || "N/A"}
            </div>
            <div className="text-sm text-gray-500">
              {coordinator.user?.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "position",
      header: "Position",
      render: (_, coordinator) => (
        <Badge variant="outline">
          {coordinator.position || "Not specified"}
        </Badge>
      ),
    },
    {
      key: "department",
      header: "Department",
      render: (_, coordinator) => (
        <span className="text-sm text-gray-900">
          {coordinator.department || "General"}
        </span>
      ),
    },
    {
      key: "manager",
      header: "Manager",
      render: (_, coordinator) => (
        <div className="text-sm">
          {coordinator.manager ? (
            <div>
              <div className="font-medium text-gray-900">
                {coordinator.manager.fullName || coordinator.manager.email}
              </div>
              <div className="text-gray-500">Manager</div>
            </div>
          ) : (
            <span className="text-gray-400">No manager assigned</span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (_, coordinator) => (
        <Badge className={getStatusColor(coordinator.isActive)}>
          {coordinator.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "hireDate",
      header: "Hire Date",
      render: (_, coordinator) => (
        <span className="text-sm text-gray-900">
          {coordinator.hireDate
            ? new Date(coordinator.hireDate).toLocaleDateString()
            : coordinator.createdAt
            ? new Date(coordinator.createdAt).toLocaleDateString()
            : "N/A"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (_, coordinator) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewDetails(coordinator)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleEditCoordinator(coordinator)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDeleteCoordinator(coordinator)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable data={coordinators} columns={columns} loading={loading} />
    </div>
  );
};
