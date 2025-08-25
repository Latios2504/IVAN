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
  TaskStatus,
  MyTaskAssignmentDto,
} from "../types/onSiteTask";
import {
  DEFAULT_ONSITE_TASK_FILTER,
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
    try {
      const response = await apiClient.get<OnSiteTaskDto>(
        `${this.baseUrl}/get/${id}`
      );
      if (!response.data) {
        throw new Error("On-site task not found");
      }
      return response.data;
    } catch (error: any) {
      console.error("Error fetching on-site task:", error);
      if (error.response?.status === 404) {
        throw new Error(`Task with ID ${id} not found`);
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied. You do not have permission to view this task.');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch task details');
    }
  }

  // POST /api/OnSiteTask/add - Add new on-site task (Coordinator only)
  async createOnSiteTask(taskData: OnSiteTaskInputDto): Promise<OnSiteTaskDto> {
    // Validate input data
    const validation = this.validateTaskData(taskData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    try {
      // Convert dates to proper format
      const formattedData = this.formatTaskDataForApi(taskData);

      const response = await apiClient.post<OnSiteTaskDto>(
        `${this.baseUrl}/add`,
        formattedData
      );
      return response.data!;
    } catch (error: any) {
      console.error("Error creating on-site task:", error);
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Invalid task data provided');
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied. Only coordinators can create tasks.');
      }
      throw new Error(error.response?.data?.message || 'Failed to create task');
    }
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

    try {
      // Convert dates to proper format
      const formattedData = this.formatUpdateTaskDataForApi(taskData);

      const response = await apiClient.put<OnSiteTaskDto>(
        `${this.baseUrl}/update/${id}`,
        formattedData
      );
      return response.data!;
    } catch (error: any) {
      console.error("Error updating on-site task:", error);
      if (error.response?.status === 404) {
        throw new Error(`Task with ID ${id} not found`);
      }
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Invalid task data provided');
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied. Only coordinators can update tasks.');
      }
      throw new Error(error.response?.data?.message || 'Failed to update task');
    }
  }

  // DELETE /api/OnSiteTask/delete/{id} - Delete on-site task (Coordinator only)
  async deleteOnSiteTask(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`${this.baseUrl}/delete/${id}`);
      return true;
    } catch (error: any) {
      console.error("Error deleting on-site task:", error);
      if (error.response?.status === 404) {
        throw new Error(`Task with ID ${id} not found`);
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied. Only coordinators can delete tasks.');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Cannot delete task. It may have active assignments.');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
  }

  // === TASK ASSIGNMENT OPERATIONS ===

  // PUT /api/OnSiteTask/{id}/assignAll - Assign all volunteers to task (Coordinator only)
  async assignAllVolunteersToTask(id: number): Promise<any> {
    const response = await apiClient.put(`${this.baseUrl}/${id}/assignAll`);
    return response.data;
  }

  // PUT /api/OnSiteTask/{id}/assign/{volunteerId} - Assign specific volunteer to task (Coordinator only)
  async assignVolunteerToTask(taskId: number, volunteerId: number): Promise<any> {
    const response = await apiClient.put(`${this.baseUrl}/${taskId}/assign/${volunteerId}`);
    return response.data;
  }

  // DELETE /api/OnSiteTask/{id}/unassign/{volunteerId} - Unassign volunteer from task (Coordinator only)
  async unassignVolunteerFromTask(taskId: number, volunteerId: number): Promise<boolean> {
    try {
      await apiClient.delete(`${this.baseUrl}/${taskId}/unassign/${volunteerId}`);
      return true;
    } catch (error) {
      console.error("Error unassigning volunteer from task:", error);
      return false;
    }
  }

  // PUT /api/OnSiteTask/{id}/start/{volunteerId} - Start task for specific volunteer
  async startTaskForVolunteer(taskId: number, volunteerId: number): Promise<any> {
    const response = await apiClient.put(`${this.baseUrl}/${taskId}/start/${volunteerId}`);
    return response.data;
  }

  // PUT /api/OnSiteTask/{id}/complete/{volunteerId} - Complete task for specific volunteer
  async completeTaskForVolunteer(taskId: number, volunteerId: number): Promise<any> {
    const response = await apiClient.put(`${this.baseUrl}/${taskId}/complete/${volunteerId}`);
    return response.data;
  }

  // PUT /api/OnSiteTask/{id}/startAll - Start all assignments for task (Coordinator only)
  async startAllTaskAssignments(id: number): Promise<any> {
    const response = await apiClient.put(`${this.baseUrl}/${id}/startAll`);
    return response.data;
  }

  // PUT /api/OnSiteTask/{id}/completeAll - Complete all assignments for task (Coordinator only)
  async completeAllTaskAssignments(id: number): Promise<any> {
    const response = await apiClient.put(`${this.baseUrl}/${id}/completeAll`);
    return response.data;
  }

  // GET /api/OnSiteTask/my-tasks - Get tasks assigned to current volunteer
  async getMyTasks(eventId?: number): Promise<any[]> {
    const params = eventId ? `?eventId=${eventId}` : '';
    const response = await apiClient.get<any[]>(`${this.baseUrl}/my-tasks${params}`);
    return response.data || [];
  }

  // GET /api/OnSiteTask/my-tasks - Get task assignments for current volunteer with full task details
  async getMyTaskAssignments(eventId?: number): Promise<MyTaskAssignmentDto[]> {
    const params = eventId ? `?eventId=${eventId}` : '';
    const response = await apiClient.get<MyTaskAssignmentDto[]>(`${this.baseUrl}/my-tasks${params}`);
    return response.data || [];
  }

  // PUT /api/OnSiteTask/{taskId}/start - Start task for current volunteer
  async startTask(taskId: number): Promise<any> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${taskId}/start`);
      return response.data;
    } catch (error: any) {
      console.error('Error starting task:', error);
      if (error.response?.status === 404) {
        throw new Error(`Task with ID ${taskId} not found`);
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied. You are not assigned to this task.');
      }
      throw new Error(error.response?.data?.message || 'Failed to start task');
    }
  }

  // PUT /api/OnSiteTask/{taskId}/complete - Complete task for current volunteer
  async completeTask(taskId: number, actualHours?: number, notes?: string): Promise<any> {
    try {
      const payload: any = {};
      if (actualHours !== undefined) payload.actualHours = actualHours;
      if (notes) payload.notes = notes;
      
      const response = await apiClient.put(`${this.baseUrl}/${taskId}/complete`, payload);
      return response.data;
    } catch (error: any) {
      console.error('Error completing task:', error);
      if (error.response?.status === 404) {
        throw new Error(`Task with ID ${taskId} not found`);
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied. You are not assigned to this task.');
      }
      throw new Error(error.response?.data?.message || 'Failed to complete task');
    }
  }

  // === FILTERING AND SEARCH ===
  
  // Get all tasks with filtering support
  async getAll(filter: OnSiteTaskFilterDto = {}): Promise<PagedResultDto<OnSiteTaskDto>> {
    const params = new URLSearchParams();
    
    // Add pagination parameters
    if (filter.pageNumber) params.append('pageNumber', filter.pageNumber.toString());
    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());
    
    // Add filter parameters
    if (filter.eventId) params.append('eventId', filter.eventId.toString());
    if (filter.categoryId) params.append('categoryId', filter.categoryId.toString());
    if (filter.statusId) params.append('statusId', filter.statusId.toString());
    if (filter.startDateFrom) params.append('startTimeFrom', new Date(filter.startDateFrom).toISOString());
    if (filter.startDateTo) params.append('startTimeTo', new Date(filter.startDateTo).toISOString());
    if (filter.endDateFrom) params.append('endTimeFrom', new Date(filter.endDateFrom).toISOString());
    if (filter.endDateTo) params.append('endTimeTo', new Date(filter.endDateTo).toISOString());
    if (filter.search) params.append('searchTerm', filter.search);
    
    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    try {
      const response = await apiClient.get<PagedResultDto<OnSiteTaskDto>>(url);
      return response.data!;
    } catch (error: any) {
      console.error('Error fetching tasks with filter:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }

  // Note: Backend controller doesn't have task assignments endpoint
   // Assignment data would need to be retrieved through other means

  // === UTILITY METHODS ===
  // Note: Backend controller doesn't have task statistics endpoint
  // This would need to be implemented in OnSiteTaskController if required

  // === VALIDATION METHODS ===

  // Validate task input data - matches backend OnSiteTaskInputModel
  validateTaskData(data: OnSiteTaskInputDto): OnSiteTaskValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation - based on backend model
    if (!data.taskName?.trim()) {
      errors.push("Task name is required");
    }
    if (!data.eventId) {
      errors.push("Event ID is required");
    }
    if (!data.categoryId) {
      errors.push("Category ID is required");
    }
    // Note: statusId is not required for input - backend auto-sets to 4 (On Hold)

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
    // Note: assignedVolunteers is not part of input model - handled by assignment operations

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Validate task update data - matches backend OnSiteTaskUpdateModel
  validateUpdateTaskData(
    data: OnSiteTaskUpdateDto
  ): OnSiteTaskValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Task name validation (optional for update)
    if (data.taskName !== undefined && !data.taskName?.trim()) {
      errors.push("Task name cannot be empty");
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
    if (data.actualHours !== undefined && data.actualHours < 0) {
      errors.push("Actual hours cannot be negative");
    }

    // Volunteer count validation
    if (data.requiredVolunteers !== undefined && data.requiredVolunteers < 0) {
      errors.push("Required volunteers cannot be negative");
    }
    // Note: assignedVolunteers is not part of update model - handled by assignment operations

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // === HELPER METHODS ===

  // Format task data for API (handle .NET JSON serialization) - matches backend OnSiteTaskInputModel
  private formatTaskDataForApi(data: OnSiteTaskInputDto): any {
    return {
      taskName: data.taskName,
      description: data.description || null,
      eventId: data.eventId,
      categoryId: data.categoryId,
      startTime: data.startTime ? new Date(data.startTime).toISOString() : null,
      endTime: data.endTime ? new Date(data.endTime).toISOString() : null,
      location: data.location || null,
      requiredVolunteers: data.requiredVolunteers || 0,
      requiredSkills: data.requiredSkills || null,
      instructions: data.instructions || null,
      materials: data.materials || null,
      safetyRequirements: data.safetyRequirements || null,
      completionCriteria: data.completionCriteria || null,
      notes: data.notes || null
      // Note: Backend auto-sets StatusId to 4 (On Hold), CreatedAt, UpdatedAt, EstimatedHours
    };
  }

  // Format update task data for API - matches backend OnSiteTaskUpdateModel
  private formatUpdateTaskDataForApi(data: OnSiteTaskUpdateDto): any {
    const formatted: any = {};
    
    // Only include fields that are provided (partial update)
    if (data.taskName !== undefined) formatted.taskName = data.taskName;
    if (data.description !== undefined) formatted.description = data.description;
    if (data.eventId !== undefined) formatted.eventId = data.eventId;
    if (data.categoryId !== undefined) formatted.categoryId = data.categoryId;
    if (data.startTime !== undefined) {
      formatted.startTime = data.startTime ? new Date(data.startTime).toISOString() : null;
    }
    if (data.endTime !== undefined) {
      formatted.endTime = data.endTime ? new Date(data.endTime).toISOString() : null;
    }
    if (data.location !== undefined) formatted.location = data.location;
    if (data.requiredVolunteers !== undefined) formatted.requiredVolunteers = data.requiredVolunteers;
    if (data.requiredSkills !== undefined) formatted.requiredSkills = data.requiredSkills;
    if (data.instructions !== undefined) formatted.instructions = data.instructions;
    if (data.materials !== undefined) formatted.materials = data.materials;
    if (data.safetyRequirements !== undefined) formatted.safetyRequirements = data.safetyRequirements;
    if (data.completionCriteria !== undefined) formatted.completionCriteria = data.completionCriteria;
    if (data.notes !== undefined) formatted.notes = data.notes;
    if (data.actualHours !== undefined) formatted.actualHours = data.actualHours;
    
    return formatted;
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

  // Note: getPriorityColor and getDifficultyColor methods removed
  // Backend doesn't support priority and difficulty fields

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
