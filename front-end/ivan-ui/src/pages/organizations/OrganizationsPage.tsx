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
import type { OrganizationProfile } from "@/types/profile";

// Mock data for organizations
const mockOrganizations: (OrganizationProfile & {
  user: { fullName: string; email: string };
})[] = [
  {
    id: 1,
    userId: 1,
    user: { fullName: "Quỹ Giáo dục Xanh", email: "contact@greenedu.org" },
    organizationName: "Quỹ Giáo dục Xanh",
    description:
      "Tổ chức phi lợi nhuận chuyên về giáo dục môi trường và phát triển bền vững cho trẻ em và thanh thiếu niên.",
    website: "https://greenedu.org",
    industry: "Giáo dục",
    foundedYear: 2018,
    size: "medium",
    location: {
      address: "123 Đường Cây Xanh",
      city: "Hồ Chí Minh",
      state: "Hồ Chí Minh",
      country: "Việt Nam",
      zipCode: "70000",
    },
    contactInfo: {
      phoneNumber: "+84 28 1234 5678",
    },
    verification: {
      isVerified: true,
      documents: ["business-license.pdf"],
      verificationDate: "2024-01-15T00:00:00Z",
    },
    settings: {
      isPublic: true,
      allowDirectContact: true,
      autoApproveVolunteers: false,
    },
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: 2,
    userId: 2,
    user: {
      fullName: "Trung tâm Hỗ trợ Người cao tuổi",
      email: "info@eldercare.vn",
    },
    organizationName: "Trung tâm Hỗ trợ Người cao tuổi",
    description:
      "Chăm sóc và hỗ trợ người cao tuổi trong cộng đồng thông qua các hoạt động tình nguyện và dịch vụ xã hội.",
    website: "https://eldercare.vn",
    industry: "Chăm sóc xã hội",
    foundedYear: 2015,
    size: "large",
    location: {
      address: "456 Phố Nhân Ái",
      city: "Hà Nội",
      state: "Hà Nội",
      country: "Việt Nam",
      zipCode: "10000",
    },
    contactInfo: {
      phoneNumber: "+84 24 9876 5432",
    },
    verification: {
      isVerified: true,
      documents: ["ngo-license.pdf", "tax-exempt.pdf"],
      verificationDate: "2024-02-01T00:00:00Z",
    },
    settings: {
      isPublic: true,
      allowDirectContact: true,
      autoApproveVolunteers: true,
    },
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    id: 3,
    userId: 3,
    user: {
      fullName: "Tổ chức Y tế Cộng đồng",
      email: "hello@communityhealth.org",
    },
    organizationName: "Tổ chức Y tế Cộng đồng",
    description:
      "Cung cấp dịch vụ y tế miễn phí và giáo dục sức khỏe cho các vùng khó khăn và cộng đồng thiệt thòi.",
    industry: "Y tế",
    foundedYear: 2020,
    size: "small",
    location: {
      address: "789 Đường Y Tế",
      city: "Đà Nẵng",
      state: "Đà Nẵng",
      country: "Việt Nam",
      zipCode: "50000",
    },
    contactInfo: {
      phoneNumber: "+84 236 1111 2222",
    },
    verification: {
      isVerified: false,
      documents: [],
    },
    settings: {
      isPublic: true,
      allowDirectContact: false,
      autoApproveVolunteers: false,
    },
    createdAt: "2024-02-10T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z",
  },
];

export default function OrganizationsPage() {
  const [organizations] = useState(mockOrganizations);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading] = useState(false);

  // Filter organizations based on search term
  const filteredOrganizations = organizations.filter(
    (org) =>
      org.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getSizeLabel = (size: string) => {
    const labels = {
      small: "Nhỏ (1-10 người)",
      medium: "Trung bình (11-50 người)",
      large: "Lớn (51-200 người)",
      enterprise: "Rất lớn (200+ người)",
    };
    return labels[size as keyof typeof labels] || size;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Danh sách Tổ chức
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Khám phá các tổ chức đang tạo ra những tác động tích cực trong cộng
            đồng
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên tổ chức, lĩnh vực, hoặc địa điểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button asChild>
              <Link to="/register">Đăng ký tổ chức</Link>
            </Button>
          </div>
        </div>

        {/* Organizations grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrganizations.map((org) => (
              <Card key={org.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${org.organizationName}`}
                      />
                      <AvatarFallback className="text-lg">
                        {getInitials(org.organizationName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {org.organizationName}
                        </CardTitle>
                        {org.verification.isVerified && (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                        {org.location.city}, {org.location.country}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {org.description}
                    </p>

                    {/* Industry and Size */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {org.industry}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getSizeLabel(org.size)}
                      </Badge>
                      {org.foundedYear && (
                        <Badge variant="outline" className="text-xs">
                          Thành lập {org.foundedYear}
                        </Badge>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2">
                      {org.website && (
                        <div className="flex items-center gap-2 text-sm">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                            />
                          </svg>
                          <a
                            href={org.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate"
                          >
                            {org.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      )}
                      {org.settings.allowDirectContact && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span className="truncate">
                            {org.contactInfo.phoneNumber}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Status badges */}
                    <div className="flex flex-wrap gap-1">
                      {org.verification.isVerified && (
                        <Badge
                          variant="default"
                          className="text-xs bg-green-500"
                        >
                          Đã xác thực
                        </Badge>
                      )}
                      {org.settings.autoApproveVolunteers && (
                        <Badge variant="secondary" className="text-xs">
                          Duyệt tự động
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No results */}
        {filteredOrganizations.length === 0 && !isLoading && (
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
              Không tìm thấy tổ chức
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Thử tìm kiếm với từ khóa khác hoặc{" "}
              <Link to="/register" className="text-primary hover:underline">
                đăng ký tổ chức của bạn
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
