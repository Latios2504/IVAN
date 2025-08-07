import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Bell,
  Plus,
  Search,
  Send,
  MoreHorizontal,
  Mail,
  MessageSquare,
  Smartphone,
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  Eye,
  Settings,
  Filter,
  Download,
  Archive,
  Shield,
  Building,
  UserCheck,
} from "lucide-react";

// System Notification interface for admin
interface SystemNotification {
  id: string;
  title: string;
  content: string;
  type:
    | "system_maintenance"
    | "security_alert"
    | "policy_update"
    | "system_announcement"
    | "user_notification"
    | "organization_alert";
  priority: "low" | "medium" | "high" | "critical";
  status: "draft" | "scheduled" | "sent" | "failed";
  targetAudience:
    | "all_users"
    | "organizations"
    | "volunteers"
    | "partners"
    | "coordinators"
    | "admins";
  recipientCount: number;
  openRate: number;
  clickRate: number;
  channels: string[];
  scheduledTime: string | null;
  sentTime: string | null;
  createdBy: string;
  tags: string[];
  organizationFilter?: string[];
}

// Mock data for admin system notifications
const mockSystemNotifications: SystemNotification[] = [
  {
    id: "sys-001",
    title: "Bảo trì hệ thống định kỳ",
    content:
      "Hệ thống sẽ được bảo trì từ 02:00-04:00 ngày 25/01/2024. Trong thời gian này, các tính năng có thể bị gián đoạn tạm thời.",
    type: "system_maintenance",
    priority: "high",
    status: "scheduled",
    targetAudience: "all_users",
    recipientCount: 1250,
    openRate: 0,
    clickRate: 0,
    channels: ["email", "push", "in_app"],
    scheduledTime: "2024-01-24T18:00:00Z",
    sentTime: null,
    createdBy: "System Admin",
    tags: ["bảo trì", "hệ thống", "định kỳ"],
  },
  {
    id: "sys-002",
    title: "Cảnh báo bảo mật - Cập nhật mật khẩu",
    content:
      "Phát hiện hoạt động đăng nhập bất thường. Khuyến nghị tất cả người dùng thay đổi mật khẩu và kích hoạt xác thực 2 lớp.",
    type: "security_alert",
    priority: "critical",
    status: "sent",
    targetAudience: "all_users",
    recipientCount: 1250,
    openRate: 0.95,
    clickRate: 0.78,
    channels: ["email", "push", "sms", "in_app"],
    scheduledTime: "2024-01-20T10:00:00Z",
    sentTime: "2024-01-20T10:02:00Z",
    createdBy: "Security Team",
    tags: ["bảo mật", "khẩn cấp", "mật khẩu", "2FA"],
  },
  {
    id: "sys-003",
    title: "Cập nhật chính sách bảo mật dữ liệu",
    content:
      "Chính sách bảo mật và xử lý dữ liệu cá nhân đã được cập nhật theo quy định mới. Vui lòng đọc và xác nhận đã hiểu.",
    type: "policy_update",
    priority: "medium",
    status: "sent",
    targetAudience: "organizations",
    recipientCount: 85,
    openRate: 0.72,
    clickRate: 0.45,
    channels: ["email", "in_app"],
    scheduledTime: "2024-01-18T09:00:00Z",
    sentTime: "2024-01-18T09:05:00Z",
    createdBy: "Legal Team",
    tags: ["chính sách", "GDPR", "dữ liệu", "cập nhật"],
  },
  {
    id: "sys-004",
    title: "Tích hợp tính năng mới - AI Chatbot",
    content:
      "Hệ thống đã tích hợp AI Chatbot hỗ trợ tự động. Tính năng này giúp trả lời các câu hỏi thường gặp 24/7.",
    type: "system_announcement",
    priority: "low",
    status: "sent",
    targetAudience: "all_users",
    recipientCount: 1250,
    openRate: 0.68,
    clickRate: 0.23,
    channels: ["email", "push", "in_app"],
    scheduledTime: "2024-01-15T12:00:00Z",
    sentTime: "2024-01-15T12:05:00Z",
    createdBy: "Product Team",
    tags: ["tính năng mới", "AI", "chatbot", "hỗ trợ"],
  },
];

