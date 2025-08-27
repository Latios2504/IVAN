import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  FileText,
  Search,
  Eye,
  Badge,
  X,
  Pause,
} from "lucide-react";
import {
  DataTable,
  type TableColumn,
  type TableAction,
} from "@/components/common/DataTable";
import { StatsCard } from "@/components/common/StatsCard";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import coordinatorTaskService from "@/services/coordinatorTaskService";
import type {
  CoordinatorTaskDto,
  CoordinatorTaskFilterDto,
} from "@/types/coordinatorTask";
import type { PagedResultDto } from "@/types/common";
import {
  DEFAULT_COORDINATOR_TASK_FILTER,
  TASK_STATUS,
} from "@/types/coordinatorTask";
import TaskDetailsModal from "@/components/organization/coordinator-task-management/TaskDetailsModal";
import TaskStatusBadge from "@/components/organization/coordinator-task-management/TaskStatusBadge";
import TaskPriorityBadge from "@/components/organization/coordinator-task-management/TaskPriorityBadge";
import { useModal } from "@/hooks/useModal";

export default function CoordinatorTasksPage() {
  const { user } = useAuth();
  const [pagedResult, setPagedResult] =
    useState<PagedResultDto<CoordinatorTaskDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<CoordinatorTaskDto | null>(
    null
  );
  const [filter, setFilter] = useState<CoordinatorTaskFilterDto>(
    DEFAULT_COORDINATOR_TASK_FILTER
  );

  // Modal hooks
  const detailsModal = useModal();

  // Load tasks on component mount and when filter changes
  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      // Use new personal tasks API with server-side filtering
      const result = await coordinatorTaskService.getPersonalTasks(filter);
      setPagedResult(result);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Không thể tải danh sách nhiệm vụ");
    } finally {
      setLoading(false);
    }
  };

  // Update filter handlers
  const handleSearchChange = (value: string) => {
    setFilter((prev) => ({ ...prev, search: value, pageNumber: 1 }));
  };

  const handleStatusFilterChange = (value: string) => {
    setFilter((prev) => ({
      ...prev,
      status: value === "all" ? undefined : value,
      pageNumber: 1,
    }));
  };

  const handlePriorityFilterChange = (value: string) => {
    setFilter((prev) => ({
      ...prev,
      priority: value === "all" ? undefined : value,
      pageNumber: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilter((prev) => ({ ...prev, pageNumber: page }));
  };

  const handlePageSizeChange = (size: number) => {
    setFilter((prev) => ({ ...prev, pageSize: size, pageNumber: 1 }));
  };

  // Modal handlers
  const handleViewTask = (task: CoordinatorTaskDto) => {
    setSelectedTask(task);
    detailsModal.open();
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      await coordinatorTaskService.updateTaskStatus(
        taskId,
        TASK_STATUS.COMPLETED
      );
      await loadTasks();
      toast.success("Đã hoàn thành nhiệm vụ");
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Không thể hoàn thành nhiệm vụ");
    }
  };

  const handleStartTask = async (taskId: number) => {
    try {
      await coordinatorTaskService.updateTaskStatus(
        taskId,
        TASK_STATUS.IN_PROGRESS
      );
      await loadTasks();
      toast.success("Đã bắt đầu thực hiện nhiệm vụ");
    } catch (error) {
      console.error("Error starting task:", error);
      toast.error("Không thể bắt đầu nhiệm vụ");
    }
  };

  const handlePauseTask = async (taskId: number) => {
    try {
      await coordinatorTaskService.updateTaskStatus(
        taskId,
        TASK_STATUS.ON_HOLD
      );
      await loadTasks();
      toast.success("Đã tạm dừng nhiệm vụ");
    } catch (error) {
      console.error("Error pausing task:", error);
      toast.error("Không thể tạm dừng nhiệm vụ");
    }
  };

  const handleCancelTask = async (taskId: number) => {
    try {
      await coordinatorTaskService.updateTaskStatus(
        taskId,
        TASK_STATUS.CANCELLED
      );
      await loadTasks();
      toast.success("Đã hủy nhiệm vụ");
    } catch (error) {
      console.error("Error cancelling task:", error);
      toast.error("Không thể hủy nhiệm vụ");
    }
  };

  // Get current tasks and calculate stats from paged result
  const tasks = pagedResult?.items || [];
  const stats = {
    totalTasks: pagedResult?.totalCount || 0,
    pendingTasks: tasks.filter((t) => t.status === TASK_STATUS.ASSIGNED).length,
    inProgressTasks: tasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS).length,
    completedTasks: tasks.filter((t) => t.status === TASK_STATUS.COMPLETED).length,
    totalEstimatedHours: tasks.reduce(
      (sum, task) => sum + (task.estimatedHours || 0),
      0
    ),
    totalActualHours: tasks.reduce(
      (sum, task) => sum + (task.actualHours || 0),
      0
    ),
  };

  // Get completed tasks for the completed tab
  const completedTasks = tasks.filter(
    (task) => task.status === TASK_STATUS.COMPLETED
  );

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
      key: "priority",
      header: "Ưu tiên",
      render: (_, task) => (
        <TaskPriorityBadge priority={task.priority || ""} showIcon />
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (_, task) => {
        const isOverdue =
          task.dueDate &&
          new Date(task.dueDate) < new Date() &&
          task.status !== TASK_STATUS.COMPLETED;

        return (
          <div className="flex items-center gap-2">
            <TaskStatusBadge status={task.status || ""} showIcon />
            {isOverdue && (
              <Badge className="bg-red-100 text-red-800 text-xs">Quá hạn</Badge>
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
      label: "Bắt đầu thực hiện",
      icon: <Clock />,
      onClick: async (task) => {
        if (!task.taskId) {
          toast.error("Không thể xác định ID nhiệm vụ");
          return;
        }
        await handleStartTask(Number(task.taskId));
      },
      visible: (task) => task.status === TASK_STATUS.ASSIGNED,
    },
    {
      label: "Đánh dấu hoàn thành",
      icon: <CheckCircle />,
      onClick: async (task) => {
        if (!task.taskId) {
          toast.error("Không thể xác định ID nhiệm vụ");
          return;
        }
        await handleCompleteTask(Number(task.taskId));
      },
      visible: (task) => task.status === TASK_STATUS.IN_PROGRESS,
    },
    {
      label: "Tạm dừng",
      icon: <Pause />,
      onClick: async (task) => {
        if (!task.taskId) {
          toast.error("Không thể xác định ID nhiệm vụ");
          return;
        }
        await handlePauseTask(Number(task.taskId));
      },
      visible: (task) => task.status === TASK_STATUS.ASSIGNED || task.status === TASK_STATUS.IN_PROGRESS,
    },
    {
      label: "Hủy nhiệm vụ",
      icon: <X />,
      onClick: async (task) => {
        if (!task.taskId) {
          toast.error("Không thể xác định ID nhiệm vụ");
          return;
        }
        await handleCancelTask(Number(task.taskId));
      },
      visible: (task) => task.status === TASK_STATUS.ASSIGNED || task.status === TASK_STATUS.IN_PROGRESS || task.status === TASK_STATUS.ON_HOLD,
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 rounded-lg border border-indigo-200 dark:border-indigo-800/50">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Điều phối viên - Quản lý nhiệm vụ
        </h1>
        <p className="text-indigo-600 dark:text-indigo-300">
          Quản lý các nhiệm vụ và tổ chức được phân công
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Tổng nhiệm vụ"
          value={stats.totalTasks}
          description="Được giao"
          icon={FileText}
        />
        <StatsCard
          title="Chờ xử lý"
          value={stats.pendingTasks}
          description="Cần thực hiện"
          icon={AlertTriangle}
        />
        <StatsCard
          title="Đang thực hiện"
          value={stats.inProgressTasks}
          description="Đang tiến hành"
          icon={Clock}
        />
        <StatsCard
          title="Hoàn thành"
          value={stats.completedTasks}
          description="Đã xong"
          icon={CheckCircle}
        />
      </div>

      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/50 dark:via-purple-900/50 dark:to-pink-900/50 border-indigo-200 dark:border-indigo-800/50">
          <TabsTrigger
            value="tasks"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-indigo-200 hover:to-purple-200 dark:hover:from-indigo-800 dark:hover:to-purple-800 transition-all duration-300"
          >
            Nhiệm vụ của tôi
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-indigo-200 hover:to-purple-200 dark:hover:from-indigo-800 dark:hover:to-purple-800 transition-all duration-300"
          >
            Đã hoàn thành
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-indigo-200 dark:border-indigo-800/50">
            <CardContent className="p-4 bg-gradient-to-r from-indigo-100/30 to-purple-100/30 dark:from-indigo-900/20 dark:to-purple-900/20">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm nhiệm vụ..."
                    value={filter.search || ""}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={filter.status || "all"}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="Pending">Chờ xử lý</SelectItem>
                    <SelectItem value="In Progress">Đang thực hiện</SelectItem>
                    <SelectItem value="Completed">Hoàn thành</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filter.priority || "all"}
                  onValueChange={handlePriorityFilterChange}
                >
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

          <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-indigo-200 dark:border-indigo-800/50">
            <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/30 dark:to-purple-900/30">
              <CardTitle className="text-indigo-700 dark:text-indigo-300">
                Danh sách nhiệm vụ ({pagedResult?.totalCount || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={tasks}
                columns={taskColumns}
                actions={taskActions}
                loading={loading}
                pagination={{
                  currentPage: filter.pageNumber || 1,
                  totalPages: Math.ceil(
                    (pagedResult?.totalCount || 0) / (filter.pageSize || 10)
                  ),
                  pageSize: filter.pageSize || 10,
                  totalItems: pagedResult?.totalCount || 0,
                  onPageChange: handlePageChange,
                }}
                showPagination={true}
                emptyMessage="Chưa có nhiệm vụ nào được giao"
                className="cursor-pointer transition-colors"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-indigo-200 dark:border-indigo-800/50">
            <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/30 dark:to-purple-900/30">
              <CardTitle className="text-indigo-700 dark:text-indigo-300">
                Nhiệm vụ đã hoàn thành ({completedTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={completedTasks}
                columns={taskColumns}
                actions={[
                  {
                    label: "Xem chi tiết",
                    icon: <Eye />,
                    onClick: handleViewTask,
                    variant: "ghost",
                  },
                ]}
                loading={loading}
                emptyMessage="Chưa có nhiệm vụ nào hoàn thành"
                className="cursor-pointer transition-colors"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Task Details Modal */}
      <TaskDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={detailsModal.close}
        task={selectedTask}
        onComplete={handleCompleteTask}
      />
    </div>
  );
}
