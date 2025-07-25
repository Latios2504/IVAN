// Coordinator Profile Types for IVAN System
// Extended types specific to coordinator functionality

import type {
  CoordinatorProfile,
  UpdateCoordinatorProfileData,
} from "./profiles";

// Coordinator profile creation data
export interface CreateCoordinatorProfileData {
  userId: number;
  organizationId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: "Male" | "Female" | "Other" | "Prefer not to say";
  address?: string;
  wardCommune?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  employeeId?: string;
  position?: string;
  department?: string;
  responsibilities?: string;
  hireDate?: string;
  salary?: number;
  managerId?: number;
  avatar?: string;
  notes?: string;
  createdBy: number;
  requestedBy: number;
}

// Coordinator profile filters
export interface CoordinatorProfileFilters {
  organizationId?: number;
  organizationName?: string;
  position?: string;
  department?: string;
  province?: string;
  isActive?: boolean;
  hiredAfter?: string;
  hiredBefore?: string;
  managerId?: number;
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: "name" | "position" | "hireDate" | "organization" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// Coordinator statistics
export interface CoordinatorStats {
  totalCoordinators: number;
  activeCoordinators: number;
  coordinatorsByOrganization: OrganizationCoordinatorStats[];
  coordinatorsByDepartment: DepartmentStats[];
  coordinatorsByProvince: ProvinceCoordinatorStats[];
  averageTenure: number; // in months
  recentHires: number; // hired in last 30 days
}

export interface OrganizationCoordinatorStats {
  organizationId: number;
  organizationName: string;
  coordinatorCount: number;
  activeTasks: number;
  completedTasks: number;
  averageTenure: number;
}

export interface DepartmentStats {
  department: string;
  coordinatorCount: number;
  averageTenure: number;
  activeTasksCount: number;
}

export interface ProvinceCoordinatorStats {
  province: string;
  coordinatorCount: number;
  organizationCount: number;
}

// Coordinator task management
export interface CoordinatorTask {
  taskId: number;
  coordinatorId: number;
  eventId?: number;
  eventName?: string;
  taskName: string;
  description?: string;
  dueDate?: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  category?: string;
  estimatedHours?: number;
  actualHours?: number;
  completedAt?: string;
  notes?: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCoordinatorTaskData {
  coordinatorId: number;
  eventId?: number;
  taskName: string;
  description?: string;
  dueDate?: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  category?: string;
  estimatedHours?: number;
}

export interface UpdateCoordinatorTaskData {
  taskId: number;
  taskName?: string;
  description?: string;
  dueDate?: string;
  priority?: "Low" | "Medium" | "High" | "Urgent";
  status?: "Pending" | "In Progress" | "Completed" | "Cancelled";
  category?: string;
  estimatedHours?: number;
  actualHours?: number;
  notes?: string;
}

// Coordinator schedule management
export interface CoordinatorSchedule {
  scheduleId: number;
  coordinatorId: number;
  eventId?: number;
  eventName?: string;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  scheduleType: "Meeting" | "Event" | "Training" | "Other";
  priority: "Low" | "Medium" | "High";
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  isAllDay: boolean;
  reminderMinutes: number;
  notes?: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCoordinatorScheduleData {
  coordinatorId: number;
  eventId?: number;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  scheduleType: "Meeting" | "Event" | "Training" | "Other";
  priority: "Low" | "Medium" | "High";
  isAllDay: boolean;
  reminderMinutes: number;
  notes?: string;
}

export interface UpdateCoordinatorScheduleData {
  scheduleId: number;
  title?: string;
  description?: string;
  startDateTime?: string;
  endDateTime?: string;
  location?: string;
  scheduleType?: "Meeting" | "Event" | "Training" | "Other";
  priority?: "Low" | "Medium" | "High";
  status?: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  isAllDay?: boolean;
  reminderMinutes?: number;
  notes?: string;
}

// Coordinator performance tracking
export interface CoordinatorPerformance {
  coordinatorId: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  averageTaskCompletionTime: number; // in hours
  taskCompletionRate: number; // percentage
  eventsManaged: number;
  volunteersManaged: number;
  performanceRating: number;
  lastPerformanceReview?: string;
  strengths: string[];
  improvementAreas: string[];
  goals: CoordinatorGoal[];
}

export interface CoordinatorGoal {
  goalId: number;
  goalName: string;
  description?: string;
  targetDate?: string;
  status: "Not Started" | "In Progress" | "Completed" | "Cancelled";
  progress: number; // percentage
  measurableMetrics?: string;
  createdAt: string;
  updatedAt: string;
}

// Organization management for coordinators
export interface CoordinatorOrganizationInfo {
  organizationId: number;
  organizationName: string;
  organizationType: string;
  totalCoordinators: number;
  totalEvents: number;
  totalVolunteers: number;
  organizationRating: number;
  isVerified: boolean;
  contactInfo: {
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  coordinatorHierarchy: CoordinatorHierarchy[];
}

export interface CoordinatorHierarchy {
  coordinatorId: number;
  name: string;
  position: string;
  department: string;
  managerId?: number;
  directReports: number;
  level: number;
}

// Export re-exports for convenience
export type {
  CoordinatorProfile,
  UpdateCoordinatorProfileData,
} from "./profiles";
