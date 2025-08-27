import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, MapPin, Search, Award, Calendar } from "lucide-react";
import { CombinedLayout } from "@/components/public/CombinedLayout";
import { VolunteerListItem } from "@/components/public/VolunteerListItem";
import { volunteerProfileService } from "@/services/volunteerProfileService";
import type {
  PublicVolunteerDto,
  PublicVolunteerFiltersDto,
} from "@/types/volunteerProfile";
import type { StatCard } from "@/components/public/StatsSection";

// Import the detail page content components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Star,
  Target,
  Clock,
  Phone,
  MessageCircle,
} from "lucide-react";

const mapVolunteerToListItem = (
  volunteer: PublicVolunteerDto
): {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  location?: string;
  skills: string[];
  isVerified: boolean;
  rating?: number;
  ratingCount?: number;
  totalHours: number;
  status: "active" | "inactive" | "busy";
} => {
  return {
    id: volunteer.volunteerId?.toString() || "0",
    name: volunteer.fullName,
    bio: volunteer.motivation,
    avatar: volunteer.avatar,
    location: volunteer.province,
    skills: volunteer.skillsList?.map((skill) => skill.skillName) || [],
    isVerified: volunteer.isVerified,
    rating: volunteer.rating || 0,
    ratingCount: volunteer.ratingCount || 0,
    totalHours: volunteer.totalHoursVolunteered || 0,
    status: volunteer.isVerified
      ? "active"
      : ("inactive" as "active" | "inactive" | "busy"),
  };
};

