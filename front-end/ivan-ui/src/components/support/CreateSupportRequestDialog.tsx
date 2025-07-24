import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { TooltipWrapper } from "@/components/common/TooltipWrapper";
import {
  FormProgress,
  commonProgressStages,
} from "@/components/common/FormProgress";
import type {
  SupportCategory,
  CreateSupportRequestData,
} from "@/types/support";
import { Clock, AlertCircle, Paperclip, X } from "lucide-react";

interface CreateSupportRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateSupportRequestData) => Promise<void>;
  categories: SupportCategory[];
}

export const CreateSupportRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  categories,
}: CreateSupportRequestDialogProps) => {
  const [formData, setFormData] = useState<CreateSupportRequestData>({
    categoryId: 0,
    subject: "",
    description: "",
    priority: "Medium",
    attachmentUrls: [],
  });
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<SupportCategory | null>(null);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitStage, setSubmitStage] = useState<
    "idle" | "validating" | "uploading" | "submitting" | "completed"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.categoryId ||
      !formData.subject.trim() ||
      !formData.description.trim()
    ) {
      return;
    }

    try {
      setLoading(true);
      setSubmitProgress(0);

      // Stage 1: Validation
      setSubmitStage("validating");
      setSubmitProgress(20);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Stage 2: Upload attachments (if any)
      if (formData.attachmentUrls && formData.attachmentUrls.length > 0) {
        setSubmitStage("uploading");
        setSubmitProgress(50);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        setSubmitProgress(50);
      }

      // Stage 3: Submit request
      setSubmitStage("submitting");
      setSubmitProgress(80);
      await onSubmit(formData);

      // Stage 4: Complete
      setSubmitStage("completed");
      setSubmitProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Reset form
      setFormData({
        categoryId: 0,
        subject: "",
        description: "",
        priority: "Medium",
        attachmentUrls: [],
      });
      setSelectedCategory(null);
      setSubmitStage("idle");
      setSubmitProgress(0);
    } catch (error) {
      console.error("Error creating support request:", error);
      setSubmitStage("idle");
      setSubmitProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const id = parseInt(categoryId);
    const category = categories.find((c) => c.categoryId === id);
    setFormData((prev) => ({ ...prev, categoryId: id }));
    setSelectedCategory(category || null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const activeCategories = categories.filter((c) => c.isActive);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <span>Tạo yêu cầu hỗ trợ</span>
          </DialogTitle>
          <DialogDescription>
            Mô tả chi tiết vấn đề bạn gặp phải để chúng tôi có thể hỗ trợ bạn
            tốt nhất.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Danh mục hỗ trợ *</Label>
            <Select
              value={formData.categoryId.toString()}
              onValueChange={handleCategoryChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục hỗ trợ" />
              </SelectTrigger>
              <SelectContent>
                {activeCategories.map((category) => (
                  <SelectItem
                    key={category.categoryId}
                    value={category.categoryId.toString()}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{category.categoryName}</span>
                      <div className="flex items-center space-x-2 ml-2">
                        <Badge
                          className={getPriorityColor(
                            category.priority || "Medium"
                          )}
                        >
                          {category.priority === "High"
                            ? "Cao"
                            : category.priority === "Medium"
                            ? "Trung bình"
                            : category.priority === "Low"
                            ? "Thấp"
                            : category.priority}
                        </Badge>
                        {category.expectedResponseTime && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{category.expectedResponseTime}h</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Description */}
            {selectedCategory && selectedCategory.description && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-3">
                  <p className="text-sm text-blue-800">
                    {selectedCategory.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-blue-600">
                    <div className="flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>
                        Mức độ:{" "}
                        {selectedCategory.priority === "High"
                          ? "Cao"
                          : selectedCategory.priority === "Medium"
                          ? "Trung bình"
                          : selectedCategory.priority === "Low"
                          ? "Thấp"
                          : selectedCategory.priority}
                      </span>
                    </div>
                    {selectedCategory.expectedResponseTime && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          Thời gian phản hồi dự kiến:{" "}
                          {selectedCategory.expectedResponseTime} giờ
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Priority Selection */}
          <div className="space-y-2">
            <Label htmlFor="priority">Mức độ ưu tiên</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: "Low" | "Medium" | "High") =>
                setFormData((prev) => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor("Low")}>Thấp</Badge>
                    <span className="text-sm text-gray-600">
                      - Không cấp thiết
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="Medium">
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor("Medium")}>
                      Trung bình
                    </Badge>
                    <span className="text-sm text-gray-600">
                      - Cần giải quyết sớm
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="High">
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor("High")}>Cao</Badge>
                    <span className="text-sm text-gray-600">
                      - Cần giải quyết ngay
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Chủ đề *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subject: e.target.value }))
              }
              placeholder="Mô tả ngắn gọn vấn đề của bạn"
              required
              maxLength={300}
            />
            <p className="text-xs text-gray-500">
              {formData.subject.length}/300 ký tự
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả chi tiết *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Mô tả chi tiết vấn đề bạn gặp phải, các bước đã thử, thông tin môi trường (trình duyệt, thiết bị)..."
              rows={6}
              required
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Hãy cung cấp thông tin chi tiết để chúng tôi có thể hỗ trợ bạn tốt
              nhất.
            </p>
          </div>

          {/* File Attachments Placeholder */}
          <div className="space-y-2">
            <Label>Tệp đính kèm (tùy chọn)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Tính năng đính kèm tệp sẽ được phát triển trong phiên bản tiếp
                theo
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Hiện tại bạn có thể mô tả chi tiết trong phần mô tả
              </p>
            </div>
          </div>

          <DialogFooter className="space-y-4">
            {/* Enhanced Progress Indicator */}
            {loading && (
              <FormProgress
                currentStage={submitStage}
                progress={submitProgress}
                stages={commonProgressStages.formSubmission}
                showPercentage={true}
              />
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Hủy
              </Button>
              <TooltipWrapper
                content={
                  !formData.categoryId ||
                  !formData.subject.trim() ||
                  !formData.description.trim()
                    ? "Vui lòng điền đầy đủ thông tin bắt buộc"
                    : "Gửi yêu cầu hỗ trợ"
                }
              >
                <Button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.categoryId ||
                    !formData.subject.trim() ||
                    !formData.description.trim()
                  }
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Đang xử lý..." : "Tạo yêu cầu hỗ trợ"}
                </Button>
              </TooltipWrapper>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
