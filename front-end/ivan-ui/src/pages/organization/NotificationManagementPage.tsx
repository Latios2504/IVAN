import { useState } from "react";
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
  DataTable,
  type TableColumn,
  type TableAction,
} from "@/components/common/DataTable";
import { useModal } from "@/hooks/useModal";
import { toast } from "sonner";
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
} from "lucide-react";

// Notification interface
interface Notification {
  id: string;
  title: string;
  content: string;
  type:
    | "recruitment"
    | "update"
    | "reminder"
    | "announcement"
    | "alert"
    | "appreciation";
  priority: "low" | "medium" | "high" | "urgent";
  status: "draft" | "scheduled" | "sent" | "failed";
  targetAudience: string;
  recipientCount: number;
  openRate: number;
  clickRate: number;
  channels: string[];
  scheduledTime: string | null;
  sentTime: string | null;
  createdBy: string;
  tags: string[];
}

// Mock data for notifications
const mockNotifications: Notification[] = [
  {
    id: "notif-001",
    title: "Thông báo tuyển tình nguyện viên",
    content:
      "Chương trình giáo dục số cho trẻ em vùng cao đang tuyển thêm 20 tình nguyện viên. Hạn đăng ký: 15/02/2024",
    type: "recruitment",
    priority: "high",
    status: "sent",
    targetAudience: "volunteers",
    recipientCount: 250,
    openRate: 0.85,
    clickRate: 0.32,
    channels: ["email", "push", "sms"],
    scheduledTime: "2024-01-20T09:00:00Z",
    sentTime: "2024-01-20T09:05:00Z",
    createdBy: "Nguyễn Thị Lan",
    tags: ["tuyển dụng", "giáo dục", "vùng cao"],
  },
  {
    id: "notif-002",
    title: "Cập nhật lịch trình sự kiện",
    content:
      "Lịch trình chương trình trồng cây xanh đã được cập nhật. Vui lòng kiểm tra thông tin mới nhất.",
    type: "update",
    priority: "medium",
    status: "scheduled",
    targetAudience: "event_participants",
    recipientCount: 45,
    openRate: 0,
    clickRate: 0,
    channels: ["email", "push"],
    scheduledTime: "2024-01-22T14:00:00Z",
    sentTime: null,
    createdBy: "Trần Văn Minh",
    tags: ["cập nhật", "lịch trình", "môi trường"],
  },
  {
    id: "notif-003",
    title: "Thông báo hoãn sự kiện",
    content:
      "Do thời tiết không thuận lợi, sự kiện hỗ trợ người cao tuổi được hoãn sang tuần tới. Chúng tôi sẽ thông báo lịch mới sớm nhất.",
    type: "announcement",
    priority: "urgent",
    status: "sent",
    targetAudience: "all",
    recipientCount: 180,
    openRate: 0.92,
    clickRate: 0.15,
    channels: ["email", "push", "sms"],
    scheduledTime: "2024-01-18T16:00:00Z",
    sentTime: "2024-01-18T16:02:00Z",
    createdBy: "Lê Thị Hương",
    tags: ["hoãn", "thời tiết", "khẩn cấp"],
  },
  {
    id: "notif-004",
    title: "Chúc mừng hoàn thành dự án",
    content:
      "Chúc mừng các tình nguyện viên đã hoàn thành xuất sắc chương trình cứu trợ khẩn cấp. Cảm ơn sự đóng góp của mọi người!",
    type: "appreciation",
    priority: "low",
    status: "draft",
    targetAudience: "project_volunteers",
    recipientCount: 35,
    openRate: 0,
    clickRate: 0,
    channels: ["email"],
    scheduledTime: null,
    sentTime: null,
    createdBy: "Phạm Văn Đức",
    tags: ["cảm ơn", "hoàn thành", "dự án"],
  },
];

