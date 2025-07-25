import { useState, useMemo } from "react";
import { Building, Users, MapPin, Award, Search } from "lucide-react";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { OrganizationCard } from "@/components/public/OrganizationCard";
import { usePublicOrganizations } from "@/hooks/public/usePublicOrganizations";
import { useDebounce } from "@/hooks/useDebounce";
import type {
  PublicOrganization,
  PublicOrganizationFilters,
} from "@/types/publicContent";
import type { StatCard } from "@/components/public/StatsSection";

// Data mapper with proper TypeScript typing
const mapPublicOrganizationToCard = (org: PublicOrganization) => ({
  id: org.organizationId?.toString() || "0",
  name: org.organizationName || "Tên không xác định",
  description: org.description || "Không có mô tả",
  type: org.typeName || "Khác",
  location:
    [org.district, org.province].filter(Boolean).join(", ") || "Chưa xác định",
  website: org.website || "",
  avatar: org.logoUrl || "",
  isVerified: org.isVerified || false,
  rating: org.rating || 0,
  ratingCount: org.ratingCount || 0,
  totalEvents: org.totalEvents || 0,
  totalVolunteers: org.totalVolunteers || 0,
  focusAreas: [], // This would need to come from a separate API call or be included in the response
});

export default function PublicOrganizationsPage() {
  // Local search state (not debounced for immediate UI feedback)
  const [searchQuery, setSearchQuery] = useState("");

  // Debounced search for API calls (500ms delay)
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Filter state
  const [filters, setFilters] = useState<PublicOrganizationFilters>({
    search: "",
    typeId: undefined,
    province: "",
    isVerified: undefined,
  });

  // Update filters when debounced search changes
  useMemo(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  // Use the custom hook to fetch organizations
  const { organizations, loading, error, pagination, refetch, setPage } =
    usePublicOrganizations(filters);

  // Map backend data to component props
  const mappedOrganizations = useMemo(
    () => (organizations || []).map(mapPublicOrganizationToCard),
    [organizations]
  );

  // Filter change handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // The actual API call will be triggered by the debounced value
  };

  const handleIndustryFilterChange = (industry: string) => {
    const typeId = industry === "all" ? undefined : parseInt(industry);
    setFilters((prev) => ({ ...prev, typeId }));
  };

  const handleLocationFilterChange = (location: string) => {
    const province = location === "all" ? "" : location;
    setFilters((prev) => ({ ...prev, province }));
  };

  // Filter options (TODO: fetch from backend)
  const industryOptions = [
    { value: "all", label: "Tất cả lĩnh vực" },
    { value: "1", label: "Từ thiện" },
    { value: "2", label: "Y tế" },
    { value: "3", label: "Giáo dục" },
    { value: "4", label: "Môi trường" },
    { value: "5", label: "Phúc lợi xã hội" },
    { value: "6", label: "Bảo vệ trẻ em" },
  ];

  const locationOptions = [
    { value: "all", label: "Tất cả địa điểm" },
    { value: "Hà Nội", label: "Hà Nội" },
    { value: "TP. Hồ Chí Minh", label: "TP. Hồ Chí Minh" },
    { value: "Đà Nẵng", label: "Đà Nẵng" },
    { value: "Toàn quốc", label: "Toàn quốc" },
  ];

  // Stats calculations
  const statsCards: StatCard[] = [
    {
      title: "Tổng tổ chức",
      value: pagination.totalItems.toString(),
      subtitle: "Tổ chức đang hoạt động",
      icon: Building,
    },
    {
      title: "Tình nguyện viên",
      value: mappedOrganizations
        .reduce((total: number, org) => total + (org.totalVolunteers || 0), 0)
        .toLocaleString(),
      subtitle: "Đang tham gia",
      icon: Users,
    },
    {
      title: "Địa điểm",
      value: new Set(
        mappedOrganizations.map((org) => org.location)
      ).size.toString(),
      subtitle: "Thành phố",
      icon: MapPin,
    },
  ];

  return (
    <PublicPageLayout
      title="Tổ chức"
      description="Khám phá các tổ chức phi lợi nhuận và cơ hội tham gia hoạt động tình nguyện"
      searchValue={searchQuery}
      onSearchChange={handleSearch}
      searchPlaceholder="Tìm kiếm tổ chức..."
      filters={[
        {
          id: "industry",
          label: "Lĩnh vực",
          value: filters.typeId?.toString() || "all",
          options: industryOptions,
          onChange: handleIndustryFilterChange,
          icon: <Award className="h-4 w-4" />,
        },
        {
          id: "location",
          label: "Địa điểm",
          value: filters.province || "all",
          options: locationOptions,
          onChange: handleLocationFilterChange,
          icon: <MapPin className="h-4 w-4" />,
        },
      ]}
      resultCount={pagination.totalItems}
      stats={statsCards}
      loading={loading}
      error={error || null}
      onRetry={refetch}
      isEmpty={mappedOrganizations.length === 0}
      gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      emptyIcon={Search}
      emptyTitle="Không tìm thấy tổ chức"
      emptyDescription="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
      pagination={{
        page: pagination.page,
        size: pagination.size,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        hasNextPage: pagination.hasNextPage,
        hasPreviousPage: pagination.hasPreviousPage,
      }}
      onPageChange={setPage}
      itemName="tổ chức"
    >
      {mappedOrganizations.map((organization) => (
        <OrganizationCard key={organization.id} organization={organization} />
      ))}
    </PublicPageLayout>
  );
}
