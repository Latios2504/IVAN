import { useState, useEffect } from "react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { certificateService } from "@/services/certificateService";
import type { Certificate, CertificateStatus } from "@/types/certificate";

export default function CertificateManagementPage() {
  // State management
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  // Status configuration for UI
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

  // Load certificates from API
  const loadCertificates = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await certificateService.getList(currentPage, pageSize);
      setCertificates(response.items);
      setTotalPages(response.totalPages);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load certificates";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load certificates on component mount and when page changes
  useEffect(() => {
    loadCertificates();
  }, [currentPage, pageSize]);

  // Filter certificates based on selected tab and search term
  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.certificateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.verificationCode.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedTab === "all") return matchesSearch;
    return matchesSearch && cert.status === selectedTab;
  });

  // Calculate statistics
  const getCertificateStats = () => {
    const total = certificates.length;
    const issued = certificates.filter((c) => c.status === "issued").length;
    const pending = certificates.filter((c) => c.status === "pending").length;
    const totalDownloads = certificates.reduce(
      (sum, c) => sum + (c.downloadCount || 0),
      0
    );

    return { total, issued, pending, totalDownloads };
  };

  const stats = getCertificateStats();

  // Handle certificate download
  const handleDownload = async (
    certificateId: number,
    certificateNumber: string
  ) => {
    try {
      await certificateService.downloadAsFile(
        certificateId,
        `certificate_${certificateNumber}.pdf`
      );
      toast.success("Certificate downloaded successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to download certificate";
      toast.error(errorMessage);
    }
  };

  // Handle certificate approval
  const handleApprove = async (certificateId: number) => {
    try {
      await certificateService.approve({
        certificateId,
        approvalNotes: "Approved via management interface",
      });
      toast.success("Certificate approved successfully");
      loadCertificates(); // Reload to get updated data
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to approve certificate";
      toast.error(errorMessage);
    }
  };

  // Handle certificate rejection
  const handleReject = async (certificateId: number) => {
    try {
      await certificateService.reject({
        certificateId,
        rejectionReason: "Rejected via management interface",
      });
      toast.success("Certificate rejected successfully");
      loadCertificates(); // Reload to get updated data
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reject certificate";
      toast.error(errorMessage);
    }
  };

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

      {/* Error State */}
      {error && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={loadCertificates}
                className="ml-auto"
              >
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Đang tải...
                  </span>
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredCertificates.length === 0 && (
                <div className="text-center py-12">
                  <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Không tìm thấy chứng chỉ
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm
                      ? "Thử thay đổi từ khóa tìm kiếm"
                      : "Chưa có chứng chỉ nào được tạo"}
                  </p>
                </div>
              )}

              {/* Certificates List */}
              {!loading && filteredCertificates.length > 0 && (
                <div className="space-y-4">
                  {filteredCertificates.map((certificate) => (
                    <div
                      key={certificate.certificateId}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold mb-1">
                                {certificate.certificateName}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {certificate.description}
                              </p>
                            </div>
                            <Badge
                              variant={
                                statusConfig[
                                  certificate.status as keyof typeof statusConfig
                                ]?.variant || "outline"
                              }
                            >
                              {statusConfig[
                                certificate.status as keyof typeof statusConfig
                              ]?.label || certificate.status}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              Volunteer ID: {certificate.volunteerId}
                            </div>
                            {certificate.issueDate && (
                              <div>
                                Ngày cấp:{" "}
                                {new Date(
                                  certificate.issueDate
                                ).toLocaleDateString("vi-VN")}
                              </div>
                            )}
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
                            <div>{certificate.downloadCount || 0} lượt tải</div>
                          </div>

                          <div className="flex flex-wrap gap-2">
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
                              to={`/organization/certificates/${certificate.certificateId}`}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </Link>
                          </Button>

                          {certificate.status === "issued" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDownload(
                                  certificate.certificateId,
                                  certificate.certificateNumber
                                )
                              }
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Tải xuống
                            </Button>
                          )}

                          {(certificate.status === "draft" ||
                            certificate.status === "pending") && (
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                to={`/organization/certificates/${certificate.certificateId}/edit`}
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
                              onClick={() =>
                                handleApprove(certificate.certificateId)
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Phê duyệt
                            </Button>
                          )}

                          {certificate.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() =>
                                handleReject(certificate.certificateId)
                              }
                            >
                              Thu hồi
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading &&
                filteredCertificates.length > 0 &&
                totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      Trang {currentPage} / {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Trước
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        Sau
                      </Button>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
