import { useState, useMemo, useEffect } from "react";
import { Users, MapPin, Clock, Search } from "lucide-react";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { VolunteerCard } from "@/components/public/VolunteerCard";
import { useApi } from "@/hooks/useApi";
import { publicContentService } from "@/services/publicContentService";
import type {
  PublicVolunteer,
  PublicVolunteerFilters,
  VolunteerCardData,
} from "@/types/publicContent";
import type { StatCard } from "@/components/public/StatsSection";

const PROVINCES = [
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
  "Phú Yên",
  "Cần Thơ",
  "Đà Nẵng",
  "Hải Phòng",
  "Hà Nội",
  "TP Hồ Chí Minh",
];

export const PublicVolunteersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<PublicVolunteerFilters>({
    page: 1,
    size: 6,
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

  // Service adapter for public volunteers
  const publicVolunteersService = {
    getAll: async (): Promise<PublicVolunteer[]> => {
      const result = await publicContentService.getPublicVolunteers(filters);
      return result.items;
    },
  };

  // Use the new useApi hook
  const volunteersApi = useApi(publicVolunteersService, { autoLoad: true });

  // Load volunteers when filters change
  useEffect(() => {
    volunteersApi.loadAll();
  }, [filters]);

  // Extract volunteers from the API response
  const volunteers = volunteersApi.data || [];
  const loading = volunteersApi.loading;
  const error = volunteersApi.error;

  // For pagination, we'll use simple client-side pagination for now
  const pagination = {
    page: filters.page || 1,
    totalPages: Math.ceil(volunteers.length / (filters.size || 20)),
    totalItems: volunteers.length,
  };

  // Load volunteers when filters change
  useEffect(() => {
    volunteersApi.loadAll();
  }, [filters]);

  // Handlers
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleRetry = () => {
    volunteersApi.loadAll();
  };

  // Convert volunteers data to card format
  const convertToCardData = (volunteers: any[]): VolunteerCardData[] => {
    if (!volunteers || !Array.isArray(volunteers)) {
      console.warn("Invalid volunteers data - not an array");
      return [];
    }

    return volunteers.map((volunteer, index) => {
      try {
        // Safely extract skills
        let skills: string[] = [];

        // Try skillsList first (the new format)
        if (volunteer.skillsList && Array.isArray(volunteer.skillsList)) {
          skills = volunteer.skillsList
            .filter(
              (skill: any) =>
                skill && typeof skill === "object" && skill.skillName
            )
            .map((skill: any) => String(skill.skillName));
        }
        // Fallback to skills array if it exists
        else if (volunteer.skills && Array.isArray(volunteer.skills)) {
          skills = volunteer.skills
            .filter(
              (skill: any) =>
                skill && typeof skill === "object" && skill.skillName
            )
            .map((skill: any) => String(skill.skillName));
        }
        // Handle comma-separated string format
        else if (volunteer.skills && typeof volunteer.skills === "string") {
          skills = volunteer.skills
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
        }

        const result: VolunteerCardData = {
          id: Number(volunteer.volunteerId) || 0,
          name: String(volunteer.fullName || "Unknown"),
          fullName: String(volunteer.fullName || "Unknown"),
          description: String(
            volunteer.motivation ||
              volunteer.experience ||
              "Dedicated volunteer ready to make a difference"
          ),
          university: volunteer.university
            ? String(volunteer.university)
            : undefined,
          major: volunteer.major ? String(volunteer.major) : undefined,
          yearOfStudy: volunteer.yearOfStudy
            ? Number(volunteer.yearOfStudy)
            : undefined,
          location: String(volunteer.province || "Not specified"),
          avatar: volunteer.avatar ? String(volunteer.avatar) : undefined,
          isVerified: Boolean(volunteer.isVerified),
          rating: Number(volunteer.rating) || 0,
          ratingCount: Number(volunteer.ratingCount) || 0,
          totalHoursVolunteered: Number(volunteer.totalHoursVolunteered) || 0,
          skills,
          availability: volunteer.availability
            ? String(volunteer.availability)
            : undefined,
          lastActiveDate: volunteer.lastActiveDate
            ? String(volunteer.lastActiveDate)
            : undefined,
        };

        return result;
      } catch (error) {
        console.error(
          `Error processing volunteer at index ${index}:`,
          error instanceof Error ? error.message : String(error)
        );
        console.error("Volunteer data:", JSON.stringify(volunteer, null, 2));
        // Return a safe fallback object
        return {
          id: index,
          name: "Unknown Volunteer",
          fullName: "Unknown Volunteer",
          description: "Volunteer information unavailable",
          location: "Not specified",
          isVerified: false,
          rating: 0,
          ratingCount: 0,
          totalHoursVolunteered: 0,
          skills: [],
        };
      }
    });
  };

  // Map backend data to component props
  const mappedVolunteers = useMemo(
    () => convertToCardData(volunteers || []),
    [volunteers]
  );

  // Filter change handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // The actual API call will be triggered by the debounced value
  };

  const handleProvinceChange = (province: string) => {
    const selectedProvince = province === "all" ? undefined : province;
    setFilters((prev) => ({ ...prev, province: selectedProvince }));
  };

  const handleVerifiedChange = (checked: boolean) => {
    setFilters((prev) => ({ ...prev, isVerified: checked ? true : undefined }));
  };

  // Stats calculations
  const statsCards: StatCard[] = [
    {
      title: "Tổng tình nguyện viên",
      value: pagination.totalItems.toString(),
      subtitle: "Tình nguyện viên đang hoạt động",
      icon: Users,
    },
    {
      title: "Tổng giờ tình nguyện",
      value: mappedVolunteers
        .reduce(
          (total: number, volunteer) =>
            total + (volunteer.totalHoursVolunteered || 0),
          0
        )
        .toLocaleString(),
      subtitle: "Giờ đã đóng góp",
      icon: Clock,
    },
    {
      title: "Địa điểm",
      value: new Set(
        mappedVolunteers.map((volunteer) => volunteer.location)
      ).size.toString(),
      subtitle: "Tỉnh thành",
      icon: MapPin,
    },
  ];

  return (
    <PublicPageLayout
      title="Volunteers"
      description="Connect with skilled volunteers ready to make a difference in your community"
      searchValue={filters.search || ""}
      onSearchChange={handleSearch}
      searchPlaceholder="Search by name, skills, or university..."
      filters={[
        {
          id: "province",
          label: "Province",
          value: filters.province || "all",
          options: [
            { value: "all", label: "All provinces" },
            ...PROVINCES.map((province) => ({
              value: province,
              label: province,
            })),
          ],
          onChange: handleProvinceChange,
        },
      ]}
      resultCount={pagination.totalItems}
      stats={statsCards}
      loading={loading}
      error={error || null}
      onRetry={handleRetry}
      isEmpty={!volunteers || volunteers.length === 0}
      gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      emptyIcon={Search}
      emptyTitle="Không tìm thấy tình nguyện viên"
      emptyDescription="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
      pagination={{
        page: pagination.page,
        size: 12, // Default page size
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        hasNextPage: pagination.page < pagination.totalPages,
        hasPreviousPage: pagination.page > 1,
      }}
      onPageChange={handlePageChange}
      itemName="tình nguyện viên"
    >
      {mappedVolunteers.map((volunteer) => (
        <VolunteerCard key={volunteer.id} volunteer={volunteer} />
      ))}
    </PublicPageLayout>
  );
};

export default PublicVolunteersPage;
