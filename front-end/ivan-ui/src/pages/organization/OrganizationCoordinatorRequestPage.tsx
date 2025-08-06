import { useState } from "react";
import {
  Plus,
  Edit,
  Eye,
  MessageSquare,
  UserPlus,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useModal, useModalWithData } from "@/hooks/useModal";
import { DataTable } from "@/components/common/DataTable";
import type { TableColumn, TableAction } from "@/components/common/DataTable";

interface CoordinatorRequest {
  id: string;
  coordinatorName: string;
  coordinatorEmail: string;
  phoneNumber?: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  justification: string;
  expectedResponsibilities: string[];
  adminNotes?: string;
  responseDate?: string;
}

interface CoordinatorRequestFormData {
  coordinatorFirstName: string;
  coordinatorLastName: string;
  coordinatorEmail: string;
  coordinatorPhoneNumber: string;
  justification: string;
  expectedResponsibilities: string;
}

const mockCoordinatorRequests: CoordinatorRequest[] = [
  {
    id: "1",
    coordinatorName: "Nguyễn Minh Hạnh",
    coordinatorEmail: "hanh.nguyen@email.com",
    phoneNumber: "0901234567",
    requestDate: "2024-12-10",
    status: "approved",
    justification:
      "Cần coordinator để quản lý các sự kiện quy mô lớn và điều phối nhiều tình nguyện viên",
    expectedResponsibilities: [
      "Quản lý lịch trình sự kiện",
      "Điều phối tình nguyện viên",
      "Báo cáo tiến độ",
    ],
    adminNotes: "Đã phê duyệt. Coordinator có kinh nghiệm phù hợp.",
    responseDate: "2024-12-12",
  },
  {
    id: "2",
    coordinatorName: "Trần Văn Đức",
    coordinatorEmail: "duc.tran@email.com",
    phoneNumber: "0912345678",
    requestDate: "2024-12-15",
    status: "pending",
    justification:
      "Mở rộng hoạt động sang khu vực miền Bắc, cần coordinator địa phương",
    expectedResponsibilities: [
      "Quản lý sự kiện khu vực",
      "Liên kết với đối tác địa phương",
      "Tuyển dụng tình nguyện viên",
    ],
  },
  {
    id: "3",
    coordinatorName: "Lê Thị Mai",
    coordinatorEmail: "mai.le@email.com",
    requestDate: "2024-11-20",
    status: "rejected",
    justification: "Cần hỗ trợ cho các chương trình giáo dục",
    expectedResponsibilities: ["Điều phối chương trình giáo dục"],
    adminNotes: "Chưa đủ điều kiện. Cần bổ sung thêm thông tin và kinh nghiệm.",
    responseDate: "2024-11-25",
  },
];

