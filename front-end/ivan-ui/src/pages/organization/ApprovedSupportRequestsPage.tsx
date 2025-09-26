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
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Label } from "@/components/ui/label";
import {
  DataTable,
  type TableColumn,
  type TableAction,
} from "@/components/common/DataTable";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { supportRequestService } from "@/services/supportRequestService";
import type {
  SupportRequestResponseDto,
  SupportCategoryDto,
} from "@/types/supportRequest";
import {
  Search,
  Eye,
  CheckCircle,
  MessageSquare,
  FileText,
  Filter,
} from "lucide-react";

export default function ApprovedSupportRequestsPage() {
  const [requests, setRequests] = useState<SupportRequestResponseDto[]>([]);
  const [categories, setCategories] = useState<SupportCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] =
    useState<SupportRequestResponseDto | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  useEffect(() => {
    fetchApprovedRequests();
    fetchCategories();
  }, []);

  const fetchApprovedRequests = async () => {
    try {
      setLoading(true);
      // Fetch only approved requests
      const data = await supportRequestService.getAll("Approved");
      setRequests(data);
    } catch (error) {
      console.error("Error fetching approved requests:", error);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge variant="default" className="bg-green-600">
            Đã duyệt
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const priorityTranslations = {
      High: "Cao",
      Medium: "Trung bình",
      Low: "Thấp",
      Urgent: "Khẩn cấp",
    };

    const translatedPriority =
      priorityTranslations[priority as keyof typeof priorityTranslations] ||
      priority;

    switch (priority) {
      case "Urgent":
        return <Badge variant="destructive">{translatedPriority}</Badge>;
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

  // Apply filters
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      request.categoryId.toString() === categoryFilter;

    const matchesPriority =
      priorityFilter === "all" || request.priority === priorityFilter;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Define columns for DataTable
  const columns: TableColumn<SupportRequestResponseDto>[] = [
    {
      key: "subject",
      header: "Tiêu đề",
      render: (value) => (
        <div className="max-w-xs truncate font-medium">{value}</div>
      ),
    },
    {
      key: "userName",
      header: "Người gửi",
      render: (value, item) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{item.userEmail}</div>
        </div>
      ),
    },
    {
      key: "categoryName",
      header: "Danh mục",
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: "priority",
      header: "Độ ưu tiên",
      render: (value) => getPriorityBadge(value),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (value) => getStatusBadge(value),
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      render: (value) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "-",
    },
  ];

  // Define actions for DataTable
  const actions: TableAction<SupportRequestResponseDto>[] = [
    {
      label: "Xem chi tiết",
      icon: <Eye />,
      onClick: (request) => handleViewDetails(request.requestId),
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <CardTitle>Yêu cầu Từ thiện Đã duyệt</CardTitle>
              <CardDescription>
                Xem các yêu cầu từ thiện đã được duyệt trong hệ thống
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tiêu đề, người gửi, danh mục, mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
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

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo độ ưu tiên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả độ ưu tiên</SelectItem>
                  <SelectItem value="Urgent">Khẩn cấp</SelectItem>
                  <SelectItem value="High">Cao</SelectItem>
                  <SelectItem value="Medium">Trung bình</SelectItem>
                  <SelectItem value="Low">Thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">
                      Tổng số yêu cầu
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {filteredRequests.length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">
                      Độ ưu tiên cao
                    </p>
                    <p className="text-2xl font-bold text-red-700">
                      {
                        filteredRequests.filter(
                          (r) =>
                            r.priority === "High" || r.priority === "Urgent"
                        ).length
                      }
                    </p>
                  </div>
                  <Filter className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Tuần này
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      {
                        filteredRequests.filter((r) => {
                          if (!r.createdAt) return false;
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return new Date(r.createdAt) >= weekAgo;
                        }).length
                      }
                    </p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">
                      Danh mục
                    </p>
                    <p className="text-2xl font-bold text-purple-700">
                      {new Set(filteredRequests.map((r) => r.categoryId)).size}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Requests Table */}
          {loading ? (
            <LoadingState loading={true} />
          ) : filteredRequests.length === 0 ? (
            <EmptyState
              icon={CheckCircle}
              title="Không có yêu cầu từ thiện đã duyệt"
              description={
                requests.length === 0
                  ? "Chưa có yêu cầu từ thiện nào được duyệt."
                  : "Không tìm thấy yêu cầu nào phù hợp với bộ lọc hiện tại."
              }
              show={true}
            />
          ) : (
            <DataTable
              data={filteredRequests}
              columns={columns}
              actions={actions}
            />
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Chi tiết Yêu cầu Từ thiện Đã duyệt
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về yêu cầu từ thiện đã được duyệt
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Request Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Tiêu đề
                  </Label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {selectedRequest.subject}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Người gửi
                  </Label>
                  <p className="mt-1 text-gray-900">
                    {selectedRequest.userName} ({selectedRequest.userEmail})
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Danh mục
                  </Label>
                  <div className="mt-1">
                    <Badge variant="outline">
                      {selectedRequest.categoryName}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Độ ưu tiên
                  </Label>
                  <div className="mt-1">
                    {getPriorityBadge(selectedRequest.priority)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Trạng thái
                  </Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Ngày tạo
                  </Label>
                  <p className="mt-1 text-gray-900">
                    {selectedRequest.createdAt
                      ? new Date(selectedRequest.createdAt).toLocaleString(
                          "vi-VN"
                        )
                      : "-"}
                  </p>
                </div>
                {selectedRequest.resolvedDate && (
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Ngày duyệt
                    </Label>
                    <p className="mt-1 text-gray-900">
                      {new Date(selectedRequest.resolvedDate).toLocaleString(
                        "vi-VN"
                      )}
                      {selectedRequest.resolvedByName && (
                        <span className="text-sm text-gray-500 ml-2">
                          bởi {selectedRequest.resolvedByName}
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Mô tả chi tiết
                </Label>
                <div className="mt-1 p-4 bg-gray-50 rounded-lg border">
                  <p className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                    {selectedRequest.description}
                  </p>
                </div>
              </div>

              {/* Resolution */}
              {selectedRequest.resolution && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Ghi chú phê duyệt
                  </Label>
                  <div className="mt-1 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="whitespace-pre-wrap text-green-900 leading-relaxed">
                      {selectedRequest.resolution}
                    </p>
                  </div>
                </div>
              )}

              {/* Attachments */}
              {selectedRequest.attachmentUrls &&
                selectedRequest.attachmentUrls.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Tệp đính kèm
                    </Label>
                    <div className="mt-1 space-y-2">
                      {selectedRequest.attachmentUrls.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                        >
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-700 font-medium">
                            {url.split("/").pop() ||
                              `Tệp đính kèm ${index + 1}`}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              {/* Satisfaction Rating */}
              {selectedRequest.satisfactionRating && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Đánh giá
                  </Label>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-xl ${
                            star <= selectedRequest.satisfactionRating!
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({selectedRequest.satisfactionRating}/5)
                    </span>
                  </div>
                  {selectedRequest.satisfactionFeedback && (
                    <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-yellow-900 text-sm">
                        {selectedRequest.satisfactionFeedback}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDetailDialog(false)}
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
