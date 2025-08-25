import React, { useState } from "react";
import { Search, Filter, RefreshCw, AlertCircle } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import TaskCard from "./TaskCard";
import TaskDetailModal from "./TaskDetailModal";
import type { OnSiteTaskDto } from "@/types/onSiteTask";

interface TaskListProps {
  tasks: OnSiteTaskDto[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onStartTask?: (taskId: number) => void;
  onCompleteTask?: (taskId: number, actualHours?: number, notes?: string) => void;
  showFilters?: boolean;
  showStats?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading = false,
  error = null,
  onRefresh,
  onStartTask,
  onCompleteTask,
  showFilters = true,
  showStats = true,
}) => {
  const [selectedTask, setSelectedTask] = useState<OnSiteTaskDto | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.taskName
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "pending" && task.statusId === 1) ||
      (statusFilter === "in_progress" && task.statusId === 2) ||
      (statusFilter === "completed" && task.statusId === 3);

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.statusId === 1).length,
    inProgress: tasks.filter(t => t.statusId === 2).length,
    completed: tasks.filter(t => t.statusId === 3).length,
    overdue: tasks.filter(t => {
      if (!t.endTime || t.statusId === 3) return false;
      return new Date(t.endTime) < new Date();
    }).length,
  };

  const handleViewTask = (task: OnSiteTaskDto) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTask(null);
  };

  const handleStartTask = (taskId: number) => {
    if (onStartTask) {
      onStartTask(taskId);
    }
  };

  const handleCompleteTask = (taskId: number, actualHours?: number, notes?: string) => {
    if (onCompleteTask) {
      onCompleteTask(taskId, actualHours, notes);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-700 mb-2">
          Có lỗi xảy ra
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Thử lại
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-orange-600">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Tổng nhiệm vụ</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Chờ thực hiện</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <div className="text-sm text-muted-foreground">Đang thực hiện</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Hoàn thành</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-muted-foreground">Quá hạn</div>
          </div>
        </div>
      )}

      {/* Header with Refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-300">
            Nhiệm vụ của tôi
          </h2>
          <p className="text-muted-foreground">
            Quản lý và theo dõi các nhiệm vụ được giao
          </p>
        </div>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        )}
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold">Bộ lọc</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Đặt lại
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm nhiệm vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ thực hiện</SelectItem>
                <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Active Filters */}
          {(searchTerm || statusFilter !== "all") && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Bộ lọc đang áp dụng:</span>
              {searchTerm && (
                <Badge variant="secondary">
                  Tìm kiếm: "{searchTerm}"
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary">
                  Trạng thái: {statusFilter === "pending" ? "Chờ thực hiện" : 
                    statusFilter === "in_progress" ? "Đang thực hiện" : "Hoàn thành"}
                </Badge>
              )}
            </div>
          )}
        </div>
      )}

      <Separator />

      {/* Tasks Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
          <span className="ml-2 text-muted-foreground">Đang tải nhiệm vụ...</span>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {tasks.length === 0 ? (
              <>
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">Chưa có nhiệm vụ nào được giao</p>
                <p className="text-sm">Các nhiệm vụ sẽ xuất hiện ở đây khi được phân công</p>
              </>
            ) : (
              <>
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">Không tìm thấy nhiệm vụ phù hợp</p>
                <p className="text-sm">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
              </>
            )}
          </div>
          {(searchTerm || statusFilter !== "all") && (
            <Button variant="outline" onClick={resetFilters}>
              Xóa bộ lọc
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.taskId}
              task={task}
              onViewDetails={handleViewTask}
              onStartTask={handleStartTask}
              onCompleteTask={handleCompleteTask}
            />
          ))}
        </div>
      )}

      {/* Results Summary */}
      {!loading && filteredTasks.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Hiển thị {filteredTasks.length} / {tasks.length} nhiệm vụ
        </div>
      )}

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        onStartTask={handleStartTask}
        onCompleteTask={handleCompleteTask}
      />
    </div>
  );
};

export default TaskList;