import { useState, useCallback } from "react";
import { Check, X, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const NotificationItem = ({
  notification,
  onRemove,
}: NotificationItemProps) => {
  const { id, type, message } = notification;

  const icons = {
    success: Check,
    error: X,
    warning: AlertCircle,
    info: Info,
  };

  const Icon = icons[type];

  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div
      className={cn(
        "flex items-center p-4 border rounded-lg shadow-lg transition-all duration-300",
        styles[type]
      )}
    >
      <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={() => onRemove(id)}
        className="ml-3 p-1 rounded-full hover:bg-black/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export interface NotificationContextType {
  notifications: Notification[];
  showNotification: (
    message: string,
    type?: NotificationType,
    duration?: number
  ) => void;
  removeNotification: (id: string) => void;
}

export const useNotifications = (): NotificationContextType => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    (
      message: string,
      type: NotificationType = "success",
      duration: number = 5000
    ) => {
      const id = Date.now().toString();
      const notification: Notification = { id, message, type, duration };

      setNotifications((prev) => [...prev, notification]);

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    showNotification,
    removeNotification,
  };
};

export interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export const NotificationContainer = ({
  notifications,
  onRemove,
}: NotificationContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-96">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};
