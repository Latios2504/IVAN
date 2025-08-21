import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Save, Loader2, Edit } from "lucide-react";
import { toast } from "sonner";
import { certificateTemplateService } from "@/services/certificateTemplateService";
import type {
  CertificateTemplateViewModel,
  UpdateCertificateTemplateRequest,
} from "@/types/certificate";

interface EditCertificateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  templateId: number | null;
}

export default function EditCertificateTemplateModal({
  open,
  onOpenChange,
  onSuccess,
  templateId,
}: EditCertificateTemplateModalProps) {
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

  // Format required fields for storage
  const formatRequiredFields = (fields: string[]): string => {
    return JSON.stringify(fields);
  };

  // Template types
  const getTemplateTypes = () => [
    { value: "Participation", label: "Chứng chỉ tham gia" },
    { value: "Achievement", label: "Chứng chỉ thành tích" },
    { value: "Completion", label: "Chứng chỉ hoàn thành" },
    { value: "Recognition", label: "Chứng chỉ ghi nhận" },
    { value: "Custom", label: "Chứng chỉ tùy chỉnh" },
  ];

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
  const [saving, setSaving] = useState(false);
  const [template, setTemplate] = useState<CertificateTemplateViewModel | null>(
    null
  );

  // Form state
  const [formData, setFormData] = useState({
    templateName: "",
    description: "",
    templateType: "",
    templateDesign: "",
    isActive: true,
    isDefault: false,
    requiredFields: [] as string[],
  });

  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [newField, setNewField] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load template data when modal opens
  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId || !open) {
        return;
      }

      try {
        setLoading(true);
        const templateData =
          await certificateTemplateService.getCertificateTemplateById(
            templateId
          );
        setTemplate(templateData);

        // Parse required fields
        const requiredFields = parseRequiredFields(templateData.requiredFields);

        // Set form data
        setFormData({
          templateName: templateData.templateName,
          description: templateData.description || "",
          templateType: templateData.templateType || "",
          templateDesign: templateData.templateDesign || "",
          isActive: templateData.isActive !== false,
          isDefault: templateData.isDefault || false,
          requiredFields,
        });

        setErrors({});
      } catch (error) {
        toast.error("Không thể tải thông tin mẫu chứng chỉ");
        onOpenChange(false);
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [templateId, open, onOpenChange]);

  // Load available fields
  useEffect(() => {
    const fields = getCommonRequiredFields();
    setAvailableFields(fields.map((f) => f.value));
  }, []);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.templateName.trim()) {
      newErrors.templateName = "Tên mẫu là bắt buộc";
    } else if (formData.templateName.length > 200) {
      newErrors.templateName = "Tên mẫu không được vượt quá 200 ký tự";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Mô tả không được vượt quá 1000 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!templateId || !validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const updateData: UpdateCertificateTemplateRequest = {
        templateName: formData.templateName,
        description: formData.description || undefined,
        templateType: formData.templateType || undefined,
        templateDesign: formData.templateDesign || undefined,
        requiredFields: formatRequiredFields(formData.requiredFields),
        isDefault: formData.isDefault,
        isActive: formData.isActive,
      };

      await certificateTemplateService.updateCertificateTemplate(
        templateId,
        updateData
      );

      toast.success("Cập nhật mẫu chứng chỉ thành công!");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Không thể cập nhật mẫu chứng chỉ");
    } finally {
      setSaving(false);
    }
  };

  // Handle adding new required field
  const handleAddField = () => {
    if (!newField.trim()) return;

    if (!formData.requiredFields.includes(newField)) {
      setFormData((prev) => ({
        ...prev,
        requiredFields: [...prev.requiredFields, newField],
      }));
      setNewField("");
    }
  };

  // Handle removing required field
  const handleRemoveField = (fieldToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredFields: prev.requiredFields.filter(
        (field) => field !== fieldToRemove
      ),
    }));
  };

  // Update form field
  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Template types
  const templateTypes = getTemplateTypes();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 border-blue-200 dark:border-blue-800 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 -m-6 mb-6 p-6 border-b border-blue-200 dark:border-blue-700">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <Edit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Chỉnh sửa Mẫu Chứng chỉ
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
            Cập nhật thông tin mẫu chứng chỉ của bạn
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Đang tải...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 p-2">
            {/* Template Name */}
            <div className="space-y-2">
              <Label htmlFor="templateName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tên mẫu *</Label>
              <Input
                id="templateName"
                placeholder="Nhập tên mẫu chứng chỉ"
                value={formData.templateName}
                onChange={(e) => updateField("templateName", e.target.value)}
                className={`bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-blue-200 dark:border-blue-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 shadow-sm hover:shadow-md ${errors.templateName ? "border-red-500" : ""}`}
              />
              {errors.templateName && (
                <p className="text-sm text-red-500">{errors.templateName}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả về mẫu chứng chỉ này"
                className={`min-h-[80px] bg-gradient-to-r from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-200 shadow-sm hover:shadow-md resize-none ${
                  errors.description ? "border-red-500" : ""
                }`}
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Mô tả ngắn gọn về mẫu chứng chỉ này
              </p>
            </div>

            {/* Template Type */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Loại mẫu</Label>
              <Select
                value={formData.templateType}
                onValueChange={(value) => updateField("templateType", value)}
              >
                <SelectTrigger className="bg-gradient-to-r from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border-green-200 dark:border-green-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-200 shadow-sm hover:shadow-md">
                  <SelectValue placeholder="Chọn loại mẫu" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-green-200 dark:border-green-700 shadow-xl">
                  {templateTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="hover:bg-green-50 dark:hover:bg-green-900/20">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Template Design */}
            <div className="space-y-2">
              <Label htmlFor="templateDesign" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Thiết kế mẫu</Label>
              <Textarea
                id="templateDesign"
                placeholder="Mã HTML/CSS cho thiết kế mẫu"
                className="min-h-[100px] font-mono text-sm bg-gradient-to-r from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20 border-indigo-200 dark:border-indigo-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md resize-none"
                value={formData.templateDesign}
                onChange={(e) => updateField("templateDesign", e.target.value)}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Mã HTML/CSS để định dạng chứng chỉ
              </p>
            </div>

            {/* Required Fields */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Trường bắt buộc</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Các trường thông tin cần thiết khi tạo chứng chỉ từ mẫu này
              </p>

              {/* Current Required Fields */}
              <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
                {formData.requiredFields.length > 0 ? (
                  formData.requiredFields.map((field) => (
                    <Badge
                      key={field}
                      variant="secondary"
                      className="flex items-center gap-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 shadow-sm"
                    >
                      {field}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => handleRemoveField(field)}
                      />
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    Chưa có trường nào được chọn
                  </span>
                )}
              </div>

              {/* Add New Field */}
              <div className="flex gap-2">
                <Select value={newField} onValueChange={setNewField}>
                  <SelectTrigger className="flex-1 bg-gradient-to-r from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/20 border-orange-200 dark:border-orange-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 transition-all duration-200 shadow-sm hover:shadow-md">
                    <SelectValue placeholder="Chọn trường để thêm" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-700 shadow-xl">
                    {availableFields
                      .filter(
                        (field) => !formData.requiredFields.includes(field)
                      )
                      .map((field) => {
                        const fieldInfo = getCommonRequiredFields().find(
                          (f) => f.value === field
                        );
                        return (
                          <SelectItem key={field} value={field} className="hover:bg-orange-50 dark:hover:bg-orange-900/20">
                            {fieldInfo?.label || field}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddField}
                  disabled={
                    !newField || formData.requiredFields.includes(newField)
                  }
                  className="bg-gradient-to-r from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border-green-200 dark:border-green-700 hover:border-green-400 hover:shadow-md transition-all duration-200 text-green-700 dark:text-green-300"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cài đặt</Label>

              {/* Is Active */}
              <div className="flex items-center justify-between rounded-lg border border-blue-200 dark:border-blue-700 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-sm">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Kích hoạt mẫu</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Mẫu có thể được sử dụng để tạo chứng chỉ
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    updateField("isActive", checked)
                  }
                />
              </div>

              {/* Is Default - Only show for admin users */}
              {template?.organizationId === null && (
                <div className="flex items-center justify-between rounded-lg border border-purple-200 dark:border-purple-700 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-sm">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Mẫu mặc định</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Mẫu có sẵn cho tất cả tổ chức
                    </p>
                  </div>
                  <Switch
                    checked={formData.isDefault}
                    onCheckedChange={(checked) =>
                      updateField("isDefault", checked)
                    }
                  />
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
                className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-300 dark:border-gray-600 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Hủy
              </Button>
              <Button type="submit" disabled={saving} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Cập nhật
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
