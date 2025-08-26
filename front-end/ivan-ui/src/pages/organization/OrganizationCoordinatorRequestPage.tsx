import { useState } from "react";
import {
  Plus,
  Eye,
  MessageSquare,
  UserPlus,
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
import { Badge } from "@/components/ui/badge";
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
  // Modal hooks for managing dialog states
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
    // TODO: Implement API call to create coordinator request
    toast.success("Yêu cầu Coordinator đã được gửi thành công!");

    createDialog.close();
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
    viewModal.openWith(request);
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
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 rounded-xl border border-blue-200 dark:border-blue-800 shadow-lg backdrop-blur-sm">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800 shadow-md">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              Yêu cầu Coordinator
            </h1>
            <p className="text-blue-700 dark:text-blue-300 mt-2">
              Quản lý yêu cầu tạo tài khoản Coordinator cho tổ chức
            </p>
          </div>
          <Button
            onClick={createDialog.open}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Yêu cầu Coordinator mới
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950 border border-green-200 dark:border-green-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-t-lg border-b border-green-200 dark:border-green-800">
              <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">
                Tổng yêu cầu
              </CardTitle>
              <UserPlus className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                {requests.length}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">
                Tất cả yêu cầu đã gửi
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-950 dark:via-amber-950 dark:to-orange-950 border border-yellow-200 dark:border-yellow-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900 dark:to-amber-900 rounded-t-lg border-b border-yellow-200 dark:border-yellow-800">
              <CardTitle className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                Chờ xử lý
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                {requests.filter((r) => r.status === "pending").length}
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Đang chờ Admin xem xét
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950 dark:via-green-950 dark:to-teal-950 border border-emerald-200 dark:border-emerald-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 rounded-t-lg border-b border-emerald-200 dark:border-emerald-800">
              <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                Đã phê duyệt
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
                {requests.filter((r) => r.status === "approved").length}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                Coordinator đã được tạo
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-red-950 dark:via-rose-950 dark:to-pink-950 border border-red-200 dark:border-red-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900 dark:to-rose-900 rounded-t-lg border-b border-red-200 dark:border-red-800">
              <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">
                Từ chối
              </CardTitle>
              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800 dark:text-red-200">
                {requests.filter((r) => r.status === "rejected").length}
              </div>
              <p className="text-xs text-red-600 dark:text-red-400">
                Cần xem xét lại
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Request Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-gradient-to-r from-slate-100 via-gray-100 to-zinc-100 dark:from-slate-800 dark:via-gray-800 dark:to-zinc-800 border border-slate-200 dark:border-slate-700 shadow-md">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Tất cả
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Chờ xử lý
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Đã phê duyệt
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Từ chối
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            <Card className="bg-gradient-to-br from-white via-slate-50 to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 border border-slate-200 dark:border-slate-700 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 rounded-t-lg border-b border-indigo-200 dark:border-indigo-800">
                <CardTitle className="text-indigo-900 dark:text-indigo-100">
                  Danh sách yêu cầu
                </CardTitle>
                <CardDescription className="text-indigo-700 dark:text-indigo-300">
                  {filteredRequests.length} yêu cầu được tìm thấy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={tableColumns}
                  data={filteredRequests}
                  actions={tableActions}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Request Dialog */}
        <Dialog open={createDialog.isOpen} onOpenChange={createDialog.close}>
          <DialogContent className="max-w-2xl bg-gradient-to-br from-white via-slate-50 to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 border border-slate-200 dark:border-slate-700 shadow-xl">
            <DialogHeader className="bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 rounded-t-lg p-4 -m-6 mb-4 border-b border-blue-200 dark:border-blue-800">
              <DialogTitle className="text-blue-900 dark:text-blue-100">
                Yêu cầu Coordinator mới
              </DialogTitle>
              <DialogDescription className="text-blue-700 dark:text-blue-300">
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
              <Button variant="outline" onClick={createDialog.close}>
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
        <Dialog open={viewModal.isOpen} onOpenChange={viewModal.close}>
          <DialogContent className="max-w-2xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30 border-gradient-to-r border-blue-200/50 dark:border-blue-800/50">
            <DialogHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/50 dark:to-purple-950/50 p-4 rounded-lg border border-blue-200/30 dark:border-blue-800/30">
              <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                Chi tiết yêu cầu Coordinator
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300">
                Thông tin chi tiết về yêu cầu tạo Coordinator
              </DialogDescription>
            </DialogHeader>
            {viewModal.data && (
              <div className="space-y-4 bg-gradient-to-br from-gray-50/50 via-blue-50/30 to-purple-50/30 dark:from-gray-800/50 dark:via-blue-900/30 dark:to-purple-900/30 p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-white/60 to-blue-50/60 dark:from-gray-800/60 dark:to-blue-900/60 p-3 rounded-lg border border-blue-200/30 dark:border-blue-800/30">
                    <Label className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Tên Coordinator
                    </Label>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {viewModal.data.coordinatorName}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-white/60 to-purple-50/60 dark:from-gray-800/60 dark:to-purple-900/60 p-3 rounded-lg border border-purple-200/30 dark:border-purple-800/30">
                    <Label className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Email
                    </Label>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {viewModal.data.coordinatorEmail}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-white/60 to-green-50/60 dark:from-gray-800/60 dark:to-green-900/60 p-3 rounded-lg border border-green-200/30 dark:border-green-800/30">
                    <Label className="text-sm font-medium bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      Số điện thoại
                    </Label>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {viewModal.data.phoneNumber || "Không có"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-white/60 to-orange-50/60 dark:from-gray-800/60 dark:to-orange-900/60 p-3 rounded-lg border border-orange-200/30 dark:border-orange-800/30">
                    <Label className="text-sm font-medium bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      Trạng thái
                    </Label>
                    <div className="mt-1">
                      {getStatusBadge(viewModal.data.status)}
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-white/60 to-indigo-50/60 dark:from-gray-800/60 dark:to-indigo-900/60 p-4 rounded-lg border border-indigo-200/30 dark:border-indigo-800/30">
                  <Label className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Lý do yêu cầu
                  </Label>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                    {viewModal.data.justification}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-white/60 to-teal-50/60 dark:from-gray-800/60 dark:to-teal-900/60 p-4 rounded-lg border border-teal-200/30 dark:border-teal-800/30">
                  <Label className="text-sm font-medium bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    Trách nhiệm dự kiến
                  </Label>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 mt-2 list-disc list-inside space-y-1">
                    {viewModal.data.expectedResponsibilities.map(
                      (responsibility: string, index: number) => (
                        <li key={index} className="leading-relaxed">
                          {responsibility}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-white/60 to-cyan-50/60 dark:from-gray-800/60 dark:to-cyan-900/60 p-3 rounded-lg border border-cyan-200/30 dark:border-cyan-800/30">
                    <Label className="text-sm font-medium bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                      Ngày yêu cầu
                    </Label>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {viewModal.data.requestDate}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-white/60 to-emerald-50/60 dark:from-gray-800/60 dark:to-emerald-900/60 p-3 rounded-lg border border-emerald-200/30 dark:border-emerald-800/30">
                    <Label className="text-sm font-medium bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      Ngày phản hồi
                    </Label>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {viewModal.data.responseDate || "Chưa có"}
                    </p>
                  </div>
                </div>
                {viewModal.data.adminNotes && (
                  <div className="bg-gradient-to-r from-white/60 to-amber-50/60 dark:from-gray-800/60 dark:to-amber-900/60 p-4 rounded-lg border border-amber-200/30 dark:border-amber-800/30">
                    <Label className="text-sm font-medium bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      Ghi chú từ Admin
                    </Label>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                      {viewModal.data.adminNotes}
                    </p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="bg-gradient-to-r from-gray-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-900/50 p-4 rounded-lg border-t border-gray-200/50 dark:border-gray-700/50">
              <Button
                variant="outline"
                onClick={viewModal.close}
                className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border-gray-300 dark:border-gray-600 hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 text-gray-700 dark:text-gray-300"
              >
                Đóng
              </Button>
              {viewModal.data?.status === "pending" && (
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
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
