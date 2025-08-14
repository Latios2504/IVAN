export enum NotificationType {
  NEW_OPPORTUNITY = "new_opportunity",
  REGISTRATION_APPROVED = "registration_approved",
  REGISTRATION_REJECTED = "registration_rejected",
  EVENT_REMINDER = "event_reminder",
  CERTIFICATE_ISSUED = "certificate_issued",
  SCHEDULE_CHANGE = "schedule_change",
  SYSTEM_ANNOUNCEMENT = "system_announcement",
  PARTNERSHIP_REQUEST = "partnership_request",
  COORDINATOR_ASSIGNMENT = "coordinator_assignment",
}

export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error?: string;
}
