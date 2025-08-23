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
import { VolunteerCoordinatorDetailModal } from "./VolunteerCoordinatorDetailModal";
import { EditVolunteerCoordinatorModal } from "./EditVolunteerCoordinatorModal";

interface VolunteerCoordinatorListProps {
  organizationId: number;
  coordinators: VolunteerCoordinatorDto[];
  onCoordinatorUpdated?: () => void;
  availableManagers?: any[];
}

export const VolunteerCoordinatorList: React.FC<
  VolunteerCoordinatorListProps
> = ({ organizationId, coordinators, onCoordinatorUpdated, availableManagers = [] }) => {
  const [loading, setLoading] = useState(false);
  const [selectedCoordinator, setSelectedCoordinator] = useState<VolunteerCoordinatorDto | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const getStatusColor = (isActive?: boolean) => {
    if (isActive === true) {
      return "bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-800 dark:to-green-800 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-600";
    } else if (isActive === false) {
      return "bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-800 dark:to-rose-800 text-red-800 dark:text-red-200 border-red-300 dark:border-red-600";
    } else {
      return "bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600";
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
    setSelectedCoordinator(coordinator);
    setShowEditModal(true);
  };

  const handleViewDetails = (coordinator: VolunteerCoordinatorDto) => {
    setSelectedCoordinator(coordinator);
    setShowDetailModal(true);
  };

  const handleEditSuccess = () => {
    onCoordinatorUpdated?.();
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
        <Badge variant="outline" className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-600">
          {coordinator.position || "Not specified"}
        </Badge>
      ),
    },
    {
      key: "department",
      header: "Department",
      render: (_, coordinator) => (
        <span className="text-sm bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 dark:from-purple-300 dark:via-indigo-300 dark:to-blue-300 bg-clip-text text-transparent font-medium">
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
              <div className="font-medium bg-gradient-to-r from-orange-700 via-amber-700 to-yellow-700 dark:from-orange-300 dark:via-amber-300 dark:to-yellow-300 bg-clip-text text-transparent">
                {coordinator.manager.fullName || coordinator.manager.email}
              </div>
              <div className="text-gray-500 dark:text-gray-400">Manager</div>
            </div>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">No manager assigned</span>
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
        <span className="text-sm bg-gradient-to-r from-teal-700 via-cyan-700 to-blue-700 dark:from-teal-300 dark:via-cyan-300 dark:to-blue-300 bg-clip-text text-transparent font-medium">
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
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800 dark:hover:to-indigo-800 transition-all duration-300">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 dark:from-slate-800 dark:via-slate-700/50 dark:to-slate-600/30 border-blue-200/30 dark:border-slate-600/30 backdrop-blur-sm">
            <DropdownMenuItem onClick={() => handleViewDetails(coordinator)} className="hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800 dark:hover:to-indigo-800 transition-all duration-200">
              <Eye className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300">View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleEditCoordinator(coordinator)}
              className="hover:bg-gradient-to-r hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-800 dark:hover:to-amber-800 transition-all duration-200"
            >
              <Edit className="mr-2 h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-orange-700 dark:text-orange-300">Edit</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gradient-to-r from-gray-200 via-slate-200 to-gray-200 dark:from-gray-600 dark:via-slate-600 dark:to-gray-600" />
            <DropdownMenuItem
              onClick={() => handleDeleteCoordinator(coordinator)}
              className="hover:bg-gradient-to-r hover:from-red-100 hover:to-rose-100 dark:hover:from-red-800 dark:hover:to-rose-800 transition-all duration-200"
            >
              <Trash2 className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-red-600 dark:text-red-400">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-4 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 dark:from-slate-800/30 dark:via-blue-900/10 dark:to-indigo-900/20 rounded-lg p-4 backdrop-blur-sm">
        <DataTable data={coordinators} columns={columns} loading={loading} />
      </div>

      {/* Detail Modal */}
      <VolunteerCoordinatorDetailModal
        coordinator={selectedCoordinator}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
      />

      {/* Edit Modal */}
      <EditVolunteerCoordinatorModal
        coordinator={selectedCoordinator}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSuccess={handleEditSuccess}
        availableManagers={availableManagers}
      />
    </>
  );
};
