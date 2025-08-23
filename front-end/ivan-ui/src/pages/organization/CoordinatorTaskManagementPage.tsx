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

import {
  TASK_STATUS,
  TASK_PRIORITY,
  TASK_CATEGORY,
  TASK_STATUS_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  TASK_CATEGORY_OPTIONS,
} from "@/types/coordinatorTask";

const priorityColors: Record<string, string> = {
  [TASK_PRIORITY.LOW]: "bg-green-100 text-green-800",
  [TASK_PRIORITY.MEDIUM]: "bg-yellow-100 text-yellow-800",
  [TASK_PRIORITY.HIGH]: "bg-orange-100 text-orange-800",
  [TASK_PRIORITY.URGENT]: "bg-red-100 text-red-800",
};

const statusColors: Record<string, string> = {
  [TASK_STATUS.NOT_STARTED]: "bg-gray-100 text-gray-800",
  [TASK_STATUS.IN_PROGRESS]: "bg-blue-100 text-blue-800",
  [TASK_STATUS.COMPLETED]: "bg-green-100 text-green-800",
  [TASK_STATUS.CANCELLED]: "bg-gray-100 text-gray-600",
  [TASK_STATUS.ON_HOLD]: "bg-yellow-100 text-yellow-800",
};

const statusIcons: Record<string, typeof Clock> = {
  [TASK_STATUS.NOT_STARTED]: Clock,
  [TASK_STATUS.IN_PROGRESS]: AlertCircle,
  [TASK_STATUS.COMPLETED]: CheckCircle,
  [TASK_STATUS.CANCELLED]: XCircle,
  [TASK_STATUS.ON_HOLD]: Clock,
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
    priority: TASK_PRIORITY.MEDIUM,
    status: TASK_STATUS.NOT_STARTED,
    category: TASK_CATEGORY.SETUP,
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
      
      // Validate data structure
      if (!Array.isArray(tasksData)) {
        console.warn("Tasks data is not an array:", tasksData);
        setTasks([]);
        toast.warning("Dữ liệu nhiệm vụ không hợp lệ");
        return;
      }
      
      setTasks(tasksData);
      
      if (tasksData.length === 0) {
        toast.info("Chưa có nhiệm vụ nào được tạo");
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
      setTasks([]);
      toast.error("Không thể tải danh sách nhiệm vụ. Vui lòng kiểm tra kết nối backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskId: number, updateData: Partial<CoordinatorTaskDto>) => {
    try {
      if (!taskId || taskId <= 0) {
        toast.error("ID nhiệm vụ không hợp lệ");
        return;
      }

      const updatedTask = await coordinatorTaskService.updateTask(taskId, {
        ...selectedTask!,
        ...updateData,
      });
      
      if (updatedTask) {
        toast.success("Cập nhật nhiệm vụ thành công");
        await loadTasks(); // Reload tasks
        setSelectedTask(null);
      } else {
        toast.error("Không thể cập nhật nhiệm vụ - phản hồi không hợp lệ từ server");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      
      if (error instanceof Error) {
        if (error.message.includes('Validation failed')) {
          toast.error(`Lỗi validation: ${error.message}`);
        } else if (error.message.includes('not found')) {
          toast.error("Nhiệm vụ không tồn tại");
        } else {
          toast.error(`Không thể cập nhật nhiệm vụ: ${error.message}`);
        }
      } else {
        toast.error("Không thể cập nhật nhiệm vụ. Vui lòng thử lại.");
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      if (!taskId || taskId <= 0) {
        toast.error("ID nhiệm vụ không hợp lệ");
        return;
      }

      // Note: Backend doesn't have delete endpoint, so we'll update status to CANCELLED
      await handleUpdateTask(taskId, { status: TASK_STATUS.CANCELLED });
      toast.success("Đã hủy nhiệm vụ thành công");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Không thể xóa nhiệm vụ. Vui lòng thử lại.");
    }
  };

  const handleCompleteTask = async (taskId: number, actualHours?: number) => {
    try {
      const completedTask = await coordinatorTaskService.completeTask(taskId, actualHours);
      
      if (completedTask) {
        toast.success("Đã hoàn thành nhiệm vụ");
        await loadTasks();
      } else {
        toast.error("Không thể hoàn thành nhiệm vụ");
      }
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Không thể hoàn thành nhiệm vụ. Vui lòng thử lại.");
    }
  };

  const handleCreateTask = async () => {
    try {
      // Validation
      if (!newTask.taskName.trim()) {
        toast.error("Vui lòng nhập tên nhiệm vụ");
        return;
      }
      
      if (!newTask.eventId || newTask.eventId <= 0) {
        toast.error("Vui lòng chọn sự kiện hợp lệ");
        return;
      }
      
      if (!newTask.coordinatorId || newTask.coordinatorId <= 0) {
        toast.error("Vui lòng chọn điều phối viên hợp lệ");
        return;
      }

      const createdTask = await coordinatorTaskService.createTask(newTask);
      
      if (createdTask) {
        toast.success("Tạo nhiệm vụ thành công");
        createModal.close();
        await loadTasks(); // Reload tasks

        // Reset form
        setNewTask({
          eventId: 0,
          coordinatorId: 0,
          taskName: "",
          description: "",
          dueDate: "",
          priority: TASK_PRIORITY.MEDIUM,
          status: TASK_STATUS.NOT_STARTED,
          category: TASK_CATEGORY.SETUP,
          estimatedHours: 0,
          notes: "",
        });
      } else {
        toast.error("Không thể tạo nhiệm vụ - phản hồi không hợp lệ từ server");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('Validation failed')) {
          toast.error(`Lỗi validation: ${error.message}`);
        } else if (error.message.includes('Network')) {
          toast.error("Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.");
        } else {
          toast.error(`Không thể tạo nhiệm vụ: ${error.message}`);
        }
      } else {
        toast.error("Không thể tạo nhiệm vụ. Vui lòng thử lại.");
      }
    }
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Task statistics
  const taskStats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === TASK_STATUS.NOT_STARTED).length,
    inProgress: tasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS).length,
    completed: tasks.filter((t) => t.status === TASK_STATUS.COMPLETED).length,
    onHold: tasks.filter((t) => t.status === TASK_STATUS.ON_HOLD).length,
    cancelled: tasks.filter((t) => t.status === TASK_STATUS.CANCELLED).length,
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
        const priorityLabels = {
          [TASK_PRIORITY.LOW]: "Thấp",
          [TASK_PRIORITY.MEDIUM]: "Trung bình",
          [TASK_PRIORITY.HIGH]: "Cao",
          [TASK_PRIORITY.URGENT]: "Khẩn cấp"
        };
        
        if (!task.priority)
          return <span className="text-gray-400">Chưa xác định</span>;
        return (
          <Badge
            className={
              priorityColors[task.priority] || "bg-gray-100 text-gray-800"
            }
          >
            {priorityLabels[task.priority] || task.priority}
          </Badge>
        );
      },
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (_, task) => {
        // Check if task is overdue
        const isOverdue = task.dueDate && 
          new Date(task.dueDate) < new Date() && 
          task.status !== TASK_STATUS.COMPLETED && 
          task.status !== TASK_STATUS.CANCELLED;
        
        const displayStatus = isOverdue ? "Quá hạn" : (task.status || "Chưa xác định");
        const statusColor = isOverdue ? "bg-red-100 text-red-800" : 
          (statusColors[task.status || ""] || "bg-gray-100 text-gray-800");
        const StatusIcon = statusIcons[task.status || ""] || Clock;
        
        return (
          <div className="flex items-center gap-2">
            <StatusIcon className="w-4 h-4" />
            <Badge className={statusColor}>
              {displayStatus}
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
        const isOverdue = coordinatorTaskService.isTaskOverdue(task);
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
        const progress = coordinatorTaskService.getTaskProgress(task);
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
      onClick: (task) => {
        setSelectedTask(task);
        // In a real implementation, you would open an edit modal
        toast.info("Chức năng chỉnh sửa đang được phát triển");
      },
    },
    {
      label: "Đánh dấu hoàn thành",
      onClick: async (task) => {
        if (!task.taskId) {
          toast.error("Không thể xác định ID nhiệm vụ");
          return;
        }
        
        if (task.status === TASK_STATUS.COMPLETED) {
          toast.info("Nhiệm vụ đã được hoàn thành");
          return;
        }
        
        await handleCompleteTask(task.taskId);
      },
      visible: (task) => task.status !== TASK_STATUS.COMPLETED,
    },
    {
      label: "Hủy nhiệm vụ",
      onClick: async (task) => {
        if (!task.taskId) {
          toast.error("Không thể xác định ID nhiệm vụ");
          return;
        }
        
        if (task.status === TASK_STATUS.CANCELLED) {
          toast.info("Nhiệm vụ đã được hủy");
          return;
        }
        
        if (task.status === TASK_STATUS.COMPLETED) {
          toast.info("Không thể hủy nhiệm vụ đã hoàn thành");
          return;
        }
        
        await handleDeleteTask(task.taskId);
      },
      variant: "destructive" as const,
      visible: (task) => task.status !== TASK_STATUS.CANCELLED && task.status !== TASK_STATUS.COMPLETED,
    },
  ];

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-950 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-slate-700 dark:text-slate-300">Đang tải danh sách nhiệm vụ...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-950 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 p-6 rounded-xl border border-cyan-200/50 dark:border-cyan-800/50 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-cyan-900 dark:text-cyan-100">
            Quản lý nhiệm vụ điều phối viên
          </h1>
          <p className="text-cyan-700 dark:text-cyan-300 mt-1">
            Theo dõi và quản lý các nhiệm vụ được giao cho điều phối viên
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExportToExcel} variant="outline" className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/50 dark:hover:to-emerald-900/50">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
          <Dialog open={createModal.isOpen} onOpenChange={createModal.toggle}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Tạo nhiệm vụ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl">
              <DialogHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 -m-6 mb-6 p-6 rounded-t-lg border-b border-indigo-200/50 dark:border-indigo-800/50">
                <DialogTitle className="text-indigo-900 dark:text-indigo-100 text-xl font-bold">Tạo nhiệm vụ mới</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="taskName" className="text-slate-900 dark:text-slate-100 font-semibold">Tên nhiệm vụ</Label>
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
                      className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="coordinatorId" className="text-slate-900 dark:text-slate-100 font-semibold">ID Điều phối viên</Label>
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
                      className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description" className="text-slate-900 dark:text-slate-100 font-semibold">Mô tả</Label>
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
                    className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 resize-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="priority" className="text-slate-700 dark:text-slate-300 font-medium">
                      Ưu tiên
                    </Label>
                    <Select
                      value={newTask.priority || "Medium"}
                      onValueChange={(value) =>
                        setNewTask((prev) => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 hover:border-orange-300 dark:hover:border-orange-500 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 transition-all duration-200">
                        <SelectValue placeholder="Chọn mức ưu tiên" className="text-slate-600 dark:text-slate-400" />
                      </SelectTrigger>
                      <SelectContent className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-600 shadow-xl">
                        <SelectItem value="Low" className="text-slate-900 dark:text-slate-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 focus:bg-gradient-to-r focus:from-green-100 focus:to-emerald-100 dark:focus:from-green-800/30 dark:focus:to-emerald-800/30">
                          Thấp
                        </SelectItem>
                        <SelectItem value="Medium" className="text-slate-900 dark:text-slate-100 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 dark:hover:from-yellow-900/20 dark:hover:to-amber-900/20 focus:bg-gradient-to-r focus:from-yellow-100 focus:to-amber-100 dark:focus:from-yellow-800/30 dark:focus:to-amber-800/30">
                          Trung bình
                        </SelectItem>
                        <SelectItem value="High" className="text-slate-900 dark:text-slate-100 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 dark:hover:from-orange-900/20 dark:hover:to-red-900/20 focus:bg-gradient-to-r focus:from-orange-100 focus:to-red-100 dark:focus:from-orange-800/30 dark:focus:to-red-800/30">
                          Cao
                        </SelectItem>
                        <SelectItem value="Urgent" className="text-slate-900 dark:text-slate-100 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 dark:hover:from-red-900/20 dark:hover:to-rose-900/20 focus:bg-gradient-to-r focus:from-red-100 focus:to-rose-100 dark:focus:from-red-800/30 dark:focus:to-rose-800/30">
                          Khẩn cấp
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dueDate" className="text-slate-700 dark:text-slate-300 font-medium">
                      Hạn chót
                    </Label>
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
                      className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 hover:border-red-300 dark:hover:border-red-500 focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimatedHours" className="text-slate-700 dark:text-slate-300 font-medium">
                      Giờ ước tính
                    </Label>
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
                      className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 hover:border-purple-300 dark:hover:border-purple-500 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button 
                    variant="outline" 
                    onClick={() => createModal.close()}
                    className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-slate-100 hover:to-gray-100 dark:hover:from-slate-700 dark:hover:to-gray-700 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200"
                  >
                    Hủy
                  </Button>
                  <Button 
                    onClick={handleCreateTask}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
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
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Tổng nhiệm vụ
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {taskStats.total}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/30 border border-orange-200 dark:border-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Đang thực hiện
                </p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {taskStats.inProgress}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full shadow-lg">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30 border border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Hoàn thành</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {taskStats.completed}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/30 border border-red-200 dark:border-red-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Quá hạn</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {taskStats.overdue}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-full shadow-lg">
                <XCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 border border-slate-200 dark:border-slate-700 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Input
                placeholder="Tìm kiếm theo tên nhiệm vụ, mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gradient-to-r from-white to-slate-50 dark:from-slate-700 dark:to-slate-600 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 hover:border-blue-300 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-gradient-to-r from-white to-slate-50 dark:from-slate-700 dark:to-slate-600 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 hover:border-purple-300 dark:hover:border-purple-500 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-200">
                <SelectValue placeholder="Lọc theo trạng thái" className="text-slate-600 dark:text-slate-400" />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-600 shadow-xl">
                <SelectItem value="all" className="text-slate-900 dark:text-slate-100 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 dark:hover:from-slate-700 dark:hover:to-gray-700">Tất cả trạng thái</SelectItem>
                <SelectItem value="Pending" className="text-slate-900 dark:text-slate-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-700 dark:hover:to-slate-700">Chờ xử lý</SelectItem>
                <SelectItem value="In Progress" className="text-slate-900 dark:text-slate-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20">Đang thực hiện</SelectItem>
                <SelectItem value="Completed" className="text-slate-900 dark:text-slate-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20">Hoàn thành</SelectItem>
                <SelectItem value="Overdue" className="text-slate-900 dark:text-slate-100 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 dark:hover:from-red-900/20 dark:hover:to-rose-900/20">Quá hạn</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-gradient-to-r from-white to-slate-50 dark:from-slate-700 dark:to-slate-600 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 hover:border-orange-300 dark:hover:border-orange-500 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 transition-all duration-200">
                <SelectValue placeholder="Lọc theo ưu tiên" className="text-slate-600 dark:text-slate-400" />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-600 shadow-xl">
                <SelectItem value="all" className="text-slate-900 dark:text-slate-100 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 dark:hover:from-slate-700 dark:hover:to-gray-700">Tất cả mức ưu tiên</SelectItem>
                <SelectItem value="Low" className="text-slate-900 dark:text-slate-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20">Thấp</SelectItem>
                <SelectItem value="Medium" className="text-slate-900 dark:text-slate-100 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 dark:hover:from-yellow-900/20 dark:hover:to-amber-900/20">Trung bình</SelectItem>
                <SelectItem value="High" className="text-slate-900 dark:text-slate-100 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 dark:hover:from-orange-900/20 dark:hover:to-red-900/20">Cao</SelectItem>
                <SelectItem value="Urgent" className="text-slate-900 dark:text-slate-100 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 dark:hover:from-red-900/20 dark:hover:to-rose-900/20">Khẩn cấp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-slate-200 dark:border-slate-700">
          <CardTitle className="text-slate-900 dark:text-slate-100 font-bold text-lg">
            Danh sách nhiệm vụ ({filteredTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <DataTable
              columns={taskColumns}
              data={filteredTasks}
              actions={taskActions}
              className="cursor-pointer transition-colors"
            />
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-gray-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="p-4 bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-700 dark:to-gray-700 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-10 w-10 text-slate-500 dark:text-slate-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
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
        <DialogContent className="max-w-3xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 -m-6 mb-6 p-6 border-b border-slate-200 dark:border-slate-700">
            <DialogTitle className="text-slate-900 dark:text-slate-100 font-bold text-xl">
              Chi tiết nhiệm vụ
            </DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-slate-100">
                    {selectedTask.taskName}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {selectedTask.description || "Không có mô tả"}
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded border border-blue-200 dark:border-blue-700">
                      <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                        ID Điều phối viên:
                      </span>
                      <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
                        {selectedTask.coordinatorId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded border border-purple-200 dark:border-purple-700">
                      <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">ID Sự kiện:</span>
                      <span className="text-sm font-bold text-purple-900 dark:text-purple-100">
                        {selectedTask.eventId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded border border-green-200 dark:border-green-700">
                      <span className="text-sm text-green-700 dark:text-green-300 font-medium">Danh mục:</span>
                      <span className="text-sm font-bold text-green-900 dark:text-green-100">
                        {selectedTask.category || "Chưa phân loại"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    {selectedTask.priority && (
                      <Badge className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 text-orange-800 dark:text-orange-200 border border-orange-300 dark:border-orange-600 font-semibold px-3 py-1">
                        {selectedTask.priority}
                      </Badge>
                    )}
                    {selectedTask.status && (
                      <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-600 font-semibold px-3 py-1">
                        {selectedTask.status}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    {selectedTask.dueDate && (
                      <div className="flex justify-between items-center p-2 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded border border-red-200 dark:border-red-700">
                        <span className="text-sm text-red-700 dark:text-red-300 font-medium">Hạn chót:</span>
                        <span className="text-sm font-bold text-red-900 dark:text-red-100">
                          {new Date(selectedTask.dueDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    )}
                    {selectedTask.completedAt && (
                      <div className="flex justify-between items-center p-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded border border-green-200 dark:border-green-700">
                        <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                          Ngày hoàn thành:
                        </span>
                        <span className="text-sm font-bold text-green-900 dark:text-green-100">
                          {new Date(
                            selectedTask.completedAt
                          ).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                    <h4 className="font-bold mb-3 text-indigo-900 dark:text-indigo-100">Tiến độ thời gian</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-indigo-700 dark:text-indigo-300 font-medium">Thực tế: {selectedTask.actualHours || 0}h</span>
                        <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                          Ước tính: {selectedTask.estimatedHours || 0}h
                        </span>
                      </div>
                      <div className="w-full bg-gradient-to-r from-slate-200 to-gray-200 dark:from-slate-600 dark:to-gray-600 rounded-full h-3 shadow-inner">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full shadow-lg transition-all duration-500"
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
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                  <h4 className="font-bold mb-3 text-amber-900 dark:text-amber-100">Ghi chú</h4>
                  <p className="text-amber-800 dark:text-amber-200 text-sm bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-800/30 dark:to-yellow-800/30 p-3 rounded-lg border border-amber-300 dark:border-amber-600 leading-relaxed">
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
