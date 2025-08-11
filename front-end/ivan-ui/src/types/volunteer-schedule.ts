// Types for Volunteer Schedule Management
export interface VolunteerSchedule {
  scheduleId: number;
  volunteerId: number;
  volunteerName: string;
  volunteerEmail: string;
  volunteerPhone?: string;
  eventId?: number;
  eventName?: string;
  eventLocation?: string;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  scheduleType?: string;
  priority?: string;
  status?: string;
  isAllDay?: boolean;
  reminderMinutes?: number;
  notes?: string;
  createdByName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVolunteerScheduleData {
  volunteerId: number;
  eventId?: number;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  scheduleType?: string;
  priority?: string;
  status?: string;
  isAllDay?: boolean;
  reminderMinutes?: number;
  notes?: string;
}

export interface UpdateVolunteerScheduleData
  extends CreateVolunteerScheduleData {
  scheduleId: number;
}

export interface VolunteerScheduleFilterDto {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  volunteerId?: number;
  eventId?: number;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  scheduleType?: string;
  priority?: string;
  status?: string;
  search?: string;
}

export interface VolunteerScheduleStatsDto {
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
  topVolunteers: VolunteerScheduleSummaryDto[];
}

export interface VolunteerScheduleSummaryDto {
  volunteerId: number;
  volunteerName: string;
  scheduleCount: number;
  completedCount: number;
  completionRate: number;
  recentActivity?: string;
}

export interface VolunteerAvailabilityDto {
  volunteerId: number;
  volunteerName: string;
  date: string;
  availableSlots: TimeSlotDto[];
  existingSchedules: VolunteerSchedule[];
}

export interface TimeSlotDto {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  conflictReason?: string;
}

export interface ScheduleConflictDto {
  volunteerId: number;
  volunteerName: string;
  conflictStart: string;
  conflictEnd: string;
  conflictingScheduleTitle: string;
  conflictReason: string;
}

export interface BulkScheduleAssignmentDto {
  eventId: number;
  volunteerIds: number[];
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  scheduleType?: string;
  priority?: string;
  isAllDay?: boolean;
  reminderMinutes?: number;
  notes?: string;
  checkConflicts?: boolean;
  notifyVolunteers?: boolean;
}

export interface BulkScheduleResultDto {
  totalRequested: number;
  successCount: number;
  failureCount: number;
  createdSchedules: VolunteerSchedule[];
  conflicts: ScheduleConflictDto[];
  errors: string[];
}

export interface CheckAvailabilityRequest {
  volunteerIds: number[];
  startDateTime: string;
  endDateTime: string;
}

export interface VolunteerScheduleConflictCheckDto {
  volunteerId: number;
  startDateTime: string;
  endDateTime: string;
  excludeScheduleId?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: {
    scheduleId: number;
    volunteerId: number;
    volunteerName: string;
    eventId?: number;
    eventName?: string;
    status?: string;
    priority?: string;
    scheduleType?: string;
  };
}

// Enums for better type safety
export const ScheduleTypes = {
  EVENT: "Event",
  TRAINING: "Training",
  MEETING: "Meeting",
  TASK: "Task",
  OTHER: "Other",
} as const;

export const SchedulePriorities = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
} as const;

export const ScheduleStatuses = {
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "InProgress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export type ScheduleType = (typeof ScheduleTypes)[keyof typeof ScheduleTypes];
export type SchedulePriority =
  (typeof SchedulePriorities)[keyof typeof SchedulePriorities];
export type ScheduleStatus =
  (typeof ScheduleStatuses)[keyof typeof ScheduleStatuses];
