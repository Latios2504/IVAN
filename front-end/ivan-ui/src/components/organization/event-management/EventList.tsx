import React, { useState } from "react";
import { DataTable } from "../../common/DataTable";
import type { TableColumn, TableAction } from "../../common/DataTable";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import type { EventDto } from "../../../types/event";
import { useEvent } from "../../../context/EventContext";
import { EditEventDialog } from "./EditEventDialog";
import { EventDetailDialog } from "./EventDetailDialog";

interface EventListProps {
  events: EventDto[];
  onEventUpdated?: () => void;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  onEventUpdated,
}) => {
  const {
    deleteEvent,
    setCurrentEvent,
    setFilters,
    filters,
    pagination,
    categories,
    statuses,
  } = useEvent();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventDto | null>(null);
  const [viewingEvent, setViewingEvent] = useState<EventDto | null>(null);

  const handleEdit = (event: EventDto) => {
    setEditingEvent(event);
    setCurrentEvent(event);
    setShowEditDialog(true);
  };

  const handleView = (event: EventDto) => {
    setViewingEvent(event);
    setCurrentEvent(event);
    setShowDetailDialog(true);
  };

  const handleDelete = async (event: EventDto) => {
    if (confirm(`Are you sure you want to delete "${event.eventName}"?`)) {
      try {
        await deleteEvent(event.eventId);
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    setEditingEvent(null);
    onEventUpdated?.();
  };

  const handleDetailClose = () => {
    setShowDetailDialog(false);
    setViewingEvent(null);
  };

  const handleEventUpdated = () => {
    onEventUpdated?.();
  };

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "planning":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "completed":
        return "outline";
      default:
        return "outline";
    }
  };

  const columns: TableColumn<EventDto>[] = [
    {
      key: "eventName",
      header: "Event Name",
      render: (value: string, event: EventDto) => (
        <div>
          <div className="font-medium">{event.eventName}</div>
          <div className="text-sm text-gray-500">{event.categoryName}</div>
        </div>
      ),
    },
    {
      key: "statusName",
      header: "Status",
      render: (value: string, event: EventDto) => (
        <Badge variant={getStatusVariant(event.statusName)}>
          {event.statusName}
        </Badge>
      ),
    },
    {
      key: "startDate",
      header: "Start Date",
      render: (value: string) =>
        new Date(value).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      key: "volunteers",
      header: "Volunteers",
      render: (_, event: EventDto) =>
        `${event.currentVolunteers || 0}/${event.maxVolunteers}`,
    },
    {
      key: "location",
      header: "Location",
      render: (value: string, event: EventDto) => (
        <div className="text-sm">
          <div className="truncate max-w-[200px]">{event.location}</div>
          {event.province && (
            <div className="text-gray-500 truncate">{event.province}</div>
          )}
        </div>
      ),
    },
    {
      key: "isFeatured",
      header: "Featured",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "outline"}>
          {value ? "Yes" : "No"}
        </Badge>
      ),
    },
  ];

  const actions: TableAction<EventDto>[] = [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: handleView,
      variant: "ghost",
      size: "sm",
      tooltip: "View event details",
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
      variant: "ghost",
      size: "sm",
      tooltip: "Edit event",
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: "ghost",
      size: "sm",
      tooltip: "Delete event",
    },
  ];

  return (
    <>
      <DataTable
        data={events}
        columns={columns}
        actions={actions}
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          pageSize: pagination.pageSize,
          totalItems: pagination.totalCount,
          onPageChange: (page) => setFilters({ page }),
        }}
        showPagination={true}
        emptyMessage="No events found"
        onRowClick={handleView}
        enableTooltips={true}
      />

      {/* Edit Event Dialog */}
      {showEditDialog && editingEvent && (
        <EditEventDialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          event={editingEvent}
          categories={categories}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Event Detail Dialog */}
      {showDetailDialog && viewingEvent && (
        <EventDetailDialog
          open={showDetailDialog}
          onClose={handleDetailClose}
          event={viewingEvent}
          categories={categories}
          statuses={statuses}
          onEventUpdated={handleEventUpdated}
        />
      )}
    </>
  );
};
