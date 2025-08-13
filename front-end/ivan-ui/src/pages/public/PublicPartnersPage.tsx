import { useState, useEffect, useMemo } from "react";
import { Building, HandHeart, Users, Search } from "lucide-react";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { PartnerCard } from "@/components/public/PartnerCard";
import { partnerProfileService } from "@/services/partnerProfileService";
import type {
  PublicPartnerDto,
  PublicPartnerFiltersDto,
} from "@/types/partnerProfile";
import type { StatCard } from "@/components/public/StatsSection";

const mapPartnerToCard = (partner: PublicPartnerDto) => ({
  id: partner.partnerId?.toString() || "0",
  name: partner.companyName || "Tên đối tác không xác định",
  description: partner.description || "Không có mô tả",
  industry: partner.industryName || "Khác",
  location:
    [partner.district, partner.province].filter(Boolean).join(", ") ||
    "Chưa xác định",
  website: partner.website || "",
  logo: partner.logoUrl || "",
  isVerified: partner.isVerified || false,
  rating: partner.rating || 0,
  ratingCount: partner.ratingCount || 0,
  totalCollaborations: partner.totalCollaborations || 0,
  partnershipType: "Đối tác chính thức",
});

export default function PublicPartnersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<PublicPartnerFiltersDto>({
    search: "",
    industryId: undefined,
    province: "",
    isVerified: undefined,
    page: 1,
    size: 20,
  });

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Update filters when debounced search changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  // State for API data
  const [partners, setPartners] = useState<PublicPartnerDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPartners, setTotalPartners] = useState(0);

  // Load partners whenever filters change
  useEffect(() => {
    const loadPartners = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await partnerProfileService.getPublicPartners(filters);
        setPartners(result.items || []);
        setTotalPartners(result.totalCount || 0);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load partners"
        );
      } finally {
        setLoading(false);
      }
    };

    loadPartners();
  }, [filters]);

  // Server-side pagination
  const pagination = {
    page: filters.page || 1,
    totalPages: Math.ceil(totalPartners / (filters.size || 20)),
    totalItems: totalPartners,
  };

  // Handlers
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleRetry = () => {
    setFilters((prev) => ({ ...prev })); // Trigger reload
  };

  // Map backend data to component props
  const mappedPartners = useMemo(
    () => (partners || []).map(mapPartnerToCard),
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
      value: totalPartners.toString(),
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
      value: "0",
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
      filters={[]}
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
        size: filters.size || 20,
        totalPages: pagination.totalPages,
        totalItems: totalPartners,
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
