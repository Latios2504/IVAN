import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { VolunteerProfile } from "@/types/profile";

// Mock data for volunteers
interface VolunteerDisplayData {
  id: number;
  userId: number;
  user: { fullName: string; email: string };
  // Display-specific fields that don't exist in our new profile structure
  university?: string;
  major?: string;
  yearOfStudy?: number;
  experience?: string;
  availability?: string[];
  volunteerHours?: number;
  rating?: number;
  ratingCount?: number;
  isVerified?: boolean;
  verifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  // Include fields that do exist in our new structure
  profile: VolunteerProfile;
}

const mockVolunteers: VolunteerDisplayData[] = [
  {
    id: 1,
    userId: 1,
    user: { fullName: "Nguyễn Văn An", email: "an.nguyen@email.com" },
    university: "Đại học Bách Khoa TP.HCM",
    major: "Kỹ thuật phần mềm",
    yearOfStudy: 3,
    experience: "3 năm kinh nghiệm tình nguyện",
    availability: ["Cuối tuần", "Tối các ngày trong tuần"],
    volunteerHours: 120,
    rating: 4.8,
    ratingCount: 15,
    isVerified: true,
    verifiedAt: "2024-01-20T00:00:00Z",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    profile: {
      profileId: 1,
      firstName: "Nguyễn",
      lastName: "Văn An",
      fullName: "Nguyễn Văn An",
      bio: "Tôi là một sinh viên kỹ sư phần mềm với niềm đam mê giúp đỡ cộng đồng thông qua công nghệ.",
      isProfileComplete: true,
      location: {
        city: "Hồ Chí Minh",
        province: "Hồ Chí Minh",
        country: "Việt Nam",
        addressLine1: "123 Đường ABC",
      },
      phoneNumber: "0901234567",
      dateOfBirth: "2000-05-15",
      // Volunteer-specific fields
      occupation: "Sinh viên",
      emergencyContactName: "Nguyễn Văn B",
      emergencyContactPhone: "0987654321",
      emergencyContactRelationship: "Bố",
      availabilityNotes: "Cuối tuần, Tối các ngày trong tuần",
      preferredVolunteerTypes: "Giáo dục, Công nghệ",
      totalVolunteerHours: 120,
      volunteerRank: "Đồng",
      joinedDate: "2024-01-15",
      lastActiveDate: "2024-01-20",
      willingToTravel: true,
      hasTransportation: false,
      preferredWorkingHours: "Tối và cuối tuần",
      languagesSpoken: "Tiếng Việt, Tiếng Anh",
      skills: ["Lập trình", "Thiết kế web", "Quản lý dự án", "Giảng dạy"],
    },
  },
  {
    id: 2,
    userId: 2,
    user: { fullName: "Trần Thị Bình", email: "binh.tran@email.com" },
    university: "Đại học Sư phạm Hà Nội",
    major: "Giáo dục tiểu học",
    yearOfStudy: 4,
    experience: "5 năm kinh nghiệm giảng dạy và tình nguyện",
    availability: ["Cuối tuần", "Ngày lễ"],
    volunteerHours: 180,
    rating: 4.9,
    ratingCount: 22,
    isVerified: true,
    verifiedAt: "2024-02-05T00:00:00Z",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
    profile: {
      profileId: 2,
      firstName: "Trần",
      lastName: "Thị Bình",
      fullName: "Trần Thị Bình",
      bio: "Giáo viên tiểu học với 5 năm kinh nghiệm, yêu thích làm việc với trẻ em.",
      isProfileComplete: true,
      location: {
        city: "Hà Nội",
        province: "Hà Nội",
        country: "Việt Nam",
        addressLine1: "456 Đường XYZ",
      },
      phoneNumber: "0912345678",
      dateOfBirth: "1995-08-20",
      // Volunteer-specific fields
      occupation: "Giáo viên",
      emergencyContactName: "Trần Văn C",
      emergencyContactPhone: "0976543210",
      emergencyContactRelationship: "Anh",
      availabilityNotes: "Cuối tuần, Ngày lễ",
      preferredVolunteerTypes: "Giáo dục, Trẻ em",
      totalVolunteerHours: 180,
      volunteerRank: "Bạc",
      joinedDate: "2024-02-01",
      lastActiveDate: "2024-02-05",
      willingToTravel: true,
      hasTransportation: true,
      preferredWorkingHours: "Cuối tuần",
      languagesSpoken: "Tiếng Việt",
      skills: ["Giảng dạy", "Tổ chức sự kiện", "Chăm sóc trẻ em", "Âm nhạc"],
    },
  },
  {
    id: 3,
    userId: 3,
    user: { fullName: "Lê Minh Cường", email: "cuong.le@email.com" },
    university: "Đại học Y Đà Nẵng",
    major: "Y khoa",
    yearOfStudy: 5,
    experience: "2 năm kinh nghiệm y tế tình nguyện",
    availability: ["Cuối tuần"],
    volunteerHours: 85,
    rating: 4.7,
    ratingCount: 12,
    isVerified: true,
    verifiedAt: "2024-01-25T00:00:00Z",
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
    profile: {
      profileId: 3,
      firstName: "Lê",
      lastName: "Minh Cường",
      fullName: "Lê Minh Cường",
      bio: "Sinh viên y khoa với mong muốn mang dịch vụ y tế đến những vùng khó khăn.",
      isProfileComplete: true,
      location: {
        city: "Đà Nẵng",
        province: "Đà Nẵng",
        country: "Việt Nam",
        addressLine1: "789 Đường DEF",
      },
      phoneNumber: "0923456789",
      dateOfBirth: "1998-12-10",
      // Volunteer-specific fields
      occupation: "Sinh viên Y khoa",
      emergencyContactName: "Lê Thị D",
      emergencyContactPhone: "0965432109",
      emergencyContactRelationship: "Mẹ",
      availabilityNotes: "Cuối tuần",
      preferredVolunteerTypes: "Y tế, Cộng đồng",
      totalVolunteerHours: 85,
      volunteerRank: "Đồng",
      joinedDate: "2024-01-20",
      lastActiveDate: "2024-01-25",
      willingToTravel: true,
      hasTransportation: false,
      preferredWorkingHours: "Cuối tuần",
      languagesSpoken: "Tiếng Việt, Tiếng Anh",
      skills: ["Y học", "Sơ cứu", "Tư vấn sức khỏe", "Tiếng Anh"],
    },
  },
];

