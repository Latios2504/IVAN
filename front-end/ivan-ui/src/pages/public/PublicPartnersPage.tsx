import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  MapPin,
  Search,
  Star,
  Target,
  ExternalLink,
} from "lucide-react";
import { CombinedLayout } from "@/components/public/CombinedLayout";
import { PartnerListItem } from "@/components/public/PartnerListItem";
import { partnerProfileService } from "@/services/partnerProfileService";
import type {
  PublicPartnerDto,
  PublicPartnerFiltersDto,
} from "@/types/partnerProfile";
import type { StatCard } from "@/components/public/StatsSection";

// Import the detail page content components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Link, Shield, Phone, Mail, Calendar } from "lucide-react";

const mapPartnerToListItem = (partner: PublicPartnerDto) => {
  return {
    id: partner.partnerId?.toString() || "0",
    name: partner.companyName || "Tên không xác định",
    description: partner.description || "Không có mô tả",
    type: "Đối tác",
    industry: partner.industryName || "Không xác định",
    location: partner.province || "Chưa xác định",
    logo: partner.logoUrl || "",
    website: partner.website || "",
    isVerified: partner.isVerified || false,
    rating: partner.rating > 0 ? partner.rating : undefined,
    ratingCount: partner.ratingCount > 0 ? partner.ratingCount : undefined,
  };
};

