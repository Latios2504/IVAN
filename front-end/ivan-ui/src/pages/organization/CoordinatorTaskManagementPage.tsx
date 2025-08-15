import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import {
  Plus,
  Search,
  Download,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import coordinatorTaskService from "@/services/coordinatorTaskService";
import type {
  CoordinatorTaskDto,
  CreateCoordinatorTaskDto,
  TaskStatus,
  TaskPriority,
} from "@/types/coordinatorTask";

const priorityColors: Record<string, string> = {
  Low: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-orange-100 text-orange-800",
  Urgent: "bg-red-100 text-red-800",
};

const statusColors: Record<string, string> = {
  Pending: "bg-gray-100 text-gray-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Overdue: "bg-red-100 text-red-800",
  Cancelled: "bg-gray-100 text-gray-600",
};

const statusIcons: Record<string, typeof Clock> = {
  Pending: Clock,
  "In Progress": AlertCircle,
  Completed: CheckCircle,
  Overdue: XCircle,
  Cancelled: XCircle,
};

export default function CoordinatorTaskManagementPage() {
  const [tasks, setTasks] = useState<CoordinatorTaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState<CoordinatorTaskDto | null>(
    null
  );
  const [newTask, setNewTask] = useState<CreateCoordinatorTaskDto>({
    eventId: 0,
    coordinatorId: 0,
    taskName: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
    category: "",
    estimatedHours: 0,
    notes: "",
  });

  // Hooks
  const createModal = useModal();
  const viewModal = useModal();

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await coordinatorTaskService.getAllTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Không thể tải danh sách nhiệm vụ");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    try {
      if (!newTask.taskName.trim()) {
        toast.error("Vui lòng nhập tên nhiệm vụ");
        return;
      }

      await coordinatorTaskService.createTask(newTask);
      toast.success("Tạo nhiệm vụ thành công");
      createModal.close();
      loadTasks(); // Reload tasks

      // Reset form
      setNewTask({
        eventId: 0,
        coordinatorId: 0,
        taskName: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        status: "Pending",
        category: "",
        estimatedHours: 0,
        notes: "",
      });
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Không thể tạo nhiệm vụ");
    }
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      "";
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Task statistics
  const taskStats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "Pending").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    completed: tasks.filter((t) => t.status === "Completed").length,
    overdue: tasks.filter((t) => t.status === "Overdue").length,
    totalHours: tasks.reduce((sum, task) => sum + (task.actualHours || 0), 0),
  };

  const handleExportToExcel = () => {
    // Create CSV content for Excel export
    const headers = [
      "Event ID",
      "Coordinator ID",
      "Tên nhiệm vụ",
      "Mô tả",
      "Ưu tiên",
      "Trạng thái",
      "Hạn chót",
      "Giờ ước tính",
      "Giờ thực tế",
      "Danh mục",
      "Ghi chú",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredTasks.map((task) =>
        [
          task.eventId,
          task.coordinatorId,
          `"${task.taskName}"`,
          `"${task.description || ""}"`,
          task.priority || "",
          task.status || "",
          task.dueDate || "",
          task.estimatedHours || 0,
          task.actualHours || 0,
          task.category || "",
          `"${task.notes || ""}"`,
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
  const taskColumns: TableColumn<CoordinatorTaskDto>[] = [
    {
      key: "taskName",
      header: "Nhiệm vụ",
      render: (_, task) => (
        <div>
          <div className="font-medium">{task.taskName}</div>
          <div className="text-sm text-gray-500 truncate max-w-64">
            {task.description}
          </div>
        </div>
      ),
    },
    {
      key: "coordinatorId",
      header: "Điều phối viên",
      render: (_, task) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span>ID: {task.coordinatorId}</span>
        </div>
      ),
    },
    {
      key: "eventId",
      header: "Sự kiện",
      render: (_, task) => (
        <div className="text-sm">Event ID: {task.eventId}</div>
      ),
    },
    {
      key: "priority",
      header: "Ưu tiên",
      render: (_, task) => {
        if (!task.priority)
          return <span className="text-gray-400">Chưa xác định</span>;
        return (
          <Badge
            className={
              priorityColors[task.priority] || "bg-gray-100 text-gray-800"
            }
          >
            {task.priority}
          </Badge>
        );
      },
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (_, task) => {
        const StatusIcon = statusIcons[task.status || ""] || Clock;
        return (
          <div className="flex items-center gap-2">
            <StatusIcon className="w-4 h-4" />
            <Badge
              className={
                statusColors[task.status || ""] || "bg-gray-100 text-gray-800"
              }
            >
              {task.status || "Chưa xác định"}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "dueDate",
      header: "Hạn chót",
      render: (_, task) => {
        if (!task.dueDate)
          return <span className="text-gray-400">Chưa xác định</span>;
        const isOverdue =
          new Date(task.dueDate) < new Date() && task.status !== "Completed";
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
      key: "estimatedHours",
      header: "Tiến độ",
      render: (_, task) => {
        const progress =
          task.status === "Completed"
            ? 100
            : task.status === "In Progress"
            ? 65
            : task.status === "Pending"
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
              {task.actualHours || 0}h / {task.estimatedHours || 0}h
            </div>
          </div>
        );
      },
    },
  ];

  const taskActions: TableAction<CoordinatorTaskDto>[] = [
    {
      label: "Xem chi tiết",
      onClick: (task) => {
        setSelectedTask(task);
        viewModal.open();
      },
    },
    {
      label: "Chỉnh sửa",
      onClick: () => {
        toast.info("Chức năng chỉnh sửa đang được phát triển");
      },
    },
    {
      label: "Đánh dấu hoàn thành",
      onClick: async (task) => {
        try {
          // In a real implementation, you would call the update API
          setTasks((prev) =>
            prev.map((t) =>
              t.eventId === task.eventId &&
              t.coordinatorId === task.coordinatorId
                ? {
                    ...t,
                    status: "Completed",
                    completedAt: new Date().toISOString(),
                  }
                : t
            )
          );
          toast.success("Đã đánh dấu nhiệm vụ hoàn thành");
        } catch (error) {
          toast.error("Không thể cập nhật trạng thái");
        }
      },
      visible: (task) => task.status !== "Completed",
    },
    {
      label: "Xóa",
      onClick: () => {
        toast.info("Chức năng xóa đang được phát triển");
      },
      variant: "destructive" as const,
    },
  ];

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách nhiệm vụ...</p>
          </div>
        </div>
      </div>
    );
  }

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
                    <Label htmlFor="taskName">Tên nhiệm vụ</Label>
                    <Input
                      id="taskName"
                      placeholder="Nhập tên nhiệm vụ"
                      value={newTask.taskName}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          taskName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="coordinatorId">ID Điều phối viên</Label>
                    <Input
                      id="coordinatorId"
                      type="number"
                      placeholder="Nhập ID điều phối viên"
                      value={newTask.coordinatorId || ""}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          coordinatorId: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả chi tiết nhiệm vụ"
                    value={newTask.description || ""}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="priority">Ưu tiên</Label>
                    <Select
                      value={newTask.priority || "Medium"}
                      onValueChange={(value) =>
                        setNewTask((prev) => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn mức ưu tiên" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Thấp</SelectItem>
                        <SelectItem value="Medium">Trung bình</SelectItem>
                        <SelectItem value="High">Cao</SelectItem>
                        <SelectItem value="Urgent">Khẩn cấp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Hạn chót</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate || ""}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          dueDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimatedHours">Giờ ước tính</Label>
                    <Input
                      id="estimatedHours"
                      type="number"
                      placeholder="0"
                      value={newTask.estimatedHours || ""}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          estimatedHours: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => createModal.close()}>
                    Hủy
                  </Button>
                  <Button onClick={handleCreateTask}>Tạo nhiệm vụ</Button>
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
                placeholder="Tìm kiếm theo tên nhiệm vụ, mô tả..."
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
                <SelectItem value="Pending">Chờ xử lý</SelectItem>
                <SelectItem value="In Progress">Đang thực hiện</SelectItem>
                <SelectItem value="Completed">Hoàn thành</SelectItem>
                <SelectItem value="Overdue">Quá hạn</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Lọc theo ưu tiên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả mức ưu tiên</SelectItem>
                <SelectItem value="Low">Thấp</SelectItem>
                <SelectItem value="Medium">Trung bình</SelectItem>
                <SelectItem value="High">Cao</SelectItem>
                <SelectItem value="Urgent">Khẩn cấp</SelectItem>
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
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">
                {tasks.length === 0
                  ? "Chưa có nhiệm vụ nào"
                  : "Không tìm thấy nhiệm vụ phù hợp với bộ lọc"}
              </p>
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
                    {selectedTask.taskName}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedTask.description || "Không có mô tả"}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        ID Điều phối viên:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedTask.coordinatorId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">ID Sự kiện:</span>
                      <span className="text-sm font-medium">
                        {selectedTask.eventId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Danh mục:</span>
                      <span className="text-sm font-medium">
                        {selectedTask.category || "Chưa phân loại"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {selectedTask.priority && (
                      <Badge
                        className={
                          priorityColors[selectedTask.priority] ||
                          "bg-gray-100 text-gray-800"
                        }
                      >
                        {selectedTask.priority}
                      </Badge>
                    )}
                    {selectedTask.status && (
                      <Badge
                        className={
                          statusColors[selectedTask.status] ||
                          "bg-gray-100 text-gray-800"
                        }
                      >
                        {selectedTask.status}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    {selectedTask.dueDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Hạn chót:</span>
                        <span className="text-sm font-medium">
                          {new Date(selectedTask.dueDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    )}
                    {selectedTask.completedAt && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Ngày hoàn thành:
                        </span>
                        <span className="text-sm font-medium">
                          {new Date(
                            selectedTask.completedAt
                          ).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Tiến độ thời gian</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Thực tế: {selectedTask.actualHours || 0}h</span>
                        <span>
                          Ước tính: {selectedTask.estimatedHours || 0}h
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              ((selectedTask.actualHours || 0) /
                                Math.max(selectedTask.estimatedHours || 1, 1)) *
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
