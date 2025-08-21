import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Eye,
  FileText,
  Calendar,
  User,
  Building,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { certificateTemplateService } from "@/services/certificateTemplateService";
import type { CertificateTemplateViewModel } from "@/types/certificate";

interface PreviewCertificateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: number | null;
}

export default function PreviewCertificateTemplateModal({
  open,
  onOpenChange,
  templateId,
}: PreviewCertificateTemplateModalProps) {
  // Parse required fields (if stored as JSON string)
  const parseRequiredFields = (requiredFields?: string): string[] => {
    if (!requiredFields) return [];

    try {
      const parsed = JSON.parse(requiredFields);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // If not JSON, treat as comma-separated string
      return requiredFields
        .split(",")
        .map((field) => field.trim())
        .filter((field) => field.length > 0);
    }
  };

  // Common required fields
  const getCommonRequiredFields = () => [
    { value: "volunteerName", label: "Tên tình nguyện viên" },
    { value: "eventName", label: "Tên sự kiện" },
    { value: "organizationName", label: "Tên tổ chức" },
    { value: "issueDate", label: "Ngày cấp" },
    { value: "expiryDate", label: "Ngày hết hạn" },
    { value: "hoursCompleted", label: "Số giờ hoàn thành" },
    { value: "performanceLevel", label: "Mức độ hiệu suất" },
    { value: "certificateNumber", label: "Số chứng chỉ" },
    { value: "verificationCode", label: "Mã xác thực" },
    { value: "description", label: "Mô tả" },
  ];
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState<CertificateTemplateViewModel | null>(
    null
  );

  // Load template data when modal opens
  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId || !open) return;

      try {
        setLoading(true);
        const templateData =
          await certificateTemplateService.getCertificateTemplateById(
            templateId
          );
        setTemplate(templateData);
      } catch (error) {
        toast.error("Không thể tải thông tin mẫu chứng chỉ");
        onOpenChange(false);
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [templateId, open, onOpenChange]);

  // Get template type display info
  const getTemplateTypeInfo = (templateType?: string) => {
    const types = {
      Participation: { label: "Tham gia", color: "bg-blue-100 text-blue-800" },
      Achievement: {
        label: "Thành tích",
        color: "bg-green-100 text-green-800",
      },
      Completion: {
        label: "Hoàn thành",
        color: "bg-purple-100 text-purple-800",
      },
      Recognition: {
        label: "Ghi nhận",
        color: "bg-orange-100 text-orange-800",
      },
      Custom: { label: "Tùy chỉnh", color: "bg-gray-100 text-gray-800" },
    };

    return (
      types[templateType as keyof typeof types] || {
        label: templateType || "Không xác định",
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  // Parse required fields
  const requiredFields = template?.requiredFields
    ? parseRequiredFields(template.requiredFields)
    : [];

  // Mock certificate preview data
  const mockCertificateData = {
    volunteerName: "Nguyễn Văn A",
    eventName: "Chương trình tình nguyện mùa hè 2024",
    organizationName: "Tổ chức Tình nguyện IVAN",
    issueDate: new Date().toLocaleDateString("vi-VN"),
    certificateNumber: "CERT-2024-001",
    hoursCompleted: "40",
    performanceLevel: "Xuất sắc",
    description: "Đã hoàn thành xuất sắc các hoạt động tình nguyện",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800 shadow-xl">
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 -m-6 mb-6 p-6 rounded-t-lg border-b border-blue-200 dark:border-blue-700">
          <DialogTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-bold">
            <Eye className="h-5 w-5 text-blue-600" />
            Xem trước Mẫu Chứng chỉ
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Xem trước thiết kế và thông tin của mẫu chứng chỉ
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Đang tải...</span>
          </div>
        ) : template ? (
          <div className="space-y-6">
            {/* Template Information */}
            <Card className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border border-blue-200 dark:border-blue-700 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-b border-blue-200 dark:border-blue-700">
                <CardTitle className="flex items-center justify-between text-gray-800 dark:text-gray-200">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Thông tin mẫu
                  </span>
                  <div className="flex items-center gap-2">
                    {template.templateType && (
                      <Badge
                        className={
                          getTemplateTypeInfo(template.templateType).color
                        }
                      >
                        {getTemplateTypeInfo(template.templateType).label}
                      </Badge>
                    )}
                    {template.isDefault && (
                      <Badge variant="outline">Hệ thống</Badge>
                    )}
                    {template.isActive ? (
                      <Badge className="bg-green-100 text-green-800">
                        Hoạt động
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Tạm dừng</Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800/50 dark:to-blue-900/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Tên mẫu
                    </h4>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      {template.templateName}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Loại mẫu
                    </h4>
                    <p>{getTemplateTypeInfo(template.templateType).label}</p>
                  </div>
                  {template.createdAt && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 mb-1">
                        Ngày tạo
                      </h4>
                      <p className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(template.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  )}
                  {template.updatedAt && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 mb-1">
                        Cập nhật cuối
                      </h4>
                      <p className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(template.updatedAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {template.description && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Mô tả
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">{template.description}</p>
                  </div>
                )}

                {/* Required Fields */}
                {requiredFields.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Trường bắt buộc
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {requiredFields.map((field) => {
                        const fieldInfo = getCommonRequiredFields().find(
                          (f) => f.value === field
                        );
                        return (
                          <Badge key={field} variant="secondary" className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                            {fieldInfo?.label || field}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Separator />

            {/* Certificate Preview */}
            <Card className="bg-gradient-to-r from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 border border-purple-200 dark:border-purple-700 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-b border-purple-200 dark:border-purple-700">
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                  <Award className="h-5 w-5 text-purple-600" />
                  Xem trước Chứng chỉ
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Đây là cách chứng chỉ sẽ hiển thị với dữ liệu mẫu
                </p>
              </CardHeader>
              <CardContent>
                {template.templateDesign ? (
                  <div className="border rounded-lg p-6 bg-white">
                    {/* Custom Template Design */}
                    <div
                      className="certificate-preview"
                      dangerouslySetInnerHTML={{
                        __html: template.templateDesign
                          .replace(
                            /\{\{volunteerName\}\}/g,
                            mockCertificateData.volunteerName
                          )
                          .replace(
                            /\{\{eventName\}\}/g,
                            mockCertificateData.eventName
                          )
                          .replace(
                            /\{\{organizationName\}\}/g,
                            mockCertificateData.organizationName
                          )
                          .replace(
                            /\{\{issueDate\}\}/g,
                            mockCertificateData.issueDate
                          )
                          .replace(
                            /\{\{certificateNumber\}\}/g,
                            mockCertificateData.certificateNumber
                          )
                          .replace(
                            /\{\{hoursCompleted\}\}/g,
                            mockCertificateData.hoursCompleted
                          )
                          .replace(
                            /\{\{performanceLevel\}\}/g,
                            mockCertificateData.performanceLevel
                          )
                          .replace(
                            /\{\{description\}\}/g,
                            mockCertificateData.description
                          ),
                      }}
                    />
                  </div>
                ) : (
                  /* Default Template Preview */
                  <div className="border rounded-lg p-8 bg-gradient-to-br from-blue-50 to-purple-50 text-center">
                    <div className="max-w-2xl mx-auto space-y-6">
                      {/* Header */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-blue-600">
                          <Building className="h-6 w-6" />
                          <h2 className="text-xl font-bold">
                            {mockCertificateData.organizationName}
                          </h2>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">
                          CHỨNG NHẬN
                        </h1>
                        <p className="text-lg text-gray-600">
                          {template.templateName}
                        </p>
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        <p className="text-lg">Chứng nhận rằng</p>

                        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-blue-600">
                          <User className="h-6 w-6" />
                          {mockCertificateData.volunteerName}
                        </div>

                        <p className="text-lg">
                          Đã tham gia thành công chương trình
                        </p>

                        <p className="text-xl font-semibold text-purple-600">
                          {mockCertificateData.eventName}
                        </p>

                        {requiredFields.includes("hoursCompleted") && (
                          <p className="text-base">
                            Với tổng số giờ tham gia:{" "}
                            <span className="font-semibold">
                              {mockCertificateData.hoursCompleted} giờ
                            </span>
                          </p>
                        )}

                        {requiredFields.includes("performanceLevel") && (
                          <p className="text-base">
                            Đánh giá:{" "}
                            <span className="font-semibold text-green-600">
                              {mockCertificateData.performanceLevel}
                            </span>
                          </p>
                        )}

                        {template.description && (
                          <p className="text-base italic">
                            {template.description}
                          </p>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-end pt-8">
                        <div className="text-left">
                          <p className="text-sm text-gray-600">Ngày cấp</p>
                          <p className="font-semibold">
                            {mockCertificateData.issueDate}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Số chứng chỉ</p>
                          <p className="font-mono text-sm">
                            {mockCertificateData.certificateNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Design Code (if available) */}
            {template.templateDesign && (
              <Card className="bg-gradient-to-r from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border border-green-200 dark:border-green-700 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-b border-green-200 dark:border-green-700">
                  <CardTitle className="text-gray-800 dark:text-gray-200">Mã thiết kế</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    HTML/CSS được sử dụng để tạo ra mẫu chứng chỉ này
                  </p>
                </CardHeader>
                <CardContent className="bg-gradient-to-br from-white to-green-50/50 dark:from-gray-800/50 dark:to-green-900/10">
                  <pre className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg text-sm font-mono overflow-x-auto max-h-60 border border-gray-200 dark:border-gray-600 shadow-inner">
                    <code className="text-gray-800 dark:text-gray-200">{template.templateDesign}</code>
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Không thể tải thông tin mẫu chứng chỉ
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
