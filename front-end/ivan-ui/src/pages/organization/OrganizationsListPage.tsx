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

// Mock data based on OrganizationProfile interface
const mockOrganizations: (OrganizationProfile & {
  user: { fullName: string; email: string };
})[] = [
  {
    profileId: 1,
    firstName: "Quỹ",
    lastName: "Giáo dục Xanh",
    fullName: "Quỹ Giáo dục Xanh",
    phoneNumber: "+84 28 1234 5678",
    dateOfBirth: "2018-01-01",
    gender: "Organization",
    avatarUrl: undefined,
    bio: "Tổ chức phi lợi nhuận chuyên về giáo dục môi trường và phát triển bền vững cho trẻ em và thanh thiếu niên.",
    location: {
      addressLine1: "123 Đường Cây Xanh",
      city: "Hồ Chí Minh",
      province: "Hồ Chí Minh",
      country: "Việt Nam",
      postalCode: "70000",
    },
    isProfileComplete: true,
    user: { fullName: "Quỹ Giáo dục Xanh", email: "contact@greenedu.org" },
    organizationName: "Quỹ Giáo dục Xanh",
    organizationType: "Non-profit",
    organizationDescription:
      "Tổ chức phi lợi nhuận chuyên về giáo dục môi trường và phát triển bền vững cho trẻ em và thanh thiếu niên.",
    website: "https://greenedu.org",
    contactPersonName: "Nguyễn Thị Lan",
    contactPersonTitle: "Giám đốc",
    focusAreas: ["Giáo dục", "Môi trường", "Trẻ em"],
    isVerified: true,
    verificationDocuments: ["business-license.pdf"],
    verifiedAt: "2024-01-15T00:00:00Z",
    isPublic: true,
    allowDirectContact: true,
    autoApproveVolunteers: false,
  },
  {
    profileId: 2,
    firstName: "Trung tâm",
    lastName: "Hỗ trợ Người cao tuổi",
    fullName: "Trung tâm Hỗ trợ Người cao tuổi",
    phoneNumber: "+84 24 9876 5432",
    dateOfBirth: "2015-01-01",
    gender: "Organization",
    avatarUrl: undefined,
    bio: "Chăm sóc và hỗ trợ người cao tuổi trong cộng đồng thông qua các hoạt động tình nguyện và dịch vụ xã hội.",
    location: {
      addressLine1: "456 Phố Nhân Ái",
      city: "Hà Nội",
      province: "Hà Nội",
      country: "Việt Nam",
      postalCode: "10000",
    },
    isProfileComplete: true,
    user: {
      fullName: "Trung tâm Hỗ trợ Người cao tuổi",
      email: "info@eldercare.vn",
    },
    organizationName: "Trung tâm Hỗ trợ Người cao tuổi",
    organizationType: "NGO",
    organizationDescription:
      "Chăm sóc và hỗ trợ người cao tuổi trong cộng đồng thông qua các hoạt động tình nguyện và dịch vụ xã hội.",
    website: "https://eldercare.vn",
    contactPersonName: "Lê Văn Minh",
    contactPersonTitle: "Trưởng phòng",
    focusAreas: ["Chăm sóc xã hội", "Người cao tuổi", "Cộng đồng"],
    isVerified: true,
    verificationDocuments: ["ngo-license.pdf", "tax-exempt.pdf"],
    verifiedAt: "2024-02-01T00:00:00Z",
    isPublic: true,
    allowDirectContact: true,
    autoApproveVolunteers: true,
  },
  {
    profileId: 3,
    firstName: "Tổ chức",
    lastName: "Y tế Cộng đồng",
    fullName: "Tổ chức Y tế Cộng đồng",
    phoneNumber: "+84 236 1111 2222",
    dateOfBirth: "2020-01-01",
    gender: "Organization",
    avatarUrl: undefined,
    bio: "Cung cấp dịch vụ y tế miễn phí và giáo dục sức khỏe cho các vùng khó khăn và cộng đồng thiệt thòi.",
    location: {
      addressLine1: "789 Đường Y Tế",
      city: "Đà Nẵng",
      province: "Đà Nẵng",
      country: "Việt Nam",
      postalCode: "50000",
    },
    isProfileComplete: true,
    user: {
      fullName: "Tổ chức Y tế Cộng đồng",
      email: "hello@communityhealth.org",
    },
    organizationName: "Tổ chức Y tế Cộng đồng",
    organizationType: "Non-profit",
    organizationDescription:
      "Cung cấp dịch vụ y tế miễn phí và giáo dục sức khỏe cho các vùng khó khăn và cộng đồng thiệt thòi.",
    website: undefined,
    contactPersonName: "Phạm Thị Hoa",
    contactPersonTitle: "Phối điều viên",
    focusAreas: ["Y tế", "Cộng đồng", "Giáo dục sức khỏe"],
    isVerified: false,
    verificationDocuments: [],
    verifiedAt: undefined,
    isPublic: true,
    allowDirectContact: false,
    autoApproveVolunteers: false,
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
      org.focusAreas.some((area) =>
        area.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      (org.location?.city &&
        org.location.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (org.organizationDescription &&
        org.organizationDescription
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getSizeLabel = (orgType: string) => {
    const labels: Record<string, string> = {
      "Non-profit": "Tổ chức phi lợi nhuận",
      NGO: "Tổ chức phi chính phủ",
      Government: "Cơ quan chính phủ",
      Educational: "Giáo dục",
      Religious: "Tôn giáo",
      Corporate: "Doanh nghiệp",
      Other: "Khác",
    };
    return labels[orgType] || orgType;
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
              <Card
                key={org.profileId}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage
                        src={
                          org.avatarUrl ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${org.organizationName}`
                        }
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
                        {org.isVerified && (
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
                        {org.location?.city}, {org.location?.country}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {org.organizationDescription || org.bio}
                    </p>

                    {/* Focus Areas and Type */}
                    <div className="flex flex-wrap gap-2">
                      {org.focusAreas.slice(0, 2).map((area, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {area}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="text-xs">
                        {getSizeLabel(org.organizationType)}
                      </Badge>
                      {org.dateOfBirth && (
                        <Badge variant="outline" className="text-xs">
                          Thành lập {new Date(org.dateOfBirth).getFullYear()}
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
                      {org.allowDirectContact && org.phoneNumber && (
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
                          <span className="truncate">{org.phoneNumber}</span>
                        </div>
                      )}
                    </div>

                    {/* Status badges */}
                    <div className="flex flex-wrap gap-1">
                      {org.isVerified && (
                        <Badge
                          variant="default"
                          className="text-xs bg-green-500"
                        >
                          Đã xác thực
                        </Badge>
                      )}
                      {org.autoApproveVolunteers && (
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
