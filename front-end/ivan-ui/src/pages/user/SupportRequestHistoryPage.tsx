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
import type { SupportRequestResponseDto } from "@/types/supportRequest";
import { Search, Eye, MessageCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SupportRequestHistoryPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<SupportRequestResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] =
    useState<SupportRequestResponseDto | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [comment, setComment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchMyRequests();
  }, [statusFilter]);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const data = await supportRequestService.getUserRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching my requests:", error);
    } finally {
      setLoading(false);
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
      await supportRequestService.addCommentWithAttachment(
        selectedRequest.requestId,
        comment,
        false // Public comment for users
      );

      // Refresh the request details
      await handleViewDetails(selectedRequest.requestId);
      setComment("");
      toast.success("Đã gửi bình luận thành công");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Có lỗi xảy ra khi gửi bình luận");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return <Badge variant="secondary">Mở</Badge>;
      case "Approved":
        return <Badge variant="default">Đã duyệt</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Đã từ chối</Badge>;
      case "Resolved":
        return <Badge variant="outline">Đã giải quyết</Badge>;
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
      request.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusFilteredRequests =
    statusFilter && statusFilter !== "all"
      ? filteredRequests.filter((request) => request.status === statusFilter)
      : filteredRequests;

  return (
    <div className="container mx-auto py-6">
      <Card className="bg-gradient-to-br from-slate-50/80 via-gray-50/80 to-zinc-50/80 dark:from-slate-950/50 dark:via-gray-950/50 dark:to-zinc-950/50 border-slate-200/50 dark:border-slate-800/50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-violet-950/40 dark:via-indigo-950/40 dark:to-blue-950/40 rounded-t-lg border-b border-violet-200/50 dark:border-violet-800/50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 dark:from-violet-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
                Lịch sử Yêu cầu Hỗ trợ
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Xem và theo dõi các yêu cầu hỗ trợ của bạn
              </CardDescription>
            </div>
            <Button
              onClick={() => navigate("/support-request/create")}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tạo yêu cầu mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="bg-gradient-to-r from-emerald-50/80 via-teal-50/80 to-cyan-50/80 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 rounded-xl p-4 mb-6 border border-emerald-200/50 dark:border-emerald-800/50">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <Input
                    placeholder="Tìm kiếm theo tiêu đề hoặc danh mục..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 bg-background/80 border-emerald-200/50 dark:border-emerald-800/50 focus:border-emerald-400 dark:focus:border-emerald-600"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-background/80 border-emerald-200/50 dark:border-emerald-800/50">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="Open">Mở</SelectItem>
                  <SelectItem value="Approved">Đã duyệt</SelectItem>
                  <SelectItem value="Rejected">Đã từ chối</SelectItem>
                  <SelectItem value="Resolved">Đã giải quyết</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Requests Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Độ ưu tiên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Cập nhật cuối</TableHead>
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
                ) : statusFilteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      {requests.length === 0
                        ? "Bạn chưa có yêu cầu hỗ trợ nào"
                        : "Không tìm thấy yêu cầu phù hợp"}
                    </TableCell>
                  </TableRow>
                ) : (
                  statusFilteredRequests.map((request) => (
                    <TableRow
                      key={request.requestId}
                      className="bg-gradient-to-r from-slate-50/30 via-gray-50/30 to-zinc-50/30 dark:from-slate-950/20 dark:via-gray-950/20 dark:to-zinc-950/20 hover:from-slate-100/50 hover:via-gray-100/50 hover:to-zinc-100/50 dark:hover:from-slate-900/30 dark:hover:via-gray-900/30 dark:hover:to-zinc-900/30 border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300"
                    >
                      <TableCell className="font-medium text-foreground">
                        #{request.requestId}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-foreground">
                        {request.subject}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {request.categoryName}
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(request.priority)}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {request.createdAt
                          ? new Date(request.createdAt).toLocaleDateString(
                              "vi-VN"
                            )
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {request.updatedAt
                          ? new Date(request.updatedAt).toLocaleDateString(
                              "vi-VN"
                            )
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(request.requestId)}
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200/50 dark:border-blue-800/50 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-all duration-300"
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
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-slate-50/95 via-gray-50/95 to-zinc-50/95 dark:from-slate-950/95 dark:via-gray-950/95 dark:to-zinc-950/95 border-slate-200/50 dark:border-slate-800/50">
          <DialogHeader className="bg-gradient-to-r from-violet-50/80 via-indigo-50/80 to-blue-50/80 dark:from-violet-950/40 dark:via-indigo-950/40 dark:to-blue-950/40 rounded-lg p-4 border border-violet-200/50 dark:border-violet-800/50">
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 dark:from-violet-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
              Chi tiết Yêu cầu Hỗ trợ #{selectedRequest?.requestId}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Thông tin chi tiết và lịch sử xử lý yêu cầu của bạn
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
                <div>
                  <Label className="text-sm font-medium">Cập nhật cuối</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedRequest.updatedAt
                      ? new Date(selectedRequest.updatedAt).toLocaleString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm font-medium">Mô tả</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedRequest.description}
                  </p>
                </div>
              </div>

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
