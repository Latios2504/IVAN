export interface Coordinator {
  id: string;
  userId: string;
  assignedOrganizations: string[];
  permissions: CoordinatorPermission[];
  workload: CoordinatorWorkload;
  performance: CoordinatorPerformance;
  schedule: CoordinatorSchedule[];
  createdAt: string;
  updatedAt: string;
}

export interface CoordinatorPermission {
  organizationId: string;
  permissions: Permission[];
  grantedAt: string;
  grantedBy: string;
}

export interface CoordinatorWorkload {
  activeEvents: number;
  managedVolunteers: number;
  pendingTasks: number;
  completedTasksThisMonth: number;
}

export interface CoordinatorPerformance {
  rating: number;
  eventsManaged: number;
  volunteersCoordinated: number;
  taskCompletionRate: number;
  feedback: PerformanceFeedback[];
}

export interface PerformanceFeedback {
  id: string;
  from: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CoordinatorSchedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  organizationId: string;
  eventId?: string;
  task: string;
  status: ScheduleStatus;
}

export interface CoordinatorTask {
  id: string;
  coordinatorId: string;
  organizationId: string;
  eventId?: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assignedAt: string;
  completedAt?: string;
}

export enum Permission {
  MANAGE_EVENTS = "manage_events",
  MANAGE_VOLUNTEERS = "manage_volunteers",
  VIEW_REPORTS = "view_reports",
  MANAGE_CERTIFICATES = "manage_certificates",
  COORDINATE_RESOURCES = "coordinate_resources",
}

export enum ScheduleStatus {
  SCHEDULED = "scheduled",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  OVERDUE = "overdue",
  CANCELLED = "cancelled",
}
