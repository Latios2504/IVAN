import type { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TooltipWrapperProps {
  children: ReactNode;
  content: string | ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  disabled?: boolean;
  delayDuration?: number;
  className?: string;
  contentClassName?: string;
}

/**
 * Enhanced Tooltip wrapper component for easy usage throughout the application
 *
 * @example
 * <TooltipWrapper content="This is a helpful tooltip">
 *   <Button>Hover me</Button>
 * </TooltipWrapper>
 */
export const TooltipWrapper = ({
  children,
  content,
  side = "top",
  align = "center",
  disabled = false,
  delayDuration = 300,
  className,
  contentClassName,
}: TooltipWrapperProps) => {
  // Don't render tooltip if disabled or no content
  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild className={cn("cursor-help", className)}>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={cn("max-w-xs text-sm font-medium", contentClassName)}
        >
          {typeof content === "string" ? <p>{content}</p> : content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface HelpTooltipProps {
  content: string | ReactNode;
  iconClassName?: string;
  side?: "top" | "right" | "bottom" | "left";
}

/**
 * Help icon with tooltip - useful for form fields and complex UI elements
 *
 * @example
 * <HelpTooltip content="This field is required for account verification" />
 */
export const HelpTooltip = ({
  content,
  iconClassName = "w-4 h-4 text-gray-400 hover:text-gray-600",
  side = "top",
}: HelpTooltipProps) => {
  return (
    <TooltipWrapper content={content} side={side}>
      <svg
        className={cn("cursor-help", iconClassName)}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </TooltipWrapper>
  );
};

interface StatusTooltipProps {
  status: "success" | "warning" | "error" | "info";
  content: string | ReactNode;
  children: ReactNode;
}

/**
 * Status-based tooltip with different styling based on status type
 *
 * @example
 * <StatusTooltip status="warning" content="This action cannot be undone">
 *   <Button variant="destructive">Delete</Button>
 * </StatusTooltip>
 */
export const StatusTooltip = ({
  status,
  content,
  children,
}: StatusTooltipProps) => {
  const statusStyles = {
    success: "bg-green-900 text-green-100 border-green-700",
    warning: "bg-yellow-900 text-yellow-100 border-yellow-700",
    error: "bg-red-900 text-red-100 border-red-700",
    info: "bg-blue-900 text-blue-100 border-blue-700",
  };

  return (
    <TooltipWrapper
      content={content}
      contentClassName={cn("border", statusStyles[status])}
    >
      {children}
    </TooltipWrapper>
  );
};

interface KeyboardShortcutTooltipProps {
  shortcut: string;
  description: string;
  children: ReactNode;
}

/**
 * Tooltip showing keyboard shortcuts
 *
 * @example
 * <KeyboardShortcutTooltip shortcut="Ctrl+S" description="Save changes">
 *   <Button>Save</Button>
 * </KeyboardShortcutTooltip>
 */
export const KeyboardShortcutTooltip = ({
  shortcut,
  description,
  children,
}: KeyboardShortcutTooltipProps) => {
  const content = (
    <div className="flex flex-col space-y-1">
      <span>{description}</span>
      <div className="flex items-center space-x-1">
        <span className="text-xs text-gray-300">Phím tắt:</span>
        <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 rounded border border-gray-600">
          {shortcut}
        </kbd>
      </div>
    </div>
  );

  return <TooltipWrapper content={content}>{children}</TooltipWrapper>;
};

export default TooltipWrapper;
