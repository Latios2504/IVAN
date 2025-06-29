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
  DataTable,
  type TableColumn,
  type TableAction,
} from "@/components/common/DataTable";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/context/ToastContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Download,
  MoreHorizontal,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
} from "lucide-react";
import type { Task } from "@/types/organization-extended";

// Mock data for coordinator tasks
const mockTasks: Task[] = [
  {
    id: "task-001",
    title: "Tổ chức sự kiện từ thiện tại trường tiểu học",
    description:
      "Điều phối và quản lý hoạt động tình nguyện tại trường tiểu học Nguyễn Du",
    coordinatorName: "Nguyễn Thị Lan",
    eventName: "Chương trình học bổng cho trẻ em vùng cao",
    priority: "high",
    status: "in_progress",
    assignedDate: "2024-01-15",
    dueDate: "2024-02-15",
    completedDate: undefined,
    estimatedHours: 40,
    actualHours: 25,
    volunteers: 15,
    notes: "Tiến độ tốt, cần bổ sung thêm vật tư",
    location: "Hà Nội",
    category: "education",
  },
  {
    id: "task-002",
    title: "Quản lý chiến dịch trồng cây xanh",
    description:
      "Điều phối tình nguyện viên trong chiến dịch trồng cây xanh tại công viên",
    coordinatorName: "Trần Văn Minh",
    eventName: "Chiến dịch xanh hóa môi trường",
    priority: "medium",
    status: "completed",
    assignedDate: "2024-01-10",
    dueDate: "2024-01-25",
    completedDate: "2024-01-24",
    estimatedHours: 20,
    actualHours: 18,
    volunteers: 8,
    notes: "Hoàn thành trước thời hạn",
    location: "Hồ Chí Minh",
    category: "environment",
  },
  {
    id: "task-003",
    title: "Hỗ trợ người cao tuổi tại viện dư양lão",
    description: "Điều phối các hoạt động chăm sóc và hỗ trợ người cao tuổi",
    coordinatorName: "Lê Thị Hương",
    eventName: "Chương trình chăm sóc người cao tuổi",
    priority: "high",
    status: "pending",
    assignedDate: "2024-01-20",
    dueDate: "2024-03-01",
    completedDate: undefined,
    estimatedHours: 60,
    actualHours: 0,
    volunteers: 12,
    notes: "Chờ phê duyệt từ viện dưyang lão",
    location: "Đà Nẵng",
    category: "healthcare",
  },
  {
    id: "task-004",
    title: "Hỗ trợ khẩn cấp sau thiên tai",
    description:
      "Điều phối cứu trợ khẩn cấp cho người dân bị ảnh hưởng bởi lũ lụt",
    coordinatorName: "Phạm Văn Đức",
    eventName: "Cứu trợ khẩn cấp miền Trung",
    priority: "urgent",
    status: "overdue",
    assignedDate: "2024-01-05",
    dueDate: "2024-01-20",
    completedDate: undefined,
    estimatedHours: 80,
    actualHours: 45,
    volunteers: 25,
    notes: "Cần hỗ trợ thêm nguồn lực",
    location: "Quảng Nam",
    category: "emergency",
  },
];

const priorityColors: Record<Task["priority"], string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

const statusColors: Record<Task["status"], string> = {
  pending: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-600",
};

const statusIcons: Record<Task["status"], typeof Clock> = {
  pending: Clock,
  in_progress: AlertCircle,
  completed: CheckCircle,
  overdue: XCircle,
  cancelled: XCircle,
};

