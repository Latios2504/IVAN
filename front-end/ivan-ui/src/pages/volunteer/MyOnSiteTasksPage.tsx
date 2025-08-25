import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { onSiteTaskService } from "@/services/onSiteTaskService";
import type {
  OnSiteTaskDto,
} from "@/types/onSiteTask";
import type { PagedResultDto } from "@/types/common";
import TaskList from "@/components/volunteer/onsite-task/TaskList";

const MyOnSiteTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<OnSiteTaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    loadMyTasks(currentPage);
  }, []);

  const loadMyTasks = async (page: number = 1) => {
    try {
      setLoading(page === 1);
      setRefreshing(page !== 1);
      const result: PagedResultDto<OnSiteTaskDto> = await onSiteTaskService.getOnSiteTasks(
        page,
        pageSize
      );
      setTasks(result.items);
      setTotalPages(Math.ceil(result.totalCount / pageSize));
      setTotalTasks(result.totalCount);
      setCurrentPage(page);
    } catch (error) {
      toast.error("Không thể tải danh sách nhiệm vụ của bạn");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleStartTask = async (taskId: number) => {
    try {
      const task = await onSiteTaskService.getOnSiteTaskById(taskId);
      await onSiteTaskService.updateOnSiteTask(taskId, {
        ...task,
        statusId: 2 // Status: In Progress
      });
      toast.success("Bắt đầu nhiệm vụ thành công");
      await loadMyTasks(currentPage);
    } catch (error) {
      toast.error("Không thể bắt đầu nhiệm vụ");
    }
  };

  const handleCompleteTask = async (taskId: number, actualHours?: number, notes?: string) => {
    try {
      const task = await onSiteTaskService.getOnSiteTaskById(taskId);
      await onSiteTaskService.updateOnSiteTask(taskId, {
        ...task,
        statusId: 3, // Status: Completed
        actualHours: actualHours,
        notes: notes || task.notes
      });
      toast.success("Hoàn thành nhiệm vụ thành công");
      await loadMyTasks(currentPage);
    } catch (error) {
      toast.error("Không thể hoàn thành nhiệm vụ");
    }
  };

  const handleRefresh = async () => {
    await loadMyTasks(currentPage);
  };

  const getTaskStats = () => {
    const total = totalTasks;
    const pending = tasks.filter(t => t.statusId === 1).length;
    const inProgress = tasks.filter(t => t.statusId === 2).length;
    const completed = tasks.filter(t => t.statusId === 3).length;
    const overdue = tasks.filter(t => t.statusId !== 3 && new Date(t.endTime || '') < new Date()).length;
    
    return { total, pending, inProgress, completed, overdue };
  };

  const stats = getTaskStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My On-Site Tasks</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your assigned tasks
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={loading || refreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${(loading || refreshing) ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-gray-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <TaskList
        tasks={tasks}
        loading={loading}
        onStartTask={handleStartTask}
        onCompleteTask={handleCompleteTask}
        showFilters={true}
        showStats={false}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} / {totalPages} (Total: {totalTasks} tasks)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadMyTasks(currentPage - 1)}
              disabled={currentPage === 1 || loading || refreshing}
            >
              <ChevronLeft className="w-4 h-4" />
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadMyTasks(currentPage + 1)}
              disabled={currentPage === totalPages || loading || refreshing}
            >
              Sau
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOnSiteTasksPage;
