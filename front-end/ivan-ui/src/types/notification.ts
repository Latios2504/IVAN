export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  actionUrl?: string;
  metadata?: NotificationMetadata;
  createdAt: string;
  readAt?: string;
}

export interface NotificationMetadata {
  eventId?: string;
  organizationId?: string;
  partnerId?: string;
  coordinatorId?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface NotificationSettings {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  preferences: NotificationPreferences;
  updatedAt: string;
}

export interface NotificationPreferences {
  eventReminders: boolean;
  eventUpdates: boolean;
  newOpportunities: boolean;
  certificateUpdates: boolean;
  systemAnnouncements: boolean;
  partnershipUpdates: boolean;
  coordinatorAssignments: boolean;
}

export enum NotificationType {
  EVENT_REMINDER = "event_reminder",
  EVENT_UPDATE = "event_update",
  EVENT_CANCELLED = "event_cancelled",
  REGISTRATION_APPROVED = "registration_approved",
  REGISTRATION_REJECTED = "registration_rejected",
  CERTIFICATE_ISSUED = "certificate_issued",
  NEW_OPPORTUNITY = "new_opportunity",
  SYSTEM_ANNOUNCEMENT = "system_announcement",
  PARTNER_UPDATE = "partner_update",
  COORDINATOR_ASSIGNMENT = "coordinator_assignment",
  TASK_ASSIGNMENT = "task_assignment",
  DEADLINE_REMINDER = "deadline_reminder",
}

export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}
