// OnSite Task Types - Matching backend OnSiteTaskController

// Input DTO for creating new on-site tasks - matches backend OnSiteTaskInputModel
export interface OnSiteTaskInputDto {
  eventId: number;
  categoryId: number;
  statusId: number;
  taskName: string;
  description: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  estimatedHours: number;
  location: string;
  requiredVolunteers: number;
  assignedVolunteers?: number;
  requiredSkills?: string;
  priority?: string;
  difficulty?: string;
  instructions?: string;
  materials?: string;
  safetyRequirements?: string;
  completionCriteria?: string;
  notes?: string;
  // Note: Backend includes statusId, assignedVolunteers, priority, difficulty in input model
  // EstimatedHours, ActualHours, CompletedAt, CompletedBy, VerifiedBy are commented out in backend
}

// Update DTO for modifying existing on-site tasks - matches backend OnSiteTaskUpdateModel
export interface OnSiteTaskUpdateDto {
  eventId: number;
  categoryId: number;
  statusId: number;
  taskName: string;
  description?: string;
  startTime?: string; // ISO string
  endTime?: string; // ISO string
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
  notes?: string;
  // Note: Backend OnSiteTaskUpdateModel includes all fields as required/optional
  // EstimatedHours is commented out in backend model
}

// Full DTO for displaying on-site task details - matches backend OnSiteTaskViewModel
export interface OnSiteTaskDto {
  taskId: number;
  eventId: number;
  categoryId: number;
  statusId: number;
  taskName: string;
  description?: string;
  startTime?: string; // ISO string
  endTime?: string; // ISO string
  estimatedHours?: number; // Calculated by backend from start/end time
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
  completedAt?: string; // ISO string
  completedBy?: number;
  verifiedBy?: number;
  notes?: string;
  createdBy?: number;
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
  // Note: Backend OnSiteTaskViewModel includes priority and difficulty fields
}

// Filter DTO for searching and filtering on-site tasks - matches backend OnSiteTaskFilterModel
export interface OnSiteTaskFilterDto {
  pageNumber?: number;
  pageSize?: number;
  eventId?: number; // Maps to EventId
  categoryId?: number; // Maps to CategoryId
  statusId?: number; // Maps to StatusId
  startDateFrom?: string; // Maps to StartTimeFrom (ISO string)
  startDateTo?: string; // Maps to StartTimeTo (ISO string)
  endDateFrom?: string; // Maps to EndTimeFrom (ISO string)
  endDateTo?: string; // Maps to EndTimeTo (ISO string)
  search?: string; // Maps to SearchTerm
  // Note: Backend doesn't support priority, difficulty, sortBy, sortDirection in filter model
  // These would need to be added to backend OnSiteTaskFilterModel if required
}

// Stats DTO for dashboard/analytics - NOT IMPLEMENTED in backend yet
export interface OnSiteTaskStatsDto {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  tasksByStatus: TaskStatusStatsDto[];
  tasksByCategory: TaskCategoryStatsDto[];
  averageCompletionTime: number;
  volunteerUtilization: number;
  // Note: tasksByPriority and tasksByDifficulty removed as backend doesn't support these fields
}

export interface TaskStatusStatsDto {
  statusId: number;
  statusName: string;
  count: number;
  percentage: number;
}

// Note: TaskPriorityStatsDto and TaskDifficultyStatsDto removed
// Backend doesn't support priority and difficulty fields

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

// Default filter values - matches backend capabilities
export const DEFAULT_ONSITE_TASK_FILTER: OnSiteTaskFilterDto = {
  pageNumber: 1,
  pageSize: 10
  // Note: sortBy and sortDirection removed as backend doesn't support sorting in filter model
};

// Note: TASK_PRIORITY_OPTIONS and TASK_DIFFICULTY_OPTIONS removed
// Backend doesn't support priority and difficulty fields

// Task status options (these would typically come from the backend)
export const TASK_STATUS_OPTIONS = [
  { value: 1, label: "Pending", color: "bg-gray-100 text-gray-800" },
  { value: 2, label: "In Progress", color: "bg-blue-100 text-blue-800" },
  { value: 3, label: "Completed", color: "bg-green-100 text-green-800" },
  { value: 4, label: "Cancelled", color: "bg-red-100 text-red-800" },
  { value: 5, label: "On Hold", color: "bg-yellow-100 text-yellow-800" },
] as const;

// Note: TASK_SORT_OPTIONS removed
// Backend doesn't support sorting in OnSiteTaskFilterModel

// Type definitions for constants
export type TaskStatus = typeof TASK_STATUS_OPTIONS[number]["value"];
// Note: TaskPriority, TaskDifficulty, TaskSortBy types removed
// Backend doesn't support these fields