// OnSite Task Service - Matching backend OnSiteTaskController
import { apiClient } from "./apiClient";
import type { PagedResultDto } from "../types/common";
import type {
  OnSiteTaskDto,
  OnSiteTaskInputDto,
  OnSiteTaskUpdateDto,
  OnSiteTaskFilterDto,
  OnSiteTaskStatsDto,
  OnSiteTaskValidationResult,
  TaskPriority,
  TaskDifficulty,
  TaskStatus,
} from "../types/onSiteTask";
import {
  DEFAULT_ONSITE_TASK_FILTER,
  TASK_PRIORITY_OPTIONS,
  TASK_DIFFICULTY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from "../types/onSiteTask";

class OnSiteTaskService {
  private readonly baseUrl = "/OnSiteTask";

  // === CRUD OPERATIONS ===

  // GET /api/OnSiteTask - Get list of on-site tasks with pagination
  async getOnSiteTasks(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PagedResultDto<OnSiteTaskDto>> {
    const response = await apiClient.get<PagedResultDto<OnSiteTaskDto>>(
      `${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data!;
  }

  // GET /api/OnSiteTask/get/{id} - Get on-site task details by ID
  async getOnSiteTaskById(id: number): Promise<OnSiteTaskDto> {
    const response = await apiClient.get<OnSiteTaskDto>(
      `${this.baseUrl}/get/${id}`
    );
    if (!response.data) {
      throw new Error("On-site task not found");
    }
    return response.data;
  }

  // POST /api/OnSiteTask/add - Add new on-site task (Coordinator only)
  async createOnSiteTask(taskData: OnSiteTaskInputDto): Promise<OnSiteTaskDto> {
    // Validate input data
    const validation = this.validateTaskData(taskData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    // Convert dates to proper format
    const formattedData = this.formatTaskDataForApi(taskData);

    const response = await apiClient.post<OnSiteTaskDto>(
      `${this.baseUrl}/add`,
      formattedData
    );
    return response.data!;
  }

  // PUT /api/OnSiteTask/update/{id} - Update on-site task (Coordinator only)
  async updateOnSiteTask(
    id: number,
    taskData: OnSiteTaskUpdateDto
  ): Promise<OnSiteTaskDto> {
    // Validate input data
    const validation = this.validateUpdateTaskData(taskData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    // Convert dates to proper format
    const formattedData = this.formatUpdateTaskDataForApi(taskData);

    const response = await apiClient.put<OnSiteTaskDto>(
      `${this.baseUrl}/update/${id}`,
      formattedData
    );
    return response.data!;
  }

  // DELETE /api/OnSiteTask/{id} - Delete on-site task (if endpoint exists)
  async deleteOnSiteTask(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting on-site task:", error);
      return false;
    }
  }

  // === FILTERING AND SEARCH ===

  // Get filtered list of on-site tasks
  async getFilteredOnSiteTasks(
    filter: OnSiteTaskFilterDto = DEFAULT_ONSITE_TASK_FILTER
  ): Promise<PagedResultDto<OnSiteTaskDto>> {
    const params = new URLSearchParams();

    // Add pagination
    params.append("pageNumber", (filter.pageNumber || 1).toString());
    params.append("pageSize", (filter.pageSize || 10).toString());

    // Add filters
    if (filter.eventId) params.append("eventId", filter.eventId.toString());
    if (filter.categoryId)
      params.append("categoryId", filter.categoryId.toString());
    if (filter.statusId) params.append("statusId", filter.statusId.toString());
    if (filter.priority) params.append("priority", filter.priority);
    if (filter.difficulty) params.append("difficulty", filter.difficulty);
    if (filter.search) params.append("search", filter.search);
    if (filter.startDateFrom)
      params.append("startDateFrom", filter.startDateFrom);
    if (filter.startDateTo) params.append("startDateTo", filter.startDateTo);
    if (filter.endDateFrom) params.append("endDateFrom", filter.endDateFrom);
    if (filter.endDateTo) params.append("endDateTo", filter.endDateTo);
    if (filter.sortBy) params.append("sortBy", filter.sortBy);
    if (filter.sortDirection)
      params.append("sortDirection", filter.sortDirection);

    const response = await apiClient.get<PagedResultDto<OnSiteTaskDto>>(
      `${this.baseUrl}?${params.toString()}`
    );
    return response.data!;
  }

  // === UTILITY METHODS ===

  // Get task statistics (mock implementation since no backend endpoint exists)
  async getTaskStats(
    eventId?: number,
    categoryId?: number,
    startDate?: string,
    endDate?: string
  ): Promise<OnSiteTaskStatsDto> {
    // This would need to be implemented in the backend
    // For now, return mock data or derive from existing tasks
    return {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      pendingTasks: 0,
      overdueTasks: 0,
      tasksByStatus: [],
      tasksByPriority: [],
      tasksByDifficulty: [],
      tasksByCategory: [],
      averageCompletionTime: 0,
      volunteerUtilization: 0,
    };
  }

  // === VALIDATION METHODS ===

  // Validate task input data
  validateTaskData(data: OnSiteTaskInputDto): OnSiteTaskValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!data.taskName?.trim()) {
      errors.push("Task name is required");
    }
    if (!data.eventId) {
      errors.push("Event ID is required");
    }
    if (!data.categoryId) {
      errors.push("Category ID is required");
    }
    if (!data.statusId) {
      errors.push("Status ID is required");
    }

    // Date validation
    if (data.startTime && data.endTime) {
      const startDate = new Date(data.startTime);
      const endDate = new Date(data.endTime);
      if (startDate >= endDate) {
        errors.push("End time must be after start time");
      }
    }

    // Volunteer count validation
    if (data.requiredVolunteers && data.requiredVolunteers < 0) {
      errors.push("Required volunteers cannot be negative");
    }
    if (data.assignedVolunteers && data.assignedVolunteers < 0) {
      errors.push("Assigned volunteers cannot be negative");
    }
    if (
      data.requiredVolunteers &&
      data.assignedVolunteers &&
      data.assignedVolunteers > data.requiredVolunteers
    ) {
      warnings.push("Assigned volunteers exceed required volunteers");
    }

    // Priority validation
    if (
      data.priority &&
      !TASK_PRIORITY_OPTIONS.some((p) => p.value === data.priority)
    ) {
      errors.push("Invalid priority value");
    }

    // Difficulty validation
    if (
      data.difficulty &&
      !TASK_DIFFICULTY_OPTIONS.some((d) => d.value === data.difficulty)
    ) {
      errors.push("Invalid difficulty value");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Validate task update data
  validateUpdateTaskData(
    data: OnSiteTaskUpdateDto
  ): OnSiteTaskValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!data.taskName?.trim()) {
      errors.push("Task name is required");
    }
    if (!data.eventId) {
      errors.push("Event ID is required");
    }
    if (!data.categoryId) {
      errors.push("Category ID is required");
    }
    if (!data.statusId) {
      errors.push("Status ID is required");
    }

    // Date validation
    if (data.startTime && data.endTime) {
      const startDate = new Date(data.startTime);
      const endDate = new Date(data.endTime);
      if (startDate >= endDate) {
        errors.push("End time must be after start time");
      }
    }

    // Hours validation
    if (data.actualHours && data.actualHours < 0) {
      errors.push("Actual hours cannot be negative");
    }

    // Volunteer count validation
    if (data.requiredVolunteers && data.requiredVolunteers < 0) {
      errors.push("Required volunteers cannot be negative");
    }
    if (data.assignedVolunteers && data.assignedVolunteers < 0) {
      errors.push("Assigned volunteers cannot be negative");
    }
    if (
      data.requiredVolunteers &&
      data.assignedVolunteers &&
      data.assignedVolunteers > data.requiredVolunteers
    ) {
      warnings.push("Assigned volunteers exceed required volunteers");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // === HELPER METHODS ===

  // Format task data for API (handle .NET JSON serialization)
  private formatTaskDataForApi(data: OnSiteTaskInputDto): any {
    return {
      ...data,
      startTime: data.startTime ? new Date(data.startTime).toISOString() : null,
      endTime: data.endTime ? new Date(data.endTime).toISOString() : null,
    };
  }

  // Format update task data for API
  private formatUpdateTaskDataForApi(data: OnSiteTaskUpdateDto): any {
    return {
      ...data,
      startTime: data.startTime ? new Date(data.startTime).toISOString() : null,
      endTime: data.endTime ? new Date(data.endTime).toISOString() : null,
    };
  }

  // Format task date for display
  formatTaskDate(dateString?: string): string {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleString();
  }

  // Get task duration in hours
  getTaskDuration(startTime?: string, endTime?: string): number {
    if (!startTime || !endTime) return 0;
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }

  // Check if task is overdue
  isTaskOverdue(endTime?: string, statusId?: number): boolean {
    if (!endTime) return false;
    const end = new Date(endTime);
    const now = new Date();
    // Task is overdue if end time has passed and status is not completed (assuming statusId 3 is completed)
    return end < now && statusId !== 3;
  }

  // Check if task is upcoming
  isTaskUpcoming(startTime?: string): boolean {
    if (!startTime) return false;
    const start = new Date(startTime);
    const now = new Date();
    return start > now;
  }

  // Get priority color class
  getPriorityColor(priority?: string): string {
    const priorityOption = TASK_PRIORITY_OPTIONS.find(
      (p) => p.value === priority
    );
    return priorityOption?.color || "bg-gray-100 text-gray-800";
  }

  // Get difficulty color class
  getDifficultyColor(difficulty?: string): string {
    const difficultyOption = TASK_DIFFICULTY_OPTIONS.find(
      (d) => d.value === difficulty
    );
    return difficultyOption?.color || "bg-gray-100 text-gray-800";
  }

  // Get status color class
  getStatusColor(statusId?: number): string {
    const statusOption = TASK_STATUS_OPTIONS.find((s) => s.value === statusId);
    return statusOption?.color || "bg-gray-100 text-gray-800";
  }

  // Get status label
  getStatusLabel(statusId?: number): string {
    const statusOption = TASK_STATUS_OPTIONS.find((s) => s.value === statusId);
    return statusOption?.label || "Unknown";
  }

  // Calculate completion percentage
  getCompletionPercentage(task: OnSiteTaskDto): number {
    if (task.statusId === 3) return 100; // Completed
    if (task.statusId === 4) return 0; // Cancelled
    if (task.statusId === 2) return 50; // In Progress
    return 0; // Pending or other statuses
  }

  // Get volunteer utilization percentage
  getVolunteerUtilization(required?: number, assigned?: number): number {
    if (!required || required === 0) return 0;
    if (!assigned) return 0;
    return Math.min((assigned / required) * 100, 100);
  }

  // Format duration for display
  formatDuration(hours: number): string {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    }
    if (hours === 1) {
      return "1 hour";
    }
    return `${hours.toFixed(1)} hours`;
  }

  // Check if task can be edited (based on status)
  canEditTask(statusId?: number): boolean {
    // Assuming tasks can be edited if not completed (3) or cancelled (4)
    return statusId !== 3 && statusId !== 4;
  }

  // Check if task can be deleted (based on status)
  canDeleteTask(statusId?: number): boolean {
    // Assuming tasks can be deleted if pending (1) or on hold (5)
    return statusId === 1 || statusId === 5;
  }
}

// Export singleton instance
export const onSiteTaskService = new OnSiteTaskService();
export default onSiteTaskService;

// Export class for testing
export { OnSiteTaskService };
