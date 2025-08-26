import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Play, 
  CheckCircle, 
  XCircle, 
  Pause,
  AlertCircle,
  UserCheck
} from "lucide-react";
import { TASK_STATUS } from "@/types/coordinatorTask";

interface TaskStatusBadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

const statusConfig: Record<string, {
  label: string;
  className: string;
  icon: React.ComponentType<any>;
  darkClassName: string;
}> = {
  [TASK_STATUS.ASSIGNED]: {
    label: "Đã giao",
    className: "bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200",
    icon: UserCheck,
    darkClassName: "dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-600",
  },
  [TASK_STATUS.IN_PROGRESS]: {
    label: "Đang thực hiện",
    className: "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200",
    icon: Play,
    darkClassName: "dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-600",
  },
  [TASK_STATUS.COMPLETED]: {
    label: "Hoàn thành",
    className: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
    icon: CheckCircle,
    darkClassName: "dark:bg-green-900/30 dark:text-green-200 dark:border-green-600",
  },
  [TASK_STATUS.CANCELLED]: {
    label: "Đã hủy",
    className: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
    icon: XCircle,
    darkClassName: "dark:bg-red-900/30 dark:text-red-200 dark:border-red-600",
  },
  [TASK_STATUS.ON_HOLD]: {
    label: "Tạm dừng",
    className: "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200",
    icon: Pause,
    darkClassName: "dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-600",
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
    className: "bg-gray-100 text-gray-800 border-gray-300",
    icon: AlertCircle,
    darkClassName: "dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600",
  };

  const IconComponent = config.icon;
  const sizeClass = sizeClasses[size];
  const iconSize = iconSizes[size];

  return (
    <Badge
      className={`
        ${config.className} 
        ${config.darkClassName} 
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