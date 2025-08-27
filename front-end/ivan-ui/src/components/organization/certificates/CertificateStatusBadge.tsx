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
  }
> = {
  draft: {
    label: "Bản nháp",
    className: "status-inactive",
    icon: FileText,
  },
  pending: {
    label: "Chờ duyệt",
    className: "status-pending",
    icon: Clock,
  },
  issued: {
    label: "Đã cấp",
    className: "status-active",
    icon: CheckCircle,
  },
  rejected: {
    label: "Từ chối",
    className:
      "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
    icon: XCircle,
  },
  revoked: {
    label: "Đã thu hồi",
    className:
      "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
    icon: XCircle,
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

export default CertificateStatusBadge;
export { statusConfig };
