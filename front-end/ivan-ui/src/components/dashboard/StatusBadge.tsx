import { Badge } from "@/components/ui/badge";

type StatusVariant =
  | "active"
  | "inactive"
  | "pending"
  | "success"
  | "warning"
  | "error";

interface StatusBadgeProps {
  variant: StatusVariant;
  children: React.ReactNode;
  className?: string;
}

const statusStyles: Record<StatusVariant, string> = {
  active: "bg-green-100 text-green-800",
  success: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
};

export function StatusBadge({
  variant,
  children,
  className = "",
}: StatusBadgeProps) {
  return (
    <Badge className={`${statusStyles[variant]} ${className}`}>
      {children}
    </Badge>
  );
}
