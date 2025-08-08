import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Loader2, ArrowLeft, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { certificateService } from "@/services/certificateService";
import { certificateTemplateService } from "@/services/certificateTemplateService";
import type { CertificateTemplate } from "@/types/certificate";

// Form validation schema
const createCertificateSchema = z.object({
  certificateName: z.string().min(1, "Certificate name is required"),
  description: z.string().optional(),
  volunteerId: z.coerce.number().min(1, "Please enter a valid volunteer ID"),
  eventId: z.coerce.number().min(1, "Please enter a valid event ID"),
  templateId: z.coerce.number().min(1, "Please select a template"),
  performanceLevel: z.string().optional(),
  expiryDate: z.string().optional(),
  notes: z.string().optional(),
});

type CreateCertificateFormData = z.infer<typeof createCertificateSchema>;

export default function CreateCertificatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  const form = useForm<CreateCertificateFormData>({
    resolver: zodResolver(createCertificateSchema),
    defaultValues: {
      certificateName: "",
      description: "",
      volunteerId: 0,
      eventId: 0,
      templateId: 0,
      performanceLevel: "",
      expiryDate: "",
      notes: "",
    },
  });

  // Load templates on component mount
  useEffect(() => {
    loadTemplates();
  }, []);

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

  const onSubmit = async (
    data: CreateCertificateFormData,
    status: "draft" | "pending"
  ) => {
    try {
      setLoading(true);

      // Create certificate number and verification code automatically
      const timestamp = Date.now();
      const certificateNumber = `CERT-${timestamp}`;
      const verificationCode = `VERIFY-${timestamp}`;

      const createRequest = {
        volunteerId: data.volunteerId,
        eventId: data.eventId,
        templateId: data.templateId,
        certificateNumber,
        certificateName: data.certificateName,
        description: data.description,
        performanceLevel: data.performanceLevel,
        verificationCode,
        expiryDate: data.expiryDate
          ? new Date(data.expiryDate).toISOString()
          : undefined,
        status,
        notes: data.notes,
      };

      const response = await certificateService.create(createRequest);

      toast.success("Certificate created successfully!");
      navigate(`/organization/certificates/${response.certificateId}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create certificate";
      toast.error(errorMessage);
      console.error("Failed to create certificate:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = (data: CreateCertificateFormData) => {
    onSubmit(data, "draft");
  };

  const handleSubmitForApproval = (data: CreateCertificateFormData) => {
    onSubmit(data, "pending");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tạo chứng chỉ mới
          </h1>
          <p className="text-gray-600">
            Tạo chứng chỉ mới cho tình nguyện viên
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chứng chỉ</CardTitle>
              <CardDescription>
                Điền thông tin cần thiết để tạo chứng chỉ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <div className="space-y-6">
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

                  {/* Volunteer ID */}
                  <FormField
                    control={form.control}
                    name="volunteerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID Tình nguyện viên *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập ID tình nguyện viên..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          ID của tình nguyện viên được cấp chứng chỉ
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Event ID */}
                  <FormField
                    control={form.control}
                    name="eventId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID Sự kiện *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập ID sự kiện..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          ID của sự kiện liên quan đến chứng chỉ
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Template Selection */}
                  <FormField
                    control={form.control}
                    name="templateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mẫu chứng chỉ *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          disabled={loadingTemplates}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn mẫu chứng chỉ..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {templates.map((template) => (
                              <SelectItem
                                key={template.templateId}
                                value={template.templateId.toString()}
                              >
                                {template.templateName}
                                {template.isActive && (
                                  <span className="ml-2 text-green-600">✓</span>
                                )}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Chọn mẫu thiết kế cho chứng chỉ
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
                        <Select onValueChange={field.onChange}>
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
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động</CardTitle>
              <CardDescription>
                Lưu làm bản nháp hoặc gửi phê duyệt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={form.handleSubmit(handleSaveAsDraft)}
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Lưu bản nháp
              </Button>

              <Button
                onClick={form.handleSubmit(handleSubmitForApproval)}
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
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card>
            <CardHeader>
              <CardTitle>Hướng dẫn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">Trạng thái chứng chỉ:</h4>
                <ul className="space-y-1">
                  <li>
                    • <strong>Bản nháp:</strong> Chưa hoàn thành
                  </li>
                  <li>
                    • <strong>Chờ duyệt:</strong> Đã gửi phê duyệt
                  </li>
                  <li>
                    • <strong>Đã cấp:</strong> Được phê duyệt và cấp
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Lưu ý:</h4>
                <ul className="space-y-1">
                  <li>• Các trường có dấu (*) là bắt buộc</li>
                  <li>• Chọn mẫu phù hợp với loại chứng chỉ</li>
                  <li>• Kiểm tra thông tin trước khi gửi phê duyệt</li>
                  <li>• Mã chứng chỉ sẽ được tạo tự động</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