// Template categories for system notifications
const notificationTemplates = [
  {
    category: "Bảo trì hệ thống",
    templates: [
      "Thông báo bảo trì định kỳ",
      "Nâng cấp hệ thống khẩn cấp",
      "Khôi phục dịch vụ sau sự cố",
    ],
  },
  {
    category: "Bảo mật",
    templates: [
      "Cảnh báo bảo mật",
      "Yêu cầu cập nhật mật khẩu",
      "Thông báo vi phạm bảo mật",
    ],
  },
  {
    category: "Chính sách",
    templates: [
      "Cập nhật điều khoản sử dụng",
      "Thay đổi chính sách riêng tư",
      "Quy định mới về dữ liệu",
    ],
  },
  {
    category: "Tính năng",
    templates: [
      "Ra mắt tính năng mới",
      "Cải tiến giao diện",
      "Tích hợp công cụ mới",
    ],
  },
];

export default function AdminNotificationManagementPage() {
  const [notifications, setNotifications] = useState<SystemNotification[]>(
    mockSystemNotifications
  );
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  // Modal hooks for managing dialog states
  const createDialog = useModal();

  const [selectedNotification, setSelectedNotification] =
    useState<SystemNotification | null>(null);
  const [activeTab, setActiveTab] = useState("notifications");

  // Form state for creating/editing notifications
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "system_announcement" as SystemNotification["type"],
    priority: "medium" as SystemNotification["priority"],
    targetAudience: "all_users" as SystemNotification["targetAudience"],
    channels: [] as string[],
    scheduledTime: "",
    tags: "",
  });

  // Filter notifications based on search and filters
  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      filterStatus === "all" || notif.status === filterStatus;
    const matchesType = filterType === "all" || notif.type === filterType;
    const matchesPriority =
      filterPriority === "all" || notif.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  // Get notification type badge color
  const getTypeBadgeColor = (type: SystemNotification["type"]) => {
    const colors = {
      system_maintenance: "bg-blue-100 text-blue-800",
      security_alert: "bg-red-100 text-red-800",
      policy_update: "bg-purple-100 text-purple-800",
      system_announcement: "bg-green-100 text-green-800",
      user_notification: "bg-yellow-100 text-yellow-800",
      organization_alert: "bg-orange-100 text-orange-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority: SystemNotification["priority"]) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-yellow-100 text-yellow-800",
      critical: "bg-red-100 text-red-800",
    };
    return colors[priority];
  };

  // Get status badge color
  const getStatusBadgeColor = (status: SystemNotification["status"]) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      scheduled: "bg-blue-100 text-blue-800",
      sent: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newNotification: SystemNotification = {
      id: `sys-${Date.now()}`,
      title: formData.title,
      content: formData.content,
      type: formData.type,
      priority: formData.priority,
      status: formData.scheduledTime ? "scheduled" : "draft",
      targetAudience: formData.targetAudience,
      recipientCount: 0,
      openRate: 0,
      clickRate: 0,
      channels: formData.channels,
      scheduledTime: formData.scheduledTime || null,
      sentTime: null,
      createdBy: "Admin User",
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    setNotifications([newNotification, ...notifications]);
    createDialog.close();

    // Reset form
    setFormData({
      title: "",
      content: "",
      type: "system_announcement",
      priority: "medium",
      targetAudience: "all_users",
      channels: [],
      scheduledTime: "",
      tags: "",
    });
  };

  // Handle channel selection
  const handleChannelChange = (channel: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        channels: [...prev.channels, channel],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        channels: prev.channels.filter((c) => c !== channel),
      }));
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    if (selectedNotifications.length === 0) return;

    switch (action) {
      case "delete":
        setNotifications((prev) =>
          prev.filter((notif) => !selectedNotifications.includes(notif.id))
        );
        break;
      case "archive":
        // Archive functionality would be implemented here
        break;
      case "send":
        setNotifications((prev) =>
          prev.map((notif) =>
            selectedNotifications.includes(notif.id) && notif.status === "draft"
              ? {
                  ...notif,
                  status: "sent" as const,
                  sentTime: new Date().toISOString(),
                }
              : notif
          )
        );
        break;
    }

    setSelectedNotifications([]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý thông báo hệ thống
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý và gửi thông báo toàn hệ thống đến người dùng
          </p>
        </div>

        <Dialog open={createDialog.isOpen} onOpenChange={createDialog.close}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tạo thông báo mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tạo thông báo hệ thống mới</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề thông báo</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Nhập tiêu đề..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Loại thông báo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        type: value as SystemNotification["type"],
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system_maintenance">
                        Bảo trì hệ thống
                      </SelectItem>
                      <SelectItem value="security_alert">
                        Cảnh báo bảo mật
                      </SelectItem>
                      <SelectItem value="policy_update">
                        Cập nhật chính sách
                      </SelectItem>
                      <SelectItem value="system_announcement">
                        Thông báo hệ thống
                      </SelectItem>
                      <SelectItem value="user_notification">
                        Thông báo người dùng
                      </SelectItem>
                      <SelectItem value="organization_alert">
                        Cảnh báo tổ chức
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung thông báo</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="Nhập nội dung thông báo..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Mức độ ưu tiên</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        priority: value as SystemNotification["priority"],
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Thấp</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="high">Cao</SelectItem>
                      <SelectItem value="critical">Khẩn cấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Đối tượng nhận</Label>
                  <Select
                    value={formData.targetAudience}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        targetAudience:
                          value as SystemNotification["targetAudience"],
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_users">
                        Tất cả người dùng
                      </SelectItem>
                      <SelectItem value="organizations">Tổ chức</SelectItem>
                      <SelectItem value="volunteers">
                        Tình nguyện viên
                      </SelectItem>
                      <SelectItem value="partners">Đối tác</SelectItem>
                      <SelectItem value="coordinators">
                        Điều phối viên
                      </SelectItem>
                      <SelectItem value="admins">Quản trị viên</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Kênh gửi thông báo</Label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { id: "email", label: "Email", icon: Mail },
                    { id: "push", label: "Push notification", icon: Bell },
                    { id: "sms", label: "SMS", icon: Smartphone },
                    {
                      id: "in_app",
                      label: "Trong ứng dụng",
                      icon: MessageSquare,
                    },
                  ].map(({ id, label, icon: Icon }) => (
                    <div key={id} className="flex items-center space-x-2">
                      <Checkbox
                        id={id}
                        checked={formData.channels.includes(id)}
                        onCheckedChange={(checked) =>
                          handleChannelChange(id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledTime">Lên lịch gửi (tùy chọn)</Label>
                  <Input
                    id="scheduledTime"
                    type="datetime-local"
                    value={formData.scheduledTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        scheduledTime: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, tags: e.target.value }))
                    }
                    placeholder="ví dụ: bảo trì, khẩn cấp, hệ thống"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => createDialog.close()}
                >
                  Hủy
                </Button>
                <Button type="submit">Tạo thông báo</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Danh sách thông báo
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Mẫu thông báo
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Thống kê
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Cài đặt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Tổng thông báo
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {notifications.length}
                    </p>
                  </div>
                  <Bell className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Đã gửi</p>
                    <p className="text-3xl font-bold text-green-600">
                      {notifications.filter((n) => n.status === "sent").length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Đã lên lịch
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {
                        notifications.filter((n) => n.status === "scheduled")
                          .length
                      }
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Khẩn cấp
                    </p>
                    <p className="text-3xl font-bold text-red-600">
                      {
                        notifications.filter((n) => n.priority === "critical")
                          .length
                      }
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4 flex-wrap items-center">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Tìm kiếm thông báo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                    <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                    <SelectItem value="sent">Đã gửi</SelectItem>
                    <SelectItem value="failed">Thất bại</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="system_maintenance">Bảo trì</SelectItem>
                    <SelectItem value="security_alert">Bảo mật</SelectItem>
                    <SelectItem value="policy_update">Chính sách</SelectItem>
                    <SelectItem value="system_announcement">
                      Thông báo
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filterPriority}
                  onValueChange={setFilterPriority}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="critical">Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedNotifications.length > 0 && (
                <div className="flex items-center gap-3 mt-4 p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-700">
                    Đã chọn {selectedNotifications.length} thông báo
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction("send")}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Gửi
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction("archive")}
                    >
                      <Archive className="h-4 w-4 mr-1" />
                      Lưu trữ
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction("delete")}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedNotifications.length ===
                            filteredNotifications.length &&
                          filteredNotifications.length > 0
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedNotifications(
                              filteredNotifications.map((n) => n.id)
                            );
                          } else {
                            setSelectedNotifications([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Thông báo</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Ưu tiên</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Đối tượng</TableHead>
                    <TableHead>Người nhận</TableHead>
                    <TableHead>Tỷ lệ mở</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedNotifications.includes(
                            notification.id
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedNotifications((prev) => [
                                ...prev,
                                notification.id,
                              ]);
                            } else {
                              setSelectedNotifications((prev) =>
                                prev.filter((id) => id !== notification.id)
                              );
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {notification.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {notification.content}
                          </div>
                          <div className="flex gap-1 mt-1">
                            {notification.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeBadgeColor(notification.type)}>
                          {notification.type === "system_maintenance" &&
                            "Bảo trì"}
                          {notification.type === "security_alert" && "Bảo mật"}
                          {notification.type === "policy_update" &&
                            "Chính sách"}
                          {notification.type === "system_announcement" &&
                            "Thông báo"}
                          {notification.type === "user_notification" &&
                            "Người dùng"}
                          {notification.type === "organization_alert" &&
                            "Tổ chức"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getPriorityBadgeColor(
                            notification.priority
                          )}
                        >
                          {notification.priority === "low" && "Thấp"}
                          {notification.priority === "medium" && "Trung bình"}
                          {notification.priority === "high" && "Cao"}
                          {notification.priority === "critical" && "Khẩn cấp"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusBadgeColor(notification.status)}
                        >
                          {notification.status === "draft" && "Bản nháp"}
                          {notification.status === "scheduled" && "Đã lên lịch"}
                          {notification.status === "sent" && "Đã gửi"}
                          {notification.status === "failed" && "Thất bại"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {notification.targetAudience === "all_users" &&
                            "Tất cả người dùng"}
                          {notification.targetAudience === "organizations" &&
                            "Tổ chức"}
                          {notification.targetAudience === "volunteers" &&
                            "Tình nguyện viên"}
                          {notification.targetAudience === "partners" &&
                            "Đối tác"}
                          {notification.targetAudience === "coordinators" &&
                            "Điều phối viên"}
                          {notification.targetAudience === "admins" &&
                            "Quản trị viên"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {notification.recipientCount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {notification.status === "sent" ? (
                          <div className="text-sm">
                            <div>
                              {(notification.openRate * 100).toFixed(1)}%
                            </div>
                            <div className="text-gray-500">
                              ({(notification.clickRate * 100).toFixed(1)}%
                              click)
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {notification.status === "sent" &&
                            notification.sentTime && (
                              <div>
                                Đã gửi:{" "}
                                {new Date(
                                  notification.sentTime
                                ).toLocaleDateString("vi-VN")}
                              </div>
                            )}
                          {notification.status === "scheduled" &&
                            notification.scheduledTime && (
                              <div>
                                Lên lịch:{" "}
                                {new Date(
                                  notification.scheduledTime
                                ).toLocaleDateString("vi-VN")}
                              </div>
                            )}
                          {notification.status === "draft" && (
                            <div className="text-gray-400">Bản nháp</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                setSelectedNotification(notification)
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            {notification.status === "draft" && (
                              <DropdownMenuItem>
                                <Send className="mr-2 h-4 w-4" />
                                Gửi ngay
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <X className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mẫu thông báo hệ thống</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {notificationTemplates.map((category) => (
                  <div key={category.category} className="space-y-3">
                    <h3 className="font-semibold text-lg">
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.templates.map((template) => (
                        <Card
                          key={template}
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{template}</span>
                              <Button size="sm" variant="outline">
                                Sử dụng
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tỷ lệ mở theo loại thông báo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "system_maintenance",
                    "security_alert",
                    "policy_update",
                    "system_announcement",
                  ].map((type) => {
                    const typeNotifs = notifications.filter(
                      (n) => n.type === type && n.status === "sent"
                    );
                    const avgOpenRate =
                      typeNotifs.length > 0
                        ? typeNotifs.reduce((sum, n) => sum + n.openRate, 0) /
                          typeNotifs.length
                        : 0;

                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>
                            {type === "system_maintenance" &&
                              "Bảo trì hệ thống"}
                            {type === "security_alert" && "Cảnh báo bảo mật"}
                            {type === "policy_update" && "Cập nhật chính sách"}
                            {type === "system_announcement" &&
                              "Thông báo hệ thống"}
                          </span>
                          <span>{(avgOpenRate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${avgOpenRate * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hiệu suất theo kênh gửi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["email", "push", "sms", "in_app"].map((channel) => {
                    const channelNotifs = notifications.filter(
                      (n) => n.channels.includes(channel) && n.status === "sent"
                    );
                    const avgOpenRate =
                      channelNotifs.length > 0
                        ? channelNotifs.reduce(
                            (sum, n) => sum + n.openRate,
                            0
                          ) / channelNotifs.length
                        : 0;

                    return (
                      <div key={channel} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>
                            {channel === "email" && "Email"}
                            {channel === "push" && "Push notification"}
                            {channel === "sms" && "SMS"}
                            {channel === "in_app" && "Trong ứng dụng"}
                          </span>
                          <span>{(avgOpenRate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${avgOpenRate * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo hệ thống</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">
                      Tự động phê duyệt thông báo thấp
                    </h4>
                    <p className="text-sm text-gray-600">
                      Tự động gửi thông báo có mức độ ưu tiên thấp mà không cần
                      phê duyệt
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Thông báo khẩn cấp</h4>
                    <p className="text-sm text-gray-600">
                      Gửi ngay lập tức thông báo có mức độ ưu tiên khẩn cấp
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Báo cáo analytics hàng tuần</h4>
                    <p className="text-sm text-gray-600">
                      Nhận báo cáo thống kê hiệu suất thông báo hàng tuần
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notification Detail Dialog */}
      {selectedNotification && (
        <Dialog
          open={!!selectedNotification}
          onOpenChange={() => setSelectedNotification(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết thông báo</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg">
                  {selectedNotification.title}
                </h4>
                <div className="flex gap-2 mt-2">
                  <Badge
                    className={getTypeBadgeColor(selectedNotification.type)}
                  >
                    {selectedNotification.type}
                  </Badge>
                  <Badge
                    className={getPriorityBadgeColor(
                      selectedNotification.priority
                    )}
                  >
                    {selectedNotification.priority}
                  </Badge>
                  <Badge
                    className={getStatusBadgeColor(selectedNotification.status)}
                  >
                    {selectedNotification.status}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-gray-700">{selectedNotification.content}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Đối tượng:</span>{" "}
                  {selectedNotification.targetAudience}
                </div>
                <div>
                  <span className="font-medium">Người tạo:</span>{" "}
                  {selectedNotification.createdBy}
                </div>
                <div>
                  <span className="font-medium">Số người nhận:</span>{" "}
                  {selectedNotification.recipientCount.toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Tỷ lệ mở:</span>{" "}
                  {(selectedNotification.openRate * 100).toFixed(1)}%
                </div>
              </div>

              <div>
                <span className="font-medium">Kênh gửi:</span>
                <div className="flex gap-2 mt-1">
                  {selectedNotification.channels.map((channel) => (
                    <Badge key={channel} variant="outline">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-medium">Tags:</span>
                <div className="flex gap-1 mt-1">
                  {selectedNotification.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
