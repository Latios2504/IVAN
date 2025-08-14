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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supportRequestService } from "@/services/supportRequestService";
import type {
  SupportRequestResponseDto,
  SupportCategoryDto,
} from "@/types/supportRequest";
import {
  Search,
  Eye,
  MessageCircle,
  UserCheck,
  CheckCircle,
  Upload,
  X,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export default function SupportRequestManagementPage() {
  const [requests, setRequests] = useState<SupportRequestResponseDto[]>([]);
  const [categories, setCategories] = useState<SupportCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] =
    useState<SupportRequestResponseDto | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [comment, setComment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [attachments, setAttachments] = useState<
    { name: string; url: string }[]
  >([]);

  useEffect(() => {
    fetchRequests();
    fetchCategories();
  }, [categoryFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // Organizations automatically see only approved charity requests
      // The backend filters this automatically based on user role
      const data = await supportRequestService.getAll();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Có lỗi xảy ra khi tải yêu cầu từ thiện");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await supportRequestService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleViewDetails = async (requestId: number) => {
    try {
      const request = await supportRequestService.getById(requestId);
      setSelectedRequest(request);
      setShowDetailDialog(true);
    } catch (error) {
      console.error("Error fetching request details:", error);
    }
  };

  const handleAddComment = async () => {
    if (!selectedRequest || !comment.trim()) return;

    setIsUpdating(true);
    try {
      const attachmentUrls = attachments.map((att) => att.url);
      await supportRequestService.addCommentWithAttachment(
        selectedRequest.requestId,
        comment,
        true, // Internal comment for organization
        attachmentUrls.length > 0 ? attachmentUrls : undefined
      );

      // Refresh the request details
      await handleViewDetails(selectedRequest.requestId);
      setComment("");
      setAttachments([]);
      toast.success("Đã thêm bình luận thành công");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Có lỗi xảy ra khi thêm bình luận");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`Tệp ${file.name} quá lớn (tối đa 10MB)`);
          return null;
        }

        // Validate file type
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
        ];

        if (!allowedTypes.includes(file.type)) {
          toast.error(`Định dạng tệp ${file.name} không được hỗ trợ`);
          return null;
        }

        try {
          const url = await supportRequestService.uploadAttachment(file);
          return { name: file.name, url };
        } catch (error) {
          toast.error(`Lỗi tải lên tệp ${file.name}`);
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter((result) => result !== null) as {
        name: string;
        url: string;
      }[];

      setAttachments((prev) => [...prev, ...successfulUploads]);

      if (successfulUploads.length > 0) {
        toast.success(`Đã tải lên ${successfulUploads.length} tệp thành công`);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Có lỗi xảy ra khi tải lên tệp");
    } finally {
      setUploadingFiles(false);
      // Reset file input
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge variant="default">Đã duyệt</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">Cao</Badge>;
      case "Medium":
        return <Badge variant="secondary">Trung bình</Badge>;
      case "Low":
        return <Badge variant="outline">Thấp</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.categoryName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !categoryFilter ||
      categoryFilter === "all" ||
      request.categoryId.toString() === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu Từ thiện đã duyệt</CardTitle>
          <CardDescription>
            Xem các yêu cầu từ thiện đã được admin xét duyệt để lên kế hoạch tổ
            chức sự kiện hỗ trợ
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tiêu đề, người gửi hoặc danh mục..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
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

          {/* Requests Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Người gửi</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Độ ưu tiên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Không có yêu cầu từ thiện nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.requestId}>
                      <TableCell className="font-medium">
                        #{request.requestId}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {request.subject}
                      </TableCell>
                      <TableCell>{request.userName}</TableCell>
                      <TableCell>{request.categoryName}</TableCell>
                      <TableCell>
                        {getPriorityBadge(request.priority)}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {request.createdAt
                          ? new Date(request.createdAt).toLocaleDateString(
                              "vi-VN"
                            )
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(request.requestId)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Xem
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Chi tiết Yêu cầu Từ thiện #{selectedRequest?.requestId}
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về hoàn cảnh cần hỗ trợ từ thiện đã được xét
              duyệt
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Request Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tiêu đề</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedRequest.subject}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Người gửi</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedRequest.userName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Danh mục</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedRequest.categoryName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Độ ưu tiên</Label>
                  <div className="mt-1">
                    {getPriorityBadge(selectedRequest.priority)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Trạng thái</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Ngày tạo</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedRequest.createdAt
                      ? new Date(selectedRequest.createdAt).toLocaleString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm font-medium">Mô tả tình huống</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedRequest.description}
                  </p>
                </div>
              </div>

              {/* Attachments/Evidence */}
              {selectedRequest.attachmentUrls &&
                selectedRequest.attachmentUrls.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">
                      Hình ảnh minh chứng
                    </Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedRequest.attachmentUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            {url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                              <img
                                src={url}
                                alt={`Evidence ${index + 1}`}
                                className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                                onClick={() => window.open(url, "_blank")}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="text-center">
                                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-xs text-gray-500 truncate px-2">
                                    {url.split("/").pop()}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => window.open(url, "_blank")}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Nhấp vào hình ảnh để xem chi tiết
                    </p>
                  </div>
                )}

              {/* Resolution */}
              {selectedRequest.resolution && (
                <div>
                  <Label className="text-sm font-medium">Giải pháp</Label>
                  <div className="mt-1 p-3 bg-green-50 rounded-md">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedRequest.resolution}
                    </p>
                  </div>
                </div>
              )}

              {/* Comments */}
              <div>
                <Label className="text-sm font-medium">Bình luận</Label>
                <div className="mt-2 space-y-3 max-h-60 overflow-y-auto">
                  {selectedRequest.comments &&
                  selectedRequest.comments.length > 0 ? (
                    selectedRequest.comments.map((comment, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-md ${
                          comment.isInternal
                            ? "bg-blue-50 border-l-4 border-blue-400"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium">
                            {comment.userName}
                          </span>
                          <div className="flex items-center gap-2">
                            {comment.isInternal && (
                              <Badge variant="secondary" className="text-xs">
                                Nội bộ
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {comment.createdAt
                                ? new Date(comment.createdAt).toLocaleString(
                                    "vi-VN"
                                  )
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {comment.comment}
                        </p>
                        {/* Comment Attachments */}
                        {comment.attachmentUrls &&
                          comment.attachmentUrls.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <p className="text-xs text-gray-500">
                                Tệp đính kèm:
                              </p>
                              {comment.attachmentUrls.map((url, idx) => (
                                <a
                                  key={idx}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                                >
                                  <FileText className="h-3 w-3" />
                                  {url.split("/").pop() || "Tệp đính kèm"}
                                </a>
                              ))}
                            </div>
                          )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Chưa có bình luận nào
                    </p>
                  )}
                </div>

                {/* Add Comment */}
                <div className="mt-4 space-y-3">
                  <Textarea
                    placeholder="Thêm bình luận nội bộ..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />

                  {/* File Upload */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="file-upload"
                        className="text-sm font-medium"
                      >
                        Đính kèm tệp:
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={uploadingFiles}
                        onClick={() =>
                          document.getElementById("file-upload")?.click()
                        }
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        {uploadingFiles ? "Đang tải lên..." : "Chọn tệp"}
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Attachment List */}
                    {attachments.length > 0 && (
                      <div className="space-y-1">
                        {attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700">
                                {attachment.name}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleAddComment}
                    disabled={!comment.trim() || isUpdating}
                    size="sm"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {isUpdating ? "Đang thêm..." : "Thêm bình luận"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDetailDialog(false)}
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ...existing code...
