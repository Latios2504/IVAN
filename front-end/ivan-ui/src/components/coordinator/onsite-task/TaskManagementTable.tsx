import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TaskStatusBadge from "../../volunteer/onsite-task/TaskStatusBadge";
import type { OnSiteTaskDto } from "@/types/onSiteTask";

interface TaskManagementTableProps {
  tasks: OnSiteTaskDto[];
  loading?: boolean;
  onViewTask?: (task: OnSiteTaskDto) => void;
  onEditTask?: (task: OnSiteTaskDto) => void;
  onDeleteTask?: (taskId: number) => void;
  onAssignVolunteers?: (task: OnSiteTaskDto) => void;
  onStartTask?: (taskId: number) => void;
  onCompleteTask?: (taskId: number) => void;
  showActions?: boolean;
}

const TaskManagementTable: React.FC<TaskManagementTableProps> = ({
  tasks,
  loading = false,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onAssignVolunteers,
  onStartTask,
  onCompleteTask,
  showActions = true,
}) => {
  const [taskToDelete, setTaskToDelete] = useState<OnSiteTaskDto | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (task: OnSiteTaskDto) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete && onDeleteTask) {
      onDeleteTask(taskToDelete.taskId);
    }
    setTaskToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const getPriorityBadge = (priority?: string) => {
    const priorityColors: Record<string, string> = {
      High: "bg-red-100 text-red-800 border-red-300",
      Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
      Low: "bg-green-100 text-green-800 border-green-300",
    };

    const colorClass =
      priorityColors[priority || "Medium"] || priorityColors["Medium"];
    return (
      <Badge className={`${colorClass} text-xs`}>
        {priority === "High" ? "Cao" : priority === "Medium" ? "Trung bình" : "Thấp"}
      </Badge>
    );
  };

  const getDifficultyBadge = (difficulty?: string) => {
    const difficultyColors: Record<string, string> = {
      Hard: "bg-red-100 text-red-800 border-red-300",
      Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
      Easy: "bg-green-100 text-green-800 border-green-300",
    };

    const colorClass =
      difficultyColors[difficulty || "Medium"] || difficultyColors["Medium"];
    return (
      <Badge className={`${colorClass} text-xs`}>
        {difficulty === "Hard" ? "Khó" : difficulty === "Medium" ? "Trung bình" : "Dễ"}
      </Badge>
    );
  };

  const formatDateTime = (dateTime?: string) => {
    if (!dateTime) return "--";
    return new Date(dateTime).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOverdue = (task: OnSiteTaskDto) => {
    if (!task.endTime || task.statusId === 3) return false;
    return new Date(task.endTime) < new Date();
  };

  const canStartTask = (task: OnSiteTaskDto) => {
    // Can start if task is pending and has assigned volunteers
    return task.statusId === 1 && (task.assignedVolunteers || 0) > 0;
  };

  const canCompleteTask = (task: OnSiteTaskDto) => {
    // Can complete if task is in progress
    return task.statusId === 2;
  };

  const getTaskStatusMessage = (task: OnSiteTaskDto) => {
    if (task.statusId === 1 && (task.assignedVolunteers || 0) === 0) {
      return "Cần phân công tình nguyện viên trước khi bắt đầu";
    }
    if (task.statusId === 1 && (task.assignedVolunteers || 0) < (task.requiredVolunteers || 0)) {
      return "Khuyến nghị phân công đủ tình nguyện viên";
    }
    return null;
  };

  const getVolunteerStatus = (task: OnSiteTaskDto) => {
    const assigned = task.assignedVolunteers || 0;
    const required = task.requiredVolunteers || 0;
    
    if (assigned === 0) {
      return { color: "text-red-600", text: "Chưa phân công" };
    } else if (assigned < required) {
      return { color: "text-yellow-600", text: "Thiếu người" };
    } else {
      return { color: "text-green-600", text: "Đủ người" };
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg text-muted-foreground">Chưa có nhiệm vụ nào</p>
        <p className="text-sm text-muted-foreground">Tạo nhiệm vụ mới để bắt đầu</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-orange-50 dark:bg-orange-950/20">
              <TableHead className="font-semibold">Nhiệm vụ</TableHead>
              <TableHead className="font-semibold">Trạng thái</TableHead>
              <TableHead className="font-semibold">Thời gian</TableHead>
              <TableHead className="font-semibold">Địa điểm</TableHead>
              <TableHead className="font-semibold">Tình nguyện viên</TableHead>
              <TableHead className="font-semibold">Độ ưu tiên</TableHead>
              <TableHead className="font-semibold">Thời gian dự kiến</TableHead>
              {showActions && <TableHead className="font-semibold text-center">Thao tác</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => {
              const volunteerStatus = getVolunteerStatus(task);
              const overdueTask = isOverdue(task);
              
              return (
                <TableRow
                  key={task.taskId}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                    overdueTask ? "bg-red-50 dark:bg-red-950/20" : ""
                  }`}
                >
                  {/* Task Name & Description */}
                  <TableCell className="max-w-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{task.taskName}</span>
                        {overdueTask && (
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Nhiệm vụ đã quá hạn</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex gap-1">
                        {task.difficulty && getDifficultyBadge(task.difficulty)}
                      </div>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <TaskStatusBadge statusId={task.statusId} size="sm" />
                  </TableCell>

                  {/* Time */}
                  <TableCell>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-green-500" />
                        <span>{formatDateTime(task.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-red-500" />
                        <span>{formatDateTime(task.endTime)}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Location */}
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-3 h-3 text-orange-500" />
                      <span className="truncate max-w-24">{task.location || "--"}</span>
                    </div>
                  </TableCell>

                  {/* Volunteers */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="w-3 h-3 text-blue-500" />
                        <span>
                          {task.assignedVolunteers || 0} / {task.requiredVolunteers || 0}
                        </span>
                      </div>
                      <div className={`text-xs ${volunteerStatus.color}`}>
                        {volunteerStatus.text}
                      </div>
                    </div>
                  </TableCell>

                  {/* Priority */}
                  <TableCell>
                    {task.priority && getPriorityBadge(task.priority)}
                  </TableCell>

                  {/* Estimated Hours */}
                  <TableCell>
                    <div className="text-sm">
                      {task.estimatedHours ? `${task.estimatedHours}h` : "--"}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  {showActions && (
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {onViewTask && (
                              <DropdownMenuItem onClick={() => onViewTask(task)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                            )}
                            
                            {onEditTask && (
                              <DropdownMenuItem onClick={() => onEditTask(task)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                            )}
                            
                            {onAssignVolunteers && (
                              <DropdownMenuItem onClick={() => onAssignVolunteers(task)}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Phân công TNV
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            
                            {task.statusId === 1 && onStartTask && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <DropdownMenuItem 
                                      onClick={() => canStartTask(task) ? onStartTask(task.taskId) : undefined}
                                      className={canStartTask(task) ? "text-blue-600" : "text-gray-400 cursor-not-allowed"}
                                      disabled={!canStartTask(task)}
                                    >
                                      <PlayCircle className="mr-2 h-4 w-4" />
                                      Bắt đầu nhiệm vụ
                                    </DropdownMenuItem>
                                  </TooltipTrigger>
                                  {!canStartTask(task) && (
                                    <TooltipContent>
                                      <p>{getTaskStatusMessage(task)}</p>
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            
                            {canCompleteTask(task) && onCompleteTask && (
                              <DropdownMenuItem 
                                onClick={() => onCompleteTask(task.taskId)}
                                className="text-green-600"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Hoàn thành
                              </DropdownMenuItem>
                            )}
                            
                            {(canStartTask(task) || canCompleteTask(task)) && onDeleteTask && (
                              <DropdownMenuSeparator />
                            )}
                            
                            {onDeleteTask && (
                              <DropdownMenuItem 
                                onClick={() => handleDeleteClick(task)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa nhiệm vụ
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Xác nhận xóa nhiệm vụ
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa nhiệm vụ "{taskToDelete?.taskName}"?
              <br />
              <span className="text-red-600 font-medium">
                Hành động này không thể hoàn tác.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa nhiệm vụ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export default TaskManagementTable;