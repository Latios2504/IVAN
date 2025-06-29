import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import type {
  SupportRequest,
  SupportCategory,
  SupportRequestFilters,
  SupportRequestStats,
} from "@/types/support";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateSupportRequestDialog } from "@/components/support/CreateSupportRequestDialog";
import { SupportRequestDetailsModal } from "@/components/support/SupportRequestDetailsModal";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  HeadphonesIcon,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Paperclip,
  MoreHorizontal,
  Eye,
  Edit,
  Star,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useModal, useModalWithData } from "@/hooks/useModal";
import { DataTable } from "@/components/common/DataTable";
import type { TableColumn, TableAction } from "@/components/common/DataTable";

/**
 * Support Request Management Page
 * Implements FE-13: Manage Support Requests
 *
 * Features:
 * - List Support Requests with filtering/search
 * - View Support Request details
 * - Add new Support Request (all users)
 * - Update Support Request status (admin)
 * - Comments and attachments support
 * - Role-based access control
 */

const SupportRequestManagementPage = () => {
  const { user } = useAuth();
  const { showNotification } = useToast();
  const createDialog = useModal();
  const detailsModal = useModalWithData<SupportRequest>();

  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [categories, setCategories] = useState<SupportCategory[]>([]);
  const [stats, setStats] = useState<SupportRequestStats | null>(null);
  const [filters, setFilters] = useState<SupportRequestFilters>({
    status: "all",
    category: "all",
    priority: "all",
    searchTerm: "",
    dateRange: "all",
  });
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("all");

  // Check if user can manage support requests (admin/organization)
  const canManageRequests =
    user?.role === "admin" || user?.role === "organization";
  const canUpdateStatus = user?.role === "admin";

  // Sample support categories data
  const sampleCategories: SupportCategory[] = [
    {
      categoryId: 1,
      categoryName: "Kỹ thuật",
      description: "Hỗ trợ kỹ thuật và lỗi hệ thống",
      priority: "High",
      expectedResponseTime: 4,
      isActive: true,
    },
    {
      categoryId: 2,
      categoryName: "Tài khoản",
      description: "Vấn đề về tài khoản và đăng nhập",
      priority: "Medium",
      expectedResponseTime: 12,
      isActive: true,
    },
    {
      categoryId: 3,
      categoryName: "Sự kiện",
      description: "Hỗ trợ về sự kiện và đăng ký",
      priority: "Medium",
      expectedResponseTime: 24,
      isActive: true,
    },
    {
      categoryId: 4,
      categoryName: "Khác",
      description: "Các vấn đề khác",
      priority: "Low",
      expectedResponseTime: 48,
      isActive: true,
    },
  ];

  // Sample support requests data
  const sampleSupportRequests: SupportRequest[] = [
    {
      requestId: 1,
      userId: 1,
      categoryId: 1,
      subject: "Lỗi không thể đăng nhập vào hệ thống",
      description:
        "Tôi đã thử đăng nhập nhiều lần nhưng hệ thống báo lỗi 'Thông tin không hợp lệ' mặc dù tôi chắc chắn mật khẩu đúng.",
      priority: "High",
      status: "Open",
      createdAt: "2024-01-15T08:30:00Z",
      updatedAt: "2024-01-15T08:30:00Z",
      category: sampleCategories[0],
      user: {
        userId: 1,
        email: "nguyen.van.a@example.com",
        fullName: "Nguyễn Văn A",
        role: "Volunteer",
      },
      comments: [
        {
          commentId: 1,
          requestId: 1,
          userId: 2,
          comment:
            "Chúng tôi đã nhận được yêu cầu hỗ trợ của bạn. Vui lòng kiểm tra email để xác nhận tài khoản.",
          isInternal: false,
          createdAt: "2024-01-15T09:00:00Z",
          user: {
            userId: 2,
            email: "admin@ivan.com",
            fullName: "Admin",
            role: "Admin",
          },
        },
      ],
    },
    {
      requestId: 2,
      userId: 3,
      categoryId: 2,
      subject: "Cập nhật thông tin hồ sơ tổ chức",
      description:
        "Tôi muốn cập nhật thông tin liên hệ và mô tả hoạt động của tổ chức. Nhưng không tìm thấy trang chỉnh sửa.",
      priority: "Medium",
      status: "In Progress",
      assignedTo: 2,
      assignedDate: "2024-01-14T10:00:00Z",
      createdAt: "2024-01-14T09:15:00Z",
      updatedAt: "2024-01-14T10:00:00Z",
      category: sampleCategories[1],
      user: {
        userId: 3,
        email: "org@charity.org",
        fullName: "Tổ chức Từ thiện ABC",
        role: "Organization",
      },
      assignedToUser: {
        userId: 2,
        email: "admin@ivan.com",
        fullName: "Admin",
      },
    },
    {
      requestId: 3,
      userId: 4,
      categoryId: 3,
      subject: "Không thể đăng ký tham gia sự kiện",
      description:
        "Khi tôi nhấn nút 'Đăng ký tham gia' cho sự kiện 'Dọn dẹp công viên', hệ thống không phản hồi gì cả.",
      priority: "Medium",
      status: "Resolved",
      assignedTo: 2,
      assignedDate: "2024-01-13T14:00:00Z",
      resolution:
        "Đã khắc phục lỗi JavaScript trên trang đăng ký sự kiện. Người dùng có thể đăng ký bình thường.",
      resolvedBy: 2,
      resolvedDate: "2024-01-13T16:30:00Z",
      satisfactionRating: 5,
      satisfactionFeedback: "Hỗ trợ rất nhanh và hiệu quả. Cảm ơn team!",
      createdAt: "2024-01-13T13:45:00Z",
      updatedAt: "2024-01-13T16:30:00Z",
      category: sampleCategories[2],
      user: {
        userId: 4,
        email: "volunteer@example.com",
        fullName: "Trần Thị B",
        role: "Volunteer",
      },
      assignedToUser: {
        userId: 2,
        email: "admin@ivan.com",
        fullName: "Admin",
      },
      resolvedByUser: {
        userId: 2,
        email: "admin@ivan.com",
        fullName: "Admin",
      },
    },
  ];

  // Calculate stats from sample data
  const calculateStats = (requests: SupportRequest[]): SupportRequestStats => {
    const total = requests.length;
    const open = requests.filter((r) => r.status === "Open").length;
    const inProgress = requests.filter(
      (r) => r.status === "In Progress"
    ).length;
    const resolved = requests.filter((r) => r.status === "Resolved").length;
    const closed = requests.filter((r) => r.status === "Closed").length;

    const ratingsWithFeedback = requests
      .filter((r) => r.satisfactionRating)
      .map((r) => r.satisfactionRating!);
    const satisfactionScore =
      ratingsWithFeedback.length > 0
        ? ratingsWithFeedback.reduce((sum, rating) => sum + rating, 0) /
          ratingsWithFeedback.length
        : 0;

    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
      satisfactionScore,
    };
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Simulate API calls with sample data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setCategories(sampleCategories);
        setSupportRequests(sampleSupportRequests);
        setStats(calculateStats(sampleSupportRequests));
      } catch (error) {
        console.error("Error loading support requests:", error);
        showNotification("Có lỗi xảy ra khi tải dữ liệu", "error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  // Filter support requests based on current filters
  const filteredRequests = supportRequests.filter((request) => {
    // Filter by status
    if (
      filters.status &&
      filters.status !== "all" &&
      request.status !== filters.status
    ) {
      return false;
    }

    // Filter by category
    if (
      filters.category &&
      filters.category !== "all" &&
      request.categoryId.toString() !== filters.category
    ) {
      return false;
    }

    // Filter by priority
    if (
      filters.priority &&
      filters.priority !== "all" &&
      request.priority !== filters.priority
    ) {
      return false;
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSubject = request.subject
        .toLowerCase()
        .includes(searchLower);
      const matchesDescription = request.description
        .toLowerCase()
        .includes(searchLower);
      const matchesUserName = request.user?.fullName
        .toLowerCase()
        .includes(searchLower);

      if (!matchesSubject && !matchesDescription && !matchesUserName) {
        return false;
      }
    }

    // Filter by user role - non-admin users only see their own requests
    if (user?.role !== "admin" && user?.role !== "organization") {
      return request.userId === user?.id;
    }

    return true;
  });

  // Get requests for current tab
  const getRequestsForTab = (tab: string) => {
    switch (tab) {
      case "open":
        return filteredRequests.filter((r) => r.status === "Open");
      case "in-progress":
        return filteredRequests.filter((r) => r.status === "In Progress");
      case "resolved":
        return filteredRequests.filter((r) => r.status === "Resolved");
      case "closed":
        return filteredRequests.filter((r) => r.status === "Closed");
      default:
        return filteredRequests;
    }
  };

  const currentRequests = getRequestsForTab(currentTab);

  // Handle create support request
  const handleCreateRequest = async (data: any) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newRequest: SupportRequest = {
        requestId: Date.now(),
        userId: user?.id || 0,
        categoryId: data.categoryId,
        subject: data.subject,
        description: data.description,
        priority: data.priority || "Medium",
        status: "Open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: categories.find((c) => c.categoryId === data.categoryId),
        user: {
          userId: user?.id || 0,
          email: user?.email || "",
          fullName: user?.fullName || "",
          role: user?.role || "volunteer",
        },
        comments: [],
      };

      setSupportRequests((prev) => [newRequest, ...prev]);
      setStats((prev) =>
        prev ? { ...prev, total: prev.total + 1, open: prev.open + 1 } : null
      );

      showNotification("Yêu cầu hỗ trợ đã được tạo thành công");
      createDialog.close();
    } catch (error) {
      console.error("Error creating support request:", error);
      showNotification("Có lỗi xảy ra khi tạo yêu cầu hỗ trợ", "error");
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800 border-red-200";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority: string) => {
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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return <AlertCircle className="w-4 h-4" />;
      case "In Progress":
        return <Clock className="w-4 h-4" />;
      case "Resolved":
        return <CheckCircle className="w-4 h-4" />;
      case "Closed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <HeadphonesIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Hỗ trợ</h1>
            <p className="text-gray-600">
              Theo dõi và xử lý các yêu cầu hỗ trợ từ cộng đồng
            </p>
          </div>
        </div>

        <Button
          onClick={createDialog.open}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo yêu cầu hỗ trợ
        </Button>
      </div>
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng cộng</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <HeadphonesIcon className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mở</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.open}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Đang xử lý
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.inProgress}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Đã giải quyết
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.resolved}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Đánh giá TB
                  </p>{" "}
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.satisfactionScore && stats.satisfactionScore > 0
                      ? stats.satisfactionScore.toFixed(1)
                      : "N/A"}
                  </p>
                </div>
                <Star className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Input
                placeholder="Tìm kiếm..."
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    searchTerm: e.target.value,
                  }))
                }
                className="w-full"
              />
            </div>

            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>{" "}
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Open">Mở</SelectItem>
                <SelectItem value="In Progress">Đang xử lý</SelectItem>
                <SelectItem value="Resolved">Đã giải quyết</SelectItem>
                <SelectItem value="Closed">Đã đóng</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.category}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>{" "}
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

            <Select
              value={filters.priority}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Ưu tiên" />
              </SelectTrigger>{" "}
              <SelectContent>
                <SelectItem value="all">Tất cả mức độ</SelectItem>
                <SelectItem value="High">Cao</SelectItem>
                <SelectItem value="Medium">Trung bình</SelectItem>
                <SelectItem value="Low">Thấp</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  status: "",
                  category: "",
                  priority: "",
                  searchTerm: "",
                  dateRange: "all",
                })
              }
              className="w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              Xóa lọc
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Support Requests Tabs */}
      <Tabs
        value={currentTab}
        onValueChange={setCurrentTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            Tất cả ({filteredRequests.length})
          </TabsTrigger>
          <TabsTrigger value="open">
            Mở ({filteredRequests.filter((r) => r.status === "Open").length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            Đang xử lý (
            {filteredRequests.filter((r) => r.status === "In Progress").length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Đã giải quyết (
            {filteredRequests.filter((r) => r.status === "Resolved").length})
          </TabsTrigger>
          <TabsTrigger value="closed">
            Đã đóng (
            {filteredRequests.filter((r) => r.status === "Closed").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab} className="space-y-4">
          {currentRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <HeadphonesIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không có yêu cầu hỗ trợ
                </h3>
                <p className="text-gray-500">
                  {filters.searchTerm ||
                  filters.status ||
                  filters.category ||
                  filters.priority
                    ? "Không tìm thấy yêu cầu hỗ trợ nào phù hợp với bộ lọc."
                    : "Chưa có yêu cầu hỗ trợ nào được tạo."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {currentRequests.map((request) => (
                <Card
                  key={request.requestId}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge
                            className={getStatusBadgeColor(
                              request.status || "Open"
                            )}
                          >
                            {getStatusIcon(request.status || "Open")}
                            <span className="ml-1">
                              {request.status === "Open"
                                ? "Mở"
                                : request.status === "In Progress"
                                ? "Đang xử lý"
                                : request.status === "Resolved"
                                ? "Đã giải quyết"
                                : request.status === "Closed"
                                ? "Đã đóng"
                                : request.status}
                            </span>
                          </Badge>

                          <Badge
                            className={getPriorityBadgeColor(
                              request.priority || "Medium"
                            )}
                          >
                            {request.priority === "High"
                              ? "Cao"
                              : request.priority === "Medium"
                              ? "Trung bình"
                              : request.priority === "Low"
                              ? "Thấp"
                              : request.priority}
                          </Badge>

                          <Badge variant="outline">
                            {request.category?.categoryName}
                          </Badge>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          #{request.requestId} - {request.subject}
                        </h3>

                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {request.description}
                        </p>

                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <span>Người tạo:</span>
                            <span className="font-medium">
                              {request.user?.fullName}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(
                                request.createdAt || ""
                              ).toLocaleDateString("vi-VN")}
                            </span>
                          </div>

                          {request.comments && request.comments.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{request.comments.length} bình luận</span>
                            </div>
                          )}

                          {request.satisfactionRating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span>{request.satisfactionRating}/5</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => detailsModal.openWith(request)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xem
                        </Button>

                        {canUpdateStatus && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => detailsModal.openWith(request)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Sửa
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      {/* Create Support Request Dialog */}
      <CreateSupportRequestDialog
        open={createDialog.isOpen}
        onOpenChange={createDialog.toggle}
        onSubmit={handleCreateRequest}
        categories={categories}
      />{" "}
      {/* Support Request Details Modal */}
      {detailsModal.data && (
        <SupportRequestDetailsModal
          request={detailsModal.data}
          open={detailsModal.isOpen}
          onOpenChange={detailsModal.toggle}
          onUpdate={(updatedRequest: SupportRequest) => {
            setSupportRequests((prev) =>
              prev.map((r) =>
                r.requestId === updatedRequest.requestId ? updatedRequest : r
              )
            );
            detailsModal.closeAndClear();
          }}
          canUpdate={canUpdateStatus}
          categories={categories}
        />
      )}
    </div>
  );
};

export default SupportRequestManagementPage;
