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
  FileText,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react";
import coordinatorTaskService from "@/services/coordinatorTaskService";
import type {
  CoordinatorTaskDto,
  CreateCoordinatorTaskDto,
  UpdateCoordinatorTaskDto,
  TaskStatus,
  TaskPriority,
} from "@/types/coordinatorTask";
import TaskDetailsModal from "@/components/organization/coordinator-task-management/TaskDetailsModal";
import TaskFormModal from "@/components/organization/coordinator-task-management/TaskFormModal";
import TaskStatusBadge from "@/components/organization/coordinator-task-management/TaskStatusBadge";
import TaskPriorityBadge from "@/components/organization/coordinator-task-management/TaskPriorityBadge";

import {
  TASK_STATUS,
  TASK_PRIORITY,
  TASK_CATEGORY,
  TASK_STATUS_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  TASK_CATEGORY_OPTIONS,
} from "@/types/coordinatorTask";

export default function CoordinatorTaskManagementPage() {
  const [tasks, setTasks] = useState<CoordinatorTaskDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState<CoordinatorTaskDto | null>(
    null
  );
  const [editingTask, setEditingTask] = useState<CoordinatorTaskDto | null>(
    null
  );
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Hooks
  const detailsModal = useModal();
  const formModal = useModal();

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

  // Modal handlers
  const handleViewTask = (task: CoordinatorTaskDto) => {
    setSelectedTask(task);
    detailsModal.open();
  };

  const handleEditTask = (task: CoordinatorTaskDto) => {
    setEditingTask(task);
    formModal.open();
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    formModal.open();
  };

  const handleFormSubmit = async (data: CreateCoordinatorTaskDto | UpdateCoordinatorTaskDto) => {
    try {
      setIsFormLoading(true);
      
      if ('taskId' in data) {
        // Update existing task
        const updatedTask = await coordinatorTaskService.updateTask(Number(data.taskId), data);
        if (updatedTask) {
          toast.success("Cập nhật nhiệm vụ thành công");
          await loadTasks();
        }
      } else {
        // Create new task
        const newTask = await coordinatorTaskService.createTask(data);
        if (newTask) {
          toast.success("Tạo nhiệm vụ thành công");
          await loadTasks();
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error instanceof Error) {
        toast.error(`Lỗi: ${error.message}`);
      } else {
        toast.error("Không thể lưu nhiệm vụ. Vui lòng thử lại.");
      }
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      if (!confirm("Bạn có chắc chắn muốn xóa nhiệm vụ này?")) {
        return;
      }
      
      // Find the task to get required fields for update
      const task = tasks.find(t => t.taskId === taskId);
      if (!task) {
        toast.error("Không tìm thấy nhiệm vụ");
        return;
      }
      
      // Since backend doesn't have delete endpoint, update status to CANCELLED
      const updateData: UpdateCoordinatorTaskDto = {
        eventId: task.eventId,
        coordinatorId: task.coordinatorId,
        taskName: task.taskName,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: TASK_STATUS.CANCELLED,
        category: task.category,
        estimatedHours: task.estimatedHours,
        actualHours: task.actualHours,
        completedAt: task.completedAt,
        notes: task.notes
      };
      
      await coordinatorTaskService.updateTask(taskId, updateData);
      toast.success("Đã hủy nhiệm vụ thành công");
      await loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Không thể xóa nhiệm vụ. Vui lòng thử lại.");
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      // Find the task to get required fields for update
      const task = tasks.find(t => t.taskId === taskId);
      if (!task) {
        toast.error("Không tìm thấy nhiệm vụ");
        return;
      }
      
      const updateData: UpdateCoordinatorTaskDto = {
        eventId: task.eventId,
        coordinatorId: task.coordinatorId,
        taskName: task.taskName,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: TASK_STATUS.COMPLETED,
        category: task.category,
        estimatedHours: task.estimatedHours,
        actualHours: task.actualHours,
        completedAt: new Date().toISOString(),
        notes: task.notes
      };
      
      await coordinatorTaskService.updateTask(taskId, updateData);
      toast.success("Đã hoàn thành nhiệm vụ");
      await loadTasks();
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Không thể hoàn thành nhiệm vụ. Vui lòng thử lại.");
    }
  };

  const handleRefresh = async () => {
    await loadTasks();
    toast.success("Đã làm mới danh sách nhiệm vụ");
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
      render: (_, task) => (
        <TaskPriorityBadge priority={task.priority || ''} showIcon />
      ),
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
        
        return (
          <div className="flex items-center gap-2">
            <TaskStatusBadge status={task.status || ''} showIcon />
            {isOverdue && (
              <Badge className="bg-red-100 text-red-800 text-xs">
                Quá hạn
              </Badge>
            )}
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
      icon: <Eye />,
      onClick: (task) => handleViewTask(task),
    },
    {
      label: "Chỉnh sửa",
      icon: <Edit />,
      onClick: (task) => handleEditTask(task),
    },
    {
      label: "Đánh dấu hoàn thành",
      icon: <CheckCircle />,
      onClick: async (task) => {
        if (!task.taskId) {
          toast.error("Không thể xác định ID nhiệm vụ");
          return;
        }
        
        if (task.status === TASK_STATUS.COMPLETED) {
          toast.info("Nhiệm vụ đã được hoàn thành");
          return;
        }
        
        await handleCompleteTask(Number(task.taskId));
      },
      visible: (task) => task.status !== TASK_STATUS.COMPLETED,
    },
    {
      label: "Hủy nhiệm vụ",
      icon: <Trash2 />,
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
        
        await handleDeleteTask(Number(task.taskId));
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
          <Button onClick={handleRefresh} variant="outline" className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/50 dark:hover:to-cyan-900/50">
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
          <Button onClick={handleExportToExcel} variant="outline" className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/50 dark:hover:to-emerald-900/50">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
          <Button onClick={handleCreateTask} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Tạo nhiệm vụ
          </Button>
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
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Tổng giờ</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {taskStats.totalHours}h
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-full shadow-lg">
                <Clock className="w-8 h-8 text-white" />
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

      {/* Task Details Modal */}
      <TaskDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={detailsModal.close}
        task={selectedTask}
        onEdit={handleEditTask}
        onComplete={handleCompleteTask}
        onDelete={handleDeleteTask}
      />

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        task={editingTask}
        onSubmit={handleFormSubmit}
        isLoading={isFormLoading}
      />
    </div>
  );
}
