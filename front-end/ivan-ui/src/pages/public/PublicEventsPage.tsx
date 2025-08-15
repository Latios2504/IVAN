import { useState, useMemo, useEffect } from "react";
import { Calendar, Users, MapPin, Building, Search } from "lucide-react";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { EventCard } from "@/components/public/EventCard";
import { eventsService } from "@/services/eventsService";
import type { EventDto, EventFilterDto } from "@/types/events";
import type { StatCard } from "@/components/public/StatsSection";

const mapEventToCard = (event: EventDto) => {
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
    return "open";
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
      [event.detailedAddress, event.district, event.province]
        .filter(Boolean)
        .join(", ") || "Chưa xác định",
    volunteersNeeded: event.maxVolunteers || 0,
    volunteersRegistered: 0,
    status: mapStatus(event.statusName || ""),
    category: event.categoryName || "Khác",
    image: event.bannerImageUrl || undefined,
    isUrgent: event.isUrgent || false,
    isFeatured: event.isFeatured || false,
    viewCount: 0,
  };
};

export default function PublicEventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<EventFilterDto>({
    search: "",
    categoryIds: [],
    statusIds: [2, 3, 4], // Only show Scheduled, Ongoing, and Completed events
    startDateFrom: "",
    startDateTo: "",
    endDateFrom: "",
    endDateTo: "",
    province: "",
    district: "",
    isFeatured: undefined,
    isUrgent: undefined,
    isActive: undefined,
    minVolunteers: undefined,
    maxVolunteers: undefined,
    page: 1,
    size: 20,
    sortBy: "startDate",
    sortDirection: "asc",
  });

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 0,
    totalItems: 0,
  });

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await eventsService.getEvents(filters);
        setEvents(result.items);
        setPagination({
          page: result.pageNumber,
          totalPages: result.totalPages,
          totalItems: result.totalCount,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [filters]);

  const mappedEvents = useMemo(() => events.map(mapEventToCard), [events]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (category: string) => {
    const categoryIds = category === "all" ? [] : [parseInt(category)];
    setFilters((prev) => ({ ...prev, categoryIds }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleRetry = () => {
    setFilters((prev) => ({ ...prev }));
  };

  const filterOptions = [
    { value: "all", label: "Tất cả" },
    { value: "1", label: "Giáo dục" },
    { value: "2", label: "Nghề nghiệp" },
    { value: "3", label: "Đào tạo" },
    { value: "4", label: "Tình nguyện" },
    { value: "5", label: "Cộng đồng" },
  ];

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
        .reduce((total, event) => total + event.volunteersRegistered, 0)
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
      filters={[]}
      resultCount={pagination.totalItems}
      stats={statsCards}
      loading={loading}
      error={error}
      onRetry={handleRetry}
      isEmpty={mappedEvents.length === 0}
      gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      emptyIcon={Search}
      emptyTitle="Không tìm thấy sự kiện"
      emptyDescription="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
      pagination={{
        page: pagination.page,
        size: filters.size,
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
