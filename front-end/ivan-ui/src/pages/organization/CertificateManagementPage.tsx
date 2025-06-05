import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

// Mock data for certificates
const mockCertificates = [
  {
    id: "cert_001",
    title: "Tình nguyện viên xuất sắc 2024",
    description:
      "Chứng nhận cho tình nguyện viên hoàn thành xuất sắc 50+ giờ hoạt động tình nguyện",
    category: "Thành tích",
    recipientName: "Nguyễn Thị Mai",
    recipientEmail: "mai.nguyen@email.com",
    issuedDate: "2024-06-10",
    expiryDate: null,
    status: "issued",
    template: "excellence_template",
    certificateNumber: "IV-EXC-2024-001",
    verificationCode: "VER123456",
    issuedBy: "Nguyễn Văn Admin",
    downloadCount: 5,
  },
  {
    id: "cert_002",
    title: "Hoàn thành khóa đào tạo sơ cấp cứu",
    description: "Chứng nhận hoàn thành khóa đào tạo sơ cấp cứu y tế cơ bản",
    category: "Đào tạo",
    recipientName: "Trần Văn Hùng",
    recipientEmail: "hung.tran@email.com",
    issuedDate: "2024-05-20",
    expiryDate: "2026-05-20",
    status: "issued",
    template: "training_template",
    certificateNumber: "IV-TRA-2024-002",
    verificationCode: "VER789012",
    issuedBy: "Lê Thị Coordinator",
    downloadCount: 3,
  },
  {
    id: "cert_003",
    title: "Tham gia sự kiện giáo dục trẻ em",
    description:
      "Chứng nhận tham gia và hoàn thành sự kiện giáo dục trẻ em vùng cao",
    category: "Tham gia",
    recipientName: "Phạm Minh Tuấn",
    recipientEmail: "tuan.pham@email.com",
    issuedDate: "2024-06-15",
    expiryDate: null,
    status: "pending",
    template: "participation_template",
    certificateNumber: "IV-PAR-2024-003",
    verificationCode: "",
    issuedBy: "Nguyễn Văn Admin",
    downloadCount: 0,
  },
  {
    id: "cert_004",
    title: "Chứng chỉ kỹ năng giao tiếp",
    description:
      "Hoàn thành khóa đào tạo kỹ năng giao tiếp và tương tác với trẻ em",
    category: "Đào tạo",
    recipientName: "Lê Thị Hương",
    recipientEmail: "huong.le@email.com",
    issuedDate: "2024-04-25",
    expiryDate: "2025-04-25",
    status: "revoked",
    template: "training_template",
    certificateNumber: "IV-TRA-2024-004",
    verificationCode: "VER345678",
    issuedBy: "Trần Thị Manager",
    downloadCount: 2,
  },
  {
    id: "cert_005",
    title: "Tình nguyện viên tích cực",
    description: "Ghi nhận đóng góp tích cực trong các hoạt động tình nguyện",
    category: "Thành tích",
    recipientName: "Vũ Thị Lan",
    recipientEmail: "lan.vu@email.com",
    issuedDate: "2024-06-01",
    expiryDate: null,
    status: "draft",
    template: "achievement_template",
    certificateNumber: "",
    verificationCode: "",
    issuedBy: "",
    downloadCount: 0,
  },
];

const statusConfig = {
  draft: {
    label: "Bản nháp",
    variant: "outline" as const,
    color: "text-gray-600",
  },
  pending: {
    label: "Chờ phê duyệt",
    variant: "outline" as const,
    color: "text-yellow-600",
  },
  issued: {
    label: "Đã cấp",
    variant: "default" as const,
    color: "text-green-600",
  },
  revoked: {
    label: "Đã thu hồi",
    variant: "destructive" as const,
    color: "text-red-600",
  },
};

const categoryConfig = {
  "Thành tích": { color: "bg-green-100 text-green-800" },
  "Đào tạo": { color: "bg-blue-100 text-blue-800" },
  "Tham gia": { color: "bg-purple-100 text-purple-800" },
};

