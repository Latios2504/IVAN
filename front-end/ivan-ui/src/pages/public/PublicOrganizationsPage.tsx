import { useState, useMemo } from "react";
import { PublicPageLayout } from "@/components/common/PublicPageLayout";
import { FilterSection } from "@/components/common/FilterSection";
import { OrganizationCard } from "@/components/common/OrganizationCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building,
  Users,
  MapPin,
  Award,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { usePublicOrganizations } from "@/hooks/usePublicOrganizations";
import { useDebounce } from "@/hooks/useDebounce";
import { mapPublicOrganizationToCard } from "@/utils/dataMappers";
import type { PublicOrganizationFilters } from "@/types/publicContent";

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
  const statsCards = [
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
    >
      <FilterSection
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
          <span className="ml-2 text-gray-600">Đang tải tổ chức...</span>
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

      {/* Organizations Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mappedOrganizations.map((organization) => (
            <OrganizationCard
              key={organization.id}
              organization={organization}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && mappedOrganizations.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy tổ chức
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
