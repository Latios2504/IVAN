import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  PlayCircle,
  CheckCircle,
  FileText,
  AlertTriangle,
  Shield,
  Wrench,
  Target,
  StickyNote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import TaskStatusBadge from "./TaskStatusBadge";
import type { OnSiteTaskDto } from "@/types/onSiteTask";

interface TaskDetailModalProps {
  task: OnSiteTaskDto | null;
  isOpen: boolean;
  onClose: () => void;
  onStartTask?: (taskId: number) => void;
  onCompleteTask?: (taskId: number, actualHours?: number, notes?: string) => void;
  showActions?: boolean;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onStartTask,
  onCompleteTask,
  showActions = true,
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionNotes, setCompletionNotes] = useState("");
  const [actualHours, setActualHours] = useState<string>("");

  if (!task) return null;

  const canStartTask = (task: OnSiteTaskDto) => {
    return task.statusId === 1; // Pending
  };

  const canCompleteTask = (task: OnSiteTaskDto) => {
    return task.statusId === 2; // In Progress
  };

  const handleStartTask = () => {
    if (onStartTask) {
      onStartTask(task.taskId);
      onClose();
    }
  };

  const handleCompleteTask = () => {
    if (onCompleteTask) {
      onCompleteTask(
        task.taskId,
        actualHours ? parseFloat(actualHours) : undefined,
        completionNotes || undefined
      );
      setIsCompleting(false);
      setCompletionNotes("");
      setActualHours("");
      onClose();
    }
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
      <Badge className={colorClass}>
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
      <Badge className={colorClass}>
        {difficulty === "Hard" ? "Khó" : difficulty === "Medium" ? "Trung bình" : "Dễ"}
      </Badge>
    );
  };

  const formatDateTime = (dateTime?: string) => {
    if (!dateTime) return "Chưa xác định";
    return new Date(dateTime).toLocaleString("vi-VN");
  };

  const isOverdue = (endTime?: string) => {
    if (!endTime) return false;
    return new Date(endTime) < new Date() && task.statusId !== 3;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl text-orange-700 dark:text-orange-300">
                {task.taskName}
              </DialogTitle>
              <DialogDescription className="text-orange-600 dark:text-orange-400 mt-2">
                Chi tiết nhiệm vụ tại chỗ
              </DialogDescription>
            </div>
            {isOverdue(task.endTime) && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-medium">Quá hạn</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <TaskStatusBadge statusId={task.statusId} />
            {task.priority && getPriorityBadge(task.priority)}
            {task.difficulty && getDifficultyBadge(task.difficulty)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Thời gian bắt đầu</p>
                  <p className="text-sm">{formatDateTime(task.startTime)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Thời gian kết thúc</p>
                  <p className="text-sm">{formatDateTime(task.endTime)}</p>
                </div>
              </div>
              
              {task.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Địa điểm</p>
                    <p className="text-sm">{task.location}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Tình nguyện viên</p>
                  <p className="text-sm">
                    {task.assignedVolunteers || 0} / {task.requiredVolunteers || 0} người
                  </p>
                </div>
              </div>
              
              {task.estimatedHours && (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Thời gian dự kiến</p>
                    <p className="text-sm">{task.estimatedHours} giờ</p>
                  </div>
                </div>
              )}
              
              {task.actualHours && (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Thời gian thực tế</p>
                    <p className="text-sm">{task.actualHours} giờ</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          {task.description && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold">Mô tả nhiệm vụ</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {task.description}
              </p>
            </div>
          )}

          {/* Instructions */}
          {task.instructions && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">Hướng dẫn thực hiện</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {task.instructions}
              </p>
            </div>
          )}

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {task.requiredSkills && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold">Kỹ năng yêu cầu</h3>
                </div>
                <p className="text-sm text-muted-foreground">{task.requiredSkills}</p>
              </div>
            )}
            
            {task.materials && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold">Vật liệu cần thiết</h3>
                </div>
                <p className="text-sm text-muted-foreground">{task.materials}</p>
              </div>
            )}
            
            {task.safetyRequirements && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-red-500" />
                  <h3 className="font-semibold">Yêu cầu an toàn</h3>
                </div>
                <p className="text-sm text-muted-foreground">{task.safetyRequirements}</p>
              </div>
            )}
            
            {task.completionCriteria && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold">Tiêu chí hoàn thành</h3>
                </div>
                <p className="text-sm text-muted-foreground">{task.completionCriteria}</p>
              </div>
            )}
          </div>

          {/* Notes */}
          {task.notes && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <StickyNote className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold">Ghi chú</h3>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {task.notes}
              </p>
            </div>
          )}

          {/* Completion Form */}
          {isCompleting && (
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-semibold mb-4 text-green-700 dark:text-green-300">
                Hoàn thành nhiệm vụ
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="actualHours">Thời gian thực tế (giờ)</Label>
                  <Input
                    id="actualHours"
                    type="number"
                    step="0.5"
                    min="0"
                    value={actualHours}
                    onChange={(e) => setActualHours(e.target.value)}
                    placeholder="Nhập số giờ thực tế"
                  />
                </div>
                <div>
                  <Label htmlFor="completionNotes">Ghi chú hoàn thành</Label>
                  <Textarea
                    id="completionNotes"
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    placeholder="Nhập ghi chú về quá trình thực hiện..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex justify-between items-center pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
              
              <div className="flex gap-2">
                {isCompleting ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsCompleting(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleCompleteTask}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Xác nhận hoàn thành
                    </Button>
                  </>
                ) : (
                  <>
                    {canStartTask(task) && onStartTask && (
                      <Button
                        onClick={handleStartTask}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Bắt đầu nhiệm vụ
                      </Button>
                    )}
                    
                    {canCompleteTask(task) && onCompleteTask && (
                      <Button
                        onClick={() => setIsCompleting(true)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Hoàn thành nhiệm vụ
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;