export default function PublicVolunteersPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string | null>(
    id || null
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const [filters, setFilters] = useState<PublicVolunteerFiltersDto>({
    search: "",
    skillId: undefined,
    university: "",
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
  const [volunteers, setVolunteers] = useState<PublicVolunteerDto[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] =
    useState<PublicVolunteerDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 0,
    totalItems: 0,
  });

  // Load volunteers whenever filters change
  useEffect(() => {
    const loadVolunteers = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await volunteerProfileService.getPublicVolunteers(
          filters
        );
        setVolunteers(result.items);
        setPagination({
          page: result.pageNumber,
          totalPages: result.totalPages,
          totalItems: result.totalCount,
        });

        // Auto-select first volunteer if none selected
        if (!selectedVolunteerId && result.items.length > 0) {
          const firstVolunteerId = result.items[0].volunteerId?.toString();
          if (firstVolunteerId) {
            setSelectedVolunteerId(firstVolunteerId);
            navigate(`/volunteers/${firstVolunteerId}`, { replace: true });
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load volunteers"
        );
      } finally {
        setLoading(false);
      }
    };

    loadVolunteers();
  }, [filters]);

  // Load selected volunteer details
  useEffect(() => {
    if (selectedVolunteerId) {
      const loadVolunteerDetail = async () => {
        setDetailLoading(true);
        setDetailError(null);
        try {
          const result = await volunteerProfileService.getPublicVolunteer(
            Number(selectedVolunteerId)
          );
          setSelectedVolunteer(result);
        } catch (err) {
          setDetailError(
            err instanceof Error
              ? err.message
              : "Failed to load volunteer details"
          );
        } finally {
          setDetailLoading(false);
        }
      };

      loadVolunteerDetail();
    }
  }, [selectedVolunteerId]);

  // Map backend data to component props
  const mappedVolunteers = useMemo(
    () => volunteers.map(mapVolunteerToListItem),
    [volunteers]
  );

  // Filter change handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleVolunteerSelect = (volunteerId: string) => {
    setSelectedVolunteerId(volunteerId);
    navigate(`/volunteers/${volunteerId}`);
  };

  const handleRetry = () => {
    setFilters((prev) => ({ ...prev })); // Trigger reload
  };

  const handleDetailRetry = () => {
    if (selectedVolunteerId) {
      const loadVolunteerDetail = async () => {
        setDetailLoading(true);
        setDetailError(null);
        try {
          const result = await volunteerProfileService.getPublicVolunteer(
            Number(selectedVolunteerId)
          );
          setSelectedVolunteer(result);
        } catch (err) {
          setDetailError(
            err instanceof Error
              ? err.message
              : "Failed to load volunteer details"
          );
        } finally {
          setDetailLoading(false);
        }
      };

      loadVolunteerDetail();
    }
  };

  // Stats calculations
  const statsCards: StatCard[] = [
    {
      title: "Tổng tình nguyện viên",
      value: pagination.totalItems.toString(),
      subtitle: "Đang hoạt động",
      icon: Users,
    },
    {
      title: "Tổng giờ tình nguyện",
      value: mappedVolunteers
        .reduce(
          (total: number, volunteer) => total + (volunteer.totalHours || 0),
          0
        )
        .toLocaleString(),
      subtitle: "Giờ đóng góp",
      icon: Clock,
    },
    {
      title: "Địa điểm",
      value: new Set(
        mappedVolunteers.map((volunteer) => volunteer.location)
      ).size.toString(),
      subtitle: "Thành phố",
      icon: MapPin,
    },
  ];

  const statusConfig = {
    active: {
      label: "Hoạt động",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    inactive: {
      label: "Không hoạt động",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
    busy: { label: "Bận", color: "text-orange-600", bgColor: "bg-orange-100" },
  };

  // Detail content component
  const DetailContent = () => {
    if (!selectedVolunteer) return null;

    // Calculate status based on volunteer data
    let status: "active" | "inactive" | "busy" = "active";
    if (selectedVolunteer.isVerified) {
      status = "active";
    }
    const statusInfo = statusConfig[status] || statusConfig.active;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 border border-border/50">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg">
                {selectedVolunteer.fullName?.slice(0, 2).toUpperCase()}
              </div>
              {/* Status indicator */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-background bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {selectedVolunteer.fullName}
                </h1>
                {selectedVolunteer.isVerified && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs font-medium rounded-full">
                    <Shield className="h-3 w-3" />
                    Đã xác minh
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-700 dark:text-green-300 border-0">
                  {statusInfo.label}
                </Badge>
                {selectedVolunteer.province && (
                  <div className="flex items-center gap-1 text-sm text-foreground/70">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedVolunteer.province}</span>
                  </div>
                )}
              </div>
              <p className="text-foreground/80 leading-relaxed">
                {selectedVolunteer.motivation}
              </p>
            </div>
          </div>
        </div>

        {/* Education & Background */}
        {(selectedVolunteer.university ||
          selectedVolunteer.major ||
          selectedVolunteer.yearOfStudy) && (
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200/50 dark:border-amber-800/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Thông tin học vấn
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedVolunteer.university && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-100/50 to-orange-100/50 dark:from-amber-900/20 dark:to-orange-900/20">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Trường:</span>
                    <span className="ml-2 text-foreground/80">
                      {selectedVolunteer.university}
                    </span>
                  </div>
                </div>
              )}
              {selectedVolunteer.major && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-100/50 to-orange-100/50 dark:from-amber-900/20 dark:to-orange-900/20">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      Chuyên ngành:
                    </span>
                    <span className="ml-2 text-foreground/80">
                      {selectedVolunteer.major}
                    </span>
                  </div>
                </div>
              )}
              {selectedVolunteer.yearOfStudy && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-100/50 to-orange-100/50 dark:from-amber-900/20 dark:to-orange-900/20">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      Năm học:
                    </span>
                    <span className="ml-2 text-foreground/80">
                      Năm {selectedVolunteer.yearOfStudy}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Skills */}
        {selectedVolunteer.skillsList &&
          selectedVolunteer.skillsList.length > 0 && (
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200/50 dark:border-purple-800/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Kỹ năng
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedVolunteer.skillsList.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200/30 dark:border-purple-800/30"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {skill.skillName}
                        </div>
                        {skill.category && (
                          <div className="text-xs text-muted-foreground">
                            {skill.category}
                          </div>
                        )}
                        {skill.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {skill.description}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {skill.proficiencyLevel}
                        </Badge>
                        {skill.yearsOfExperience > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {skill.yearsOfExperience} năm kinh nghiệm
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        {/* Availability */}
        {selectedVolunteer.availability && (
          <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-cyan-200/50 dark:border-cyan-800/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Thời gian có thể tham gia
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-100/50 to-blue-100/50 dark:from-cyan-900/20 dark:to-blue-900/20">
                <p className="text-foreground/80 leading-relaxed">
                  {selectedVolunteer.availability}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200/50 dark:border-green-800/50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {selectedVolunteer.totalHoursVolunteered || 0}
              </div>
              <div className="text-sm text-foreground/70 font-medium">
                Tổng giờ tình nguyện
              </div>
            </CardContent>
          </Card>
          {selectedVolunteer.volunteerHours > 0 && (
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200/50 dark:border-blue-800/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {selectedVolunteer.volunteerHours}
                </div>
                <div className="text-sm text-foreground/70 font-medium">
                  Giờ tình nguyện hiện tại
                </div>
              </CardContent>
            </Card>
          )}
          {selectedVolunteer.rating > 0 && (
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-yellow-200/50 dark:border-yellow-800/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Star className="h-6 w-6 text-white fill-white" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {selectedVolunteer.rating.toFixed(1)}
                </div>
                <div className="text-sm text-foreground/70 font-medium">
                  Đánh giá ({selectedVolunteer.ratingCount || 0} lượt)
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Experience */}
        {selectedVolunteer.experience && (
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200/50 dark:border-purple-800/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Kinh nghiệm
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-900/20 dark:to-pink-900/20">
                <p className="text-foreground/80 leading-relaxed">
                  {selectedVolunteer.experience}
                </p>
              </div>
            </CardContent>
          </Card>
        )}


      </div>
    );
  };

  return (
    <CombinedLayout
      title="Tình nguyện viên"
      description="Khám phá cộng đồng tình nguyện viên và kết nối với những người có cùng chí hướng"
      searchValue={searchQuery}
      onSearchChange={handleSearch}
      searchPlaceholder="Tìm kiếm tình nguyện viên..."
      resultCount={pagination.totalItems}
      stats={statsCards}
      loading={loading}
      error={error}
      onRetry={handleRetry}
      isEmpty={mappedVolunteers.length === 0}
      pagination={{
        page: pagination.page,
        size: filters.size,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        hasNextPage: pagination.page < pagination.totalPages,
        hasPreviousPage: pagination.page > 1,
      }}
      onPageChange={handlePageChange}
      
      listItems={mappedVolunteers.map((volunteer) => (
        <VolunteerListItem
          key={volunteer.id}
          volunteer={volunteer}
          isSelected={volunteer.id === selectedVolunteerId}
          onClick={() => handleVolunteerSelect(volunteer.id)}
        />
      ))}
      detailLoading={detailLoading}
      detailError={detailError}
      onDetailRetry={handleDetailRetry}
      detailContent={<DetailContent />}
    />
  );
}