export default function PublicPartnersPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(
    id || null
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const [filters, setFilters] = useState<PublicPartnerFiltersDto>({
    search: "",
    industryId: undefined,
    province: "",
    isVerified: undefined,
    page: 1,
    size: 10,
  });

  // Update filters when debounced search changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  // State for API data
  const [partners, setPartners] = useState<PublicPartnerDto[]>([]);
  const [selectedPartner, setSelectedPartner] =
    useState<PublicPartnerDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 0,
    totalItems: 0,
  });

  // Load partners whenever filters change
  useEffect(() => {
    const loadPartners = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await partnerProfileService.getPublicPartners(filters);
        setPartners(result.items);
        setPagination({
          page: result.pageNumber,
          totalPages: result.totalPages,
          totalItems: result.totalCount,
        });

        // Auto-select first partner if none selected
        if (!selectedPartnerId && result.items.length > 0) {
          const firstPartnerId = result.items[0].partnerId?.toString();
          if (firstPartnerId) {
            setSelectedPartnerId(firstPartnerId);
            navigate(`/partners/${firstPartnerId}`, { replace: true });
          }
        }
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

  // Load selected partner details
  useEffect(() => {
    if (selectedPartnerId) {
      const loadPartnerDetail = async () => {
        setDetailLoading(true);
        setDetailError(null);
        try {
          const result = await partnerProfileService.getPublicPartner(
            Number(selectedPartnerId)
          );
          setSelectedPartner(result);
        } catch (err) {
          setDetailError(
            err instanceof Error
              ? err.message
              : "Failed to load partner details"
          );
        } finally {
          setDetailLoading(false);
        }
      };

      loadPartnerDetail();
    }
  }, [selectedPartnerId]);

  // Map backend data to component props
  const mappedPartners = useMemo(
    () => partners.map(mapPartnerToListItem),
    [partners]
  );

  // Filter change handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePartnerSelect = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    navigate(`/partners/${partnerId}`);
  };

  const handleRetry = () => {
    setFilters((prev) => ({ ...prev })); // Trigger reload
  };

  const handleDetailRetry = () => {
    if (selectedPartnerId) {
      const loadPartnerDetail = async () => {
        setDetailLoading(true);
        setDetailError(null);
        try {
          const result = await partnerProfileService.getPublicPartner(
            Number(selectedPartnerId)
          );
          setSelectedPartner(result);
        } catch (err) {
          setDetailError(
            err instanceof Error
              ? err.message
              : "Failed to load partner details"
          );
        } finally {
          setDetailLoading(false);
        }
      };

      loadPartnerDetail();
    }
  };

  // Stats calculations
  const statsCards: StatCard[] = [
    {
      title: "Tổng đối tác",
      value: pagination.totalItems.toString(),
      subtitle: "Đối tác đang hoạt động",
      icon: Building2,
    },
    {
      title: "Ngành nghề",
      value: new Set(
        mappedPartners.map((partner) => partner.industry || "Không xác định")
      ).size.toString(),
      subtitle: "Lĩnh vực khác nhau",
      icon: Target,
    },
    {
      title: "Địa điểm",
      value: new Set(
        mappedPartners.map((partner) => partner.location)
      ).size.toString(),
      subtitle: "Thành phố",
      icon: MapPin,
    },
  ];

  // Detail content component
  const DetailContent = () => {
    if (!selectedPartner) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-border/50">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg">
              {selectedPartner.companyName?.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {selectedPartner.companyName}
                </h1>
                {selectedPartner.isVerified && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs font-medium rounded-full">
                    <Shield className="h-3 w-3" />
                    Đã xác minh
                  </div>
                )}
                {selectedPartner.website && (
                  <a
                    href={selectedPartner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all"
                  ></a>
                )}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 border-0"
                >
                  {selectedPartner.industryName || "Đối tác"}
                </Badge>
              </div>
              <p className="text-foreground/80 leading-relaxed">
                {selectedPartner.description}
              </p>
            </div>
          </div>
        </div>

        {/* Partnership Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedPartner.rating > 0 && (
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-yellow-200/50 dark:border-yellow-800/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Star className="h-6 w-6 text-white fill-white" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {selectedPartner.rating.toFixed(1)}
                </div>
                <div className="text-sm text-foreground/70 font-medium">
                  Đánh giá ({selectedPartner.ratingCount} lượt)
                </div>
              </CardContent>
            </Card>
          )}
          {selectedPartner.totalCollaborations > 0 && (
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200/50 dark:border-blue-800/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {selectedPartner.totalCollaborations}
                </div>
                <div className="text-sm text-foreground/70 font-medium">
                  Số dự án hợp tác
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Company Info */}
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200/50 dark:border-emerald-800/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Thông tin công ty
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-100/50 to-teal-100/50 dark:from-emerald-900/20 dark:to-teal-900/20">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="font-medium text-foreground">Ngành nghề:</span>
                <span className="ml-2 text-foreground/80">
                  {selectedPartner.industryName || "Không xác định"}
                </span>
              </div>
            </div>
            {(selectedPartner.address ||
              selectedPartner.wardCommune ||
              selectedPartner.district ||
              selectedPartner.province) && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-100/50 to-teal-100/50 dark:from-emerald-900/20 dark:to-teal-900/20">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-foreground">Địa chỉ:</span>
                  <div className="text-sm text-foreground/80 mt-1 leading-relaxed">
                    {[
                      selectedPartner.address,
                      selectedPartner.wardCommune,
                      selectedPartner.district,
                      selectedPartner.province,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200/50 dark:border-blue-800/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Thông tin liên hệ
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPartner.phoneNumber && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <span className="text-foreground font-medium">
                  {selectedPartner.phoneNumber}
                </span>
              </div>
            )}
            {selectedPartner.email && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <span className="text-foreground font-medium">
                  {selectedPartner.email}
                </span>
              </div>
            )}
            {selectedPartner.website && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <a
                  href={selectedPartner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-2 transition-colors"
                >
                  {selectedPartner.website}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <CombinedLayout
      title="Đối tác"
      description="Khám phá các đối tác và cơ hội hợp tác trong lĩnh vực tình nguyện"
      searchValue={searchQuery}
      onSearchChange={handleSearch}
      searchPlaceholder="Tìm kiếm đối tác..."
      resultCount={pagination.totalItems}
      stats={statsCards}
      loading={loading}
      error={error}
      onRetry={handleRetry}
      isEmpty={mappedPartners.length === 0}
      pagination={{
        page: pagination.page,
        size: filters.size,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        hasNextPage: pagination.page < pagination.totalPages,
        hasPreviousPage: pagination.page > 1,
      }}
      onPageChange={handlePageChange}
      
      listItems={mappedPartners.map((partner) => (
        <PartnerListItem
          key={partner.id}
          partner={partner}
          isSelected={partner.id === selectedPartnerId}
          onClick={() => handlePartnerSelect(partner.id)}
        />
      ))}
      detailLoading={detailLoading}
      detailError={detailError}
      onDetailRetry={handleDetailRetry}
      detailContent={<DetailContent />}
    />
  );
}
