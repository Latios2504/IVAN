import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Star,
  MapPin,
  GraduationCap,
  Search,
  Award,
} from "lucide-react";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import {
  VolunteerCard,
  type VolunteerCardData,
} from "@/components/public/VolunteerCard";
import { volunteerProfileService } from "@/services/volunteerProfileService";
import type {
  PublicVolunteerDto,
  PublicVolunteerFiltersDto,
  SkillDto,
} from "@/types/volunteerProfile";
import type { StatCard } from "@/components/public/StatsSection";

const mapVolunteerToCard = (
  volunteer: PublicVolunteerDto
): VolunteerCardData => ({
  id: volunteer.volunteerId?.toString() || "0",
  fullName: volunteer.fullName || "Tên không xác định",
  avatar: volunteer.avatar || "",
  location: volunteer.province || "Chưa xác định",
  university: volunteer.university || "Chưa xác định",
  rating: volunteer.rating || 0,
  ratingCount: volunteer.ratingCount || 0,
  totalHoursVolunteered: volunteer.totalHoursVolunteered || 0,
  isVerified: volunteer.isVerified || false,
  skills: volunteer.skillsList?.map((skill) => skill.skillName) || [],
  description: volunteer.motivation || volunteer.experience || "",
});

export default function PublicVolunteersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

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
    size: 20,
  });

  // Update filters when debounced search changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  // State for API data
  const [volunteers, setVolunteers] = useState<PublicVolunteerDto[]>([]);
  const [skills, setSkills] = useState<SkillDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 0,
    totalItems: 0,
  });

  // Load skills for filter dropdown
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const skillsResult = await volunteerProfileService.getSkills();
        setSkills(skillsResult);
      } catch (err) {
        console.error("Failed to load skills:", err);
      }
    };
    loadSkills();
  }, []);

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

  // Map backend data to component props
  const mappedVolunteers = useMemo(
    () => volunteers.map(mapVolunteerToCard),
    [volunteers]
  );

  // Filter change handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleSkillFilter = (skillId: string) => {
    setFilters((prev) => ({
      ...prev,
      skillId: skillId ? parseInt(skillId, 10) : undefined,
      page: 1,
    }));
  };

  const handleUniversityFilter = (university: string) => {
    setFilters((prev) => ({
      ...prev,
      university: university || "",
      page: 1,
    }));
  };

  const handleProvinceFilter = (province: string) => {
    setFilters((prev) => ({
      ...prev,
      province: province || "",
      page: 1,
    }));
  };

  const handleVerificationFilter = (isVerified: string) => {
    setFilters((prev) => ({
      ...prev,
      isVerified:
        isVerified === "true"
          ? true
          : isVerified === "false"
          ? false
          : undefined,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Get unique universities and provinces for filter options
  const uniqueUniversities = useMemo(() => {
    const universities = volunteers
      .map((v) => v.university)
      .filter((uni) => uni && uni.trim() !== "") // Filter out null, undefined, and empty strings
      .filter((value, index, self) => self.indexOf(value) === index);
    return universities.map((uni) => ({ value: uni!, label: uni! }));
  }, [volunteers]);

  const uniqueProvinces = useMemo(() => {
    const provinces = volunteers
      .map((v) => v.province)
      .filter((province) => province && province.trim() !== "") // Filter out null, undefined, and empty strings
      .filter((value, index, self) => self.indexOf(value) === index);
    return provinces.map((province) => ({
      value: province!,
      label: province!,
    }));
  }, [volunteers]);

  // Generate stats
  const stats: StatCard[] = [
    {
      title: "Tổng tình nguyện viên",
      value: pagination.totalItems.toLocaleString(),
      subtitle: "Tình nguyện viên đã đăng ký",
      icon: Users,
    },
    {
      title: "Đã xác thực",
      value: volunteers.filter((v) => v.isVerified).length.toLocaleString(),
      subtitle: "Tình nguyện viên đã xác thực",
      icon: Award,
    },
    {
      title: "Tổng giờ tình nguyện",
      value: volunteers
        .reduce((total, v) => total + (v.totalHoursVolunteered || 0), 0)
        .toLocaleString(),
      subtitle: "Giờ đóng góp cho cộng đồng",
      icon: Star,
    },
    {
      title: "Trường đại học",
      value: uniqueUniversities.length.toLocaleString(),
      subtitle: "Trường tham gia",
      icon: GraduationCap,
    },
  ];

  const filterOptions = [
    {
      id: "skill",
      label: "Kỹ năng",
      value: filters.skillId?.toString() || "",
      options: [
        { value: "", label: "Tất cả kỹ năng" },
        ...skills
          .filter((skill) => skill.skillName && skill.skillName.trim() !== "") // Filter out empty skill names
          .map((skill) => ({
            value: skill.skillId.toString(),
            label: skill.skillName,
          })),
      ],
      onChange: handleSkillFilter,
      icon: <Award className="h-4 w-4" />,
    },
    {
      id: "university",
      label: "Trường đại học",
      value: filters.university || "",
      options: [{ value: "", label: "Tất cả trường" }, ...uniqueUniversities],
      onChange: handleUniversityFilter,
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      id: "province",
      label: "Tỉnh/Thành phố",
      value: filters.province || "",
      options: [{ value: "", label: "Tất cả tỉnh/thành" }, ...uniqueProvinces],
      onChange: handleProvinceFilter,
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      id: "verified",
      label: "Trạng thái xác thực",
      value:
        filters.isVerified === true
          ? "true"
          : filters.isVerified === false
          ? "false"
          : "",
      options: [
        { value: "", label: "Tất cả" },
        { value: "true", label: "Đã xác thực" },
        { value: "false", label: "Chưa xác thực" },
      ],
      onChange: handleVerificationFilter,
      icon: <Award className="h-4 w-4" />,
    },
  ];

  return (
    <PublicPageLayout
      title="Tình nguyện viên"
      description="Khám phá cộng đồng tình nguyện viên tài năng và nhiệt huyết, sẵn sàng đóng góp cho các hoạt động xã hội ý nghĩa."
      searchValue={searchQuery}
      onSearchChange={handleSearch}
      searchPlaceholder="Tìm kiếm tình nguyện viên..."
      filters={[]}
      resultCount={pagination.totalItems}
      stats={stats}
      loading={loading}
      error={error}
      onRetry={() => window.location.reload()}
      isEmpty={mappedVolunteers.length === 0}
      emptyIcon={Users}
      emptyTitle="Không tìm thấy tình nguyện viên"
      emptyDescription="Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm để có kết quả tốt hơn."
      pagination={{
        page: pagination.page,
        size: filters.size,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        hasNextPage: pagination.page < pagination.totalPages,
        hasPreviousPage: pagination.page > 1,
      }}
      onPageChange={handlePageChange}
      itemName="tình nguyện viên"
      gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {mappedVolunteers.map((volunteer) => (
        <VolunteerCard key={volunteer.id} volunteer={volunteer} />
      ))}
    </PublicPageLayout>
  );
}
