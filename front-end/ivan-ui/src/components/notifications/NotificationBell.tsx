import { useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NotificationType,
  NotificationPriority,
  type Notification,
} from "@/types/notification";

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "notif_001",
    userId: "user_001",
    title: "Sự kiện mới",
    message:
      "Có sự kiện mới phù hợp với kỹ năng của bạn: 'Dạy máy tính cho trẻ em'",
    type: NotificationType.NEW_OPPORTUNITY,
    priority: NotificationPriority.MEDIUM,
    isRead: false,
    actionUrl: "/events/evt_001",
    createdAt: "2024-06-06T08:30:00Z",
  },
  {
    id: "notif_002",
    userId: "user_001",
    title: "Đăng ký được duyệt",
    message: "Đăng ký tham gia sự kiện 'Khám sức khỏe miễn phí' đã được duyệt",
    type: NotificationType.REGISTRATION_APPROVED,
    priority: NotificationPriority.HIGH,
    isRead: false,
    actionUrl: "/events/evt_002",
    createdAt: "2024-06-06T07:15:00Z",
  },
  {
    id: "notif_003",
    userId: "user_001",
    title: "Chứng chỉ mới",
    message: "Bạn đã nhận được chứng chỉ 'Tình nguyện viên xuất sắc'",
    type: NotificationType.CERTIFICATE_ISSUED,
    priority: NotificationPriority.MEDIUM,
    isRead: true,
    actionUrl: "/certificates",
    createdAt: "2024-06-05T16:45:00Z",
  },
];

export function NotificationBell() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const removeNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} phút trước`;
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else {
      return `${diffDays} ngày trước`;
    }
  };
  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.URGENT:
        return "bg-red-500";
      case NotificationPriority.HIGH:
        return "bg-orange-500";
      case NotificationPriority.MEDIUM:
        return "bg-blue-500";
      case NotificationPriority.LOW:
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          Thông báo
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Không có thông báo nào
          </div>
        ) : (
          <>
            {notifications.slice(0, 5).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.actionUrl) {
                    window.location.href = notification.actionUrl;
                  }
                }}
              >
                <div className="flex w-full items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-2 h-2 rounded-full ${getPriorityColor(
                          notification.priority
                        )}`}
                      />
                      <h4 className="font-medium text-sm">
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-400">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </DropdownMenuItem>
            ))}

            {notifications.length > 5 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center">
                  <Button variant="ghost" className="w-full text-sm">
                    Xem tất cả thông báo
                  </Button>
                </DropdownMenuItem>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
