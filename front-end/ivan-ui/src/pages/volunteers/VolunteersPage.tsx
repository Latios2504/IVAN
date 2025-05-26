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
const mockVolunteers: (VolunteerProfile & {
  user: { fullName: string; email: string };
})[] = [
  {
    id: "1",
    userId: "1",
    user: { fullName: "Nguyễn Văn An", email: "an.nguyen@email.com" },
    bio: "Tôi là một kỹ sư phần mềm với niềm đam mê giúp đỡ cộng đồng thông qua công nghệ.",
    skills: ["Lập trình", "Thiết kế web", "Quản lý dự án", "Giảng dạy"],
    experience: "3 năm kinh nghiệm tình nguyện",
    availability: ["Cuối tuần", "Tối các ngày trong tuần"],
    location: {
      city: "Hồ Chí Minh",
      state: "Hồ Chí Minh",
      country: "Việt Nam",
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      volunteerTypes: ["Giáo dục", "Công nghệ"],
    },
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    userId: "2",
    user: { fullName: "Trần Thị Bình", email: "binh.tran@email.com" },
    bio: "Giáo viên tiểu học với 5 năm kinh nghiệm, yêu thích làm việc với trẻ em.",
    skills: ["Giảng dạy", "Tổ chức sự kiện", "Chăm sóc trẻ em", "Âm nhạc"],
    experience: "5 năm kinh nghiệm giảng dạy và tình nguyện",
    availability: ["Cuối tuần", "Ngày lễ"],
    location: {
      city: "Hà Nội",
      state: "Hà Nội",
      country: "Việt Nam",
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      volunteerTypes: ["Giáo dục", "Trẻ em"],
    },
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "3",
    userId: "3",
    user: { fullName: "Lê Minh Cường", email: "cuong.le@email.com" },
    bio: "Bác sĩ trẻ với mong muốn mang dịch vụ y tế đến những vùng khó khăn.",
    skills: ["Y học", "Sơ cứu", "Tư vấn sức khỏe", "Tiếng Anh"],
    experience: "2 năm kinh nghiệm y tế",
    availability: ["Cuối tuần"],
    location: {
      city: "Đà Nẵng",
      state: "Đà Nẵng",
      country: "Việt Nam",
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      volunteerTypes: ["Y tế", "Cộng đồng"],
    },
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
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
      volunteer.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      volunteer.location.city.toLowerCase().includes(searchTerm.toLowerCase())
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
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {volunteer.user.fullName}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                        {volunteer.location.city}, {volunteer.location.country}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Bio */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {volunteer.bio}
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
                        {volunteer.skills.slice(0, 4).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {volunteer.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{volunteer.skills.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                        Thời gian rảnh
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {volunteer.availability.map((time, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {time}
                          </Badge>
                        ))}
                      </div>
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
