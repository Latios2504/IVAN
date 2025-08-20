// Volunteer Schedule Types - Matching backend VolunteerScheduleDTOs

export interface VolunteerScheduleRequestDto {
  volunteerId: number;
  eventId?: number;
  title: string;
  description?: string;
  startDateTime: string; // ISO string format
  endDateTime: string; // ISO string format
  location?: string;
  scheduleType?: string; // "Event", "Training", "Meeting", "Task"
  priority?: string; // "High", "Medium", "Low"
  status?: string; // "Scheduled", "InProgress", "Completed", "Cancelled"
  isAllDay?: boolean;
  reminderMinutes?: number;
  notes?: string;
}

export interface VolunteerScheduleDto {
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
  startDateTime: string; // ISO string format
  endDateTime: string; // ISO string format
  location?: string;
  scheduleType?: string;
  priority?: string;
  status?: string;
  isAllDay?: boolean;
  reminderMinutes?: number;
  notes?: string;
  createdByName?: string;
  createdAt?: string; // ISO string format
  updatedAt?: string; // ISO string format
}

export interface VolunteerScheduleFilterDto {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
  volunteerId?: number;
  eventId?: number;
  startDateFrom?: string; // ISO string format
  startDateTo?: string; // ISO string format
  endDateFrom?: string; // ISO string format
  endDateTo?: string; // ISO string format
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

export interface VolunteerScheduleConflictCheckDto {
  volunteerId: number;
  startDateTime: string; // ISO string format
  endDateTime: string; // ISO string format
  excludeScheduleId?: number;
}

export interface VolunteerAvailabilityDto {
  volunteerId: number;
  volunteerName: string;
  date: string; // ISO string format
  availableSlots: TimeSlotDto[];
  existingSchedules: VolunteerScheduleDto[];
}

export interface TimeSlotDto {
  startTime: string; // ISO string format
  endTime: string; // ISO string format
  isAvailable: boolean;
  conflictReason?: string;
}

export interface BulkScheduleAssignmentDto {
  eventId: number;
  volunteerIds: number[];
  title: string;
  description?: string;
  startDateTime: string; // ISO string format
  endDateTime: string; // ISO string format
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
  createdSchedules: VolunteerScheduleDto[];
  conflicts: ScheduleConflictDto[];
  errors: string[];
}

export interface ScheduleConflictDto {
  volunteerId: number;
  volunteerName: string;
  conflictStart: string; // ISO string format
  conflictEnd: string; // ISO string format
  conflictingScheduleTitle: string;
  conflictReason: string;
}

// Default filter values
export const DEFAULT_SCHEDULE_FILTER: VolunteerScheduleFilterDto = {
  page: 1,
  size: 20,
  sortBy: "startDateTime",
  sortDirection: "asc",
};

// Schedule status options
export const SCHEDULE_STATUS_OPTIONS = [
  { value: "Scheduled", label: "Scheduled" },
  { value: "InProgress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
] as const;

// Schedule type options
export const SCHEDULE_TYPE_OPTIONS = [
  { value: "Event", label: "Event" },
  { value: "Training", label: "Training" },
  { value: "Meeting", label: "Meeting" },
  { value: "Task", label: "Task" },
] as const;

// Priority options
export const PRIORITY_OPTIONS = [
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
] as const;

// Sort options
export const SCHEDULE_SORT_OPTIONS = [
  { value: "startDateTime", label: "Start Date" },
  { value: "endDateTime", label: "End Date" },
  { value: "title", label: "Title" },
  { value: "volunteerName", label: "Volunteer Name" },
  { value: "status", label: "Status" },
  { value: "priority", label: "Priority" },
  { value: "createdAt", label: "Created Date" },
] as const;