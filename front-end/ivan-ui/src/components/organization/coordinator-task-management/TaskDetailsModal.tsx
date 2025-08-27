import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  Edit,
  Trash2,
} from "lucide-react";
import type { CoordinatorTaskDto } from "@/types/coordinatorTask";
import { TASK_STATUS } from "@/types/coordinatorTask";
import type { VolunteerCoordinatorDto } from "@/types/volunteerCoordinator";
import type { EventDto } from "@/types/events";
import volunteerCoordinatorService from "@/services/volunteerCoordinatorService";
import eventsService from "@/services/eventsService";
import { useAuth } from "@/hooks/useAuth";
import TaskPriorityBadge from "./TaskPriorityBadge";
import TaskStatusBadge from "./TaskStatusBadge";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: CoordinatorTaskDto | null;
  onEdit?: (task: CoordinatorTaskDto) => void;
  onDelete?: (taskId: number) => void;
  onComplete?: (taskId: number) => void;
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
  onComplete,
}) => {
  const { user } = useAuth();
  const [coordinator, setCoordinator] =
    useState<VolunteerCoordinatorDto | null>(null);
  const [event, setEvent] = useState<EventDto | null>(null);
  const [loading, setLoading] = useState(false);

  // Load coordinator and event data when task changes
  useEffect(() => {
    if (!task || !isOpen || !user?.organizationId) return;

    const loadData = async () => {
      try {
        setLoading(true);

        // Load coordinator info
        if (task.coordinatorId && user.organizationId) {
          try {
            const coordinatorResult =
              await volunteerCoordinatorService.getCoordinatorsByOrganization(
                user.organizationId,
                {
                  page: 1,
                  size: 100,
                  sortBy: "CreatedAt",
                  sortOrder: "desc",
                }
              );
            const foundCoordinator = coordinatorResult.items?.find(
              (c) => String(c.coordinatorId) === String(task.coordinatorId)
            );
            setCoordinator(foundCoordinator || null);
          } catch (error) {
            console.error("Error loading coordinator:", error);
            setCoordinator(null);
          }
        }

        // Load event info
        if (task.eventId) {
          try {
            const eventResult = await eventsService.getEvents({
              organizationId: user.organizationId || undefined,
              size: 100,
              page: 1,
              sortBy: "CreatedAt",
              sortDirection: "desc",
            });
            const foundEvent = eventResult.items?.find(
              (e) => String(e.eventId) === String(task.eventId)
            );
            setEvent(foundEvent || null);
          } catch (error) {
            console.error("Error loading event:", error);
            setEvent(null);
          }
        }
      } catch (error) {
        console.error("Error loading task details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [task, isOpen, user?.organizationId]);

  if (!task) return null;

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== TASK_STATUS.COMPLETED;
  const canComplete = task.status === TASK_STATUS.IN_PROGRESS;
  const progressPercentage = task.estimatedHours
    ? Math.min(((task.actualHours || 0) / task.estimatedHours) * 100, 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 -m-6 mb-6 p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-slate-900 dark:text-slate-100 font-bold text-xl">
              Chi tiết nhiệm vụ
            </DialogTitle>
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(task)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Chỉnh sửa
                </Button>
              )}
              {canComplete && onComplete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onComplete(task.taskId)}
                  className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Hoàn thành
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(task.taskId)}
                  className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Xóa
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Header */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {task.taskName}
                </h2>
                {isOverdue && (
                  <Badge className="bg-red-100 text-red-800 border-red-300 mb-2">
                    Quá hạn
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {task.priority && (
                  <TaskPriorityBadge priority={task.priority} />
                )}
                {task.status && <TaskStatusBadge status={task.status} />}
              </div>
            </div>

            {task.description && (
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          {/* Task Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <h3 className="font-bold text-lg mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Thông tin cơ bản
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-slate-800/50 rounded border">
                  <span className="text-sm text-blue-700 dark:text-blue-300 font-medium flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Điều phối viên:
                  </span>
                  <div className="text-right">
                    {loading ? (
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        Đang tải...
                      </span>
                    ) : coordinator ? (
                      <div>
                        <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
                          {coordinator.user?.fullName ||
                            coordinator.user?.email ||
                            "Không có tên"}
                        </span>
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          ID: {task.coordinatorId}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
                        ID: {task.coordinatorId}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-slate-800/50 rounded border">
                  <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    Sự kiện:
                  </span>
                  <div className="text-right">
                    {loading ? (
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        Đang tải...
                      </span>
                    ) : event ? (
                      <div>
                        <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
                          {event.eventName}
                        </span>
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          ID: {task.eventId}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
                        ID: {task.eventId}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-slate-800/50 rounded border">
                  <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    Danh mục:
                  </span>
                  <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
                    {task.category || "Chưa phân loại"}
                  </span>
                </div>
              </div>
            </div>

            {/* Time Information */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <h3 className="font-bold text-lg mb-4 text-green-900 dark:text-green-100 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Thời gian
              </h3>
              <div className="space-y-3">
                {task.dueDate && (
                  <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-slate-800/50 rounded border">
                    <span className="text-sm text-green-700 dark:text-green-300 font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Hạn chót:
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        isOverdue
                          ? "text-red-600"
                          : "text-green-900 dark:text-green-100"
                      }`}
                    >
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                )}
                {task.completedAt && (
                  <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-slate-800/50 rounded border">
                    <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                      Ngày hoàn thành:
                    </span>
                    <span className="text-sm font-bold text-green-900 dark:text-green-100">
                      {formatDate(task.completedAt)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-slate-800/50 rounded border">
                  <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                    Thời gian ước tính:
                  </span>
                  <span className="text-sm font-bold text-green-900 dark:text-green-100">
                    {task.estimatedHours || 0}h
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-slate-800/50 rounded border">
                  <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                    Thời gian thực tế:
                  </span>
                  <span className="text-sm font-bold text-green-900 dark:text-green-100">
                    {task.actualHours || 0}h
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {task.estimatedHours && task.estimatedHours > 0 && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
              <h4 className="font-bold mb-3 text-indigo-900 dark:text-indigo-100">
                Tiến độ thời gian
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                    Tiến độ: {progressPercentage.toFixed(1)}%
                  </span>
                  <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                    {task.actualHours || 0}h / {task.estimatedHours}h
                  </span>
                </div>
                <div className="w-full bg-gradient-to-r from-slate-200 to-gray-200 dark:from-slate-600 dark:to-gray-600 rounded-full h-3 shadow-inner">
                  <div
                    className={`h-3 rounded-full shadow-lg transition-all duration-500 ${
                      progressPercentage > 100
                        ? "bg-gradient-to-r from-red-500 to-red-600"
                        : progressPercentage >= 80
                        ? "bg-gradient-to-r from-yellow-500 to-orange-600"
                        : "bg-gradient-to-r from-blue-500 to-indigo-600"
                    }`}
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
                {progressPercentage > 100 && (
                  <p className="text-red-600 text-sm font-medium">
                    ⚠️ Vượt quá thời gian ước tính{" "}
                    {(progressPercentage - 100).toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {task.notes && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
              <h4 className="font-bold mb-3 text-amber-900 dark:text-amber-100">
                Ghi chú
              </h4>
              <p className="text-amber-800 dark:text-amber-200 text-sm bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg border border-amber-300 dark:border-amber-600 leading-relaxed whitespace-pre-wrap">
                {task.notes}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold mb-3 text-slate-900 dark:text-slate-100">
              Thông tin hệ thống
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {task.createdAt && (
                <div>
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    Ngày tạo:
                  </span>
                  <p className="text-slate-900 dark:text-slate-100 font-semibold">
                    {formatDate(task.createdAt)}
                  </p>
                </div>
              )}
              {task.updatedAt && (
                <div>
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    Cập nhật lần cuối:
                  </span>
                  <p className="text-slate-900 dark:text-slate-100 font-semibold">
                    {formatDate(task.updatedAt)}
                  </p>
                </div>
              )}
              {task.createdBy && (
                <div>
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    Người tạo:
                  </span>
                  <p className="text-slate-900 dark:text-slate-100 font-semibold">
                    ID: {task.createdBy}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsModal;
