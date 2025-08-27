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
  Download,
  Eye,
  Share2,
  Calendar,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Search,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { certificateService } from "@/services/certificateService";
import type { CertificateViewModel } from "@/types/certificate";

// Mock current user - replace with actual auth context
const getCurrentUser = () => ({
  userId: 1,
  volunteerId: 123, // This should come from volunteer profile
  name: "John Doe",
});

export default function VolunteerCertificatesPage() {
  // State management
  const [certificates, setCertificates] = useState<CertificateViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);

  const currentUser = getCurrentUser();

  // Status configuration for UI
  const statusConfig = {
    Pending: {
      label: "Chờ phê duyệt",
      variant: "outline" as const,
      color: "text-yellow-600",
      icon: Clock,
      description: "Chứng chỉ đang chờ được phê duyệt",
    },
    Published: {
      label: "Đã xuất bản",
      variant: "default" as const,
      color: "text-green-600",
      icon: CheckCircle,
      description: "Chứng chỉ đã được xuất bản, có thể tải xuống",
    },
  };

  // Load volunteer's certificates using GET endpoint
  const loadCertificates = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await certificateService.getCertificates(
        currentPage,
        pageSize
      );

      setCertificates(response.items);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load certificates";
      setError(errorMessage);
      toast.error("Không thể tải danh sách chứng chỉ");
    } finally {
      setLoading(false);
    }
  };

  // Load certificates on component mount and when page changes
  useEffect(() => {
    loadCertificates();
  }, [currentPage, pageSize]);

  // Reset to first page when tab changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      loadCertificates();
    }
  }, [selectedTab]);

  // Filter certificates based on selected tab and search term (client-side)
  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.certificateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificateNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedTab === "all") return matchesSearch;
    return matchesSearch && cert.status === selectedTab;
  });

  // Calculate statistics - Note: These are only for current page, not total
  const getCertificateStats = () => {
    const total = totalCount || certificates.length;
    const published = certificates.filter(
      (c) => c.status === "Published"
    ).length;

    return { total, published };
  };

  const stats = getCertificateStats();

  // Handle certificate download
  const handleDownload = async (
    certificateId: number,
    certificateNumber: string
  ) => {
    try {
      const downloadResponse = await certificateService.downloadCertificate(
        certificateId
      );

      // Create download link
      const url = window.URL.createObjectURL(downloadResponse.fileContent);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadResponse.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Chứng chỉ đã được tải xuống thành công");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to download certificate";
      toast.error("Không thể tải chứng chỉ");
    }
  };

  // Handle certificate sharing (generate verification link)
  const handleShare = async (certificate: CertificateViewModel) => {
    try {
      // Create verification link - this should use actual domain
      const verificationLink = `${window.location.origin}/verify/${certificate.verificationCode}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(verificationLink);
      toast.success("Liên kết xác thực đã được sao chép");
    } catch (err) {
      toast.error("Không thể tạo liên kết chia sẻ");
    }
  };

  // Get certificate display status
  const getCertificateDisplayStatus = (cert: CertificateViewModel) => {
    return cert.status;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50">
          <Award className="h-8 w-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 text-transparent bg-clip-text" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Chứng chỉ của tôi
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Quản lý và tải xuống các chứng chỉ tình nguyện của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm chứng chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-slate-50/80 via-gray-50/80 to-zinc-50/80 dark:from-slate-950/50 dark:via-gray-950/50 dark:to-zinc-950/50 border-slate-200/50 dark:border-slate-800/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-slate-600 to-gray-600 dark:from-slate-400 dark:to-gray-400 bg-clip-text text-transparent">
              Tổng chứng chỉ
            </CardTitle>
            <Award className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-gray-700 dark:from-slate-300 dark:to-gray-300 bg-clip-text text-transparent">
              {stats.total}
            </div>
            <p className="text-xs text-muted-foreground">Tất cả chứng chỉ</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50/80 via-emerald-50/80 to-teal-50/80 dark:from-green-950/50 dark:via-emerald-950/50 dark:to-teal-950/50 border-green-200/50 dark:border-green-800/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Đã xuất bản
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              {stats.published}
            </div>
            <p className="text-xs text-muted-foreground">Chứng chỉ hợp lệ</p>
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
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-slate-100/80 via-gray-100/80 to-zinc-100/80 dark:from-slate-900/50 dark:via-gray-900/50 dark:to-zinc-900/50 border border-slate-200/50 dark:border-slate-800/50">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white transition-all duration-300"
          >
            Tất cả
          </TabsTrigger>
          <TabsTrigger
            value="Published"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white transition-all duration-300"
          >
            Đã xuất bản
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <Card className="bg-gradient-to-br from-slate-50/80 via-gray-50/80 to-zinc-50/80 dark:from-slate-950/50 dark:via-gray-950/50 dark:to-zinc-950/50 border-slate-200/50 dark:border-slate-800/50">
            <CardHeader className="bg-gradient-to-r from-blue-50/60 via-indigo-50/60 to-purple-50/60 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-t-lg border-b border-slate-200/50 dark:border-slate-800/50">
              <CardTitle className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                {selectedTab === "all"
                  ? "Tất cả chứng chỉ"
                  : statusConfig[selectedTab as keyof typeof statusConfig]
                      ?.label}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Danh sách chứng chỉ tình nguyện của bạn từ các hoạt động đã tham
                gia
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-gradient-to-br from-white/50 via-slate-50/50 to-gray-50/50 dark:from-slate-950/30 dark:via-gray-950/30 dark:to-zinc-950/30">
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Đang tải chứng chỉ...
                  </span>
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredCertificates.length === 0 && (
                <div className="text-center py-12">
                  <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchTerm
                      ? "Không tìm thấy chứng chỉ"
                      : "Chưa có chứng chỉ"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm
                      ? "Thử thay đổi từ khóa tìm kiếm"
                      : "Tham gia các hoạt động tình nguyện để nhận chứng chỉ"}
                  </p>
                  {!searchTerm && (
                    <Button variant="outline" asChild>
                      <a href="/volunteer/events">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Xem sự kiện
                      </a>
                    </Button>
                  )}
                </div>
              )}

              {/* Certificates Grid */}
              {!loading && filteredCertificates.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCertificates.map((certificate) => {
                    const displayStatus =
                      getCertificateDisplayStatus(certificate);
                    const statusInfo =
                      statusConfig[displayStatus as keyof typeof statusConfig];
                    const StatusIcon = statusInfo?.icon || Award;

                    return (
                      <Card
                        key={certificate.certificateId}
                        className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white/80 via-slate-50/80 to-gray-50/80 dark:from-slate-900/50 dark:via-gray-900/50 dark:to-zinc-900/50 border-slate-200/50 dark:border-slate-800/50"
                      >
                        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50/40 via-indigo-50/40 to-purple-50/40 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 rounded-t-lg border-b border-slate-200/30 dark:border-slate-800/30">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-1 bg-gradient-to-r from-slate-700 via-gray-700 to-zinc-700 dark:from-slate-300 dark:via-gray-300 dark:to-zinc-300 bg-clip-text text-transparent">
                                {certificate.certificateName}
                              </CardTitle>
                              <div className="flex items-center gap-2 mb-2">
                                <StatusIcon
                                  className={`h-4 w-4 ${statusInfo?.color}`}
                                />
                                <Badge
                                  variant={statusInfo?.variant}
                                  className="bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800 border-slate-200/50 dark:border-slate-700/50"
                                >
                                  {statusInfo?.label}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                            {certificate.description || statusInfo?.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4 bg-gradient-to-br from-white/60 via-slate-50/60 to-gray-50/60 dark:from-slate-950/40 dark:via-gray-950/40 dark:to-zinc-950/40">
                          {/* Certificate Details */}
                          <div className="space-y-2 text-sm">
                            {certificate.certificateNumber && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Mã số:</span>
                                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                  {certificate.certificateNumber}
                                </span>
                              </div>
                            )}

                            {certificate.issueDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>
                                  Ngày cấp:{" "}
                                  {new Date(
                                    certificate.issueDate
                                  ).toLocaleDateString("vi-VN")}
                                </span>
                              </div>
                            )}

                            {certificate.expiryDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>
                                  Hết hạn:{" "}
                                  {new Date(
                                    certificate.expiryDate
                                  ).toLocaleDateString("vi-VN")}
                                </span>
                              </div>
                            )}

                            {certificate.hoursCompleted && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>
                                  {certificate.hoursCompleted} giờ tình nguyện
                                </span>
                              </div>
                            )}

                            {certificate.performanceLevel && (
                              <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-gray-400" />
                                <span>
                                  Đánh giá: {certificate.performanceLevel}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            {displayStatus === "Published" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleDownload(
                                      certificate.certificateId,
                                      certificate.certificateNumber ||
                                        "certificate"
                                    )
                                  }
                                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 hover:from-blue-600 hover:to-indigo-600 dark:hover:from-blue-700 dark:hover:to-indigo-700 text-white border-0 transition-all duration-300"
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Tải xuống
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleShare(certificate)}
                                  className="flex-1 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/50 dark:to-slate-950/50 border-gray-200/50 dark:border-gray-800/50 hover:from-gray-100 hover:to-slate-100 dark:hover:from-gray-900/50 dark:hover:to-slate-900/50 text-gray-700 dark:text-gray-300 transition-all duration-300"
                                >
                                  <Share2 className="mr-2 h-4 w-4" />
                                  Chia sẻ
                                </Button>
                              </>
                            )}

                            {displayStatus === "Pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled
                                className="flex-1 bg-gradient-to-r from-yellow-50/50 to-amber-50/50 dark:from-yellow-950/30 dark:to-amber-950/30 border-yellow-200/50 dark:border-yellow-800/50 text-yellow-600 dark:text-yellow-400 transition-all duration-300"
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                Chờ phê duyệt
                              </Button>
                            )}
                          </div>

                          {/* Additional Info */}
                          {certificate.downloadCount &&
                            certificate.downloadCount > 0 && (
                              <div className="text-xs text-gray-500 border-t pt-2">
                                Đã tải xuống {certificate.downloadCount} lần
                                {certificate.lastDownloadDate && (
                                  <span>
                                    {" "}
                                    • Lần cuối:{" "}
                                    {new Date(
                                      certificate.lastDownloadDate
                                    ).toLocaleDateString("vi-VN")}
                                  </span>
                                )}
                              </div>
                            )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {!loading && certificates.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Trang {currentPage} / {totalPages}
                    {totalCount > 0 && ` (Tổng cộng ${totalCount} chứng chỉ)`}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1 || loading}
                    >
                      Trước
                    </Button>
                    <span className="flex items-center px-3 text-sm">
                      Trang {currentPage}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={currentPage >= totalPages || loading}
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
