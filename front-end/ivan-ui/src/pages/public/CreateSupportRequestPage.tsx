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
import { Send, Upload, X, FileText } from "lucide-react";

export default function CreateSupportRequestPage() {
  const [categories, setCategories] = useState<SupportCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [attachments, setAttachments] = useState<
    { name: string; url: string }[]
  >([]);
  const [formData, setFormData] = useState<SupportRequestCreateRequest>({
    categoryId: 0,
    subject: "",
    description: "",
    priority: "Medium",
    attachmentUrls: [],
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingFiles(true);
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File ${file.name} quá lớn (tối đa 10MB)`);
          return null;
        }

        // Validate file type
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
        ];

        if (!allowedTypes.includes(file.type)) {
          toast.error(`File ${file.name} không được hỗ trợ`);
          return null;
        }

        const url = await supportRequestService.uploadAttachment(file);
        return { name: file.name, url };
      });

      const results = await Promise.all(uploadPromises);
      const validUploads = results.filter((result) => result !== null) as {
        name: string;
        url: string;
      }[];

      setAttachments((prev) => [...prev, ...validUploads]);
      setFormData((prev) => ({
        ...prev,
        attachmentUrls: [
          ...(prev.attachmentUrls || []),
          ...validUploads.map((upload) => upload.url),
        ],
      }));

      toast.success(`Đã tải lên ${validUploads.length} file thành công`);
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Có lỗi xảy ra khi tải file");
    } finally {
      setUploadingFiles(false);
      // Reset input
      e.target.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
    setFormData((prev) => ({
      ...prev,
      attachmentUrls: newAttachments.map((att) => att.url),
    }));
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

      toast.success(
        "Gửi yêu cầu từ thiện thành công! Yêu cầu của bạn sẽ được xem xét và phê duyệt."
      );

      // Reset form
      setFormData({
        categoryId: 0,
        subject: "",
        description: "",
        priority: "Medium",
        attachmentUrls: [],
      });
      setAttachments([]);
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
          <CardTitle>Gửi Yêu cầu Từ thiện</CardTitle>
          <CardDescription>
            Gửi yêu cầu từ thiện hoặc trợ giúp. Yêu cầu của bạn sẽ được xem xét
            và phê duyệt trước khi hiển thị cho các tổ chức
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div>
              <Label htmlFor="category">Danh mục yêu cầu *</Label>
              <Select
                value={formData.categoryId.toString()}
                onValueChange={(value) =>
                  handleInputChange("categoryId", parseInt(value))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn danh mục yêu cầu" />
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
                placeholder="Nhập tiêu đề yêu cầu từ thiện"
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
                placeholder="Mô tả chi tiết tình huống cần hỗ trợ từ thiện..."
                className="mt-1"
                rows={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Vui lòng mô tả chi tiết tình huống để các tổ chức có thể hiểu và
                hỗ trợ tốt nhất
              </p>
            </div>

            {/* File Attachments */}
            <div>
              <Label htmlFor="attachments">Tệp đính kèm</Label>
              <div className="mt-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="attachments"
                    type="file"
                    onChange={handleFileUpload}
                    multiple
                    className="flex-1"
                    disabled={uploadingFiles}
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
                  />
                  {uploadingFiles ? (
                    <Button disabled variant="outline" size="sm">
                      Đang tải...
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("attachments")?.click()
                      }
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Tải lên
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Hỗ trợ: JPG, PNG, GIF, PDF, DOC, DOCX, TXT (tối đa 10MB)
                </p>

                {/* Attachment List */}
                {attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium">Tệp đã tải lên:</p>
                    <div className="space-y-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-sm truncate max-w-xs">
                              {file.name}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    categoryId: 0,
                    subject: "",
                    description: "",
                    priority: "Medium",
                    attachmentUrls: [],
                  });
                  setAttachments([]);
                }}
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
          <CardTitle className="text-lg">Quy trình xử lý yêu cầu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900">
                Các bước xử lý yêu cầu từ thiện:
              </h4>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Bước 1: Gửi yêu cầu từ thiện (trạng thái: Chờ duyệt)</li>
                <li>Bước 2: Admin xem xét và phê duyệt yêu cầu</li>
                <li>Bước 3: Yêu cầu được hiển thị cho các tổ chức từ thiện</li>
                <li>Bước 4: Các tổ chức liên hệ và hỗ trợ trực tiếp</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900">
                Để yêu cầu được phê duyệt nhanh chóng:
              </h4>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Mô tả rõ ràng tình huống cần hỗ trợ</li>
                <li>Cung cấp thông tin liên hệ chính xác</li>
                <li>Đính kèm hình ảnh minh chứng (nếu có)</li>
                <li>Chọn đúng danh mục yêu cầu</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
