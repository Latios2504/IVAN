// OnSite Task Types - Matching backend OnSiteTaskController

// Input DTO for creating new on-site tasks
export interface OnSiteTaskInputDto {
  eventId: number;
  categoryId: number;
  statusId: number;
  taskName: string;
  description?: string;
  startTime?: string; // ISO string format
  endTime?: string; // ISO string format
  location?: string;
  requiredVolunteers?: number;
  assignedVolunteers?: number;
  requiredSkills?: string;
  priority?: string;
  difficulty?: string;
  instructions?: string;
  materials?: string;
  safetyRequirements?: string;
  completionCriteria?: string;
  notes?: string;
}

// Update DTO for updating existing on-site tasks
export interface OnSiteTaskUpdateDto {
  eventId: number;
  categoryId: number;
  statusId: number;
  taskName: string;
  description?: string;
  startTime?: string; // ISO string format
  endTime?: string; // ISO string format
  actualHours?: number;
  location?: string;
  requiredVolunteers?: number;
  assignedVolunteers?: number;
  requiredSkills?: string;
  priority?: string;
  difficulty?: string;
  instructions?: string;
  materials?: string;
  safetyRequirements?: string;
  completionCriteria?: string;
  notes?: string;
}

// View model for displaying on-site task details
export interface OnSiteTaskDto {
  taskId: number;
  eventId: number;
  categoryId: number;
  statusId: number;
  taskName: string;
  description?: string;
  startTime?: string; // ISO string format
  endTime?: string; // ISO string format
  estimatedHours?: number;
  actualHours?: number;
  location?: string;
  requiredVolunteers?: number;
  assignedVolunteers?: number;
  requiredSkills?: string;
  priority?: string;
  difficulty?: string;
  instructions?: string;
  materials?: string;
  safetyRequirements?: string;
  completionCriteria?: string;
  completedAt?: string; // ISO string format
  completedBy?: number;
  verifiedBy?: number;
  notes?: string;
  createdBy?: number;
  createdAt?: string; // ISO string format
  updatedAt?: string; // ISO string format
}

// Filter DTO for searching/filtering on-site tasks
export interface OnSiteTaskFilterDto {
  pageNumber?: number;
  pageSize?: number;
  eventId?: number;
  categoryId?: number;
  statusId?: number;
  priority?: string;
  difficulty?: string;
  startDateFrom?: string; // ISO string format
  startDateTo?: string; // ISO string format
  endDateFrom?: string; // ISO string format
  endDateTo?: string; // ISO string format
  search?: string; // Search in task name, description, notes
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

// Stats DTO for dashboard/analytics
export interface OnSiteTaskStatsDto {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  tasksByStatus: TaskStatusStatsDto[];
  tasksByPriority: TaskPriorityStatsDto[];
  tasksByDifficulty: TaskDifficultyStatsDto[];
  tasksByCategory: TaskCategoryStatsDto[];
  averageCompletionTime: number;
  volunteerUtilization: number;
}

export interface TaskStatusStatsDto {
  statusId: number;
  statusName: string;
  count: number;
  percentage: number;
}

export interface TaskPriorityStatsDto {
  priority: string;
  count: number;
  percentage: number;
}

export interface TaskDifficultyStatsDto {
  difficulty: string;
  count: number;
  percentage: number;
}

export interface TaskCategoryStatsDto {
  categoryId: number;
  categoryName: string;
  count: number;
  percentage: number;
}

// Validation result interface
export interface OnSiteTaskValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Default filter values
export const DEFAULT_ONSITE_TASK_FILTER: OnSiteTaskFilterDto = {
  pageNumber: 1,
  pageSize: 10,
  sortBy: "startTime",
  sortDirection: "asc",
};

// Task priority options
export const TASK_PRIORITY_OPTIONS = [
  { value: "Low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "Medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "High", label: "High", color: "bg-red-100 text-red-800" },
  { value: "Critical", label: "Critical", color: "bg-red-200 text-red-900" },
] as const;

// Task difficulty options
export const TASK_DIFFICULTY_OPTIONS = [
  { value: "Easy", label: "Easy", color: "bg-green-100 text-green-800" },
  { value: "Medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "Hard", label: "Hard", color: "bg-orange-100 text-orange-800" },
  { value: "Expert", label: "Expert", color: "bg-red-100 text-red-800" },
] as const;

// Task status options (these would typically come from the backend)
export const TASK_STATUS_OPTIONS = [
  { value: 1, label: "Pending", color: "bg-gray-100 text-gray-800" },
  { value: 2, label: "In Progress", color: "bg-blue-100 text-blue-800" },
  { value: 3, label: "Completed", color: "bg-green-100 text-green-800" },
  { value: 4, label: "Cancelled", color: "bg-red-100 text-red-800" },
  { value: 5, label: "On Hold", color: "bg-yellow-100 text-yellow-800" },
] as const;

// Sort options for tasks
export const TASK_SORT_OPTIONS = [
  { value: "taskName", label: "Task Name" },
  { value: "startTime", label: "Start Time" },
  { value: "endTime", label: "End Time" },
  { value: "priority", label: "Priority" },
  { value: "difficulty", label: "Difficulty" },
  { value: "createdAt", label: "Created Date" },
  { value: "updatedAt", label: "Updated Date" },
] as const;

// Type definitions for constants
export type TaskPriority = typeof TASK_PRIORITY_OPTIONS[number]["value"];
export type TaskDifficulty = typeof TASK_DIFFICULTY_OPTIONS[number]["value"];
export type TaskStatus = typeof TASK_STATUS_OPTIONS[number]["value"];
export type TaskSortBy = typeof TASK_SORT_OPTIONS[number]["value"];