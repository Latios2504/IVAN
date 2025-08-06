import { useState, useMemo, useEffect } from "react";
import { Calendar, Users, MapPin, Building, Search } from "lucide-react";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { EventCard } from "@/components/public/EventCard";
import { usePublicEvents } from "@/context/PublicContentContext";
import { useDebounce } from "@/hooks/useDebounce";
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

  // Use debounced search to avoid too many API calls
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Update filters when debounced search changes
  useMemo(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  // Use the new context hook
  const { events, loading, error, pagination, loadEvents } = usePublicEvents();

  // Load events when filters change
  useEffect(() => {
    loadEvents(filters);
  }, [filters, loadEvents]);

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
    loadEvents(filters);
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
      value: pagination.totalItems.toString(),
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
      resultCount={pagination.totalItems}
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
        page: pagination.page,
        size: 6, // Default size since it's not in context pagination
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        hasNextPage: pagination.page < pagination.totalPages,
        hasPreviousPage: pagination.page > 1,
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
