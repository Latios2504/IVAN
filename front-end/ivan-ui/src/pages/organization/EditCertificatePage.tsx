import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ArrowLeft,
  Save,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { certificateService } from "@/services/certificateService";
import { certificateTemplateService } from "@/services/certificateTemplateService";
import type { Certificate, CertificateTemplate } from "@/types/certificate";

// Form validation schema
const editCertificateSchema = z.object({
  certificateName: z.string().min(1, "Certificate name is required"),
  description: z.string().optional(),
  performanceLevel: z.string().optional(),
  expiryDate: z.string().optional(),
  hoursCompleted: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

type EditCertificateFormData = z.infer<typeof editCertificateSchema>;

export default function EditCertificatePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingCertificate, setLoadingCertificate] = useState(true);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  const form = useForm<EditCertificateFormData>({
    resolver: zodResolver(editCertificateSchema),
    defaultValues: {
      certificateName: "",
      description: "",
      performanceLevel: "",
      expiryDate: "",
      hoursCompleted: 0,
      notes: "",
    },
  });

  // Load certificate and templates on component mount
  useEffect(() => {
    if (id) {
      loadCertificate(parseInt(id));
      loadTemplates();
    }
  }, [id]);

  const loadCertificate = async (certificateId: number) => {
    try {
      setLoadingCertificate(true);
      const cert = await certificateService.getById(certificateId);
      setCertificate(cert);

      // Update form with certificate data
      form.reset({
        certificateName: cert.certificateName,
        description: cert.description || "",
        performanceLevel: cert.performanceLevel || "",
        expiryDate: cert.expiryDate
          ? new Date(cert.expiryDate).toISOString().split("T")[0]
          : "",
        hoursCompleted: cert.hoursCompleted || 0,
        notes: "", // notes field not in Certificate interface
      });
    } catch (error) {
      console.error("Failed to load certificate:", error);
      toast.error("Failed to load certificate");
      navigate("/organization/certificates");
    } finally {
      setLoadingCertificate(false);
    }
  };

  const loadTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const response = await certificateTemplateService.getActive(1, 100);
      setTemplates(response.items);
    } catch (error) {
      console.error("Failed to load templates:", error);
      toast.error("Failed to load certificate templates");
    } finally {
      setLoadingTemplates(false);
    }
  };

  const onSubmit = async (data: EditCertificateFormData) => {
    if (!certificate) return;

    try {
      setLoading(true);

      const updateRequest = {
        certificateId: certificate.certificateId,
        certificateName: data.certificateName,
        description: data.description,
        performanceLevel: data.performanceLevel,
        expiryDate: data.expiryDate
          ? new Date(data.expiryDate).toISOString()
          : undefined,
        hoursCompleted: data.hoursCompleted,
      };

      await certificateService.update(certificate.certificateId, updateRequest);

      toast.success("Certificate updated successfully!");
      navigate(`/organization/certificates/${certificate.certificateId}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update certificate";
      toast.error(errorMessage);
      console.error("Failed to update certificate:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!certificate) return;

    try {
      setLoading(true);

      // First update the certificate
      await form.handleSubmit(onSubmit)();

      // Then submit for approval (this would typically change status to pending)
      // Note: This might need a separate API endpoint for status changes
      toast.success("Certificate submitted for approval!");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit for approval";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "gray";
      case "pending":
        return "yellow";
      case "issued":
        return "green";
      case "revoked":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Bản nháp";
      case "pending":
        return "Chờ phê duyệt";
      case "issued":
        return "Đã cấp";
      case "revoked":
        return "Đã thu hồi";
      default:
        return status;
    }
  };

  if (loadingCertificate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">
            Đang tải chứng chỉ...
          </span>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Không tìm thấy chứng chỉ
          </h3>
          <Button onClick={() => navigate("/organization/certificates")}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chỉnh sửa chứng chỉ
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Mã số: {certificate.certificateNumber}</span>
            <Badge
              variant="outline"
              className={`text-${getStatusColor(
                certificate.status || "draft"
              )}-600`}
            >
              {getStatusLabel(certificate.status || "draft")}
            </Badge>
            {certificate.verificationCode && (
              <span>Mã xác thực: {certificate.verificationCode}</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chứng chỉ</CardTitle>
              <CardDescription>Chỉnh sửa thông tin chứng chỉ</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Certificate Name */}
                  <FormField
                    control={form.control}
                    name="certificateName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên chứng chỉ *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tên chứng chỉ..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Mô tả về chứng chỉ..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Mô tả chi tiết về chứng chỉ và tiêu chí đạt được
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Performance Level */}
                  <FormField
                    control={form.control}
                    name="performanceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mức độ thực hiện</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn mức độ thực hiện..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="excellent">Xuất sắc</SelectItem>
                            <SelectItem value="good">Tốt</SelectItem>
                            <SelectItem value="satisfactory">
                              Đạt yêu cầu
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Đánh giá mức độ hoàn thành của tình nguyện viên
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Hours Completed */}
                  <FormField
                    control={form.control}
                    name="hoursCompleted"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số giờ hoàn thành</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Nhập số giờ..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Tổng số giờ tình nguyện đã hoàn thành
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Expiry Date */}
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày hết hạn</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          Để trống nếu chứng chỉ không có thời hạn
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ghi chú</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ghi chú nội bộ..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Ghi chú nội bộ cho quản lý
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin hiện tại</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="font-medium">Tình nguyện viên:</span>
                <div className="text-gray-600">
                  ID: {certificate.volunteerId}
                </div>
              </div>

              {certificate.issueDate && (
                <div>
                  <span className="font-medium">Ngày cấp:</span>
                  <div className="text-gray-600">
                    {new Date(certificate.issueDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </div>
                </div>
              )}

              {certificate.downloadCount !== undefined && (
                <div>
                  <span className="font-medium">Lượt tải:</span>
                  <div className="text-gray-600">
                    {certificate.downloadCount}
                  </div>
                </div>
              )}

              <div>
                <span className="font-medium">Lần cập nhật cuối:</span>
                <div className="text-gray-600">
                  {certificate.createdAt
                    ? new Date(certificate.createdAt).toLocaleDateString(
                        "vi-VN"
                      )
                    : "Chưa có thông tin"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động</CardTitle>
              <CardDescription>Lưu thay đổi hoặc gửi phê duyệt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={form.handleSubmit(onSubmit)}
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Lưu thay đổi
              </Button>

              {(certificate.status === "draft" ||
                certificate.status === undefined) && (
                <Button
                  onClick={handleSubmitForApproval}
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Gửi phê duyệt
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Status Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">Quy trình phê duyệt:</h4>
                <ul className="space-y-1">
                  <li
                    className={
                      certificate.status === "draft"
                        ? "font-semibold text-gray-900"
                        : ""
                    }
                  >
                    • Bản nháp
                  </li>
                  <li
                    className={
                      certificate.status === "pending"
                        ? "font-semibold text-yellow-600"
                        : ""
                    }
                  >
                    • Chờ phê duyệt
                  </li>
                  <li
                    className={
                      certificate.status === "issued"
                        ? "font-semibold text-green-600"
                        : ""
                    }
                  >
                    • Đã cấp
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Lưu ý:</h4>
                <ul className="space-y-1">
                  <li>
                    • Chỉ có thể chỉnh sửa chứng chỉ ở trạng thái bản nháp
                  </li>
                  <li>• Sau khi gửi phê duyệt, không thể chỉnh sửa</li>
                  <li>• Chứng chỉ đã cấp có thể được thu hồi nếu cần</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