export default function VolunteersPage() {
  const [volunteers] = useState(mockVolunteers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading] = useState(false);
  // Filter volunteers based on search term
  const filteredVolunteers = volunteers.filter(
    (volunteer) =>
      volunteer.user.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      volunteer.profile.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      volunteer.profile.location?.city
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Danh sách Tình nguyện viên
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Khám phá các tình nguyện viên tài năng trong cộng đồng của chúng tôi
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên, kỹ năng, hoặc địa điểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button asChild>
              <Link to="/register">Trở thành tình nguyện viên</Link>
            </Button>
          </div>
        </div>

        {/* Volunteers grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVolunteers.map((volunteer) => (
              <Card
                key={volunteer.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${volunteer.user.fullName}`}
                      />
                      <AvatarFallback>
                        {getInitials(volunteer.user.fullName)}
                      </AvatarFallback>
                    </Avatar>{" "}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {volunteer.user.fullName}
                        </CardTitle>
                        {volunteer.isVerified && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-100 text-green-700"
                          >
                            ✓ Xác thực
                          </Badge>
                        )}
                      </div>{" "}
                      <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                        {volunteer.profile.location?.city},{" "}
                        {volunteer.profile.location?.country}
                      </CardDescription>
                      {volunteer.rating && volunteer.rating > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {volunteer.rating}/5.0 ({volunteer.ratingCount} đánh
                            giá)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {" "}
                    {/* Bio */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {volunteer.profile.bio}
                    </p>
                    {/* Experience */}
                    {volunteer.experience && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                          Kinh nghiệm
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {volunteer.experience}
                        </p>
                      </div>
                    )}
                    {/* Skills */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-2">
                        Kỹ năng
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {volunteer.profile.skills
                          .slice(0, 4)
                          .map((skill: string, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        {volunteer.profile.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{volunteer.profile.skills.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>{" "}
                    {/* Availability */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                        Thời gian rảnh
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {volunteer.availability?.map(
                          (time: string, index: number) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {time}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                    {/* Volunteer Statistics */}
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <span>🕒</span>
                        <span>{volunteer.volunteerHours} giờ tình nguyện</span>
                      </div>
                      {volunteer.university && (
                        <div className="flex items-center gap-1">
                          <span>🎓</span>
                          <span className="truncate max-w-32">
                            {volunteer.university}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No results */}
        {filteredVolunteers.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Không tìm thấy tình nguyện viên
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Thử tìm kiếm với từ khóa khác hoặc{" "}
              <Link to="/register" className="text-primary hover:underline">
                trở thành tình nguyện viên đầu tiên
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
