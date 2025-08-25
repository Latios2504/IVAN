// Coordinator Schedule Types - Matching backend CoordinatorScheduleController
import type { PagedResultDto } from "./common";

// Core DTOs
export interface CoordinatorScheduleDto {
  scheduleId: number;
  coordinatorId: number;
  coordinatorName: string;
  coordinatorEmail: string;
  coordinatorPosition?: string | null;
  eventId?: number | null;
  eventName?: string | null;
  eventLocation?: string | null;
  title: string;
  description?: string | null;
  startDateTime: string; // ISO date string
  endDateTime: string; // ISO date string
  location?: string | null;
  scheduleType?: string | null;
  priority?: string | null;
  status?: string | null;
  isAllDay?: boolean | null;
  reminderMinutes?: number | null;
  notes?: string | null;
  createdByName?: string | null;
  createdAt?: string | null; // ISO date string
  updatedAt?: string | null; // ISO date string
}

// Request DTOs (for create/update operations)
export interface CreateCoordinatorScheduleDto {
  coordinatorId: number;
  eventId?: number | null;
  title: string;
  description?: string | null;
  startDateTime: string; // ISO date string
  endDateTime: string; // ISO date string
  location?: string | null;
  scheduleType?: string | null;
  priority?: string | null;
  status?: string | null;
  isAllDay?: boolean;
  reminderMinutes?: number;
  notes?: string | null;
}

export interface UpdateCoordinatorScheduleDto {
  eventId?: number | null;
  coordinatorId?: number | null;
  title?: string | null;
  description?: string | null;
  startDateTime?: string | null; // ISO date string
  endDateTime?: string | null; // ISO date string
  location?: string | null;
  scheduleType?: string | null;
  priority?: string | null;
  status?: string | null;
  isAllDay?: boolean | null;
  reminderMinutes?: number | null;
  notes?: string | null;
}

// Filter DTO for searching/filtering schedules - Updated to match backend exactly
export interface CoordinatorScheduleFilterDto {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  coordinatorId?: number | null;
  eventId?: number | null;
  startDate?: string | null; // ISO date string
  endDate?: string | null; // ISO date string
  startDateFrom?: string | null; // ISO date string
  startDateTo?: string | null; // ISO date string
  endDateFrom?: string | null; // ISO date string
  endDateTo?: string | null; // ISO date string
  scheduleType?: string | null;
  priority?: string | null;
  status?: string | null;
  search?: string | null;
}

// Stats DTO for dashboard/analytics
export interface CoordinatorScheduleStatsDto {
  totalSchedules: number;
  scheduledCount: number;
  inProgressCount: number;
  completedCount: number;
  cancelledCount: number;
  todaySchedules: number;
  thisWeekSchedules: number;
  thisMonthSchedules: number;
  upcomingSchedules: number;
  overdueSchedules: number;
  schedulesByType: Record<string, number>;
  schedulesByPriority: Record<string, number>;
  topCoordinators: CoordinatorScheduleStatsItem[];
}

export interface CoordinatorScheduleStatsItem {
  coordinatorId: number;
  coordinatorName: string;
  scheduleCount: number;
  completedCount: number;
  completionRate: number;
}

// Summary DTO for Calendar Views
export interface CoordinatorScheduleSummaryDto {
  scheduleId: number;
  title: string;
  startDateTime: string; // ISO date string
  endDateTime: string; // ISO date string
  scheduleType?: string | null;
  priority?: string | null;
  status?: string | null;
  isAllDay?: boolean | null;
  coordinatorName?: string | null;
  eventName?: string | null;
}

// Constants for schedule types, priorities, and statuses
export const SCHEDULE_TYPE = {
  EVENT: "Event",
  MEETING: "Meeting",
  TRAINING: "Training",
  OTHER: "Other",
} as const;

export const SCHEDULE_PRIORITY = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
} as const;

export const SCHEDULE_STATUS = {
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export type ScheduleType = typeof SCHEDULE_TYPE[keyof typeof SCHEDULE_TYPE];
export type SchedulePriority = typeof SCHEDULE_PRIORITY[keyof typeof SCHEDULE_PRIORITY];
export type ScheduleStatus = typeof SCHEDULE_STATUS[keyof typeof SCHEDULE_STATUS];

// Default filter values
export const DEFAULT_COORDINATOR_SCHEDULE_FILTER: CoordinatorScheduleFilterDto = {
  pageNumber: 1,
  pageSize: 20,
  sortBy: "StartDateTime",
  sortDirection: "asc",
};

// Validation result interface
export interface CoordinatorScheduleValidationResult {
  isValid: boolean;
  errors: string[];
}

// Additional DTOs for new endpoints
export interface UpdateScheduleStatusDto {
  status: string;
}

export interface BulkUpdateStatusDto {
  scheduleIds: number[];
  status: string;
}

export interface BulkDeleteDto {
  scheduleIds: number[];
}

export interface CheckConflictsDto {
  coordinatorId: number;
  startDateTime: string; // ISO date string
  endDateTime: string; // ISO date string
  excludeScheduleId?: number | null;
}

// Calendar view request DTO
export interface CalendarViewRequestDto {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  coordinatorId?: number | null;
}

// Helper types for form handling
export interface CoordinatorScheduleFormData extends Omit<CreateCoordinatorScheduleDto, 'startDateTime' | 'endDateTime'> {
  startDateTime: Date;
  endDateTime: Date;
}

export interface UpdateCoordinatorScheduleFormData extends Omit<UpdateCoordinatorScheduleDto, 'startDateTime' | 'endDateTime'> {
  startDateTime?: Date | null;
  endDateTime?: Date | null;
}