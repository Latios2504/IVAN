import React from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Eye,
  PlayCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TaskStatusBadge from "./TaskStatusBadge";
import type { OnSiteTaskDto, MyTaskAssignmentDto } from "@/types/onSiteTask";

interface TaskCardProps {
  task: MyTaskAssignmentDto;
  onViewDetails: (task: MyTaskAssignmentDto) => void;
  onStartTask?: (taskId: number) => void;
  onCompleteTask?: (taskId: number, actualHours?: number, notes?: string) => void;
  showActions?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onViewDetails,
  onStartTask,
  onCompleteTask,
  showActions = true,
}) => {
  const canStartTask = (task: MyTaskAssignmentDto) => {
    return task.statusId === 1; // Pending
  };

  const canCompleteTask = (task: MyTaskAssignmentDto) => {
    return task.statusId === 2; // In Progress
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
    if (!dateTime) return "Chưa xác định";
    return new Date(dateTime).toLocaleString("vi-VN");
  };

  const formatTime = (dateTime?: string) => {
    if (!dateTime) return "--:--";
    return new Date(dateTime).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOverdue = (endTime?: string) => {
    if (!endTime) return false;
    return new Date(endTime) < new Date() && task.statusId !== 3; // Not completed
  };

  return (
    <Card className="bg-gradient-to-br from-orange-50/80 via-amber-50/80 to-yellow-50/80 dark:from-orange-950/40 dark:via-amber-950/40 dark:to-yellow-950/40 border-orange-200/50 dark:border-orange-800/50 hover:shadow-lg hover:shadow-orange-200/50 dark:hover:shadow-orange-900/50 transition-all duration-300">
      <CardHeader className="pb-3 bg-gradient-to-r from-orange-100/50 to-amber-100/50 dark:from-orange-900/30 dark:to-amber-900/30">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg text-orange-700 dark:text-orange-300 line-clamp-1">
              {task.taskName}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-orange-600 dark:text-orange-400 mt-1">
              {task.taskDescription || "Không có mô tả"}
            </CardDescription>
          </div>
          {isOverdue(task.endTime) && (
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 ml-2" />
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <TaskStatusBadge statusId={task.statusId} size="sm" />
          {task.priorityName && getPriorityBadge(task.priorityName)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 bg-gradient-to-r from-orange-50/30 to-amber-50/30 dark:from-orange-950/20 dark:to-amber-950/20">
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4 text-orange-500" />
            <span className="font-medium">Thời gian:</span>
            <span className="ml-1">
              {formatTime(task.startTime)} - {formatTime(task.endTime)}
            </span>
          </div>
          
          {task.locationName && (
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4 text-orange-500" />
              <span className="font-medium">Địa điểm:</span>
              <span className="ml-1 line-clamp-1">{task.locationName}</span>
            </div>
          )}
          
          {task.eventName && (
            <div className="flex items-center text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4 text-orange-500" />
              <span className="font-medium">Sự kiện:</span>
              <span className="ml-1 line-clamp-1">{task.eventName}</span>
            </div>
          )}
          
          {task.estimatedHours && (
            <div className="flex items-center text-muted-foreground">
              <Clock className="mr-2 h-4 w-4 text-orange-500" />
              <span className="font-medium">Thời gian dự kiến:</span>
              <span className="ml-1">{task.estimatedHours} giờ</span>
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex justify-between items-center pt-3 border-t border-orange-200/50 dark:border-orange-800/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(task)}
              className="border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-950"
            >
              <Eye className="mr-1 h-3 w-3" />
              Chi tiết
            </Button>
            
            <div className="flex gap-2">
              {canStartTask(task) && onStartTask && (
                <Button
                  size="sm"
                  onClick={() => onStartTask(task.taskId)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <PlayCircle className="mr-1 h-3 w-3" />
                  Bắt đầu
                </Button>
              )}
              
              {canCompleteTask(task) && onCompleteTask && (
                <Button
                  size="sm"
                  onClick={() => onCompleteTask(task.taskId)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Hoàn thành
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;