// Mock notification templates
const mockTemplates = [
  {
    id: "template-001",
    name: "Thông báo tuyển tình nguyện viên",
    category: "recruitment",
    subject: "Cơ hội tham gia hoạt động tình nguyện",
    content:
      "Chúng tôi đang tìm kiếm {volunteer_count} tình nguyện viên cho dự án {project_name}. Thời gian: {start_date} - {end_date}. Địa điểm: {location}.",
    variables: [
      "volunteer_count",
      "project_name",
      "start_date",
      "end_date",
      "location",
    ],
    usage: 25,
  },
  {
    id: "template-002",
    name: "Nhắc nhở sự kiện sắp diễn ra",
    category: "reminder",
    subject: "Nhắc nhở: Sự kiện {event_name} sắp bắt đầu",
    content:
      "Xin chào {volunteer_name}, sự kiện {event_name} sẽ diễn ra vào {event_date} tại {event_location}. Hãy chuẩn bị sẵn sàng!",
    variables: ["volunteer_name", "event_name", "event_date", "event_location"],
    usage: 45,
  },
  {
    id: "template-003",
    name: "Cảm ơn sau sự kiện",
    category: "appreciation",
    subject: "Cảm ơn sự tham gia của bạn",
    content:
      "Cảm ơn {volunteer_name} đã tham gia {event_name}. Sự đóng góp của bạn đã tạo ra tác động tích cực cho cộng đồng.",
    variables: ["volunteer_name", "event_name"],
    usage: 38,
  },
];

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  scheduled: "bg-blue-100 text-blue-800",
  sent: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

const typeIcons = {
  recruitment: Users,
  update: Info,
  announcement: Bell,
  appreciation: CheckCircle,
  reminder: Calendar,
  alert: AlertTriangle,
};

