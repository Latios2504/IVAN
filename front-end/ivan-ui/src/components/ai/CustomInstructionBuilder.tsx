import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  AlertTriangle,
  CheckCircle,
  Info,
  Wand2,
  RotateCcw,
  FileText,
  Eye,
} from "lucide-react";
import type {
  AiCustomInstructionCreateDTO,
  AiCustomInstructionUpdateDTO,
  AiCustomInstructionDTO,
  InstructionFormData,
} from "@/types/ai";
import { aiInstructionsService } from "@/services/api/aiInstructionsService";

interface CustomInstructionBuilderProps {
  initialData?: AiCustomInstructionCreateDTO;
  editingInstruction?: AiCustomInstructionDTO;
  onSave: (
    data: AiCustomInstructionCreateDTO | AiCustomInstructionUpdateDTO
  ) => Promise<void>;
  onPreview: (data: InstructionFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CustomInstructionBuilder({
  initialData,
  editingInstruction,
  onSave,
  onPreview,
  onCancel,
  isLoading = false,
}: CustomInstructionBuilderProps) {
  const [formData, setFormData] = useState<InstructionFormData>({
    instructionName: "",
    systemPrompt: "",
    behaviorInstructions: "",
    dataAccessRules: "",
    isActive: true,
  });

  const [validation, setValidation] = useState({
    isValid: true,
    errors: [] as string[],
    warnings: [] as string[],
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (editingInstruction) {
      setFormData({
        instructionName: editingInstruction.instructionName,
        systemPrompt: editingInstruction.systemPrompt,
        behaviorInstructions: editingInstruction.behaviorInstructions || "",
        dataAccessRules: editingInstruction.dataAccessRules || "",
        isActive: editingInstruction.isActive,
      });
    } else if (initialData) {
      setFormData({
        instructionName: initialData.instructionName,
        systemPrompt: initialData.systemPrompt,
        behaviorInstructions: initialData.behaviorInstructions || "",
        dataAccessRules: initialData.dataAccessRules || "",
        isActive: true,
      });
    }
  }, [initialData, editingInstruction]);

  // Validate form data whenever it changes
  useEffect(() => {
    const validationResult = aiInstructionsService.validateInstruction({
      instructionName: formData.instructionName,
      systemPrompt: formData.systemPrompt,
      behaviorInstructions: formData.behaviorInstructions,
      dataAccessRules: formData.dataAccessRules,
    });
    setValidation(validationResult);
  }, [formData]);

  // Track changes
  useEffect(() => {
    if (editingInstruction || initialData) {
      const original = editingInstruction || initialData;
      const changed =
        formData.instructionName !== (original?.instructionName || "") ||
        formData.systemPrompt !== (original?.systemPrompt || "") ||
        formData.behaviorInstructions !==
          (original?.behaviorInstructions || "") ||
        formData.dataAccessRules !== (original?.dataAccessRules || "") ||
        (editingInstruction &&
          formData.isActive !== editingInstruction.isActive);
      setHasChanges(Boolean(changed));
    } else {
      const hasData =
        formData.instructionName.trim() !== "" ||
        formData.systemPrompt.trim() !== "" ||
        formData.behaviorInstructions.trim() !== "" ||
        formData.dataAccessRules.trim() !== "";
      setHasChanges(hasData);
    }
  }, [formData, editingInstruction, initialData]);

  const handleInputChange = (
    field: keyof InstructionFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!validation.isValid) return;

    try {
      if (editingInstruction) {
        // Update existing instruction
        const updateData: AiCustomInstructionUpdateDTO = {
          instructionName: formData.instructionName,
          systemPrompt: formData.systemPrompt,
          behaviorInstructions: formData.behaviorInstructions,
          dataAccessRules: formData.dataAccessRules,
          isActive: formData.isActive,
        };
        await onSave(updateData);
      } else {
        // Create new instruction
        const createData: AiCustomInstructionCreateDTO = {
          instructionName: formData.instructionName,
          systemPrompt: formData.systemPrompt,
          behaviorInstructions: formData.behaviorInstructions,
          dataAccessRules: formData.dataAccessRules,
        };
        await onSave(createData);
      }
    } catch (error) {
      console.error("Failed to save instruction:", error);
    }
  };

  const handleReset = () => {
    if (editingInstruction) {
      setFormData({
        instructionName: editingInstruction.instructionName,
        systemPrompt: editingInstruction.systemPrompt,
        behaviorInstructions: editingInstruction.behaviorInstructions || "",
        dataAccessRules: editingInstruction.dataAccessRules || "",
        isActive: editingInstruction.isActive,
      });
    } else {
      setFormData({
        instructionName: "",
        systemPrompt: "",
        behaviorInstructions: "",
        dataAccessRules: "",
        isActive: true,
      });
    }
  };

  const handlePreview = () => {
    onPreview(formData);
  };

  const isEditing = !!editingInstruction;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Chỉnh sửa Hướng dẫn AI" : "Tạo Hướng dẫn AI Mới"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {isEditing
              ? "Cập nhật thông tin hướng dẫn AI hiện tại"
              : "Xây dựng hướng dẫn AI tùy chỉnh cho tổ chức của bạn"}
          </p>
        </div>
        {hasChanges && (
          <Badge variant="outline" className="text-amber-600 border-amber-600">
            <Info className="h-3 w-3 mr-1" />
            Có thay đổi
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Thông tin cơ bản</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instructionName">
              Tên hướng dẫn <span className="text-red-500">*</span>
            </Label>
            <Input
              id="instructionName"
              placeholder="Ví dụ: Trợ lý Quản lý Tình nguyện viên"
              value={formData.instructionName}
              onChange={(e) =>
                handleInputChange("instructionName", e.target.value)
              }
              maxLength={200}
            />
            <p className="text-xs text-gray-500">
              {formData.instructionName.length}/200 ký tự
            </p>
          </div>

          {isEditing && (
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  handleInputChange("isActive", checked)
                }
              />
              <Label>Kích hoạt hướng dẫn</Label>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="h-5 w-5" />
            <span>System Prompt</span>
          </CardTitle>
          <CardDescription>
            Định nghĩa vai trò và nhiệm vụ chính của AI. Đây là phần quan trọng
            nhất quyết định hành vi của AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="systemPrompt">
              System Prompt <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="systemPrompt"
              placeholder="Bạn là trợ lý AI chuyên về..."
              value={formData.systemPrompt}
              onChange={(e) =>
                handleInputChange("systemPrompt", e.target.value)
              }
              className="min-h-[120px] max-h-[300px] overflow-y-auto resize-y"
            />
            <p className="text-xs text-gray-500">
              {formData.systemPrompt.length} ký tự
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn hành vi</CardTitle>
          <CardDescription>
            Định nghĩa phong cách giao tiếp và cách thức AI tương tác với người
            dùng.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="behaviorInstructions">Hướng dẫn hành vi</Label>
            <Textarea
              id="behaviorInstructions"
              placeholder="Luôn thân thiện, hữu ích và chuyên nghiệp..."
              value={formData.behaviorInstructions}
              onChange={(e) =>
                handleInputChange("behaviorInstructions", e.target.value)
              }
              className="min-h-[80px] max-h-[200px] overflow-y-auto resize-y"
            />
            <p className="text-xs text-gray-500">
              {formData.behaviorInstructions.length} ký tự
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quy tắc truy cập dữ liệu</CardTitle>
          <CardDescription>
            Định nghĩa dữ liệu nào AI có thể truy cập và sử dụng để trả lời câu
            hỏi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="dataAccessRules">Quy tắc truy cập dữ liệu</Label>
            <Textarea
              id="dataAccessRules"
              placeholder="Truy cập: volunteer profiles, events, performance metrics..."
              value={formData.dataAccessRules}
              onChange={(e) =>
                handleInputChange("dataAccessRules", e.target.value)
              }
              className="min-h-[80px] max-h-[150px] overflow-y-auto resize-y"
            />
            <p className="text-xs text-gray-500">
              {formData.dataAccessRules.length} ký tự
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Validation Messages */}
      {(validation.errors.length > 0 || validation.warnings.length > 0) && (
        <Card>
          <CardContent className="pt-6">
            {validation.errors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Lỗi cần sửa:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-600 ml-6">
                  {validation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.warnings.length > 0 && validation.errors.length > 0 && (
              <Separator className="my-4" />
            )}

            {validation.warnings.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-amber-600">
                  <Info className="h-4 w-4" />
                  <span className="font-medium">Gợi ý cải thiện:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-amber-600 ml-6">
                  {validation.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges || isLoading}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Đặt lại
          </Button>
          <Button
            variant="outline"
            onClick={handlePreview}
            disabled={!validation.isValid || isLoading}
          >
            <Eye className="h-4 w-4 mr-2" />
            Xem trước
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={!validation.isValid || !hasChanges || isLoading}
          >
            {isLoading && (
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
            )}
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? "Cập nhật" : "Lưu"}
          </Button>
        </div>
      </div>

      {validation.isValid && hasChanges && (
        <div className="flex items-center space-x-2 text-green-600 text-sm">
          <CheckCircle className="h-4 w-4" />
          <span>
            Hướng dẫn AI đã sẵn sàng để {isEditing ? "cập nhật" : "lưu"}
          </span>
        </div>
      )}
    </div>
  );
}
