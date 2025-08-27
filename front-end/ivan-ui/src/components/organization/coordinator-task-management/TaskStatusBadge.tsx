import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  CheckCircle,
  XCircle,
  Pause,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import { TASK_STATUS } from "@/types/coordinatorTask";

interface TaskStatusBadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

const statusConfig: Record<
  string,
  {
    label: string;
    className: string;
    icon: React.ComponentType<any>;
  }
> = {
  [TASK_STATUS.ASSIGNED]: {
    label: "Đã giao",
    className:
      "bg-orange-100/80 text-orange-800 border-orange-200/50 hover:bg-orange-200/80 dark:bg-orange-950/30 dark:text-orange-200 dark:border-orange-800/50",
    icon: UserCheck,
  },
  [TASK_STATUS.IN_PROGRESS]: {
    label: "Đang thực hiện",
    className:
      "bg-blue-100/80 text-blue-800 border-blue-200/50 hover:bg-blue-200/80 dark:bg-blue-950/30 dark:text-blue-200 dark:border-blue-800/50",
    icon: Play,
  },
  [TASK_STATUS.COMPLETED]: {
    label: "Hoàn thành",
    className: "status-active",
    icon: CheckCircle,
  },
  [TASK_STATUS.CANCELLED]: {
    label: "Đã hủy",
    className:
      "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
    icon: XCircle,
  },
  [TASK_STATUS.ON_HOLD]: {
    label: "Tạm dừng",
    className: "status-pending",
    icon: Pause,
  },
};

const sizeClasses = {
  sm: "text-xs px-2 py-1",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-2",
};

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  status,
  className = "",
  showIcon = true,
  size = "md",
}) => {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-muted text-muted-foreground border-border",
    icon: AlertCircle,
  };

  const IconComponent = config.icon;
  const sizeClass = sizeClasses[size];
  const iconSize = iconSizes[size];

  return (
    <Badge
      className={`
        ${config.className} 
        ${sizeClass}
        font-semibold 
        border 
        transition-colors 
        duration-200 
        inline-flex 
        items-center 
        gap-1.5
        ${className}
      `}
    >
      {showIcon && <IconComponent className={iconSize} />}
      <span>{config.label}</span>
    </Badge>
  );
};

export default TaskStatusBadge;
export { statusConfig };
