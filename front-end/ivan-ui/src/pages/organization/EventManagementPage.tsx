import { useEffect, useState, useMemo } from "react";
import { eventsService } from "@/services/eventsService";
import { useAuth } from "@/hooks/useAuth";
import type {
  EventDto,
  EventCategoryDto,
  EventStatusDto,
  EventFilterDto,
} from "@/types/events";
import { EventList } from "@/components/organization/event-management/EventList";
import { EventFilters } from "@/components/organization/event-management/EventFilters";
import { CreateEventDialog } from "@/components/organization/event-management/CreateEventDialog";
import { LoadingState } from "@/components/common/LoadingState";
import { toast } from "sonner";
import { StatsCard } from "@/components/common/StatsCard";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";

export default function EventManagementPage() {
  const { user } = useAuth();

  // State management
  const [events, setEvents] = useState<EventDto[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);


  const [categories, setCategories] = useState<EventCategoryDto[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [statuses, setStatuses] = useState<EventStatusDto[]>([]);
  const [statusesLoading, setStatusesLoading] = useState(false);

  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<EventFilterDto>({
    page: 1,
    size: 100,
    sortBy: "startDate",
    sortDirection: "desc",
  });

  // Load all data on mount
  useEffect(() => {
    // Only load data if user has organization profile
    if (user?.organizationId) {
      loadAllData();
    } else if (user && !user.organizationId) {
      toast.error("Không tìm thấy thông tin tổ chức. Vui lòng liên hệ hỗ trợ.");
    }
  }, [user?.organizationId]);

  // Load events when filters change
  useEffect(() => {
    if (user?.organizationId) {
      loadEvents();
    }
  }, [filters, user?.organizationId]);

  const loadEvents = async () => {
    // Check if user has organization profile
    if (!user?.organizationId) {
      toast.error("Không tìm thấy thông tin tổ chức. Vui lòng liên hệ hỗ trợ.");
      return;
    }

    // Load events with current filters
    setEventsLoading(true);
    try {
      const eventFilters = {
        ...filters,
        organizationId: user.organizationId, // Only load this organization's events
      };
      const result = await eventsService.getEvents(eventFilters);
      setEvents(result.items);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Không thể tải danh sách sự kiện"
      );
    } finally {
      setEventsLoading(false);
    }
  };

  const loadAllData = async () => {
    // Check if user has organization profile
    if (!user?.organizationId) {
      toast.error("Không tìm thấy thông tin tổ chức. Vui lòng liên hệ hỗ trợ.");
      return;
    }

    // Load categories
    setCategoriesLoading(true);
    try {
      const categoriesResult = await eventsService.getEventCategories();
      setCategories(categoriesResult);
    } catch (err) {
      console.warn("Không thể tải danh mục:", err);
    } finally {
      setCategoriesLoading(false);
    }

    // Load statuses
    setStatusesLoading(true);
    try {
      const statusesResult = await eventsService.getEventStatuses();
      setStatuses(statusesResult);
    } catch (err) {
      console.warn("Không thể tải trạng thái:", err);
    } finally {
      setStatusesLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    loadEvents(); // Refresh events data
  };

  const handleEditSuccess = () => {
    loadEvents(); // Refresh events data
  };

  // Handle filter changes from EventFilters component
  const handleFiltersChange = (newFilters: any) => {
    // Convert filter values from EventFilters component to EventFilterDto format
    const updatedFilters: EventFilterDto = {
      ...filters,
      page: 1, // Reset to first page when filters change
    };

    // Handle search
    if (newFilters.search && newFilters.search.trim()) {
      updatedFilters.search = newFilters.search.trim();
    } else {
      delete updatedFilters.search;
    }

    // Handle category filter
    if (newFilters.categoryId && newFilters.categoryId !== "all") {
      updatedFilters.categoryIds = [parseInt(newFilters.categoryId)];
    } else {
      delete updatedFilters.categoryIds;
    }

    // Handle status filter
    if (newFilters.statusId && newFilters.statusId !== "all") {
      updatedFilters.statusIds = [parseInt(newFilters.statusId)];
    } else {
      delete updatedFilters.statusIds;
    }

    setFilters(updatedFilters);
  };

  // Calculate event statistics - must be before any early returns
  const eventStats = useMemo(() => {
    const total = events.length;
    const active = events.filter(event => event.statusName?.toLowerCase() === 'ongoing' || event.statusName?.toLowerCase() === 'published').length;
    const upcoming = events.filter(event => {
      const startDate = new Date(event.startDate);
      const now = new Date();
      return startDate > now;
    }).length;
    const completed = events.filter(event => event.statusName?.toLowerCase() === 'completed').length;
    
    return { total, active, upcoming, completed };
  }, [events]);

  // Determine loading state
  const isLoading = eventsLoading;

  if (isLoading) {
    return <LoadingState loading={true} />;
  }



  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-muted/50 rounded-lg p-4 border">
        <div>
          <h1 className="text-3xl font-bold">
            Quản lý Sự kiện
          </h1>
          <p className="text-muted-foreground">
            Quản lý các sự kiện tình nguyện của tổ chức
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo Sự kiện
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Tổng Sự kiện"
          value={eventStats.total}
          icon={Calendar}
        />
        <StatsCard
          title="Sự kiện Đang diễn ra"
          value={eventStats.active}
          icon={CheckCircle}
        />
        <StatsCard
          title="Sự kiện Sắp tới"
          value={eventStats.upcoming}
          icon={Clock}
        />
        <StatsCard
          title="Sự kiện Đã hoàn thành"
          value={eventStats.completed}
          icon={XCircle}
        />
      </div>

      {/* Filters */}
      <EventFilters 
        categories={categories} 
        statuses={statuses} 
        onFiltersChange={handleFiltersChange}
      />

      {/* Event List */}
      {events.length > 0 ? (
        <EventList events={events} onEventUpdated={handleEditSuccess} />
      ) : (
        <div className="text-center py-12 bg-muted/50 rounded-xl border">
          <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            Không tìm thấy sự kiện nào
          </h3>
          <p className="text-muted-foreground mb-4">
            Tạo sự kiện đầu tiên để bắt đầu
          </p>
          <Button
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo Sự kiện
          </Button>
        </div>
      )}

      {/* Create Event Dialog */}
      <CreateEventDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handleCreateSuccess}
        categories={categories}
      />
    </div>
  );
}
