import { useState, useMemo, useEffect } from "react";
import { Calendar, Users, MapPin, Building, Search } from "lucide-react";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { EventCard } from "@/components/public/EventCard";
import { useApi } from "@/hooks/useApi";
import { publicContentService } from "@/services/publicContentService";
import type { PublicEvent, PublicEventFilters } from "@/types/publicContent";
import type { StatCard } from "@/components/public/StatsSection";

// Data mapper with proper TypeScript typing
const mapPublicEventToCard = (event: PublicEvent) => {
  // Map backend status to EventCard expected status
  const mapStatus = (statusName: string): "open" | "full" | "closed" => {
    const status = statusName?.toLowerCase() || "";
    if (
      status.includes("mở") ||
      status.includes("open") ||
      status === "active"
    ) {
      return "open";
    } else if (status.includes("đủ") || status.includes("full")) {
      return "full";
    } else if (
      status.includes("đóng") ||
      status.includes("closed") ||
      status === "inactive"
    ) {
      return "closed";
    }
    return "open"; // Default to open
  };

  return {
    id: event.eventId?.toString() || "0",
    title: event.eventName || "Tên sự kiện không xác định",
    description: event.description || "Không có mô tả",
    organization: event.organizationName || "Tổ chức không xác định",
    date: event.startDate
      ? new Date(event.startDate).toLocaleDateString("vi-VN")
      : "",
    time: event.startDate
      ? new Date(event.startDate).toLocaleTimeString("vi-VN")
      : "",
    location:
      [event.wardCommune, event.district, event.province]
        .filter(Boolean)
        .join(", ") || "Chưa xác định",
    volunteersNeeded: event.maxVolunteers || 0,
    volunteersRegistered: event.currentVolunteers || 0,
    status: mapStatus(event.statusName || ""),
    category: event.categoryName || "Khác",
    image: event.bannerImageUrl || undefined,
    isUrgent: event.isUrgent || false,
    isFeatured: false, // This would need to come from backend
    viewCount: 0, // This would need to come from backend
  };
};

export default function PublicEventsPage() {
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<PublicEventFilters>({
    search: "",
    categoryId: undefined,
    organizationId: undefined,
    province: "",
    startDate: "",
    endDate: "",
  });

  // Inline debounce implementation
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Update filters when debounced search changes
  useMemo(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  // Service adapter for public events
  const publicEventsService = {
    getAll: async (): Promise<PublicEvent[]> => {
      const result = await publicContentService.getPublicEvents(filters);
      return result.items;
    },
  };

  // Use the new useApi hook
  const eventsApi = useApi(publicEventsService, { autoLoad: true });

  // Load events whenever filters change
  useEffect(() => {
    eventsApi.loadAll();
  }, [filters]);

  // Extract events from the API response
  const events = eventsApi.data || [];
  const loading = eventsApi.loading;
  const error = eventsApi.error;

  // For pagination, we'll use simple client-side pagination for now
  // TODO: Implement server-side pagination by updating the service
  const pagination = {
    page: filters.page || 1,
    totalPages: Math.ceil(events.length / (filters.size || 20)),
    totalItems: events.length,
  };

  // Load events when filters change
  useEffect(() => {
    eventsApi.loadAll();
  }, [filters]);

  // Map backend data to component props
  const mappedEvents = useMemo(
    () => (events || []).map(mapPublicEventToCard),
    [events]
  );

  // Filter change handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // The actual API call will be triggered by the debounced value
  };

  const handleFilterChange = (category: string) => {
    const categoryId = category === "all" ? undefined : parseInt(category);
    setFilters((prev) => ({ ...prev, categoryId }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleRetry = () => {
    eventsApi.loadAll();
  };

  // Filter options (TODO: fetch from backend)
  const filterOptions = [
    { value: "all", label: "Tất cả" },
    { value: "1", label: "Giáo dục" },
    { value: "2", label: "Nghề nghiệp" },
    { value: "3", label: "Đào tạo" },
    { value: "4", label: "Tình nguyện" },
    { value: "5", label: "Cộng đồng" },
  ];

  // Stats calculations
  const statsCards: StatCard[] = [
    {
      title: "Tổng sự kiện",
      value: pagination?.totalItems?.toString() || "0",
      subtitle: "Sự kiện đang mở",
      icon: Calendar,
    },
    {
      title: "Người tham gia",
      value: mappedEvents
        .reduce(
          (total: number, event) => total + (event.volunteersRegistered || 0),
          0
        )
        .toLocaleString(),
      subtitle: "Đã đăng ký",
      icon: Users,
    },
    {
      title: "Địa điểm",
      value: new Set(
        mappedEvents.map((event) => event.location)
      ).size.toString(),
      subtitle: "Thành phố",
      icon: MapPin,
    },
  ];

  return (
    <PublicPageLayout
      title="Sự kiện"
      description="Khám phá các sự kiện, hoạt động và cơ hội phát triển dành cho bạn"
      searchValue={filters.search || ""}
      onSearchChange={handleSearch}
      searchPlaceholder="Tìm kiếm sự kiện..."
      filters={[
        {
          id: "category",
          label: "Loại sự kiện",
          value: filters.categoryId?.toString() || "all",
          options: filterOptions,
          onChange: handleFilterChange,
          icon: <Building className="h-4 w-4" />,
        },
      ]}
      resultCount={pagination?.totalItems || 0}
      stats={statsCards}
      loading={loading}
      error={error || null}
      onRetry={handleRetry}
      isEmpty={mappedEvents.length === 0}
      gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      emptyIcon={Search}
      emptyTitle="Không tìm thấy sự kiện"
      emptyDescription="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
      pagination={{
        page: pagination?.page || 1,
        size: 6, // Default size since it's not in context pagination
        totalPages: pagination?.totalPages || 0,
        totalItems: pagination?.totalItems || 0,
        hasNextPage: (pagination?.page || 1) < (pagination?.totalPages || 0),
        hasPreviousPage: (pagination?.page || 1) > 1,
      }}
      onPageChange={handlePageChange}
      itemName="sự kiện"
    >
      {mappedEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </PublicPageLayout>
  );
}
