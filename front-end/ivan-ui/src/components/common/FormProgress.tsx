import { Progress } from "@/components/ui/progress";
import { TooltipWrapper } from "./TooltipWrapper";
import {
  CheckCircle2,
  AlertCircle,
  Upload,
  Clock,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStage {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

interface FormProgressProps {
  currentStage: string;
  progress: number;
  stages: ProgressStage[];
  className?: string;
  showPercentage?: boolean;
}

/**
 * Enhanced progress indicator for multi-stage operations
 * Perfect for forms, uploads, and other step-by-step processes
 */
export const FormProgress = ({
  currentStage,
  progress,
  stages,
  className,
  showPercentage = true,
}: FormProgressProps) => {
  const currentStageData = stages.find((stage) => stage.id === currentStage);

  const getStageIcon = (stage: ProgressStage) => {
    if (stage.icon) return stage.icon;

    // Default icons based on common stage patterns
    if (stage.id.includes("validate") || stage.id.includes("check")) {
      return <AlertCircle className="w-4 h-4" />;
    }
    if (stage.id.includes("upload") || stage.id.includes("file")) {
      return <Upload className="w-4 h-4" />;
    }
    if (stage.id.includes("submit") || stage.id.includes("save")) {
      return <Clock className="w-4 h-4" />;
    }
    if (stage.id.includes("complete") || stage.id.includes("done")) {
      return <CheckCircle2 className="w-4 h-4" />;
    }
    return <Loader2 className="w-4 h-4" />;
  };

  const getProgressColor = () => {
    if (currentStageData?.color) return currentStageData.color;
    if (progress === 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-gray-500";
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Current Stage Info */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <div className="animate-pulse">
            {currentStageData && getStageIcon(currentStageData)}
          </div>
          <span className="text-gray-600 font-medium">
            {currentStageData?.label || "Đang xử lý..."}
          </span>
        </div>
        {showPercentage && (
          <span className="font-semibold text-gray-900">{progress}%</span>
        )}
      </div>

      {/* Progress Bar */}
      <TooltipWrapper
        content={`${currentStageData?.label || "Đang xử lý"}: ${progress}%`}
      >
        <div className="relative">
          <Progress value={progress} className="w-full h-2" />
          {/* Custom progress bar styling */}
          <div
            className={cn(
              "absolute top-0 left-0 h-2 rounded-full transition-all duration-300",
              getProgressColor()
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </TooltipWrapper>

      {/* Stage Indicators (for complex multi-stage processes) */}
      {stages.length > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          {stages.map((stage, index) => {
            const isActive = stage.id === currentStage;
            const isCompleted =
              stages.findIndex((s) => s.id === currentStage) > index;

            return (
              <TooltipWrapper key={stage.id} content={stage.label}>
                <div
                  className={cn(
                    "flex items-center space-x-1 px-2 py-1 rounded-full transition-colors",
                    isActive && "bg-blue-100 text-blue-700",
                    isCompleted && "bg-green-100 text-green-700",
                    !isActive && !isCompleted && "bg-gray-100 text-gray-500"
                  )}
                >
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      isActive && "bg-blue-500 animate-pulse",
                      isCompleted && "bg-green-500",
                      !isActive && !isCompleted && "bg-gray-300"
                    )}
                  />
                  <span className="hidden sm:inline">{stage.label}</span>
                </div>
              </TooltipWrapper>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface SimpleProgressProps {
  value: number;
  message?: string;
  variant?: "default" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

/**
 * Simple progress indicator for basic loading states
 */
export const SimpleProgress = ({
  value,
  message,
  variant = "default",
  size = "md",
  showValue = true,
}: SimpleProgressProps) => {
  const variants = {
    default: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className="space-y-2">
      {(message || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {message && <span className="text-gray-600">{message}</span>}
          {showValue && (
            <span className="font-medium text-gray-900">{value}%</span>
          )}
        </div>
      )}
      <div className="relative">
        <Progress value={value} className={cn("w-full", sizes[size])} />
        <div
          className={cn(
            "absolute top-0 left-0 rounded-full transition-all duration-300",
            sizes[size],
            variants[variant]
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

// Common progress stage presets
export const commonProgressStages = {
  formSubmission: [
    { id: "validating", label: "Kiểm tra dữ liệu" },
    { id: "uploading", label: "Tải lên tệp" },
    { id: "submitting", label: "Gửi dữ liệu" },
    { id: "completed", label: "Hoàn thành" },
  ],
  fileUpload: [
    { id: "preparing", label: "Chuẩn bị tệp" },
    { id: "uploading", label: "Đang tải lên" },
    { id: "processing", label: "Xử lý tệp" },
    { id: "completed", label: "Hoàn thành" },
  ],
  dataImport: [
    { id: "reading", label: "Đọc dữ liệu" },
    { id: "validating", label: "Kiểm tra định dạng" },
    { id: "importing", label: "Nhập dữ liệu" },
    { id: "completed", label: "Hoàn thành" },
  ],
  profileUpdate: [
    { id: "validating", label: "Kiểm tra thông tin" },
    { id: "submitting", label: "Cập nhật hồ sơ" },
    { id: "completed", label: "Hoàn thành" },
  ],
  profileWithUpload: [
    { id: "validating", label: "Kiểm tra thông tin" },
    { id: "submitting", label: "Cập nhật hồ sơ" },
    { id: "uploading", label: "Tải lên ảnh đại diện" },
    { id: "completed", label: "Hoàn thành" },
  ],
  passwordChange: [
    { id: "validating", label: "Kiểm tra mật khẩu" },
    { id: "submitting", label: "Đổi mật khẩu" },
    { id: "completed", label: "Hoàn thành" },
  ],
};

export default FormProgress;
