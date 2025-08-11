import React, { useState } from "react";
import { DataTable } from "../../common/DataTable";
import type { TableColumn, TableAction } from "../../common/DataTable";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  UserCog,
  UserMinus,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import type { VolunteerCoordinatorDto } from "../../../types/volunteer-coordinator";
import { volunteerCoordinatorService } from "../../../services/volunteerCoordinatorService";
// import { EditVolunteerCoordinatorDialog } from "./EditVolunteerCoordinatorDialog";
// import { VolunteerCoordinatorDetailDialog } from "./VolunteerCoordinatorDetailDialog";
// import { AssignManagerDialog } from "./AssignManagerDialog";

interface VolunteerCoordinatorListProps {
  organizationId: number;
  coordinators: VolunteerCoordinatorDto[];
  onCoordinatorUpdated?: () => void;
}

export const VolunteerCoordinatorList: React.FC<
  VolunteerCoordinatorListProps
> = ({ organizationId, coordinators, onCoordinatorUpdated }) => {
  const [loading, setLoading] = useState(false);

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showAssignManagerDialog, setShowAssignManagerDialog] = useState(false);
  const [editingCoordinator, setEditingCoordinator] =
    useState<VolunteerCoordinatorDto | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getManagementLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "senior":
        return "bg-purple-100 text-purple-800";
      case "lead":
        return "bg-blue-100 text-blue-800";
      case "coordinator":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleToggleStatus = async (coordinator: VolunteerCoordinatorDto) => {
    try {
      setLoading(true);
      await volunteerCoordinatorService.toggleCoordinatorStatus(
        coordinator.coordinatorId
      );
      onCoordinatorUpdated?.();
    } catch (error) {
      console.error("Failed to toggle coordinator status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignManager = (coordinator: VolunteerCoordinatorDto) => {
    setEditingCoordinator(coordinator);
    setShowAssignManagerDialog(true);
  };

  const handleRemoveManager = async (coordinator: VolunteerCoordinatorDto) => {
    try {
      setLoading(true);
      await volunteerCoordinatorService.removeManager(
        coordinator.coordinatorId
      );
      onCoordinatorUpdated?.();
    } catch (error) {
      console.error("Failed to remove manager:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCoordinator = (coordinator: VolunteerCoordinatorDto) => {
    setEditingCoordinator(coordinator);
    setShowEditDialog(true);
  };

  const handleViewDetails = (coordinator: VolunteerCoordinatorDto) => {
    setEditingCoordinator(coordinator);
    setShowDetailDialog(true);
  };

  const columns: TableColumn<VolunteerCoordinatorDto>[] = [
    {
      key: "coordinator",
      header: "Coordinator",
      render: (_, coordinator) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={coordinator.profileImageUrl}
              alt={coordinator.fullName}
            />
            <AvatarFallback>
              {coordinator.fullName
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-gray-900">
              {coordinator.fullName}
            </div>
            <div className="text-sm text-gray-500">{coordinator.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "managementLevel",
      header: "Level",
      render: (_, coordinator) => (
        <Badge className={getManagementLevelColor(coordinator.managementLevel)}>
          {coordinator.managementLevel}
        </Badge>
      ),
    },
    {
      key: "specialization",
      header: "Specialization",
      render: (_, coordinator) => (
        <span className="text-sm text-gray-900">
          {coordinator.specialization || "General"}
        </span>
      ),
    },
    {
      key: "manager",
      header: "Manager",
      render: (_, coordinator) => (
        <div className="text-sm">
          {coordinator.managerCoordinatorName ? (
            <div>
              <div className="font-medium text-gray-900">
                {coordinator.managerCoordinatorName}
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
        <Badge className={getStatusColor(coordinator.status)}>
          {coordinator.status}
        </Badge>
      ),
    },
    {
      key: "volunteersManaged",
      header: "Volunteers",
      render: (_, coordinator) => (
        <span className="text-sm text-gray-900">
          {coordinator.totalVolunteersManaged || 0}
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
            <DropdownMenuItem onClick={() => handleToggleStatus(coordinator)}>
              <Shield className="mr-2 h-4 w-4" />
              {coordinator.status === "Active" ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
            {coordinator.managerCoordinatorName ? (
              <DropdownMenuItem
                onClick={() => handleRemoveManager(coordinator)}
              >
                <UserMinus className="mr-2 h-4 w-4" />
                Remove Manager
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => handleAssignManager(coordinator)}
              >
                <UserCog className="mr-2 h-4 w-4" />
                Assign Manager
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const actions: TableAction<VolunteerCoordinatorDto>[] = [
    {
      label: "Edit",
      onClick: handleEditCoordinator,
      icon: <Edit className="h-4 w-4" />,
    },
    {
      label: "View Details",
      onClick: handleViewDetails,
      icon: <Eye className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable data={coordinators} columns={columns} actions={actions} />

      {/* Dialogs would go here when implemented */}
      {/* <EditVolunteerCoordinatorDialog
        coordinator={editingCoordinator}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={() => {
          setShowEditDialog(false);
          onCoordinatorUpdated?.();
        }}
      />

      <VolunteerCoordinatorDetailDialog
        coordinator={editingCoordinator}
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
      />

      <AssignManagerDialog
        coordinator={editingCoordinator}
        open={showAssignManagerDialog}
        onOpenChange={setShowAssignManagerDialog}
        onSuccess={() => {
          setShowAssignManagerDialog(false);
          onCoordinatorUpdated?.();
        }}
      /> */}
    </div>
  );
};
