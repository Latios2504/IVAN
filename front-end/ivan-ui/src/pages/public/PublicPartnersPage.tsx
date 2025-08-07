import { useState, useMemo, useEffect } from "react";
import { Building, HandHeart, Users, Search } from "lucide-react";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { PartnerCard } from "@/components/public/PartnerCard";
import { useApi } from "@/hooks/useApi";
import { publicContentService } from "@/services/publicContentService";
import type {
  PublicPartner,
  PublicPartnerFilters,
} from "@/types/publicContent";
import type { StatCard } from "@/components/public/StatsSection";

// Data mapper with proper TypeScript typing
const mapPublicPartnerToCard = (partner: PublicPartner) => ({
  id: partner.partnerId?.toString() || "0",
  name: partner.companyName || "Tên đối tác không xác định",
  description: partner.description || "Không có mô tả",
  industry: partner.industryName || "Khác",
  location:
    [partner.district, partner.province].filter(Boolean).join(", ") ||
    "Chưa xác định",
  website: partner.website || "",
  logo: partner.logoUrl || "",
  isVerified: partner.isActive || false,
  rating: 0, // This would need to come from backend if available
  ratingCount: 0, // This would need to come from backend if available
  totalCollaborations: 0, // This would need to come from backend if available
  partnershipType: "Đối tác chính thức", // This would need to come from backend
});

export default function PublicPartnersPage() {
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<PublicPartnerFilters>({
    search: "",
    industryId: undefined,
    province: "",
    isVerified: undefined,
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

  // Service adapter for public partners
  const publicPartnersService = {
    getAll: async (): Promise<PublicPartner[]> => {
      const result = await publicContentService.getPublicPartners(filters);
      return result.items;
    },
  };

  // Use the new useApi hook
  const partnersApi = useApi<PublicPartner, never, never>(
    publicPartnersService
  );

  // Load partners when filters change
  useEffect(() => {
    partnersApi.loadAll();
  }, [filters]);

  // Extract partners from the API response
  const partners = partnersApi.data || [];
  const loading = partnersApi.loading;
  const error = partnersApi.error;

  // For pagination, we'll use simple client-side pagination for now
  const pagination = {
    page: filters.page || 1,
    totalPages: Math.ceil(partners.length / (filters.size || 20)),
    totalItems: partners.length,
  };

  // Handlers
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleRetry = () => {
    partnersApi.loadAll();
  };

  // Map backend data to component props
  const mappedPartners = useMemo(
    () => (partners || []).map(mapPublicPartnerToCard),
    [partners]
  );

  // Filter change handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // The actual API call will be triggered by the debounced value
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
  const statsCards: StatCard[] = [
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
      stats={statsCards}
      loading={loading}
      error={error || null}
      onRetry={handleRetry}
      isEmpty={mappedPartners.length === 0}
      gridClassName="grid grid-cols-1 lg:grid-cols-2 gap-6"
      emptyIcon={Search}
      emptyTitle="Không tìm thấy đối tác"
      emptyDescription="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
      pagination={{
        page: pagination.page,
        size: 12,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        hasNextPage: pagination.page < pagination.totalPages,
        hasPreviousPage: pagination.page > 1,
      }}
      onPageChange={handlePageChange}
      itemName="đối tác"
    >
      {mappedPartners.map((partner) => (
        <PartnerCard key={partner.id} partner={partner} />
      ))}
    </PublicPageLayout>
  );
}
