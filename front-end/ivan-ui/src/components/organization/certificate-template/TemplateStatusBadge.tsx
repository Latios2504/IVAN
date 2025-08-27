import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Settings, AlertCircle } from "lucide-react";

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
          bg-blue-100/80 text-blue-800 border-blue-200/50 hover:bg-blue-200/80
          dark:bg-blue-950/30 dark:text-blue-200 dark:border-blue-800/50
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
          status-active
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
        status-inactive
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