export default function OrganizationCoordinatorRequestPage() {
  // Remove useToast hook since we're using sonner directly
  const createDialog = useModal();
  const viewModal = useModalWithData<CoordinatorRequest>();

  const [requests] = useState<CoordinatorRequest[]>(mockCoordinatorRequests);
  const [selectedTab, setSelectedTab] = useState("all");
  const [formData, setFormData] = useState<CoordinatorRequestFormData>({
    coordinatorFirstName: "",
    coordinatorLastName: "",
    coordinatorEmail: "",
    coordinatorPhoneNumber: "",
    justification: "",
    expectedResponsibilities: "",
  });

  const getStatusBadge = (status: CoordinatorRequest["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Đã phê duyệt
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Chờ xử lý
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Từ chối
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredRequests = requests.filter((request) => {
    if (selectedTab === "all") return true;
    return request.status === selectedTab;
  });

  const handleCreateRequest = () => {
    
    setIsCreateDialogOpen(false);
    // Reset form
    setFormData({
      coordinatorFirstName: "",
      coordinatorLastName: "",
      coordinatorEmail: "",
      coordinatorPhoneNumber: "",
      justification: "",
      expectedResponsibilities: "",
    });
  };

  const handleViewRequest = (request: CoordinatorRequest) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  const handleInputChange =
    (field: keyof CoordinatorRequestFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  // Table configuration
  const tableColumns: TableColumn<CoordinatorRequest>[] = [
    {
      key: "coordinatorName",
      header: "Tên Coordinator",
      render: (name) => <div className="font-medium">{name}</div>,
    },
    {
      key: "coordinatorEmail",
      header: "Email",
      render: (email) => <div className="text-sm text-gray-600">{email}</div>,
    },
    {
      key: "requestDate",
      header: "Ngày yêu cầu",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (status) => getStatusBadge(status),
    },
  ];

  const tableActions: TableAction<CoordinatorRequest>[] = [
    {
      label: "Xem chi tiết",
      icon: <Eye className="h-4 w-4" />,
      onClick: (request) => viewModal.openWith(request),
      variant: "outline",
      size: "sm",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Yêu cầu Coordinator</h1>
            <p className="text-gray-600 mt-2">
              Quản lý yêu cầu tạo tài khoản Coordinator cho tổ chức
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Yêu cầu Coordinator mới
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng yêu cầu
              </CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
              <p className="text-xs text-muted-foreground">
                Tất cả yêu cầu đã gửi
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter((r) => r.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Đang chờ Admin xem xét
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Đã phê duyệt
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter((r) => r.status === "approved").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Coordinator đã được tạo
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Từ chối</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter((r) => r.status === "rejected").length}
              </div>
              <p className="text-xs text-muted-foreground">Cần xem xét lại</p>
            </CardContent>
          </Card>
        </div>

        {/* Request Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
            <TabsTrigger value="approved">Đã phê duyệt</TabsTrigger>
            <TabsTrigger value="rejected">Từ chối</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách yêu cầu</CardTitle>
                <CardDescription>
                  {filteredRequests.length} yêu cầu được tìm thấy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={tableColumns}
                  data={filteredRequests}
                  actions={tableActions}
                  pagination
                  search
                  rowClassName="cursor-pointer"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Request Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Yêu cầu Coordinator mới</DialogTitle>
              <DialogDescription>
                Gửi yêu cầu tạo tài khoản Coordinator cho tổ chức của bạn
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Họ</Label>
                  <Input
                    id="firstName"
                    value={formData.coordinatorFirstName}
                    onChange={handleInputChange("coordinatorFirstName")}
                    placeholder="Nhập họ"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Tên</Label>
                  <Input
                    id="lastName"
                    value={formData.coordinatorLastName}
                    onChange={handleInputChange("coordinatorLastName")}
                    placeholder="Nhập tên"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.coordinatorEmail}
                    onChange={handleInputChange("coordinatorEmail")}
                    placeholder="coordinator@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={formData.coordinatorPhoneNumber}
                    onChange={handleInputChange("coordinatorPhoneNumber")}
                    placeholder="0901234567"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="justification">Lý do cần Coordinator</Label>
                <Textarea
                  id="justification"
                  value={formData.justification}
                  onChange={handleInputChange("justification")}
                  placeholder="Giải thích tại sao tổ chức cần thêm Coordinator..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsibilities">Trách nhiệm dự kiến</Label>
                <Textarea
                  id="responsibilities"
                  value={formData.expectedResponsibilities}
                  onChange={handleInputChange("expectedResponsibilities")}
                  placeholder="Liệt kê các trách nhiệm mà Coordinator sẽ đảm nhiệm..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleCreateRequest}>
                <Send className="mr-2 h-4 w-4" />
                Gửi yêu cầu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Request Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết yêu cầu Coordinator</DialogTitle>
              <DialogDescription>
                Thông tin chi tiết về yêu cầu tạo Coordinator
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Tên Coordinator
                    </Label>
                    <p className="text-sm text-gray-600">
                      {selectedRequest.coordinatorName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-gray-600">
                      {selectedRequest.coordinatorEmail}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Số điện thoại</Label>
                    <p className="text-sm text-gray-600">
                      {selectedRequest.phoneNumber || "Không có"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Trạng thái</Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Lý do yêu cầu</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedRequest.justification}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Trách nhiệm dự kiến
                  </Label>
                  <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                    {selectedRequest.expectedResponsibilities.map(
                      (responsibility, index) => (
                        <li key={index}>{responsibility}</li>
                      )
                    )}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Ngày yêu cầu</Label>
                    <p className="text-sm text-gray-600">
                      {selectedRequest.requestDate}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Ngày phản hồi</Label>
                    <p className="text-sm text-gray-600">
                      {selectedRequest.responseDate || "Chưa có"}
                    </p>
                  </div>
                </div>
                {selectedRequest.adminNotes && (
                  <div>
                    <Label className="text-sm font-medium">
                      Ghi chú từ Admin
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedRequest.adminNotes}
                    </p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Đóng
              </Button>
              {selectedRequest?.status === "pending" && (
                <Button>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Liên hệ Admin
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
