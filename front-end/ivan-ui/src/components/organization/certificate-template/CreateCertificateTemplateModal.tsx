import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Plus, Save, FileText } from "lucide-react";
import { toast } from "sonner";
import type { CreateCertificateTemplateRequest } from "@/types/certificate";

// Validation schema
const templateSchema = z.object({
  templateName: z
    .string()
    .min(1, "Tên mẫu là bắt buộc")
    .max(200, "Tên mẫu không được vượt quá 200 ký tự"),
  description: z
    .string()
    .max(1000, "Mô tả không được vượt quá 1000 ký tự")
    .optional()
    .or(z.literal("")),
  templateType: z.string().optional().or(z.literal("")),
  templateDesign: z.string().optional().or(z.literal("")),
  isDefault: z.boolean(),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof templateSchema>;

interface CreateCertificateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

// Available template types
const TEMPLATE_TYPES = [
  {
    value: "Participation",
    label: "Chứng chỉ tham gia",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "Achievement",
    label: "Chứng chỉ thành tích",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "Completion",
    label: "Chứng chỉ hoàn thành",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "Recognition",
    label: "Chứng chỉ ghi nhận",
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "Custom",
    label: "Chứng chỉ tùy chỉnh",
    color: "bg-gray-100 text-gray-800",
  },
];

// Available required fields
const AVAILABLE_FIELDS = [
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

// Default template designs
const DEFAULT_DESIGNS = [
  {
    name: "Thiết kế cơ bản",
    value: "basic",
    description: "Mẫu đơn giản với logo và thông tin cơ bản",
    preview: "Thiết kế đơn giản, chuyên nghiệp",
  },
  {
    name: "Thiết kế chính thức",
    value: "formal",
    description: "Mẫu trang trọng với khung viền và phông chữ elegant",
    preview: "Thiết kế trang trọng, thích hợp cho sự kiện quan trọng",
  },
  {
    name: "Thiết kế hiện đại",
    value: "modern",
    description: "Mẫu hiện đại với màu sắc tươi sáng",
    preview: "Thiết kế trẻ trung, hiện đại",
  },
];

export default function CreateCertificateTemplateModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateCertificateTemplateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      templateName: "",
      description: "",
      templateType: "",
      templateDesign: "",
      isDefault: false,
      isActive: true,
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      // Start with minimal required data only
      const requestData: CreateCertificateTemplateRequest = {
        templateName: data.templateName.trim(),
      };

      // Add optional fields only if they have values
      if (data.description?.trim()) {
        requestData.description = data.description.trim();
      }

      if (data.templateType?.trim()) {
        requestData.templateType = data.templateType.trim();
      }

      if (selectedDesign?.trim() || data.templateDesign?.trim()) {
        requestData.templateDesign = (
          selectedDesign || data.templateDesign
        )?.trim();
      }

      if (selectedFields.length > 0) {
        requestData.requiredFields = JSON.stringify(selectedFields);
      }

      // Always include boolean values
      requestData.isDefault = Boolean(data.isDefault);
      requestData.isActive = Boolean(data.isActive !== false);

      // Debug log to see what we're sending
      console.log("Sending data to API:", requestData);

      // Import the service dynamically to avoid circular imports
      const { certificateTemplateService } = await import(
        "@/services/certificateTemplateService"
      );

      // Create the template directly without client-side validation
      // Let the backend handle validation and provide better error messages
      await certificateTemplateService.createCertificateTemplate(requestData);

      toast.success("Tạo mẫu chứng chỉ thành công!");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error creating certificate template:", error);

      // More detailed error handling
      let errorMessage = "Có lỗi xảy ra khi tạo mẫu chứng chỉ";
      if (error instanceof Error) {
        errorMessage = error.message;
        // Check for specific validation errors
        if (error.message.includes("validation")) {
          errorMessage =
            "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
        } else if (error.message.includes("duplicate")) {
          errorMessage = "Tên mẫu đã tồn tại. Vui lòng chọn tên khác.";
        } else if (error.message.includes("entity changes")) {
          errorMessage =
            "Lỗi lưu dữ liệu. Vui lòng kiểm tra thông tin và thử lại.";
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedFields([]);
    setSelectedDesign("");
    onOpenChange(false);
  };

  const addRequiredField = (field: string) => {
    if (!selectedFields.includes(field)) {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const removeRequiredField = (field: string) => {
    setSelectedFields(selectedFields.filter((f) => f !== field));
  };

  const getFieldLabel = (value: string) => {
    return AVAILABLE_FIELDS.find((f) => f.value === value)?.label || value;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Tạo mẫu chứng chỉ mới
          </DialogTitle>
          <DialogDescription>
            Tạo mẫu chứng chỉ tùy chỉnh cho tổ chức của bạn
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Template Name */}
            <FormField
              control={form.control}
              name="templateName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên mẫu chứng chỉ <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên mẫu chứng chỉ..."
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Tên mẫu sẽ hiển thị khi chọn mẫu để tạo chứng chỉ
                  </FormDescription>
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
                      placeholder="Mô tả mẫu chứng chỉ..."
                      rows={3}
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Mô tả chi tiết về mẫu chứng chỉ và mục đích sử dụng
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Template Type */}
            <FormField
              control={form.control}
              name="templateType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại chứng chỉ</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại chứng chỉ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TEMPLATE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Badge className={type.color}>{type.label}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Loại chứng chỉ sẽ giúp phân loại và tìm kiếm dễ dàng hơn
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Template Design */}
            <div className="space-y-4">
              <FormLabel>Thiết kế mẫu</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DEFAULT_DESIGNS.map((design) => (
                  <div
                    key={design.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedDesign === design.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedDesign(design.value)}
                  >
                    <h4 className="font-medium mb-2">{design.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {design.description}
                    </p>
                    <div className="text-xs text-gray-500">
                      {design.preview}
                    </div>
                  </div>
                ))}
              </div>
              <FormDescription>
                Chọn thiết kế mẫu cho chứng chỉ. Bạn có thể tùy chỉnh sau khi
                tạo.
              </FormDescription>
            </div>

            {/* Required Fields */}
            <div className="space-y-4">
              <FormLabel>Trường bắt buộc</FormLabel>

              {/* Selected Fields */}
              {selectedFields.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                  {selectedFields.map((field) => (
                    <Badge
                      key={field}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {getFieldLabel(field)}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeRequiredField(field);
                        }}
                      />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Available Fields */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {AVAILABLE_FIELDS.filter(
                  (f) => !selectedFields.includes(f.value)
                ).map((field) => (
                  <Button
                    key={field.value}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="justify-start"
                    onClick={() => addRequiredField(field.value)}
                    disabled={isSubmitting}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {field.label}
                  </Button>
                ))}
              </div>

              <FormDescription>
                Chọn các trường thông tin bắt buộc sẽ xuất hiện trên chứng chỉ
              </FormDescription>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Kích hoạt mẫu</FormLabel>
                      <FormDescription>
                        Mẫu có thể được sử dụng ngay sau khi tạo
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Mẫu mặc định</FormLabel>
                      <FormDescription>
                        Có thể được sử dụng bởi tất cả tổ chức
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Tạo mẫu
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
