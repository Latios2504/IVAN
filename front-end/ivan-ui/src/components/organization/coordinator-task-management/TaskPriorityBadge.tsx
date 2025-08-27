import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Minus, ArrowUp, AlertTriangle, Zap } from "lucide-react";
import { TASK_PRIORITY } from "@/types/coordinatorTask";

interface TaskPriorityBadgeProps {
  priority: string;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

const priorityConfig: Record<
  string,
  {
    label: string;
    className: string;
    icon: React.ComponentType<any>;
  }
> = {
  [TASK_PRIORITY.LOW]: {
    label: "Thấp",
    className:
      "bg-green-100/80 text-green-800 border-green-200/50 hover:bg-green-200/80 dark:bg-green-950/30 dark:text-green-200 dark:border-green-800/50",
    icon: ArrowDown,
  },
  [TASK_PRIORITY.MEDIUM]: {
    label: "Trung bình",
    className:
      "bg-yellow-100/80 text-yellow-800 border-yellow-200/50 hover:bg-yellow-200/80 dark:bg-yellow-950/30 dark:text-yellow-200 dark:border-yellow-800/50",
    icon: Minus,
  },
  [TASK_PRIORITY.HIGH]: {
    label: "Cao",
    className:
      "bg-orange-100/80 text-orange-800 border-orange-200/50 hover:bg-orange-200/80 dark:bg-orange-950/30 dark:text-orange-200 dark:border-orange-800/50",
    icon: ArrowUp,
  },
  [TASK_PRIORITY.URGENT]: {
    label: "Khẩn cấp",
    className:
      "bg-red-100/80 text-red-800 border-red-200/50 hover:bg-red-200/80 dark:bg-red-950/30 dark:text-red-200 dark:border-red-800/50",
    icon: Zap,
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
    className: "bg-muted text-muted-foreground border-border",
    icon: AlertTriangle,
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

export default TaskPriorityBadge;
export { priorityConfig };
