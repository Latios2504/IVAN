import { useState } from "react";
import { PublicPageLayout } from "@/components/common/PublicPageLayout";
import { FilterSection } from "@/components/common/FilterSection";
import { VolunteerCard } from "@/components/cards/VolunteerCard";
import { LoadingGrid } from "@/components/ui/skeletons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
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
      console.warn('Invalid volunteers data - not an array');
      return [];
    }
    
    return volunteers.map((volunteer, index) => {
      try {
        // Safely extract skills
        let skills: string[] = [];
        
        // Try skillsList first (the new format)
        if (volunteer.skillsList && Array.isArray(volunteer.skillsList)) {
          skills = volunteer.skillsList
            .filter((skill: any) => skill && typeof skill === 'object' && skill.skillName)
            .map((skill: any) => String(skill.skillName));
        } 
        // Fallback to skills array if it exists
        else if (volunteer.skills && Array.isArray(volunteer.skills)) {
          skills = volunteer.skills
            .filter((skill: any) => skill && typeof skill === 'object' && skill.skillName)
            .map((skill: any) => String(skill.skillName));
        }
        // Handle comma-separated string format
        else if (volunteer.skills && typeof volunteer.skills === 'string') {
          skills = volunteer.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
        }

        const result: VolunteerCardData = {
          id: Number(volunteer.volunteerId) || 0,
          name: String(volunteer.fullName || 'Unknown'),
          fullName: String(volunteer.fullName || 'Unknown'),
          description: String(volunteer.motivation || volunteer.experience || "Dedicated volunteer ready to make a difference"),
          university: volunteer.university ? String(volunteer.university) : undefined,
          major: volunteer.major ? String(volunteer.major) : undefined,
          yearOfStudy: volunteer.yearOfStudy ? Number(volunteer.yearOfStudy) : undefined,
          location: String(volunteer.province || "Not specified"),
          avatar: volunteer.avatar ? String(volunteer.avatar) : undefined,
          isVerified: Boolean(volunteer.isVerified),
          rating: Number(volunteer.rating) || 0,
          ratingCount: Number(volunteer.ratingCount) || 0,
          totalHoursVolunteered: Number(volunteer.totalHoursVolunteered) || 0,
          skills,
          availability: volunteer.availability ? String(volunteer.availability) : undefined,
          lastActiveDate: volunteer.lastActiveDate ? String(volunteer.lastActiveDate) : undefined,
        };

        return result;
      } catch (error) {
        console.error(`Error processing volunteer at index ${index}:`, error instanceof Error ? error.message : String(error));
        console.error('Volunteer data:', JSON.stringify(volunteer, null, 2));
        // Return a safe fallback object
        return {
          id: index,
          name: 'Unknown Volunteer',
          fullName: 'Unknown Volunteer',
          description: 'Volunteer information unavailable',
          location: 'Not specified',
          isVerified: false,
          rating: 0,
          ratingCount: 0,
          totalHoursVolunteered: 0,
          skills: [],
        };
      }
    });
  };

  return (
    <PublicPageLayout
      title="Volunteers"
      description="Connect with skilled volunteers ready to make a difference in your community"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <FilterSection
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
                ...PROVINCES.map(province => ({ value: province, label: province }))
              ],
              onChange: handleProvinceChange,
            }
          ]}
          resultCount={pagination.totalItems}
        />

        {/* Content */}
        <div className="mt-8">
          {loading ? (
            <LoadingGrid count={6} />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {convertToCardData(volunteers).map((volunteer) => (
                  <VolunteerCard key={volunteer.id} volunteer={volunteer} />
                ))}
              </div>

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

export default PublicVolunteersPage;