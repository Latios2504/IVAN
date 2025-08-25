import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Users,
  Calendar,
  Building,
  FileText,
  TrendingUp,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import coordinatorTaskService from "@/services/coordinatorTaskService";
import type {
  CoordinatorTaskDto,
  TaskStatus,
  TaskPriority,
} from "@/types/coordinatorTask";

export default function CoordinatorTasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<CoordinatorTaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      // Get tasks for the current coordinator
      const tasksData = await coordinatorTaskService.getAllTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Không thể tải danh sách nhiệm vụ");
    } finally {
      setLoading(false);
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

  // Calculate stats from tasks
  const stats = {
    totalTasks: tasks.length,
    pendingTasks: tasks.filter((t) => t.status === "Pending").length,
    inProgressTasks: tasks.filter((t) => t.status === "In Progress").length,
    completedTasks: tasks.filter((t) => t.status === "Completed").length,
    totalEstimatedHours: tasks.reduce(
      (sum, task) => sum + (task.estimatedHours || 0),
      0
    ),
    totalActualHours: tasks.reduce(
      (sum, task) => sum + (task.actualHours || 0),
      0
    ),
  };

  const handleUpdateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      // Call the update API using coordinatorTaskService
      await coordinatorTaskService.updateTaskStatus(taskId, newStatus as any);
      
      // Update local state
      setTasks((prev) =>
        prev.map((task) =>
          task.taskId === taskId
            ? {
                ...task,
                status: newStatus,
                completedAt:
                  newStatus === "Completed"
                    ? new Date().toISOString()
                    : task.completedAt,
              }
            : task
        )
      );
      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "Khẩn cấp":
      case "Urgent":
        return "bg-red-100 text-red-800";
      case "Cao":
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Trung bình":
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Thấp":
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "Hoàn thành":
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Đang thực hiện":
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "Chờ xử lý":
      case "Pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "Completed":
        return "Hoàn thành";
      case "In Progress":
        return "Đang thực hiện";
      case "Pending":
        return "Chờ xử lý";
      case "Overdue":
        return "Quá hạn";
      default:
        return status || "Không xác định";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa xác định";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
        <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-indigo-200 dark:border-indigo-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/30 dark:to-purple-900/30">
            <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Tổng nhiệm vụ</CardTitle>
            <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">{stats.totalTasks}</div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400">Được giao</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-indigo-200 dark:border-indigo-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/30 dark:to-purple-900/30">
            <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              Nhiệm vụ chờ xử lý
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">{stats.pendingTasks}</div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400">Cần thực hiện</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-indigo-200 dark:border-indigo-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/30 dark:to-purple-900/30">
            <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              Đang thực hiện
            </CardTitle>
            <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">{stats.inProgressTasks}</div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400">Đang tiến hành</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-indigo-200 dark:border-indigo-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/30 dark:to-purple-900/30">
            <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Hoàn thành</CardTitle>
            <CheckCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">{stats.completedTasks}</div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400">Đã xong</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/50 dark:via-purple-900/50 dark:to-pink-900/50 border-indigo-200 dark:border-indigo-800/50">
          <TabsTrigger value="tasks" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-indigo-200 hover:to-purple-200 dark:hover:from-indigo-800 dark:hover:to-purple-800 transition-all duration-300">Nhiệm vụ của tôi</TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-indigo-200 hover:to-purple-200 dark:hover:from-indigo-800 dark:hover:to-purple-800 transition-all duration-300">Đã hoàn thành</TabsTrigger>
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
                  </SelectContent>
                </Select>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
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
              <CardTitle className="text-indigo-700 dark:text-indigo-300">Danh sách nhiệm vụ ({filteredTasks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      {tasks.length === 0
                        ? "Chưa có nhiệm vụ nào được giao"
                        : "Không tìm thấy nhiệm vụ phù hợp với bộ lọc"}
                    </p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div
                      key={`${task.taskId}-${task.coordinatorId}`}
                      className="border border-indigo-200 dark:border-indigo-800/50 rounded-lg p-4 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 hover:bg-gradient-to-br hover:from-indigo-100/70 hover:via-purple-100/70 hover:to-pink-100/70 dark:hover:from-indigo-900/30 dark:hover:via-purple-900/30 dark:hover:to-pink-900/30 cursor-pointer transition-all duration-300"
                      onClick={() =>
                        setSelectedTask(
                          selectedTask ===
                            `${task.taskId}-${task.coordinatorId}`
                            ? null
                            : `${task.taskId}-${task.coordinatorId}`
                        )
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(task.status || undefined)}
                            <h3 className="font-semibold">{task.taskName}</h3>
                            {task.priority && (
                              <Badge
                                className={getPriorityColor(task.priority)}
                              >
                                {task.priority}
                              </Badge>
                            )}
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-600 mb-2">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {task.dueDate && (
                              <span>Hạn: {formatDate(task.dueDate)}</span>
                            )}
                            <span>
                              Trạng thái:{" "}
                              {getStatusText(task.status || undefined)}
                            </span>
                            {task.estimatedHours && (
                              <span>Ước tính: {task.estimatedHours}h</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              {task.status !== "Completed" && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateTaskStatus(
                                      task.taskId,
                                      "Completed"
                                    );
                                  }}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Đánh dấu hoàn thành
                                </DropdownMenuItem>
                              )}
                              {task.status === "Pending" && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateTaskStatus(
                                      task.taskId,
                                      "In Progress"
                                    );
                                  }}
                                >
                                  <Clock className="mr-2 h-4 w-4" />
                                  Bắt đầu thực hiện
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {selectedTask ===
                        `${task.taskId}-${task.coordinatorId}` && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Danh mục:</strong>{" "}
                              {task.category || "Chưa phân loại"}
                            </div>
                            <div>
                              <strong>Thời gian thực tế:</strong>{" "}
                              {task.actualHours || 0}h
                            </div>
                            {task.completedAt && (
                              <div>
                                <strong>Hoàn thành lúc:</strong>{" "}
                                {formatDate(task.completedAt)}
                              </div>
                            )}
                            {task.notes && (
                              <div className="md:col-span-2">
                                <strong>Ghi chú:</strong> {task.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-indigo-200 dark:border-indigo-800/50">
            <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/30 dark:to-purple-900/30">
              <CardTitle className="text-indigo-700 dark:text-indigo-300">Nhiệm vụ đã hoàn thành</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks
                  .filter((task) => task.status === "Completed")
                  .map((task) => (
                    <div
                      key={`${task.taskId}-${task.coordinatorId}`}
                      className="border border-green-200 dark:border-green-800/50 rounded-lg p-4 bg-gradient-to-br from-green-50/70 via-emerald-50/70 to-teal-50/70 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <h3 className="font-semibold">{task.taskName}</h3>
                            <Badge className="bg-green-100 text-green-800">
                              Hoàn thành
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-600 mb-2">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {task.completedAt && (
                              <span>
                                Hoàn thành: {formatDate(task.completedAt)}
                              </span>
                            )}
                            {task.actualHours && (
                              <span>Thời gian: {task.actualHours}h</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {tasks.filter((task) => task.status === "Completed").length ===
                  0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      Chưa có nhiệm vụ nào hoàn thành
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
