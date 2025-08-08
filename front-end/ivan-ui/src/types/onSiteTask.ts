export interface OnSiteTask {
  taskId: number;
  eventId: number;
  categoryId: number;
  statusId: number;
  taskName: string;
  description?: string;
  startTime?: string;
  endTime?: string;
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
  completedAt?: string;
  completedBy?: number;
  verifiedBy?: number;
  notes?: string;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OnSiteTaskInput {
  eventId: number;
  categoryId: number;
  statusId: number;
  taskName: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  requiredSkills?: string;
  priority?: string;
  difficulty?: string;
  instructions?: string;
  materials?: string;
  safetyRequirements?: string;
  completionCriteria?: string;
  notes?: string;
}

export interface OnSiteTaskUpdate {
  eventId?: number;
  categoryId?: number;
  statusId?: number;
  taskName?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  requiredSkills?: string;
  priority?: string;
  difficulty?: string;
  instructions?: string;
  materials?: string;
  safetyRequirements?: string;
  completionCriteria?: string;
  notes?: string;
}

export interface OnSiteTaskFilter {
  pageNumber: number;
  pageSize: number;
  eventId?: number;
  statusId?: number;
  priority?: string;
  difficulty?: string;
}

export interface OnSiteTaskViewModel extends OnSiteTask {
  // Additional view-specific properties can be added here
  eventName?: string;
  categoryName?: string;
  statusName?: string;
}

export interface PagedOnSiteTaskResult {
  items: OnSiteTaskViewModel[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface TaskAssignment {
  assignmentId: number;
  taskId: number;
  volunteerId: number;
  assignedDate: string;
  assignedBy?: number;
  status?: string;
  startedAt?: string;
  completedAt?: string;
  hoursWorked?: number;
  performance?: string;
  notes?: string;
}
