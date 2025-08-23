import React, { useState, useEffect } from "react";
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
import type { EventDto } from "../../../types/events";
import { eventsService } from "../../../services/eventsService";
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
  // Service adapters for events, categories, and statuses
  const eventsServiceAdapter = {
    remove: async (id: string | number) => {
      await eventsService.deleteEvent(Number(id));
      return true;
    },
  };

  const categoriesService = {
    getAll: async () => {
      return await eventsService.getEventCategories();
    },
  };

  const statusesService = {
    getAll: async () => {
      return await eventsService.getEventStatuses();
    },
  };

  // State management
  const [categories, setCategories] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load categories and statuses on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [categoriesResult, statusesResult] = await Promise.all([
          categoriesService.getAll(),
          statusesService.getAll(),
        ]);
        setCategories(categoriesResult);
        setStatuses(statusesResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventDto | null>(null);
  const [viewingEvent, setViewingEvent] = useState<EventDto | null>(null);
  const [currentEvent, setCurrentEvent] = useState<EventDto | null>(null);

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
        await eventsService.deleteEvent(event.eventId);
        onEventUpdated?.();
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

  const getStatusGradient = (status: string): string => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md hover:shadow-lg";
      case "planning":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md hover:shadow-lg";
      case "cancelled":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md hover:shadow-lg";
      case "completed":
        return "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md hover:shadow-lg";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-md hover:shadow-lg";
    }
  };

  const columns: TableColumn<EventDto>[] = [
    {
      key: "eventName",
      header: "Event Name",
      render: (value: string, event: EventDto) => (
        <div className="space-y-1">
          <div className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
            {event.eventName}
          </div>
          <div className="text-sm px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full inline-block">
            {event.categoryName}
          </div>
        </div>
      ),
    },
    {
      key: "statusName",
      header: "Status",
      render: (value: string, event: EventDto) => (
        <Badge
          className={`${getStatusGradient(
            event.statusName
          )} transition-all duration-200 hover:scale-105`}
        >
          {event.statusName}
        </Badge>
      ),
    },
    {
      key: "startDate",
      header: "Start Date",
      render: (value: string) => (
        <div className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-200 rounded-lg text-sm font-medium shadow-sm">
          {new Date(value).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      ),
    },
    {
      key: "volunteers",
      header: "Volunteers",
      render: (_, event: EventDto) => (
        <div className="px-3 py-1 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-800 dark:text-teal-200 rounded-lg text-sm font-semibold shadow-sm">
          {event.volunteersRegistered || 0}/{event.maxVolunteers || 0}
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (value: string, event: EventDto) => (
        <div className="text-sm space-y-1">
          <div className="truncate max-w-[200px] font-medium text-gray-900 dark:text-gray-100">
            {event.location}
          </div>
          {event.province && (
            <div className="text-xs px-2 py-1 bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 text-gray-600 dark:text-gray-400 rounded-md truncate inline-block">
              {event.province}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "isFeatured",
      header: "Featured",
      render: (value: boolean) => (
        <Badge
          className={
            value
              ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              : "bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
          }
        >
          {value ? "⭐ Yes" : "No"}
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
        showPagination={false}
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
