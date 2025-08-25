// Coordinator Task Types - Matching backend CoordinatorTaskController
import type { PagedResultDto } from "./common";

// Core DTOs - Now matches backend CoordinatorTaskDto exactly
export interface CoordinatorTaskDto {
  taskId: number; // Primary key
  eventId: number;
  coordinatorId: number;
  taskName: string;
  description?: string | null;
  dueDate?: string | null; // ISO date string
  priority?: string | null;
  status?: string | null;
  category?: string | null;
  estimatedHours?: number | null;
  actualHours?: number | null;
  completedAt?: string | null; // ISO date string
  notes?: string | null;
  createdBy?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Legacy alias for backward compatibility - now same as CoordinatorTaskDto
export interface CoordinatorTaskModel extends CoordinatorTaskDto {
  // All properties are now inherited from CoordinatorTaskDto
}

// Request DTOs (for create/update operations)
export interface CreateCoordinatorTaskDto {
  eventId: number;
  coordinatorId: number;
  taskName: string;
  description?: string | null;
  dueDate?: string | null; // ISO date string
  priority?: string | null;
  status?: string | null;
  category?: string | null;
  estimatedHours?: number | null;
  notes?: string | null;
}

export interface UpdateCoordinatorTaskDto {
  eventId: number;
  coordinatorId: number;
  taskName: string;
  description?: string | null;
  dueDate?: string | null; // ISO date string
  priority?: string | null;
  status?: string | null;
  category?: string | null;
  estimatedHours?: number | null;
  actualHours?: number | null;
  completedAt?: string | null; // ISO date string
  notes?: string | null;
}

// Filter DTO for searching/filtering tasks
export interface CoordinatorTaskFilterDto {
  eventId?: number;
  coordinatorId?: number;
  status?: string;
  priority?: string;
  category?: string;
  dueDateFrom?: string; // ISO date string
  dueDateTo?: string; // ISO date string
  searchTerm?: string; // Search in task name, description, notes
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

// Response DTOs
export interface CoordinatorTaskListResponseDto {
  tasks: CoordinatorTaskDto[];
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
}

// Stats DTO for dashboard/analytics
export interface CoordinatorTaskStatsDto {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  tasksByStatus: TaskStatusStatsDto[];
  tasksByPriority: TaskPriorityStatsDto[];
  tasksByCategory: TaskCategoryStatsDto[];
}

export interface TaskStatusStatsDto {
  status: string;
  count: number;
  percentage: number;
}

export interface TaskPriorityStatsDto {
  priority: string;
  count: number;
  percentage: number;
}

export interface TaskCategoryStatsDto {
  category: string;
  count: number;
  percentage: number;
}

// Constants for task statuses and priorities
export const TASK_STATUS = {
  NOT_STARTED: "Chưa bắt đầu",
  IN_PROGRESS: "Đang thực hiện",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  ON_HOLD: "Tạm dừng",
} as const;

export const TASK_PRIORITY = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
} as const;

export const TASK_CATEGORY = {
  SETUP: "Setup",
  COORDINATION: "Coordination",
  LOGISTICS: "Logistics",
  COMMUNICATION: "Communication",
  DOCUMENTATION: "Documentation",
  CLEANUP: "Cleanup",
  TRAINING: "Training",
  MONITORING: "Monitoring",
} as const;

// Type unions for strict typing
export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
export type TaskPriority = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY];
export type TaskCategory = (typeof TASK_CATEGORY)[keyof typeof TASK_CATEGORY];

// Default filter for coordinator tasks
export const DEFAULT_COORDINATOR_TASK_FILTER: CoordinatorTaskFilterDto = {
  page: 1,
  size: 20,
  sortBy: "dueDate",
  sortDirection: "asc",
};

// Helper type for task form validation
export interface CoordinatorTaskValidationResult {
  isValid: boolean;
  errors: string[];
}

// Options for task dropdowns
export interface TaskStatusOption {
  value: TaskStatus;
  label: string;
  color: string;
  icon?: string;
}

export interface TaskPriorityOption {
  value: TaskPriority;
  label: string;
  color: string;
  icon?: string;
}

export interface TaskCategoryOption {
  value: TaskCategory;
  label: string;
  color: string;
  icon?: string;
}

// Status options with colors and icons
export const TASK_STATUS_OPTIONS: TaskStatusOption[] = [
  {
    value: TASK_STATUS.NOT_STARTED,
    label: "Chưa bắt đầu",
    color: "gray",
    icon: "clock",
  },
  {
    value: TASK_STATUS.IN_PROGRESS,
    label: "Đang thực hiện",
    color: "blue",
    icon: "play",
  },
  {
    value: TASK_STATUS.COMPLETED,
    label: "Hoàn thành",
    color: "green",
    icon: "check",
  },
  {
    value: TASK_STATUS.CANCELLED,
    label: "Đã hủy",
    color: "red",
    icon: "x",
  },
  {
    value: TASK_STATUS.ON_HOLD,
    label: "Tạm dừng",
    color: "yellow",
    icon: "pause",
  },
];

// Priority options with colors and icons
export const TASK_PRIORITY_OPTIONS: TaskPriorityOption[] = [
  {
    value: TASK_PRIORITY.LOW,
    label: "Thấp",
    color: "green",
    icon: "arrow-down",
  },
  {
    value: TASK_PRIORITY.MEDIUM,
    label: "Trung bình",
    color: "yellow",
    icon: "minus",
  },
  {
    value: TASK_PRIORITY.HIGH,
    label: "Cao",
    color: "orange",
    icon: "arrow-up",
  },
  {
    value: TASK_PRIORITY.URGENT,
    label: "Khẩn cấp",
    color: "red",
    icon: "alert-triangle",
  },
];

// Category options with colors and icons
export const TASK_CATEGORY_OPTIONS: TaskCategoryOption[] = [
  {
    value: TASK_CATEGORY.SETUP,
    label: "Thiết lập",
    color: "blue",
    icon: "settings",
  },
  {
    value: TASK_CATEGORY.COORDINATION,
    label: "Điều phối",
    color: "purple",
    icon: "users",
  },
  {
    value: TASK_CATEGORY.LOGISTICS,
    label: "Hậu cần",
    color: "orange",
    icon: "truck",
  },
  {
    value: TASK_CATEGORY.COMMUNICATION,
    label: "Truyền thông",
    color: "green",
    icon: "message-circle",
  },
  {
    value: TASK_CATEGORY.DOCUMENTATION,
    label: "Tài liệu",
    color: "gray",
    icon: "file-text",
  },
  {
    value: TASK_CATEGORY.CLEANUP,
    label: "Dọn dẹp",
    color: "yellow",
    icon: "trash-2",
  },
  {
    value: TASK_CATEGORY.TRAINING,
    label: "Đào tạo",
    color: "indigo",
    icon: "book",
  },
  {
    value: TASK_CATEGORY.MONITORING,
    label: "Giám sát",
    color: "teal",
    icon: "eye",
  },
];