export default function CoordinatorTaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Hooks
  const createModal = useModal();
  const viewModal = useModal();
  const { showNotification } = useToast();

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.coordinatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Task statistics
  const taskStats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    overdue: tasks.filter((t) => t.status === "overdue").length,
    totalVolunteers: tasks.reduce((sum, task) => sum + task.volunteers, 0),
    totalHours: tasks.reduce((sum, task) => sum + task.actualHours, 0),
  };

  const handleExportToExcel = () => {
    // Create CSV content for Excel export
    const headers = [
      "ID",
      "Tiêu đề",
      "Điều phối viên",
      "Sự kiện",
      "Ưu tiên",
      "Trạng thái",
      "Ngày giao",
      "Hạn chót",
      "Ngày hoàn thành",
      "Giờ ước tính",
      "Giờ thực tế",
      "Số tình nguyện viên",
      "Địa điểm",
      "Danh mục",
      "Ghi chú",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredTasks.map((task) =>
        [
          task.id,
          `"${task.title}"`,
          `"${task.coordinatorName}"`,
          `"${task.eventName}"`,
          task.priority,
          task.status,
          task.assignedDate,
          task.dueDate,
          task.completedDate || "",
          task.estimatedHours,
          task.actualHours,
          task.volunteers,
          `"${task.location}"`,
          task.category,
          `"${task.notes}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `coordinator-tasks-${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // DataTable columns configuration
  const taskColumns: TableColumn<Task>[] = [
    {
      key: "title",
      header: "Nhiệm vụ",
      render: (_, task) => (
        <div>
          <div className="font-medium">{task.title}</div>
          <div className="text-sm text-gray-500 truncate max-w-64">
            {task.description}
          </div>
        </div>
      ),
    },
    {
      key: "coordinatorName",
      header: "Điều phối viên",
      render: (_, task) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span>{task.coordinatorName}</span>
        </div>
      ),
    },
    {
      key: "eventName",
      header: "Sự kiện",
      render: (_, task) => <div className="text-sm">{task.eventName}</div>,
    },
    {
      key: "priority",
      header: "Ưu tiên",
      render: (_, task) => {
        const priorityLabels: Record<string, string> = {
          low: "Thấp",
          medium: "Trung bình",
          high: "Cao",
          urgent: "Khẩn cấp",
        };
        return (
          <Badge
            className={
              priorityColors[task.priority as keyof typeof priorityColors]
            }
          >
            {priorityLabels[task.priority]}
          </Badge>
        );
      },
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (_, task) => {
        const StatusIcon = statusIcons[task.status as keyof typeof statusIcons];
        const statusLabels: Record<string, string> = {
          pending: "Chờ xử lý",
          in_progress: "Đang thực hiện",
          completed: "Hoàn thành",
          overdue: "Quá hạn",
          cancelled: "Đã hủy",
        };
        return (
          <div className="flex items-center gap-2">
            <StatusIcon className="w-4 h-4" />
            <Badge
              className={statusColors[task.status as keyof typeof statusColors]}
            >
              {statusLabels[task.status]}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "dueDate",
      header: "Hạn chót",
      render: (_, task) => {
        const isOverdue =
          new Date(task.dueDate) < new Date() && task.status !== "completed";
        return (
          <div
            className={`text-sm ${isOverdue ? "text-red-600 font-medium" : ""}`}
          >
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(task.dueDate).toLocaleDateString("vi-VN")}
            </div>
            {isOverdue && <div className="text-xs text-red-500">Quá hạn</div>}
          </div>
        );
      },
    },
    {
      key: "progress",
      header: "Tiến độ",
      render: (_, task) => {
        const progress =
          task.status === "completed"
            ? 100
            : task.status === "in_progress"
            ? 65
            : task.status === "pending"
            ? 0
            : 0;
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium">{progress}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  progress === 100
                    ? "bg-green-500"
                    : progress > 50
                    ? "bg-blue-500"
                    : "bg-gray-400"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">
              {task.actualHours}h / {task.estimatedHours}h
            </div>
          </div>
        );
      },
    },
  ];

  const taskActions: TableAction<Task>[] = [
    {
      label: "Xem chi tiết",
      onClick: (task) => {
        setSelectedTask(task);
        viewModal.open();
      },
    },
    {
      label: "Chỉnh sửa",
      onClick: () => {},
    },
    {
      label: "Đánh dấu hoàn thành",
      onClick: (task) => {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id
              ? {
                  ...t,
                  status: "completed",
                  completedDate: new Date().toISOString(),
                }
              : t
          )
        );
        showNotification("Đã đánh dấu nhiệm vụ hoàn thành", "success");
      },
      visible: (task) => task.status !== "completed",
    },
    {
      label: "Xóa",
      onClick: () => {},
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý nhiệm vụ điều phối viên
          </h1>
          <p className="text-gray-600 mt-1">
            Theo dõi và quản lý các nhiệm vụ được giao cho điều phối viên
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExportToExcel} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
          <Dialog open={createModal.isOpen} onOpenChange={createModal.toggle}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tạo nhiệm vụ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tạo nhiệm vụ mới</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Tiêu đề nhiệm vụ</Label>
                    <Input id="title" placeholder="Nhập tiêu đề nhiệm vụ" />
                  </div>
                  <div>
                    <Label htmlFor="coordinator">Điều phối viên</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn điều phối viên" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coord-001">
                          Nguyễn Thị Lan
                        </SelectItem>
                        <SelectItem value="coord-002">Trần Văn Minh</SelectItem>
                        <SelectItem value="coord-003">Lê Thị Hương</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả chi tiết nhiệm vụ"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="priority">Ưu tiên</Label>
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
                    <Label htmlFor="dueDate">Hạn chót</Label>
                    <Input id="dueDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="estimatedHours">Giờ ước tính</Label>
                    <Input id="estimatedHours" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => createModal.close()}>
                    Hủy
                  </Button>
                  <Button onClick={() => createModal.close()}>
                    Tạo nhiệm vụ
                  </Button>
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
                  Tổng nhiệm vụ
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {taskStats.total}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Đang thực hiện
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {taskStats.inProgress}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">
                  {taskStats.completed}
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
                <p className="text-sm font-medium text-gray-600">Quá hạn</p>
                <p className="text-2xl font-bold text-red-600">
                  {taskStats.overdue}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên nhiệm vụ, điều phối viên, sự kiện..."
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
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="overdue">Quá hạn</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Lọc theo ưu tiên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả mức ưu tiên</SelectItem>
                <SelectItem value="low">Thấp</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="high">Cao</SelectItem>
                <SelectItem value="urgent">Khẩn cấp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhiệm vụ ({filteredTasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <DataTable
              columns={taskColumns}
              data={filteredTasks}
              actions={taskActions}
              className="cursor-pointer transition-colors"
            />
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Không tìm thấy nhiệm vụ nào</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Detail Dialog */}
      <Dialog open={viewModal.isOpen} onOpenChange={viewModal.toggle}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi tiết nhiệm vụ</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {selectedTask.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedTask.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        Điều phối viên:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedTask.coordinatorName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Sự kiện:</span>
                      <span className="text-sm font-medium">
                        {selectedTask.eventName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Địa điểm:</span>
                      <span className="text-sm font-medium">
                        {selectedTask.location}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Danh mục:</span>
                      <span className="text-sm font-medium">
                        {selectedTask.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className={priorityColors[selectedTask.priority]}>
                      {selectedTask.priority === "low" && "Thấp"}
                      {selectedTask.priority === "medium" && "Trung bình"}
                      {selectedTask.priority === "high" && "Cao"}
                      {selectedTask.priority === "urgent" && "Khẩn cấp"}
                    </Badge>
                    <Badge className={statusColors[selectedTask.status]}>
                      {selectedTask.status === "pending" && "Chờ xử lý"}
                      {selectedTask.status === "in_progress" &&
                        "Đang thực hiện"}
                      {selectedTask.status === "completed" && "Hoàn thành"}
                      {selectedTask.status === "overdue" && "Quá hạn"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Ngày giao:</span>
                      <span className="text-sm font-medium">
                        {selectedTask.assignedDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Hạn chót:</span>
                      <span className="text-sm font-medium">
                        {selectedTask.dueDate}
                      </span>
                    </div>
                    {selectedTask.completedDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Ngày hoàn thành:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedTask.completedDate}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        Số tình nguyện viên:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedTask.volunteers} người
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Tiến độ thời gian</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Thực tế: {selectedTask.actualHours}h</span>
                        <span>Ước tính: {selectedTask.estimatedHours}h</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (selectedTask.actualHours /
                                selectedTask.estimatedHours) *
                                100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedTask.notes && (
                <div>
                  <h4 className="font-medium mb-2">Ghi chú</h4>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                    {selectedTask.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
