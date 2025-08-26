import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Loader2, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { certificateService } from "@/services/certificateService";
import { certificateTemplateService } from "@/services/certificateTemplateService";
import CertificateStatusBadge from "./CertificateStatusBadge";
import type { CertificateTemplateViewModel } from "@/types/certificate";

// Form validation schema
const createCertificateSchema = z.object({
  certificateName: z.string().min(1, "Tên chứng chỉ là bắt buộc"),
  description: z.string().optional(),
  volunteerId: z.coerce
    .number()
    .min(1, "Vui lòng nhập ID tình nguyện viên hợp lệ"),
  eventId: z.coerce.number().min(1, "Vui lòng nhập ID sự kiện hợp lệ"),
  templateId: z.coerce.number().min(1, "Vui lòng chọn mẫu chứng chỉ"),
  performanceLevel: z.string().optional(),
  hoursCompleted: z.coerce.number().min(0).optional(),
  expiryDate: z.string().optional(),
});

type CreateCertificateFormData = z.infer<typeof createCertificateSchema>;

interface CreateCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateCertificateModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCertificateModalProps) {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<CertificateTemplateViewModel[]>(
    []
  );
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  const form = useForm<CreateCertificateFormData>({
    resolver: zodResolver(createCertificateSchema),
    defaultValues: {
      certificateName: "",
      description: "",
      volunteerId: 0,
      eventId: 0,
      templateId: 0,
      performanceLevel: "",
      hoursCompleted: 0,
      expiryDate: "",
    },
  });

  // Load templates when modal opens
  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const loadTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const response = await certificateTemplateService.getCertificateTemplates(
        1,
        100
      );
      setTemplates(response.items);
    } catch (error) {
      console.error("Failed to load templates:", error);
      toast.error("Không thể tải danh sách mẫu chứng chỉ");
    } finally {
      setLoadingTemplates(false);
    }
  };

  const createCertificate = async (
    data: CreateCertificateFormData,
    status: "draft" | "pending"
  ) => {
    try {
      setLoading(true);

      // Generate certificate number and verification code
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
        // Add other fields as needed
      };

      await certificateService.createCertificate(createRequest);

      const statusMessage =
        status === "draft"
          ? "Chứng chỉ đã được tạo dưới dạng bản nháp"
          : "Chứng chỉ đã được tạo và gửi phê duyệt";

      toast.success(statusMessage);
      onClose();
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Không thể tạo chứng chỉ";
      toast.error(errorMessage);
      console.error("Failed to create certificate:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = (data: CreateCertificateFormData) => {
    createCertificate(data, "draft");
  };

  const handleSubmitForApproval = (data: CreateCertificateFormData) => {
    createCertificate(data, "pending");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="!max-w-none !w-[90vw] max-h-[95vh] overflow-y-auto overflow-x-hidden p-0"
        style={{ width: "90vw", maxWidth: "none" }}
      >
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Tạo chứng chỉ mới
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-1">
            Tạo chứng chỉ mới cho tình nguyện viên
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              placeholder="Nhập ID..."
                              {...field}
                            />
                          </FormControl>
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
                              placeholder="Nhập ID..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                                {template.isDefault && (
                                  <span className="ml-2 text-blue-600">
                                    (Mặc định)
                                  </span>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <SelectValue placeholder="Chọn mức độ..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="excellent">
                                Xuất sắc
                              </SelectItem>
                              <SelectItem value="good">Tốt</SelectItem>
                              <SelectItem value="satisfactory">
                                Đạt yêu cầu
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Đánh giá mức độ hoàn thành
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
                            Số giờ tình nguyện đã hoàn thành
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                </div>
              </Form>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 space-y-6 sticky top-0">
                {/* Actions */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Hành động
                  </h3>
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

                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="w-full"
                    disabled={loading}
                  >
                    Hủy
                  </Button>
                </div>

                {/* Help Info */}
                <div className="text-sm space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Hướng dẫn
                    </h4>
                    <ul className="space-y-1 text-gray-600 text-xs">
                      <li>• Trường có (*) là bắt buộc</li>
                      <li>• Mã tự động tạo</li>
                      <li>• Kiểm tra trước khi gửi</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Trạng thái
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CertificateStatusBadge status="draft" />
                        <span className="text-xs text-gray-600">
                          Có thể sửa
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CertificateStatusBadge status="pending" />
                        <span className="text-xs text-gray-600">Đã gửi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CertificateStatusBadge status="issued" />
                        <span className="text-xs text-gray-600">
                          Hoàn thành
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
