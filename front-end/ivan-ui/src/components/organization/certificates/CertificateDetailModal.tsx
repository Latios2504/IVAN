import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Award,
  Calendar,
  FileText,
  Download,
  QrCode,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { certificateService } from "@/services/certificateService";
import CertificateStatusBadge from "./CertificateStatusBadge";
import type { CertificateViewModel } from "@/types/certificate";
import { toast } from "sonner";

interface CertificateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificateId: number | null;
}

export default function CertificateDetailModal({
  isOpen,
  onClose,
  certificateId,
}: CertificateDetailModalProps) {
  const [certificate, setCertificate] = useState<CertificateViewModel | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificateDetails = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await certificateService.getCertificateById(id);
      setCertificate(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Không thể tải thông tin chứng chỉ";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && certificateId) {
      fetchCertificateDetails(certificateId);
    }
  }, [isOpen, certificateId]);

  const handleDownload = async () => {
    if (!certificate) return;

    try {
      await certificateService.downloadCertificateFile(
        certificate.certificateId
      );
      toast.success("Tải xuống chứng chỉ thành công");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Không thể tải xuống chứng chỉ";
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="!max-w-none !w-[90vw] max-h-[95vh] overflow-y-auto overflow-x-hidden p-0"
        style={{ width: "90vw", maxWidth: "none" }}
      >
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="h-6 w-6 text-blue-600" />
            Chi tiết chứng chỉ
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-1">
            Thông tin chi tiết về chứng chỉ được cấp
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Đang tải thông tin...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-medium">Có lỗi xảy ra</p>
                <p className="text-gray-600 text-sm mt-1">{error}</p>
                <Button
                  variant="outline"
                  onClick={() =>
                    certificateId && fetchCertificateDetails(certificateId)
                  }
                  className="mt-4"
                >
                  Thử lại
                </Button>
              </div>
            </div>
          )}

          {certificate && !loading && !error && (
            <div className="space-y-6">
              {/* Header Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {certificate.certificateName}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">
                        #{certificate.certificateNumber}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CertificateStatusBadge status={certificate.status} />
                    </div>
                  </div>
                </CardHeader>
                {certificate.description && (
                  <CardContent>
                    <p className="text-gray-700">{certificate.description}</p>
                  </CardContent>
                )}
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Thông tin cơ bản
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          ID Tình nguyện viên
                        </label>
                        <p className="text-gray-900">
                          {certificate.volunteerId}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          ID Sự kiện
                        </label>
                        <p className="text-gray-900">{certificate.eventId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          ID Template
                        </label>
                        <p className="text-gray-900">
                          {certificate.templateId}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Số giờ hoàn thành
                        </label>
                        <p className="text-gray-900">
                          {certificate.hoursCompleted || "Chưa có"}
                        </p>
                      </div>
                    </div>

                    {certificate.performanceLevel && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Mức độ thành tích
                        </label>
                        <p className="text-gray-900">
                          {certificate.performanceLevel}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Date Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Thông tin ngày tháng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Ngày cấp
                      </label>
                      <p className="text-gray-900">
                        {formatDate(certificate.issueDate)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Ngày hết hạn
                      </label>
                      <p className="text-gray-900">
                        {formatDate(certificate.expiryDate)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Ngày tạo
                      </label>
                      <p className="text-gray-900">
                        {formatDate(certificate.createdAt)}
                      </p>
                    </div>
                    {certificate.lastDownloadDate && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Lần tải cuối
                        </label>
                        <p className="text-gray-900">
                          {formatDate(certificate.lastDownloadDate)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Verification & Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Xác thực & Bảo mật
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Mã xác thực
                      </label>
                      <p className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                        {certificate.verificationCode}
                      </p>
                    </div>
                    {certificate.digitalSignature && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Chữ ký số
                        </label>
                        <p className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded text-sm truncate">
                          {certificate.digitalSignature}
                        </p>
                      </div>
                    )}
                    {certificate.qrcodeUrl && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          QR Code URL
                        </label>
                        <p className="text-gray-900 text-sm truncate">
                          {certificate.qrcodeUrl}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Số lần tải xuống
                      </label>
                      <p className="text-gray-900">
                        {certificate.downloadCount || 0} lần
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {certificate.status === "issued" &&
                  certificate.certificateFileUrl && (
                    <Button
                      onClick={handleDownload}
                      className="flex-1 sm:flex-none"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Tải xuống chứng chỉ
                    </Button>
                  )}

                {certificate.qrcodeUrl && (
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <QrCode className="mr-2 h-4 w-4" />
                    Xem QR Code
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 sm:flex-none"
                >
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