export default function NotificationManagementPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [templates, setTemplates] = useState(mockTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [activeTab, setActiveTab] = useState("notifications");

  // Hooks
  const createModal = useModal();
  const templateModal = useModal();
  const settingsModal = useModal();
  const viewModal = useModal();
  // Remove useToast hook since we're using sonner directly

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
    dailyDigest: true,
    weeklyReport: true,
    autoReminders: true,
    templates: {
      beforeEvent: true,
      afterEvent: true,
      recruitment: true,
    },
  });

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || notif.status === statusFilter;
    const matchesType = typeFilter === "all" || notif.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Statistics
  const notificationStats = {
    total: notifications.length,
    sent: notifications.filter((n) => n.status === "sent").length,
    scheduled: notifications.filter((n) => n.status === "scheduled").length,
    draft: notifications.filter((n) => n.status === "draft").length,
    totalRecipients: notifications.reduce(
      (sum, n) => sum + n.recipientCount,
      0
    ),
    avgOpenRate: notifications
      .filter((n) => n.openRate > 0)
      .reduce((sum, n, _, arr) => sum + n.openRate / arr.length, 0),
    avgClickRate: notifications
      .filter((n) => n.clickRate > 0)
      .reduce((sum, n, _, arr) => sum + n.clickRate / arr.length, 0),
  };
  const handleViewNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    viewModal.open();
  };

  const handleSendNotification = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notifId
          ? { ...n, status: "sent", sentTime: new Date().toISOString() }
          : n
      )
    );
    toast.success("Thông báo đã được gửi thành công");
  };

  // DataTable columns configuration
  const notificationColumns: TableColumn<Notification>[] = [
    {
      key: "title",
      header: "Thông báo",
      render: (_, notification) => (
        <div>
          <div className="font-medium">{notification.title}</div>
          <div className="text-sm text-gray-500 truncate max-w-64">
            {notification.content}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Loại",
      render: (_, notification) => {
        const TypeIcon =
          typeIcons[notification.type as keyof typeof typeIcons] || Bell;
        const typeLabels: Record<string, string> = {
          recruitment: "Tuyển dụng",
          update: "Cập nhật",
          announcement: "Thông báo",
          appreciation: "Cảm ơn",
          reminder: "Nhắc nhở",
          alert: "Cảnh báo",
        };
        return (
          <div className="flex items-center gap-2">
            <TypeIcon className="w-4 h-4 text-gray-500" />
            <span>{typeLabels[notification.type] || notification.type}</span>
          </div>
        );
      },
    },
    {
      key: "priority",
      header: "Ưu tiên",
      render: (_, notification) => {
        const priorityLabels: Record<string, string> = {
          low: "Thấp",
          medium: "Trung bình",
          high: "Cao",
          urgent: "Khẩn cấp",
        };
        return (
          <Badge
            className={
              priorityColors[
                notification.priority as keyof typeof priorityColors
              ]
            }
          >
            {priorityLabels[notification.priority]}
          </Badge>
        );
      },
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (_, notification) => {
        const statusLabels: Record<string, string> = {
          draft: "Nháp",
          scheduled: "Đã lên lịch",
          sent: "Đã gửi",
          failed: "Thất bại",
        };
        return (
          <Badge
            className={
              statusColors[notification.status as keyof typeof statusColors]
            }
          >
            {statusLabels[notification.status]}
          </Badge>
        );
      },
    },
    {
      key: "recipientCount",
      header: "Người nhận",
      render: (_, notification) => (
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-gray-400" />
          {notification.recipientCount.toLocaleString()}
        </div>
      ),
    },
    {
      key: "openRate",
      header: "Tỷ lệ mở",
      render: (_, notification) =>
        notification.openRate > 0 ? (
          <div className="space-y-1">
            <div className="text-sm font-medium">
              {formatPercentage(notification.openRate)}
            </div>
            <div className="text-xs text-gray-500">
              Click: {formatPercentage(notification.clickRate)}
            </div>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      key: "sentTime",
      header: "Thời gian",
      render: (_, notification) => (
        <div className="text-sm">
          <div>
            {formatDateTime(
              notification.sentTime || notification.scheduledTime
            )}
          </div>
          <div className="text-gray-500">{notification.createdBy}</div>
        </div>
      ),
    },
  ];

  const notificationActions: TableAction<Notification>[] = [
    {
      label: "Xem chi tiết",
      onClick: handleViewNotification,
    },
    {
      label: "Gửi ngay",
      onClick: (notification: Notification) =>
        handleSendNotification(notification.id),
      visible: (notification: Notification) => notification.status === "draft",
    },
    {
      label: "Chỉnh sửa lịch",
      onClick: () => {},
      visible: (notification: Notification) =>
        notification.status === "scheduled",
    },
    {
      label: "Sao chép",
      onClick: () => {},
    },
    {
      label: "Xóa",
      onClick: () => {},
      variant: "destructive" as const,
    },
  ];

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "Chưa xác định";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý thông báo
          </h1>
          <p className="text-gray-600 mt-1">
            Tạo và gửi thông báo đến tình nguyện viên và tổ chức
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog
            open={settingsModal.isOpen}
            onOpenChange={(open) =>
              open ? settingsModal.open() : settingsModal.close()
            }
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Cài đặt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cài đặt thông báo</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Kênh thông báo</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-sm text-gray-500">
                            Gửi thông báo qua email
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationSettings.emailEnabled}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            emailEnabled: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium">Push Notification</p>
                          <p className="text-sm text-gray-500">
                            Thông báo đẩy trên ứng dụng
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationSettings.pushEnabled}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            pushEnabled: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium">SMS</p>
                          <p className="text-sm text-gray-500">
                            Tin nhắn SMS khẩn cấp
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationSettings.smsEnabled}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            smsEnabled: checked,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Thông báo tự động
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Báo cáo hàng ngày</p>
                        <p className="text-sm text-gray-500">
                          Tự động gửi tóm tắt hoạt động hàng ngày
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.dailyDigest}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            dailyDigest: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Báo cáo hàng tuần</p>
                        <p className="text-sm text-gray-500">
                          Báo cáo tổng hợp hoạt động trong tuần
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.weeklyReport}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            weeklyReport: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Nhắc nhở tự động</p>
                        <p className="text-sm text-gray-500">
                          Tự động nhắc nhở trước sự kiện
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.autoReminders}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            autoReminders: checked,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => settingsModal.close()}
                  >
                    Hủy
                  </Button>
                  <Button onClick={() => settingsModal.close()}>
                    Lưu cài đặt
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={createModal.isOpen}
            onOpenChange={(open) =>
              open ? createModal.open() : createModal.close()
            }
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tạo thông báo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Tạo thông báo mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Tiêu đề thông báo</Label>
                    <Input id="title" placeholder="Nhập tiêu đề thông báo" />
                  </div>
                  <div>
                    <Label htmlFor="type">Loại thông báo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại thông báo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recruitment">Tuyển dụng</SelectItem>
                        <SelectItem value="update">Cập nhật</SelectItem>
                        <SelectItem value="announcement">Thông báo</SelectItem>
                        <SelectItem value="reminder">Nhắc nhở</SelectItem>
                        <SelectItem value="appreciation">Cảm ơn</SelectItem>
                        <SelectItem value="alert">Cảnh báo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">Nội dung thông báo</Label>
                  <Textarea
                    id="content"
                    placeholder="Nhập nội dung chi tiết thông báo..."
                    className="min-h-32"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="priority">Mức độ ưu tiên</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn mức ưu tiên" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Thấp</SelectItem>
                        <SelectItem value="medium">Trung bình</SelectItem>
                        <SelectItem value="high">Cao</SelectItem>
                        <SelectItem value="urgent">Khẩn cấp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="audience">Đối tượng</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn đối tượng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="volunteers">
                          Tình nguyện viên
                        </SelectItem>
                        <SelectItem value="organizations">Tổ chức</SelectItem>
                        <SelectItem value="event_participants">
                          Người tham gia sự kiện
                        </SelectItem>
                        <SelectItem value="project_volunteers">
                          Tình nguyện viên dự án
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="scheduledTime">Thời gian gửi</Label>
                    <Input id="scheduledTime" type="datetime-local" />
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">
                    Kênh gửi thông báo
                  </Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email" defaultChecked />
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="push" defaultChecked />
                      <Label htmlFor="push" className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Push
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sms" />
                      <Label htmlFor="sms" className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        SMS
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (cách nhau bằng dấu phẩy)</Label>
                  <Input
                    id="tags"
                    placeholder="tuyển dụng, khẩn cấp, giáo dục"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => createModal.close()}>
                    Hủy
                  </Button>
                  <Button variant="outline">Lưu nháp</Button>
                  <Button onClick={() => createModal.close()}>Gửi ngay</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng thông báo
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {notificationStats.total}
                </p>
              </div>
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã gửi</p>
                <p className="text-2xl font-bold text-green-600">
                  {notificationStats.sent}
                </p>
              </div>
              <Send className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tỷ lệ mở</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatPercentage(notificationStats.avgOpenRate)}
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Người nhận</p>
                <p className="text-2xl font-bold text-orange-600">
                  {notificationStats.totalRecipients.toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">
            Thông báo ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="templates">
            Mẫu thông báo ({templates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm thông báo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="draft">Nháp</SelectItem>
                    <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                    <SelectItem value="sent">Đã gửi</SelectItem>
                    <SelectItem value="failed">Thất bại</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Lọc theo loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="recruitment">Tuyển dụng</SelectItem>
                    <SelectItem value="update">Cập nhật</SelectItem>
                    <SelectItem value="announcement">Thông báo</SelectItem>
                    <SelectItem value="appreciation">Cảm ơn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Danh sách thông báo ({filteredNotifications.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <DataTable
                  data={filteredNotifications}
                  columns={notificationColumns}
                  actions={notificationActions}
                  emptyMessage="Không tìm thấy thông báo nào"
                  className="min-w-full"
                />
              </div>

              {filteredNotifications.length === 0 && (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    Không tìm thấy thông báo nào
                  </p>
                  <p className="text-gray-400">
                    Thử thay đổi bộ lọc hoặc tạo thông báo mới
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        {template.name}
                      </h3>
                      <Badge variant="outline" className="mb-3">
                        {template.category === "recruitment" && "Tuyển dụng"}
                        {template.category === "reminder" && "Nhắc nhở"}
                        {template.category === "appreciation" && "Cảm ơn"}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Sử dụng mẫu</DropdownMenuItem>
                        <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                        <DropdownMenuItem>Sao chép</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Tiêu đề:
                      </p>
                      <p className="text-sm text-gray-600">
                        {template.subject}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Nội dung:
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {template.content}
                      </p>
                    </div>

                    {template.variables && template.variables.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Biến:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {template.variables.map((variable, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {variable}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Đã dùng: {template.usage} lần
                      </span>
                      <Button size="sm">Sử dụng</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                Tạo mẫu thông báo mới
              </p>
              <p className="text-gray-400 mb-4">
                Tạo mẫu để tái sử dụng cho các thông báo tương tự
              </p>
              <Dialog
                open={templateModal.isOpen}
                onOpenChange={(open) =>
                  open ? templateModal.open() : templateModal.close()
                }
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo mẫu
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Tạo mẫu thông báo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="templateName">Tên mẫu</Label>
                        <Input id="templateName" placeholder="Nhập tên mẫu" />
                      </div>
                      <div>
                        <Label htmlFor="category">Danh mục</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="recruitment">
                              Tuyển dụng
                            </SelectItem>
                            <SelectItem value="reminder">Nhắc nhở</SelectItem>
                            <SelectItem value="appreciation">Cảm ơn</SelectItem>
                            <SelectItem value="update">Cập nhật</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject">Tiêu đề mẫu</Label>
                      <Input
                        id="subject"
                        placeholder="Tiêu đề có thể chứa biến như {event_name}"
                      />
                    </div>
                    <div>
                      <Label htmlFor="templateContent">Nội dung mẫu</Label>
                      <Textarea
                        id="templateContent"
                        placeholder="Nội dung mẫu với các biến như {volunteer_name}, {event_date}..."
                        className="min-h-32"
                      />
                    </div>
                    <div>
                      <Label htmlFor="variables">
                        Danh sách biến (cách nhau bằng dấu phẩy)
                      </Label>
                      <Input
                        id="variables"
                        placeholder="volunteer_name, event_name, event_date"
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => templateModal.close()}
                      >
                        Hủy
                      </Button>
                      <Button onClick={() => templateModal.close()}>
                        Tạo mẫu
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notification Detail Dialog */}
      <Dialog
        open={viewModal.isOpen}
        onOpenChange={(open) => (open ? viewModal.open() : viewModal.close())}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi tiết thông báo</DialogTitle>
          </DialogHeader>
          {selectedNotification && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {selectedNotification.title}
                  </h3>
                  <div className="flex gap-2 mb-4">
                    <Badge
                      className={priorityColors[selectedNotification.priority]}
                    >
                      {selectedNotification.priority === "low" && "Thấp"}
                      {selectedNotification.priority === "medium" &&
                        "Trung bình"}
                      {selectedNotification.priority === "high" && "Cao"}
                      {selectedNotification.priority === "urgent" && "Khẩn cấp"}
                    </Badge>
                    <Badge
                      className={statusColors[selectedNotification.status]}
                    >
                      {selectedNotification.status === "draft" && "Nháp"}
                      {selectedNotification.status === "scheduled" &&
                        "Đã lên lịch"}
                      {selectedNotification.status === "sent" && "Đã gửi"}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {selectedNotification.content}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Người tạo:</span>
                      <span>{selectedNotification.createdBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Đối tượng:</span>
                      <span>{selectedNotification.targetAudience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Người nhận:</span>
                      <span>
                        {selectedNotification.recipientCount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Kênh gửi</h4>
                    <div className="flex gap-2">
                      {selectedNotification.channels.map((channel) => (
                        <Badge key={channel} variant="outline">
                          {channel === "email" && (
                            <Mail className="w-3 h-3 mr-1" />
                          )}
                          {channel === "push" && (
                            <Bell className="w-3 h-3 mr-1" />
                          )}
                          {channel === "sms" && (
                            <Smartphone className="w-3 h-3 mr-1" />
                          )}
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Thời gian</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Lên lịch:</span>
                        <span>
                          {formatDateTime(selectedNotification.scheduledTime)}
                        </span>
                      </div>
                      {selectedNotification.sentTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Đã gửi:</span>
                          <span>
                            {formatDateTime(selectedNotification.sentTime)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedNotification.status === "sent" && (
                    <div>
                      <h4 className="font-medium mb-2">Thống kê</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tỷ lệ mở:</span>
                          <span className="font-medium">
                            {formatPercentage(selectedNotification.openRate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tỷ lệ click:</span>
                          <span className="font-medium">
                            {formatPercentage(selectedNotification.clickRate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedNotification.tags &&
                selectedNotification.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedNotification.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
