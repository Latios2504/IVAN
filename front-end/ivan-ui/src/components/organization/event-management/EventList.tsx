import React, { useState, useEffect } from "react";
import { DataTable } from "../../common/DataTable";
import type { TableColumn, TableAction } from "../../common/DataTable";
import { Badge } from "../../ui/badge";
import { Edit, Trash2, Eye, Play, CheckCircle, XCircle } from "lucide-react";
import type { EventDto } from "../../../types/events";
import { eventsService } from "../../../services/eventsService";
import { EditEventDialog } from "./EditEventDialog";
import { EventDetailDialog } from "./EventDetailDialog";
import { toast } from "sonner";

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

  // Load categories and statuses on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [categoriesResult, statusesResult] = await Promise.all([
          categoriesService.getAll(),
          statusesService.getAll(),
        ]);
        setCategories(categoriesResult);
        setStatuses(statusesResult);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Không thể tải dữ liệu"
        );
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
    if (confirm(`Bạn có chắc chắn muốn xóa "${event.eventName}"?`)) {
      try {
        await eventsService.deleteEvent(event.eventId);
        onEventUpdated?.();
      } catch (error) {
        toast.error("Không thể xóa sự kiện. Vui lòng thử lại.");
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

  // Status update handlers
  const handleStartEvent = async (event: EventDto) => {
    try {
      await eventsService.updateEventStatus(event.eventId, {
        status: "Ongoing",
      });
      onEventUpdated?.();
    } catch (error) {
      console.error("Lỗi khi bắt đầu sự kiện:", error);
      toast.error("Không thể bắt đầu sự kiện");
    }
  };

  const handleCompleteEvent = async (event: EventDto) => {
    try {
      await eventsService.updateEventStatus(event.eventId, {
        status: "Completed",
      });
      onEventUpdated?.();
    } catch (error) {
      console.error("Lỗi khi hoàn thành sự kiện:", error);
      toast.error("Không thể hoàn thành sự kiện");
    }
  };

  const handleCancelEvent = async (event: EventDto) => {
    if (confirm(`Bạn có chắc chắn muốn hủy sự kiện "${event.eventName}"?`)) {
      try {
        await eventsService.updateEventStatus(event.eventId, {
          status: "Cancelled",
        });
        onEventUpdated?.();
      } catch (error) {
        console.error("Lỗi khi hủy sự kiện:", error);
        toast.error("Không thể hủy sự kiện");
      }
    }
  };

  const handlePublishEvent = async (event: EventDto) => {
    try {
      await eventsService.updateEventStatus(event.eventId, {
        status: "Published",
      });
      onEventUpdated?.();
    } catch (error) {
      console.error("Lỗi khi xuất bản sự kiện:", error);
      toast.error("Không thể xuất bản sự kiện");
    }
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
      header: "Tên Sự kiện",
      render: (value: string, event: EventDto) => (
        <div className="space-y-1">
          <div className="font-semibold hover:text-primary transition-colors cursor-pointer">
            {event.eventName}
          </div>
          <div className="text-sm px-2 py-1 bg-muted text-muted-foreground rounded-full inline-block">
            {event.categoryName}
          </div>
        </div>
      ),
    },
    {
      key: "statusName",
      header: "Trạng thái",
      render: (value: string, event: EventDto) => (
        <Badge variant={getStatusVariant(event.statusName)}>
          {event.statusName}
        </Badge>
      ),
    },
    {
      key: "startDate",
      header: "Ngày Bắt đầu",
      render: (value: string) => (
        <div className="px-3 py-1 bg-muted text-foreground rounded-lg text-sm font-medium">
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
      header: "Tình nguyện viên",
      render: (_, event: EventDto) => (
        <div className="px-3 py-1 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold">
          {event.volunteersRegistered || 0}/{event.maxVolunteers || 0}
        </div>
      ),
    },
    {
      key: "location",
      header: "Địa điểm",
      render: (value: string, event: EventDto) => (
        <div className="text-sm space-y-1">
          <div className="truncate max-w-[200px] font-medium">
            {event.location}
          </div>
          {event.province && (
            <div className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-md truncate inline-block">
              {event.province}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "isFeatured",
      header: "Nổi bật",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "⭐ Có" : "Không"}
        </Badge>
      ),
    },
  ];

  const actions: TableAction<EventDto>[] = [
    {
      label: "Xem",
      icon: <Eye className="h-4 w-4" />,
      onClick: handleView,
      variant: "ghost",
      size: "sm",
      tooltip: "Xem chi tiết sự kiện",
    },
    {
      label: "Bắt đầu",
      icon: <Play className="h-4 w-4" />,
      onClick: handleStartEvent,
      variant: "ghost",
      size: "sm",
      tooltip: "Bắt đầu sự kiện",
      visible: (event) => event.statusName?.toLowerCase() === "published",
    },
    {
      label: "Hoàn thành",
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: handleCompleteEvent,
      variant: "ghost",
      size: "sm",
      tooltip: "Đánh dấu hoàn thành",
      visible: (event) => event.statusName?.toLowerCase() === "ongoing",
    },
    {
      label: "Hủy sự kiện",
      icon: <XCircle className="h-4 w-4" />,
      onClick: handleCancelEvent,
      variant: "ghost",
      size: "sm",
      tooltip: "Hủy sự kiện",
      visible: (event) => {
        const status = event.statusName?.toLowerCase();
        return status === "published" || status === "ongoing";
      },
    },
    {
      label: "Sửa",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
      variant: "ghost",
      size: "sm",
      tooltip: "Chỉnh sửa sự kiện",
      visible: (event) => {
        const status = event.statusName?.toLowerCase();
        return status !== "completed" && status !== "cancelled";
      },
    },
    {
      label: "Xóa",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: "ghost",
      size: "sm",
      tooltip: "Xóa sự kiện",
      visible: (event) => {
        const status = event.statusName?.toLowerCase();
        return status !== "completed";
      },
    },
  ];

  // Error handling now uses toast notifications

  return (
    <>
      <DataTable
        data={events}
        columns={columns}
        actions={actions}
        showPagination={false}
        emptyMessage="Không tìm thấy sự kiện nào"
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
