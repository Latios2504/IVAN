import { useState, useEffect, useCallback } from "react";
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
  CheckCircle,
  Clock,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";

import { certificateService } from "@/services/certificateService";
import type { CertificateViewModel } from "@/types/certificate";
import CertificateDetailModal from "@/components/organization/certificates/CertificateDetailModal";
import CreateCertificateModal from "@/components/organization/certificates/CreateCertificateModal";
import { StatsCard } from "@/components/common/StatsCard";
import { toast } from "sonner";

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function CertificateManagementPage() {
  // State management
  const [certificates, setCertificates] = useState<CertificateViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);

  // Modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCertificateId, setSelectedCertificateId] = useState<
    number | null
  >(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Status configuration for UI
  const statusConfig = {
    Draft: {
      label: "Bản nháp",
      variant: "outline" as const,
      color: "text-gray-600",
    },
    Pending: {
      label: "Chờ phê duyệt",
      variant: "outline" as const,
      color: "text-yellow-600",
    },
    Approved: {
      label: "Đã cấp",
      variant: "default" as const,
      color: "text-green-600",
    },
    Rejected: {
      label: "Bị từ chối",
      variant: "destructive" as const,
      color: "text-red-600",
    },
    Revoked: {
      label: "Đã thu hồi",
      variant: "destructive" as const,
      color: "text-red-600",
    },
  };

  // Load certificates from API using filter endpoint
  const loadCertificates = async () => {
    try {
      setLoading(true);

      // Use the filter endpoint instead of basic getCertificates
      const filterData = {
        pageNumber: currentPage,
        pageSize: pageSize,
        status: selectedTab === "all" ? undefined : selectedTab,
        searchTerm: searchTerm.trim() || undefined,
      };

      const response = await certificateService.getFilteredCertificates(
        filterData
      );
      setCertificates(response);
      // Note: The filtered endpoint returns array, not paged result
      // So we need to handle pagination differently or use a different endpoint
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load certificates";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce(() => {
      setCurrentPage(1); // Reset to first page when searching
      loadCertificates();
    }, 500),
    [selectedTab]
  );

  // Load certificates on component mount and when dependencies change
  useEffect(() => {
    loadCertificates();
  }, [currentPage, pageSize, selectedTab]);

  // Handle search term changes with debouncing
  useEffect(() => {
    if (searchTerm !== "") {
      debouncedSearch();
    } else {
      setCurrentPage(1);
      loadCertificates();
    }
  }, [searchTerm, debouncedSearch]);

  // No need for client-side filtering since we're using server-side filtering
  const filteredCertificates = certificates;

  // Calculate statistics - Note: These are only for current page, not total
  const getCertificateStats = () => {
    const total = totalCount || certificates.length;
    const approved = certificates.filter((c) => c.status === "Approved").length;
    const pending = certificates.filter((c) => c.status === "Pending").length;
    const totalDownloads = certificates.reduce(
      (sum, c) => sum + (c.downloadCount || 0),
      0
    );

    return { total, approved, pending, totalDownloads };
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

      // Certificate downloaded successfully
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to download certificate";
      toast.error(errorMessage);
    }
  };

  // Handle opening certificate detail modal
  const handleViewDetail = (certificateId: number) => {
    setSelectedCertificateId(certificateId);
    setIsDetailModalOpen(true);
  };

  // Handle closing certificate detail modal
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCertificateId(null);
  };

  // Handle opening create certificate modal
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  // Handle closing create certificate modal
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Handle successful certificate creation
  const handleCreateSuccess = () => {
    loadCertificates(); // Reload the list
  };

  // Handle certificate approval
  const handleApprove = async (certificateId: number) => {
    try {
      await certificateService.approveCertificate({
        certificateId,
        approvalNotes: "Approved via management interface",
        // approvedBy will be set by backend from JWT token
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
      await certificateService.rejectCertificate({
        certificateId,
        rejectionReason: "Rejected via management interface",
        // rejectedBy will be set by backend from JWT token
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
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950 dark:via-pink-950 dark:to-rose-950 rounded-xl border border-purple-200 dark:border-purple-800 shadow-lg backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 dark:from-purple-900 dark:via-pink-900 dark:to-rose-900 rounded-lg p-4 border border-purple-200 dark:border-purple-800 shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-2">
            Quản lý Chứng chỉ
          </h1>
          <p className="text-purple-700 dark:text-purple-300">
            Tạo, cấp phát và quản lý chứng chỉ cho tình nguyện viên
          </p>
        </div>
        <Button
          className="mt-4 md:mt-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
          onClick={handleOpenCreateModal}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tạo chứng chỉ mới
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800 shadow-md">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-500 dark:text-indigo-400" />
          <Input
            placeholder="Tìm kiếm theo tên, người nhận hoặc mã số..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-indigo-300 dark:border-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-400"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Tổng chứng chỉ"
          value={stats.total}
          description="Tất cả chứng chỉ"
          icon={Award}
        />
        <StatsCard
          title="Đã cấp"
          value={stats.approved}
          description="Chứng chỉ hợp lệ"
          icon={CheckCircle}
        />
        <StatsCard
          title="Chờ phê duyệt"
          value={stats.pending}
          description="Cần xử lý"
          icon={Clock}
        />
        <StatsCard
          title="Lượt tải"
          value={stats.totalDownloads}
          description="Tổng download"
          icon={Download}
        />
      </div>

      {/* Error handling now uses toast notifications */}

      {/* Certificates Tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-6 bg-gradient-to-r from-purple-100 via-violet-100 to-indigo-100 dark:from-purple-900 dark:via-violet-900 dark:to-indigo-900 border border-purple-200 dark:border-purple-800 shadow-md">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-500 data-[state=active]:text-white"
          >
            Tất cả
          </TabsTrigger>
          <TabsTrigger
            value="Draft"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-slate-500 data-[state=active]:text-white"
          >
            Bản nháp
          </TabsTrigger>
          <TabsTrigger
            value="Pending"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
          >
            Chờ duyệt
          </TabsTrigger>
          <TabsTrigger
            value="Approved"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
          >
            Đã cấp
          </TabsTrigger>
          <TabsTrigger
            value="Rejected"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-500 data-[state=active]:text-white"
          >
            Bị từ chối
          </TabsTrigger>
          <TabsTrigger
            value="Revoked"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
          >
            Đã thu hồi
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <Card className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950 dark:via-gray-950 dark:to-zinc-950 border border-slate-200 dark:border-slate-800 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-900 dark:to-gray-900 rounded-t-lg border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900 dark:text-slate-100">
                    {selectedTab === "all"
                      ? "Tất cả chứng chỉ"
                      : statusConfig[selectedTab as keyof typeof statusConfig]
                          ?.label}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Quản lý và theo dõi chứng chỉ đã cấp cho tình nguyện viên
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Lọc
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                  <span className="ml-2 text-blue-700 dark:text-blue-300">
                    Đang tải...
                  </span>
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredCertificates.length === 0 && (
                <div className="text-center py-12 bg-gradient-to-r from-gray-50 via-slate-50 to-zinc-50 dark:from-gray-950 dark:via-slate-950 dark:to-zinc-950 rounded-lg border border-gray-200 dark:border-gray-800">
                  <Award className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Không tìm thấy chứng chỉ
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
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
                      className="bg-gradient-to-r from-white via-gray-50 to-slate-50 dark:from-gray-900 dark:via-slate-900 dark:to-zinc-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200 shadow-md"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100">
                                {certificate.certificateName}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
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

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 px-2 py-1 rounded-md">
                              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <span className="text-blue-700 dark:text-blue-300">
                                Volunteer ID: {certificate.volunteerId}
                              </span>
                            </div>
                            {certificate.issueDate && (
                              <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 px-2 py-1 rounded-md text-green-700 dark:text-green-300">
                                Ngày cấp:{" "}
                                {new Date(
                                  certificate.issueDate
                                ).toLocaleDateString("vi-VN")}
                              </div>
                            )}
                            {certificate.expiryDate && (
                              <div className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900 px-2 py-1 rounded-md text-orange-700 dark:text-orange-300">
                                Hết hạn:{" "}
                                {new Date(
                                  certificate.expiryDate
                                ).toLocaleDateString("vi-VN")}
                              </div>
                            )}
                            {certificate.certificateNumber && (
                              <div className="bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900 dark:to-violet-900 px-2 py-1 rounded-md text-purple-700 dark:text-purple-300">
                                Mã số: {certificate.certificateNumber}
                              </div>
                            )}
                            <div className="bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900 px-2 py-1 rounded-md text-cyan-700 dark:text-cyan-300">
                              {certificate.downloadCount || 0} lượt tải
                            </div>
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleViewDetail(certificate.certificateId)
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Button>

                          {certificate.status === "Approved" && (
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

                          {certificate.status === "Pending" && (
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

                          {certificate.status === "Pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() =>
                                handleReject(certificate.certificateId)
                              }
                            >
                              Từ chối
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && filteredCertificates.length > 0 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Hiển thị {filteredCertificates.length} chứng chỉ
                    {totalCount > 0 && ` / Tổng cộng ${totalCount}`}
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
                      disabled={
                        filteredCertificates.length < pageSize || loading
                      }
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

      {/* Certificate Detail Modal */}
      <CertificateDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        certificateId={selectedCertificateId}
      />

      {/* Create Certificate Modal */}
      <CreateCertificateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
