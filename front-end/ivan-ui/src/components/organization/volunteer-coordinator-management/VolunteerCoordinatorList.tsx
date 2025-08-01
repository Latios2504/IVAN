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
import { useVolunteerCoordinator } from "../../../context/VolunteerCoordinatorContext";
// import { EditVolunteerCoordinatorDialog } from "./EditVolunteerCoordinatorDialog";
// import { VolunteerCoordinatorDetailDialog } from "./VolunteerCoordinatorDetailDialog";
// import { AssignManagerDialog } from "./AssignManagerDialog";

interface VolunteerCoordinatorListProps {
  coordinators: VolunteerCoordinatorDto[];
  onCoordinatorUpdated?: () => void;
}

export const VolunteerCoordinatorList: React.FC<
  VolunteerCoordinatorListProps
> = ({ coordinators, onCoordinatorUpdated }) => {
  const {
    deleteCoordinator,
    toggleCoordinatorStatus,
    setCurrentCoordinator,
    setFilters,
    filters,
    pagination,
  } = useVolunteerCoordinator();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showAssignManagerDialog, setShowAssignManagerDialog] = useState(false);
  const [editingCoordinator, setEditingCoordinator] =
    useState<VolunteerCoordinatorDto | null>(null);
  const [viewingCoordinator, setViewingCoordinator] =
    useState<VolunteerCoordinatorDto | null>(null);
  const [assigningManagerTo, setAssigningManagerTo] =
    useState<VolunteerCoordinatorDto | null>(null);

  const handleEdit = (coordinator: VolunteerCoordinatorDto) => {
    setEditingCoordinator(coordinator);
    setCurrentCoordinator(coordinator);
    setShowEditDialog(true);
  };

  const handleView = (coordinator: VolunteerCoordinatorDto) => {
    setViewingCoordinator(coordinator);
    setCurrentCoordinator(coordinator);
    setShowDetailDialog(true);
  };

  const handleAssignManager = (coordinator: VolunteerCoordinatorDto) => {
    setAssigningManagerTo(coordinator);
    setShowAssignManagerDialog(true);
  };

  const handleToggleStatus = async (coordinator: VolunteerCoordinatorDto) => {
    const action = coordinator.isActive ? "deactivate" : "activate";
    if (
      confirm(`Are you sure you want to ${action} "${coordinator.fullName}"?`)
    ) {
      try {
        await toggleCoordinatorStatus(coordinator.coordinatorId);
      } catch (error) {
        console.error(`Failed to ${action} coordinator:`, error);
      }
    }
  };

  const handleDelete = async (coordinator: VolunteerCoordinatorDto) => {
    if (
      confirm(
        `Are you sure you want to delete "${coordinator.fullName}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteCoordinator(coordinator.coordinatorId);
      } catch (error) {
        console.error("Failed to delete coordinator:", error);
      }
    }
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    setEditingCoordinator(null);
    onCoordinatorUpdated?.();
  };

  const handleDetailClose = () => {
    setShowDetailDialog(false);
    setViewingCoordinator(null);
  };

  const handleAssignManagerSuccess = () => {
    setShowAssignManagerDialog(false);
    setAssigningManagerTo(null);
    onCoordinatorUpdated?.();
  };

  const getStatusVariant = (isActive: boolean) => {
    return isActive ? "default" : "secondary";
  };

  const getManagementLevelVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case "senior":
        return "default";
      case "junior":
        return "secondary";
      case "lead":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const columns: TableColumn<VolunteerCoordinatorDto>[] = [
    {
      key: "fullName",
      header: "Coordinator",
      render: (value, coordinator) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={coordinator.profileImageUrl} />
            <AvatarFallback className="text-xs">
              {getInitials(coordinator.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{coordinator.fullName}</div>
            <div className="text-sm text-muted-foreground">
              {coordinator.email}
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "managementLevel",
      header: "Level",
      render: (value, coordinator) => (
        <Badge variant={getManagementLevelVariant(coordinator.managementLevel)}>
          {coordinator.managementLevel}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: "specialization",
      header: "Specialization",
      render: (value, coordinator) => coordinator.specialization || "N/A",
      sortable: true,
    },
    {
      key: "managerCoordinatorName",
      header: "Manager",
      render: (value, coordinator) => (
        <div className="flex items-center gap-1">
          {coordinator.managerCoordinatorName ? (
            <>
              <Shield className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">
                {coordinator.managerCoordinatorName}
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">No Manager</span>
          )}
        </div>
      ),
    },
    {
      key: "totalVolunteersManaged",
      header: "Volunteers",
      render: (value, coordinator) => (
        <div className="text-center">
          <div className="font-medium">
            {coordinator.totalVolunteersManaged || 0}
          </div>
          <div className="text-xs text-muted-foreground">
            Max: {coordinator.maxVolunteersManaged || "∞"}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "totalEventsManaged",
      header: "Events",
      render: (value, coordinator) => (
        <div className="text-center font-medium">
          {coordinator.totalEventsManaged || 0}
        </div>
      ),
      sortable: true,
    },
    {
      key: "isActive",
      header: "Status",
      render: (value, coordinator) => (
        <Badge variant={getStatusVariant(coordinator.isActive)}>
          {coordinator.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: "dateJoined",
      header: "Joined",
      render: (value, coordinator) => (
        <div className="text-sm">{formatDate(coordinator.dateJoined)}</div>
      ),
      sortable: true,
    },
    {
      key: "actions",
      header: "",
      render: (value, coordinator) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(coordinator)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(coordinator)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAssignManager(coordinator)}>
              <UserCog className="mr-2 h-4 w-4" />
              Assign Manager
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleToggleStatus(coordinator)}
              className={
                coordinator.isActive ? "text-orange-600" : "text-green-600"
              }
            >
              <UserMinus className="mr-2 h-4 w-4" />
              {coordinator.isActive ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(coordinator)}
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

  const handleSort = (key: string, direction: "asc" | "desc") => {
    setFilters({
      sortBy: key,
      sortDirection: direction,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={coordinators}
        loading={false}
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalCount: pagination.totalCount,
          pageSize: pagination.pageSize,
        }}
        sorting={{
          sortBy: filters.sortBy || "fullName",
          sortDirection: filters.sortDirection || "asc",
        }}
        onSort={handleSort}
        onPageChange={handlePageChange}
        emptyMessage="No volunteer coordinators found"
      />

      {/* TODO: Add dialogs when created */}
      {/* Edit Dialog */}
      {/* {showEditDialog && editingCoordinator && (
        <EditVolunteerCoordinatorDialog
          coordinator={editingCoordinator}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSuccess={handleEditSuccess}
        />
      )} */}

      {/* Detail Dialog */}
      {/* {showDetailDialog && viewingCoordinator && (
        <VolunteerCoordinatorDetailDialog
          coordinator={viewingCoordinator}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
          onClose={handleDetailClose}
        />
      )} */}

      {/* Assign Manager Dialog */}
      {/* {showAssignManagerDialog && assigningManagerTo && (
        <AssignManagerDialog
          coordinator={assigningManagerTo}
          open={showAssignManagerDialog}
          onOpenChange={setShowAssignManagerDialog}
          onSuccess={handleAssignManagerSuccess}
        />
      )} */}
    </>
  );
};
