import React, { createContext, useContext } from "react";
import {
  useNotifications,
  NotificationContainer,
  type NotificationContextType,
} from "@/components/common/NotificationSystem";

const ToastContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const notificationSystem = useNotifications();

  return (
    <ToastContext.Provider value={notificationSystem}>
      {children}
      <NotificationContainer
        notifications={notificationSystem.notifications}
        onRemove={notificationSystem.removeNotification}
      />
    </ToastContext.Provider>
  );
};
