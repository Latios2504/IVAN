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
  SupportRequestResponse,
  SupportCategory,
} from "@/services/supportRequestService";
import {
  Search,
  Eye,
  MessageCircle,
  UserCheck,
  CheckCircle,
} from "lucide-react";

export default function SupportRequestManagementPage() {
  const [requests, setRequests] = useState<SupportRequestResponse[]>([]);
  const [categories, setCategories] = useState<SupportCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedRequest, setSelectedRequest] =
    useState<SupportRequestResponse | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [resolution, setResolution] = useState("");
  const [comment, setComment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchRequests();
    fetchCategories();
  }, [statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await supportRequestService.getAll(
        statusFilter || undefined
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
      await supportRequestService.update(selectedRequest.requestId, {
        status,
        resolution: status === "Resolved" ? resolution : undefined,
      });

      // Refresh the list
      await fetchRequests();

      // Update selected request
      setSelectedRequest({ ...selectedRequest, status });

      if (status === "Resolved") {
        setShowDetailDialog(false);
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddComment = async () => {
    if (!selectedRequest || !comment.trim()) return;

    try {
      setIsUpdating(true);
      await supportRequestService.addComment(
        selectedRequest.requestId,
        comment,
        true
      );

      // Refresh request details
      const updatedRequest = await supportRequestService.getById(
        selectedRequest.requestId
      );
      setSelectedRequest(updatedRequest);
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return <Badge variant="destructive">Mở</Badge>;
      case "In Progress":
        return <Badge variant="secondary">Đang xử lý</Badge>;
      case "Resolved":
        return <Badge variant="default">Đã giải quyết</Badge>;
      case "Closed":
        return <Badge variant="outline">Đã đóng</Badge>;
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
          <CardTitle>Quản lý Yêu cầu Hỗ trợ</CardTitle>
          <CardDescription>
            Xem và xử lý các yêu cầu hỗ trợ từ người dùng
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
                <SelectItem value="">Tất cả trạng thái</SelectItem>
                <SelectItem value="Open">Mở</SelectItem>
                <SelectItem value="In Progress">Đang xử lý</SelectItem>
                <SelectItem value="Resolved">Đã giải quyết</SelectItem>
                <SelectItem value="Closed">Đã đóng</SelectItem>
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
              Không tìm thấy yêu cầu hỗ trợ nào
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết Yêu cầu Hỗ trợ</DialogTitle>
            <DialogDescription>Xem và xử lý yêu cầu hỗ trợ</DialogDescription>
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
              {selectedRequest.status !== "Resolved" && (
                <div>
                  <Label htmlFor="resolution" className="text-sm font-medium">
                    Giải pháp
                  </Label>
                  <Textarea
                    id="resolution"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Nhập giải pháp cho yêu cầu này..."
                    className="mt-1"
                    rows={3}
                  />
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
                <div className="mt-1 flex gap-2">
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nhập bình luận nội bộ..."
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!comment.trim() || isUpdating}
                    size="sm"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Gửi
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex gap-2">
              {selectedRequest?.status === "Open" && (
                <Button
                  onClick={() => handleStatusUpdate("In Progress")}
                  disabled={isUpdating}
                  variant="outline"
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Bắt đầu xử lý
                </Button>
              )}
              {selectedRequest?.status !== "Resolved" && (
                <Button
                  onClick={() => handleStatusUpdate("Resolved")}
                  disabled={isUpdating || !resolution.trim()}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Giải quyết
                </Button>
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
