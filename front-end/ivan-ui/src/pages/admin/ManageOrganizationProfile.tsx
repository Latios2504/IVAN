import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import type {
  OrganizationProfileData,
  OrganizationProfileFilters,
  OrganizationType,
  OrganizationStats,
} from "@/types/profile/organization-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingWithRetry } from "@/components/ui/skeletons";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";
import {
  Building2,
  Search,
  Filter,
  Eye,
  Edit,
  ShieldCheck,
  Users,
  Calendar,
  Star,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Admin Organization List Page
 * Implements admin view for FE-03: List Organization Profiles
 *
 * Features:
 * - List all organizations with filtering and search
 * - Organization verification status management
 * - Organization statistics overview
 * - Quick actions for organization management
 */

const AdminOrganizationListPage = () => {
  const { user } = useAuth();
  // Remove useToast hook since we're using sonner directly

  // Use the new API pattern
  const organizationsApi = useApi<OrganizationProfileData[]>();
  const typesApi = useApi<OrganizationType[]>();
  const statsApi = useApi<OrganizationStats>();

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // For now, use sample data until services are properly implemented
        organizationsApi.execute(async () => sampleOrganizations);
        typesApi.execute(async () => sampleOrganizationTypes);
        statsApi.execute(async () => sampleStats);
      } catch (error) {
        console.error("Failed to load organization data:", error);
      }
    };

    loadData();
  }, []);

  // Destructure the data
  const organizations = organizationsApi.data || [];
  const organizationTypes = typesApi.data || [];
  const stats = statsApi.data;
  const loading =
    organizationsApi.loading || typesApi.loading || statsApi.loading;
  const error = organizationsApi.error || typesApi.error || statsApi.error;

  const [filteredOrganizations, setFilteredOrganizations] = useState<
    OrganizationProfileData[]
  >([]);
  const [currentTab, setCurrentTab] = useState("all");

  // Filter state
  const [filters, setFilters] = useState<OrganizationProfileFilters>({
    searchTerm: "",
    typeId: undefined,
    province: "",
    isVerified: undefined,
    isActive: undefined,
  });

  // Sample organization types
  const sampleOrganizationTypes: OrganizationType[] = [
    {
      typeId: 1,
      typeName: "Tổ chức phi lợi nhuận",
      description: "NGO, từ thiện, tình nguyện",
      isActive: true,
    },
    {
      typeId: 2,
      typeName: "Doanh nghiệp",
      description: "Công ty tư nhân, CSR",
      isActive: true,
    },
    {
      typeId: 3,
      typeName: "Tổ chức nhà nước",
      description: "Cơ quan chính phủ, công lập",
      isActive: true,
    },
    {
      typeId: 4,
      typeName: "Trường học",
      description: "Trường đại học, phổ thông",
      isActive: true,
    },
    {
      typeId: 5,
      typeName: "Tôn giáo",
      description: "Tổ chức tôn giáo, tín ngưỡng",
      isActive: true,
    },
  ];

  // Sample organizations data
  const sampleOrganizations: OrganizationProfileData[] = [
    {
      organizationId: 1,
      userId: 1,
      organizationName: "Quỹ Từ thiện IVAN",
      shortName: "IVAN",
      typeId: 1,
      taxCode: "0123456789",
      businessLicense: "GP123456789",
      establishedYear: 2020,
      website: "https://ivan.org.vn",
      description: "Tổ chức tình nguyện viên hàng đầu Việt Nam",
      address: "123 Nguyễn Trãi, Phường 3",
      wardCommune: "Phường 3",
      district: "Quận 5",
      province: "TP. Hồ Chí Minh",
      contactPersonName: "Nguyễn Văn An",
      contactPersonTitle: "Giám đốc điều hành",
      contactEmail: "contact@ivan.org.vn",
      contactPhone: "024 1234 5678",
      isVerified: true,
      verifiedAt: "2024-01-15T10:30:00Z",
      rating: 4.8,
      ratingCount: 156,
      totalEvents: 45,
      totalVolunteers: 1250,
      isActive: true,
      createdAt: "2023-12-01T09:00:00Z",
      updatedAt: "2024-06-15T14:30:00Z",
    },
    {
      organizationId: 2,
      userId: 2,
      organizationName: "Tổ chức Xanh Việt Nam",
      shortName: "GREEN VN",
      typeId: 1,
      taxCode: "0987654321",
      businessLicense: "GP987654321",
      establishedYear: 2018,
      website: "https://greenvn.org",
      description: "Tập trung vào bảo vệ môi trường và phát triển bền vững",
      address: "456 Lê Lợi, Phường 1",
      wardCommune: "Phường 1",
      district: "Quận 1",
      province: "TP. Hồ Chí Minh",
      contactPersonName: "Trần Thị Bình",
      contactPersonTitle: "Chủ tịch",
      contactEmail: "info@greenvn.org",
      contactPhone: "028 9876 5432",
      isVerified: true,
      verifiedAt: "2024-02-20T14:15:00Z",
      rating: 4.6,
      ratingCount: 89,
      totalEvents: 32,
      totalVolunteers: 780,
      isActive: true,
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2024-06-10T16:45:00Z",
    },
    {
      organizationId: 3,
      userId: 3,
      organizationName: "Công ty TNHH Công nghệ ABC",
      shortName: "ABC Tech",
      typeId: 2,
      taxCode: "0123987456",
      businessLicense: "GP123987456",
      establishedYear: 2015,
      website: "https://abc-tech.com.vn",
      description: "Công ty công nghệ với chương trình CSR",
      address: "789 Trần Hưng Đạo, Phường 2",
      wardCommune: "Phường 2",
      district: "Quận 1",
      province: "Hà Nội",
      contactPersonName: "Lê Văn Cường",
      contactPersonTitle: "Giám đốc HR",
      contactEmail: "hr@abc-tech.com.vn",
      contactPhone: "024 3456 7890",
      isVerified: false,
      rating: 4.2,
      ratingCount: 45,
      totalEvents: 12,
      totalVolunteers: 320,
      isActive: true,
      createdAt: "2024-03-15T11:30:00Z",
      updatedAt: "2024-06-01T09:20:00Z",
    },
    {
      organizationId: 4,
      userId: 4,
      organizationName: "Trường Đại học XYZ",
      shortName: "XYZ University",
      typeId: 4,
      taxCode: "0456789123",
      businessLicense: "GP456789123",
      establishedYear: 1995,
      website: "https://xyz.edu.vn",
      description: "Trường đại học công lập với nhiều hoạt động tình nguyện",
      address: "321 Điện Biên Phủ, Phường 5",
      wardCommune: "Phường 5",
      district: "Quận 3",
      province: "TP. Hồ Chí Minh",
      contactPersonName: "Phạm Thị Dung",
      contactPersonTitle: "Trưởng phòng Đào tạo",
      contactEmail: "daotao@xyz.edu.vn",
      contactPhone: "028 2345 6789",
      isVerified: true,
      verifiedAt: "2024-01-05T08:45:00Z",
      rating: 4.5,
      ratingCount: 67,
      totalEvents: 28,
      totalVolunteers: 890,
      isActive: true,
      createdAt: "2024-02-01T13:15:00Z",
      updatedAt: "2024-06-12T11:30:00Z",
    },
    {
      organizationId: 5,
      userId: 5,
      organizationName: "Tổ chức Tình nguyện Hoa Sen",
      shortName: "Hoa Sen",
      typeId: 1,
      taxCode: "0789123456",
      businessLicense: "GP789123456",
      establishedYear: 2022,
      website: "https://hoasen.org.vn",
      description: "Tổ chức mới thành lập, tập trung hỗ trợ trẻ em",
      address: "654 Nguyễn Huệ, Phường 4",
      wardCommune: "Phường 4",
      district: "Quận 1",
      province: "TP. Hồ Chí Minh",
      contactPersonName: "Hoàng Văn Đức",
      contactPersonTitle: "Thư ký",
      contactEmail: "contact@hoasen.org.vn",
      contactPhone: "028 1234 9876",
      isVerified: false,
      rating: 3.9,
      ratingCount: 23,
      totalEvents: 8,
      totalVolunteers: 156,
      isActive: false,
      createdAt: "2024-05-01T09:45:00Z",
      updatedAt: "2024-06-05T14:20:00Z",
    },
  ];

  // Sample stats data
  const sampleStats: OrganizationStats = {
    totalOrganizations: 125,
    verifiedOrganizations: 89,
    activeOrganizations: 112,
    pendingVerification: 13,
    totalEvents: 234,
    totalVolunteers: 5680,
    averageRating: 4.3,
    monthlyGrowth: 8.5,
  };

  // Apply filters and search
  useEffect(() => {
    if (!organizations?.length) return;

    let filtered = [...organizations];

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (org) =>
          org.organizationName.toLowerCase().includes(searchLower) ||
          org.shortName?.toLowerCase().includes(searchLower) ||
          org.contactEmail?.toLowerCase().includes(searchLower) ||
          org.contactPersonName?.toLowerCase().includes(searchLower)
      );
    }

    // Type filter
    if (filters.typeId) {
      filtered = filtered.filter((org) => org.typeId === filters.typeId);
    }

    // Province filter
    if (filters.province) {
      filtered = filtered.filter((org) => org.province === filters.province);
    }

    // Verification filter
    if (filters.isVerified !== undefined) {
      filtered = filtered.filter(
        (org) => org.isVerified === filters.isVerified
      );
    }

    // Active status filter
    if (filters.isActive !== undefined) {
      filtered = filtered.filter((org) => org.isActive === filters.isActive);
    }

    // Tab filter
    if (currentTab === "verified") {
      filtered = filtered.filter((org) => org.isVerified === true);
    } else if (currentTab === "pending") {
      filtered = filtered.filter((org) => org.isVerified === false);
    } else if (currentTab === "inactive") {
      filtered = filtered.filter((org) => org.isActive === false);
    }

    setFilteredOrganizations(filtered);
  }, [filters, organizations, currentTab]);

  // Handle filter changes
  const handleFilterChange = (
    key: keyof OrganizationProfileFilters,
    value: any
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      typeId: undefined,
      province: "",
      isVerified: undefined,
      isActive: undefined,
    });
  };

  // Get verification status
  const getVerificationStatus = (isVerified?: boolean) => {
    if (isVerified === true) {
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <ShieldCheck className="w-3 h-3" />,
        text: "Đã xác thực",
      };
    } else {
      return {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Clock className="w-3 h-3" />,
        text: "Chờ xác thực",
      };
    }
  };

  // Get active status
  const getActiveStatus = (isActive?: boolean) => {
    if (isActive === true) {
      return {
        color: "bg-green-100 text-green-800",
        text: "Hoạt động",
      };
    } else {
      return {
        color: "bg-red-100 text-red-800",
        text: "Tạm khóa",
      };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Render stars rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">{rating}/5</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingWithRetry text="Đang tải danh sách tổ chức..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quản lý tổ chức
            </h1>
            <p className="text-gray-600">
              Quản lý và giám sát tất cả các tổ chức trong hệ thống
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-sm">
              {stats?.totalOrganizations || 0} tổ chức
            </Badge>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng tổ chức
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalOrganizations}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã xác thực</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.verifiedOrganizations}
                </p>
              </div>
              <ShieldCheck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Chờ xác thực
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.pendingVerification}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tăng trưởng</p>
                <p className="text-2xl font-bold text-gray-900">
                  +{stats?.monthlyGrowth}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Tên tổ chức, email..."
                  value={filters.searchTerm || ""}
                  onChange={(e) =>
                    handleFilterChange("searchTerm", e.target.value)
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Loại tổ chức</Label>{" "}
              <Select
                value={filters.typeId?.toString() || "all"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "typeId",
                    value === "all" ? undefined : parseInt(value)
                  )
                }
              >
                <SelectTrigger>
                  {" "}
                  <SelectValue placeholder="Tất cả loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  {organizationTypes.map((type) => (
                    <SelectItem
                      key={type.typeId}
                      value={type.typeId.toString()}
                    >
                      {type.typeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Tỉnh/Thành phố</Label>{" "}
              <Select
                value={filters.province || "all"}
                onValueChange={(value) =>
                  handleFilterChange("province", value === "all" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả tỉnh" />{" "}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả tỉnh</SelectItem>
                  <SelectItem value="TP. Hồ Chí Minh">
                    TP. Hồ Chí Minh
                  </SelectItem>
                  <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                  <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                  <SelectItem value="Hải Phòng">Hải Phòng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification">Trạng thái</Label>{" "}
              <Select
                value={filters.isVerified?.toString() || "all"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "isVerified",
                    value === "all" ? undefined : value === "true"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {" "}
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="true">Đã xác thực</SelectItem>
                  <SelectItem value="false">Chờ xác thực</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Organization List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách tổ chức</CardTitle>
            <Badge variant="secondary">
              {filteredOrganizations.length} kết quả
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="verified">Đã xác thực</TabsTrigger>
              <TabsTrigger value="pending">Chờ xác thực</TabsTrigger>
              <TabsTrigger value="inactive">Không hoạt động</TabsTrigger>
            </TabsList>

            <TabsContent value={currentTab}>
              {filteredOrganizations.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Không có tổ chức nào
                  </h3>
                  <p className="text-gray-600">
                    Không tìm thấy tổ chức phù hợp với bộ lọc hiện tại.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tổ chức</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Liên hệ</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Đánh giá</TableHead>
                        <TableHead>Hoạt động</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrganizations.map((organization) => {
                        const verificationStatus = getVerificationStatus(
                          organization.isVerified
                        );
                        const activeStatus = getActiveStatus(
                          organization.isActive
                        );
                        const orgType = organizationTypes.find(
                          (t) => t.typeId === organization.typeId
                        );

                        return (
                          <TableRow key={organization.organizationId}>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium text-gray-900">
                                  {organization.organizationName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {organization.shortName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {organization.province}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {orgType?.typeName || "N/A"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-900">
                                  {organization.contactPersonName}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {organization.contactEmail}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {organization.contactPhone}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                <Badge className={verificationStatus.color}>
                                  {verificationStatus.icon}
                                  <span className="ml-1">
                                    {verificationStatus.text}
                                  </span>
                                </Badge>
                                <Badge className={activeStatus.color}>
                                  {activeStatus.text}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {renderStars(organization.rating || 0)}
                                <p className="text-xs text-gray-600">
                                  {organization.ratingCount} đánh giá
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center text-sm">
                                  <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                                  {organization.totalEvents} sự kiện
                                </div>
                                <div className="flex items-center text-sm">
                                  <Users className="w-3 h-3 mr-1 text-gray-400" />
                                  {organization.totalVolunteers} TNV
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm text-gray-600">
                                {formatDate(organization.createdAt || "")}
                              </p>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link
                                    to={`/organization/profile?id=${organization.organizationId}`}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Link>
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrganizationListPage;
