import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export function LoadingSpinner({
  size = "md",
  text = "Đang tải...",
  showRetry = false,
  onRetry,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const containerClasses = {
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-8 ${containerClasses[size]}`}
    >
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-primary`}
      />
      {text && <p className="text-gray-600 text-center">{text}</p>}
      {showRetry && onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-2">
          <RefreshCw className="h-4 w-4 mr-2" />
          Thử lại
        </Button>
      )}
    </div>
  );
}
