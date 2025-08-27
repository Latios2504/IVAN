import { useEffect, useState, useMemo, useCallback, useRef } from "react";
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
import {
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";

export default function EventManagementPage() {
  const { user } = useAuth();

  // State management
  const [allEvents, setAllEvents] = useState<EventDto[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventDto[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  const [categories, setCategories] = useState<EventCategoryDto[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [statuses, setStatuses] = useState<EventStatusDto[]>([]);
  const [statusesLoading, setStatusesLoading] = useState(false);

  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Current active filters
  const [activeFilters, setActiveFilters] = useState({
    search: "",
    categoryId: "all",
    statusId: "all",
  });

  // Ref to prevent initial load double-call
  const hasLoadedInitialData = useRef(false);

  // Load all data on mount
  useEffect(() => {
    // Only load data if user has organization profile and hasn't loaded yet
    if (user?.organizationId && !hasLoadedInitialData.current) {
      hasLoadedInitialData.current = true;
      loadAllData();
    } else if (user && !user.organizationId) {
      toast.error("Không tìm thấy thông tin tổ chức. Vui lòng liên hệ hỗ trợ.");
    }
  }, [user?.organizationId]);

  const loadEvents = useCallback(async () => {
    // Check if user has organization profile
    if (!user?.organizationId) {
      toast.error("Không tìm thấy thông tin tổ chức. Vui lòng liên hệ hỗ trợ.");
      return;
    }

    // Load all events for this organization (no client-side filtering yet)
    setEventsLoading(true);
    try {
      const eventFilters: EventFilterDto = {
        page: 1,
        size: 1000, // Load all events at once for better UX
        sortBy: "startDate",
        sortDirection: "desc",
        organizationId: user.organizationId, // Only load this organization's events
      };
      const result = await eventsService.getEvents(eventFilters);
      setAllEvents(result.items);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Không thể tải danh sách sự kiện"
      );
    } finally {
      setEventsLoading(false);
    }
  }, [user?.organizationId]);

  const loadAllData = useCallback(async () => {
    // Check if user has organization profile
    if (!user?.organizationId) {
      toast.error("Không tìm thấy thông tin tổ chức. Vui lòng liên hệ hỗ trợ.");
      return;
    }

    // Load all data in parallel for better performance
    const promises = [
      // Load events
      loadEvents(),
      // Load categories
      (async () => {
        setCategoriesLoading(true);
        try {
          const categoriesResult = await eventsService.getEventCategories();
          setCategories(categoriesResult);
        } catch (err) {
          console.warn("Không thể tải danh mục:", err);
        } finally {
          setCategoriesLoading(false);
        }
      })(),
      // Load statuses
      (async () => {
        setStatusesLoading(true);
        try {
          const statusesResult = await eventsService.getEventStatuses();
          setStatuses(statusesResult);
        } catch (err) {
          console.warn("Không thể tải trạng thái:", err);
        } finally {
          setStatusesLoading(false);
        }
      })(),
    ];

    await Promise.all(promises);
  }, [user?.organizationId, loadEvents]);

  const handleCreateSuccess = useCallback(() => {
    setShowCreateDialog(false);
    loadEvents(); // Refresh events data
  }, [loadEvents]);

  const handleEditSuccess = useCallback(() => {
    loadEvents(); // Refresh events data
  }, [loadEvents]);

  // Handle filter changes from EventFilters component (client-side filtering)
  const handleFiltersChange = useCallback((newFilters: any) => {
    setActiveFilters(newFilters);
  }, []);

  // Apply client-side filtering
  useEffect(() => {
    let filtered = [...allEvents];

    // Apply search filter
    if (activeFilters.search && activeFilters.search.trim()) {
      const searchTerm = activeFilters.search.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.eventName.toLowerCase().includes(searchTerm) ||
          (event.description &&
            event.description.toLowerCase().includes(searchTerm)) ||
          (event.shortDescription &&
            event.shortDescription.toLowerCase().includes(searchTerm))
      );
    }

    // Apply category filter
    if (activeFilters.categoryId && activeFilters.categoryId !== "all") {
      const categoryId = parseInt(activeFilters.categoryId);
      filtered = filtered.filter((event) => event.categoryId === categoryId);
    }

    // Apply status filter
    if (activeFilters.statusId && activeFilters.statusId !== "all") {
      const statusId = parseInt(activeFilters.statusId);
      filtered = filtered.filter((event) => event.statusId === statusId);
    }

    setFilteredEvents(filtered);
  }, [allEvents, activeFilters]);

  // Calculate event statistics based on all events (not filtered)
  const eventStats = useMemo(() => {
    const total = allEvents.length;
    const active = allEvents.filter(
      (event) =>
        event.statusName?.toLowerCase() === "ongoing" ||
        event.statusName?.toLowerCase() === "published"
    ).length;
    const upcoming = allEvents.filter((event) => {
      const startDate = new Date(event.startDate);
      const now = new Date();
      return startDate > now;
    }).length;
    const completed = allEvents.filter(
      (event) => event.statusName?.toLowerCase() === "completed"
    ).length;

    return { total, active, upcoming, completed };
  }, [allEvents]);

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
          <h1 className="text-3xl font-bold">Quản lý Sự kiện</h1>
          <p className="text-muted-foreground">
            Quản lý các sự kiện tình nguyện của tổ chức
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
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
        initialFilters={activeFilters}
      />

      {/* Event List */}
      {filteredEvents.length > 0 ? (
        <EventList events={filteredEvents} onEventUpdated={handleEditSuccess} />
      ) : allEvents.length > 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-xl border">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            Không tìm thấy sự kiện nào với bộ lọc hiện tại
          </h3>
          <p className="text-muted-foreground mb-4">
            Thử thay đổi điều kiện tìm kiếm hoặc bộ lọc
          </p>
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/50 rounded-xl border">
          <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Chưa có sự kiện nào</h3>
          <p className="text-muted-foreground mb-4">
            Tạo sự kiện đầu tiên để bắt đầu
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
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
