import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, MapPin, Search } from "lucide-react";
import { CombinedLayout } from "@/components/public/CombinedLayout";
import { OrganizationListItem } from "@/components/public/OrganizationListItem";
import { organizationProfileService } from "@/services/organizationProfileService";
import type {
  PublicOrganizationDto,
  PublicOrganizationFiltersDto,
} from "@/types/organizationProfile";
import type { StatCard } from "@/components/public/StatsSection";

// Import the detail page content components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  Globe,
  Link,
  Star,
  Shield,
  Calendar,
  Target,
  Phone,
  Mail,
} from "lucide-react";

const mapOrganizationToListItem = (org: PublicOrganizationDto) => ({
  id: org.organizationId?.toString() || "0",
  name: org.organizationName || "Tên không xác định",
  description: org.description || "Không có mô tả",
  type: org.typeName || "Khác",
  location:
    [org.district, org.province].filter(Boolean).join(", ") || "Chưa xác định",
  avatar: org.logoUrl || "",
  isVerified: org.isVerified || false,
  rating: org.rating || 0,
  ratingCount: org.ratingCount || 0,
  totalEvents: org.totalEvents || 0,
  totalVolunteers: org.totalVolunteers || 0,
});

export default function PublicOrganizationsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(id || null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const [filters, setFilters] = useState<PublicOrganizationFiltersDto>({
    search: "",
    typeId: undefined,
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
  const [organizations, setOrganizations] = useState<PublicOrganizationDto[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<PublicOrganizationDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 0,
    totalItems: 0,
  });

  // Load organizations whenever filters change
  useEffect(() => {
    const loadOrganizations = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await organizationProfileService.getPublicOrganizations(filters);
        setOrganizations(result.items);
        setPagination({
          page: result.pageNumber,
          totalPages: result.totalPages,
          totalItems: result.totalCount,
        });
        
        // Auto-select first organization if none selected
        if (!selectedOrganizationId && result.items.length > 0) {
          const firstOrgId = result.items[0].organizationId?.toString();
          if (firstOrgId) {
            setSelectedOrganizationId(firstOrgId);
            navigate(`/organizations/${firstOrgId}`, { replace: true });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load organizations");
      } finally {
        setLoading(false);
      }
    };

    loadOrganizations();
  }, [filters]);

  // Load selected organization details
  useEffect(() => {
    if (selectedOrganizationId) {
      const loadOrganizationDetail = async () => {
        setDetailLoading(true);
        setDetailError(null);
        try {
          const result = await organizationProfileService.getPublicOrganization(
            Number(selectedOrganizationId)
          );
          setSelectedOrganization(result);
        } catch (err) {
          setDetailError(
            err instanceof Error ? err.message : "Failed to load organization details"
          );
        } finally {
          setDetailLoading(false);
        }
      };

      loadOrganizationDetail();
    }
  }, [selectedOrganizationId]);

  // Map backend data to component props
  const mappedOrganizations = useMemo(
    () => organizations.map(mapOrganizationToListItem),
    [organizations]
  );

  // Filter change handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleOrganizationSelect = (organizationId: string) => {
    setSelectedOrganizationId(organizationId);
    navigate(`/organizations/${organizationId}`);
  };

  const handleRetry = () => {
    setFilters((prev) => ({ ...prev })); // Trigger reload
  };

  const handleDetailRetry = () => {
    if (selectedOrganizationId) {
      const loadOrganizationDetail = async () => {
        setDetailLoading(true);
        setDetailError(null);
        try {
          const result = await organizationProfileService.getPublicOrganization(
            Number(selectedOrganizationId)
          );
          setSelectedOrganization(result);
        } catch (err) {
          setDetailError(
            err instanceof Error ? err.message : "Failed to load organization details"
          );
        } finally {
          setDetailLoading(false);
        }
      };

      loadOrganizationDetail();
    }
  };

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

  // Detail content component
  const DetailContent = () => {
    if (!selectedOrganization) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-border/50">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg">
              {selectedOrganization.organizationName?.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {selectedOrganization.organizationName}
                </h1>
                {selectedOrganization.isVerified && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs font-medium rounded-full">
                    <Shield className="h-3 w-3" />
                    Đã xác minh
                  </div>
                )}
              </div>
              <Badge variant="secondary" className="mb-3 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 border-0">
                {selectedOrganization.typeName}
              </Badge>
              <p className="text-foreground/80 leading-relaxed">
                {selectedOrganization.description}
              </p>
            </div>
          </div>
        </div>

        {/* Organization Details */}
        {(selectedOrganization.mission || selectedOrganization.vision) && (
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                  <Target className="h-5 w-5" />
                </div>
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent font-semibold">
                  Sứ mệnh & Tầm nhìn
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedOrganization.mission && (
                <div className="p-4 rounded-lg bg-white/50 dark:bg-black/20 border border-emerald-200/50 dark:border-emerald-800/50">
                  <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                    Sứ mệnh:
                  </h4>
                  <p className="text-foreground/80 leading-relaxed">{selectedOrganization.mission}</p>
                </div>
              )}
              {selectedOrganization.vision && (
                <div className="p-4 rounded-lg bg-white/50 dark:bg-black/20 border border-teal-200/50 dark:border-teal-800/50">
                  <h4 className="font-semibold text-teal-700 dark:text-teal-300 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                    Tầm nhìn:
                  </h4>
                  <p className="text-foreground/80 leading-relaxed">{selectedOrganization.vision}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Organization Info */}
        {(selectedOrganization.establishedYear || selectedOrganization.shortName) && (
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                  <Building className="h-5 w-5" />
                </div>
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent font-semibold">
                  Thông tin tổ chức
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedOrganization.shortName && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-orange-200/50 dark:border-orange-800/50">
                  <span className="font-medium text-orange-700 dark:text-orange-300">Tên viết tắt:</span>
                  <span className="text-foreground/80 font-medium">{selectedOrganization.shortName}</span>
                </div>
              )}
              {selectedOrganization.establishedYear && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-amber-200/50 dark:border-amber-800/50">
                  <span className="font-medium text-amber-700 dark:text-amber-300">Năm thành lập:</span>
                  <span className="text-foreground/80 font-medium">{selectedOrganization.establishedYear}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white w-fit mx-auto mb-3">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                {selectedOrganization.totalVolunteers || 0}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Tình nguyện viên</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="p-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white w-fit mx-auto mb-3">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {selectedOrganization.totalEvents || 0}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">Sự kiện</div>
            </CardContent>
          </Card>
          {selectedOrganization.rating > 0 && (
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="p-3 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 text-white w-fit mx-auto mb-3">
                  <Star className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
                  {selectedOrganization.rating.toFixed(1)}
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                  Đánh giá ({selectedOrganization.ratingCount || 0} lượt)
                </div>
              </CardContent>
            </Card>
          )}
          {selectedOrganization.establishedYear && (
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white w-fit mx-auto mb-3">
                  <Building className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  {new Date().getFullYear() - selectedOrganization.establishedYear}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">Năm hoạt động</div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contact Info */}
        {(selectedOrganization.address || selectedOrganization.phoneNumber || selectedOrganization.email || selectedOrganization.website) && (
          <Card className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 text-white">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="bg-gradient-to-r from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400 bg-clip-text text-transparent font-semibold">
                  Thông tin liên hệ
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedOrganization.address && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-rose-200/50 dark:border-rose-800/50">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 text-white flex-shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-foreground/90 font-medium">{selectedOrganization.address}</span>
                    {(selectedOrganization.wardCommune || selectedOrganization.district || selectedOrganization.province) && (
                      <div className="text-sm text-rose-600 dark:text-rose-400 mt-1">
                        {[selectedOrganization.wardCommune, selectedOrganization.district, selectedOrganization.province]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {selectedOrganization.phoneNumber && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-rose-200/50 dark:border-rose-800/50">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 text-white flex-shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <a href={`tel:${selectedOrganization.phoneNumber}`} className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium transition-colors">
                    {selectedOrganization.phoneNumber}
                  </a>
                </div>
              )}
              {selectedOrganization.email && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-rose-200/50 dark:border-rose-800/50">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 text-white flex-shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <a href={`mailto:${selectedOrganization.email}`} className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium transition-colors">
                    {selectedOrganization.email}
                  </a>
                </div>
              )}
              {selectedOrganization.website && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-rose-200/50 dark:border-rose-800/50">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 text-white flex-shrink-0">
                    <Globe className="h-4 w-4" />
                  </div>
                  <a 
                    href={selectedOrganization.website.startsWith('http') ? selectedOrganization.website : `https://${selectedOrganization.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium transition-colors flex items-center gap-2"
                  >
                    {selectedOrganization.website}

                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Social Media */}
        {(selectedOrganization.facebookPage || selectedOrganization.linkedInPage) && (
          <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 text-white">
                  <Globe className="h-5 w-5" />
                </div>
                <span className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent font-semibold">
                  Mạng xã hội
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedOrganization.facebookPage && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-violet-200/50 dark:border-violet-800/50">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex-shrink-0">
                    <Globe className="h-4 w-4" />
                  </div>
                  <a 
                    href={selectedOrganization.facebookPage.startsWith('http') ? selectedOrganization.facebookPage : `https://${selectedOrganization.facebookPage}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors flex items-center gap-2"
                  >
                    Facebook

                  </a>
                </div>
              )}
              {selectedOrganization.linkedInPage && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-violet-200/50 dark:border-violet-800/50">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white flex-shrink-0">
                    <Link className="h-4 w-4" />
                  </div>
                  <a 
                    href={selectedOrganization.linkedInPage.startsWith('http') ? selectedOrganization.linkedInPage : `https://${selectedOrganization.linkedInPage}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors flex items-center gap-2"
                  >
                    LinkedIn

                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        )}


      </div>
    );
  };

  return (
    <CombinedLayout
      title="Tổ chức"
      description="Khám phá các tổ chức phi lợi nhuận và cơ hội tham gia hoạt động tình nguyện"
      searchValue={searchQuery}
      onSearchChange={handleSearch}
      searchPlaceholder="Tìm kiếm tổ chức..."
      resultCount={pagination.totalItems}
      stats={statsCards}
      loading={loading}
      error={error}
      onRetry={handleRetry}
      isEmpty={mappedOrganizations.length === 0}
      pagination={{
        page: pagination.page,
        size: filters.size,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        hasNextPage: pagination.page < pagination.totalPages,
        hasPreviousPage: pagination.page > 1,
      }}
      onPageChange={handlePageChange}
      
      listItems={mappedOrganizations.map((organization) => (
        <OrganizationListItem
          key={organization.id}
          organization={organization}
          isSelected={organization.id === selectedOrganizationId}
          onClick={() => handleOrganizationSelect(organization.id)}
        />
      ))}
      detailLoading={detailLoading}
      detailError={detailError}
      onDetailRetry={handleDetailRetry}
      detailContent={<DetailContent />}
    />
  );
}