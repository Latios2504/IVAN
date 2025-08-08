import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supportRequestService } from "@/services/supportRequestService";
import type {
  SupportRequestCreateRequest,
  SupportCategory,
} from "@/services/supportRequestService";
import { toast } from "sonner";
import { Send } from "lucide-react";

export default function CreateSupportRequestPage() {
  const [categories, setCategories] = useState<SupportCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SupportRequestCreateRequest>({
    categoryId: 0,
    subject: "",
    description: "",
    priority: "Medium",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await supportRequestService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Không thể tải danh sách danh mục");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.categoryId ||
      !formData.subject.trim() ||
      !formData.description.trim()
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      await supportRequestService.create(formData);

      toast.success("Gửi yêu cầu hỗ trợ thành công!");

      // Reset form
      setFormData({
        categoryId: 0,
        subject: "",
        description: "",
        priority: "Medium",
      });
    } catch (error) {
      console.error("Error creating support request:", error);
      toast.error("Có lỗi xảy ra khi gửi yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof SupportRequestCreateRequest,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Tạo Yêu cầu Hỗ trợ</CardTitle>
          <CardDescription>
            Gửi yêu cầu hỗ trợ và chúng tôi sẽ phản hồi trong thời gian sớm nhất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div>
              <Label htmlFor="category">Danh mục hỗ trợ *</Label>
              <Select
                value={formData.categoryId.toString()}
                onValueChange={(value) =>
                  handleInputChange("categoryId", parseInt(value))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn danh mục hỗ trợ" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.categoryId}
                      value={category.categoryId.toString()}
                    >
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div>
              <Label htmlFor="priority">Độ ưu tiên</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Thấp</SelectItem>
                  <SelectItem value="Medium">Trung bình</SelectItem>
                  <SelectItem value="High">Cao</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div>
              <Label htmlFor="subject">Tiêu đề *</Label>
              <Input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Nhập tiêu đề yêu cầu hỗ trợ"
                className="mt-1"
                maxLength={300}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.subject.length}/300 ký tự
              </p>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Mô tả chi tiết *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                className="mt-1"
                rows={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Vui lòng mô tả chi tiết vấn đề để chúng tôi có thể hỗ trợ tốt
                nhất
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setFormData({
                    categoryId: 0,
                    subject: "",
                    description: "",
                    priority: "Medium",
                  })
                }
                disabled={loading}
              >
                Làm mới
              </Button>
              <Button
                type="submit"
                disabled={
                  loading ||
                  !formData.categoryId ||
                  !formData.subject.trim() ||
                  !formData.description.trim()
                }
              >
                {loading ? (
                  "Đang gửi..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Gửi yêu cầu
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Thông tin hữu ích</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900">
                Thời gian phản hồi dự kiến:
              </h4>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Độ ưu tiên cao: Trong vòng 4-8 giờ</li>
                <li>Độ ưu tiên trung bình: Trong vòng 24 giờ</li>
                <li>Độ ưu tiên thấp: Trong vòng 48-72 giờ</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900">
                Để được hỗ trợ nhanh chóng:
              </h4>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Mô tả rõ ràng vấn đề bạn gặp phải</li>
                <li>Cung cấp thông tin chi tiết về lỗi (nếu có)</li>
                <li>Cho biết các bước bạn đã thử trước đó</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
