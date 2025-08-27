import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface CertificateStatusBadgeProps {
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
    darkClassName: string;
  }
> = {
  draft: {
    label: "Bản nháp",
    className:
      "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200",
    icon: FileText,
    darkClassName:
      "dark:bg-gray-900/30 dark:text-gray-200 dark:border-gray-600",
  },
  pending: {
    label: "Chờ duyệt",
    className:
      "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200",
    icon: Clock,
    darkClassName:
      "dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-600",
  },
  issued: {
    label: "Đã cấp",
    className:
      "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
    icon: CheckCircle,
    darkClassName:
      "dark:bg-green-900/30 dark:text-green-200 dark:border-green-600",
  },
  rejected: {
    label: "Từ chối",
    className: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
    icon: XCircle,
    darkClassName: "dark:bg-red-900/30 dark:text-red-200 dark:border-red-600",
  },
  revoked: {
    label: "Đã thu hồi",
    className: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
    icon: XCircle,
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

const CertificateStatusBadge: React.FC<CertificateStatusBadgeProps> = ({
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

export default CertificateStatusBadge;
export { statusConfig };