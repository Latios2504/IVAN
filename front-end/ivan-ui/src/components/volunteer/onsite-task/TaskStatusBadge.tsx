import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  PlayCircle,
  AlertCircle,
  Clock,
  XCircle,
} from "lucide-react";
import type { TaskStatus } from "@/types/onSiteTask";

interface TaskStatusBadgeProps {
  statusId: number;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  statusId,
  size = "md",
  showIcon = true,
}) => {
  const getStatusConfig = (statusId: number) => {
    const statusMap: Record<
      number,
      {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
        icon: React.ReactNode;
        className: string;
      }
    > = {
      1: {
        label: "Chưa bắt đầu",
        variant: "outline",
        icon: <AlertCircle className="w-3 h-3" />,
        className: "bg-gray-100 text-gray-800 border-gray-300",
      },
      2: {
        label: "Đang thực hiện",
        variant: "default",
        icon: <PlayCircle className="w-3 h-3" />,
        className: "bg-blue-100 text-blue-800 border-blue-300",
      },
      3: {
        label: "Hoàn thành",
        variant: "secondary",
        icon: <CheckCircle className="w-3 h-3" />,
        className: "bg-green-100 text-green-800 border-green-300",
      },
      4: {
        label: "Tạm dừng",
        variant: "outline",
        icon: <Clock className="w-3 h-3" />,
        className: "bg-yellow-100 text-yellow-800 border-yellow-300",
      },
      5: {
        label: "Đã hủy",
        variant: "destructive",
        icon: <XCircle className="w-3 h-3" />,
        className: "bg-red-100 text-red-800 border-red-300",
      },
    };

    return (
      statusMap[statusId] || {
        label: "Không xác định",
        variant: "outline",
        icon: <AlertCircle className="w-3 h-3" />,
        className: "bg-gray-100 text-gray-800 border-gray-300",
      }
    );
  };

  const getSizeClasses = (size: string) => {
    const sizeMap = {
      sm: "text-xs px-2 py-1",
      md: "text-sm px-2.5 py-1.5",
      lg: "text-base px-3 py-2",
    };
    return sizeMap[size as keyof typeof sizeMap] || sizeMap.md;
  };

  const status = getStatusConfig(statusId);
  const sizeClasses = getSizeClasses(size);

  return (
    <Badge
      variant={status.variant}
      className={`flex items-center gap-1.5 ${status.className} ${sizeClasses}`}
    >
      {showIcon && status.icon}
      {status.label}
    </Badge>
  );
};

export default TaskStatusBadge;