export default function CertificateManagementPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCertificates = mockCertificates.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedTab === "all") return matchesSearch;
    return matchesSearch && cert.status === selectedTab;
  });

  const getCertificateStats = () => {
    const total = mockCertificates.length;
    const issued = mockCertificates.filter((c) => c.status === "issued").length;
    const pending = mockCertificates.filter(
      (c) => c.status === "pending"
    ).length;
    const totalDownloads = mockCertificates.reduce(
      (sum, c) => sum + c.downloadCount,
      0
    );

    return { total, issued, pending, totalDownloads };
  };

  const stats = getCertificateStats();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý Chứng chỉ
          </h1>
          <p className="text-gray-600">
            Tạo, cấp phát và quản lý chứng chỉ cho tình nguyện viên
          </p>
        </div>
        <Button className="mt-4 md:mt-0" asChild>
          <Link to="/organization/certificates/create">
            <Plus className="mr-2 h-4 w-4" />
            Tạo chứng chỉ mới
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo tên, người nhận hoặc mã số..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng chứng chỉ
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Tất cả chứng chỉ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã cấp</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.issued}
            </div>
            <p className="text-xs text-muted-foreground">Chứng chỉ hợp lệ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ phê duyệt</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">Cần xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt tải</CardTitle>
            <Download className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalDownloads}
            </div>
            <p className="text-xs text-muted-foreground">Tổng download</p>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="draft">Bản nháp</TabsTrigger>
          <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
          <TabsTrigger value="issued">Đã cấp</TabsTrigger>
          <TabsTrigger value="revoked">Đã thu hồi</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {selectedTab === "all"
                      ? "Tất cả chứng chỉ"
                      : statusConfig[selectedTab as keyof typeof statusConfig]
                          ?.label}
                  </CardTitle>
                  <CardDescription>
                    Quản lý và theo dõi chứng chỉ đã cấp cho tình nguyện viên
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Lọc
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCertificates.map((certificate) => (
                  <div
                    key={certificate.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">
                              {certificate.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {certificate.description}
                            </p>
                          </div>
                          <Badge
                            variant={
                              statusConfig[
                                certificate.status as keyof typeof statusConfig
                              ].variant
                            }
                          >
                            {
                              statusConfig[
                                certificate.status as keyof typeof statusConfig
                              ].label
                            }
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {certificate.recipientName}
                          </div>
                          <div>
                            Ngày cấp:{" "}
                            {new Date(
                              certificate.issuedDate
                            ).toLocaleDateString("vi-VN")}
                          </div>
                          {certificate.expiryDate && (
                            <div>
                              Hết hạn:{" "}
                              {new Date(
                                certificate.expiryDate
                              ).toLocaleDateString("vi-VN")}
                            </div>
                          )}
                          {certificate.certificateNumber && (
                            <div>Mã số: {certificate.certificateNumber}</div>
                          )}
                          <div>{certificate.downloadCount} lượt tải</div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge
                            className={
                              categoryConfig[
                                certificate.category as keyof typeof categoryConfig
                              ]?.color
                            }
                          >
                            {certificate.category}
                          </Badge>
                          {certificate.issuedBy && (
                            <Badge variant="outline">
                              Cấp bởi: {certificate.issuedBy}
                            </Badge>
                          )}
                          {certificate.verificationCode && (
                            <Badge variant="outline">
                              Mã xác thực: {certificate.verificationCode}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            to={`/organization/certificates/${certificate.id}`}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Link>
                        </Button>

                        {certificate.status === "issued" && (
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Tải xuống
                          </Button>
                        )}

                        {(certificate.status === "draft" ||
                          certificate.status === "pending") && (
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              to={`/organization/certificates/${certificate.id}/edit`}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </Link>
                          </Button>
                        )}

                        {certificate.status === "pending" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Phê duyệt
                          </Button>
                        )}

                        {certificate.status === "issued" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            Thu hồi
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCertificates.length === 0 && (
                <div className="text-center py-12">
                  <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Không tìm thấy chứng chỉ
                  </h3>
                  <p className="text-gray-600">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
