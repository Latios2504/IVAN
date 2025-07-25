import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import type {
  PartnerProfileDataExtended,
  PartnerIndustry,
} from "@/types/profile/partner-profile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { LoadingWithRetry } from "@/components/ui/skeletons";
import {
  Building2,
  Search,
  Filter,
  Eye,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

// Sample data for demonstration
const mockPartners: PartnerProfileDataExtended[] = [
  {
    partnerId: 1,
    userId: 101,
    companyName: "ABC Technology Co., Ltd",
    industryId: 1,
    industryName: "Công nghệ",
    taxCode: "0123456789",
    businessLicense: "0123456789-001",
    website: "https://abctech.com",
    description:
      "Leading technology solutions provider specializing in software development and IT consulting services.",
    address: "123 Đường ABC",
    wardCommune: "Phường Đống Đa",
    district: "Quận Đống Đa",
    province: "Hà Nội",
    postalCode: "100000",
    contactPersonName: "Nguyễn Văn An",
    contactPersonTitle: "Partnership Manager",
    contactEmail: "an.nguyen@abctech.com",
    contactPhone: "+84 901 234 567",
    isVerified: true,
    verifiedAt: "2024-01-15T10:30:00Z",
    verifiedBy: 1,
    rating: 4.8,
    ratingCount: 25,
    totalCollaborations: 12,
    isActive: true,
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    partnerId: 2,
    userId: 102,
    companyName: "XYZ Foundation",
    industryId: 2,
    industryName: "Phi lợi nhuận",
    taxCode: "9876543210",
    businessLicense: "9876543210-002",
    website: "https://xyzfoundation.org",
    description:
      "Non-profit organization focused on education and community development initiatives.",
    address: "456 Đường XYZ",
    wardCommune: "Phường 1",
    district: "Quận 1",
    province: "TP. Hồ Chí Minh",
    postalCode: "700000",
    contactPersonName: "Trần Thị Bình",
    contactPersonTitle: "Program Director",
    contactEmail: "binh.tran@xyzfoundation.org",
    contactPhone: "+84 908 765 432",
    isVerified: false,
    rating: 4.5,
    ratingCount: 12,
    totalCollaborations: 5,
    isActive: true,
    createdAt: "2023-09-15T00:00:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
  },
];

const mockIndustries: PartnerIndustry[] = [
  { industryId: 1, industryName: "Công nghệ", isActive: true },
  { industryId: 2, industryName: "Phi lợi nhuận", isActive: true },
  { industryId: 3, industryName: "Y tế", isActive: true },
  { industryId: 4, industryName: "Giáo dục", isActive: true },
  { industryId: 5, industryName: "Tài chính", isActive: true },
];

export default function AdminPartnerListPage() {
  const { user } = useAuth();
  const [partners, setPartners] = useState<PartnerProfileDataExtended[]>([]);
  const [industries, setIndustries] = useState<PartnerIndustry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        setPartners(mockPartners);
        setIndustries(mockIndustries);
      } catch (error) {
        console.error("Error fetching partners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      partner.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.contactPersonName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase() || "") ||
      partner.contactEmail
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase() || "");

    const matchesVerification =
      verificationFilter === "all" ||
      (verificationFilter === "verified" && partner.isVerified) ||
      (verificationFilter === "pending" && !partner.isVerified);

    const matchesIndustry =
      industryFilter === "all" ||
      partner.industryId.toString() === industryFilter;

    const matchesActive =
      activeFilter === "all" ||
      (activeFilter === "active" && partner.isActive) ||
      (activeFilter === "inactive" && !partner.isActive);

    return (
      matchesSearch && matchesVerification && matchesIndustry && matchesActive
    );
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingWithRetry text="Đang tải danh sách đối tác..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý Đối tác
        </h1>
        <p className="text-gray-600">
          Quản lý và xem thông tin chi tiết của tất cả đối tác trong hệ thống
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đối tác</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partners.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xác minh</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {partners.filter((p) => p.isVerified).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ xác minh</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {partners.filter((p) => !p.isVerified).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoạt động</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {partners.filter((p) => p.isActive).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Tên đối tác, người liên hệ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="verification-filter">Xác minh</Label>
              <Select
                value={verificationFilter}
                onValueChange={setVerificationFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="verified">Đã xác minh</SelectItem>
                  <SelectItem value="pending">Chờ xác minh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="industry-filter">Ngành nghề</Label>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngành nghề" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả ngành nghề</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem
                      key={industry.industryId}
                      value={industry.industryId.toString()}
                    >
                      {industry.industryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="active-filter">Trạng thái</Label>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setVerificationFilter("all");
                  setIndustryFilter("all");
                  setActiveFilter("all");
                }}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partners List */}
      <div className="grid gap-6">
        {filteredPartners.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                Không tìm thấy đối tác nào phù hợp với bộ lọc.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPartners.map((partner) => (
            <Card
              key={partner.partnerId}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">
                        {partner.companyName}
                      </CardTitle>
                      <Badge
                        className={
                          partner.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {partner.isVerified ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Đã xác minh
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Chờ xác minh
                          </>
                        )}
                      </Badge>
                      {!partner.isActive && (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Không hoạt động
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mb-3">
                      {partner.description || "Chưa có mô tả"}
                    </CardDescription>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {partner.industryName || "Chưa xác định"}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {partner.province || "Chưa xác định"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Tham gia: {formatDate(partner.createdAt)}
                      </div>
                      {partner.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          {partner.rating}/5 ({partner.ratingCount} đánh giá)
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Link to={`/partner/profile?id=${partner.partnerId}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {partner.totalCollaborations || 0}
                    </div>
                    <div className="text-sm text-gray-600">Tổng hợp tác</div>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {partner.isVerified ? "Có" : "Không"}
                    </div>
                    <div className="text-sm text-gray-600">Xác minh</div>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {partner.isActive ? "Hoạt động" : "Tạm dừng"}
                    </div>
                    <div className="text-sm text-gray-600">Trạng thái</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {partner.contactEmail && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {partner.contactEmail}
                      </div>
                    )}
                    {partner.contactPhone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {partner.contactPhone}
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-500">
                    ID: {partner.partnerId}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
