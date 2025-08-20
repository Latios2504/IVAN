// Notification API Types - Matching backend NotificationController and DTOs
import type { PagedResultDto } from "./common";

// Core DTOs matching backend NotificationDTOs.cs
export interface NotificationDto {
  notificationId: number;
  userId: number;
  title: string;
  content: string;
  sendDate?: string; // ISO date string
  isRead?: boolean;
}

export interface SendNotificationDto {
  userId: number;
  title: string;
  content: string;
}

export interface NotificationPreferenceDto {
  receiveEmail: boolean;
  receiveWeb: boolean;
}

// Filter and query DTOs
export interface NotificationFilterDto {
  userId?: number;
  page?: number;
  pageSize?: number;
  isRead?: boolean;
  sortBy?: string;
  sortDescending?: boolean;
}

// Statistics and analytics
export interface NotificationStatsDto {
  totalNotifications: number;
  unreadNotifications: number;
  readNotifications: number;
  recentNotifications: number;
}

// Validation result
export interface NotificationValidationResult {
  isValid: boolean;
  errors: string[];
}

// Constants for notification management
export const NOTIFICATION_SORT_OPTIONS = {
  SEND_DATE: 'SendDate',
  TITLE: 'Title'
} as const;

export type NotificationSortBy = typeof NOTIFICATION_SORT_OPTIONS[keyof typeof NOTIFICATION_SORT_OPTIONS];

// Default filter values
export const DEFAULT_NOTIFICATION_FILTER: NotificationFilterDto = {
  page: 1,
  pageSize: 10,
  sortBy: NOTIFICATION_SORT_OPTIONS.SEND_DATE,
  sortDescending: true
};

// Notification sort options for UI
export const NOTIFICATION_SORT_UI_OPTIONS = [
  { value: NOTIFICATION_SORT_OPTIONS.SEND_DATE, label: 'Send Date' },
  { value: NOTIFICATION_SORT_OPTIONS.TITLE, label: 'Title' }
];

// Default notification preferences
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferenceDto = {
  receiveEmail: true,
  receiveWeb: true
};

// Notification content validation constants
export const NOTIFICATION_VALIDATION = {
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 200,
  CONTENT_MIN_LENGTH: 1,
  CONTENT_MAX_LENGTH: 5000
} as const;

// Helper types for API responses
export type NotificationListResponse = PagedResultDto<NotificationDto>;
export type NotificationResponse = NotificationDto;
export type NotificationPreferenceResponse = boolean;
export type SendNotificationResponse = boolean;