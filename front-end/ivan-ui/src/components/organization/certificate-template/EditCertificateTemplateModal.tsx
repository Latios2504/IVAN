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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Chỉnh sửa Mẫu Chứng chỉ
          </DialogTitle>
          <DialogDescription>
            Cập nhật thông tin mẫu chứng chỉ của bạn
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Đang tải...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Name */}
            <div className="space-y-2">
              <Label htmlFor="templateName">Tên mẫu *</Label>
              <Input
                id="templateName"
                placeholder="Nhập tên mẫu chứng chỉ"
                value={formData.templateName}
                onChange={(e) => updateField("templateName", e.target.value)}
                className={errors.templateName ? "border-red-500" : ""}
              />
              {errors.templateName && (
                <p className="text-sm text-red-500">{errors.templateName}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả về mẫu chứng chỉ này"
                className={`min-h-[80px] ${
                  errors.description ? "border-red-500" : ""
                }`}
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
              <p className="text-sm text-gray-500">
                Mô tả ngắn gọn về mẫu chứng chỉ này
              </p>
            </div>

            {/* Template Type */}
            <div className="space-y-2">
              <Label>Loại mẫu</Label>
              <Select
                value={formData.templateType}
                onValueChange={(value) => updateField("templateType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại mẫu" />
                </SelectTrigger>
                <SelectContent>
                  {templateTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Template Design */}
            <div className="space-y-2">
              <Label htmlFor="templateDesign">Thiết kế mẫu</Label>
              <Textarea
                id="templateDesign"
                placeholder="Mã HTML/CSS cho thiết kế mẫu"
                className="min-h-[100px] font-mono text-sm"
                value={formData.templateDesign}
                onChange={(e) => updateField("templateDesign", e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Mã HTML/CSS để định dạng chứng chỉ
              </p>
            </div>

            {/* Required Fields */}
            <div className="space-y-4">
              <Label>Trường bắt buộc</Label>
              <p className="text-sm text-gray-500">
                Các trường thông tin cần thiết khi tạo chứng chỉ từ mẫu này
              </p>

              {/* Current Required Fields */}
              <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-md">
                {formData.requiredFields.length > 0 ? (
                  formData.requiredFields.map((field) => (
                    <Badge
                      key={field}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {field}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => handleRemoveField(field)}
                      />
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">
                    Chưa có trường nào được chọn
                  </span>
                )}
              </div>

              {/* Add New Field */}
              <div className="flex gap-2">
                <Select value={newField} onValueChange={setNewField}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Chọn trường để thêm" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFields
                      .filter(
                        (field) => !formData.requiredFields.includes(field)
                      )
                      .map((field) => {
                        const fieldInfo = getCommonRequiredFields().find(
                          (f) => f.value === field
                        );
                        return (
                          <SelectItem key={field} value={field}>
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
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <Label>Cài đặt</Label>

              {/* Is Active */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Kích hoạt mẫu</Label>
                  <p className="text-sm text-gray-500">
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
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Mẫu mặc định</Label>
                    <p className="text-sm text-gray-500">
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={saving}>
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
