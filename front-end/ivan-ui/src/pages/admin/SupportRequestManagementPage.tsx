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
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] =
    useState<SupportRequestResponseDto | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [comment, setComment] = useState("");
  const [resolution, setResolution] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [attachments, setAttachments] = useState<
    { name: string; url: string }[]
  >([]);

  useEffect(() => {
    fetchRequests();
    fetchCategories();
  }, [statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await supportRequestService.getAll(
        statusFilter === "all" ? undefined : statusFilter
      );
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
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
      setResolution(request.resolution || "");
      setShowDetailDialog(true);
    } catch (error) {
      console.error("Error fetching request details:", error);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!selectedRequest) return;

    try {
      setIsUpdating(true);

      const updateData: any = { status };

      // Add admin comment when approving/rejecting
      if ((status === "Approved" || status === "Rejected") && comment.trim()) {
        updateData.adminComment = comment;
      }

      await supportRequestService.update(selectedRequest.requestId, updateData);

      // Refresh the list
      await fetchRequests();

      // Update selected request
      setSelectedRequest({
        ...selectedRequest,
        status,
      });

      const statusText =
        status === "Approved"
          ? "duyệt"
          : status === "Rejected"
          ? "từ chối"
          : status;
      toast.success(`Đã ${statusText} yêu cầu từ thiện`);

      // Close dialog after approve/reject
      if (status === "Approved" || status === "Rejected") {
        setShowDetailDialog(false);
        setSelectedRequest(null);
        setComment("");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setIsUpdating(false);
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
        true, // Internal comment for admin
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
      case "Pending":
        return <Badge variant="secondary">Chờ xử lý</Badge>;
      case "In Progress":
        return <Badge variant="secondary">Đang xử lý</Badge>;
      case "Resolved":
        return <Badge variant="default">Đã giải quyết</Badge>;
      case "Closed":
        return <Badge variant="outline">Đã đóng</Badge>;
      case "Approved":
        return <Badge variant="default">Đã duyệt</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Đã từ chối</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const priorityTranslations = {
      'High': 'Cao',
      'Medium': 'Trung bình',
      'Low': 'Thấp'
    };
    
    const translatedPriority = priorityTranslations[priority as keyof typeof priorityTranslations] || priority;
    
    switch (priority) {
      case "High":
        return <Badge variant="destructive">{translatedPriority}</Badge>;
      case "Medium":
        return <Badge variant="secondary">{translatedPriority}</Badge>;
      case "Low":
        return <Badge variant="outline">{translatedPriority}</Badge>;
      default:
        return <Badge variant="outline">{translatedPriority}</Badge>;
    }
  };

  const filteredRequests = requests.filter(
    (request) =>
      request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý Yêu cầu Từ thiện</CardTitle>
          <CardDescription>
            Xem và phê duyệt các yêu cầu từ thiện từ người dùng
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tiêu đề, người gửi, danh mục..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Pending">Chờ xử lý</SelectItem>
                <SelectItem value="In Progress">Đang xử lý</SelectItem>
                <SelectItem value="Resolved">Đã giải quyết</SelectItem>
                <SelectItem value="Closed">Đã đóng</SelectItem>
                <SelectItem value="Approved">Đã duyệt</SelectItem>
                <SelectItem value="Rejected">Đã từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Requests Table */}
          {loading ? (
            <div className="text-center py-4">Đang tải...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
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
                {filteredRequests.map((request) => (
                  <TableRow key={request.requestId}>
                    <TableCell className="font-medium">
                      {request.subject}
                    </TableCell>
                    <TableCell>{request.userName}</TableCell>
                    <TableCell>{request.categoryName}</TableCell>
                    <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleDateString(
                            "vi-VN"
                          )
                        : "-"}
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
                ))}
              </TableBody>
            </Table>
          )}

          {filteredRequests.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy yêu cầu từ thiện nào
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết Yêu cầu Từ thiện</DialogTitle>
            <DialogDescription>
              Xem và phê duyệt yêu cầu từ thiện
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Request Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tiêu đề</Label>
                  <p className="mt-1">{selectedRequest.subject}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Người gửi</Label>
                  <p className="mt-1">
                    {selectedRequest.userName} ({selectedRequest.userEmail})
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Danh mục</Label>
                  <p className="mt-1">{selectedRequest.categoryName}</p>
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
                  <p className="mt-1">
                    {selectedRequest.createdAt
                      ? new Date(selectedRequest.createdAt).toLocaleString(
                          "vi-VN"
                        )
                      : "-"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm font-medium">Mô tả</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p className="whitespace-pre-wrap">
                    {selectedRequest.description}
                  </p>
                </div>
              </div>

              {/* Resolution */}
              {(selectedRequest.status === "Pending" ||
                selectedRequest.status === "In Progress") && (
                <div>
                  <Label htmlFor="resolution" className="text-sm font-medium">
                    Ghi chú giải quyết
                  </Label>
                  <Textarea
                    id="resolution"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Nhập ghi chú về cách giải quyết hoặc thông tin bổ sung..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              )}

              {/* Show existing resolution if request is resolved or closed */}
              {selectedRequest.resolution &&
                (selectedRequest.status === "Resolved" ||
                  selectedRequest.status === "Closed") && (
                  <div>
                    <Label className="text-sm font-medium">
                      Giải pháp đã thực hiện
                    </Label>
                    <div className="mt-1 p-3 bg-green-50 rounded-md">
                      <p className="whitespace-pre-wrap text-sm text-gray-700">
                        {selectedRequest.resolution}
                      </p>
                    </div>
                  </div>
                )}

              {/* Comments */}
              {selectedRequest.comments &&
                selectedRequest.comments.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Bình luận</Label>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                      {selectedRequest.comments.map((comment) => (
                        <div
                          key={comment.commentId}
                          className="p-2 bg-gray-50 rounded"
                        >
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{comment.userName}</span>
                            <span>
                              {comment.createdAt
                                ? new Date(comment.createdAt).toLocaleString(
                                    "vi-VN"
                                  )
                                : ""}
                            </span>
                          </div>
                          <p className="text-sm">{comment.comment}</p>
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
                      ))}
                    </div>
                  </div>
                )}

              {/* Add Comment */}
              <div>
                <Label htmlFor="comment" className="text-sm font-medium">
                  Thêm bình luận nội bộ
                </Label>
                <div className="mt-1 space-y-3">
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nhập bình luận nội bộ..."
                    rows={2}
                  />

                  {/* File Upload */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="file-upload-admin"
                        className="text-sm font-medium"
                      >
                        Đính kèm tệp:
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={uploadingFiles}
                        onClick={() =>
                          document.getElementById("file-upload-admin")?.click()
                        }
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        {uploadingFiles ? "Đang tải lên..." : "Chọn tệp"}
                      </Button>
                      <input
                        id="file-upload-admin"
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
                    {isUpdating ? "Đang gửi..." : "Gửi"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex gap-2">
              {selectedRequest?.status === "Pending" && (
                <>
                  <Button
                    onClick={() => handleStatusUpdate("Approved")}
                    disabled={isUpdating}
                    variant="default"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Duyệt yêu cầu
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate("Rejected")}
                    disabled={isUpdating}
                    variant="destructive"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Từ chối yêu cầu
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                onClick={() => setShowDetailDialog(false)}
              >
                Đóng
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
