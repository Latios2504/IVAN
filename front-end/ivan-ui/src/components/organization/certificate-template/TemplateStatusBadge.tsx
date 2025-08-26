import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Settings,
  AlertCircle,
} from "lucide-react";

interface TemplateStatusBadgeProps {
  isActive: boolean;
  isDefault?: boolean;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

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

const TemplateStatusBadge: React.FC<TemplateStatusBadgeProps> = ({
  isActive,
  isDefault = false,
  className = "",
  showIcon = true,
  size = "md",
}) => {
  const sizeClass = sizeClasses[size];
  const iconSize = iconSizes[size];

  if (isDefault) {
    return (
      <Badge
        className={`
          bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200
          dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-600
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
        {showIcon && <Settings className={iconSize} />}
        <span>Hệ thống</span>
      </Badge>
    );
  }

  if (isActive) {
    return (
      <Badge
        className={`
          bg-green-100 text-green-800 border-green-300 hover:bg-green-200
          dark:bg-green-900/30 dark:text-green-200 dark:border-green-600
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
        {showIcon && <CheckCircle className={iconSize} />}
        <span>Hoạt động</span>
      </Badge>
    );
  }

  return (
    <Badge
      className={`
        bg-red-100 text-red-800 border-red-300 hover:bg-red-200
        dark:bg-red-900/30 dark:text-red-200 dark:border-red-600
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
      {showIcon && <XCircle className={iconSize} />}
      <span>Tạm dừng</span>
    </Badge>
  );
};

export default TemplateStatusBadge;