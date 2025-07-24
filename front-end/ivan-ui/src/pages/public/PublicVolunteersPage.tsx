import { useState } from "react";
import { PublicPageLayout } from "@/components/common/PublicPageLayout";
import { FilterSection } from "@/components/common/FilterSection";
import { VolunteerCard } from "@/components/cards/VolunteerCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, Users, Filter } from "lucide-react";
import { usePublicVolunteers } from "@/hooks/usePublicVolunteers";
import type { PublicVolunteerFilters, VolunteerCardData } from "@/types/publicContent";

const PROVINCES = [
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
  "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
  "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông",
  "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang",
  "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình",
  "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu",
  "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
  "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Quảng Bình",
  "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng",
  "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa",
  "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long",
  "Vĩnh Phúc", "Yên Bái", "Phú Yên", "Cần Thơ", "Đà Nẵng",
  "Hải Phòng", "Hà Nội", "TP Hồ Chí Minh"
];

export const PublicVolunteersPage = () => {
  const [filters, setFilters] = useState<PublicVolunteerFilters>({
    page: 1,
    size: 20,
  });

  const { volunteers, loading, error, pagination, setPage } = usePublicVolunteers(filters);

  const handleFilterChange = (newFilters: Partial<PublicVolunteerFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handleSearch = (search: string) => {
    handleFilterChange({ search: search || undefined });
  };

  const handleProvinceChange = (province: string) => {
    handleFilterChange({ province: province === "all" ? undefined : province });
  };

  const handleVerifiedChange = (checked: boolean) => {
    handleFilterChange({ isVerified: checked ? true : undefined });
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const convertToCardData = (volunteers: any[]): VolunteerCardData[] => {
    if (!volunteers || !Array.isArray(volunteers)) {
      return [];
    }
    
    return volunteers.map(volunteer => {
      // Safely extract skills
      let skills: string[] = [];
      try {
        if (volunteer.skillsList && Array.isArray(volunteer.skillsList)) {
          skills = volunteer.skillsList
            .filter((skill: any) => skill && typeof skill === 'object' && skill.skillName)
            .map((skill: any) => String(skill.skillName));
        } else if (volunteer.skills && typeof volunteer.skills === 'string') {
          // Handle case where skills might be a comma-separated string
          skills = volunteer.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      } catch (error) {
        console.warn('Error processing skills for volunteer:', volunteer.volunteerId, error);
        skills = [];
      }

      return {
        id: volunteer.volunteerId || 0,
        name: volunteer.fullName || 'Unknown',
        fullName: volunteer.fullName || 'Unknown',
        description: volunteer.motivation || volunteer.experience || "Dedicated volunteer ready to make a difference",
        university: volunteer.university || undefined,
        major: volunteer.major || undefined,
        yearOfStudy: volunteer.yearOfStudy || undefined,
        location: volunteer.province || "Not specified",
        avatar: volunteer.avatar || undefined,
        isVerified: Boolean(volunteer.isVerified),
        rating: Number(volunteer.rating) || 0,
        ratingCount: Number(volunteer.ratingCount) || 0,
        totalHoursVolunteered: Number(volunteer.totalHoursVolunteered) || 0,
        skills,
        availability: volunteer.availability || undefined,
        lastActiveDate: volunteer.lastActiveDate || undefined,
      };
    });
  };

  const filterContent = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="search">Search volunteers</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="search"
            placeholder="Search by name, skills, or university..."
            value={filters.search || ""}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="province">Province</Label>
        <Select
          value={filters.province || "all"}
          onValueChange={handleProvinceChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All provinces" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All provinces</SelectItem>
            {PROVINCES.map((province) => (
              <SelectItem key={province} value={province}>
                {province}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="verified"
          checked={filters.isVerified || false}
          onCheckedChange={handleVerifiedChange}
        />
        <Label htmlFor="verified">Verified volunteers only</Label>
      </div>
    </div>
  );

  return (
    <PublicPageLayout
      title="Volunteers"
      description="Connect with skilled volunteers ready to make a difference in your community"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <FilterSection
          title="Filter Volunteers"
          icon={<Filter className="h-4 w-4" />}
          content={filterContent}
        />

        {/* Content */}
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : !volunteers || volunteers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No volunteers found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more results.
              </p>
            </div>
          ) : (
            <>
              {/* Results count */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {volunteers.length} of {pagination.totalItems} volunteers
                </p>
              </div>

              {/* Volunteers grid */}
              <ErrorBoundary>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {convertToCardData(volunteers).map((volunteer) => (
                    <VolunteerCard key={volunteer.id} volunteer={volunteer} />
                  ))}
                </div>
              </ErrorBoundary>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, pagination.page - 2) + i;
                    if (pageNum > pagination.totalPages) return null;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === pagination.page ? "default" : "outline"}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PublicPageLayout>
  );
};