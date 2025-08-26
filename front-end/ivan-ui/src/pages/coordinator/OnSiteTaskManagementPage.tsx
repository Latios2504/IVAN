import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus,
  RefreshCw,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
} from "lucide-react";
import { onSiteTaskService } from "@/services/onSiteTaskService";
import type {
  OnSiteTaskDto,
  OnSiteTaskInputDto,
  OnSiteTaskUpdateDto,
  OnSiteTaskFilterDto,
} from "@/types/onSiteTask";
import { DEFAULT_ONSITE_TASK_FILTER } from "@/types/onSiteTask";
import TaskManagementTable from "@/components/coordinator/onsite-task/TaskManagementTable";
import TaskCreateForm from "@/components/coordinator/onsite-task/TaskCreateForm";
import TaskEditForm from "@/components/coordinator/onsite-task/TaskEditForm";
import TaskFilters from "@/components/coordinator/onsite-task/TaskFilters";
import TaskAssignmentModal from "@/components/coordinator/onsite-task/TaskAssignmentModal";

interface Event {
  eventId: number;
  eventName: string;
  startDate: string;
  endDate: string;
}

const OnSiteTaskManagementPage: React.FC = () => {
  const [tasks, setTasks] = useState<OnSiteTaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<OnSiteTaskFilterDto>(
    DEFAULT_ONSITE_TASK_FILTER
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState<OnSiteTaskDto | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<OnSiteTaskDto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const pageSize = 12;

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    loadEvents();
  }, []);

  const fetchTasks = async (page: number = 1) => {
    try {
      setLoading(page === 1);
      setRefreshing(page !== 1);
      const filterParams: OnSiteTaskFilterDto = {
        ...filters,
        search: searchTerm,
        pageNumber: page,
        pageSize,
      };
      const response = await onSiteTaskService.getAll(filterParams);
      setTasks(response.items);
      setTotalPages(response.totalPages);
      setTotalTasks(response.totalCount);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Không thể tải danh sách nhiệm vụ");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadEvents = async () => {
    try {
      setLoadingOptions(true);
      // Get all tasks to extract unique events
      const allTasksResult = await onSiteTaskService.getAll({
        pageNumber: 1,
        pageSize: 1000, // Get a large number to capture all events
      });
      
      // Extract unique events from tasks
      const uniqueEventsMap = new Map<number, Event>();
      
      allTasksResult.items.forEach(task => {
        if (task.eventId && task.eventName && !uniqueEventsMap.has(task.eventId)) {
          uniqueEventsMap.set(task.eventId, {
            eventId: task.eventId,
            eventName: task.eventName,
            startDate: task.createdAt || new Date().toISOString(),
            endDate: task.updatedAt || new Date().toISOString()
          });
        }
      });
      
      // Convert map to array
      const uniqueEvents = Array.from(uniqueEventsMap.values());
      setEvents(uniqueEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
      // Fallback to empty array if loading fails
      setEvents([]);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleCreateTask = async (taskData: OnSiteTaskInputDto) => {
    try {
      await onSiteTaskService.createOnSiteTask(taskData);
      toast.success("Đã tạo nhiệm vụ mới");
      setIsCreateDialogOpen(false);
      await fetchTasks(currentPage);
      loadEvents(); // Reload events after creating task
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Không thể tạo nhiệm vụ");
      throw error;
    }
  };

  const handleUpdateTask = (task: OnSiteTaskDto) => {
    setTaskToEdit(task);
    setIsEditDialogOpen(true);
  };

  const handleUpdateTaskSubmit = async (taskData: OnSiteTaskUpdateDto) => {
    if (!taskToEdit) return;
    
    try {
      await onSiteTaskService.updateOnSiteTask(taskToEdit.taskId, taskData);
      toast.success("Đã cập nhật nhiệm vụ");
      setIsEditDialogOpen(false);
      setTaskToEdit(null);
      await fetchTasks(currentPage);
      loadEvents(); // Reload events after updating task
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Không thể cập nhật nhiệm vụ");
      throw error;
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await onSiteTaskService.deleteOnSiteTask(taskId);
      toast.success("Đã xóa nhiệm vụ");
      await fetchTasks(currentPage);
      loadEvents(); // Reload events after deleting task
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Không thể xóa nhiệm vụ");
      throw error;
    }
  };

  const handleAssignVolunteers = async (
    taskId: number,
    volunteerIds: number[]
  ) => {
    try {
      // Assign each volunteer individually
      for (const volunteerId of volunteerIds) {
        await onSiteTaskService.assignVolunteerToTask(taskId, volunteerId);
      }
      toast.success("Đã phân công tình nguyện viên");
      await fetchTasks(currentPage);
    } catch (error) {
      console.error("Error assigning volunteers:", error);
      toast.error("Không thể phân công tình nguyện viên");
      throw error;
    }
  };

  const handleUnassignVolunteers = async (
    taskId: number,
    volunteerIds: number[]
  ) => {
    try {
      // Unassign each volunteer individually
      for (const volunteerId of volunteerIds) {
        await onSiteTaskService.unassignVolunteerFromTask(taskId, volunteerId);
      }
      toast.success("Đã hủy phân công tình nguyện viên");
      await fetchTasks(currentPage);
    } catch (error) {
      console.error("Error unassigning volunteers:", error);
      toast.error("Không thể hủy phân công tình nguyện viên");
      throw error;
    }
  };

  const handleStartTask = async (taskId: number) => {
    try {
      const task = await onSiteTaskService.getOnSiteTaskById(taskId);
      await onSiteTaskService.updateOnSiteTask(taskId, {
        ...task,
        statusId: 2 // Status: In Progress
      });
      toast.success("Đã bắt đầu nhiệm vụ");
      await fetchTasks(currentPage);
    } catch (error) {
      console.error("Error starting task:", error);
      toast.error("Không thể bắt đầu nhiệm vụ");
      throw error;
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      const task = await onSiteTaskService.getOnSiteTaskById(taskId);
      await onSiteTaskService.updateOnSiteTask(taskId, {
        ...task,
        statusId: 3 // Status: Completed
      });
      toast.success("Đã hoàn thành nhiệm vụ");
      await fetchTasks(currentPage);
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Không thể hoàn thành nhiệm vụ");
      throw error;
    }
  };

  const handleRefresh = async () => {
    await fetchTasks(currentPage);
  };

  const handleFiltersChange = (newFilters: OnSiteTaskFilterDto) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const openAssignmentModal = (task: OnSiteTaskDto) => {
    setSelectedTask(task);
    setIsAssignmentModalOpen(true);
  };

  const getTaskStats = () => {
    const total = totalTasks;
    const pending = tasks.filter((t) => t.statusId === 1).length; // 1 = Pending
    const inProgress = tasks.filter((t) => t.statusId === 2).length; // 2 = In Progress
    const completed = tasks.filter((t) => t.statusId === 3).length; // 3 = Completed
    const unassigned = tasks.filter(
      (t) => !t.assignedVolunteers || t.assignedVolunteers === 0
    ).length;

    return { total, pending, inProgress, completed, unassigned };
  };

  const stats = getTaskStats();

  // Apply filters and search to tasks
  useEffect(() => {
    fetchTasks(1);
  }, [filters, searchTerm]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800/50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Quản lý nhiệm vụ tại chỗ
          </h1>
          <p className="text-indigo-600 dark:text-indigo-400">
            Quản lý và phân công nhiệm vụ cho các sự kiện
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo nhiệm vụ
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Tổng nhiệm vụ
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {stats.total}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/30 border-yellow-200 dark:border-yellow-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Chờ thực hiện
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
              {stats.pending}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Đang thực hiện
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {stats.inProgress}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Hoàn thành
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              {stats.completed}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 border-red-200 dark:border-red-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
              Chưa phân công
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800 dark:text-red-200">
              {stats.unassigned}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <TaskFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        events={events}
      />

      {/* Tasks Table */}
      <TaskManagementTable
        tasks={tasks}
        loading={loading}
        onEditTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onAssignVolunteers={openAssignmentModal}
        onStartTask={handleStartTask}
        onCompleteTask={handleCompleteTask}
      />

      {/* Create Task Dialog */}
      <TaskCreateForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateTask}
        events={events}
      />

      {/* Edit Task Dialog */}
      {taskToEdit && (
        <TaskEditForm
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleUpdateTaskSubmit}
          events={events}
          task={taskToEdit}
        />
      )}

      {/* Assignment Modal */}
      {selectedTask && (
        <TaskAssignmentModal
          open={isAssignmentModalOpen}
          onOpenChange={setIsAssignmentModalOpen}
          task={selectedTask}
          onAssign={handleAssignVolunteers}
          onUnassign={handleUnassignVolunteers}
        />
      )}
    </div>
  );
};

export default OnSiteTaskManagementPage;
