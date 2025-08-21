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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 border-gradient-to-r border-blue-200 dark:border-blue-800 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-6 -m-6 mb-6">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <FileText className="h-6 w-6" />
            Tạo mẫu chứng chỉ mới
          </DialogTitle>
          <DialogDescription className="text-blue-100">
            Tạo mẫu chứng chỉ tùy chỉnh cho tổ chức của bạn
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 p-2"
          >
            {/* Template Name */}
            <FormField
              control={form.control}
              name="templateName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tên mẫu chứng chỉ <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên mẫu chứng chỉ..."
                      {...field}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-blue-200 dark:border-blue-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
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
                  <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả mẫu chứng chỉ..."
                      rows={3}
                      {...field}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-200 shadow-sm hover:shadow-md resize-none"
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
                  <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Loại chứng chỉ</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gradient-to-r from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border-green-200 dark:border-green-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-200 shadow-sm hover:shadow-md">
                        <SelectValue placeholder="Chọn loại chứng chỉ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-gray-800 border-green-200 dark:border-green-700 shadow-xl">
                      {TEMPLATE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="hover:bg-green-50 dark:hover:bg-green-900/20">
                          <div className="flex items-center gap-2">
                            <Badge className={`${type.color} shadow-sm`}>{type.label}</Badge>
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
              <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Thiết kế mẫu</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DEFAULT_DESIGNS.map((design) => (
                  <div
                    key={design.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
                      selectedDesign === design.value
                        ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary/50 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700"
                    }`}
                    onClick={() => setSelectedDesign(design.value)}
                  >
                    <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">{design.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {design.description}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {design.preview}
                    </div>
                  </div>
                ))}
              </div>
              <FormDescription className="text-gray-600 dark:text-gray-400">
                Chọn thiết kế mẫu cho chứng chỉ. Bạn có thể tùy chỉnh sau khi
                tạo.
              </FormDescription>
            </div>

            {/* Required Fields */}
            <div className="space-y-4">
              <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Trường bắt buộc</FormLabel>

              {/* Selected Fields */}
              {selectedFields.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
                  {selectedFields.map((field) => (
                    <Badge
                      key={field}
                      variant="secondary"
                      className="flex items-center gap-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 shadow-sm"
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
                    className="justify-start bg-gradient-to-r from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border-green-200 dark:border-green-700 hover:border-green-400 hover:shadow-md transition-all duration-200 text-green-700 dark:text-green-300"
                    onClick={() => addRequiredField(field.value)}
                    disabled={isSubmitting}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {field.label}
                  </Button>
                ))}
              </div>

              <FormDescription className="text-gray-600 dark:text-gray-400">
                Chọn các trường thông tin bắt buộc sẽ xuất hiện trên chứng chỉ
              </FormDescription>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-blue-200 dark:border-blue-700 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">Kích hoạt mẫu</FormLabel>
                      <FormDescription className="text-gray-600 dark:text-gray-400">
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
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-purple-200 dark:border-purple-700 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">Mẫu mặc định</FormLabel>
                      <FormDescription className="text-gray-600 dark:text-gray-400">
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

            <DialogFooter className="gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-300 dark:border-gray-600 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
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
