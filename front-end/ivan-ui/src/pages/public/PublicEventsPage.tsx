import { useState, useMemo } from "react";
import { PublicPageLayout } from "@/components/common/PublicPageLayout";
import { FilterSection } from "@/components/common/FilterSection";
import { EventCard } from "@/components/common/EventCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Users,
  MapPin,
  Building,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { usePublicEvents } from "@/hooks/usePublicEvents";
import type { 
  PublicEvent, 
  PublicEventFilters 
} from "@/types/publicContent";

// Data mapper with proper TypeScript typing
const mapPublicEventToCard = (event: PublicEvent) => {
  // Map backend status to EventCard expected status
  const mapStatus = (statusName: string): "open" | "full" | "closed" => {
    const status = statusName?.toLowerCase() || "";
    if (status.includes("mở") || status.includes("open") || status === "active") {
      return "open";
    } else if (status.includes("đủ") || status.includes("full")) {
      return "full";
    } else if (status.includes("đóng") || status.includes("closed") || status === "inactive") {
      return "closed";
    }
    return "open"; // Default to open
  };

  return {
    id: event.eventId?.toString() || "0",
    title: event.eventName || "Tên sự kiện không xác định",
    description: event.description || "Không có mô tả",
    organization: event.organizationName || "Tổ chức không xác định",
    date: event.startDate ? new Date(event.startDate).toLocaleDateString('vi-VN') : "",
    time: event.startDate ? new Date(event.startDate).toLocaleTimeString('vi-VN') : "",
    location: [event.wardCommune, event.district, event.province].filter(Boolean).join(", ") || "Chưa xác định",
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
  const [filters, setFilters] = useState<PublicEventFilters>({
    search: "",
    categoryId: undefined,
    organizationId: undefined,
    province: "",
    startDate: "",
    endDate: "",
  });

  // Use the custom hook to fetch events
  const { events, loading, error, pagination, refetch, setPage } =
    usePublicEvents(filters);

  // Map backend data to component props
  const mappedEvents = useMemo(
    () => (events || []).map(mapPublicEventToCard),
    [events]
  );

  // Filter change handlers
  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
  };

  const handleFilterChange = (category: string) => {
    const categoryId = category === "all" ? undefined : parseInt(category);
    setFilters((prev) => ({ ...prev, categoryId }));
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
  const statsCards = [
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
    >
      <FilterSection
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
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Đang tải sự kiện...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Events Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mappedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && mappedEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy sự kiện
          </h3>
          <p className="text-gray-600">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <button
              onClick={() => setPage(pagination.page - 1)}
              disabled={!pagination.hasPreviousPage}
              className="px-3 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Trước
            </button>
            <span className="px-3 py-2 text-gray-600">
              Trang {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </PublicPageLayout>
  );
}
