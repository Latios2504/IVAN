import { useState, useMemo } from "react";
import { PublicPageLayout } from "@/components/common/PublicPageLayout";
import { FilterSection } from "@/components/common/FilterSection";
import { PartnerCard } from "@/components/common/PartnerCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, HandHeart, Users, Loader2, AlertCircle } from "lucide-react";
import { usePublicPartners } from "@/hooks/usePublicPartners";
import { mapPublicPartnerToCard } from "@/utils/dataMappers";
import type { PublicPartnerFilters } from "@/types/publicContent";

export default function PublicPartnersPage() {
  // Filter state
  const [filters, setFilters] = useState<PublicPartnerFilters>({
    search: "",
    industryId: undefined,
    province: "",
    isVerified: undefined,
  });

  // Use the custom hook to fetch partners
  const { partners, loading, error, pagination, refetch, setPage } =
    usePublicPartners(filters);

  // Map backend data to component props
  const mappedPartners = useMemo(
    () => (partners || []).map(mapPublicPartnerToCard),
    [partners]
  );

  // Filter change handlers
  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
  };

  const handleFilterChange = (type: string) => {
    const industryId = type === "all" ? undefined : parseInt(type);
    setFilters((prev) => ({ ...prev, industryId }));
  };

  // Filter options (TODO: fetch from backend)
  const filterOptions = [
    { value: "all", label: "Tất cả" },
    { value: "1", label: "Doanh nghiệp" },
    { value: "2", label: "Quỹ từ thiện" },
    { value: "3", label: "Chính phủ" },
    { value: "4", label: "Tổ chức phi lợi nhuận" },
    { value: "5", label: "Cá nhân" },
  ];

  // Stats calculations
  const statsCards = [
    {
      title: "Tổng đối tác",
      value: pagination.totalItems.toString(),
      subtitle: "Đối tác đang hoạt động",
      icon: Building,
    },
    {
      title: "Dự án hợp tác",
      value: mappedPartners
        .reduce(
          (total: number, partner) =>
            total + (partner.totalCollaborations || 0),
          0
        )
        .toString(),
      subtitle: "Dự án đang triển khai",
      icon: HandHeart,
    },
    {
      title: "Người được hỗ trợ",
      value: "0", // This would need to be calculated from backend if available
      subtitle: "Người đã được hỗ trợ",
      icon: Users,
    },
  ];

  return (
    <PublicPageLayout
      title="Đối tác"
      description="Khám phá các đối tác đang hỗ trợ và hợp tác với hệ thống IVAN"
    >
      <FilterSection
        searchValue={filters.search || ""}
        onSearchChange={handleSearch}
        searchPlaceholder="Tìm kiếm đối tác..."
        filters={[
          {
            id: "type",
            label: "Loại đối tác",
            value: filters.industryId?.toString() || "all",
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
          <span className="ml-2 text-gray-600">Đang tải đối tác...</span>
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

      {/* Partners Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mappedPartners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && mappedPartners.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy đối tác
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
