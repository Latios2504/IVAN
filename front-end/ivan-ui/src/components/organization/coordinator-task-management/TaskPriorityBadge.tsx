import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowDown, 
  Minus, 
  ArrowUp, 
  AlertTriangle,
  Zap
} from "lucide-react";
import { TASK_PRIORITY } from "@/types/coordinatorTask";

interface TaskPriorityBadgeProps {
  priority: string;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

const priorityConfig: Record<string, {
  label: string;
  className: string;
  icon: React.ComponentType<any>;
  darkClassName: string;
}> = {
  [TASK_PRIORITY.LOW]: {
    label: "Thấp",
    className: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
    icon: ArrowDown,
    darkClassName: "dark:bg-green-900/30 dark:text-green-200 dark:border-green-600",
  },
  [TASK_PRIORITY.MEDIUM]: {
    label: "Trung bình",
    className: "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200",
    icon: Minus,
    darkClassName: "dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-600",
  },
  [TASK_PRIORITY.HIGH]: {
    label: "Cao",
    className: "bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200",
    icon: ArrowUp,
    darkClassName: "dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-600",
  },
  [TASK_PRIORITY.URGENT]: {
    label: "Khẩn cấp",
    className: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
    icon: Zap,
    darkClassName: "dark:bg-red-900/30 dark:text-red-200 dark:border-red-600",
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

const TaskPriorityBadge: React.FC<TaskPriorityBadgeProps> = ({
  priority,
  className = "",
  showIcon = true,
  size = "md",
}) => {
  const config = priorityConfig[priority] || {
    label: priority,
    className: "bg-gray-100 text-gray-800 border-gray-300",
    icon: AlertTriangle,
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

export default TaskPriorityBadge;
export { priorityConfig };